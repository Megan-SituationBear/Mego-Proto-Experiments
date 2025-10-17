import { useState } from 'react';
import { AIInput, IntegrationsModal, SignInModal, SignUpModal, Button, TemplateCard, SecondaryButton } from './ui';
import type { ConversationMessage } from './Conversation';
import { ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface IntroPageProps {
  onViewProto2: () => void;
  onSendMessage?: (text: string, setTypingIndicator?: (show: boolean) => void) => void;
  messages?: Message[];
  conversationMessages?: ConversationMessage[];
  userMessageCount?: number;
}

const IntroPage: React.FC<IntroPageProps> = ({ onViewProto2, onSendMessage, conversationMessages = [] }) => {
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);

  const handleIntegrationsClick = () => {
    setShowIntegrationsModal(true);
  };

  const integrations = [
    { name: 'Slack', icon: '💬', description: 'Connect your Slack workspace' },
    { name: 'Confluence', icon: '📚', description: 'Link knowledge base' },
    { name: 'Jira', icon: '🎫', description: 'Sync with project management' },
    { name: 'Github', icon: '🐙', description: 'Access repositories' }
  ];

  const handleSignIn = async (email: string, password: string) => {
    console.log('Sign in attempt:', { email, passwordLength: password.length });
    // TODO: Implement actual sign in logic
    setShowSignInModal(false);
  };

  const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
    console.log('Sign up attempt:', { email, passwordLength: password.length, confirmPasswordLength: confirmPassword.length });
    // TODO: Implement actual sign up logic
    setShowSignUpModal(false);
  };

  const handleSendMessageWithConversation = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    if (onSendMessage) {
      onSendMessage(text, setTypingIndicator);
    }
  };

  const allTemplates = [
    {
      category: "Strategists With Data",
      categoryColor: "amber" as const,
      savedHours: 42,
      title: "Create Comprehensive Deployment Strategy Using Real Data",
      description: "Working on: Saved est 42hrs by analyzing org metadata to avoid technical debt by using automated analysis to save 42 hours",
      favorites: 987,
      views: 203
    },
    {
      category: "Customer Satisfaction Heroes",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Optimize User Experience with Customer Feedback Analysis",
      description: "Working on: Saved est 35hrs by analyzing customer data to avoid satisfaction issues by using feedback loops to save 35 hours",
      favorites: 1234,
      views: 154
    },
    {
      category: "Managers With An Edge",
      categoryColor: "blue" as const,
      savedHours: 28,
      title: "Lead Teams to Success with Data-Driven Insights",
      description: "Working on: Saved est 28hrs by analyzing team performance to avoid bottlenecks by using management tools to save 28 hours",
      favorites: 756,
      views: 189
    },
    {
      category: "Developers & Launchers",
      categoryColor: "green" as const,
      savedHours: 51,
      title: "Build and Launch Features Faster with Automation",
      description: "Working on: Saved est 51hrs by analyzing code patterns to avoid launch delays by using CI/CD pipelines to save 51 hours",
      favorites: 1456,
      views: 298
    },
    {
      category: "Effective Planners",
      categoryColor: "blue" as const,
      savedHours: 19,
      title: "Plan Projects with Precision Using Predictive Analytics",
      description: "Working on: Saved est 19hrs by analyzing project data to avoid timeline issues by using planning tools to save 19 hours",
      favorites: 623,
      views: 142
    },
    {
      category: "Strategists With Data",
      categoryColor: "amber" as const,
      savedHours: 67,
      title: "Transform Business Strategy with Data-Driven Decisions",
      description: "Working on: Saved est 67hrs by analyzing business metrics to avoid strategic missteps by using analytics to save 67 hours",
      favorites: 891,
      views: 234
    }
  ];

  const [templates, setTemplates] = useState(allTemplates.slice(0, 3));

  const shuffleTemplates = () => {
    const shuffled = [...allTemplates].sort(() => Math.random() - 0.5);
    setTemplates(shuffled.slice(0, 3));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16 gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSignInModal(true)}
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowSignUpModal(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen h-screen md:h-auto md:min-h-screen flex flex-col justify-center px-4 relative">
        <div className="max-w-6xl mx-auto text-center w-full">
          <div className="-mt-20">
            {/* Logo */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-slate-950 mb-4 md:mb-6 leading-tight">
              Supercharge Salesforce <span className="text-blue-600">Work</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 md:mb-16 max-w-3xl mx-auto px-4">
              Speed Up Everyday Work, Without Sacrificing Quality
            </p>

            {/* AI Input */}
            <div className="w-full max-w-4xl mx-auto mb-8 md:mb-12 px-2 sm:px-0">
              <AIInput
                placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
                onSendMessage={(text) => handleSendMessageWithConversation(text, setShowCopadoTyping)}
                onIntegrationsClick={handleIntegrationsClick}
                autoFocus={true}
                isLoggedIn={false}
                pageContext="home"
                hasConversation={conversationMessages.length > 0}
                messages={conversationMessages.map(msg => ({
                  id: msg.id,
                  content: msg.content.content,
                  isUser: msg.isUser,
                  timestamp: msg.timestamp
                }))}
                showTypingIndicator={showCopadoTyping}
              />
            </div>

            {/* Version and Links */}
            <div className="text-xs sm:text-sm text-gray-600">
              Version number 34910. 
              <a href="#" className="text-blue-600 hover:underline ml-2">Documentation</a>
              <a href="#" className="text-blue-600 hover:underline ml-2">Learning Videos</a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs sm:text-sm text-gray-500 mb-2">cool things to do</p>
          <div className="animate-bounce">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto" />
          </div>
        </div>
      </section>

      {/* Quick Start Templates Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 uppercase tracking-wide text-sm mb-2">
              COPY. MODIFY. LEARN
            </p>
            <h2 className="text-4xl font-bold text-white">
              Quick Start Templates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                category={template.category}
                categoryColor={template.categoryColor}
                savedHours={template.savedHours}
                title={template.title}
                description={template.description}
                favorites={template.favorites}
                views={template.views}
              />
            ))}
          </div>

          <div className="text-center flex flex-col gap-4">
            <SecondaryButton onClick={shuffleTemplates} className="mx-auto">
              Shuffle
            </SecondaryButton>
            <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              View Full Library
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm mb-2">
            Copyright Copaco 2025-2029{' '}
            <a href="#" className="text-blue-500 hover:underline">View Documentation</a>
          </p>
          <a href="#" className="text-blue-500 hover:underline text-sm">
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

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
        onSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={handleSignUp}
        onSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />

      {/* Debug button for testing */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="primary"
          size="sm"
          onClick={onViewProto2}
        >
          View Proto 2
        </Button>
      </div>
    </div>
  );
};

export default IntroPage;

