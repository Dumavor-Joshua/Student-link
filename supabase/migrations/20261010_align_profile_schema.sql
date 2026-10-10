-- Keep profile schema compatible with profile photos, recoverable profile hiding, and public details.
-- Safe to run repeatedly on existing projects.
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists deleted_at timestamptz;
alter table public.profiles add column if not exists bio text not null default '';
alter table public.profiles add column if not exists class_year text not null default '';
alter table public.profiles add column if not exists interests text not null default '';
alter table public.profiles drop constraint if exists profiles_bio_length_check;
alter table public.profiles add constraint profiles_bio_length_check check (char_length(bio) <= 240);
alter table public.profiles drop constraint if exists profiles_class_year_length_check;
alter table public.profiles add constraint profiles_class_year_length_check check (char_length(class_year) <= 40);
alter table public.profiles drop constraint if exists profiles_interests_length_check;
alter table public.profiles add constraint profiles_interests_length_check check (char_length(interests) <= 160);
