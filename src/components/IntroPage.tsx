import { useState } from 'react';
import { AIInput, IntegrationsModal, SignInModal, SignUpModal, Button } from './ui';
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

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-8"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      {/* Header with Sign In/Sign Up */}
      <div 
        className="absolute top-0 right-0 p-6 flex gap-3"
        style={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '1.5rem',
          display: 'flex',
          gap: '0.75rem'
        }}
      >
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
      <div 
        className="w-full max-w-4xl mx-auto px-4"
        style={{ 
          width: '100%',
          maxWidth: '56rem',
          margin: '0 auto',
          padding: '0 1rem'
        }}
      >
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

