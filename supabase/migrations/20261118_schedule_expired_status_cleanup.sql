-- Periodically remove expired status rows and their unshared private media.
-- Before applying this migration, store both values in Supabase Vault:
--   project_url: https://<project-ref>.supabase.co
--   status_cleanup_secret: the same random value configured as the
--     STATUS_CLEANUP_SECRET Edge Function secret.
-- The Edge Function must be deployed with JWT verification disabled because it
-- authenticates this scheduled request using the dedicated bearer secret itself.

create extension if not exists pg_cron;
create extension if not exists pg_net;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'project_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'status_cleanup_secret') then
    raise exception 'Set project_url and status_cleanup_secret in Supabase Vault before applying this migration';
  end if;
end
$$;

select cron.schedule(
  'studentlink-expired-status-cleanup',
  '15 * * * *',
  $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url')
        || '/functions/v1/cleanup-expired-statuses',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets where name = 'status_cleanup_secret'
        )
      ),
      body := jsonb_build_object('triggered_at', now())
    );
  $job$
);
