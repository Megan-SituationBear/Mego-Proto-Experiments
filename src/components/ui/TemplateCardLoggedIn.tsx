import React from 'react';
import { Heart, Eye, Sparkles, BookmarkPlus, Share2 } from 'lucide-react';

export interface TemplateCardLoggedInProps {
  category: string;
  categoryColor?: 'purple' | 'amber' | 'blue' | 'green';
  savedHours?: number;
  title: string;
  description: string;
  favorites?: number;
  views?: number;
  icon?: React.ReactNode;
  isFavorited?: boolean;
  isBookmarked?: boolean;
  onFavorite?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onClick?: () => void;
  className?: string;
}

const categoryColorMap = {
  purple: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
};

const TemplateCardLoggedIn: React.FC<TemplateCardLoggedInProps> = ({
  category,
  categoryColor = 'purple',
  savedHours,
  title,
  description,
  favorites = 0,
  views = 0,
  icon,
  isFavorited = false,
  isBookmarked = false,
  onFavorite,
  onBookmark,
  onShare,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-300 p-4 flex flex-col gap-3 hover:shadow-md hover:border-copado-blue transition-all duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Quick Actions - Show on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            isBookmarked 
              ? 'bg-copado-blue text-white' 
              : 'bg-white/90 text-gray-600 hover:bg-gray-100'
          } shadow-sm`}
          title="Bookmark"
        >
          <BookmarkPlus className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
          className="p-1.5 bg-white/90 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3">
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
              {icon || <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-copado-blue transition-colors" />}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-base font-roboto tracking-[-0.03em] leading-6 text-slate-950 group-hover:text-copado-blue transition-colors">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-[11px] font-inter tracking-tight leading-5 text-slate-600">
            {description}
          </p>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            {/* Favorites */}
            {favorites > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.();
                }}
                className="flex items-center gap-1 hover:text-copado-blue transition-colors group/fav"
              >
                <Heart 
                  className={`w-3.5 h-3.5 transition-colors ${
                    isFavorited 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-slate-600 group-hover/fav:text-red-500'
                  }`}
                />
                <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                  {favorites}
                </span>
              </button>
            )}
            
            {/* Views */}
            {views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                  {views}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCardLoggedIn;
