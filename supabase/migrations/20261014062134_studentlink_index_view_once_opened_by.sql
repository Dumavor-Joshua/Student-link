-- Cover the opened_by foreign key used by account deletion and audit lookups.
create index if not exists message_view_once_opens_opened_by_idx on public.message_view_once_opens(opened_by);
