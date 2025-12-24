/*
  # Add Daily Claim Tracking System

  1. Changes
    - Add `total_claims` column to profiles table to track lifetime claims
    - Add `daily_claim_amount` column to store the calculated claimable amount
    - Set base claim amount to 1 KRAKO with 0.05 increment per claim

  2. Details
    - `total_claims` tracks how many times a user has claimed (starts at 0)
    - `daily_claim_amount` is calculated as: 1 + (0.05 * total_claims)
    - Users can claim once per day (enforced via last_claim_at)
    - Each successful claim increments total_claims and updates daily_claim_amount

  3. Notes
    - Existing users start with 0 claims and base amount of 1 KRAKO
    - Formula ensures progressive increase: 1.00, 1.05, 1.10, 1.15, etc.
*/

-- Add total_claims column to track lifetime claims
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'total_claims'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_claims integer DEFAULT 0;
  END IF;
END $$;

-- Add daily_claim_amount column to store calculated claimable amount
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'daily_claim_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN daily_claim_amount numeric DEFAULT 1.00;
  END IF;
END $$;

-- Update existing users to have proper initial values
UPDATE profiles 
SET 
  total_claims = COALESCE(total_claims, 0),
  daily_claim_amount = 1.00
WHERE total_claims IS NULL OR daily_claim_amount IS NULL;
