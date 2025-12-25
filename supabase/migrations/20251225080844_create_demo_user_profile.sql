/*
  # Create Demo User Profile

  ## Overview
  Creates a demo user profile with UUID '00000000-0000-0000-0000-000000000000'
  for users who haven't signed in yet.

  ## Changes Made
  
  1. **Insert Demo User Profile**
     - Creates profile with default values
     - Sets krako_balance to 0
     - Sets hashrate to 3 GH/s
     - Initializes daily claim tracking
  
  ## Security
  - Uses ON CONFLICT DO NOTHING to prevent duplicate entries
  - RLS policies already configured in previous migration
*/

-- Insert demo user profile if it doesn't exist
INSERT INTO profiles (
  id,
  email,
  username,
  krako_balance,
  hashrate,
  total_invites,
  total_claims,
  daily_claim_amount,
  daily_claims_count,
  last_claim_date
)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  NULL,
  'Demo Miner',
  0,
  3,
  0,
  0,
  0.05,
  0,
  CURRENT_DATE
)
ON CONFLICT (id) DO NOTHING;