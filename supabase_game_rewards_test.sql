-- Experimental StudentLink game rewards. Apply only to a disposable/test Supabase project until validated.
create table if not exists public.game_point_awards (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_type text not null check (game_type in ('ttt','connect','rps')),
  game_id uuid not null,
  points integer not null default 10 check (points = 10),
  awarded_at timestamptz not null default now(),
  unique (user_id, game_type, game_id)
);
alter table public.game_point_awards enable row level security;
drop policy if exists "Users can read their own game point awards" on public.game_point_awards;
create policy "Users can read their own game point awards" on public.game_point_awards
  for select to authenticated using (auth.uid() = user_id);
grant select on public.game_point_awards to authenticated;
revoke insert, update, delete on public.game_point_awards from anon, authenticated;

create or replace function public.studentlink_award_game_points(p_game_type text, p_game_id uuid)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_winner uuid;
  v_user uuid := auth.uid();
  v_inserted bigint;
  v_total integer;
begin
  if v_user is null then raise exception 'Sign in to receive points.'; end if;
  if p_game_type = 'ttt' then
    select winner_id into v_winner from public.ttt_games where id=p_game_id and status='won';
  elsif p_game_type = 'connect' then
    select winner_id into v_winner from public.connect_four_games where id=p_game_id and status='won';
  elsif p_game_type = 'rps' then
    select winner_id into v_winner from public.rps_games where id=p_game_id and status='won';
  else raise exception 'Unsupported game type.'; end if;
  if v_winner is null then raise exception 'No verified winner for this game.'; end if;
  if v_winner <> v_user then raise exception 'Only the winner can receive points.'; end if;
  insert into public.game_point_awards(user_id,game_type,game_id,points)
    values(v_user,p_game_type,p_game_id,10)
    on conflict(user_id,game_type,game_id) do nothing returning id into v_inserted;
  select coalesce(sum(points),0)::integer into v_total from public.game_point_awards where user_id=v_user;
  return jsonb_build_object('awarded',v_inserted is not null,'points',case when v_inserted is null then 0 else 10 end,'total_points',v_total);
end; $$;
revoke all on function public.studentlink_award_game_points(text,uuid) from public;
grant execute on function public.studentlink_award_game_points(text,uuid) to authenticated;

create or replace function public.studentlink_my_points()
returns integer language sql stable security invoker set search_path = public, pg_temp as $$
  select coalesce(sum(points),0)::integer from public.game_point_awards where user_id=auth.uid();
$$;
revoke all on function public.studentlink_my_points() from public;
grant execute on function public.studentlink_my_points() to authenticated;
