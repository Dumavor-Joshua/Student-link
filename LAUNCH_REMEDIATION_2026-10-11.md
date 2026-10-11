# StudentLink launch-readiness remediation — 11 October 2026

## Changes in this branch

### 1. Mobile-compatible foreground notifications
- Replaced direct-first `new Notification(...)` with `ServiceWorkerRegistration.showNotification(...)` when the service worker is available.
- Avoids falling back to the Notification constructor on mobile browsers and standalone installed web apps, where that constructor is unsupported or unreliable.
- Keeps a desktop fallback for browsers without a usable service-worker notification registration.
- Uses StudentLink's versioned icon assets and non-renotify options.

### 2. Context-aware notification clicks
- Friend-request alerts open the Friends view.
- Incoming-message alerts include the conversation ID and open that conversation.
- Avoids producing an incoming-message sound when the user is already viewing that same conversation in a visible tab.

### 3. Server-enforced blocking
Added `supabase/migrations/20261011_enforce_blocks_on_contact.sql`:
- Reuses the existing `is_blocked_between` security-definer helper, which already limits checks to relationships involving the signed-in caller.
- Does not add another callable helper or change existing helper grants.
- Rejects friend requests involving a block in either direction.
- Rejects accepting a pending request when a block exists.
- Rejects creation of new conversations when either participant has blocked the other.
- Rejects new messages in existing conversations when either participant has blocked the other.
- Keeps existing conversation history available rather than silently deleting messages.

### 4. Database policy hardening
- Added a migration that enforces the existing caller-scoped block-check helper across friend requests, accepting requests, new conversations, and sending messages.
- Added a migration that rewrites notification and push-subscription RLS identity checks as scalar subqueries, addressing the four policy-performance warnings reported by Supabase's advisor without changing row ownership rules.

### 5. Cache invalidation
- Bumped the application asset version to `studentlink-mobile-fix-49`.
- Bumped the service-worker shell cache to `studentlink-shell-v49`.
- Keeps the HTML and service worker asset versions aligned so devices do not continue serving the old notification helper from cache.

### 6. Regression coverage and documentation
- Added static regression assertions for service-worker notifications, mobile fallback behaviour, notification deep links, cache versions, and block-enforcement SQL.
- Replaced stale game testing instructions with an acceptance checklist covering the current six-game library, security, blocking, notification delivery, PWA install, mobile layouts, and release operations.
- Updated README documentation for the migration and notification behaviour.

## Verification status

The source changes and regression assertions are committed on the `launch-readiness-hardening` branch. GitHub Actions run 512 passed both `node --check assets/app.js` and `node scripts/check-project.mjs`. The Netlify deploy preview also reports success. The two database migrations were applied to the connected StudentLink Supabase project as `20261011144448 studentlink_enforce_blocks_on_contact` and `20261011144453 studentlink_optimize_notification_rls`; I queried `pg_policies` afterward and confirmed the block conditions and optimized ownership predicates are present. This verifies schema state, not a real two-account behavioural test or live-device push delivery.

Still requires live verification:
1. Run `node scripts/check-project.mjs` in a clean checkout and resolve any assertion failures.
2. Verify blocked contact using two test accounts; the policy migration is already applied to the connected Supabase project.
3. Confirm the migration's helper and policy behaviour with the actual deployed database schema and existing policies.
4. Test push delivery with a real server-side Web Push sender, including app-open, background, and fully closed states on target Android/iOS devices.
5. Confirm the production URL, deployed commit, Supabase redirect URLs, VAPID public configuration, server-side private-key configuration, and any edge/function sender deployment.
6. Enable leaked-password protection in Supabase Auth (the advisor still reports it disabled). Complete privacy/community rules, moderator response workflow, and a documented deletion/retention process before broad student access.

## Deployment safety

The two policy migrations have been applied to the connected Supabase project and verified by inspecting the resulting policies. The frontend changes are still on the pull request branch; merge and production deployment remain separate from the database migration. Real-device notification delivery and two-account contact tests are still outstanding.
