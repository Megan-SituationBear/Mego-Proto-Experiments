import React from 'react';
import { Sparkles } from 'lucide-react';
import { getCategoryColor } from '../../utils/categoryColors';

export interface TemplateCardProps {
  category: string;
  title: string;
  description: string;
  remixCount?: number;
  favoriteCount?: number; // kept for backwards compatibility but not displayed
  variant?: 'customizable' | 'standard'; // customizable = magic star, standard = no icon
  isFavorited?: boolean; // kept for backwards compatibility but not used
  onFavoriteClick?: (e: React.MouseEvent) => void; // kept for backwards compatibility but not used
  onClick?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  category,
  title,
  description,
  remixCount = 0,
  variant = 'customizable',
  onClick,
}) => {
  const colors = getCategoryColor(category);

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
        
        {/* Icon - Top Right (only for customizable variant) */}
        {variant === 'customizable' && (
          <div className="flex-shrink-0">
            <Sparkles className="w-5 h-5 text-slate-400" />
          </div>
        )}
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

      {/* Stats at Bottom - Remixed only */}
      {remixCount > 0 && (
        <div className="flex gap-4 items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            <span className="font-medium text-slate-700">{remixCount.toLocaleString()}</span> remixed
          </span>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
