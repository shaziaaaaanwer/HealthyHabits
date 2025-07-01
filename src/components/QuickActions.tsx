import React from 'react';
import { Plus, Target, Calendar, TrendingUp, Settings } from 'lucide-react';

interface QuickActionsProps {
  onAddHabit: () => void;
  onViewAnalytics: () => void;
  onViewCalendar: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onAddHabit, 
  onViewAnalytics, 
  onViewCalendar 
}) => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Habit',
      color: 'from-purple-500 to-pink-500',
      onClick: onAddHabit,
    },
    {
      icon: TrendingUp,
      label: 'Analytics',
      color: 'from-blue-500 to-indigo-500',
      onClick: onViewAnalytics,
    },
    {
      icon: Calendar,
      label: 'Calendar',
      color: 'from-green-500 to-emerald-500',
      onClick: onViewCalendar,
    },
    {
      icon: Target,
      label: 'Goals',
      color: 'from-orange-500 to-red-500',
      onClick: () => {},
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`
              p-4 rounded-xl bg-gradient-to-br ${action.color} text-white
              hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
              flex flex-col items-center space-y-2 group
            `}
          >
            <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;