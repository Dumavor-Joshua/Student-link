# StudentLink

StudentLink is a student-focused social platform for school communities, posts, polls, friendships, private messaging, notifications, and lightweight games.

## Repository map

- `index.html` — app shell, CDN fallback loader, PWA registration.
- `assets/app.js` — client-side routing, Supabase integration, social features, notifications, and game interfaces.
- `assets/app.css` — responsive design system and component styling.
- `sw.js` and `manifest.json` — offline app shell, install metadata, and push-notification click handling.
- `supabase_schema.sql` — base database schema, triggers, and row-level security.
- `supabase/migrations/` — incremental database changes. Apply each migration to an existing database in chronological order.
- `TESTING.md` — release acceptance checks for security, notifications, messaging, games, PWA installation, and deployment.
- `scripts/check-project.mjs` — static regression checks for routes, authentication, messaging, game navigation, accessibility hooks, cache versions, and migration safeguards.

## UI design direction

StudentLink uses a consistent, responsive visual system: deep-navy and bright-blue surfaces, clear typography, rounded cards, visible focus states, and a compact bottom navigation on phones. The layout keeps the feed central while making school discovery, messages, games, and profile actions easy to find.

The interaction patterns are informed by established products without copying their branding or layouts:
- [Discord](https://support.discord.com/hc/en-us/articles/12654190110999-New-Mobile-App-Updates-Layout) — clear separation between direct messages, communities, and notifications.
- [Reddit](https://support.reddithelp.com/hc/en-us/articles/17881389378196-How-do-I-browse-and-find-communities-on-the-Reddit-app) — community discovery and topic-based navigation.
- [Kahoot!](https://kahoot.com/what-is-kahoot/) and [Blooket](https://www.blooket.com/) — approachable quiz flows, game-mode discovery, and useful feedback after answering.

These are design references, not claims of affiliation or copied assets.

## Ghana school directory and canonical grouping

The authoritative alphabetical display-name directory is `data/ghana-shs-master.json`. The frontend loads this file at startup and uses the older embedded list only as a fallback if the directory cannot be fetched. The service worker caches the JSON file for offline use. When updating school names, edit the master JSON first and keep the regression checks aligned.

School selection, trending-school counts, and school-student pages use one canonicalization path. Exact directory names and explicit aliases resolve immediately; legacy profile names are mapped only when the match is strong and unique. Ambiguous names, different campuses, and different school types should remain separate. The searchable school field still accepts a typed value when no safe directory match exists.

**Coverage note:** the current list mirrors the supplied directory of 596 names. It is the product's display-name source, not an independently verified or exhaustive official register. Do not treat inclusion as proof of current school status or use this list as an official admissions/placement authority.

## Games

The game library currently includes six playable entries:

- **Online multiplayer:** Tic-Tac-Toe, Connect Four, and Rock Paper Scissors.
- **Solo:** Student Quiz (15 sets of 10 questions, 150 total), Number Guess, and Word Scramble. Rock Paper Scissors also offers a computer opponent from its online game screen.

Online multiplayer requires a signed-in account, Supabase RPCs/tables from the game SQL migrations, and Realtime enabled for the relevant game tables. The game library labels solo and online modes so users do not mistake a local game for an online match.

## Setup and database

1. Create a Supabase project and configure the allowed site URL plus redirect URLs for each deployed origin.
2. Run `supabase_schema.sql` for a new database, then apply the required migrations in `supabase/migrations/` in chronological order.
3. Set the Supabase project URL and publishable/anon key in `assets/app.js`. Never expose a service-role or secret key in browser code.
4. Enable Realtime for the tables used by active live features, including `messages`, `friendships`, and multiplayer game tables.
5. Run the static regression suite with Node.js: `node scripts/check-project.mjs`.

Do not re-run the base schema over an existing production database without reviewing its statements first. Prefer tracked, incremental migrations for changes.

## Blocking and contact safety

The migration `supabase/migrations/20261011_enforce_blocks_on_contact.sql` makes blocking a server-enforced contact boundary by reusing the existing caller-scoped `is_blocked_between` helper: new friend requests, acceptance of pending requests, new conversations, and new messages are rejected when either participant has blocked the other. Existing conversation history is not automatically deleted. Apply the migration to an existing database after reviewing its diff, and verify it with two test accounts before release.

## Notification compatibility

Foreground notification delivery now prefers the service worker's persistent `showNotification()` API, which is the compatible path for mobile web apps. Notification clicks route friend-request alerts to Friends and message alerts to the relevant conversation. This frontend change does not replace the required server-side Web Push sender, VAPID configuration, browser permission, or real-device background tests.

## Security and student privacy

- Row-level security is the primary boundary for browser access; the frontend key is publishable, not a substitute for RLS.
- Security-definer RPCs must validate caller identity and ownership, use a hardened `search_path`, and have the narrowest necessary EXECUTE grants.
- Notification trigger functions are trigger-only and must not be exposed as directly callable browser RPCs.
- Never place service-role credentials in client code or commit private keys.
- StudentLink is intended for students. Avoid collecting unnecessary sensitive information, keep profiles limited to what is needed, and use reporting/blocking tools responsibly.

## Rewards status

Game rewards remain paused. The existing regression suite intentionally prevents client-side reward-awarding hooks from being wired into the main app because a browser-controlled score can be forged. A trustworthy reward system needs server-validated completion/scoring, anti-repeat rules, and auditable ledger entries before points or badges are granted. Cosmetic scores from solo games are not account-level rewards.

## Deployment

The repository has a Netlify site at `https://student-link1.netlify.app`, but the inspected published deploy was created through the Netlify API rather than a Git-connected build. GitHub changes alone therefore cannot be assumed to publish to that Netlify site. Confirm the site is connected to this repository or publish a fresh Netlify deploy after merging changes. GitHub Pages may be configured separately; always verify the actual production URL and deployed commit.

## Verification notes

The static test script is a regression guard, not an end-to-end browser test. Authentication, social actions, push notifications, multiplayer with two separate accounts, iPhone Safari, and low-bandwidth behaviour still require live-device checks before a release is considered fully verified.
