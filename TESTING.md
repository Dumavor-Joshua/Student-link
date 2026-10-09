# StudentLink manual test checklist

Run these checks against a test Supabase project before merging or deploying. Use two test accounts and do not use sensitive personal information.

## Database setup

- [ ] Run `supabase_schema.sql` once in the Supabase SQL Editor.
- [ ] Run `supabase/migrations/20261009_harden_poll_vote_policy.sql` once after the base schema.
- [ ] Confirm row-level security is enabled on all application tables.
- [ ] Configure the Supabase site URL and allowed redirect URLs for the GitHub Pages address.

## Authentication and profiles

- [ ] Sign up with a test account and confirm the email flow matches Supabase settings.
- [ ] Sign in, refresh the page, and confirm the session is handled correctly.
- [ ] Update nickname and school; confirm values persist after reload.
- [ ] Sign out and confirm private app content is no longer accessible.

## Feed and polls

- [ ] Create a text post and confirm it appears in the feed.
- [ ] Create a poll with a question and at least two options.
- [ ] Vote on a poll; confirm the selected option and counts appear.
- [ ] Attempt a second vote from the same account; it should be blocked by the UI and database primary key.
- [ ] Like and unlike a post; confirm the count changes.

## Friends and messages

- [ ] From account A, send a friend request to account B.
- [ ] From account B, accept the request and confirm both accounts see the friendship.
- [ ] Start a conversation and exchange messages in both directions.
- [ ] Confirm a non-friend cannot create a conversation or read messages using direct database requests.

## Games and responsive layout

- [ ] Play Tic-Tac-Toe through a win and a draw; confirm Restart resets the board.
- [ ] Confirm Student Quiz and Connect Four clearly indicate they are not implemented yet.
- [ ] Test search, navigation, forms, and the feed at mobile width and desktop width.
- [ ] Check browser console and Supabase logs for errors.

## Deployment

- [ ] Review the GitHub Actions validation result.
- [ ] Review the pull request diff before merging.
- [ ] Confirm GitHub Pages serves `index.html`, `assets/app.css`, and `assets/app.js` successfully.
- [ ] Verify the deployed site using test accounts before sharing it with students.
