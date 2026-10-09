-- StudentLink multiplayer games: Connect Four and Rock Paper Scissors.
-- Run this file once in the Supabase SQL Editor after supabase_schema.sql and
-- supabase_tictactoe_multiplayer.sql. Online games require authenticated users.

create table if not exists public.connect_four_games (
  id uuid primary key default gen_random_uuid(),
  player_one uuid not null references public.profiles(id) on delete cascade,
  player_two uuid references public.profiles(id) on delete set null,
  board integer[] not null default array_fill(0, array[42]),
  current_turn uuid references public.profiles(id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting','playing','won','draw','cancelled')),
  winner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cf_board_has_42_cells check (array_length(board,1)=42),
  constraint cf_board_values_valid check (board <@ array[0,1,2]::integer[]),
  constraint cf_players_differ check (player_two is null or player_two <> player_one)
);
create index if not exists cf_waiting_idx on public.connect_four_games(status,created_at) where status='waiting';
alter table public.connect_four_games enable row level security;
drop policy if exists "authenticated users can view connect four games" on public.connect_four_games;
create policy "authenticated users can view connect four games" on public.connect_four_games for select to authenticated using (true);
grant select on public.connect_four_games to authenticated;
revoke insert,update,delete on public.connect_four_games from anon,authenticated;

create table if not exists public.rps_games (
  id uuid primary key default gen_random_uuid(),
  player_one uuid not null references public.profiles(id) on delete cascade,
  player_two uuid references public.profiles(id) on delete set null,
  move_one text check (move_one is null or move_one in ('rock','paper','scissors')),
  move_two text check (move_two is null or move_two in ('rock','paper','scissors')),
  score_one integer not null default 0 check (score_one>=0),
  score_two integer not null default 0 check (score_two>=0),
  round_no integer not null default 1 check (round_no>=1),
  last_result text not null default '',
  status text not null default 'waiting' check (status in ('waiting','playing','won','cancelled')),
  winner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rps_players_differ check (player_two is null or player_two <> player_one)
);
create index if not exists rps_waiting_idx on public.rps_games(status,created_at) where status='waiting';
alter table public.rps_games enable row level security;
drop policy if exists "authenticated users can view rock paper scissors games" on public.rps_games;
create policy "players and open lobby can view rock paper scissors games" on public.rps_games for select to authenticated using ((status = 'waiting' and player_two is null) or player_one = (select auth.uid()) or player_two = (select auth.uid()));
grant select on public.rps_games to authenticated;
revoke insert,update,delete on public.rps_games from anon,authenticated;

create or replace function public.cf_has_win(p_board integer[], p_token integer)
returns boolean language plpgsql immutable set search_path=public as $$
declare
  r integer; c integer; dr integer; dc integer; step_no integer;
  rr integer; cc integer; ok_line boolean;
begin
  for r in 0..5 loop
    for c in 0..6 loop
      if p_board[r*7+c+1]=p_token then
        for dr,dc in select * from (values (0,1),(1,0),(1,1),(1,-1)) as directions(dr,dc) loop
          ok_line := true;
          for step_no in 1..3 loop
            rr := r + dr*step_no;
            cc := c + dc*step_no;
            if rr<0 or rr>5 or cc<0 or cc>6 or p_board[rr*7+cc+1]<>p_token then
              ok_line := false;
              exit;
            end if;
          end loop;
          if ok_line then return true; end if;
        end loop;
      end if;
    end loop;
  end loop;
  return false;
end; $$;

create or replace function public.cf_create_game()
returns uuid language plpgsql security definer set search_path=public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to create a game.'; end if;
  insert into public.connect_four_games(player_one) values(auth.uid()) returning id into new_id;
  return new_id;
end; $$;

create or replace function public.cf_join_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare host_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to join a game.'; end if;
  update public.connect_four_games
     set player_two=auth.uid(),current_turn=player_one,status='playing',updated_at=now()
   where id=p_game_id and status='waiting' and player_two is null and player_one<>auth.uid()
   returning player_one into host_id;
  if host_id is null then raise exception 'This game is no longer available. Refresh the open games list.'; end if;
  return p_game_id;
end; $$;

create or replace function public.cf_make_move(p_game_id uuid,p_column integer)
returns uuid language plpgsql security definer set search_path=public as $$
declare
  g public.connect_four_games%rowtype;
  b integer[];
  token integer;
  row_no integer;
  cell_index integer;
  has_win boolean;
begin
  if auth.uid() is null then raise exception 'Please sign in to play.'; end if;
  if p_column is null or p_column<0 or p_column>6 then raise exception 'Choose a valid column.'; end if;
  select * into g from public.connect_four_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if g.status<>'playing' then raise exception 'This game is not in progress.'; end if;
  if auth.uid() not in (g.player_one,g.player_two) then raise exception 'You are not a player in this game.'; end if;
  if g.current_turn<>auth.uid() then raise exception 'It is not your turn yet.'; end if;
  b:=g.board;
  cell_index:=null;
  for row_no in 0..5 loop
    if b[row_no*7+p_column+1]=0 then cell_index:=row_no*7+p_column+1; exit; end if;
  end loop;
  if cell_index is null then raise exception 'That column is full. Choose another column.'; end if;
  token:=case when auth.uid()=g.player_one then 1 else 2 end;
  b[cell_index]:=token;
  has_win:=public.cf_has_win(b,token);
  update public.connect_four_games
     set board=b,
         status=case when has_win then 'won' when not (0=any(b)) then 'draw' else 'playing' end,
         winner_id=case when has_win then auth.uid() else null end,
         current_turn=case when has_win or not (0=any(b)) then null when auth.uid()=g.player_one then g.player_two else g.player_one end,
         updated_at=now()
   where id=p_game_id;
  return p_game_id;
end; $$;

create or replace function public.cf_leave_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare g public.connect_four_games%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in to leave a game.'; end if;
  select * into g from public.connect_four_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if auth.uid() not in (g.player_one,g.player_two) then raise exception 'You are not a player in this game.'; end if;
  if g.status='waiting' and auth.uid()=g.player_one then
    update public.connect_four_games set status='cancelled',updated_at=now() where id=p_game_id;
  elsif g.status='playing' then
    update public.connect_four_games set status='won',winner_id=case when auth.uid()=g.player_one then g.player_two else g.player_one end,current_turn=null,updated_at=now() where id=p_game_id;
  else
    raise exception 'This game has already finished or cannot be left.';
  end if;
  return p_game_id;
end; $$;

create or replace function public.rps_create_game()
returns uuid language plpgsql security definer set search_path=public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to create a game.'; end if;
  insert into public.rps_games(player_one) values(auth.uid()) returning id into new_id;
  return new_id;
end; $$;

create or replace function public.rps_join_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare host_id uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in to join a game.'; end if;
  update public.rps_games set player_two=auth.uid(),status='playing',updated_at=now()
   where id=p_game_id and status='waiting' and player_two is null and player_one<>auth.uid()
   returning player_one into host_id;
  if host_id is null then raise exception 'This game is no longer available. Refresh the open games list.'; end if;
  return p_game_id;
end; $$;

create or replace function public.rps_make_move(p_game_id uuid,p_move text)
returns uuid language plpgsql security definer set search_path=public as $$
declare
  g public.rps_games%rowtype;
  m1 text; m2 text; score1 integer; score2 integer; result_text text; next_round integer;
begin
  if auth.uid() is null then raise exception 'Please sign in to play.'; end if;
  if p_move is null or p_move not in ('rock','paper','scissors') then raise exception 'Choose rock, paper, or scissors.'; end if;
  select * into g from public.rps_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if g.status<>'playing' then raise exception 'This game is not in progress.'; end if;
  if auth.uid() not in (g.player_one,g.player_two) then raise exception 'You are not a player in this game.'; end if;
  m1:=g.move_one; m2:=g.move_two; score1:=g.score_one; score2:=g.score_two; result_text:=g.last_result; next_round:=g.round_no;
  if auth.uid()=g.player_one then
    if m1 is not null then raise exception 'Your move is already submitted. Wait for your opponent.'; end if;
    m1:=p_move;
  else
    if m2 is not null then raise exception 'Your move is already submitted. Wait for your opponent.'; end if;
    m2:=p_move;
  end if;
  if m1 is not null and m2 is not null then
    if m1=m2 then
      result_text:='Round '||g.round_no||': both players chose '||m1||'. Draw.';
    elsif (m1='rock' and m2='scissors') or (m1='paper' and m2='rock') or (m1='scissors' and m2='paper') then
      score1:=score1+1; result_text:='Round '||g.round_no||': Player 1 wins ('||m1||' beats '||m2||').';
    else
      score2:=score2+1; result_text:='Round '||g.round_no||': Player 2 wins ('||m2||' beats '||m1||').';
    end if;
    m1:=null; m2:=null; next_round:=g.round_no+1;
  end if;
  update public.rps_games set move_one=m1,move_two=m2,score_one=score1,score_two=score2,last_result=result_text,round_no=next_round,updated_at=now() where id=p_game_id;
  return p_game_id;
end; $$;

create or replace function public.rps_leave_game(p_game_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare g public.rps_games%rowtype;
begin
  if auth.uid() is null then raise exception 'Please sign in to leave a game.'; end if;
  select * into g from public.rps_games where id=p_game_id for update;
  if not found then raise exception 'Game not found.'; end if;
  if auth.uid() not in (g.player_one,g.player_two) then raise exception 'You are not a player in this game.'; end if;
  if g.status='waiting' and auth.uid()=g.player_one then
    update public.rps_games set status='cancelled',updated_at=now() where id=p_game_id;
  elsif g.status='playing' then
    update public.rps_games set status='won',winner_id=case when auth.uid()=g.player_one then g.player_two else g.player_one end,updated_at=now() where id=p_game_id;
  else
    raise exception 'This game has already finished or cannot be left.';
  end if;
  return p_game_id;
end; $$;

revoke all on function public.cf_has_win(integer[],integer) from public;
revoke all on function public.cf_create_game() from public;
revoke all on function public.cf_join_game(uuid) from public;
revoke all on function public.cf_make_move(uuid,integer) from public;
revoke all on function public.cf_leave_game(uuid) from public;
revoke all on function public.rps_create_game() from public;
revoke all on function public.rps_join_game(uuid) from public;
revoke all on function public.rps_make_move(uuid,text) from public;
revoke all on function public.rps_leave_game(uuid) from public;
grant execute on function public.cf_create_game() to authenticated;
grant execute on function public.cf_join_game(uuid) to authenticated;
grant execute on function public.cf_make_move(uuid,integer) to authenticated;
grant execute on function public.cf_leave_game(uuid) to authenticated;
grant execute on function public.rps_create_game() to authenticated;
grant execute on function public.rps_join_game(uuid) to authenticated;
grant execute on function public.rps_make_move(uuid,text) to authenticated;
grant execute on function public.rps_leave_game(uuid) to authenticated;

do $$ begin alter publication supabase_realtime add table public.connect_four_games;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.rps_games;
exception when duplicate_object then null; when undefined_object then null; end $$;


-- StudentLink production repair migration. No user rows are deleted or rewritten.
drop policy if exists "conversation participants update" on public.conversations;
revoke update on public.conversations from anon, authenticated;

create or replace function public.is_blocked_between(a uuid,b uuid)
returns boolean language sql stable security definer set search_path=pg_catalog,public,pg_temp as $$
 select (select auth.uid()) is not null and (select auth.uid()) in (a,b)
 and exists(select 1 from public.blocks bl where (bl.blocker_id=a and bl.blocked_id=b) or (bl.blocker_id=b and bl.blocked_id=a));
$$;
revoke all on function public.is_blocked_between(uuid,uuid) from public,anon;
grant execute on function public.is_blocked_between(uuid,uuid) to authenticated;

create or replace function public.are_friends(a uuid,b uuid)
returns boolean language sql stable security definer set search_path=pg_catalog,public,pg_temp as $$
 select (select auth.uid()) is not null and (select auth.uid()) in (a,b)
 and exists(select 1 from public.friendships f where f.status='accepted' and ((f.user_id=a and f.friend_id=b) or (f.user_id=b and f.friend_id=a)))
 and not public.is_blocked_between(a,b);
$$;
revoke all on function public.are_friends(uuid,uuid) from public,anon;
grant execute on function public.are_friends(uuid,uuid) to authenticated;

create or replace function public.guard_friendship_update()
returns trigger language plpgsql security invoker set search_path=pg_catalog,public,pg_temp as $$
begin
 if new.user_id is distinct from old.user_id or new.friend_id is distinct from old.friend_id then raise exception 'Friendship participants cannot be changed.'; end if;
 if (select auth.uid()) is not null and ((select auth.uid())<>old.friend_id or old.status<>'pending' or new.status<>'accepted') then raise exception 'Only the recipient can accept a pending request.'; end if;
 return new;
end; $$;
drop trigger if exists guard_friendship_update on public.friendships;
create trigger guard_friendship_update before update on public.friendships for each row execute function public.guard_friendship_update();

create or replace function public.guard_friendship_insert()
returns trigger language plpgsql security definer set search_path=pg_catalog,public,pg_temp as $$
begin
 if (select auth.uid()) is not null then
  if new.user_id<>(select auth.uid()) or new.status<>'pending' then raise exception 'Friend requests must be created by the requester as pending.'; end if;
  if exists(select 1 from public.blocks bl where (bl.blocker_id=new.user_id and bl.blocked_id=new.friend_id) or (bl.blocker_id=new.friend_id and bl.blocked_id=new.user_id)) then raise exception 'A friend request cannot be sent because one of these users has blocked the other.'; end if;
  if exists(select 1 from public.friendships f where (f.user_id=new.user_id and f.friend_id=new.friend_id) or (f.user_id=new.friend_id and f.friend_id=new.user_id)) then raise exception 'A friendship request or friendship already exists.'; end if;
 end if;
 return new;
end; $$;
drop trigger if exists guard_friendship_insert on public.friendships;
create trigger guard_friendship_insert before insert on public.friendships for each row execute function public.guard_friendship_insert();
revoke all on function public.guard_friendship_insert() from public,anon,authenticated;

drop policy if exists "conversation participants read" on public.conversations;
create policy "conversation participants read" on public.conversations for select to authenticated
using (((select auth.uid())=user_a or (select auth.uid())=user_b) and not public.is_blocked_between(user_a,user_b));
drop policy if exists "friends create conversation" on public.conversations;
create policy "friends create conversation" on public.conversations for insert to authenticated
with check (((select auth.uid())=user_a or (select auth.uid())=user_b) and public.are_friends(user_a,user_b));
drop policy if exists "conversation participants read messages" on public.messages;
create policy "conversation participants read messages" on public.messages for select to authenticated
using (exists(select 1 from public.conversations c where c.id=messages.conversation_id and ((select auth.uid())=c.user_a or (select auth.uid())=c.user_b) and not public.is_blocked_between(c.user_a,c.user_b)));
drop policy if exists "friends send messages as self" on public.messages;
create policy "friends send messages as self" on public.messages for insert to authenticated
with check (sender_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=messages.conversation_id and ((select auth.uid())=c.user_a or (select auth.uid())=c.user_b) and public.are_friends(c.user_a,c.user_b)));

create table if not exists public.student_feedback (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 type text not null check(type in ('bug','feature','feedback')),
 title text not null check(char_length(title) between 1 and 100),
 area text not null default 'Not sure' check(char_length(area)<=80),
 details text not null check(char_length(details) between 1 and 2000),
 priority text not null default 'normal' check(priority in ('low','normal','high')),
 status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),
 created_at timestamptz not null default now()
);
alter table public.student_feedback enable row level security;
drop policy if exists "students submit own feedback" on public.student_feedback;
create policy "students submit own feedback" on public.student_feedback for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists "students read own feedback" on public.student_feedback;
create policy "students read own feedback" on public.student_feedback for select to authenticated using(user_id=(select auth.uid()));
grant select,insert on public.student_feedback to authenticated;
revoke update,delete on public.student_feedback from anon,authenticated;
create index if not exists student_feedback_user_created_idx on public.student_feedback(user_id,created_at desc);

create index if not exists blocks_blocked_id_idx on public.blocks(blocked_id);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comments_user_id_idx on public.comments(user_id);
create index if not exists conversations_user_b_idx on public.conversations(user_b);
create index if not exists friendships_friend_id_idx on public.friendships(friend_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists poll_votes_user_id_idx on public.poll_votes(user_id);
create index if not exists post_likes_user_id_idx on public.post_likes(user_id);
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists reports_reporter_id_idx on public.reports(reporter_id);
create index if not exists ttt_games_current_turn_idx on public.ttt_games(current_turn);
create index if not exists ttt_games_winner_id_idx on public.ttt_games(winner_id);

alter function public.touch_updated_at() set search_path=pg_catalog,public;
alter function public.handle_new_user() set search_path=pg_catalog,public;
revoke all on function public.handle_new_user() from public,anon,authenticated;

do $$ begin alter publication supabase_realtime add table public.post_likes;
exception when duplicate_object then null; when undefined_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.friendships;
exception when duplicate_object then null; when undefined_object then null; end $$;

