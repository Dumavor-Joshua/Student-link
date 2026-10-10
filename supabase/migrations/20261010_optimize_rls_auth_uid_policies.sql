-- Performance-only rewrite of direct auth.uid() calls in simple RLS policies.
-- Semantics and role scope remain unchanged; the scalar subquery lets PostgreSQL
-- evaluate the identity once per statement instead of once per candidate row.
alter policy "profile owner inserts" on public.profiles
  with check (id = (select auth.uid()));
alter policy "profile owner updates" on public.profiles
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
alter policy "update own posts" on public.posts
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
alter policy "delete own posts" on public.posts
  using (user_id = (select auth.uid()));
alter policy "unlike as self" on public.post_likes
  using (user_id = (select auth.uid()));
alter policy "delete own comments" on public.comments
  using (user_id = (select auth.uid()));
alter policy "participants read friendships" on public.friendships
  using (user_id = (select auth.uid()) or friend_id = (select auth.uid()));
alter policy "send own request" on public.friendships
  with check (user_id = (select auth.uid()) and status = 'pending');
alter policy "recipient accepts request" on public.friendships
  using (friend_id = (select auth.uid()) and status = 'pending')
  with check (friend_id = (select auth.uid()) and status = 'accepted');
alter policy "participants delete friendship" on public.friendships
  using (user_id = (select auth.uid()) or friend_id = (select auth.uid()));
alter policy "manage own blocks" on public.blocks
  using (blocker_id = (select auth.uid()))
  with check (blocker_id = (select auth.uid()));
alter policy "create reports as self" on public.reports
  with check (reporter_id = (select auth.uid()));
alter policy "read own reports" on public.reports
  using (reporter_id = (select auth.uid()));
alter policy "update own vote" on public.poll_votes
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.posts p
      where p.id = poll_votes.post_id
        and p.post_type = 'poll'
        and poll_votes.option_index >= 0
        and poll_votes.option_index < jsonb_array_length(p.poll_options)
    )
  );
