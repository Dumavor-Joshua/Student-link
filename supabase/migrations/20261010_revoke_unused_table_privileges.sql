-- Remove table-level capabilities that the browser client never needs.
-- Row-level security and existing CRUD grants are intentionally left unchanged.
revoke references, trigger, truncate on all tables in schema public from anon, authenticated;
alter default privileges in schema public
  revoke references, trigger, truncate on tables from anon, authenticated;
