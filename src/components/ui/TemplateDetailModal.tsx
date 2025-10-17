import React from 'react';
import { X, Heart, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    category: string;
    categoryColor: 'purple' | 'amber' | 'blue' | 'green';
    savedHours: number;
    title: string;
    description: string;
    favorites: number;
    views: number;
  } | null;
  onUseTemplate?: () => void;
}

const categoryColorMap = {
  purple: 'bg-indigo-100 text-indigo-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
};

const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl mx-4">
        {/* White Modal Card */}
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-6 pb-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Category Pill and Hours */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-roboto tracking-tight ${categoryColorMap[template.categoryColor]}`}>
                {template.category}
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-roboto">
                  Saved: {template.savedHours}hrs
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-roboto font-bold text-white mb-2">
              {template.title}
            </h2>

            {/* Stats */}
            <div className="flex gap-4 items-center text-white/80 text-sm">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span>{template.favorites} favorites</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{template.views} views</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-roboto font-semibold text-slate-950 mb-2">
                About This Template
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-lg font-roboto font-semibold text-slate-950 mb-3">
                What's Included
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Pre-configured workflow templates</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Automated deployment scripts</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Best practice guidelines and documentation</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Sample test cases and validation rules</span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-roboto font-semibold text-blue-900 mb-1">
                    Why Use This Template?
                  </h4>
                  <p className="text-sm text-blue-800">
                    This template has helped teams save an average of <strong>{template.savedHours} hours</strong> per project. 
                    It includes proven workflows, automated processes, and best practices from {template.favorites}+ successful implementations.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUseTemplate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-roboto font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Use This Template
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-slate-700 rounded-lg font-roboto font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailModal;
