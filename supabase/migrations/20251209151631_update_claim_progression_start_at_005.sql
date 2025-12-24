/*
  # Update Daily Claim Progression to Start at 0.05

  1. Changes
    - Update daily_claim_amount to start at 0.05 KRAKO
    - Claims increase by 0.05 per claim until reaching 1.00 KRAKO maximum
    - After reaching 1.00, all future claims remain at 1.00

  2. Details
    - Claim 1: 0.05 KRAKO
    - Claim 2: 0.10 KRAKO
    - Claim 3: 0.15 KRAKO
    - ...
    - Claim 20: 1.00 KRAKO
    - Claim 21+: 1.00 KRAKO (capped)

  3. Notes
    - Resets all existing users to start at 0.05
    - Total claims counter remains unchanged
*/

-- Update default value for new profiles
ALTER TABLE profiles ALTER COLUMN daily_claim_amount SET DEFAULT 0.05;

-- Reset existing users to start from 0.05
UPDATE profiles 
SET 
  daily_claim_amount = LEAST(0.05 * (total_claims + 1), 1.00)
WHERE daily_claim_amount IS NOT NULL;
