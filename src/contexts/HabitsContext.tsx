import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, HabitEntry, HabitStreak } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { format, startOfDay } from 'date-fns';

interface HabitsContextType {
  habits: Habit[];
  entries: HabitEntry[];
  streaks: HabitStreak[];
  loading: boolean;
  createHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitEntry: (habitId: string, date: Date) => Promise<void>;
  getHabitEntry: (habitId: string, date: Date) => HabitEntry | undefined;
  getHabitStreak: (habitId: string) => HabitStreak | undefined;
  refreshData: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching habits:', error);
    } else {
      setHabits(data || []);
    }
  };

  const fetchEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habit_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data || []);
    }
  };

  const fetchStreaks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('habit_streaks')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching streaks:', error);
    } else {
      setStreaks(data || []);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchHabits(), fetchEntries(), fetchStreaks()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setHabits([]);
      setEntries([]);
      setStreaks([]);
      setLoading(false);
    }
  }, [user]);

  const createHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('habits')
      .insert([{ ...habitData, user_id: user.id }]);

    if (error) {
      console.error('Error creating habit:', error);
      throw error;
    } else {
      await fetchHabits();
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const { error } = await supabase
      .from('habits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating habit:', error);
      throw error;
    } else {
      await fetchHabits();
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting habit:', error);
      throw error;
    } else {
      await refreshData();
    }
  };

  const toggleHabitEntry = async (habitId: string, date: Date) => {
    if (!user) return;

    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    const existingEntry = entries.find(e => e.habit_id === habitId && e.date === dateStr);

    if (existingEntry) {
      const { error } = await supabase
        .from('habit_entries')
        .update({ completed: !existingEntry.completed })
        .eq('id', existingEntry.id);

      if (error) {
        console.error('Error updating entry:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('habit_entries')
        .insert([{
          habit_id: habitId,
          user_id: user.id,
          date: dateStr,
          completed: true,
        }]);

      if (error) {
        console.error('Error creating entry:', error);
        throw error;
      }
    }

    await Promise.all([fetchEntries(), fetchStreaks()]);
  };

  const getHabitEntry = (habitId: string, date: Date) => {
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    return entries.find(e => e.habit_id === habitId && e.date === dateStr);
  };

  const getHabitStreak = (habitId: string) => {
    return streaks.find(s => s.habit_id === habitId);
  };

  const value = {
    habits,
    entries,
    streaks,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitEntry,
    getHabitEntry,
    getHabitStreak,
    refreshData,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
};