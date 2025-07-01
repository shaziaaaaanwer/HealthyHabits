import React, { useState } from 'react';
import { Habit, HabitCategory } from '../types';
import { X, Save } from 'lucide-react';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const categories: { value: HabitCategory; label: string; color: string }[] = [
  { value: 'fitness', label: 'Fitness', color: 'from-red-500 to-orange-500' },
  { value: 'nutrition', label: 'Nutrition', color: 'from-green-500 to-emerald-500' },
  { value: 'mindfulness', label: 'Mindfulness', color: 'from-purple-500 to-pink-500' },
  { value: 'sleep', label: 'Sleep', color: 'from-blue-500 to-indigo-500' },
  { value: 'productivity', label: 'Productivity', color: 'from-yellow-500 to-orange-500' },
  { value: 'social', label: 'Social', color: 'from-pink-500 to-rose-500' },
  { value: 'learning', label: 'Learning', color: 'from-indigo-500 to-purple-500' },
  { value: 'health', label: 'Health', color: 'from-teal-500 to-cyan-500' },
];

const HabitForm: React.FC<HabitFormProps> = ({ habit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    category: habit?.category || 'fitness' as HabitCategory,
    frequency: habit?.frequency || 'daily' as 'daily' | 'weekly' | 'monthly',
    goal: habit?.goal || 1,
    color: habit?.color || '#8B5CF6',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' ? parseInt(value) || 1 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {habit ? 'Edit Habit' : 'Create New Habit'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Drink 8 glasses of water"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Add a description to help you remember..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal (times per {formData.frequency.replace('ly', '')})
              </label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{habit ? 'Update' : 'Create'} Habit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HabitForm;