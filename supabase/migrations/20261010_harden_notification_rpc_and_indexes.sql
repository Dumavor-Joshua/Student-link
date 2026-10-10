-- StudentLink production hardening: keep trigger-only notification functions off the public RPC surface.
-- These functions are invoked by database triggers; clients must not call them directly.
revoke execute on function public.studentlink_record_friend_request_notification() from public, anon, authenticated;
revoke execute on function public.studentlink_record_message_notification() from public, anon, authenticated;
revoke execute on function public.studentlink_send_friend_request_push() from public, anon, authenticated;

-- Cover foreign keys reported by Supabase's performance advisor.
create index if not exists conversation_reads_user_id_idx
  on public.conversation_reads (user_id);
create index if not exists notifications_actor_id_idx
  on public.notifications (actor_id);
create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions (user_id);
