/*
  # Add Profile Picture Storage

  1. Schema Changes
    - Add `profile_picture_url` column to `profiles` table
      - Stores the public URL of the user's uploaded profile picture
      - Nullable to allow users without profile pictures
  
  2. Storage Setup
    - Create `profile-pictures` storage bucket
    - Set bucket to be public for read access
    - Configure RLS policies for secure uploads
  
  3. Security
    - Users can only upload their own profile pictures
    - Users can only delete their own profile pictures
    - Anyone can view profile pictures (public read access)
  
  Notes:
    - Profile pictures are stored with user ID as filename prefix
    - Maximum file size handled by client-side validation
    - Supported formats: jpg, jpeg, png, webp
*/

-- Add profile_picture_url column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_picture_url text;
  END IF;
END $$;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;

-- Allow authenticated users to upload their own profile pictures
CREATE POLICY "Users can upload own profile picture"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own profile pictures
CREATE POLICY "Users can update own profile picture"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own profile pictures
CREATE POLICY "Users can delete own profile picture"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow everyone to view profile pictures (public bucket)
CREATE POLICY "Anyone can view profile pictures"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');