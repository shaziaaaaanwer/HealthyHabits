import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { HabitEntry } from '../types';

interface HeatmapCalendarProps {
  entries: HabitEntry[];
  habitId?: string;
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ entries, habitId }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getIntensity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let relevantEntries = entries.filter(entry => entry.date === dateStr);
    
    if (habitId) {
      relevantEntries = relevantEntries.filter(entry => entry.habit_id === habitId);
    }
    
    if (relevantEntries.length === 0) return 0;
    
    const completed = relevantEntries.filter(entry => entry.completed).length;
    const total = relevantEntries.length;
    const percentage = (completed / total) * 100;
    
    if (percentage === 0) return 0;
    if (percentage <= 25) return 1;
    if (percentage <= 50) return 2;
    if (percentage <= 75) return 3;
    return 4;
  };

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100', // 0%
      'bg-purple-200', // 1-25%
      'bg-purple-300', // 26-50%
      'bg-purple-400', // 51-75%
      'bg-purple-500', // 76-100%
    ];
    return colors[intensity];
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          {format(today, 'MMMM yyyy')} Activity
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map(intensity => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-xs text-gray-500 text-center py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const intensity = getIntensity(day);
          const isCurrentMonth = isSameMonth(day, today);
          const isTodayDate = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`
                w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium
                ${isCurrentMonth ? getIntensityColor(intensity) : 'bg-gray-50'}
                ${isTodayDate ? 'ring-2 ring-purple-600 ring-offset-1' : ''}
                ${intensity > 2 ? 'text-white' : 'text-gray-700'}
                transition-all hover:scale-110 cursor-pointer
              `}
              title={`${format(day, 'MMM d, yyyy')} - ${intensity > 0 ? `${intensity * 25}% completion` : 'No activity'}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeatmapCalendar;