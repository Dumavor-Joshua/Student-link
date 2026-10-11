-- StudentLink safety hardening: a block must stop new requests and messages,
-- even when the blocked relationship is not visible through the caller's own RLS rows.
-- Existing conversations remain readable; blocking prevents new contact.
create or replace function public.studentlink_are_blocked(p_user_a uuid, p_user_b uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = pg_catalog, public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in is required.';
  end if;
  if auth.uid() <> p_user_a and auth.uid() <> p_user_b then
    raise exception 'You can only check a block relationship involving your own account.';
  end if;
  return exists (
    select 1
    from public.blocks b
    where (b.blocker_id = p_user_a and b.blocked_id = p_user_b)
       or (b.blocker_id = p_user_b and b.blocked_id = p_user_a)
  );
end;
$$;
revoke all on function public.studentlink_are_blocked(uuid, uuid) from public, anon;
grant execute on function public.studentlink_are_blocked(uuid, uuid) to authenticated;

drop policy if exists "send own request" on public.friendships;
create policy "send own request"
on public.friendships for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status = 'pending'
  and not public.studentlink_are_blocked(user_id, friend_id)
);

drop policy if exists "recipient accepts request" on public.friendships;
create policy "recipient accepts request"
on public.friendships for update to authenticated
using (friend_id = (select auth.uid()) and status = 'pending')
with check (
  friend_id = (select auth.uid())
  and status = 'accepted'
  and not public.studentlink_are_blocked(user_id, friend_id)
);

drop policy if exists "friends create conversation" on public.conversations;
create policy "friends create conversation"
on public.conversations for insert to authenticated
with check (
  ((select auth.uid()) = user_a or (select auth.uid()) = user_b)
  and public.are_friends(user_a, user_b)
  and not public.studentlink_are_blocked(user_a, user_b)
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
      and not public.studentlink_are_blocked(c.user_a, c.user_b)
  )
);
