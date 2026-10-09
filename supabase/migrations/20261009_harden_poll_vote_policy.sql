-- StudentLink security hardening migration.
-- Run this once in Supabase SQL Editor after the base schema.
-- It restricts votes to valid options belonging to an existing poll.
drop policy if exists "vote as self" on public.poll_votes;
create policy "vote as self" on public.poll_votes
for insert to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.post_type = 'poll'
      and option_index >= 0
      and option_index < jsonb_array_length(p.poll_options)
  )
);
drop policy if exists "update own vote" on public.poll_votes;
create policy "update own vote" on public.poll_votes
for update to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.post_type = 'poll'
      and option_index >= 0
      and option_index < jsonb_array_length(p.poll_options)
  )
);
