/*
  # Fix habit streaks function syntax error

  1. Database Changes
    - Drop and recreate the update_habit_streak function with proper syntax
    - Fix variable naming conflict with PostgreSQL reserved word 'current_date'
    - Ensure proper RLS handling in the function

  2. Security
    - Function runs with SECURITY DEFINER to bypass RLS during execution
    - All operations use the authenticated user's ID for proper access control
*/

-- Drop the trigger first to remove dependency
DROP TRIGGER IF EXISTS trigger_update_habit_streak ON habit_entries;

-- Now drop the function
DROP FUNCTION IF EXISTS update_habit_streak();

-- Create the updated function with proper RLS handling and fixed syntax
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  habit_user_id uuid;
  entry_date date;
  streak_count integer := 0;
  max_streak integer := 0;
  check_date date;
  entry_exists boolean;
BEGIN
  -- Get the entry date (renamed to avoid conflict with current_date function)
  entry_date := NEW.date;
  
  -- Get the user_id for this habit to ensure RLS compliance
  habit_user_id := NEW.user_id;
  
  -- Only process if the entry is marked as completed
  IF NEW.completed = true THEN
    -- Calculate current streak by counting consecutive days backwards from entry date
    check_date := entry_date;
    
    LOOP
      -- Check if there's a completed entry for this date
      SELECT EXISTS(
        SELECT 1 FROM habit_entries 
        WHERE habit_id = NEW.habit_id 
        AND date = check_date 
        AND completed = true
        AND user_id = habit_user_id
      ) INTO entry_exists;
      
      -- If no entry exists for this date, break the streak
      IF NOT entry_exists THEN
        EXIT;
      END IF;
      
      -- Increment streak and check previous day
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    END LOOP;
    
    -- Get the current longest streak to compare
    SELECT COALESCE(longest_streak, 0) INTO max_streak
    FROM habit_streaks 
    WHERE habit_id = NEW.habit_id AND user_id = habit_user_id;
    
    -- Update max_streak if current streak is longer
    IF streak_count > max_streak THEN
      max_streak := streak_count;
    END IF;
    
    -- Insert or update the habit streak record
    INSERT INTO habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed)
    VALUES (NEW.habit_id, habit_user_id, streak_count, max_streak, entry_date)
    ON CONFLICT (habit_id) 
    DO UPDATE SET 
      current_streak = streak_count,
      longest_streak = GREATEST(habit_streaks.longest_streak, max_streak),
      last_completed = entry_date,
      user_id = habit_user_id;
      
  ELSE
    -- If habit is marked as not completed, reset current streak but keep longest streak
    INSERT INTO habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed)
    VALUES (NEW.habit_id, habit_user_id, 0, COALESCE((
      SELECT longest_streak FROM habit_streaks 
      WHERE habit_id = NEW.habit_id AND user_id = habit_user_id
    ), 0), NULL)
    ON CONFLICT (habit_id) 
    DO UPDATE SET 
      current_streak = 0,
      user_id = habit_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER trigger_update_habit_streak
  AFTER INSERT OR UPDATE ON habit_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();