# StudentLink performance audit — 18 November 2026

## Scope

Reviewed the current `main` source tree, the application shell, bootstrap loader, CSS and JavaScript assets, service worker, feed/status/messaging code, Supabase schema and live project metadata. Work is isolated on `performance/site-wide-optimization-2026-11-18`; production `main` and the live database schema have not been changed.

This is a source and database-statistics audit, not a Lighthouse run or a real-device benchmark. The Supabase statistics are cumulative and must not be treated as a direct measurement of page-load time.

## Implemented on this branch

1. Removed the full games JavaScript (~59 KB) and games-only stylesheet from the initial app shell. A lightweight loader now fetches them only when the Games view or an invited game is opened. The service worker caches those assets on first use so previously opened games can still work offline.
2. Replaced the comments modal's one-profile-query-per-comment pattern with one batched profile query for all unique comment authors.
3. Kept game loading retry-safe by retaining successful asset-load promises and retrying only failed resources.
4. Added shared client-side image optimisation for large JPEG/PNG/WebP post and status uploads: downscale to a maximum 1,600-pixel edge, encode as WebP at quality 0.82, and keep the original whenever conversion is unsupported or would increase file size. Video uploads are unchanged.
5. Set a long browser cache lifetime for uniquely named post-image objects; status media retains its short cache lifetime because statuses expire.

6. Increased the background unread-conversation fallback poll from 15 seconds to 60 seconds. Realtime remains the primary update mechanism; foreground/focus refreshes remain in place. This reduces redundant polling while retaining a periodic recovery path.
7. Scoped friendship realtime subscriptions to rows where the signed-in user is either participant, rather than receiving every friendship event in the project.
8. Coalesced bursts of message realtime events into a short queued refresh so rapid incoming messages do not each trigger a separate conversation-summary/profile refresh.
9. Changed the static school-directory fetch from `cache: 'no-store'` to normal browser caching. The service worker already includes the directory in its app shell, so this avoids explicitly bypassing the browser HTTP cache.
10. Updated the affected asset query versions and bumped the service-worker shell cache through `studentlink-shell-v98` so installed clients can receive the changed assets.

## Source findings

### Startup and assets

- The shell loads six feature stylesheets and a startup stylesheet for every authenticated view. `assets/css/base.css` is approximately 98 KB / 1,442 lines.
- The bootstrap loads eight classic JavaScript files in a fixed order. The largest are `games.js` (~59 KB), `core.js` (~55 KB), `messages.js` (~30 KB), `profile.js` (~29 KB), and `notifications.js` (~23 KB).
- The classic scripts share global functions/state. Blindly changing script order or converting them to ES modules would be risky.
- The app shell preloads the application scripts and Supabase client. This may compete for bandwidth on slow connections; a controlled startup waterfall measurement should determine whether to keep, remove, or selectively prioritize these preloads.
- The service worker precaches the shell and uses a stale-while-revalidate-style strategy for same-origin navigation and app-shell assets. This supports repeat visits, but its install-time `cache.addAll` means all shell assets must be reachable for an update to install successfully.

### Feed, media and status

- The comments modal previously made one profiles query per comment; this has now been replaced with one batched query for unique authors.
- The feed requests up to 40 posts, then separately fetches profiles, likes, the current user's likes, comments and poll votes. The likes/comments queries fetch row IDs for aggregation in the browser instead of returning grouped counts. This becomes increasingly expensive as engagement grows; replace with a carefully secured aggregate RPC or view after regression tests.
- Comment rendering performs a separate profile lookup for each comment (N+1 query pattern). Batch profile IDs into one query.
- Post images already use lazy loading. Large post and status images are now resized and converted to WebP before upload where supported; the original is retained if compression fails or does not reduce size. Profile photos already use a separate 640-pixel canvas resize path.
- Status refresh can fetch up to 1,000 active rows and signs media URLs in batches of 100. This can create a large response and multiple storage requests for users with many active statuses. A better long-term design is a bounded, friend-scoped status query plus on-demand signing/loading, while preserving all story items users are expected to see.
- Status thumbnails already lazy-load photos; video thumbnails use metadata preload and should be checked for unnecessary network work on a real device.

### Messaging and realtime

- The unread fallback polling change is implemented as above.
- The single global realtime channel still listens for all posts, all post likes and all message inserts. Friendship subscriptions are now filtered to the signed-in user's rows. The remaining global subscriptions can receive irrelevant events; scope them where possible or route per-user refreshes through user-filtered notifications. Do not remove a realtime listener until equivalent delivery is verified with two accounts.
- A message event currently reloads the conversation summary list. This can cause repeated summary/profile queries during busy periods. Consider updating only the affected conversation or coalescing refreshes.
- Conversation messages are paginated when older messages are requested, which is good. Signed URLs for attachments are batched.

### Supabase live project observations

- The connected StudentLink database is active and currently about 15 MB. Main application tables are still small (for example, 20 profiles, 8 posts, 146 messages, 99 notifications, and 6 statuses at the time of inspection). This does not suggest raw database size is currently the primary cause of slowness.
- Supabase performance advisors returned 17 unused-index notices. These indexes should **not** be dropped based on this snapshot: the dataset is small, some features are new, and indexes may only be used under less common queries.
- Cumulative `pg_stat_statements` data included about 444,705 calls to the Realtime `realtime.list_changes` query (mean about 4.86 ms), 3,692 calls to `studentlink_conversation_summaries` (mean about 8.79 ms), and 4,861 message-list calls (mean about 1.52 ms). These are lifetime/cumulative database statistics, not browser timings. They support investigating realtime fan-out and redundant summary refreshes, but do not prove that any single query is the user's main delay.
- The database has several existing indexes and RLS optimisations. Avoid adding or removing indexes without representative `EXPLAIN (ANALYZE, BUFFERS)` plans and realistic data.

## Recommended next fixes (not yet applied)

1. Add performance marks and collect real mobile measurements: cold load, warm load, first content, usable feed, and route changes on a low-end Android / throttled 3G profile.
2. Lazy-load the games module when the Games view is first opened. This needs a dependency check and direct-link/invite regression tests because the current scripts share globals and load in a fixed order.
3. Batch comment-author lookups and replace browser-side likes/comments row aggregation with one aggregate database function or view.
4. Scope realtime subscriptions to the signed-in user or currently relevant entities. Test incoming/outgoing friend requests, messages, likes and feed updates with two independent accounts before removing broad listeners.
5. Compress and resize post/status images before upload; generate small thumbnails and serve appropriately sized media. Keep original media only where needed.
6. Review status retrieval and signed URL generation so inactive/unrelated users' media is not fetched or signed.
7. Split feature CSS after measuring the impact, and remove duplicate/overridden rules only after computed-style and screenshot regression checks.
8. Reduce unnecessary DOM rebuilding and further coalesce duplicate refreshes. Message-event refresh coalescing is now in place; avoid polling the whole conversation list after every individual message event.
9. Verify service-worker install/update behavior on both GitHub Pages and Netlify, including existing installed clients and offline launch.
10. Run browser-level tests for sign-in, feed, polls, statuses, messages/attachments, notifications and multiplayer games before merging.

## Verification and limits

- Confirmed the changed source strings, asset-version references and service-worker cache version are consistent on this branch.
- The live Supabase performance advisor and read-only database statistics were inspected.
- No live SQL/schema change was made.
- No Lighthouse/browser/device benchmark was available in this run. Do not claim a measured speed percentage or guaranteed improvement until those tests are run.
- No unrelated feature code was intentionally changed.
