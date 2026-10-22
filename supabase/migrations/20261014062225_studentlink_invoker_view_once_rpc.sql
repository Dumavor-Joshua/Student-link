-- Harden view-once consumption so it uses invoker privileges and a recipient-only insert policy.
drop policy if exists "recipient records view once open" on public.message_view_once_opens;
create policy "recipient records view once open" on public.message_view_once_opens
for insert to authenticated
with check (
 opened_by=(select auth.uid())
 and exists (
   select 1 from public.messages m join public.conversations c on c.id=m.conversation_id
   where m.id=message_id and m.sender_id <> (select auth.uid())
     and m.body like '[[view-once]] %' and m.attachment_path is not null
     and ((c.user_a=(select auth.uid())) or (c.user_b=(select auth.uid())))
     and not public.is_blocked_between(c.user_a,c.user_b)
 )
);
grant insert on public.message_view_once_opens to authenticated;
create or replace function public.studentlink_consume_view_once(p_message_id uuid)
returns text language plpgsql security invoker set search_path = pg_catalog, public, pg_temp as $$
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
