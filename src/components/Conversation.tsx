import React from 'react';

export interface MessageContent {
  type: 'text' | 'question' | 'artifact' | 'step-by-step';
  content: string;
  metadata?: {
    artifactName?: string;
    steps?: string[];
  };
}

export interface ConversationMessage {
  id: string;
  content: MessageContent;
  isUser: boolean;
  timestamp: Date;
}

interface ConversationProps {
  messages: ConversationMessage[];
  showTypingIndicator?: boolean;
  onQuestionClick?: (question: string) => void;
}

const Conversation: React.FC<ConversationProps> = ({ 
  messages, 
  showTypingIndicator = false, 
  onQuestionClick 
}) => {
  const renderMessageContent = (content: MessageContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="message-text">
            {content.content}
          </div>
        );
        
      case 'question':
        return (
          <div className="space-y-3">
            <div className="message-text font-medium text-slate-700">
              {content.content}
            </div>
            <div className="flex flex-wrap gap-2">
              {content.metadata?.steps?.map((step, index) => (
                <button
                  key={index}
                  onClick={() => onQuestionClick?.(step)}
                  className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md message-text text-sm"
                >
                  {step}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'artifact':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="message-text font-medium text-green-700">
                I created {content.metadata?.artifactName || 'artifact'}:
              </span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="message-text text-green-800">
                {content.content}
              </div>
            </div>
          </div>
        );
        
      case 'step-by-step':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="message-text font-medium text-blue-700">
                Here is your step-by-step:
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              {content.metadata?.steps?.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="message-text text-blue-800">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return <div className="message-text">{content.content}</div>;
    }
  };

  return (
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
              {message.isUser ? (
                <div className="text-sm text-white">{message.content.content}</div>
              ) : (
                renderMessageContent(message.content)
              )}
              <p className={`text-xs mt-2 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {showTypingIndicator && !messages.some(m => !m.isUser) && (
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
  );
};

export default Conversation;



