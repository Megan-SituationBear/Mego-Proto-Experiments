import { useState } from 'react';
import { AIInput, IntegrationsModal, SignInModal, SignUpModal, Button, TemplateCard, TemplateDetailModal } from './ui';
import type { ConversationMessage } from './Conversation';

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

const IntroPage: React.FC<IntroPageProps> = ({ onViewProto2, onSendMessage }) => {
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof allTemplates[0] | null>(null);
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);

  const integrations = [
    { name: 'Slack', icon: '💬', description: 'Connect your Slack workspace' },
    { name: 'Confluence', icon: '📚', description: 'Link knowledge base' },
    { name: 'Jira', icon: '🎫', description: 'Sync with project management' },
    { name: 'Github', icon: '🐙', description: 'Access repositories' }
  ];

  const handleSignIn = async (email: string, password: string) => {
    console.log('Sign in attempt:', { email, passwordLength: password.length });
    setShowSignInModal(false);
  };

  const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
    console.log('Sign up attempt:', { email, passwordLength: password.length, confirmPasswordLength: confirmPassword.length });
    setShowSignUpModal(false);
  };

  const handleSSOSignIn = async (provider: string) => {
    console.log('SSO sign in with provider:', provider);
    setShowSignInModal(false);
  };

  const handleSSOSignUp = async (provider: string) => {
    console.log('SSO sign up with provider:', provider);
    setShowSignUpModal(false);
  };

  const handleIntegrationsClick = () => {
    setShowIntegrationsModal(true);
  };

  const handleSendMessageWithConversation = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    if (onSendMessage) {
      onSendMessage(text, setTypingIndicator);
    }
  };

  const allTemplates = [
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Strategy Title Here About Using Real Data",
      description: "Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk | By | Using Integrations | To Save | # Hours |",
      favorites: 1234,
      views: 154
    },
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Strategy Title Here About Using Real Data",
      description: "Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk | By | Using Integrations | To Save | # Hours |",
      favorites: 1234,
      views: 154
    },
    {
      category: "Strategists",
      categoryColor: "purple" as const,
      savedHours: 35,
      title: "Strategy Title Here About Using Real Data",
      description: "Working On: Saved Est | Hrs | By Analyzing | What | To Avoid | Risk | By | Using Integrations | To Save | # Hours |",
      favorites: 1234,
      views: 154
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

  const [templates, setTemplates] = useState(allTemplates.slice(0, 3));

  const shuffleTemplates = () => {
    const shuffled = [...allTemplates].sort(() => Math.random() - 0.5);
    setTemplates(shuffled.slice(0, 3));
  };

  const handleTemplateClick = (template: typeof allTemplates[0]) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleUseTemplate = () => {
    console.log('Using template:', selectedTemplate?.title);
    setShowTemplateModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16 gap-3">
            <button
              onClick={() => setShowSignInModal(true)}
              className="px-6 py-2 rounded border border-gray-300 text-slate-900 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setShowSignUpModal(true)}
              className="px-6 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Templates - Dark Background */}
      <section className="bg-slate-800 py-12 px-4">
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
          <h1 className="text-5xl font-bold text-white text-center mb-2">
            Copado AI
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-white text-center mb-8">
            Streamline & Supercharge Salesforce
          </p>

          {/* Section Label */}
          <div className="text-center mb-6">
            <p className="text-blue-400 uppercase tracking-wider text-sm font-medium">
              SAMPLES OF POPULAR TIME SAVERS
            </p>
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                onClick={() => handleTemplateClick(template)}
              />
            ))}
          </div>

          {/* Shuffle Button */}
          <div className="text-center">
            <button
              onClick={shuffleTemplates}
              className="px-8 py-2 rounded border border-white bg-transparent text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Shuffle These
            </button>
          </div>
        </div>
      </section>

      {/* Input Section - Light Background */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-8">
            What Are Your Time Savers?
          </h2>

          {/* AI Input Component */}
          <div className="mb-6">
            <AIInput
              placeholder="You want to .... make what ... for whom?"
              onSendMessage={(text) => handleSendMessageWithConversation(text, setShowCopadoTyping)}
              onIntegrationsClick={handleIntegrationsClick}
              autoFocus={false}
              isLoggedIn={false}
              pageContext="home"
              hasConversation={false}
              messages={[]}
              showTypingIndicator={showCopadoTyping}
            />
          </div>

          {/* Find Templates Button */}
          <div className="text-center">
            <button className="px-8 py-2 rounded border border-gray-300 text-slate-900 text-sm font-medium hover:bg-gray-50 transition-colors">
              Find Templates
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-2">
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

      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
        onSSOSignIn={handleSSOSignIn}
        onSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />

      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSignUp={handleSignUp}
        onSSOSignUp={handleSSOSignUp}
        onSignIn={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />

      <TemplateDetailModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        template={selectedTemplate}
        onUseTemplate={handleUseTemplate}
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
