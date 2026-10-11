-- Reuse the existing is_blocked_between(uuid,uuid) helper, which only allows
-- callers to inspect block relationships involving their own account.
drop policy if exists "send own request" on public.friendships;
create policy "send own request"
on public.friendships for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and not public.is_blocked_between(user_id, friend_id)
);

drop policy if exists "recipient accepts request" on public.friendships;
create policy "recipient accepts request"
on public.friendships for update to authenticated
using (friend_id = (select auth.uid()) and status = 'pending')
with check (
  friend_id = (select auth.uid())
  and status = 'accepted'
  and not public.is_blocked_between(user_id, friend_id)
);

drop policy if exists "friends create conversation" on public.conversations;
create policy "friends create conversation"
on public.conversations for insert to authenticated
with check (
  ((select auth.uid()) = user_a or (select auth.uid()) = user_b)
  and public.are_friends(user_a, user_b)
  and not public.is_blocked_between(user_a, user_b)
);

drop policy if exists "friends send messages as self" on public.messages;
create policy "friends send messages as self"
on public.messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and (c.user_a = (select auth.uid()) or c.user_b = (select auth.uid()))
      and public.are_friends(c.user_a, c.user_b)
      and not public.is_blocked_between(c.user_a, c.user_b)
  )
);
