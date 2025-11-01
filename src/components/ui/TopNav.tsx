import { Search, LayoutDashboard, Star, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopNavProps {
  // Left side - Logo and nav items
  showLogo?: boolean;
  logoText?: string;
  onLogoClick?: () => void;
  
  // Navigation items
  onProductsClick?: () => void;
  onLearnClick?: () => void;
  onIntegrationsClick?: () => void;
  onPricingClick?: () => void;
  
  // Integrations state
  connectedIntegrations?: {
    salesforce?: boolean;
    slack?: boolean;
    jira?: boolean;
    github?: boolean;
  };
  onIntegrationClick?: (integration: 'salesforce' | 'slack' | 'jira' | 'github') => void;
  
  // Right side actions
  onSearchClick?: () => void;
  onDashboardClick?: () => void;
  onAvatarClick?: () => void;
  userName?: string;
  userInitials?: string;
  isLoggedIn?: boolean;
  
  // Legacy support - can be removed later
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
  subtitle?: string;
  categoryBadge?: {
    text: string;
    color?: 'green' | 'blue' | 'purple' | 'amber' | 'slate' | 'orange';
  };
  onFavorite?: () => void;
  isFavorited?: boolean;
  showFavorite?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'blue' | 'white';
  };
  showAuthButtons?: boolean;
  onLogin?: () => void;
  onSignUp?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  // Logo
  showLogo = true,
  logoText = '+ COPADO AI',
  onLogoClick,
  
  // Navigation items
  onProductsClick,
  onLearnClick,
  onIntegrationsClick,
  onPricingClick,
  
  // Integrations
  connectedIntegrations = {},
  onIntegrationClick,
  
  // Right side
  onSearchClick,
  onDashboardClick,
  onAvatarClick,
  userName,
  userInitials,
  isLoggedIn = false,
  
  // Legacy support
  showBackButton = false,
  onBack,
  title,
  subtitle,
  categoryBadge,
  onFavorite,
  isFavorited = false,
  showFavorite = false,
  primaryAction,
  showAuthButtons = false,
  onLogin,
  onSignUp,
}) => {
  // Generate initials from userName if not provided
  const getInitials = () => {
    if (userInitials) return userInitials;
    if (userName) {
      const parts = userName.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return userName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    orange: 'bg-orange-100 text-orange-700',
  };

  // Check if using legacy mode (title-based nav)
  const isLegacyMode = title && !onProductsClick && !onLearnClick && !onIntegrationsClick && !onPricingClick;
  
  // Dropdown state
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (integrationsRef.current && !integrationsRef.current.contains(event.target as Node)) {
        setIntegrationsOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const integrations = [
    { id: 'salesforce' as const, name: 'Salesforce', icon: '🏢' },
    { id: 'slack' as const, name: 'Slack', icon: '💬' },
    { id: 'jira' as const, name: 'Jira', icon: '🎫' },
    { id: 'github' as const, name: 'Github', icon: '🐙' },
  ];
  
  const learnItems = [
    { id: 'docs', name: 'Documentation' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'guides', name: 'Guides' },
    { id: 'api', name: 'API Reference' },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo + Products + Learn OR Legacy Back + Logo */}
          <div className="flex items-center gap-6">
            {/* Legacy Back Button */}
            {isLegacyMode && showBackButton && onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Back"
              >
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Logo */}
            {showLogo && (
              <button
                onClick={onLogoClick}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-base font-semibold text-slate-900 hidden sm:inline">{logoText}</span>
              </button>
            )}
            
          </div>

          {/* Center - Legacy Title OR Integrations + Learn Dropdowns */}
          {isLegacyMode ? (
            title && (
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
            )
          ) : (
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
              {/* Integrations Dropdown */}
              {onIntegrationsClick && (
                <div className="relative" ref={integrationsRef}>
                  <button
                    onClick={() => {
                      setIntegrationsOpen(!integrationsOpen);
                      setLearnOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden md:flex py-1 group"
                  >
                    Integrations
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 group-hover:text-slate-700 ${
                        integrationsOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {integrationsOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-64 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                      {integrations.map((integration) => {
                        const isConnected = connectedIntegrations[integration.id];
                        return (
                          <button
                            key={integration.id}
                            onClick={() => {
                              onIntegrationClick?.(integration.id);
                              setIntegrationsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group/item"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-base">{integration.icon}</span>
                              <span className="font-medium">{integration.name}</span>
                            </div>
                            {isConnected && (
                              <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Learn Dropdown */}
              {onLearnClick && (
                <div className="relative" ref={learnRef}>
                  <button
                    onClick={() => {
                      setLearnOpen(!learnOpen);
                      setIntegrationsOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden md:flex py-1 group"
                  >
                    Learn
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 group-hover:text-slate-700 ${
                        learnOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {learnOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-50">
                      {learnItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onLearnClick();
                            setLearnOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Right Side - Search + Dashboard + Avatar */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm text-slate-600 hover:text-slate-900"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
                  ⌘K
                </kbd>
              </button>
            )}
            
            {/* Dashboard */}
            {isLoggedIn && onDashboardClick && (
              <button
                onClick={onDashboardClick}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Dashboard"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5 text-slate-600" />
              </button>
            )}
            
            {/* Avatar */}
            {isLoggedIn && onAvatarClick && (
              <button
                onClick={onAvatarClick}
                className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label={userName ? `User menu for ${userName}` : 'User menu'}
                title={userName || 'User'}
              >
                {getInitials()}
              </button>
            )}
            
            {/* Legacy Auth Buttons */}
            {showAuthButtons && !isLoggedIn && (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onSignUp}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
            
            {/* Legacy Favorite */}
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
            
            {/* Legacy Primary Action */}
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
