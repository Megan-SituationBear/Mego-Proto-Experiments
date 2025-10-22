import { useState } from 'react';
import { AIInput, ConversationDisplay, IntegrationsModal, TemplateCard, TopNav, type ConversationMessage } from '../components/ui';
import AuthModal from '../components/ui/AuthModal';
import MatchingModal from '../components/ui/MatchingModal';
import NameCollectionModal from '../components/ui/NameCollectionModal';
import BuildingModal from '../components/ui/BuildingModal';
import { generateAIResponse } from '../utils/aiMessageGenerator';

interface IntroPageProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  onViewTemplate?: (template: any) => void;
  onViewPricing?: () => void;
}

/**
 * IntroPage - Landing page for logged-out users
 * Manages its own conversation state
 */
const IntroPage: React.FC<IntroPageProps> = ({ onLogin, onSignUp, onViewTemplate, onViewPricing }) => {
  // UI state
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);
  
  // Onboarding state (for future use)
  const [_pendingSSOProvider, setPendingSSOProvider] = useState<string | null>(null);
  const [_userName, setUserName] = useState<string>('');
  
  // Conversation state - managed internally
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const integrations = [
    { name: 'Slack', icon: '💬', description: 'Connect your Slack workspace' },
    { name: 'Confluence', icon: '📚', description: 'Link knowledge base' },
    { name: 'Jira', icon: '🎫', description: 'Sync with project management' },
    { name: 'Github', icon: '🐙', description: 'Access repositories' }
  ];

  const handleSignIn = async (email: string, password: string) => {
    console.log('Sign in attempt:', { email, passwordLength: password.length });
    setShowAuthModal(false);
    if (onLogin) {
      onLogin();
    }
  };

  const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
    console.log('Sign up attempt:', { email, passwordLength: password.length, confirmPasswordLength: confirmPassword.length });
    setShowAuthModal(false);
    if (onSignUp) {
      onSignUp();
    }
  };

  const handleSSOSignIn = async (provider: string) => {
    console.log('SSO sign in with provider:', provider);
    // Store provider and close auth modal
    setPendingSSOProvider(provider);
    setShowAuthModal(false);
    
    // Start onboarding flow: Questions → Name → Building → Login
    setShowMatchingModal(true);
  };

  const handleSSOSignUp = async (provider: string) => {
    console.log('SSO sign up with provider:', provider);
    // Store provider and close auth modal
    setPendingSSOProvider(provider);
    setShowAuthModal(false);
    
    // Start onboarding flow: Questions → Name → Building → Onboarding
    setShowMatchingModal(true);
  };

  const handleQuestionsComplete = () => {
    setShowMatchingModal(false);
    
    if (authMode === 'signin') {
      // Sign in: Ask for name, then building animation
      setShowNameModal(true);
    } else {
      // Sign up: Go directly to pricing page
      setPendingSSOProvider(null);
      if (onViewPricing) {
        onViewPricing();
      }
    }
  };

  const handleNameSubmit = (name: string) => {
    console.log('User name:', name);
    setUserName(name);
    setShowNameModal(false);
    
    // Show building animation then go to home (sign-in only)
    setShowBuildingModal(true);
  };

  const handleBuildingComplete = () => {
    setShowBuildingModal(false);
    setPendingSSOProvider(null);
    
    // Complete sign-in (sign-up already went to pricing)
    if (onLogin) {
      onLogin();
    }
  };

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    if (!text.trim()) return;

    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);

    // Create user conversation message
    const userConversationMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userConversationMessage]);
    
    // Show typing indicator
    if (setTypingIndicator) {
      setTypingIndicator(true);
    }

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(text, newUserMessageCount);
      // Convert complex message format to simple string content
      const aiMessage: ConversationMessage = {
        id: response.conversationMessage.id,
        content: typeof response.conversationMessage.content === 'string' 
          ? response.conversationMessage.content 
          : response.conversationMessage.content.content,
        isUser: false,
        timestamp: response.conversationMessage.timestamp
      };
      setConversationMessages(prev => [...prev, aiMessage]);
      
      // Hide typing indicator
      if (setTypingIndicator) {
        setTypingIndicator(false);
      }
    }, 1200);
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const handleIntegrationsClick = () => {
    setShowIntegrationsModal(true);
  };

  const handleSendMessageWithConversation = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    handleSendMessage(text, setTypingIndicator);
  };

  const allTemplates = [
    {
      category: "Effective Planners",
      categoryColor: "amber" as const,
      savedHours: 28,
      title: "Plan Projects with Precision Using Predictive Analytics",
      description: "Working on: Saved est 28hrs by analyzing project data to avoid timeline issues by using planning tools",
      favorites: 823,
      views: 1156
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 51,
      title: "Build and Launch Features Faster with Automation",
      description: "Working on: Saved est 51hrs by analyzing code patterns to avoid launch delays by using CI/CD pipelines",
      favorites: 1456,
      views: 2198
    },
    {
      category: "Admins",
      categoryColor: "green" as const,
      savedHours: 34,
      title: "Streamline User Management and Permissions",
      description: "Working on: Saved est 34hrs by automating user provisioning to avoid security gaps by using admin tools",
      favorites: 967,
      views: 1542
    },
    {
      category: "Customer Satisfaction Heroes",
      categoryColor: "blue" as const,
      savedHours: 42,
      title: "Optimize User Experience with Customer Feedback Analysis",
      description: "Working on: Saved est 42hrs by analyzing customer data to avoid satisfaction issues by using feedback loops",
      favorites: 987,
      views: 203
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 51,
      title: "Build and Launch Features Faster with Automation",
      description: "Working on: Saved est 51hrs by analyzing code patterns to avoid launch delays by using CI/CD pipelines",
      favorites: 1456,
      views: 298
    },
    {
      category: "Effective Planners",
      categoryColor: "amber" as const,
      savedHours: 19,
      title: "Plan Projects with Precision Using Predictive Analytics",
      description: "Working on: Saved est 19hrs by analyzing project data to avoid timeline issues by using planning tools",
      favorites: 623,
      views: 142
    }
  ];

  const templates = allTemplates.slice(0, 3);

  const handleTemplateClick = (template: typeof allTemplates[0]) => {
    if (onViewTemplate) {
      onViewTemplate(template);
    }
  };

  return (
    <div className="min-h-screen bg-white animate-fadeIn">
      {/* Navigation Bar */}
      <TopNav
        title=""
        showBackButton={false}
        showAuthButtons={true}
        onLogin={onLogin}
        onSignUp={onSignUp}
      />

      {/* Hero Section with Templates - Dark Background */}
      <section className="bg-[#1a2b4a] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-center mb-2" style={{ color: 'white' }}>
            Copado AI
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-center mb-8" style={{ color: 'white' }}>
            Streamline & Supercharge Salesforce
          </p>

          {/* Section Label */}
          <div className="text-center mb-6">
            <p className="text-blue-400 uppercase tracking-wider text-sm font-medium">
              THIS WEEK'S POPULAR TIME SAVERS
            </p>
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                category={template.category}
                title={template.title}
                description={template.description}
                remixCount={template.views || 0}
                favoriteCount={template.favorites || 0}
                variant={index === 1 ? "standard" : "customizable"}
                onClick={() => handleTemplateClick(template)}
              />
            ))}
          </div>

          {/* Find My Matches Button */}
          <div className="text-center">
            <button
              onClick={() => setShowMatchingModal(true)}
              className="px-8 py-2 rounded border border-white bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              Find My Matches
            </button>
          </div>
        </div>
      </section>

      {/* Input Section - Light Background */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-8">
            Start Something New
          </h2>

          {/* Conversation Display (appears above input when there are messages) */}
          <ConversationDisplay
            messages={conversationMessages}
            showTypingIndicator={showCopadoTyping}
            variant="floating"
            className="mb-6"
          />

          {/* AI Input Component (without built-in conversation) */}
          <div className="mb-6">
            <AIInput
              placeholder="Describe how I can help ...."
              onSendMessage={(text) => handleSendMessageWithConversation(text, setShowCopadoTyping)}
              onIntegrationsClick={handleIntegrationsClick}
              autoFocus={false}
              isLoggedIn={false}
              pageContext="home"
              hasConversation={conversationMessages.length > 0}
            />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600 text-sm mb-2">
            Copyright Copaco 2025-2029{' '}
            <a href="#" className="text-blue-600 hover:underline">View Documentation</a>
          </p>
          <a href="#" className="text-blue-600 hover:underline text-sm">
            Enterprise Inquiries
          </a>
        </div>
      </footer>

      {/* Modals */}
      <IntegrationsModal
        isOpen={showIntegrationsModal}
        onClose={() => setShowIntegrationsModal(false)}
        integrations={integrations}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSSOSignIn={handleSSOSignIn}
        onSSOSignUp={handleSSOSignUp}
        onSwitchMode={switchAuthMode}
      />

      <MatchingModal
        isOpen={showMatchingModal}
        onClose={() => setShowMatchingModal(false)}
        onComplete={handleQuestionsComplete}
        onBrowseTemplates={(selectedGoals) => {
          console.log('Browse templates with goals:', selectedGoals);
          handleQuestionsComplete();
        }}
      />

      <NameCollectionModal
        isOpen={showNameModal}
        onSubmit={handleNameSubmit}
      />

      <BuildingModal
        isOpen={showBuildingModal}
        onComplete={handleBuildingComplete}
      />
    </div>
  );
};

export default IntroPage;
