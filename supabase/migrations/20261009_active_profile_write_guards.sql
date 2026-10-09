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
