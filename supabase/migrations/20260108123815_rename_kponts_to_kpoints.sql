/*
  # Rename KPONTS to KPOINTS throughout database

  1. Changes
    - Rename `kponts_required` column to `kpoints_required` in `reward_utilities` table
    - Rename `kponts_spent` column to `kpoints_spent` in `user_redemptions` table
  
  2. Notes
    - This is a simple column rename operation
    - Data is preserved during the rename
    - No impact on existing data or functionality
*/

-- Rename column in reward_utilities table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reward_utilities' AND column_name = 'kponts_required'
  ) THEN
    ALTER TABLE reward_utilities RENAME COLUMN kponts_required TO kpoints_required;
  END IF;
END $$;

-- Rename column in user_redemptions table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_redemptions' AND column_name = 'kponts_spent'
  ) THEN
    ALTER TABLE user_redemptions RENAME COLUMN kponts_spent TO kpoints_spent;
  END IF;
END $$;