-- StudentLink safe performance maintenance.
-- Add only missing foreign-key indexes reported by Supabase advisors.
-- Intentionally does not drop tables, rows, policies, functions, or existing indexes.
create index if not exists connect_four_games_current_turn_idx
  on public.connect_four_games (current_turn);
create index if not exists connect_four_games_player_one_idx
  on public.connect_four_games (player_one);
create index if not exists connect_four_games_player_two_idx
  on public.connect_four_games (player_two);
create index if not exists connect_four_games_winner_id_idx
  on public.connect_four_games (winner_id);
create index if not exists rps_games_player_one_idx
  on public.rps_games (player_one);
create index if not exists rps_games_player_two_idx
  on public.rps_games (player_two);
create index if not exists rps_games_winner_id_idx
  on public.rps_games (winner_id);
