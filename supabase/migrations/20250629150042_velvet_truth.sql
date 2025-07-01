/*
  # Fix RLS policies for habit_streaks table

  1. Problem
    - The trigger function `update_habit_streak()` is being blocked by RLS policies
    - When users toggle habit entries, the trigger tries to update habit_streaks but fails
    
  2. Solution
    - Update RLS policies to allow proper INSERT and UPDATE operations
    - Ensure the trigger function can create new streak records when needed
    - Maintain security by keeping user_id restrictions
    
  3. Changes
    - Drop existing restrictive policies
    - Create new policies that allow both INSERT and UPDATE operations
    - Ensure users can only access their own streak data
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can manage own habit streaks" ON habit_streaks;
DROP POLICY IF EXISTS "Users can view own habit streaks" ON habit_streaks;

-- Create comprehensive policies for habit_streaks
CREATE POLICY "Users can insert own habit streaks"
  ON habit_streaks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select own habit streaks"
  ON habit_streaks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own habit streaks"
  ON habit_streaks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit streaks"
  ON habit_streaks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);