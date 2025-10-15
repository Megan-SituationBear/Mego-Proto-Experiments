import React, { useState } from 'react';
import { AIInput, IntegrationsModal, SignInModal, SignUpModal, Button } from './ui';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface IntroPageProps {
  onViewProto2: () => void;
  onSendMessage?: (text: string) => void;
  messages?: Message[];
}

const IntroPage: React.FC<IntroPageProps> = ({ onViewProto2, onSendMessage, messages = [] }) => {
  const [showIntegrationsModal, setShowIntegrationsModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);

  const questionOptions = [
    "What does Copado do?",
    "Help me plan a deployment",
    "Analyze my Salesforce org",
    "Show me best practices"
  ];

  const handleIntegrationsClick = () => {
    setShowIntegrationsModal(true);
  };

  const handleUploadImage = () => {
    console.log('Upload image clicked');
    // TODO: Implement image upload functionality
  };

  const handleUploadDoc = () => {
    console.log('Upload doc clicked');
    // TODO: Implement document upload functionality
  };

  const handleExamineSlack = () => {
    console.log('Examine Slack clicked');
    // TODO: Implement Slack examination functionality
  };

  const handleAddConfluence = () => {
    console.log('Add confluence clicked');
    // TODO: Implement Confluence integration
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-8">
      {/* Header with Sign In/Sign Up */}
      <div className="absolute top-0 right-0 p-6 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setShowSignInModal(true)}
        >
          Sign In
        </Button>
        <Button
          variant="primary"
          onClick={() => setShowSignUpModal(true)}
        >
          Sign Up
        </Button>
      </div>

      {/* Interactive AI Input Box - Centered */}
      <div className="w-full max-w-4xl mx-auto px-4">
        <AIInput
          placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
          onSendMessage={onSendMessage}
          onUploadImage={handleUploadImage}
          onUploadDoc={handleUploadDoc}
          onExamineSlack={handleExamineSlack}
          onAddConfluence={handleAddConfluence}
          onIntegrationsClick={handleIntegrationsClick}
        />

        {/* Messages Display */}
        {(messages.length > 0 || showCopadoTyping) && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isUser
                        ? 'bg-copado-blue text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className={message.isUser ? 'text-sm text-white' : 'message-text'}>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Copado Typing Indicator - Left aligned */}
              {showCopadoTyping && !messages.some(m => !m.isUser) && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                      <span className="message-text text-sm">Copado is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pill-style Question Options */}
        {messages.length === 0 && !showCopadoTyping && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {questionOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (onSendMessage) {
                      onSendMessage(option);
                      setShowCopadoTyping(true);
                      setTimeout(() => setShowCopadoTyping(false), 2000);
                    }
                  }}
                  className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md message-text"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Integrations Modal */}
      <IntegrationsModal
        isOpen={showIntegrationsModal}
        onClose={() => setShowIntegrationsModal(false)}
        integrations={integrations}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
        onSignUp={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
      />

      {/* Sign Up Modal */}
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
      <div className="mt-8">
        <Button
          variant="primary"
          size="lg"
          onClick={onViewProto2}
        >
          View Proto 2
        </Button>
      </div>
    </div>
  );
};

export default IntroPage;

