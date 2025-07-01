import React, { useState } from 'react';
import { X, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useHabits } from '../contexts/HabitsContext';
import ProgressChart from './ProgressChart';
import HeatmapCalendar from './HeatmapCalendar';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { entries, habits } = useHabits();
  const [selectedView, setSelectedView] = useState<'overview' | 'trends' | 'calendar'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  if (!isOpen) return null;

  const getCompletionStats = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const getStatsForPeriod = (dates: string[]) => {
      const periodEntries = entries.filter(entry => dates.includes(entry.date));
      const totalEntries = periodEntries.length;
      const completedEntries = periodEntries.filter(entry => entry.completed).length;
      const completionRate = totalEntries > 0 ? Math.round((completedEntries / totalEntries) * 100) : 0;
      
      return { totalEntries, completedEntries, completionRate };
    };

    return {
      week: getStatsForPeriod(last7Days),
      month: getStatsForPeriod(last30Days),
    };
  };

  const stats = getCompletionStats();

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  selectedView === view.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <view.icon className="w-4 h-4" />
                <span className="font-medium">{view.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {selectedView === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold mb-2">This Week</h3>
                  <div className="text-3xl font-bold">{stats.week.completionRate}%</div>
                  <p className="text-purple-100">
                    {stats.week.completedEntries}/{stats.week.totalEntries} completed
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold mb-2">This Month</h3>
                  <div className="text-3xl font-bold">{stats.month.completionRate}%</div>
                  <p className="text-blue-100">
                    {stats.month.completedEntries}/{stats.month.totalEntries} completed
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl text-white">
                  <h3 className="text-lg font-semibold mb-2">Active Habits</h3>
                  <div className="text-3xl font-bold">{habits.length}</div>
                  <p className="text-green-100">habits tracked</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Habit Performance</h3>
                <div className="space-y-3">
                  {habits.map(habit => {
                    const habitEntries = entries.filter(entry => entry.habit_id === habit.id);
                    const completed = habitEntries.filter(entry => entry.completed).length;
                    const total = habitEntries.length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    return (
                      <div key={habit.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="font-medium text-gray-900">{habit.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-12">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedView === 'trends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Progress Trends</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedPeriod('week')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedPeriod === 'week'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setSelectedPeriod('month')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedPeriod === 'month'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Month
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <ProgressChart entries={entries} type="line" period={selectedPeriod} />
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Daily Completion Rate</h4>
                <ProgressChart entries={entries} type="bar" period={selectedPeriod} />
              </div>
            </div>
          )}

          {selectedView === 'calendar' && (
            <div className="space-y-6">
              <HeatmapCalendar entries={entries} />
              
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Individual Habit Calendars</h3>
                <div className="grid gap-6">
                  {habits.slice(0, 3).map(habit => (
                    <div key={habit.id}>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        <span>{habit.name}</span>
                      </h4>
                      <HeatmapCalendar entries={entries} habitId={habit.id} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;