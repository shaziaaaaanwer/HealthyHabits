/*
  # Add user_id column to habit_streaks table

  1. Schema Changes
    - Add `user_id` column to `habit_streaks` table
    - Set up foreign key constraint to `auth.users(id)`
    - Add index for performance
    - Populate existing records with user_id from habits table

  2. Security
    - Update RLS policies to use the new user_id column for better performance
    - Maintain existing security model

  3. Data Migration
    - Backfill existing habit_streaks records with correct user_id values
*/

-- Add user_id column to habit_streaks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'habit_streaks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE habit_streaks ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Populate user_id for existing records
UPDATE habit_streaks 
SET user_id = habits.user_id 
FROM habits 
WHERE habit_streaks.habit_id = habits.id 
AND habit_streaks.user_id IS NULL;

-- Make user_id NOT NULL after populating existing data
ALTER TABLE habit_streaks ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_streaks_user_id_fkey'
  ) THEN
    ALTER TABLE habit_streaks 
    ADD CONSTRAINT habit_streaks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add index for performance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_habit_streaks_user_id'
  ) THEN
    CREATE INDEX idx_habit_streaks_user_id ON habit_streaks(user_id);
  END IF;
END $$;

-- Update RLS policies to use user_id directly for better performance
DROP POLICY IF EXISTS "Users can manage own habit streaks" ON habit_streaks;
DROP POLICY IF EXISTS "Users can view own habit streaks" ON habit_streaks;

-- Create new policies using user_id directly
CREATE POLICY "Users can manage own habit streaks"
  ON habit_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own habit streaks"
  ON habit_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);