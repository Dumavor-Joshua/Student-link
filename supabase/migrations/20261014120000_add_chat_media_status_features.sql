-- StudentLink chat stickers, view-once media and 24-hour status updates.
create table if not exists public.message_view_once_opens (
  message_id uuid primary key references public.messages(id) on delete cascade,
  opened_by uuid not null references auth.users(id) on delete cascade,
  opened_at timestamptz not null default now()
);
alter table public.message_view_once_opens enable row level security;
drop policy if exists "read own view once opens" on public.message_view_once_opens;
create policy "read own view once opens" on public.message_view_once_opens for select to authenticated using (opened_by = (select auth.uid()));
revoke all on public.message_view_once_opens from anon, authenticated;
grant select on public.message_view_once_opens to authenticated;
create or replace function public.studentlink_consume_view_once(p_message_id uuid)
returns text language plpgsql security definer set search_path = pg_catalog, public, pg_temp as $$
declare v_path text; v_consumed uuid;
begin
 if (select auth.uid()) is null then return null; end if;
 select m.attachment_path into v_path from public.messages m join public.conversations c on c.id=m.conversation_id
 where m.id=p_message_id and ((c.user_a=(select auth.uid())) or (c.user_b=(select auth.uid())))
 and m.sender_id <> (select auth.uid()) and m.body like '[[view-once]] %' and m.attachment_path is not null
 and not public.is_blocked_between(c.user_a,c.user_b);
 if v_path is null then return null; end if;
 insert into public.message_view_once_opens(message_id,opened_by) values(p_message_id,(select auth.uid()))
 on conflict(message_id) do nothing returning message_id into v_consumed;
 if v_consumed is null then return null; end if;
 return v_path;
end; $$;
revoke all on function public.studentlink_consume_view_once(uuid) from public, anon;
grant execute on function public.studentlink_consume_view_once(uuid) to authenticated;

create table if not exists public.studentlink_statuses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 body text not null default '' check(char_length(body)<=240), media_path text, media_mime_type text,
 created_at timestamptz not null default now(), expires_at timestamptz not null default(now()+interval '24 hours'),
 constraint studentlink_status_has_content check(char_length(btrim(body))>0 or media_path is not null),
 constraint studentlink_status_expiry check(expires_at>created_at and expires_at<=created_at+interval '24 hours 5 minutes')
);
create index if not exists studentlink_statuses_active_idx on public.studentlink_statuses(expires_at desc,created_at desc);
create index if not exists studentlink_statuses_owner_idx on public.studentlink_statuses(user_id,created_at desc);
alter table public.studentlink_statuses enable row level security;
drop policy if exists "friends read active statuses" on public.studentlink_statuses;
create policy "friends read active statuses" on public.studentlink_statuses for select to authenticated
using(expires_at>now() and (user_id=(select auth.uid()) or (public.are_friends(user_id,(select auth.uid())) and not public.is_blocked_between(user_id,(select auth.uid())))));
drop policy if exists "owners publish statuses" on public.studentlink_statuses;
create policy "owners publish statuses" on public.studentlink_statuses for insert to authenticated
with check(user_id=(select auth.uid()) and expires_at>now() and expires_at<=created_at+interval '24 hours 5 minutes');
drop policy if exists "owners delete statuses" on public.studentlink_statuses;
create policy "owners delete statuses" on public.studentlink_statuses for delete to authenticated using(user_id=(select auth.uid()));
grant select,insert,delete on public.studentlink_statuses to authenticated;
revoke all on public.studentlink_statuses from anon;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('status-media','status-media',false,5242879,array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict(id) do update set public=false,file_size_limit=5242879,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif','image/avif'];
drop policy if exists "status owners upload media" on storage.objects;
create policy "status owners upload media" on storage.objects for insert to authenticated
with check(bucket_id='status-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
drop policy if exists "status owners and friends read media" on storage.objects;
create policy "status owners and friends read media" on storage.objects for select to authenticated
using(bucket_id='status-media' and exists(select 1 from public.studentlink_statuses s where s.media_path=objects.name and s.expires_at>now()
and (s.user_id=(select auth.uid()) or (public.are_friends(s.user_id,(select auth.uid())) and not public.is_blocked_between(s.user_id,(select auth.uid()))))));
drop policy if exists "status owners delete media" on storage.objects;
create policy "status owners delete media" on storage.objects for delete to authenticated
using(bucket_id='status-media' and (storage.foldername(name))[1]=(select auth.uid())::text);
