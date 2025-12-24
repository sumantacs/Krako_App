/*
  # Reset All KRAKO Balances to Zero

  1. Changes
    - Reset all user krako_balance to 0
    - Reset all user total_claims to 0
    - Reset daily_claim_amount to 0.05 for fresh start

  2. Notes
    - Everyone starts fresh from 0 KRAKO Points
    - First claim will give 0.05 KPOINTS
*/

-- Reset all balances and claims to zero
UPDATE profiles 
SET 
  krako_balance = 0,
  total_claims = 0,
  daily_claim_amount = 0.05;
