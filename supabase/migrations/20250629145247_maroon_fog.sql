/*
  # Add user_id column to habit_streaks table

  1. Schema Changes
    - Add `user_id` column to `habit_streaks` table if it doesn't exist
    - Set up foreign key constraint to users table
    - Add index for performance
    - Update existing records to have proper user_id values

  2. Security
    - Update RLS policies to use user_id for access control
    - Ensure users can only access their own streak data

  3. Data Migration
    - Populate user_id for existing records based on habit ownership
*/

-- Add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'habit_streaks' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE habit_streaks ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Update existing records to have the correct user_id based on habit ownership
UPDATE habit_streaks 
SET user_id = habits.user_id 
FROM habits 
WHERE habit_streaks.habit_id = habits.id 
AND habit_streaks.user_id IS NULL;

-- Make user_id NOT NULL after populating existing records
ALTER TABLE habit_streaks ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'habit_streaks_user_id_fkey'
  ) THEN
    ALTER TABLE habit_streaks 
    ADD CONSTRAINT habit_streaks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add index for user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_habit_streaks_user_id'
  ) THEN
    CREATE INDEX idx_habit_streaks_user_id ON habit_streaks(user_id);
  END IF;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own habit streaks" ON habit_streaks;
DROP POLICY IF EXISTS "Users can manage own habit streaks" ON habit_streaks;

-- Create updated RLS policies
CREATE POLICY "Users can view own habit streaks"
  ON habit_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own habit streaks"
  ON habit_streaks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE habit_streaks ENABLE ROW LEVEL SECURITY;