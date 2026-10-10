-- Harden the search_path of game RPCs that intentionally run as SECURITY DEFINER.
-- Keep public available for qualified application objects and pg_catalog first for built-ins.
-- Preserve existing EXECUTE grants: authenticated users need these RPCs for multiplayer games.
alter function public.cf_create_game() set search_path = pg_catalog, public, pg_temp;
alter function public.cf_join_game(uuid) set search_path = pg_catalog, public, pg_temp;
alter function public.cf_make_move(uuid, integer) set search_path = pg_catalog, public, pg_temp;
alter function public.cf_leave_game(uuid) set search_path = pg_catalog, public, pg_temp;
alter function public.rps_create_game() set search_path = pg_catalog, public, pg_temp;
alter function public.rps_join_game(uuid) set search_path = pg_catalog, public, pg_temp;
alter function public.rps_make_move(uuid, text) set search_path = pg_catalog, public, pg_temp;
alter function public.rps_leave_game(uuid) set search_path = pg_catalog, public, pg_temp;
alter function public.ttt_create_game() set search_path = pg_catalog, public, pg_temp;
alter function public.ttt_join_game(uuid) set search_path = pg_catalog, public, pg_temp;
alter function public.ttt_make_move(uuid, integer) set search_path = pg_catalog, public, pg_temp;
alter function public.ttt_leave_game(uuid) set search_path = pg_catalog, public, pg_temp;
