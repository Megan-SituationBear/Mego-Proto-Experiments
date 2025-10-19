import React, { useState } from 'react';
import TopNav from '../TopNav';

/**
 * Example demonstrating all TopNav states
 */
const TopNavExample: React.FC = () => {
  const [currentState, setCurrentState] = useState<'logged-out' | 'logged-in-major' | 'logged-in-minor'>('logged-out');

  return (
    <div className="space-y-8">
      {/* State Switcher */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-semibold mb-3">Switch Nav State:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentState('logged-out')}
            className={`px-4 py-2 rounded text-sm ${
              currentState === 'logged-out' ? 'bg-copado-blue text-white' : 'bg-white'
            }`}
          >
            Logged Out
          </button>
          <button
            onClick={() => setCurrentState('logged-in-major')}
            className={`px-4 py-2 rounded text-sm ${
              currentState === 'logged-in-major' ? 'bg-copado-blue text-white' : 'bg-white'
            }`}
          >
            Logged In Major
          </button>
          <button
            onClick={() => setCurrentState('logged-in-minor')}
            className={`px-4 py-2 rounded text-sm ${
              currentState === 'logged-in-minor' ? 'bg-copado-blue text-white' : 'bg-white'
            }`}
          >
            Logged In Minor
          </button>
        </div>
      </div>

      {/* TopNav Component */}
      <TopNav
        state={currentState}
        userName="John Doe"
        notificationCount={3}
        onSignIn={() => console.log('Sign In clicked')}
        onSignUp={() => console.log('Sign Up clicked')}
        onNewProject={() => console.log('New Project clicked')}
        onProfileClick={() => console.log('Profile clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onNotificationsClick={() => console.log('Notifications clicked')}
        onLogout={() => console.log('Logout clicked')}
      />

      {/* Documentation */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Current State: {currentState}</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          {currentState === 'logged-out' && (
            <>
              <li>Shows Sign In and Sign Up buttons</li>
              <li>Best for landing pages and public content</li>
            </>
          )}
          {currentState === 'logged-in-major' && (
            <>
              <li>Shows all features: New Project, Notifications, Settings</li>
              <li>Full user profile with avatar and name</li>
              <li>Best for main dashboard and project pages</li>
            </>
          )}
          {currentState === 'logged-in-minor' && (
            <>
              <li>Minimal interface with profile and menu</li>
              <li>Reduced visual clutter</li>
              <li>Best for focused work areas and chat interfaces</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TopNavExample;
