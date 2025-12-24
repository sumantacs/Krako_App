/*
  # Update Krako Balance Starting Value

  1. Changes
    - Set default krako_balance to 0 (starting from zero)
    - Update existing profiles to start from 0 if needed
  
  2. Notes
    - Supports decimal increments (0.5)
    - Numeric type already supports decimals
*/

-- Update the default value for new profiles to start at 0
ALTER TABLE profiles ALTER COLUMN krako_balance SET DEFAULT 0;

-- Update existing profiles to 0 (optional - uncomment if you want to reset all users)
-- UPDATE profiles SET krako_balance = 0;
