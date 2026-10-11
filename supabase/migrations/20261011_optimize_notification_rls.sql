-- Keep auth.uid() out of per-row policy evaluation for notification-heavy views.
-- These changes preserve the existing row-ownership rules.
alter policy "Users can read their own notifications"
  on public.notifications
  using ((select auth.uid()) = user_id);

alter policy "Users can mark their own notifications read"
  on public.notifications
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users can delete their own notifications"
  on public.notifications
  using ((select auth.uid()) = user_id);

alter policy "Users manage their own push subscriptions"
  on public.push_subscriptions
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
