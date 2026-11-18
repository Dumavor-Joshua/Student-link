-- Harden status ownership, expiry, and media compatibility.
-- Existing status rows are retained; new writes must satisfy these checks.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values(
  'status-media',
  'status-media',
  false,
  10485760,
  array[
    'image/jpeg','image/png','image/webp','image/gif','image/avif',
    'video/mp4','video/webm','video/quicktime'
  ]
)
on conflict(id) do update
set public=false,
    file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "owners publish statuses" on public.studentlink_statuses;
create policy "owners publish statuses"
on public.studentlink_statuses for insert to authenticated
with check (
  user_id=(select auth.uid())
  and created_at >= now()-interval '5 minutes'
  and created_at <= now()+interval '1 minute'
  and expires_at > now()
  and expires_at <= created_at+interval '24 hours'
  and expires_at <= now()+interval '24 hours 1 minute'
  and (
    (media_path is null and media_mime_type is null)
    or (
      media_path is not null
      and (storage.foldername(media_path))[1]=(select auth.uid())::text
      and media_mime_type = any(array[
        'image/jpeg','image/png','image/webp','image/gif','image/avif',
        'video/mp4','video/webm','video/quicktime'
      ]::text[])
    )
  )
);

drop policy if exists "status owners upload media" on storage.objects;
create policy "status owners upload media"
on storage.objects for insert to authenticated
with check (
  bucket_id='status-media'
  and (storage.foldername(name))[1]=(select auth.uid())::text
);

drop policy if exists "status owners and friends read media" on storage.objects;
create policy "status owners and friends read media"
on storage.objects for select to authenticated
using (
  bucket_id='status-media'
  and exists (
    select 1
    from public.studentlink_statuses s
    where s.media_path=objects.name
      and (storage.foldername(objects.name))[1]=s.user_id::text
      and s.expires_at>now()
      and (
        s.user_id=(select auth.uid())
        or (
          public.are_friends(s.user_id,(select auth.uid()))
          and not public.is_blocked_between(s.user_id,(select auth.uid()))
        )
      )
  )
);

drop policy if exists "status owners delete media" on storage.objects;
create policy "status owners delete media"
on storage.objects for delete to authenticated
using (
  bucket_id='status-media'
  and (storage.foldername(name))[1]=(select auth.uid())::text
);
