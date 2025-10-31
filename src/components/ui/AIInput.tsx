/**
 * AIInput Component - Dynamic State-Based Input Field
 * 
 * This component renders differently based on three key factors:
 * 1. Authentication Status (isLoggedIn: boolean)
 * 2. Page Context (pageContext: 'home' | 'workspace' | 'context')
 * 3. Interaction State (viewState: 'default' | 'focused' | 'focused-with-conversation')
 * 
 * STATE COMBINATIONS:
 * 
 * ┌─────────────┬──────────────┬─────────────┬────────────┬────────────┬─────────┬────────────────┐
 * │ Auth        │ Page         │ View State  │ Height     │ Padding    │ Border  │ Shadow/Ring    │
 * ├─────────────┼──────────────┼─────────────┼────────────┼────────────┼─────────┼────────────────┤
 * │ Logged Out  │ Home         │ Default     │ 48px       │ 12px       │ slate-300│ shadow-2xl     │
 * │ Logged Out  │ Home         │ Focused     │ 120px      │ 20px       │ blue-500│ ring-4 blue-100│
 * │ Logged Out  │ Home         │ Focused+Conv│ 120px      │ 20px       │ blue-500│ ring-4 blue-100│
 * ├─────────────┼──────────────┼─────────────┼────────────┼────────────┼─────────┼────────────────┤
 * │ Logged In   │ Home         │ Default     │ 48px       │ 12px       │ blue-200│ shadow-lg      │
 * │ Logged In   │ Home         │ Focused     │ 100px      │ 16px       │ blue-400│ ring-2 blue-200│
 * │ Logged In   │ Home         │ Focused+Conv│ 140px      │ 24px       │ blue-500│ ring-4 blue-100│
 * ├─────────────┼──────────────┼─────────────┼────────────┼────────────┼─────────┼────────────────┤
 * │ Any         │ Workspace    │ Default     │ 48px       │ 12px       │ slate-300│ shadow-md     │
 * │ Any         │ Workspace    │ Focused     │ 80px       │ 16px       │ blue-400│ ring-2 blue-200│
 * │ Any         │ Workspace    │ Focused+Conv│ 120px      │ 20px       │ blue-400│ ring-2 blue-200│
 * └─────────────┴──────────────┴─────────────┴────────────┴────────────┴─────────┴────────────────┘
 * 
 * USAGE EXAMPLES:
 * 
 * // Logged out user on home page
 * <AIInput isLoggedIn={false} pageContext="home" hasConversation={false} />
 * 
 * // Logged in user on home page with active conversation
 * <AIInput isLoggedIn={true} pageContext="home" hasConversation={true} />
 * 
 * // Any user in workspace/context page
 * <AIInput isLoggedIn={true} pageContext="workspace" hasConversation={messages.length > 0} />
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Settings, Paperclip, MessageSquare, Ticket, Grid, Cloud } from 'lucide-react';

type PageContext = 'home' | 'workspace' | 'context';
type ViewState = 'default' | 'focused' | 'focused-with-conversation';

export interface ConversationMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp?: Date;
}

interface AIInputProps {
  placeholder?: string;
  onSendMessage?: (text: string) => void;
  onUploadImage?: () => void;
  onUploadDoc?: () => void;
  onExamineSlack?: () => void;
  onAddConfluence?: () => void;
  onIntegrationsClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  // New state props
  isLoggedIn?: boolean;
  pageContext?: PageContext;
  hasConversation?: boolean;
  // Conversation props
  messages?: ConversationMessage[];
  showTypingIndicator?: boolean;
  // Salesforce connection state props
  isSalesforceConnected?: boolean;
  connectedSandbox?: string | null; // e.g., "Production", "Dev Sandbox", "QA Sandbox"
  onConnectSalesforce?: () => void;
  onChangeSandbox?: () => void;
}

interface CodeSnippet {
  id: string;
  content: string;
  lineCount: number;
}

interface IntegrationContext {
  id: string;
  type: 'slack' | 'jira' | 'confluence' | 'org';
  name: string;
  url?: string;
}

type IntegrationType = 'slack' | 'jira' | 'confluence' | 'org' | null;

const AIInput: React.FC<AIInputProps> = ({
  placeholder = "Try: @Copado what do you do? Or, @project Let's Go!",
  onSendMessage,
  onIntegrationsClick,
  className = "",
  disabled = false,
  loading = false,
  autoFocus = false,
  isLoggedIn = false,
  pageContext = 'home',
  hasConversation = false,
  messages = [],
  showTypingIndicator = false,
  isSalesforceConnected = false,
  connectedSandbox: _connectedSandbox = null,
  onConnectSalesforce,
  onChangeSandbox,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [activeIntegrationType, setActiveIntegrationType] = useState<IntegrationType>(null);
  const [integrationUrl, setIntegrationUrl] = useState('');
  const [extractedName, setExtractedName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [integrationContexts, setIntegrationContexts] = useState<IntegrationContext[]>([]);
  
  // Simulate which integrations are connected (in real app, this would come from props or context)
  const [connectedIntegrations] = useState({
    slack: true,
    jira: false,
    confluence: true,
    org: false
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect if pasted content is code
  const isCodeSnippet = (text: string): boolean => {
    const lines = text.split('\n');
    const hasMultipleLines = lines.length > 3;
    const hasCodePatterns = /[{}\[\];()=>]|function|const|let|var|class|import|export/.test(text);
    return hasMultipleLines || (hasCodePatterns && text.length > 50);
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    
    if (isCodeSnippet(pastedText)) {
      e.preventDefault();
      const newSnippet: CodeSnippet = {
        id: Date.now().toString(),
        content: pastedText,
        lineCount: pastedText.split('\n').length
      };
      setCodeSnippets(prev => [...prev, newSnippet]);
    }
  };

  // Delete code snippet
  const deleteSnippet = (id: string) => {
    setCodeSnippets(prev => prev.filter(snippet => snippet.id !== id));
  };

  // Extract identifier from URL based on integration type
  const extractIdentifier = (url: string, type: IntegrationType): string => {
    if (!type) return '';
    
    switch (type) {
      case 'slack':
        // Extract from URL like https://workspace.slack.com/archives/C12345678
        const slackMatch = url.match(/\/archives\/([A-Z0-9]+)/);
        if (slackMatch) return `#channel-${slackMatch[1].slice(-4)}`;
        const channelMatch = url.match(/\/messages\/([^\/]+)/);
        if (channelMatch) return `#${channelMatch[1]}`;
        return '#slack-channel';
        
      case 'jira':
        // Extract ticket ID like PROJ-123 or Sprint ID
        const ticketMatch = url.match(/([A-Z]+-\d+)/);
        if (ticketMatch) return ticketMatch[1];
        const sprintMatch = url.match(/sprint[\/=](\d+)/i);
        if (sprintMatch) return `Sprint-${sprintMatch[1]}`;
        // If just an ID was pasted
        if (/^[A-Z]+-\d+$/.test(url.trim())) return url.trim();
        if (/^\d+$/.test(url.trim())) return `Sprint-${url.trim()}`;
        return 'JIRA-001';
        
      case 'confluence':
        // Extract page title or folder name from URL
        const pageMatch = url.match(/\/pages\/\d+\/([^\/\?]+)/);
        if (pageMatch) return decodeURIComponent(pageMatch[1].replace(/\+/g, ' '));
        const spaceMatch = url.match(/\/spaces\/([^\/\?]+)/);
        if (spaceMatch) return `📁 ${decodeURIComponent(spaceMatch[1].replace(/\+/g, ' '))}`;
        return '📄 Confluence Doc';
        
      case 'org':
        return 'Salesforce Org';
        
      default:
        return '';
    }
  };

  // Open integration modal
  const handleOpenIntegrationModal = (type: IntegrationType) => {
    setActiveIntegrationType(type);
    setIntegrationUrl('');
    setExtractedName('');
    setShowConfirmation(false);
    setShowIntegrationModal(true);
    setShowContextMenu(false);
  };

  // Handle URL input and extraction
  const handleIntegrationUrlChange = (url: string) => {
    setIntegrationUrl(url);
    if (url.trim()) {
      const extracted = extractIdentifier(url, activeIntegrationType);
      setExtractedName(extracted);
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
      setExtractedName('');
    }
  };

  // Confirm and add integration to context
  const handleConfirmIntegration = () => {
    if (!activeIntegrationType || !extractedName) return;
    
    const newContext: IntegrationContext = {
      id: Date.now().toString(),
      type: activeIntegrationType,
      name: extractedName,
      url: integrationUrl
    };
    
    setIntegrationContexts(prev => [...prev, newContext]);
    setShowIntegrationModal(false);
    setIntegrationUrl('');
    setExtractedName('');
    setShowConfirmation(false);
    setActiveIntegrationType(null);
  };

  // Delete integration context
  const deleteIntegrationContext = (id: string) => {
    setIntegrationContexts(prev => prev.filter(ctx => ctx.id !== id));
  };

  // Get integration display info
  const getIntegrationInfo = (type: IntegrationType) => {
    const info = {
      slack: { title: 'Add Slack Channel', placeholder: 'Paste Slack channel URL', emoji: '💬' },
      jira: { title: 'Add Jira', placeholder: 'Paste Jira ticket URL or ID (e.g., PROJ-123, Sprint-456)', emoji: '🎫' },
      confluence: { title: 'Add Confluence', placeholder: 'Paste Confluence folder or document URL', emoji: '📚' },
      org: { title: 'Add Salesforce Org', placeholder: '', emoji: '🏢' }
    };
    return type ? info[type] : null;
  };

  // Determine current view state
  const getViewState = (): ViewState => {
    if (isFocused && hasConversation) return 'focused-with-conversation';
    if (isFocused || hasBeenFocused) return 'focused';
    return 'default';
  };

  const viewState = getViewState();

  // Get styling based on state combination
  const getStateStyles = () => {
    // Base styles for all states
    const baseStyles = {
      containerScale: 'scale-100',
      borderColor: 'border-slate-200',
      shadow: 'shadow-xl',
      bgColor: 'bg-white',
      ring: '',
      height: '48px',
      padding: '12px',
    };

    // Logged Out States - Home Page (Landing/Intro)
    if (!isLoggedIn && pageContext === 'home') {
      if (viewState === 'default') {
        // Subtle, inviting default state
        return {
          ...baseStyles,
          shadow: 'shadow-2xl hover:shadow-3xl',
          borderColor: 'border-slate-200',
          bgColor: 'bg-white',
          containerScale: 'scale-100 hover:scale-[1.005]',
          height: '56px',
          padding: '14px',
        };
      }
      if (viewState === 'focused') {
        // Expanded, focused state - no conversation yet
        return {
          ...baseStyles,
          containerScale: 'scale-[1.02]',
          borderColor: 'border-blue-400',
          shadow: 'shadow-2xl',
          ring: 'ring-4 ring-blue-50',
          bgColor: 'bg-white',
          height: '100px',
          padding: '18px',
        };
      }
      if (viewState === 'focused-with-conversation') {
        // Maximum expansion when conversation is active
        return {
          ...baseStyles,
          containerScale: 'scale-[1.03]',
          borderColor: 'border-blue-500',
          shadow: 'shadow-3xl',
          ring: 'ring-6 ring-blue-100/50',
          bgColor: 'bg-white',
          height: '120px',
          padding: '22px',
        };
      }
    }

    // Logged In States
    if (isLoggedIn && pageContext === 'home') {
      if (viewState === 'default') {
        return {
          ...baseStyles,
          shadow: 'shadow-lg',
          borderColor: 'border-blue-200',
        };
      }
      if (viewState === 'focused') {
        return {
          ...baseStyles,
          containerScale: 'scale-[1.01]',
          borderColor: 'border-blue-400',
          shadow: 'shadow-xl',
          ring: 'ring-2 ring-blue-200',
          height: '100px',
          padding: '16px',
        };
      }
      if (viewState === 'focused-with-conversation') {
        return {
          ...baseStyles,
          containerScale: 'scale-[1.02]',
          borderColor: 'border-blue-500',
          shadow: 'shadow-2xl',
          ring: 'ring-4 ring-blue-100',
          height: '140px',
          padding: '24px',
        };
      }
    }

    // Context/Workspace Page States
    if (pageContext === 'context' || pageContext === 'workspace') {
      if (viewState === 'default') {
        return {
          ...baseStyles,
          shadow: 'shadow-md',
          borderColor: 'border-slate-300',
          bgColor: 'bg-white/95',
        };
      }
      if (viewState === 'focused' || viewState === 'focused-with-conversation') {
        return {
          ...baseStyles,
          borderColor: 'border-blue-400',
          shadow: 'shadow-lg',
          ring: 'ring-2 ring-blue-200',
          bgColor: 'bg-white',
          height: viewState === 'focused-with-conversation' ? '120px' : '80px',
          padding: viewState === 'focused-with-conversation' ? '20px' : '16px',
        };
      }
    }

    return baseStyles;
  };

  const stateStyles = getStateStyles();

  // Auto-resize textarea based on state
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && (isFocused || hasBeenFocused)) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300); // Max height of 300px
      const minHeight = parseInt(stateStyles.height);
      textarea.style.height = Math.max(newHeight, minHeight) + 'px';
    }
  }, [value, isFocused, hasBeenFocused, stateStyles.height]);

  // Autofocus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if ((value.trim() || codeSnippets.length > 0) && onSendMessage && !disabled && !loading) {
      // Combine text and code snippets
      let messageContent = value.trim();
      if (codeSnippets.length > 0) {
        const snippetsText = codeSnippets.map((snippet, i) => 
          `\n[Code Snippet ${i + 1}]:\n${snippet.content}`
        ).join('\n');
        messageContent = messageContent ? messageContent + snippetsText : snippetsText;
      }
      
      onSendMessage(messageContent);
      setValue('');
      setCodeSnippets([]);
      setHasBeenFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Keep expanded if there's content
    if (!value.trim()) {
      setHasBeenFocused(false);
    }
  };

  const contextMenuItems = [
    { 
      icon: Paperclip, 
      label: 'Add Images and Docs',
      action: () => {
        setShowUploadModal(true);
        setShowContextMenu(false);
      }
    },
    { 
      icon: MessageSquare, 
      label: 'Connect Slack Channel',
      action: () => handleOpenIntegrationModal('slack')
    },
    { 
      icon: Ticket, 
      label: 'Connect Jira',
      action: () => handleOpenIntegrationModal('jira')
    },
    { 
      icon: Paperclip, 
      label: 'Connect Confluence',
      action: () => handleOpenIntegrationModal('confluence')
    },
    { 
      icon: Grid, 
      label: 'All Integrations',
      action: () => {
        if (onIntegrationsClick) {
          onIntegrationsClick();
        }
        setShowContextMenu(false);
      }
    }
  ];

  // Determine Salesforce connection state
  const isMainInput = pageContext === 'home';
  const isContextInput = pageContext === 'workspace' || pageContext === 'context';

  return (
    <div className={`w-full ${className}`}>
      {/* Conversation Display - Above the input */}
      {(messages.length > 0 || showTypingIndicator) && (
        <div 
          className="mb-4 space-y-3 max-h-[320px] overflow-y-auto px-3 py-4 rounded-2xl border border-slate-200/50 animate-in fade-in slide-in-from-top-2 duration-500" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.3)', 
            backdropFilter: 'blur(10px)' 
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-left ${
                  msg.isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/90 border border-slate-200 text-slate-800 shadow-sm'
                } transition-all duration-500 ease-out`}
              >
                <p className="font-body text-sm leading-relaxed" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', lineHeight: '24px' }}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* AI Thinking Indicator */}
          {showTypingIndicator && (
            <div className="flex justify-start">
              <div className="bg-white/90 border border-slate-200 shadow-sm px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Salesforce Connection States */}
      
      {/* MAIN INPUT - No Salesforce Connection (logged out or logged in) */}
      {isMainInput && !isSalesforceConnected && (
        <div className="mb-4">
          {/* TODO: Design - Main input when no Salesforce connected */}
          {/* State: Main (home) - No Salesforce connection */}
          {/* Applies to: Logged out users AND logged in users without Salesforce */}
          {/* Show: Prompt to connect Salesforce */}
          {/* isLoggedIn: {isLoggedIn ? 'true' : 'false'} */}
        </div>
      )}

      {/* MAIN INPUT - Salesforce Connected (logged in only) */}
      {isMainInput && isSalesforceConnected && (
        <div className="mb-4">
          {/* TODO: Design - Main input when Salesforce connected */}
          {/* State: Main (home) - Salesforce connected */}
          {/* Applies to: Logged in users with Salesforce connection */}
          {/* Show: Connected sandbox name, allow change sandbox */}
          {/* connectedSandbox: {connectedSandbox || 'Not specified'} */}
        </div>
      )}

      {/* CONTEXT INPUT - No Salesforce Connection (logged out or logged in) */}
      {isContextInput && !isSalesforceConnected && (
        <div className="mb-4">
          {/* TODO: Design - Context input when no Salesforce connected */}
          {/* State: Context (workspace/context) - No Salesforce connection */}
          {/* Applies to: Logged out users AND logged in users without Salesforce */}
          {/* Show: Prompt to connect Salesforce (context-aware message) */}
          {/* Keep context-aware setting: "Context For This Work:" */}
          {/* isLoggedIn: {isLoggedIn ? 'true' : 'false'} */}
        </div>
      )}

      {/* CONTEXT INPUT - Salesforce Connected (logged in only) */}
      {isContextInput && isSalesforceConnected && (
        <div className="mb-4">
          {/* TODO: Design - Context input when Salesforce connected */}
          {/* State: Context (workspace/context) - Salesforce connected */}
          {/* Applies to: Logged in users with Salesforce connection */}
          {/* Show: Connected sandbox name, allow change sandbox */}
          {/* Keep context-aware setting: "Context For This Work:" */}
          {/* connectedSandbox: {connectedSandbox || 'Not specified'} */}
        </div>
      )}

      {/* AI Input Field */}
      <div 
        className={`relative ${stateStyles.bgColor} rounded-2xl border-2 transition-all duration-500 transform ${stateStyles.borderColor} ${stateStyles.shadow} ${stateStyles.containerScale} ${stateStyles.ring} hover:shadow-2xl`}
      >
        <div className="flex flex-col">
          {/* Plus and Salesforce Buttons Row */}
          <div className="flex flex-row justify-between items-start px-6 py-6 bg-white border-b border-slate-200 relative">
            {/* Plus Button with Context Menu */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowContextMenu(true)}
                onMouseLeave={() => setShowContextMenu(false)}
                onClick={() => setShowContextMenu(!showContextMenu)}
                className="w-12 h-12 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center"
                title="Add context"
              >
                <Plus className="w-5 h-5 text-slate-600" />
              </button>

              {/* Context Menu Dropdown */}
              {showContextMenu && (
                <div 
                  ref={menuRef}
                  className="absolute left-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl z-50 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={() => setShowContextMenu(true)}
                  onMouseLeave={() => setShowContextMenu(false)}
                >
                  {/* Menu Header */}
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {pageContext === 'workspace' ? 'Context For This Work:' : 'Conversation Context:'}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-0.5">
                    {contextMenuItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={item.action}
                          className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-blue-50 transition-colors text-left group"
                        >
                          <IconComponent className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                          <span className="text-xs text-slate-700 group-hover:text-blue-600 font-medium">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Salesforce Cloud Button */}
            <button
              type="button"
              onClick={() => {
                if (isSalesforceConnected && onChangeSandbox) {
                  onChangeSandbox();
                } else if (onConnectSalesforce) {
                  onConnectSalesforce();
                }
              }}
              className="w-12 h-12 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center"
              title={isSalesforceConnected ? "Change sandbox" : "Connect Salesforce"}
            >
              <Cloud className="w-5 h-5 text-slate-600" />
            </button>

            {/* Settings Button */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="w-12 h-12 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>

          <div className="flex flex-col p-3">
          {/* Textarea that grows */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={`w-full px-4 text-sm bg-transparent outline-none resize-none font-body transition-all duration-500 ${
              value ? 'text-slate-700' : 'text-slate-400'
            } ${isFocused ? 'placeholder-slate-500' : 'placeholder-slate-400'}`}
            style={{
              paddingTop: stateStyles.padding,
              paddingBottom: stateStyles.padding,
              height: stateStyles.height,
              lineHeight: '1.5',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px'
            }}
            rows={1}
          />

          {/* Integration Context Chips */}
          {integrationContexts.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {integrationContexts.map((ctx) => {
                const info = getIntegrationInfo(ctx.type);
                return (
                  <div key={ctx.id} className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                    <span className="text-sm">{info?.emoji}</span>
                    <span className="text-xs font-medium text-blue-700">{ctx.name}</span>
                    <button
                      type="button"
                      onClick={() => deleteIntegrationContext(ctx.id)}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded transition-colors"
                      title="Remove"
                    >
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Code Snippets Display */}
          {codeSnippets.length > 0 && (
            <div className="mt-2 space-y-2">
              {codeSnippets.map((snippet, index) => (
                <div key={snippet.id} className="flex items-start gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span className="text-xs text-slate-400">Code Snippet {index + 1} ({snippet.lineCount} lines)</span>
                    </div>
                    <pre className="text-xs text-slate-200 font-mono overflow-auto max-h-32 whitespace-pre-wrap break-all">
                      {snippet.content}
                    </pre>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteSnippet(snippet.id)}
                    className="flex-shrink-0 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    title="Delete snippet"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons row - below textarea */}
          <div className="flex items-center justify-end mt-3">

            {/* Send button */}
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={(!value.trim() && codeSnippets.length === 0) || disabled || loading}
              className={`p-3.5 rounded-xl transition-all duration-200 ${
                (value.trim() || codeSnippets.length > 0) && !disabled && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          </div>
        </div>

        {/* Character count for long messages */}
        {value.length > 200 && (
          <div className="px-6 pb-2 text-xs text-slate-500 font-body">
            {value.length} characters
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add Images and Documents</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-600 mb-2">Drag and drop files here</p>
                <p className="text-xs text-slate-500">or click to browse</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    console.log('Files uploaded');
                    setShowUploadModal(false);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {pageContext === 'workspace' ? 'Settings For This Work' : 'Settings For Copado'}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    console.log('Settings saved');
                    setShowSettingsModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
              {/* Integrations Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Integrations</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-sm font-medium text-slate-700">Slack</div>
                    <div className="text-xs text-slate-500 mt-1">Connect workspace</div>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-sm font-medium text-slate-700">Confluence</div>
                    <div className="text-xs text-slate-500 mt-1">Link knowledge base</div>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🎫</div>
                    <div className="text-sm font-medium text-slate-700">Jira</div>
                    <div className="text-xs text-slate-500 mt-1">Sync with projects</div>
                  </div>
                  <div className="border-2 border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="text-2xl mb-2">🐙</div>
                    <div className="text-sm font-medium text-slate-700">GitHub</div>
                    <div className="text-xs text-slate-500 mt-1">Access repositories</div>
                  </div>
                </div>
              </div>

              {/* Sandbox Setup Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Set up your sandboxes</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-700">Authenticate and assign permissions</div>
                      <div className="text-xs text-slate-500 mt-1">Connect your Salesforce orgs for seamless deployment</div>
                    </div>
                    <button 
                      onClick={() => console.log('Authenticating sandbox...')}
                      className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Rules Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Team Rules</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-500 italic">Add setup sections here</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Modal (Slack, Jira, Confluence, Org) */}
      {showIntegrationModal && activeIntegrationType && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowIntegrationModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {getIntegrationInfo(activeIntegrationType)?.title}
              </h3>
              <button 
                onClick={() => setShowIntegrationModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Check if integration is connected */}
            {!connectedIntegrations[activeIntegrationType] ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    You need to set up {getIntegrationInfo(activeIntegrationType)?.title.replace('Add ', '')} in Settings first.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowIntegrationModal(false);
                    setShowSettingsModal(true);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Settings
                </button>
              </div>
            ) : activeIntegrationType === 'org' ? (
              /* Org-specific flow: Authenticate and choose sandbox */
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700 mb-3">Connect your Salesforce org:</p>
                  <button className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors mb-3">
                    Authenticate Salesforce
                  </button>
                  
                  {/* Show sandbox selection after auth (simulated) */}
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 mb-2">Choose sandbox:</p>
                    <button className="w-full px-4 py-2 text-sm text-left border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                      Production Org
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-left border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                      Dev Sandbox
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-left border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
                      QA Sandbox
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard flow: Paste URL and confirm */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {getIntegrationInfo(activeIntegrationType)?.placeholder}
                  </label>
                  <input
                    type="text"
                    value={integrationUrl}
                    onChange={(e) => handleIntegrationUrlChange(e.target.value)}
                    placeholder={getIntegrationInfo(activeIntegrationType)?.placeholder}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                
                {/* Confirmation */}
                {showConfirmation && extractedName && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-blue-900 mb-3">
                      Add <strong>{extractedName}</strong> to this conversation?
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setIntegrationUrl('');
                          setExtractedName('');
                          setShowConfirmation(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleConfirmIntegration}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInput;
