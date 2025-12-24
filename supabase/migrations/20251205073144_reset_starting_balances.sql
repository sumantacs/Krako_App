/*
  # Reset Starting Balances to Zero

  ## Changes
  - Update profiles table default krako_balance from 209.057533250 to 0
  - All new users will now start with 0 KRAKO points
  - Allows users to earn from scratch

  ## Note
  This only affects NEW profiles created after this migration.
  Existing profiles are not modified.
*/

-- Update the default value for krako_balance to 0
ALTER TABLE profiles 
ALTER COLUMN krako_balance SET DEFAULT 0;
