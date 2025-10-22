/**
 * ConversationDisplay Component - Flexible conversation display with rich message types
 * 
 * Supports both simple string messages and rich content types:
 * - text: Plain text messages
 * - question: AI questions with clickable options
 * - artifact: Created files/outputs
 * - step-by-step: Numbered instructions
 * - code: Code snippets with syntax highlighting
 * 
 * USAGE:
 * 
 * // Simple text messages (backward compatible with AIInput)
 * <ConversationDisplay
 *   messages={[
 *     { id: '1', content: 'Hello!', isUser: true },
 *     { id: '2', content: 'Hi there!', isUser: false }
 *   ]}
 * />
 * 
 * // Rich message types
 * <ConversationDisplay
 *   messages={[
 *     { 
 *       id: '1', 
 *       content: { type: 'question', content: 'What would you like to do?', metadata: { options: ['Option A', 'Option B'] } },
 *       isUser: false 
 *     }
 *   ]}
 *   onQuestionClick={(option) => console.log(option)}
 * />
 */

import React, { useRef, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

// Support both simple string content and rich content types
export type MessageContent = string | {
  type: 'text' | 'question' | 'artifact' | 'step-by-step' | 'code' | 'blocker';
  content: string;
  metadata?: {
    artifactName?: string;
    steps?: string[];
    options?: string[];
    language?: string;
    blockerType?: 'salesforce' | 'integration' | 'authentication' | 'permission';
    actionLabel?: string;
    onAction?: () => void;
  };
};

export interface ConversationMessage {
  id: string;
  content: MessageContent;
  isUser: boolean;
  timestamp?: Date;
}

interface ConversationDisplayProps {
  messages: ConversationMessage[];
  showTypingIndicator?: boolean;
  onQuestionClick?: (question: string) => void;
  onCopyMessage?: (messageId: string, content: string) => void;
  onBlockerAction?: (messageId: string, actionType: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'floating';
  maxHeight?: string;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  showTypingIndicator = false,
  onQuestionClick,
  onCopyMessage,
  onBlockerAction,
  className = '',
  variant = 'default',
  maxHeight = '600px',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle copy to clipboard
  const handleCopy = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    onCopyMessage?.(messageId, content);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extract text from MessageContent
  const getTextContent = (content: MessageContent): string => {
    return typeof content === 'string' ? content : content.content;
  };

  // Render message content based on type
  const renderMessageContent = (message: ConversationMessage) => {
    const content = message.content;

    // Simple string content
    if (typeof content === 'string') {
      return (
        <div className="relative group">
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', lineHeight: '24px' }}>
            {content}
          </p>
          {!message.isUser && onCopyMessage && (
            <button
              onClick={() => handleCopy(message.id, content)}
              className="absolute -right-8 top-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all"
              title="Copy message"
            >
              {copiedId === message.id ? (
                <Check className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
          )}
        </div>
      );
    }

    // Rich content types
    switch (content.type) {
      case 'text':
        return (
          <div className="relative group">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', lineHeight: '24px' }}>
              {content.content}
            </p>
            {!message.isUser && onCopyMessage && (
              <button
                onClick={() => handleCopy(message.id, content.content)}
                className="absolute -right-8 top-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all"
                title="Copy message"
              >
                {copiedId === message.id ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                )}
              </button>
            )}
          </div>
        );

      case 'question':
        return (
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {content.content}
            </p>
            {(content.metadata?.options || content.metadata?.steps) && (
              <div className="flex flex-wrap gap-2">
                {(content.metadata.options || content.metadata.steps)?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onQuestionClick?.(option)}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'artifact':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700">
                ✓ Created {content.metadata?.artifactName || 'artifact'}
              </span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-md">
              <p className="text-sm text-green-900 whitespace-pre-wrap font-medium leading-relaxed">
                {content.content}
              </p>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm">
                  Download
                </button>
                <button className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg text-xs font-semibold hover:bg-green-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        );

      case 'step-by-step':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-bold text-blue-700">
                📋 Step-by-step guide
              </span>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 shadow-md space-y-4">
              {content.metadata?.steps?.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed flex-1 pt-1 font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-t-lg">
              <span className="text-xs text-slate-400 font-mono">
                {content.metadata?.language || 'code'}
              </span>
              <button
                onClick={() => handleCopy(message.id, content.content)}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
                title="Copy code"
              >
                {copiedId === message.id ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
            </div>
            <pre className="bg-slate-900 p-4 rounded-b-lg overflow-x-auto">
              <code className="text-sm text-slate-200 font-mono">
                {content.content}
              </code>
            </pre>
          </div>
        );

      default:
        return <p className="text-sm">{content.content}</p>;
    }
  };

  // Variant styling
  const containerStyles = {
    default: 'mb-4 space-y-3 overflow-y-auto px-3 py-4 rounded-2xl border border-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-500',
    compact: 'mb-3 space-y-2 overflow-y-auto px-2 py-3 rounded-xl border border-slate-200/50',
    floating: 'mb-4 space-y-3 overflow-y-auto px-3 py-4 rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-md',
  };

  const bubbleStyles = {
    default: 'max-w-[75%] px-4 py-2.5 rounded-2xl transition-all duration-500 ease-out',
    compact: 'max-w-[80%] px-3 py-2 rounded-xl transition-all duration-300',
    floating: 'max-w-[75%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-500 ease-out',
  };

  return (
    <div className={`w-full ${className}`}>
      {(messages.length > 0 || showTypingIndicator) && (
        <div 
          className={containerStyles[variant]}
          style={{ 
            maxHeight,
            background: variant === 'floating' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            backdropFilter: variant === 'floating' ? 'blur(10px)' : 'none',
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`${bubbleStyles[variant]} text-left ${
                  msg.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/90 border border-slate-200 text-slate-800 shadow-sm'
                }`}
              >
                {renderMessageContent(msg)}
                {msg.timestamp && (
                  <p className={`text-xs mt-2 ${msg.isUser ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* AI Thinking Indicator */}
          {showTypingIndicator && (
            <div className="flex justify-start">
              <div className="bg-white/90 border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Copado is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;
