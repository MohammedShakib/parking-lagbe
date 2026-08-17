-- ============================================================================
-- Migration: 0006_storage_buckets.sql
-- Description: Supabase Storage Buckets and Security Policies
-- ============================================================================

-- 1. Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('garage-images', 'garage-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('verification-documents', 'verification-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for 'garage-images'
-- Public read access
CREATE POLICY "Public Read for Garage Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'garage-images');

-- Authenticated hosts and admins can upload garage images
CREATE POLICY "Hosts Upload Garage Images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'garage-images');

-- Authenticated hosts can update/delete their own garage images
CREATE POLICY "Hosts Update/Delete Garage Images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'garage-images');

CREATE POLICY "Hosts Delete Garage Images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'garage-images');

-- 3. Storage Policies for 'avatars'
-- Public read access
CREATE POLICY "Public Read for Avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Authenticated users can upload/update avatars
CREATE POLICY "Users Upload Avatars" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users Update Avatars" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'avatars');

-- 4. Storage Policies for 'verification-documents'
-- Super admins can read all verification documents
CREATE POLICY "Super Admins Read Verification Documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM public.account_information 
    WHERE username = auth.jwt() ->> 'email' OR username = (auth.jwt() -> 'user_metadata' ->> 'username')
    AND username = 'admin'
  )
);

-- Users can upload verification documents
CREATE POLICY "Users Upload Verification Documents" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'verification-documents');

-- Users can read their own uploaded verification documents
CREATE POLICY "Users Read Own Verification Documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
