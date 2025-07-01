import React from 'react';
import { Link } from 'react-router-dom';
import { DivideIcon as LucideIcon, ArrowRight } from 'lucide-react';

interface TrackerWidgetProps {
  title: string;
  icon: LucideIcon;
  color: string;
  value: string | number;
  subtitle: string;
  link: string;
  progress?: number;
  children?: React.ReactNode;
}

const TrackerWidget: React.FC<TrackerWidgetProps> = ({
  title,
  icon: Icon,
  color,
  value,
  subtitle,
  link,
  progress,
  children
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <Link
          to={link}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>

      {children && (
        <div className="space-y-2">
          {children}
        </div>
      )}

      <Link
        to={link}
        className={`inline-flex items-center space-x-2 text-sm font-medium bg-gradient-to-r ${color} bg-clip-text text-transparent hover:underline`}
      >
        <span>View Details</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
};

export default TrackerWidget;