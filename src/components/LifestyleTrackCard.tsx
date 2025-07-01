import React from 'react';
import { LifestyleTrack } from '../types';
import * as Icons from 'lucide-react';

interface LifestyleTrackCardProps {
  track: LifestyleTrack;
}

const LifestyleTrackCard: React.FC<LifestyleTrackCardProps> = ({ track }) => {
  const IconComponent = Icons[track.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative p-8">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${track.color} text-white mb-6 shadow-lg`}>
          <IconComponent className="w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
          {track.title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {track.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 mb-3">Sample Habits:</h4>
          <ul className="space-y-2">
            {track.sampleHabits.slice(0, 3).map((habit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${track.color} mr-3 flex-shrink-0`} />
                {habit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LifestyleTrackCard;