/*
  # Remove Instagram Link from Tasks

  1. Changes
    - Update the "Share Story" task to remove Instagram link
    - Change action_url from Instagram to a general sharing link
  
  2. Security
    - No RLS changes needed
  
  Notes:
    - This removes the Instagram reference from the tasks table
    - Users will now see the task without an Instagram link
*/

UPDATE tasks
SET action_url = '#'
WHERE name = 'Share Story' 
  AND action_url LIKE '%instagram%';