import React from 'react';
import { Habit, HabitEntry } from '../types';
import { CheckCircle2, Circle, Flame, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  entry?: HabitEntry;
  streak?: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  entry,
  streak = 0,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const isCompleted = entry?.completed || false;

  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: 'from-red-500 to-orange-500',
      nutrition: 'from-green-500 to-emerald-500',
      mindfulness: 'from-purple-500 to-pink-500',
      sleep: 'from-blue-500 to-indigo-500',
      productivity: 'from-yellow-500 to-orange-500',
      social: 'from-pink-500 to-rose-500',
      learning: 'from-indigo-500 to-purple-500',
      health: 'from-teal-500 to-cyan-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className={`h-2 bg-gradient-to-r ${getCategoryColor(habit.category)}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{habit.name}</h3>
            {habit.description && (
              <p className="text-gray-600 text-sm">{habit.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit habit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete habit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onToggle}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
              isCompleted
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </span>
          </button>

          {streak > 0 && (
            <div className="flex items-center space-x-1 text-orange-600">
              <Flame className="w-4 h-4" />
              <span className="font-bold text-sm">{streak}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="capitalize">{habit.frequency}</span>
            <span>{format(new Date(), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;