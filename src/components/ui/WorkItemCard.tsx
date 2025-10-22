/**
 * WorkItemCard - Shows a created project/workspace as a card
 * Appears after workspace creation in the conversation flow
 */

import React from 'react';
import { Folder, Clock, Star } from 'lucide-react';

interface WorkItemCardProps {
  title: string;
  description?: string;
  category?: string;
  categoryColor?: 'green' | 'blue' | 'purple' | 'amber' | 'slate' | 'orange';
  createdAt?: Date;
  onClick?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

const WorkItemCard: React.FC<WorkItemCardProps> = ({
  title,
  description,
  category,
  categoryColor = 'blue',
  createdAt,
  onClick,
  onFavorite,
  isFavorited = false,
}) => {
  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  const timeAgo = createdAt ? 'Just now' : '';

  return (
    <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-green-700">
          ✨ Project Workspace Created
        </span>
      </div>
      
      <div 
        onClick={onClick}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <Folder className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              {category && (
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 ${badgeColors[categoryColor]}`}>
                  {category}
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {onFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors ml-2"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorited
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-400 group-hover:text-blue-500'
                }`}
              />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeAgo || 'Created'}</span>
          </div>
          
          <button 
            onClick={onClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            Open Workspace
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkItemCard;
