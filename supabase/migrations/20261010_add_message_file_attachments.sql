-- Secure private file attachments for StudentLink conversations.
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_path text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_name text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_mime_type text;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_size bigint;
DO $$ BEGIN
  ALTER TABLE public.messages ADD CONSTRAINT messages_attachment_size_check
  CHECK(attachment_size IS NULL OR (attachment_size>0 AND attachment_size<5242880));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('message-files','message-files',false,5242880,NULL)
ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=5242880,allowed_mime_types=NULL;

DROP POLICY IF EXISTS "Conversation participants read message files" ON storage.objects;
CREATE POLICY "Conversation participants read message files" ON storage.objects FOR SELECT TO authenticated
USING(bucket_id='message-files' AND EXISTS(SELECT 1 FROM public.conversations c WHERE c.id::text=(storage.foldername(name))[1] AND (c.user_a=(SELECT auth.uid()) OR c.user_b=(SELECT auth.uid()))));

DROP POLICY IF EXISTS "Conversation participants upload message files" ON storage.objects;
CREATE POLICY "Conversation participants upload message files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK(bucket_id='message-files' AND (storage.foldername(name))[2]=(SELECT auth.uid())::text AND EXISTS(SELECT 1 FROM public.conversations c WHERE c.id::text=(storage.foldername(name))[1] AND (c.user_a=(SELECT auth.uid()) OR c.user_b=(SELECT auth.uid()))));

DROP POLICY IF EXISTS "Senders delete their own message files" ON storage.objects;
CREATE POLICY "Senders delete their own message files" ON storage.objects FOR DELETE TO authenticated
USING(bucket_id='message-files' AND (storage.foldername(name))[2]=(SELECT auth.uid())::text AND EXISTS(SELECT 1 FROM public.conversations c WHERE c.id::text=(storage.foldername(name))[1] AND (c.user_a=(SELECT auth.uid()) OR c.user_b=(SELECT auth.uid()))));
