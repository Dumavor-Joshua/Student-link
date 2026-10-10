# StudentLink Master Audit Report — 10 October 2026

## Executive summary

This audit inspected the current GitHub source, Supabase schema/advisors, existing regression checks, and the configured Netlify site's latest published deploy. It applied a focused security/performance migration and refreshed the game-library interface. It did **not** treat static inspection as proof of full end-to-end functionality.

## Changes made

### GitHub

- Refreshed the game library as an accessible responsive card grid with clearer descriptions and explicit SOLO/MULTIPLAYER labels.
- Kept all six existing game routes visible: online Tic-Tac-Toe, online Connect Four, online Rock Paper Scissors, Student Quiz, Number Guess, and Word Scramble.
- Added keyboard focus styling, mobile layout adjustments, reduced-motion support, and visual hierarchy for the games page.
- Bumped the app, stylesheet, and service-worker cache versions together to reduce stale-code issues after deployment.
- Added `supabase/migrations/20261010_harden_notification_rpc_and_indexes.sql`.
- Updated project documentation and regression assertions to reflect the real game status, reward-system pause, and cache versioning.

### Supabase

Applied migration `harden_notification_rpc_and_indexes` to project `fpdcetkvxdryogtvldax`.

- Revoked direct EXECUTE permissions for `anon` and `authenticated` on the three notification trigger-only functions: `studentlink_record_friend_request_notification()`, `studentlink_record_message_notification()`, and `studentlink_send_friend_request_push()`.
- Added indexes for `conversation_reads.user_id`, `notifications.actor_id`, and `push_subscriptions.user_id`.

## Verification completed

- Confirmed the migration applied successfully.
- Queried PostgreSQL privileges after migration: all three notification trigger functions report `anon_can_execute = false` and `authenticated_can_execute = false`.
- Queried PostgreSQL catalog and confirmed all three new indexes exist.
- Re-ran Supabase security and performance advisors after the migration.
- The advisor no longer reports the prior three unindexed foreign keys.
- The advisor no longer reports anonymous EXECUTE access for the three notification trigger functions.
- Remaining security warnings include the disabled leaked-password protection setting and several SECURITY DEFINER RPCs intended for signed-in features (including game RPCs and relationship checks). Those require function-by-function authorization review; indiscriminately revoking them would break working features.
- Remaining performance warnings include RLS policies that should wrap `auth.uid()` in a scalar subquery, plus indexes reported unused so far. An index being unused in a low-traffic project is not by itself a reason to drop it.
- Static regression checks were updated in the repository, but were not executed in a Node runtime during this session.
- No real two-account browser test, iPhone Safari test, or live push-notification test was available in this session.

## Reward system decision

Rewards were **not re-enabled**. The repository's current regression test explicitly guards against client-side reward-awarding functions. Client-only scoring can be manipulated and should not mint account-level points or badges. Reintroducing rewards safely requires a server-side scoring/validation path, duplicate-completion prevention, and an auditable rewards ledger; wiring a button to award points would be a security regression.

## Multiplayer games

The code currently exposes three online multiplayer games: Tic-Tac-Toe, Connect Four, and Rock Paper Scissors. Student Quiz, Number Guess, and Word Scramble are solo games. The library now communicates that distinction honestly. No new multiplayer game was added in this pass because a new online game needs its own database state model, authorization rules, RPCs, Realtime flow, and two-account testing; presenting a nonfunctional placeholder as multiplayer would repeat the project's prior usability problem.

## Deployment status — important

The Netlify site found was `https://student-link1.netlify.app`. Its inspected production deploy was `6ac90334592b720008b1eb21`, created from commit `da4d5f8ed79ddbad31e9350050cd3c763ec9113c` and marked ready. That deploy's source was recorded as **API**, not Git continuous deployment. The available Netlify connection supports inspecting projects and deploys but does not expose a create/publish-deploy action, so this session could not publish the new GitHub commits to Netlify. The repository changes are committed, but the Netlify live site must not be described as updated until a new deploy is confirmed.

## Remaining release checklist

1. Connect the Netlify site to this GitHub repository or publish the current main branch through a supported Netlify deploy path.
2. Verify the production deploy references the latest commit and check the app on the real production URL.
3. Run `node scripts/check-project.mjs` in CI/Node and fix any assertion failures.
4. Test sign-up, Google sign-in, feed posts, likes, comments, polls, friend requests, messaging, notification quick replies, push notifications, and profile controls using separate test accounts.
5. Test Tic-Tac-Toe, Connect Four, and Rock Paper Scissors with two accounts and two devices, including leaving/rejoining, stale sessions, and network interruption.
6. Enable Supabase leaked-password protection in Auth settings.
7. Review the remaining SECURITY DEFINER RPCs one at a time and optimize the three flagged RLS policies without changing intended access semantics.
8. Build rewards as a server-validated ledger before enabling points or badges.

## Design references

The UI refresh follows common cross-platform interaction guidance: responsive layouts, readable hierarchy, clear mode labels, visible keyboard focus, reduced-motion support, and mobile-friendly touch targets. References consulted:

- Roblox Creator Hub, adaptive design guidelines: https://create.roblox.com/docs/production/publishing/adaptive-design
- Vercel Labs, Web Interface Guidelines: https://github.com/vercel-labs/web-interface-guidelines
- WANDR, gaming UX design practices (June 2026): https://www.wandr.studio/blog/user-experience-for-gaming-platforms-best-practices
