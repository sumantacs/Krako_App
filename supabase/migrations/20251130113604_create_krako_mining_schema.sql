/*
  # Krako Mining App Database Schema

  ## Overview
  This migration creates the complete database structure for the Krako Mining & Rewards app,
  including user profiles, tasks, shop items, invites, and transactions.

  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key) - User identifier
  - `username` (text) - Display name
  - `krako_balance` (numeric) - Total KRAKO points balance
  - `hashrate` (integer) - Mining hashrate in GH/s
  - `last_claim_at` (timestamptz) - Last time user claimed rewards
  - `total_invites` (integer) - Number of successful invites
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `tasks`
  - `id` (uuid, primary key) - Task identifier
  - `name` (text) - Task name
  - `description` (text) - Task description
  - `reward` (numeric) - KRAKO reward amount
  - `icon` (text) - Icon identifier
  - `action_url` (text) - Link for task completion
  - `task_type` (text) - Type of task (social, community, etc.)
  - `is_active` (boolean) - Whether task is currently available
  - `created_at` (timestamptz) - Task creation timestamp

  ### 3. `user_tasks`
  - `id` (uuid, primary key) - Record identifier
  - `user_id` (uuid, foreign key) - Reference to profiles
  - `task_id` (uuid, foreign key) - Reference to tasks
  - `completed_at` (timestamptz) - Task completion timestamp
  - `reward_claimed` (boolean) - Whether reward was claimed

  ### 4. `shop_items`
  - `id` (uuid, primary key) - Item identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price_ton` (numeric) - Price in TON tokens
  - `krako_amount` (numeric) - KRAKO tokens included
  - `discount_percent` (integer) - Discount percentage
  - `stock` (integer) - Available quantity
  - `image_url` (text) - Product image
  - `is_available` (boolean) - Whether item is in stock
  - `created_at` (timestamptz) - Item creation timestamp

  ### 5. `invites`
  - `id` (uuid, primary key) - Invite identifier
  - `inviter_id` (uuid, foreign key) - User who sent invite
  - `invited_id` (uuid, foreign key) - User who was invited
  - `reward_claimed` (boolean) - Whether reward was given
  - `created_at` (timestamptz) - Invite creation timestamp

  ### 6. `transactions`
  - `id` (uuid, primary key) - Transaction identifier
  - `user_id` (uuid, foreign key) - User who made transaction
  - `transaction_type` (text) - Type (claim, task, invite, purchase)
  - `amount` (numeric) - KRAKO amount (positive or negative)
  - `description` (text) - Transaction description
  - `created_at` (timestamptz) - Transaction timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Restrict task and shop item modifications to service role only
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL DEFAULT 'Miner',
  krako_balance numeric DEFAULT 209.057533250,
  hashrate integer DEFAULT 3,
  last_claim_at timestamptz DEFAULT now(),
  total_invites integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  reward numeric NOT NULL DEFAULT 1000,
  icon text DEFAULT 'star',
  action_url text,
  task_type text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_tasks junction table
CREATE TABLE IF NOT EXISTS user_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  reward_claimed boolean DEFAULT false,
  UNIQUE(user_id, task_id)
);

-- Create shop_items table
CREATE TABLE IF NOT EXISTS shop_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price_ton numeric NOT NULL,
  krako_amount numeric NOT NULL,
  discount_percent integer DEFAULT 0,
  stock integer DEFAULT 100,
  image_url text DEFAULT '',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  invited_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reward_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(inviter_id, invited_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_type text NOT NULL,
  amount numeric NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tasks policies (read-only for users)
CREATE POLICY "Anyone can view active tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User tasks policies
CREATE POLICY "Users can view own completed tasks"
  ON user_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task completions"
  ON user_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own task completions"
  ON user_tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Shop items policies (read-only for users)
CREATE POLICY "Anyone can view available shop items"
  ON shop_items FOR SELECT
  TO authenticated
  USING (is_available = true);

-- Invites policies
CREATE POLICY "Users can view invites they sent or received"
  ON invites FOR SELECT
  TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = invited_id);

CREATE POLICY "Users can create invites"
  ON invites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = inviter_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample tasks
INSERT INTO tasks (name, description, reward, icon, action_url, task_type) VALUES
  ('Boost Community', 'Join and boost our community', 2000, 'users', 'https://t.me/krakocommunity', 'community'),
  ('Krako Mining', 'Start mining KRAKO tokens', 2000, 'pickaxe', '#', 'mining'),
  ('Share Story', 'Share your mining story', 1000, 'share-2', 'https://instagram.com/krako', 'social'),
  ('Follow Krako X', 'Follow us on X (Twitter)', 1000, 'twitter', 'https://x.com/krakocrypto', 'social'),
  ('Join Telegram Channel', 'Join our main Telegram channel', 1000, 'send', 'https://t.me/krakoofficial', 'social'),
  ('TON Mine App', 'Download TON Mine App', 1000, 'download', 'https://ton.app', 'app'),
  ('TokenCarnivalNews', 'Subscribe to Token Carnival', 1000, 'newspaper', 'https://t.me/tokencarnival', 'news'),
  ('Mine XRP News', 'Join XRP mining news', 1000, 'coins', 'https://t.me/xrpnews', 'news'),
  ('Trump Hash Channel', 'Join Trump Hash channel', 1000, 'hash', 'https://t.me/trumphash', 'channel'),
  ('Auto Mine Channel', 'Subscribe to Auto Mine', 1000, 'zap', 'https://t.me/automine', 'channel'),
  ('Rich AI Channel', 'Join Rich AI community', 1000, 'brain', 'https://t.me/richai', 'channel'),
  ('Trump Coin Channel', 'Trump Coin updates', 1000, 'dollar-sign', 'https://t.me/trumpcoin', 'channel')
ON CONFLICT DO NOTHING;

-- Insert sample shop items
INSERT INTO shop_items (name, description, price_ton, krako_amount, discount_percent, stock) VALUES
  ('Starter Pack', '10000 KRAKO tokens', 2, 10000, 10, 100),
  ('Bronze Pack', '50000 KRAKO tokens', 10, 50000, 20, 100),
  ('Silver Pack', '100000 KRAKO tokens', 20, 100000, 30, 50),
  ('Gold Pack', '200000 KRAKO tokens', 40, 200000, 40, 50),
  ('Platinum Pack', '500000 KRAKO tokens', 100, 500000, 50, 20),
  ('Diamond Pack', '1000000 KRAKO tokens', 200, 1000000, 50, 10)
ON CONFLICT DO NOTHING;