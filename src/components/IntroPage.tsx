import React, { useState } from 'react';
import { AIInput, IntegrationsModal } from './ui';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-8">
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
        {messages.length > 0 && (
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
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
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

      {/* Debug button for testing */}
      <div className="mt-8">
        <button
          onClick={onViewProto2}
          className="px-6 py-3 bg-copado-blue text-white font-medium rounded-lg hover:bg-copado-dark transition-colors shadow-md hover:shadow-lg"
        >
          View Proto 2
        </button>
      </div>
    </div>
  );
};

export default IntroPage;

