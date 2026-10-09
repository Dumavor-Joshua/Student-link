-- StudentLink online Tic-Tac-Toe multiplayer.
-- Run once in Supabase SQL Editor. This creates server-validated games and realtime updates.
create table if not exists public.ttt_games (
  id uuid primary key default gen_random_uuid(),
  player_x uuid not null references public.profiles(id) on delete cascade,
  player_o uuid references public.profiles(id) on delete set null,
  board text[] not null default array['','','','','','','','','']::text[],
  current_turn uuid references public.profiles(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting','playing','won','draw')),
  winner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ttt_board_has_nine_cells check (array_length(board,1)=9),
  constraint ttt_board_values_valid check (board <@ array['','X','O']::text[]),
  constraint ttt_players_differ check (player_o is null or player_o <> player_x)
);
alter table public.ttt_games drop constraint if exists ttt_games_status_check;
alter table public.ttt_games add constraint ttt_games_status_check check (status in ('waiting','playing','won','draw','cancelled'));
create index if not exists ttt_games_waiting_idx on public.ttt_games(status,created_at) where status='waiting';
create index if not exists ttt_games_player_x_idx on public.ttt_games(player_x);
create index if not exists ttt_games_player_o_idx on public.ttt_games(player_o);
alter table public.ttt_games enable row level security;
drop policy if exists "authenticated users can view tic tac toe games" on public.ttt_games;
create policy "authenticated users can view tic tac toe games" on public.ttt_games for select to authenticated using (true);
grant select on public.ttt_games to authenticated;
revoke insert,update,delete on public.ttt_games from anon, authenticated;

create or replace function public.ttt_create_game()
returns uuid language plpgsql security definer set search_path=public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to create a game.'; end if;
  insert into public.ttt_games(player_x) values(auth.uid()) returning id into new_id;
  return new_id;
end; $$;

create or replace function public.ttt_join_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare host_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to join a game.'; end if;
  update public.ttt_games
     set player_o=auth.uid(), current_turn=player_x, status='playing', updated_at=now()
   where id=p_game_id and status='waiting' and player_o is null and player_x<>auth.uid()
   returning player_x into host_id;
  if host_id is null then raise exception 'This game is no longer available. Refresh the open games list.'; end if;
  return p_game_id;
end; $$;

create or replace function public.ttt_make_move(p_game_id uuid,p_cell integer)
returns uuid language plpgsql security definer set search_path=public as $$
declare
  g public.ttt_games%rowtype;
  b text[];
  mark text;
  has_win boolean := false;
begin
  if auth.uid() is null then raise exception 'Please sign in to play.'; end if;
  if p_cell is null or p_cell < 0 or p_cell > 8 then raise exception 'Invalid board cell.'; end if;
  select * into g from public.ttt_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if g.status <> 'playing' then raise exception 'This game is not in progress.'; end if;
  if auth.uid() not in (g.player_x,g.player_o) then raise exception 'You are not a player in this game.'; end if;
  if g.current_turn <> auth.uid() then raise exception 'It is not your turn yet.'; end if;
  if g.board[p_cell+1] <> '' then raise exception 'That cell is already occupied.'; end if;
  mark := case when auth.uid()=g.player_x then 'X' else 'O' end;
  b := g.board;
  b[p_cell+1] := mark;
  has_win :=
    (b[1]<>'' and b[1]=b[2] and b[2]=b[3]) or
    (b[4]<>'' and b[4]=b[5] and b[5]=b[6]) or
    (b[7]<>'' and b[7]=b[8] and b[8]=b[9]) or
    (b[1]<>'' and b[1]=b[4] and b[4]=b[7]) or
    (b[2]<>'' and b[2]=b[5] and b[5]=b[8]) or
    (b[3]<>'' and b[3]=b[6] and b[6]=b[9]) or
    (b[1]<>'' and b[1]=b[5] and b[5]=b[9]) or
    (b[3]<>'' and b[3]=b[5] and b[5]=b[7]);
  update public.ttt_games
     set board=b,
         status=case when has_win then 'won' when not (''=any(b)) then 'draw' else 'playing' end,
         winner_id=case when has_win then auth.uid() else null end,
         current_turn=case when has_win or not (''=any(b)) then null when auth.uid()=g.player_x then g.player_o else g.player_x end,
         updated_at=now()
   where id=p_game_id;
  return p_game_id;
end; $$;

create or replace function public.ttt_leave_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $
declare g public.ttt_games%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in to leave a game.'; end if;
  select * into g from public.ttt_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if auth.uid() not in (g.player_x,g.player_o) then raise exception 'You are not a player in this game.'; end if;
  if g.status='waiting' and auth.uid()=g.player_x then
    update public.ttt_games set status='cancelled',updated_at=now() where id=p_game_id;
  elsif g.status='playing' then
    update public.ttt_games
       set status='won',
           winner_id=case when auth.uid()=g.player_x then g.player_o else g.player_x end,
           current_turn=null,
           updated_at=now()
     where id=p_game_id;
  else
    raise exception 'This game has already finished or cannot be left.';
  end if;
  return p_game_id;
end; $;

revoke all on function public.ttt_create_game() from public;
revoke all on function public.ttt_join_game(uuid) from public;
revoke all on function public.ttt_make_move(uuid,integer) from public;
revoke all on function public.ttt_leave_game(uuid) from public;
grant execute on function public.ttt_create_game() to authenticated;
grant execute on function public.ttt_join_game(uuid) to authenticated;
grant execute on function public.ttt_make_move(uuid,integer) to authenticated;
grant execute on function public.ttt_leave_game(uuid) to authenticated;

do $$ begin alter publication supabase_realtime add table public.ttt_games;
exception when duplicate_object then null; when undefined_object then null; end $$;
