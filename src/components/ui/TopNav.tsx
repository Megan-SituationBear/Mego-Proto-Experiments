import { Search, Star, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopNavProps {
  // Left side - Logo and nav items
  showLogo?: boolean;
  logoText?: string;
  onLogoClick?: () => void;
  isHomePage?: boolean; // If true, shows Copado logo instead of back arrow
  
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
  salesforceOrg?: {
    name?: string;
    sandbox?: string;
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
  isHomePage = false,
  
  // Navigation items
  onProductsClick,
  onLearnClick,
  onIntegrationsClick,
  onPricingClick,
  
  // Integrations
  connectedIntegrations = {},
  salesforceOrg,
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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const integrationsRef = useRef<HTMLDivElement>(null);
  const learnRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Close dropdowns and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (integrationsRef.current && !integrationsRef.current.contains(event.target as Node)) {
        setIntegrationsOpen(false);
      }
      if (learnRef.current && !learnRef.current.contains(event.target as Node)) {
        setLearnOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Focus input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);
  
  const integrations = [
    { id: 'salesforce' as const, name: 'Salesforce', icon: '🏢' },
    { id: 'slack' as const, name: 'Slack', icon: '💬' },
    { id: 'jira' as const, name: 'Jira', icon: '🎫' },
    { id: 'github' as const, name: 'Github', icon: '🐙' },
  ];
  
  const learnVideos = [
    { id: 'intro', title: 'Getting Started', duration: '5 min' },
    { id: 'advanced', title: 'Advanced Workflows', duration: '12 min' },
    { id: 'integrations', title: 'Setting Up Integrations', duration: '8 min' },
  ];
  
  const learnHowTos = [
    { id: 'deploy', title: 'Deploy Your First Project' },
    { id: 'automate', title: 'Automate Deployments' },
    { id: 'testing', title: 'Testing Best Practices' },
  ];
  
  const learnLibrary = [
    { id: 'template1', title: 'Salesforce Project Template' },
    { id: 'template2', title: 'CI/CD Pipeline Setup' },
    { id: 'template3', title: 'Org Health Checklist' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
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
                title={isHomePage ? "Copado AI" : "Back to Home"}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {isHomePage ? (
                    // Copado logo for home page
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    // Back arrow for other pages
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" fill="white" />
                    </svg>
                  )}
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
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:flex py-1 group"
                  >
                    Integrations
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 group-hover:text-indigo-600 ${
                        integrationsOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {integrationsOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50">
                      <div className="grid grid-cols-2 gap-3">
                        {integrations.map((integration) => {
                          const isConnected = connectedIntegrations[integration.id];
                          const isSalesforce = integration.id === 'salesforce';
                          return (
                            <button
                              key={integration.id}
                              onClick={() => {
                                onIntegrationClick?.(integration.id);
                                setIntegrationsOpen(false);
                              }}
                              className={`group relative flex flex-col items-start gap-2 p-4 rounded-lg border-2 transition-all ${
                                isConnected
                                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">{integration.icon}</span>
                                  <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-900 text-sm">{integration.name}</span>
                                    {isSalesforce && isConnected && salesforceOrg && (
                                      <div className="text-xs text-slate-600 mt-0.5">
                                        <div>{salesforceOrg.name || 'Production'}</div>
                                        {salesforceOrg.sandbox && (
                                          <div className="text-slate-500">{salesforceOrg.sandbox}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {isConnected && (
                                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:flex py-1 group"
                  >
                    Learn
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 group-hover:text-indigo-600 ${
                        learnOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {learnOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-[700px] bg-white rounded-xl shadow-2xl border border-slate-200 p-6 z-50">
                      <div className="grid grid-cols-3 gap-6">
                        {/* Videos Column */}
                        <div className="flex flex-col gap-3">
                          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Videos</h3>
                          {learnVideos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => {
                                onLearnClick();
                                setLearnOpen(false);
                              }}
                              className="text-left p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all group"
                            >
                              <div className="font-medium text-sm text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {video.title}
                              </div>
                              <div className="text-xs text-slate-500">{video.duration}</div>
                            </button>
                          ))}
                        </div>
                        
                        {/* Featured How-To's Column */}
                        <div className="flex flex-col gap-3">
                          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Featured How-To's</h3>
                          {learnHowTos.map((howTo) => (
                            <button
                              key={howTo.id}
                              onClick={() => {
                                onLearnClick();
                                setLearnOpen(false);
                              }}
                              className="text-left p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all group"
                            >
                              <div className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                {howTo.title}
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {/* Library Items For You Column */}
                        <div className="flex flex-col gap-3">
                          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Library Items For You</h3>
                          {learnLibrary.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                onLearnClick();
                                setLearnOpen(false);
                              }}
                              className="text-left p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all group"
                            >
                              <div className="font-medium text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pricing */}
              {onPricingClick && (
                <button
                  onClick={onPricingClick}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden md:block py-1"
                >
                  Pricing
                </button>
              )}
            </div>
          )}

          {/* Right Side - Search + Dashboard + Avatar */}
          <div className="flex items-center gap-3">
            {/* Expandable Search */}
            {onSearchClick && (
              <div ref={searchRef} className="relative">
                <div 
                  className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white transition-all duration-300 ease-in-out overflow-hidden ${
                    searchExpanded ? 'w-64' : 'w-10'
                  }`}
                >
                  <button
                    onClick={() => {
                      if (!searchExpanded) {
                        setSearchExpanded(true);
                      }
                    }}
                    className="p-2 text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0"
                    title="Search (⌘K)"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  {searchExpanded && (
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      className="flex-1 outline-none text-sm text-slate-900 placeholder-slate-500 pr-3 bg-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onSearchClick();
                          setSearchExpanded(false);
                        }
                        if (e.key === 'Escape') {
                          setSearchExpanded(false);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            
            {/* My Dashboard Button */}
            {isLoggedIn && onDashboardClick && (
              <button
                onClick={onDashboardClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                My Dashboard
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
