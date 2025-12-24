/*
  # Add Demo User Policies

  1. Changes
    - Add policies to allow operations on demo user profile
    - Add policies for demo user transactions
    - Allow anonymous access for testing without authentication

  2. Security
    - Policies are restricted to specific demo user ID
    - In production, these should be replaced with proper auth-based policies
*/

-- Allow anyone to view and update the demo user profile
CREATE POLICY "Allow demo user profile read"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Allow demo user profile update"
  ON profiles FOR UPDATE
  TO anon, authenticated
  USING (id = '00000000-0000-0000-0000-000000000001')
  WITH CHECK (id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Allow demo user profile insert"
  ON profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (id = '00000000-0000-0000-0000-000000000001');

-- Allow anyone to view transactions for demo user
CREATE POLICY "Allow demo user transactions read"
  ON transactions FOR SELECT
  TO anon, authenticated
  USING (user_id = '00000000-0000-0000-0000-000000000001');

CREATE POLICY "Allow demo user transactions insert"
  ON transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

-- Allow anyone to view active tasks (update existing policy)
DROP POLICY IF EXISTS "Anyone can view active tasks" ON tasks;
CREATE POLICY "Anyone can view active tasks"
  ON tasks FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Allow anyone to view available shop items (update existing policy)
DROP POLICY IF EXISTS "Anyone can view available shop items" ON shop_items;
CREATE POLICY "Anyone can view available shop items"
  ON shop_items FOR SELECT
  TO anon, authenticated
  USING (is_available = true);