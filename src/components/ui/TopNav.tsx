import React from 'react';
import { Menu, Bell, User, Settings, LogOut, Plus } from 'lucide-react';

type NavState = 'logged-out' | 'logged-in-major' | 'logged-in-minor';

interface TopNavProps {
  state?: NavState;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onNewProject?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onLogout?: () => void;
  userName?: string;
  notificationCount?: number;
  className?: string;
}

const TopNav: React.FC<TopNavProps> = ({
  state = 'logged-out',
  onSignIn,
  onSignUp,
  onNewProject,
  onProfileClick,
  onSettingsClick,
  onNotificationsClick,
  onLogout,
  userName,
  notificationCount = 0,
  className = '',
}) => {
  return (
    <nav className={`w-full bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-copado-blue rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold font-roboto tracking-wider text-slate-950">COPADO AI</span>
          </div>

          {/* Logged Out State */}
          {state === 'logged-out' && (
            <div className="flex items-center gap-3">
              <button
                onClick={onSignIn}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onSignUp}
                className="px-6 py-2 rounded-lg bg-copado-blue text-white text-sm font-medium shadow-sm hover:bg-indigo-600 hover:shadow-md transition-all duration-200"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Logged In Major State - Full Features */}
          {state === 'logged-in-major' && (
            <div className="flex items-center gap-4">
              {/* New Project Button */}
              <button
                onClick={onNewProject}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-copado-blue text-white text-sm font-medium shadow-sm hover:bg-indigo-600 hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Project</span>
              </button>

              {/* Notifications */}
              <button
                onClick={onNotificationsClick}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Settings */}
              <button
                onClick={onSettingsClick}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Profile Menu */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-copado-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {userName && (
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {userName}
                    </span>
                  )}
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Logged In Minor State - Reduced Features */}
          {state === 'logged-in-minor' && (
            <div className="flex items-center gap-3">
              {/* Profile Menu */}
              <button
                onClick={onProfileClick}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-copado-blue rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {userName && (
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {userName}
                  </span>
                )}
              </button>

              {/* Menu */}
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
