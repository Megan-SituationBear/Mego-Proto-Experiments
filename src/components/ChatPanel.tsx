import React, { useRef, useEffect } from 'react';
import { AIInput } from './ui';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  hasStarted: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, hasStarted }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleIntegrationsClick = () => {
    console.log('Integrations clicked');
    // TODO: Implement integrations modal
  };

  const quickActions = [
    "Show me my Salesforce projects",
    "Create a deployment plan",
    "Analyze my org health",
    "Help with user management",
    "Review recent changes"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-copado-blue to-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-slate-800 font-medium text-lg">Copado AI</h2>
            <p className="text-slate-500 text-sm">Customer planning assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scrollbar p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} slide-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
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
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions - Only show when not started */}
      {!hasStarted && (
        <div className="p-6 border-t border-slate-200/60">
          <p className="text-sm text-slate-600 mb-4 font-medium">Start planning for your customer:</p>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(action)}
                className="w-full text-left p-3 text-sm bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition-all duration-200 border border-slate-200/60 hover:border-slate-300/60 hover:shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-slate-200/60">
        <AIInput
          placeholder={hasStarted ? "Continue the conversation..." : "Describe your customer's needs..."}
          onSendMessage={onSendMessage}
          onUploadImage={handleUploadImage}
          onUploadDoc={handleUploadDoc}
          onExamineSlack={handleExamineSlack}
          onAddConfluence={handleAddConfluence}
          onIntegrationsClick={handleIntegrationsClick}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
