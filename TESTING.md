# StudentLink release acceptance checklist

Run these tests against a dedicated test Supabase project using two test accounts and non-sensitive data. Do not run destructive tests against production accounts.

## Database and security
- [ ] For a fresh project, follow README.md and apply all required migrations in chronological order.
- [ ] For an existing project, reconcile migration history and live schema; never rerun the base schema blindly.
- [ ] Confirm RLS is enabled on every exposed application table and storage policies enforce ownership/participants.
- [ ] Confirm no service-role or secret key is exposed in browser code or committed.
- [ ] Test direct API requests as the wrong account; hidden UI controls do not count as authorization.
- [ ] Confirm the block-contact migration is applied. After A blocks B, verify B cannot send a new request, accept a pending request, create a conversation, or send a message.
- [ ] Verify the block-check RPC only permits checking relationships involving the caller.
- [ ] Test private message attachments, signed-link expiry, and upload type/size limits.
- [ ] Review password protection, redirect allow-list, auth rate limits, and storage settings.

## Authentication and accounts
- [ ] Signup, email confirmation, login, logout, session refresh, and expired sessions.
- [ ] Google login for new/existing accounts when enabled.
- [ ] Real password-reset email link on the deployed origin, password change, and re-login.
- [ ] Invalid credentials, expired reset link, duplicate nickname, and network-failure messages.
- [ ] Profile deactivation, hidden activity, blocked writes, and profile restoration.
- [ ] Clear user-facing distinction between reversible deactivation and permanent deletion.

## Feed, profiles, schools, and polls
- [ ] Create a text post, refresh, and confirm it appears once.
- [ ] Upload allowed images; reject oversized/unsupported files.
- [ ] Like/unlike, comment, and delete own post; verify from a second account.
- [ ] Attempt to alter/delete another user's post directly; database must reject it.
- [ ] Create a poll, vote, refresh, and verify counts; duplicate and out-of-range votes must fail.
- [ ] Edit profile fields/photo and verify persistence.
- [ ] Test school aliases, typos, manual school names, and similarly named SHS/SHTS schools.
- [ ] Confirm school names are not presented as proof of identity or attendance.
- [ ] Test empty feeds, empty search, upload failures, and slow/offline recovery.

## Friendships, blocking, and messaging
- [ ] A sends B a friend request; B accepts; both see the correct state.
- [ ] Test duplicate/declined requests and requests involving blocked users.
- [ ] Exchange messages in both directions using two accounts.
- [ ] Verify realtime messages appear once and persist after refresh.
- [ ] Verify unread counts and read cursors across refresh and devices.
- [ ] A non-participant cannot read a conversation or download attachments by guessing IDs.
- [ ] Block a participant; new contact is denied in both directions, and existing history follows documented retention behaviour.
- [ ] Test long messages, repeated sends, failed sends, attachment errors, and leaving/re-entering Messages.
- [ ] Confirm realtime channels are cleaned up when leaving a view/game.

## Notifications and PWA
- [ ] Enable notification permission from a user gesture and confirm a valid PushSubscription is saved.
- [ ] With the app open, verify friend-request and incoming-message alerts without duplicates or stale history.
- [ ] Confirm mobile uses ServiceWorkerRegistration.showNotification rather than the mobile-incompatible Notification constructor.
- [ ] Test real server-sent push with app open, backgrounded, and fully closed. Foreground events do not prove background delivery.
- [ ] Tap notification and Reply action; confirm StudentLink opens the correct conversation and focuses the composer.
- [ ] Verify sound, vibration, badge clearing, dismissal, and duplicate suppression on target devices.
- [ ] Verify server-side push sender works and VAPID private keys never reach browser code.
- [ ] Install from a supported browser, launch from Home Screen, and test updates/cache refresh.
- [ ] Test Android and installed iOS/iPadOS web apps separately if supported.

## Games
- [ ] Tic-Tac-Toe: two accounts, turns, win/draw, restart, leave, rejoin.
- [ ] Connect Four: legal moves, full columns, win/draw, turn order, leave, stale lobby.
- [ ] Rock Paper Scissors: simultaneous choices, scoring, next round, leave, computer mode.
- [ ] Student Quiz: all 15 sets, feedback, score, progression, restart.
- [ ] Number Guess: bounds, invalid input, attempts, result, reset.
- [ ] Word Scramble: normalized answers, wrong/correct answers, next word, reset.
- [ ] Forged/out-of-turn multiplayer RPC moves are rejected server-side.
- [ ] Abandoned games and channels do not leave stale UI or leak resources.

## Responsive design, accessibility, reliability
- [ ] Test 320, 360, 390, 414, 768 px and desktop widths.
- [ ] Test Android Chrome and another supported browser; iOS Safari if in scope.
- [ ] Check notification panels, chat, comments, dialogs, and navigation for overlap/close issues.
- [ ] Keyboard-only navigation, focus states, modal focus, labels, status announcements.
- [ ] Reduced-motion preference, cold start, slow network, offline navigation, CDN failure, expired session, and reconnect.
- [ ] Inspect console/network and Supabase logs; do not log message bodies, tokens, or unnecessary personal data.

## Release and deployment
- [ ] Confirm canonical production URL and exact deployed commit.
- [ ] Confirm HTML, CSS, JS, manifest, icons, service worker, and required migrations match the release.
- [ ] Static regression checks pass on the release commit.
- [ ] Live signup, posting, messaging, and notification flows pass with test accounts.
- [ ] Privacy/community rules, reporting workflow, support contact, and data-retention/deletion procedure are published.
- [ ] Assign report review and security-incident responsibilities.
- [ ] Record release commit, date, device/browser coverage, known limitations, and rollback procedure.

A checkbox means the test was actually performed and passed. Static source checks do not count as browser, database, push-delivery, or device verification.
