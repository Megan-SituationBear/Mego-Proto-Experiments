import React from 'react';
import { Heart, Eye, Sparkles } from 'lucide-react';

export interface TemplateCardProps {
  category: string;
  categoryColor?: 'purple' | 'amber' | 'blue' | 'green' | 'gray';
  savedHours?: number;
  title: string;
  description: string;
  favorites?: number;
  views?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const categoryColorMap = {
  purple: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-700',
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  category,
  categoryColor = 'purple',
  savedHours,
  title,
  description,
  favorites = 0,
  views = 0,
  icon,
  onClick,
}) => {
  return (
    <div
      className="group relative bg-white rounded border border-gray-300 p-4 flex flex-col gap-3 hover:shadow-md hover:border-indigo-600 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-3">
          {/* Category Pill */}
          <div className={`inline-flex items-center px-3 py-0.5 rounded-xl text-[11px] font-roboto tracking-tight leading-5 ${categoryColorMap[categoryColor]}`}>
            {category}
          </div>
          
          {/* Saved Hours */}
          {savedHours && (
            <span className="text-[13px] font-roboto leading-5 text-purple-600">
              Saved: {savedHours}hrs
            </span>
          )}
          
          {/* Icon */}
          <div className="ml-auto">
            {icon || <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-base font-roboto tracking-[-0.03em] leading-6 text-slate-950">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-[11px] font-inter tracking-tight leading-5 text-slate-600">
          {description}
        </p>
      </div>

      {/* Stats - Others Did */}
      {(favorites > 0 || views > 0) && (
        <div className="flex gap-3 items-center">
          {/* Favorites */}
          {favorites > 0 && (
            <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Heart className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                {favorites}
              </span>
            </div>
          )}
          
          {/* Views */}
          {views > 0 && (
            <div className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Eye className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                {views}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
