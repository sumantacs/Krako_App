/*
  # Update Daily Claim System - Multiple Claims Per Day

  1. Changes
    - Add `daily_claims_count` column to track claims made today
    - Add `last_claim_date` column to track the date of last claim (not timestamp)
    - Keep `daily_claim_amount` fixed at 0.05 per claim
    - Allow up to 20 claims per day (totaling 1.00 KRAKO maximum)

  2. Details
    - Each claim gives exactly 0.05 KRAKO
    - Users can claim up to 20 times per day
    - Counter resets at midnight (new day)
    - Formula: 0.05 × claims_today (max 20 claims = 1.00 KRAKO)

  3. Security
    - Maintain existing RLS policies
    - Track daily usage to prevent abuse

  4. Notes
    - Existing users start with 0 claims today
    - Daily limit ensures fair distribution
    - Simple, predictable reward system
*/

-- Add daily_claims_count column to track claims made today
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'daily_claims_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN daily_claims_count integer DEFAULT 0;
  END IF;
END $$;

-- Add last_claim_date column to track the date (not timestamp) of last claim
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_claim_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_claim_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Initialize new columns for existing users
UPDATE profiles 
SET 
  daily_claims_count = 0,
  last_claim_date = CURRENT_DATE,
  daily_claim_amount = 0.05
WHERE daily_claims_count IS NULL OR last_claim_date IS NULL;