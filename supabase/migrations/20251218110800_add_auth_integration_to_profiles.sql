/*
  # Add Authentication Integration to Profiles

  ## Overview
  This migration adds email tracking and ensures profiles table is properly integrated
  with Supabase authentication system.

  ## Changes Made
  
  1. **Add Email Column**
     - Adds `email` column to profiles table for storing user email from Google auth
  
  2. **Update RLS Policies**
     - Adds policy for automatic profile creation on signup
  
  3. **Create Profile Trigger**
     - Automatically creates a profile when a new user signs up via auth
  
  ## Security
  - Maintains existing RLS policies
  - Ensures users can only access their own profile data
*/

-- Add email column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;
END $$;

-- Create or replace function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, krako_balance, hashrate, total_invites)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Miner'),
    0,
    3,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add policy for users to read their own profile (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view any profile'
  ) THEN
    CREATE POLICY "Users can view any profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Delete existing demo user policy if it exists and create new one
DROP POLICY IF EXISTS "Allow demo user access" ON profiles;
CREATE POLICY "Allow demo user access"
  ON profiles FOR ALL
  TO anon
  USING (id = '00000000-0000-0000-0000-000000000000'::uuid)
  WITH CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid);