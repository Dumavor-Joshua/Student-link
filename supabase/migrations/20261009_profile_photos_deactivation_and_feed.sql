-- StudentLink profile photos, reversible profile deactivation, and randomized feed.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

DROP POLICY IF EXISTS "profiles readable by signed-in users" ON public.profiles;
DROP POLICY IF EXISTS "profiles readable while active" ON public.profiles;
CREATE POLICY "profiles readable while active" ON public.profiles
FOR SELECT TO authenticated USING (deleted_at IS NULL OR id=(SELECT auth.uid()));

DROP POLICY IF EXISTS "posts read signed-in" ON public.posts;
DROP POLICY IF EXISTS "posts read while author active" ON public.posts;
CREATE POLICY "posts read while author active" ON public.posts
FOR SELECT TO authenticated USING (EXISTS (
 SELECT 1 FROM public.profiles author
 WHERE author.id=posts.user_id AND author.deleted_at IS NULL
));

CREATE OR REPLACE FUNCTION public.get_studentlink_feed(p_school_only boolean DEFAULT false,p_limit integer DEFAULT 40)
RETURNS SETOF public.posts
LANGUAGE sql VOLATILE SECURITY INVOKER
SET search_path=pg_catalog,public
AS $$
 SELECT p.* FROM public.posts p
 JOIN public.profiles author ON author.id=p.user_id
 WHERE author.deleted_at IS NULL
 AND (NOT COALESCE(p_school_only,false) OR author.school=(
   SELECT me.school FROM public.profiles me
   WHERE me.id=(SELECT auth.uid()) AND me.deleted_at IS NULL
 ))
 ORDER BY random()
 LIMIT LEAST(GREATEST(COALESCE(p_limit,40),1),40);
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

-- Active accounts only can create posts, likes, comments or votes.
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
