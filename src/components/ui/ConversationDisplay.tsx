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
    // Unique identifiers for artifacts and code
    itemId?: string; // Unique ID for downloadable/actionable items
    artifactName?: string;
    artifactType?: 'file' | 'config' | 'deployment' | 'script';
    // Other metadata
    steps?: string[];
    options?: string[];
    language?: string;
    fileName?: string;
    fileSize?: string;
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
  // Artifact and code actions with unique IDs
  onDownloadArtifact?: (itemId: string, artifactName: string, content: string) => void;
  onViewArtifact?: (itemId: string, artifactName: string) => void;
  onDownloadCode?: (itemId: string, fileName: string, content: string) => void;
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
  onDownloadArtifact,
  onViewArtifact,
  onDownloadCode,
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

  // Extract text from MessageContent (unused but kept for potential future use)
  // const getTextContent = (content: MessageContent): string => {
  //   return typeof content === 'string' ? content : content.content;
  // };

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
        const artifactId = content.metadata?.itemId || `artifact-${Date.now()}`;
        const artifactName = content.metadata?.artifactName || 'artifact';
        const artifactType = content.metadata?.artifactType || 'file';
        
        const artifactIcons = {
          file: '📄',
          config: '⚙️',
          deployment: '🚀',
          script: '📜',
        };
        
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-700">
                {artifactIcons[artifactType]} Created {artifactName}
              </span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-mono">
                ID: {artifactId}
              </span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-md">
              <p className="text-sm text-green-900 whitespace-pre-wrap font-medium leading-relaxed">
                {content.content}
              </p>
              {content.metadata?.fileSize && (
                <p className="text-xs text-green-600 mt-2">Size: {content.metadata.fileSize}</p>
              )}
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => onDownloadArtifact?.(artifactId, artifactName, content.content)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button 
                  onClick={() => onViewArtifact?.(artifactId, artifactName)}
                  className="px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg text-xs font-semibold hover:bg-green-50 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
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
        const codeId = content.metadata?.itemId || `code-${Date.now()}`;
        const fileName = content.metadata?.fileName || `script.${content.metadata?.language || 'txt'}`;
        const language = content.metadata?.language || 'code';
        
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-3 rounded-t-xl border-2 border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono font-semibold">
                  💻 {language}
                </span>
                {fileName && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">{fileName}</span>
                  </>
                )}
                <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded font-mono">
                  {codeId}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onDownloadCode?.(codeId, fileName, content.content)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-xs font-medium"
                  title="Download code"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-white">Save</span>
                </button>
                <button
                  onClick={() => handleCopy(message.id, content.content)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-xs font-medium"
                  title="Copy code"
                >
                  {copiedId === message.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-slate-300">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="bg-slate-900 p-5 rounded-b-xl overflow-x-auto border-2 border-t-0 border-slate-700 shadow-lg">
              <code className="text-sm text-slate-200 font-mono leading-relaxed">
                {content.content}
              </code>
            </pre>
          </div>
        );

      case 'blocker':
        const blockerConfig = {
          salesforce: {
            icon: '🔌',
            color: 'orange',
            title: 'Salesforce Connection Required',
          },
          integration: {
            icon: '🔗',
            color: 'yellow',
            title: 'Integration Required',
          },
          authentication: {
            icon: '🔐',
            color: 'red',
            title: 'Authentication Required',
          },
          permission: {
            icon: '⚠️',
            color: 'amber',
            title: 'Permission Required',
          },
        };
        
        const blockerType = content.metadata?.blockerType || 'authentication';
        const config = blockerConfig[blockerType];
        
        return (
          <div className="space-y-3">
            <div className={`bg-gradient-to-r from-${config.color}-100 to-${config.color}-50 border-2 border-${config.color}-400 rounded-xl p-6 shadow-xl animate-pulse`}
              style={{
                backgroundImage: `linear-gradient(to right, rgb(254 215 170), rgb(254 243 199))`,
                borderColor: `rgb(251 146 60)`,
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{config.icon}</div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-orange-900 mb-2">
                    {config.title}
                  </h4>
                  <p className="text-sm text-orange-800 leading-relaxed mb-4 font-medium">
                    {content.content}
                  </p>
                  <button
                    onClick={() => onBlockerAction?.(message.id, blockerType)}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    {content.metadata?.actionLabel || 'Connect Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="text-sm">{content.content}</p>;
    }
  };

  // Variant styling
  const containerStyles = {
    default: 'mt-6 space-y-5 overflow-y-auto px-4 py-5 rounded-2xl bg-slate-50/50 border border-slate-200',
    compact: 'mt-4 space-y-3 overflow-y-auto px-3 py-4 rounded-xl bg-slate-50/50 border border-slate-200',
    floating: 'mt-6 space-y-5 overflow-y-auto px-4 py-5 rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-md',
  };

  const bubbleStyles = {
    default: 'max-w-[85%] px-5 py-3 rounded-2xl transition-all duration-500 ease-out',
    compact: 'max-w-[80%] px-3 py-2 rounded-xl transition-all duration-300',
    floating: 'max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm transition-all duration-500 ease-out',
  };

  return (
    <div className={`w-full ${className}`}>
      {(messages.length > 0 || showTypingIndicator) && (
        <div 
          className={containerStyles[variant]}
          style={{ 
            maxHeight,
            background: variant === 'floating' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(248, 250, 252, 0.5)',
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
              <div className="bg-white border border-blue-200 shadow-md px-5 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-blue-700 font-semibold">Copado is thinking...</span>
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
