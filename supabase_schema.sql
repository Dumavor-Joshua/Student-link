-- StudentLink Supabase database schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,nickname text not null check(char_length(nickname) between 3 and 24),school text not null default '' check(char_length(school)<=90),bio text not null default '' check(char_length(bio)<=240),class_year text not null default '' check(char_length(class_year)<=40),interests text not null default '' check(char_length(interests)<=160),created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create unique index if not exists profiles_nickname_lower_unique on public.profiles(lower(nickname));
create table if not exists public.posts(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,body text not null check(char_length(body) between 1 and 1500),image_url text,post_type text not null default 'text' check(post_type in ('text','poll')),poll_question text,poll_options jsonb not null default '[]'::jsonb,created_at timestamptz not null default now(),check(post_type<>'poll' or (poll_question is not null and jsonb_typeof(poll_options)='array' and jsonb_array_length(poll_options) between 2 and 4)));
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create table if not exists public.post_likes(post_id uuid not null references public.posts(id) on delete cascade,user_id uuid not null references public.profiles(id) on delete cascade,created_at timestamptz not null default now(),primary key(post_id,user_id));
create table if not exists public.comments(id uuid primary key default gen_random_uuid(),post_id uuid not null references public.posts(id) on delete cascade,user_id uuid not null references public.profiles(id) on delete cascade,body text not null check(char_length(body) between 1 and 600),created_at timestamptz not null default now());
create table if not exists public.friendships(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles(id) on delete cascade,friend_id uuid not null references public.profiles(id) on delete cascade,status text not null default 'pending' check(status in ('pending','accepted')),created_at timestamptz not null default now(),check(user_id<>friend_id),unique(user_id,friend_id));
create table if not exists public.conversations(id uuid primary key default gen_random_uuid(),user_a uuid not null references public.profiles(id) on delete cascade,user_b uuid not null references public.profiles(id) on delete cascade,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(user_a<>user_b),check(user_a<user_b),unique(user_a,user_b));
create table if not exists public.messages(id uuid primary key default gen_random_uuid(),conversation_id uuid not null references public.conversations(id) on delete cascade,sender_id uuid not null references public.profiles(id) on delete cascade,body text not null check(char_length(body) between 1 and 1500),created_at timestamptz not null default now());
create index if not exists messages_conversation_created_idx on public.messages(conversation_id,created_at);
create table if not exists public.poll_votes(post_id uuid not null references public.posts(id) on delete cascade,user_id uuid not null references public.profiles(id) on delete cascade,option_index integer not null check(option_index between 0 and 3),created_at timestamptz not null default now(),primary key(post_id,user_id));
create table if not exists public.reports(id uuid primary key default gen_random_uuid(),reporter_id uuid not null references public.profiles(id) on delete cascade,content_type text not null check(content_type in ('post','comment','profile','message')),content_id uuid not null,reason text not null check(char_length(reason) between 1 and 100),details text not null default '' check(char_length(details)<=500),status text not null default 'open' check(status in ('open','reviewing','resolved','dismissed')),created_at timestamptz not null default now());
create table if not exists public.blocks(blocker_id uuid not null references public.profiles(id) on delete cascade,blocked_id uuid not null references public.profiles(id) on delete cascade,created_at timestamptz not null default now(),primary key(blocker_id,blocked_id),check(blocker_id<>blocked_id));
create or replace function public.are_friends(a uuid,b uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from public.friendships f where f.status='accepted' and ((f.user_id=a and f.friend_id=b) or (f.user_id=b and f.friend_id=a)));$$;
revoke all on function public.are_friends(uuid,uuid) from public;grant execute on function public.are_friends(uuid,uuid) to authenticated;
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end;$$;
drop trigger if exists profiles_touch_updated_at on public.profiles;create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists conversations_touch_updated_at on public.conversations;create trigger conversations_touch_updated_at before update on public.conversations for each row execute function public.touch_updated_at();
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$declare n text;begin n:=left(coalesce(nullif(trim(new.raw_user_meta_data->>'nickname'),''),'Student_'||substr(new.id::text,1,8)),24);insert into public.profiles(id,nickname,school) values(new.id,n,left(coalesce(new.raw_user_meta_data->>'school',''),90)) on conflict(id) do nothing;return new;end;$$;
drop trigger if exists on_auth_user_created on auth.users;create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
-- Enable row-level security everywhere.
do $$ declare t text;begin foreach t in array array['profiles','posts','post_likes','comments','friendships','conversations','messages','poll_votes','reports','blocks'] loop execute format('alter table public.%I enable row level security',t);end loop;end $$;
create policy "profiles readable by signed-in users" on public.profiles for select to authenticated using(true);
create policy "profile owner inserts" on public.profiles for insert to authenticated with check(id=auth.uid());
create policy "profile owner updates" on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy "posts read signed-in" on public.posts for select to authenticated using(true);
create policy "create own posts" on public.posts for insert to authenticated with check(user_id=auth.uid());
create policy "update own posts" on public.posts for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "delete own posts" on public.posts for delete to authenticated using(user_id=auth.uid());
create policy "likes readable" on public.post_likes for select to authenticated using(true);
create policy "like as self" on public.post_likes for insert to authenticated with check(user_id=auth.uid());
create policy "unlike as self" on public.post_likes for delete to authenticated using(user_id=auth.uid());
create policy "comments readable" on public.comments for select to authenticated using(true);
create policy "comment as self" on public.comments for insert to authenticated with check(user_id=auth.uid());
create policy "delete own comments" on public.comments for delete to authenticated using(user_id=auth.uid());
create policy "participants read friendships" on public.friendships for select to authenticated using(user_id=auth.uid() or friend_id=auth.uid());
create policy "send own request" on public.friendships for insert to authenticated with check(user_id=auth.uid() and status='pending');
create policy "recipient accepts request" on public.friendships for update to authenticated using(friend_id=auth.uid() and status='pending') with check(friend_id=auth.uid() and status='accepted');
create policy "participants delete friendship" on public.friendships for delete to authenticated using(user_id=auth.uid() or friend_id=auth.uid());
create policy "conversation participants read" on public.conversations for select to authenticated using(auth.uid()=user_a or auth.uid()=user_b);
create policy "friends create conversation" on public.conversations for insert to authenticated with check((auth.uid()=user_a or auth.uid()=user_b) and public.are_friends(user_a,user_b));
create policy "conversation participants update" on public.conversations for update to authenticated using(auth.uid()=user_a or auth.uid()=user_b) with check(auth.uid()=user_a or auth.uid()=user_b);
create policy "conversation participants read messages" on public.messages for select to authenticated using(exists(select 1 from public.conversations c where c.id=conversation_id and (c.user_a=auth.uid() or c.user_b=auth.uid())));
create policy "friends send messages as self" on public.messages for insert to authenticated with check(sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and (c.user_a=auth.uid() or c.user_b=auth.uid()) and public.are_friends(c.user_a,c.user_b)));
create policy "votes readable" on public.poll_votes for select to authenticated using(true);
create policy "vote as self" on public.poll_votes for insert to authenticated with check(user_id=auth.uid());
create policy "update own vote" on public.poll_votes for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "create reports as self" on public.reports for insert to authenticated with check(reporter_id=auth.uid());
create policy "read own reports" on public.reports for select to authenticated using(reporter_id=auth.uid());
create policy "manage own blocks" on public.blocks for all to authenticated using(blocker_id=auth.uid()) with check(blocker_id=auth.uid());
grant usage on schema public to authenticated;grant select,insert,update,delete on public.profiles,public.posts,public.post_likes,public.comments,public.friendships,public.conversations,public.messages,public.poll_votes,public.reports,public.blocks to authenticated;
-- Enable posts and messages in Supabase Dashboard > Database > Replication for realtime updates.
do $$ begin alter publication supabase_realtime add table public.messages;exception when duplicate_object then null;when undefined_object then null;end $$;
do $$ begin alter publication supabase_realtime add table public.posts;exception when duplicate_object then null;when undefined_object then null;end $$;


-- Optional profile photos, recoverable deactivation, and randomized school feed.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
DROP POLICY IF EXISTS "profiles readable by signed-in users" ON public.profiles;
DROP POLICY IF EXISTS "profiles readable while active" ON public.profiles;
CREATE POLICY "profiles readable while active" ON public.profiles FOR SELECT TO authenticated
USING(deleted_at IS NULL OR id=(SELECT auth.uid()));
DROP POLICY IF EXISTS "posts read signed-in" ON public.posts;
DROP POLICY IF EXISTS "posts read while author active" ON public.posts;
CREATE POLICY "posts read while author active" ON public.posts FOR SELECT TO authenticated
USING(EXISTS(SELECT 1 FROM public.profiles author WHERE author.id=posts.user_id AND author.deleted_at IS NULL));
CREATE OR REPLACE FUNCTION public.get_studentlink_feed(p_school_only boolean DEFAULT false,p_limit integer DEFAULT 40)
RETURNS SETOF public.posts LANGUAGE sql VOLATILE SECURITY INVOKER SET search_path=pg_catalog,public AS $$
 SELECT p.* FROM public.posts p JOIN public.profiles author ON author.id=p.user_id
 WHERE author.deleted_at IS NULL AND (NOT COALESCE(p_school_only,false) OR author.school=(SELECT me.school FROM public.profiles me WHERE me.id=(SELECT auth.uid()) AND me.deleted_at IS NULL))
 ORDER BY random() LIMIT LEAST(GREATEST(COALESCE(p_limit,40),1),40);
$$;
REVOKE ALL ON FUNCTION public.get_studentlink_feed(boolean,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_studentlink_feed(boolean,integer) TO authenticated;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('profile-photos','profile-photos',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT(id) DO UPDATE SET public=true,file_size_limit=5242880,allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp'];
DROP POLICY IF EXISTS "Students upload their own profile photos" ON storage.objects;
CREATE POLICY "Students upload their own profile photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK(bucket_id='profile-photos' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
DROP POLICY IF EXISTS "Students delete their own profile photos" ON storage.objects;
CREATE POLICY "Students delete their own profile photos" ON storage.objects FOR DELETE TO authenticated
USING(bucket_id='profile-photos' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);

-- Hide activity from deactivated accounts and prevent them from writing new activity.
DROP POLICY IF EXISTS "create own posts" ON public.posts;
CREATE POLICY "create own posts" ON public.posts FOR INSERT TO authenticated
WITH CHECK(user_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=(SELECT auth.uid()) AND p.deleted_at IS NULL));

DROP POLICY IF EXISTS "like as self" ON public.post_likes;
CREATE POLICY "like as self" ON public.post_likes FOR INSERT TO authenticated
WITH CHECK(user_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=(SELECT auth.uid()) AND p.deleted_at IS NULL) AND EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=post_likes.post_id AND author.deleted_at IS NULL));

DROP POLICY IF EXISTS "comment as self" ON public.comments;
CREATE POLICY "comment as self" ON public.comments FOR INSERT TO authenticated
WITH CHECK(user_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=(SELECT auth.uid()) AND p.deleted_at IS NULL) AND EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=comments.post_id AND author.deleted_at IS NULL));

DROP POLICY IF EXISTS "vote as self" ON public.poll_votes;
CREATE POLICY "vote as self" ON public.poll_votes FOR INSERT TO authenticated
WITH CHECK(user_id=(SELECT auth.uid()) AND EXISTS(SELECT 1 FROM public.profiles p WHERE p.id=(SELECT auth.uid()) AND p.deleted_at IS NULL) AND EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=poll_votes.post_id AND author.deleted_at IS NULL));

DROP POLICY IF EXISTS "comments readable" ON public.comments;
CREATE POLICY "comments readable on active posts" ON public.comments FOR SELECT TO authenticated
USING(EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=comments.post_id AND author.deleted_at IS NULL));

DROP POLICY IF EXISTS "likes readable" ON public.post_likes;
CREATE POLICY "likes readable on active posts" ON public.post_likes FOR SELECT TO authenticated
USING(EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=post_likes.post_id AND author.deleted_at IS NULL));

DROP POLICY IF EXISTS "votes readable" ON public.poll_votes;
CREATE POLICY "votes readable on active posts" ON public.poll_votes FOR SELECT TO authenticated
USING(EXISTS(SELECT 1 FROM public.posts post JOIN public.profiles author ON author.id=post.user_id WHERE post.id=poll_votes.post_id AND author.deleted_at IS NULL));


-- Optional images attached to text posts.
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url text;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('post-images','post-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT(id) DO UPDATE SET public=true,file_size_limit=5242880,allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS "Students upload their own post images" ON storage.objects;
CREATE POLICY "Students upload their own post images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK(bucket_id='post-images' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);

DROP POLICY IF EXISTS "Students delete their own post images" ON storage.objects;
CREATE POLICY "Students delete their own post images" ON storage.objects FOR DELETE TO authenticated
USING(bucket_id='post-images' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
