export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly' | 'monthly';
  goal: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface HabitEntry {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface HabitStreak {
  habit_id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'completion' | 'consistency';
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export type HabitCategory = 
  | 'fitness' 
  | 'nutrition' 
  | 'mindfulness' 
  | 'sleep' 
  | 'productivity' 
  | 'social' 
  | 'learning' 
  | 'health';

export interface LifestyleTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  category: HabitCategory;
  sampleHabits: string[];
}