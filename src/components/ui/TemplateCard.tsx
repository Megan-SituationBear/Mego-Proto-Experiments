import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { getCategoryColor } from '../../utils/categoryColors';

export interface TemplateCardProps {
  category: string;
  title: string;
  description: string;
  remixCount?: number;
  favoriteCount?: number;
  variant?: 'customizable' | 'standard'; // customizable = magic star, standard = favorite star
  isFavorited?: boolean;
  onFavoriteClick?: (e: React.MouseEvent) => void;
  onClick?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  category,
  title,
  description,
  remixCount = 0,
  favoriteCount = 0,
  variant = 'customizable',
  isFavorited = false,
  onFavoriteClick,
  onClick,
}) => {
  const colors = getCategoryColor(category);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteClick) {
      onFavoriteClick(e);
    }
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-slate-200 p-4 flex flex-col gap-3 hover:shadow-md hover:border-indigo-400 transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* Top Section - Category and Icon */}
      <div className="flex items-start justify-between gap-2">
        {/* Category Pill */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
          {category}
        </span>
        
        {/* Star Icon - Top Right */}
        <div className="flex-shrink-0">
          {variant === 'customizable' ? (
            <Sparkles className="w-5 h-5 text-slate-400" />
          ) : (
            <button
              onClick={handleFavoriteClick}
              className="p-0.5 hover:bg-slate-100 rounded transition-colors"
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorited
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300 hover:text-yellow-400'
                } transition-colors`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Stats at Bottom - Remixed and Favorited */}
      {(remixCount > 0 || favoriteCount > 0) && (
        <div className="flex gap-4 items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {remixCount > 0 && (
            <span>
              <span className="font-medium text-slate-700">{remixCount.toLocaleString()}</span> remixed
            </span>
          )}
          {favoriteCount > 0 && (
            <span>
              <span className="font-medium text-slate-700">{favoriteCount.toLocaleString()}</span> favorited
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
