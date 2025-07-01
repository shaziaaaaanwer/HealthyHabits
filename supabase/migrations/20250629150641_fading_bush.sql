/*
  # Fix habit streak trigger function

  1. Function Updates
    - Create or replace the `update_habit_streak()` function
    - Ensure `longest_streak` is never NULL
    - Properly calculate current and longest streaks
    - Handle edge cases for streak calculations

  2. Security
    - Function runs with security definer privileges
    - Maintains existing RLS policies on habit_streaks table
*/

-- Create or replace the habit streak update function
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
    streak_record RECORD;
    consecutive_days INTEGER := 0;
    max_streak INTEGER := 0;
    check_date DATE;
    habit_user_id UUID;
BEGIN
    -- Get the user_id for this habit
    SELECT user_id INTO habit_user_id 
    FROM habits 
    WHERE id = NEW.habit_id;

    -- If the entry is being marked as completed
    IF NEW.completed = true THEN
        -- Calculate current streak by counting consecutive completed days ending with NEW.date
        consecutive_days := 0;
        check_date := NEW.date;
        
        -- Count backwards from the current date to find consecutive completed days
        WHILE EXISTS (
            SELECT 1 FROM habit_entries 
            WHERE habit_id = NEW.habit_id 
            AND date = check_date 
            AND completed = true
        ) LOOP
            consecutive_days := consecutive_days + 1;
            check_date := check_date - INTERVAL '1 day';
        END LOOP;

        -- Calculate the longest streak ever for this habit
        WITH streak_groups AS (
            SELECT 
                date,
                completed,
                date - (ROW_NUMBER() OVER (ORDER BY date))::INTEGER * INTERVAL '1 day' as grp
            FROM habit_entries 
            WHERE habit_id = NEW.habit_id 
            AND completed = true
            ORDER BY date
        ),
        streak_lengths AS (
            SELECT COUNT(*) as streak_length
            FROM streak_groups
            GROUP BY grp
        )
        SELECT COALESCE(MAX(streak_length), 0) INTO max_streak
        FROM streak_lengths;

        -- Ensure max_streak is at least as long as current streak
        max_streak := GREATEST(max_streak, consecutive_days);

        -- Insert or update the habit_streaks record
        INSERT INTO habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed)
        VALUES (NEW.habit_id, habit_user_id, consecutive_days, max_streak, NEW.date)
        ON CONFLICT (habit_id) 
        DO UPDATE SET 
            current_streak = consecutive_days,
            longest_streak = GREATEST(habit_streaks.longest_streak, max_streak),
            last_completed = NEW.date;

    ELSE
        -- If the entry is being marked as not completed, recalculate streaks
        -- Calculate current streak (consecutive days from most recent completed date)
        SELECT date INTO check_date
        FROM habit_entries 
        WHERE habit_id = NEW.habit_id 
        AND completed = true 
        AND date < NEW.date
        ORDER BY date DESC 
        LIMIT 1;

        IF check_date IS NOT NULL THEN
            -- Count consecutive days from the most recent completed date
            consecutive_days := 0;
            WHILE EXISTS (
                SELECT 1 FROM habit_entries 
                WHERE habit_id = NEW.habit_id 
                AND date = check_date 
                AND completed = true
            ) LOOP
                consecutive_days := consecutive_days + 1;
                check_date := check_date - INTERVAL '1 day';
            END LOOP;
        ELSE
            consecutive_days := 0;
        END IF;

        -- Get existing longest streak or calculate it
        SELECT longest_streak INTO max_streak
        FROM habit_streaks 
        WHERE habit_id = NEW.habit_id;

        IF max_streak IS NULL THEN
            -- Calculate longest streak if not exists
            WITH streak_groups AS (
                SELECT 
                    date,
                    completed,
                    date - (ROW_NUMBER() OVER (ORDER BY date))::INTEGER * INTERVAL '1 day' as grp
                FROM habit_entries 
                WHERE habit_id = NEW.habit_id 
                AND completed = true
                ORDER BY date
            ),
            streak_lengths AS (
                SELECT COUNT(*) as streak_length
                FROM streak_groups
                GROUP BY grp
            )
            SELECT COALESCE(MAX(streak_length), 0) INTO max_streak
            FROM streak_lengths;
        END IF;

        -- Get the last completed date
        SELECT date INTO check_date
        FROM habit_entries 
        WHERE habit_id = NEW.habit_id 
        AND completed = true 
        ORDER BY date DESC 
        LIMIT 1;

        -- Update or insert the habit_streaks record
        INSERT INTO habit_streaks (habit_id, user_id, current_streak, longest_streak, last_completed)
        VALUES (NEW.habit_id, habit_user_id, consecutive_days, COALESCE(max_streak, 0), check_date)
        ON CONFLICT (habit_id) 
        DO UPDATE SET 
            current_streak = consecutive_days,
            longest_streak = COALESCE(habit_streaks.longest_streak, 0),
            last_completed = check_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS trigger_update_habit_streak ON habit_entries;
CREATE TRIGGER trigger_update_habit_streak
    AFTER INSERT OR UPDATE ON habit_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_habit_streak();