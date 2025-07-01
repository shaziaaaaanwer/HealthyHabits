/*
  # Create habits tracking schema

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text, optional)
      - `category` (text)
      - `frequency` (text)
      - `goal` (integer)
      - `color` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `habit_entries`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, references habits)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `completed` (boolean)
      - `created_at` (timestamp)
    
    - `habit_streaks`
      - `habit_id` (uuid, references habits, primary key)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `last_completed` (date)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'fitness',
  frequency text NOT NULL DEFAULT 'daily',
  goal integer NOT NULL DEFAULT 1,
  color text NOT NULL DEFAULT '#8B5CF6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create habit_entries table
CREATE TABLE IF NOT EXISTS habit_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, date)
);

-- Create habit_streaks table
CREATE TABLE IF NOT EXISTS habit_streaks (
  habit_id uuid PRIMARY KEY REFERENCES habits(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_completed date
);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies for habits table
CREATE POLICY "Users can view own habits"
  ON habits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON habits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for habit_entries table
CREATE POLICY "Users can view own habit entries"
  ON habit_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit entries"
  ON habit_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit entries"
  ON habit_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit entries"
  ON habit_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for habit_streaks table
CREATE POLICY "Users can view own habit streaks"
  ON habit_streaks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_streaks.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own habit streaks"
  ON habit_streaks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_streaks.habit_id 
      AND habits.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits 
      WHERE habits.id = habit_streaks.habit_id 
      AND habits.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_user_id ON habit_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_habit_id ON habit_entries(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_entries_date ON habit_entries(date);

-- Function to automatically update habit streaks
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  streak_record RECORD;
  consecutive_days INTEGER := 0;
  max_streak INTEGER := 0;
  check_date DATE;
BEGIN
  -- Only process if the entry is being marked as completed
  IF NEW.completed = true THEN
    -- Get or create streak record
    SELECT * INTO streak_record FROM habit_streaks WHERE habit_id = NEW.habit_id;
    
    IF NOT FOUND THEN
      INSERT INTO habit_streaks (habit_id, current_streak, longest_streak, last_completed)
      VALUES (NEW.habit_id, 1, 1, NEW.date);
      RETURN NEW;
    END IF;
    
    -- Calculate current streak by counting consecutive completed days
    check_date := NEW.date;
    WHILE EXISTS (
      SELECT 1 FROM habit_entries 
      WHERE habit_id = NEW.habit_id 
      AND date = check_date 
      AND completed = true
    ) LOOP
      consecutive_days := consecutive_days + 1;
      check_date := check_date - INTERVAL '1 day';
    END LOOP;
    
    -- Get the longest streak
    SELECT COUNT(*) INTO max_streak
    FROM (
      SELECT date, 
             date - ROW_NUMBER() OVER (ORDER BY date)::INTEGER * INTERVAL '1 day' as grp
      FROM habit_entries 
      WHERE habit_id = NEW.habit_id AND completed = true
    ) t
    GROUP BY grp
    ORDER BY COUNT(*) DESC
    LIMIT 1;
    
    -- Update streak record
    UPDATE habit_streaks 
    SET 
      current_streak = consecutive_days,
      longest_streak = GREATEST(max_streak, consecutive_days),
      last_completed = NEW.date
    WHERE habit_id = NEW.habit_id;
    
  ELSIF OLD.completed = true AND NEW.completed = false THEN
    -- If unchecking a completed habit, recalculate streaks
    -- This is a simplified version - in production you might want more sophisticated logic
    UPDATE habit_streaks 
    SET current_streak = 0
    WHERE habit_id = NEW.habit_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic streak updates
DROP TRIGGER IF EXISTS trigger_update_habit_streak ON habit_entries;
CREATE TRIGGER trigger_update_habit_streak
  AFTER INSERT OR UPDATE ON habit_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();