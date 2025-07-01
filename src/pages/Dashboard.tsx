import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  Plus,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  Moon,
  Droplets,
} from "lucide-react";
import { useHabits } from "../contexts/HabitsContext";
import { useAuth } from "../contexts/AuthContext";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import StatsCard from "../components/StatsCard";
import ConfirmDialog from "..components/ConfirmDialog"; // adjust path if needed
import QuickActions from "../components/QuickActions";
import AnalyticsModal from "../components/AnalyticsModal";
import HeatmapCalendar from "../components/HeatmapCalendar";
// import Sidebar from "../components/Sidebar";
import TrackerWidget from "../components/TrackerWidget";
import { Habit } from "../types";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    habits,
    loading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitEntry,
    getHabitEntry,
    getHabitStreak,
  } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(
    undefined
  );
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = new Date();

  const handleCreateHabit = async (
    habitData: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      await createHabit(habitData);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  const handleUpdateHabit = async (
    habitData: Omit<Habit, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!editingHabit) return;

    try {
      await updateHabit(editingHabit.id, habitData);
      setEditingHabit(undefined);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  // const handleDeleteHabit = async (habitId: string) => {
  //   if (window.confirm("Are you sure you want to delete this habit?")) {
  //     try {
  //       await deleteHabit(habitId);
  //     } catch (error) {
  //       console.error("Error deleting habit:", error);
  //     }
  //   }
  // };

  const handleDeleteHabit = async (habitId: string) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const closeModal = () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };

    const Modal = () => (
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <h2 className="text-lg font-bold text-gray-900">Delete Habit</h2>
          <p className="text-gray-700 mt-2">
            Are you sure you want to delete this habit?
          </p>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await deleteHabit(habitId);
                } catch (error) {
                  console.error("Error deleting habit:", error);
                } finally {
                  closeModal();
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );

    ReactDOM.render(<Modal />, container);
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await toggleHabitEntry(habitId, today);
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const getTodayStats = () => {
    const todayEntries = habits.map((habit) => getHabitEntry(habit.id, today));
    const completed = todayEntries.filter((entry) => entry?.completed).length;
    const total = habits.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const { completed, total, percentage } = getTodayStats();

  const getWeeklyStats = () => {
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const weekDays = [];

    for (
      let d = new Date(weekStart);
      d <= weekEnd;
      d.setDate(d.getDate() + 1)
    ) {
      weekDays.push(new Date(d));
    }

    let weeklyCompleted = 0;
    let weeklyTotal = 0;

    weekDays.forEach((day) => {
      const dayEntries = habits.map((habit) => getHabitEntry(habit.id, day));
      weeklyTotal += habits.length;
      weeklyCompleted += dayEntries.filter((entry) => entry?.completed).length;
    });

    return {
      completed: weeklyCompleted,
      total: weeklyTotal,
      percentage:
        weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0,
    };
  };

  const getBestStreak = () => {
    return habits.reduce((maxStreak, habit) => {
      const streak = getHabitStreak(habit.id);
      return Math.max(maxStreak, streak?.current_streak || 0);
    }, 0);
  };

  const getConsistencyScore = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    });

    const dailyCompletions = last7Days.map((day) => {
      const dayEntries = habits.map((habit) => getHabitEntry(habit.id, day));
      const dayCompleted = dayEntries.filter(
        (entry) => entry?.completed
      ).length;
      return habits.length > 0 ? (dayCompleted / habits.length) * 100 : 0;
    });

    return Math.round(
      dailyCompletions.reduce((sum, score) => sum + score, 0) / 7
    );
  };

  const weeklyStats = getWeeklyStats();
  const bestStreak = getBestStreak();
  const consistencyScore = getConsistencyScore();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex">
      {/* <Sidebar /> */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Welcome back,{" "}
                {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {format(today, "EEEE, MMMM do, yyyy")} • Let's continue building
                your healthy habits
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAnalytics(true)}
                className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Habit</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard
              title="Today's Progress"
              value={`${completed}/${total}`}
              subtitle={`${percentage}% complete`}
              icon={CheckCircle2}
              color="from-green-500 to-emerald-500"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Weekly Score"
              value={`${weeklyStats.percentage}%`}
              subtitle={`${weeklyStats.completed}/${weeklyStats.total} completed`}
              icon={TrendingUp}
              color="from-blue-500 to-indigo-500"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Best Streak"
              value={bestStreak}
              subtitle="days in a row"
              icon={Zap}
              color="from-orange-500 to-red-500"
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Consistency"
              value={`${consistencyScore}%`}
              subtitle="7-day average"
              icon={Clock}
              color="from-purple-500 to-pink-500"
              trend={{ value: 3, isPositive: true }}
            />
          </div>
        </div>

        {/* Tracker Widgets */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <TrackerWidget
            title="Sleep Tracker"
            icon={Moon}
            color="from-indigo-500 to-purple-500"
            value="7.5h"
            subtitle="Last night's sleep"
            link="/dashboard/sleep"
            progress={85}
          >
            <div className="flex justify-between text-xs text-gray-500">
              <span>Bedtime: 10:30 PM</span>
              <span>Quality: Good</span>
            </div>
          </TrackerWidget>

          <TrackerWidget
            title="Water Intake"
            icon={Droplets}
            color="from-blue-500 to-cyan-500"
            value="6/8"
            subtitle="Glasses today"
            link="/dashboard/water"
            progress={75}
          >
            <div className="flex justify-between text-xs text-gray-500">
              <span>1.5L consumed</span>
              <span>2 glasses left</span>
            </div>
          </TrackerWidget>

          <TrackerWidget
            title="Habits Progress"
            icon={CheckCircle2}
            color="from-green-500 to-emerald-500"
            value={`${completed}/${total}`}
            subtitle="Completed today"
            link="/dashboard"
            progress={percentage}
          >
            <div className="text-xs text-gray-500">
              {percentage >= 80 ? "🎉 Great progress!" : "Keep going!"}
            </div>
          </TrackerWidget>

          <TrackerWidget
            title="Weekly Streak"
            icon={Zap}
            color="from-orange-500 to-red-500"
            value={bestStreak}
            subtitle="Best habit streak"
            link="/dashboard"
          >
            <div className="text-xs text-gray-500">
              {bestStreak > 0
                ? `${bestStreak} days strong!`
                : "Start your streak today"}
            </div>
          </TrackerWidget>
        </div> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* <QuickActions
              onAddHabit={() => setShowForm(true)}
              onViewAnalytics={() => setShowAnalytics(true)}
              onViewCalendar={() => setShowCalendar(true)}
            /> */}

            {habits.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {habits.slice(0, 3).map((habit) => {
                    const entry = getHabitEntry(habit.id, today);
                    const streak = getHabitStreak(habit.id);

                    return (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {habit.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {streak?.current_streak || 0} day streak
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            entry?.completed ? "bg-green-100" : "bg-gray-200"
                          }`}
                        >
                          {entry?.completed && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Habits Grid */}
            {habits.length === 0 ? (
              // <div className="text-center py-20">
              //   <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-16 max-w-lg mx-auto border border-white/20">
              //     <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              //       <Plus className="w-8 h-8 text-purple-600" />
              //     </div>
              //     <h3 className="text-2xl font-bold text-gray-900 mb-4">
              //       No habits yet
              //     </h3>
              //     <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              //       Start your journey by creating your first habit. Small steps
              //       lead to big changes!
              //     </p>
              //     <button
              //       onClick={() => setShowForm(true)}
              //       className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              //     >
              //       Create Your First Habit
              //     </button>
              //   </div>
              // </div>
              <div></div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Habits
                  </h2>
                  <div className="text-sm text-gray-500">
                    {completed} of {total} completed today
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {habits.map((habit) => {
                    const entry = getHabitEntry(habit.id, today);
                    const streak = getHabitStreak(habit.id);

                    return (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        entry={entry}
                        streak={streak?.current_streak}
                        onToggle={() => handleToggleHabit(habit.id)}
                        onEdit={() => setEditingHabit(habit)}
                        onDelete={() => handleDeleteHabit(habit.id)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Section */}
        {/* {habits.length > 0 && (
          <div className="mt-10">
            <HeatmapCalendar entries={[]} />
          </div>
        )} */}

        {/* Habit Form Modal */}
        {(showForm || editingHabit) && (
          <HabitForm
            habit={editingHabit}
            onSave={editingHabit ? handleUpdateHabit : handleCreateHabit}
            onCancel={() => {
              setShowForm(false);
              setEditingHabit(undefined);
            }}
          />
        )}

        {/* Analytics Modal */}
        <AnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
