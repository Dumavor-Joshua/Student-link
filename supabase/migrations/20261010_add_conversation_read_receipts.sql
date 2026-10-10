-- Shared per-user read cursors make unread message counts consistent across devices.
create table if not exists public.conversation_reads (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz not null default 'epoch'::timestamptz,
  primary key (conversation_id,user_id)
);
alter table public.conversation_reads enable row level security;
drop policy if exists "read own conversation cursors" on public.conversation_reads;
create policy "read own conversation cursors" on public.conversation_reads for select to authenticated using (user_id=(select auth.uid()));
drop policy if exists "insert own conversation cursors" on public.conversation_reads;
create policy "insert own conversation cursors" on public.conversation_reads for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id and (c.user_a=(select auth.uid()) or c.user_b=(select auth.uid()))));
drop policy if exists "update own conversation cursors" on public.conversation_reads;
create policy "update own conversation cursors" on public.conversation_reads for update to authenticated using (user_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id and (c.user_a=(select auth.uid()) or c.user_b=(select auth.uid())))) with check (user_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id and (c.user_a=(select auth.uid()) or c.user_b=(select auth.uid()))));
grant select,insert,update on public.conversation_reads to authenticated;
-- Treat messages already present at rollout as the baseline; only later incoming messages become newly unread.
insert into public.conversation_reads(conversation_id,user_id,last_read_at)
select c.id,member.user_id,coalesce(max(m.created_at),c.created_at)
from public.conversations c
cross join lateral (values(c.user_a),(c.user_b)) as member(user_id)
left join public.messages m on m.conversation_id=c.id
group by c.id,member.user_id,c.created_at
on conflict (conversation_id,user_id) do nothing;
