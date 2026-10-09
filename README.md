# StudentLink

StudentLink is a student-focused social space for school friends, posts, polls, private messages, and lightweight learning games.

## Project structure

- `index.html` — page shell and shared modal container.
- `assets/app.css` — responsive styles and theme.
- `assets/app.js` — client-side application and Supabase integration.
- `supabase_schema.sql` — base database schema, tables, triggers, and row-level security policies.
- `supabase/migrations/20261009_harden_poll_vote_policy.sql` — additional poll-vote policy hardening.

## Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run `supabase_schema.sql` once.
3. Run `supabase/migrations/20261009_harden_poll_vote_policy.sql` to validate vote ownership and poll-option indexes at the database-policy layer.
4. In `assets/app.js`, set `SUPABASE_URL` and `SUPABASE_ANON_KEY` to your project's URL and publishable/anon key. Never put a service-role key in browser code.
5. In Supabase Authentication settings, configure the allowed site URL and redirect URLs for your deployed GitHub Pages site.
6. Enable Realtime for `posts`, `messages`, and `friendships` if you want live updates. The app should still load without Realtime.
7. Publish the repository with GitHub Pages, using the repository's root as the site source.

## Security notes

- The browser uses only the Supabase publishable/anon key. Database row-level security is the real access-control boundary.
- Review all RLS policies before production use, especially for comments, reports, blocks, and poll votes.
- The poll-vote migration hardens vote writes, but it does not replace a full security review or server-side moderation.
- Do not store sensitive personal information in public profiles or posts. StudentLink is intended for students; follow applicable privacy and safeguarding requirements.

## Current feature status

- Feed, profile editing, friend requests, private conversations, and a local two-player Tic-Tac-Toe game are implemented in the client.
- Student Quiz and Connect Four are placeholders and are not playable yet.
- Poll creation is present; interactive poll voting still needs a complete UI and end-to-end tests.

## Development workflow

Changes are staged on `studentlink/phase-1-stabilization` for review before merging into `main`. Test authentication, feed posts, friend requests, messaging, profile updates, and mobile layouts with a separate test account before deploying.
