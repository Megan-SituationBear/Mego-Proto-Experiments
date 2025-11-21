import React from 'react';
import AIInput from '../components/ui/AIInput';
import TopNav from '../components/ui/TopNav';

interface IntroPageProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  onViewPricing?: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onLogin, onSignUp }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation - Logged Out */}
      <TopNav
        isHomePage={true}
        isLoggedIn={false}
        showAuthButtons={true}
        onLogin={onLogin}
        onSignUp={onSignUp}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4 sm:mb-6">
            Great work comes alive here
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Copado AI helps you streamline Salesforce work with intelligent automation and contextual guidance
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12">
            <button
              onClick={onSignUp}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Sign up free
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all"
            >
              Log in
            </button>
          </div>
        </div>

        {/* AI Input */}
        <div className="max-w-4xl mx-auto mb-12">
          <AIInput
            placeholder="What can I help you with today? Press 'enter' to submit."
            onSendMessage={() => {
              // For logged out users, clicking send should trigger signup
              if (onSignUp) {
                onSignUp();
              }
            }}
            autoFocus={false}
            isLoggedIn={false}
            pageContext="home"
            hasConversation={false}
            messages={[]}
          />
        </div>

        {/* Quick Ideas */}
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-slate-700 mb-4 text-center">Try these ideas:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={onSignUp}
              className="px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow-md"
            >
              <span className="text-blue-600 mr-2">💡</span>
              Create a deployment plan
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow-md"
            >
              <span className="text-purple-600 mr-2">🔍</span>
              Analyze my org health
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow-md"
            >
              <span className="text-green-600 mr-2">📋</span>
              Generate test scripts
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow-md"
            >
              <span className="text-orange-600 mr-2">⚡</span>
              Automate a user story
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI-Powered</h3>
            <p className="text-slate-600 text-sm">Intelligent automation for Salesforce workflows</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Contextual</h3>
            <p className="text-slate-600 text-sm">Understands your org and project context</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Collaborative</h3>
            <p className="text-slate-600 text-sm">Share and collaborate with your team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
