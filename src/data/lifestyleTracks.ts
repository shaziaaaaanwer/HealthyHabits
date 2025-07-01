import { LifestyleTrack } from '../types';

export const lifestyleTracks: LifestyleTrack[] = [
  {
    id: 'fitness',
    title: 'Get Fit',
    description: 'Build strength, endurance, and energy through consistent movement',
    color: 'from-red-500 to-orange-500',
    icon: 'Dumbbell',
    category: 'fitness',
    sampleHabits: [
      '30 minutes of exercise',
      '10,000 steps daily',
      'Strength training 3x/week',
      'Morning yoga routine',
      'Evening walk'
    ]
  },
  {
    id: 'nutrition',
    title: 'Eat Healthy',
    description: 'Nourish your body with balanced, wholesome nutrition',
    color: 'from-green-500 to-emerald-500',
    icon: 'Apple',
    category: 'nutrition',
    sampleHabits: [
      'Drink 8 glasses of water',
      'Eat 5 servings of fruits/vegetables',
      'Cook meals at home',
      'Take vitamins daily',
      'Limit processed foods'
    ]
  },
  {
    id: 'mindfulness',
    title: 'Be Mindful',
    description: 'Cultivate peace, focus, and emotional well-being',
    color: 'from-purple-500 to-pink-500',
    icon: 'Brain',
    category: 'mindfulness',
    sampleHabits: [
      '10 minutes of meditation',
      'Practice gratitude daily',
      'Deep breathing exercises',
      'Journaling before bed',
      'Mindful eating practice'
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep Better',
    description: 'Optimize rest and recovery for peak performance',
    color: 'from-blue-500 to-indigo-500',
    icon: 'Moon',
    category: 'sleep',
    sampleHabits: [
      'Sleep 7-8 hours nightly',
      'No screens 1 hour before bed',
      'Consistent bedtime routine',
      'Keep room cool and dark',
      'Wake up at same time daily'
    ]
  }
];