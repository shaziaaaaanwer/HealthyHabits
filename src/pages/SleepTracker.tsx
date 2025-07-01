import React, { useState } from "react";
import {
  Moon,
  Plus,
  Minus,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
// import Sidebar from '../components/Sidebar';

const SleepTracker: React.FC = () => {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [sleepQuality, setSleepQuality] = useState(4);

  const adjustSleep = (delta: number) => {
    const newHours = Math.max(0, Math.min(12, sleepHours + delta));
    setSleepHours(newHours);
  };

  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 9)
      return {
        label: "Excellent",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (hours >= 6 && hours < 7)
      return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (hours >= 5 && hours < 6)
      return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const quality = getSleepQuality(sleepHours);

  // Mock data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date: format(date, "MMM dd"),
      hours: Math.random() * 3 + 6, // 6-9 hours
      quality: Math.floor(Math.random() * 5) + 1,
    };
  }).reverse();

  const averageSleep = last7Days.reduce((sum, day) => sum + day.hours, 0) / 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex">
      <Sidebar />
      <div className="flex-1 max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Sleep Tracker
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor your sleep patterns and improve your rest quality
          </p>
        </div>

        {/* Today's Sleep Entry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Sleep Input */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">
                    <Moon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Today's Sleep
                    </h2>
                    <p className="text-gray-500">
                      {format(new Date(), "EEEE, MMMM do, yyyy")}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${quality.bg} ${quality.color}`}
                >
                  {quality.label}
                </div>
              </div>

              {/* Sleep Hours Adjustment */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center">
                  <button
                    onClick={() => adjustSleep(-0.5)}
                    className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-md"
                  >
                    <Minus className="w-6 h-6 text-gray-600" />
                  </button>

                  <div className="mx-12 text-center">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                      {sleepHours.toFixed(1)}
                    </div>
                    <div className="text-lg text-gray-500">hours of sleep</div>
                  </div>

                  <button
                    onClick={() => adjustSleep(0.5)}
                    className="p-4 rounded-full bg-indigo-100 hover:bg-indigo-200 transition-colors shadow-md"
                  >
                    <Plus className="w-6 h-6 text-indigo-600" />
                  </button>
                </div>
              </div>

              {/* Sleep Schedule */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <Clock className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                  <div className="text-sm text-gray-500 mb-2">Bedtime</div>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="text-xl font-bold text-gray-900 bg-transparent border-none text-center focus:outline-none w-full"
                  />
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <Clock className="w-6 h-6 text-gray-500 mx-auto mb-3" />
                  <div className="text-sm text-gray-500 mb-2">Wake Up</div>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="text-xl font-bold text-gray-900 bg-transparent border-none text-center focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Sleep Quality Rating */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How was your sleep quality?
                </h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSleepQuality(rating)}
                      className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                        sleepQuality >= rating
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {"⭐".repeat(rating)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                Save Sleep Data
              </button>
            </div>
          </div>

          {/* Sleep Stats Sidebar */}
          <div className="space-y-6">
            {/* Weekly Average */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Weekly Average
                </h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {averageSleep.toFixed(1)}h
              </div>
              <p className="text-sm text-gray-500">
                {averageSleep >= 7
                  ? "✅ Great sleep habits!"
                  : "⚠️ Try to get more sleep"}
              </p>
            </div>

            {/* Sleep Goal */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Sleep Goal</h3>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">8h</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((sleepHours / 8) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {Math.round((sleepHours / 8) * 100)}% of daily goal
              </p>
            </div>

            {/* Sleep Tips */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                💡 Sleep Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Keep a consistent sleep schedule</li>
                <li>• Avoid screens 1 hour before bed</li>
                <li>• Keep your bedroom cool and dark</li>
                <li>• Limit caffeine after 2 PM</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sleep History Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Sleep History (Last 7 Days)
            </h3>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{day.date}</div>
                <div
                  className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-lg mx-auto mb-2 transition-all hover:scale-105"
                  style={{
                    height: `${(day.hours / 10) * 120}px`,
                    width: "40px",
                  }}
                />
                <div className="text-sm font-medium text-gray-900">
                  {day.hours.toFixed(1)}h
                </div>
                <div className="text-xs text-gray-500">
                  {"⭐".repeat(day.quality)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
