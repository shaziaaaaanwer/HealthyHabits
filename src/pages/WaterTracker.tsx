import React, { useState } from "react";
import {
  Droplets,
  Plus,
  Minus,
  Target,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";
import { format, subDays } from "date-fns";
// import Sidebar from '../components/Sidebar';

const WaterTracker: React.FC = () => {
  const [glasses, setGlasses] = useState(3);
  const [dailyGoal, setDailyGoal] = useState(8);
  const [customAmount, setCustomAmount] = useState(250); // ml per glass

  const adjustWater = (delta: number) => {
    const newGlasses = Math.max(0, Math.min(20, glasses + delta));
    setGlasses(newGlasses);
  };

  const getHydrationLevel = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100)
      return { label: "Excellent", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 75)
      return { label: "Good", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 50)
      return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Low", color: "text-red-600", bg: "bg-red-100" };
  };

  const hydrationLevel = getHydrationLevel(glasses, dailyGoal);
  const percentage = Math.min((glasses / dailyGoal) * 100, 100);
  const totalMl = glasses * customAmount;

  // Mock data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, "MMM dd"),
      glasses: Math.floor(Math.random() * 6) + 4, // 4-10 glasses
      goal: dailyGoal,
    };
  }).reverse();

  const averageIntake =
    last7Days.reduce((sum, day) => sum + day.glasses, 0) / 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 flex">
      <Sidebar />
      <div className="flex-1 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Water Intake Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Stay hydrated and track your daily water consumption
          </p>
        </div>

        {/* Today's Water Intake */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Water Input */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Today's Intake
                    </h2>
                    <p className="text-gray-500">
                      {format(new Date(), "EEEE, MMMM do, yyyy")}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${hydrationLevel.bg} ${hydrationLevel.color}`}
                >
                  {hydrationLevel.label}
                </div>
              </div>

              {/* Water Glasses Counter */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => adjustWater(-1)}
                    className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
                    disabled={glasses === 0}
                  >
                    <Minus className="w-6 h-6 text-gray-600" />
                  </button>

                  <div className="mx-12 text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                      {glasses}
                    </div>
                    <div className="text-lg text-gray-500">glasses</div>
                    <div className="text-sm text-gray-400">({totalMl}ml)</div>
                  </div>

                  <button
                    onClick={() => adjustWater(1)}
                    className="p-4 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors shadow-md"
                  >
                    <Plus className="w-6 h-6 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-medium text-gray-900">
                      Daily Goal: {dailyGoal} glasses
                    </span>
                  </div>
                  {glasses >= dailyGoal && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Award className="w-5 h-5" />
                      <span className="font-medium">Goal Achieved!</span>
                    </div>
                  )}
                </div>

                <div className="relative bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full transition-all duration-500 relative"
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0 glasses</span>
                  <span className="font-medium">
                    {Math.round(percentage)}% complete
                  </span>
                  <span>{dailyGoal} glasses</span>
                </div>
              </div>

              {/* Water Glasses Visual Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Visual Progress
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: Math.max(dailyGoal, 10) }, (_, i) => (
                    <div
                      key={i}
                      className={`h-16 rounded-lg border-2 transition-all duration-300 flex items-end justify-center ${
                        i < glasses
                          ? "bg-gradient-to-t from-blue-400 to-cyan-300 border-blue-400 shadow-sm"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          i < glasses ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => adjustWater(1)}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
                >
                  <div className="text-blue-600 font-semibold">+1 Glass</div>
                  <div className="text-sm text-blue-500">{customAmount}ml</div>
                </button>
                <button
                  onClick={() => adjustWater(2)}
                  className="p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl transition-colors border border-cyan-200"
                >
                  <div className="text-cyan-600 font-semibold">+2 Glasses</div>
                  <div className="text-sm text-cyan-500">
                    {customAmount * 2}ml
                  </div>
                </button>
                <button
                  onClick={() => adjustWater(4)}
                  className="p-4 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200"
                >
                  <div className="text-teal-600 font-semibold">+4 Glasses</div>
                  <div className="text-sm text-teal-500">
                    {customAmount * 4}ml (1L)
                  </div>
                </button>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Goal (glasses)
                  </label>
                  <input
                    type="number"
                    value={dailyGoal}
                    onChange={(e) =>
                      setDailyGoal(Math.max(1, parseInt(e.target.value) || 8))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glass Size (ml)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) =>
                      setCustomAmount(
                        Math.max(100, parseInt(e.target.value) || 250)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="100"
                    max="500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Water Stats Sidebar */}
          <div className="space-y-6">
            {/* Weekly Average */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Weekly Average
                </h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {averageIntake.toFixed(1)}
              </div>
              <p className="text-sm text-gray-500">glasses per day</p>
              <div className="mt-3 text-sm">
                {averageIntake >= dailyGoal ? (
                  <span className="text-green-600">
                    ✅ Great hydration habits!
                  </span>
                ) : (
                  <span className="text-orange-600">
                    ⚠️ Try to drink more water
                  </span>
                )}
              </div>
            </div>

            {/* Today's Progress */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-6 h-6 text-cyan-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Today's Progress
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-medium">{glasses} glasses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium">
                    {Math.max(0, dailyGoal - glasses)} glasses
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Volume</span>
                  <span className="font-medium">
                    {(totalMl / 1000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </div>

            {/* Hydration Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                💧 Hydration Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Start your day with a glass of water</li>
                <li>• Keep a water bottle at your desk</li>
                <li>• Set hourly reminders to drink</li>
                <li>• Eat water-rich foods like fruits</li>
                <li>• Drink before you feel thirsty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Water Intake History */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <Droplets className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Water Intake History (Last 7 Days)
            </h3>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{day.date}</div>
                <div
                  className="bg-gradient-to-t from-blue-500 to-cyan-500 rounded-lg mx-auto mb-2 transition-all hover:scale-105 relative overflow-hidden"
                  style={{
                    height: `${(day.glasses / 12) * 120}px`,
                    width: "40px",
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {day.glasses}
                </div>
                <div className="text-xs text-gray-500">glasses</div>
                {day.glasses >= day.goal && (
                  <div className="text-xs text-yellow-500 mt-1">🏆</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
