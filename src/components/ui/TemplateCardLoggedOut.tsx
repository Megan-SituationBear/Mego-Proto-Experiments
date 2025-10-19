import React from 'react';
import { Heart, Eye, Sparkles, Lock } from 'lucide-react';

export interface TemplateCardLoggedOutProps {
  category: string;
  categoryColor?: 'purple' | 'amber' | 'blue' | 'green';
  savedHours?: number;
  title: string;
  description: string;
  favorites?: number;
  views?: number;
  icon?: React.ReactNode;
  onSignIn?: () => void;
  onSignUp?: () => void;
  className?: string;
}

const categoryColorMap = {
  purple: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
};

const TemplateCardLoggedOut: React.FC<TemplateCardLoggedOutProps> = ({
  category,
  categoryColor = 'purple',
  savedHours,
  title,
  description,
  favorites = 0,
  views = 0,
  icon,
  onSignIn,
  onSignUp,
  className = '',
}) => {
  return (
    <div
      className={`group relative bg-white rounded-lg border border-gray-300 p-4 flex flex-col gap-3 hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col items-center gap-3 p-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm font-medium text-gray-900 text-center">
            Sign in to use this template
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSignIn?.();
              }}
              className="px-4 py-2 text-sm font-medium text-copado-blue hover:text-indigo-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSignUp?.();
              }}
              className="px-4 py-2 rounded-lg bg-copado-blue text-white text-sm font-medium shadow-sm hover:bg-indigo-600 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
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
              {icon || <Sparkles className="w-5 h-5 text-gray-400" />}
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

        {/* Stats */}
        {(favorites > 0 || views > 0) && (
          <div className="flex gap-3 items-center">
            {favorites > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                  {favorites}
                </span>
              </div>
            )}
            
            {views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-[11px] font-roboto tracking-tight leading-5 text-slate-600">
                  {views}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCardLoggedOut;
