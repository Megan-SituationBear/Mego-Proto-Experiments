import { ArrowLeft, Star } from 'lucide-react';

interface TopNavProps {
  // Left side
  onBack?: () => void;
  showBackButton?: boolean;
  
  // Center
  title: string;
  subtitle?: string; // e.g., "Project | Last Modified" or "Code | Last Modified"
  categoryBadge?: {
    text: string;
    color?: 'green' | 'blue' | 'purple' | 'amber' | 'slate';
  };
  
  // Right side
  onFavorite?: () => void;
  isFavorited?: boolean;
  showFavorite?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'blue' | 'white';
  };
  
  // Home page specific
  showHamburger?: boolean;
  onHamburgerClick?: () => void;
  
  // Logo (for landing/home)
  showLogo?: boolean;
  logoText?: string;
  
  // Landing page specific (logged out)
  showAuthButtons?: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  onBack,
  showBackButton = true,
  title,
  subtitle,
  categoryBadge,
  onFavorite,
  isFavorited = false,
  showFavorite = false,
  primaryAction,
  showHamburger = false,
  onHamburgerClick,
  showLogo = false,
  logoText = '+ ASK COPADO',
  showAuthButtons = false,
  onLogin,
  onSignUp,
}) => {
  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>
            )}
            
            {showLogo && (
              <>
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-blue-600">{logoText}</span>
              </>
            )}
          </div>

          {/* Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            {categoryBadge && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-1 ${badgeColors[categoryBadge.color || 'slate']}`}>
                {categoryBadge.text}
              </span>
            )}
            <h1 className="text-lg font-bold text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {showAuthButtons && (
              <>
                <button
                  onClick={onLogin}
                  className="px-6 py-2 rounded border border-slate-300 text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onSignUp}
                  className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            
            {showFavorite && onFavorite && (
              <button
                onClick={onFavorite}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={`w-5 h-5 ${
                    isFavorited
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-400'
                  }`}
                />
              </button>
            )}
            
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  primaryAction.variant === 'white'
                    ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {primaryAction.icon}
                {primaryAction.label}
              </button>
            )}
            
            {showHamburger && onHamburgerClick && (
              <button 
                onClick={onHamburgerClick}
                className="p-2 hover:bg-slate-100 rounded transition-colors"
                aria-label="Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                  <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
                  <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
