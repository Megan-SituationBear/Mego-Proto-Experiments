/**
 * AIInput Component - Dynamic State-Based Input Field
 * 
 * This component renders differently based on three key factors:
 * 1. Authentication Status (isLoggedIn: boolean)
 * 2. Page Context (pageContext: 'home' | 'workspace' | 'context')
 * 3. Interaction State (viewState: 'default' | 'focused')
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
import { createPortal } from 'react-dom';
import { Send, Plus, Settings, Paperclip, MessageSquare, Ticket, Grid, Cloud } from 'lucide-react';
import { TabToggle } from './TabToggle';

type PageContext = 'home' | 'workspace' | 'context';
type ViewState = 'default' | 'focused';

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
  // Navigation
  onNavigateToWorkspace?: (config: {
    type: 'chat' | 'library-item' | 'artifact';
    title: string;
    topic: string;
    initialPrompt: string;
  }) => void;
  // Mode configuration
  defaultMode?: 'ask' | 'make'; // Default mode for this instance
  availableModes?: ('ask' | 'make')[]; // Which modes are available (both by default)
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
  className = "",
  disabled = false,
  loading = false,
  autoFocus = false,
  isLoggedIn = false,
  pageContext = 'home',
  messages = [],
  showTypingIndicator = false,
  isSalesforceConnected = false,
  connectedSandbox: _connectedSandbox = null,
  onNavigateToWorkspace,
  defaultMode = 'ask',
  availableModes = ['ask', 'make'],
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuCloseTimeoutRef = useRef<number | null>(null);
  
  // Mode toggle state - Use defaultMode from props, respect availableModes
  const [inputMode, setInputMode] = useState<'ask' | 'make'>(() => {
    // Check if defaultMode is available
    if (availableModes.includes(defaultMode)) {
      return defaultMode;
    }
    // Fallback to first available mode
    return availableModes[0] || 'ask';
  });

  // When switching to Make mode, automatically expand to focused state
  useEffect(() => {
    if (inputMode === 'make' && pageContext === 'home') {
      setHasBeenFocused(true);
      // Optionally focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [inputMode, pageContext]);

  // Track if "Press enter to submit" tip has been shown (one-time only)
  const [hasShownEnterTip, setHasShownEnterTip] = useState(() => {
    return localStorage.getItem('aiInput-enterTipShown') === 'true';
  });

  // Show tip once and mark as shown
  useEffect(() => {
    if (inputMode === 'ask' && !hasShownEnterTip && isFocused) {
      const timer = setTimeout(() => {
        setHasShownEnterTip(true);
        localStorage.setItem('aiInput-enterTipShown', 'true');
      }, 2000); // Show for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [inputMode, hasShownEnterTip, isFocused]);
  
  // Cleanup menu close timeout on unmount
  useEffect(() => {
    return () => {
      if (menuCloseTimeoutRef.current) {
        clearTimeout(menuCloseTimeoutRef.current);
      }
    };
  }, []);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showAllIntegrationsModal, setShowAllIntegrationsModal] = useState(false);
  const [showSalesforceModal, setShowSalesforceModal] = useState(false);
  const [showManageConnectionModal, setShowManageConnectionModal] = useState(false);
  const [jiraConnected] = useState(false); // Track Jira connection status
  const [salesforceAuthStep, setSalesforceAuthStep] = useState<'login' | 'auth' | 'thinking' | 'sandboxes' | 'connected'>('login');
  const [salesforceConnected, setSalesforceConnected] = useState(false);
  const [selectedSandboxes, setSelectedSandboxes] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['salesforce-expert']); // Default: Salesforce Expert
  const [longTermMemory, setLongTermMemory] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{id: string, name: string, type: 'document' | 'image' | 'code'}>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [modalDragging, setModalDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeIntegrationType, setActiveIntegrationType] = useState<IntegrationType>(null);
  const [integrationUrl, setIntegrationUrl] = useState('');
  const [extractedName, setExtractedName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  // @ts-ignore - unused for now but will be used later
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

  // Delete code snippet (used in UI chips)
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
  // @ts-ignore - unused for now but will be used later
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

  // Determine current view state - Simplified to just default and focused
  const getViewState = (): ViewState => {
    if (isFocused || hasBeenFocused || value.trim()) return 'focused';
    return 'default';
  };

  const viewState = getViewState();
  
  // Determine if placeholder should be centered (default state with no text)
  const isCenteredPlaceholder = viewState === 'default' && !value.trim();

  // Get styling based on state combination and mode
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
      borderRadius: 'rounded-2xl',
      containerPadding: 'p-3',
      gap: 'gap-3',
      borderWidth: 'border', // Default 1px border
      textColor: 'text-slate-900', // Default text color
    };

    // MAKE MODE - Different styling
    if (inputMode === 'make' && pageContext === 'home') {
      if (viewState === 'default') {
        // Default Make mode: Taller, centered
        return {
          ...baseStyles,
          shadow: 'shadow-xl',
          borderColor: 'border-indigo-600',
          bgColor: 'bg-white',
          height: '120px', // Taller default for Make mode
          padding: '20px',
          borderRadius: 'rounded-3xl',
          borderWidth: 'border',
          textColor: 'text-slate-900',
        };
      }
      if (viewState === 'focused') {
        // Focused Make mode: Much taller, darker text, actions on right
        return {
          ...baseStyles,
          borderColor: 'border-indigo-600',
          borderWidth: 'border-2',
          shadow: 'shadow-xl',
          bgColor: 'bg-white',
          height: '200px', // Much taller for focused Make mode
          padding: '24px',
          textColor: 'text-slate-950', // Darker text when focused
        };
      }
    }

    // ASK MODE - Original styling
    if (pageContext === 'home') {
      if (viewState === 'default') {
        // Default Ask mode: Shorter, centered placeholder, light stroke
        return {
          ...baseStyles,
          shadow: 'shadow-xl',
          borderColor: 'border-indigo-600',
          bgColor: 'bg-white',
          height: '56px', // Shorter default state
          padding: '16px',
          borderRadius: 'rounded-3xl',
          containerPadding: 'p-3',
          gap: 'gap-3',
          borderWidth: 'border', // Light 1px border
          textColor: 'text-slate-900',
        };
      }
      if (viewState === 'focused') {
        // Focused Ask mode: Taller, left-aligned
        return {
          ...baseStyles,
          borderColor: 'border-indigo-600',
          borderWidth: 'border-2', // 2px border
          shadow: 'shadow-xl',
          bgColor: 'bg-white',
          height: '100px',
          padding: '20px',
          textColor: 'text-slate-900',
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
          textColor: 'text-slate-900',
        };
      }
      if (viewState === 'focused') {
        return {
          ...baseStyles,
          borderColor: 'border-blue-400',
          shadow: 'shadow-lg',
          ring: 'ring-2 ring-blue-200',
          bgColor: 'bg-white',
          height: '80px',
          padding: '16px',
          textColor: 'text-slate-900',
        };
      }
    }

    return baseStyles;
  };

  const stateStyles = getStateStyles();

  // Force hide scrollbar on mount and updates
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Force hide scrollbar with all methods - use setProperty for better control
      textarea.style.setProperty('overflow', 'clip', 'important');
      textarea.style.setProperty('overflow-y', 'clip', 'important');
      textarea.style.setProperty('overflow-x', 'clip', 'important');
      textarea.style.setProperty('scrollbar-width', 'none', 'important');
      textarea.style.setProperty('-ms-overflow-style', 'none', 'important');
      textarea.style.setProperty('max-height', stateStyles.height, 'important');
    }
  }, [value, isFocused, hasBeenFocused, inputMode, stateStyles.height]);

  // Auto-resize textarea based on state - REMOVED to prevent scrollbar
  // Using fixed heights from stateStyles instead

  // Autofocus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if ((value.trim() || codeSnippets.length > 0) && !disabled && !loading) {
      // Combine text and code snippets
      let messageContent = value.trim();
      if (codeSnippets.length > 0) {
        const snippetsText = codeSnippets.map((snippet, i) => 
          `\n[Code Snippet ${i + 1}]:\n${snippet.content}`
        ).join('\n');
        messageContent = messageContent ? messageContent + snippetsText : snippetsText;
      }
      
      // MAKE MODE: First submission creates a workspace
      if (inputMode === 'make' && pageContext === 'home' && messages.length === 0 && onNavigateToWorkspace) {
        // Generate summary title (first 60 chars or until punctuation)
        const summary = messageContent.split(/[.!?]/)[0].substring(0, 60).trim();
        const workspaceTitle = `Make: ${summary}${messageContent.length > 60 ? '...' : ''}`;
        
        onNavigateToWorkspace({
          type: 'artifact',
          title: workspaceTitle,
          topic: 'Make',
          initialPrompt: messageContent
        });
        
        setValue('');
        setCodeSnippets([]);
        setHasBeenFocused(false);
        return;
      }
      
      // ASK MODE or subsequent messages: Normal conversation flow
      if (onSendMessage) {
        // Prepend mode prefix to message based on selected mode
        const modePrefix = inputMode === 'make' ? '[MAKE] ' : '[ASK] ';
        const prefixedMessage = modePrefix + messageContent;
        
        onSendMessage(prefixedMessage);
        setValue('');
        setCodeSnippets([]);
        setHasBeenFocused(false);
      }
    }
  };
  
  // Update placeholder based on mode
  const modePlaceholder = inputMode === 'make' 
    ? 'Make Mode - Great for long instructions, copy and pasting code - press button to submit'
    : 'How can I help you today?  |  Press \'enter\' to send';
  
  // Use custom placeholder if provided (e.g., "Continue the conversation..."), otherwise use mode-based placeholder
  const effectivePlaceholder = placeholder || modePlaceholder;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // In "ask" mode: Enter submits, Shift+Enter for new line
    // In "make" mode: Enter always creates new line (need to click Send button)
    if (e.key === 'Enter' && !e.shiftKey && inputMode === 'ask') {
      e.preventDefault();
      handleSubmit();
    }
    // In "make" mode, Enter always creates a new line (default behavior)
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Keep expanded if there's content or in Make mode
    if (!value.trim() && inputMode !== 'make') {
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
      action: () => {
        setShowContextMenu(false);
        onNavigateToWorkspace?.({
          type: 'library-item',
          title: 'Connect Jira to Copado',
          topic: 'Integration Setup',
          initialPrompt: `I need help connecting Jira to Copado. Here's the setup guide:

⚙️ **1. Prerequisites**

✅ Admin access to both Jira Cloud and Copado.
✅ A Copado Connected App installed in your Salesforce org.
✅ Your Jira Cloud URL (e.g. https://yourteam.atlassian.net).

🧩 **2. Create a Jira API token**

• Go to https://id.atlassian.com/manage/api-tokens.
• Click Create API token, give it a name like "Copado Integration," and copy it.
• Note your Atlassian email address (the one used to log in).
• You'll use both email + token for authentication from Copado.

🔐 **3. In Copado (Salesforce) – Add Jira connection**

• In Salesforce, open the Copado Setup tab.
• Navigate to Connections → Add New Connection.
• Choose Type = Jira.
• Enter:
  - Jira Base URL: https://yourteam.atlassian.net
  - Username: your Atlassian email
  - Password / Token: the API token you created
• Click Test Connection — it should return Success.
• Save the connection.

**4. Map Jira projects and issue types**

• Go to Copado Setup → Jira Project Mappings.
• Add a new mapping for each Jira project you want to sync.
• Jira Project Key
• Copado Environment or Release Name
• Optionally map issue types, status values, or custom fields if you want two-way updates.

**5. Enable automatic sync**

• In Copado, enable the Jira Integration Job or set up a Copado Job Scheduler.
• Decide whether you want:
  - Push → Jira: Create/update Jira issues from Copado User Stories.
  - Pull ← Jira: Sync Jira stories into Copado for release tracking.
• Verify by creating or updating a test story — Copado should log the transaction in the Integration Logs tab.

🧠 **Tips**

• Use OAuth 2.0 (3-legged) if your org enforces SSO — you'll need an Atlassian developer app registration.
• Limit Copado's Jira user permissions to the relevant projects only.
• You can also run Apex jobs (Copado → Jira Sync) manually if automations are paused.

Can you help me with any questions I have about this setup?`
        });
      }
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
        setShowAllIntegrationsModal(true);
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

      {/* Mode Toggle - Above input, centered - Only show if multiple modes available */}
      {availableModes.length > 1 && (
        <div className="mb-3 flex justify-center items-center gap-3">
          <TabToggle
            tabs={availableModes.map(mode => ({
              id: mode,
              label: mode === 'ask' ? 'Ask' : 'Make'
            }))}
            activeTab={inputMode}
            onTabChange={(id) => {
              const mode = id as 'ask' | 'make';
              if (availableModes.includes(mode)) {
                setInputMode(mode);
              }
            }}
            size="sm"
            variant="default"
          />
        </div>
      )}

      {/* AI Input Field */}
      <div 
        className={`relative ${stateStyles.bgColor} ${stateStyles.borderRadius} ${stateStyles.borderWidth || 'border'} ${isDragging ? 'border-blue-500 bg-blue-50' : stateStyles.borderColor} ${stateStyles.shadow} ${stateStyles.ring}`}
        style={{
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          transform: 'scale(1)', // Lock width at 100% - no scaling
          transformOrigin: 'top center',
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Only set dragging to false if we're leaving the main container
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX;
          const y = e.clientY;
          if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          
          const files = Array.from(e.dataTransfer.files);
          files.forEach((file) => {
            const fileType = file.type;
            let type: 'document' | 'image' | 'code' = 'document';
            
            if (fileType.startsWith('image/')) {
              type = 'image';
            } else if (
              fileType.includes('javascript') ||
              fileType.includes('typescript') ||
              fileType.includes('python') ||
              fileType.includes('java') ||
              file.name.endsWith('.js') ||
              file.name.endsWith('.ts') ||
              file.name.endsWith('.tsx') ||
              file.name.endsWith('.jsx') ||
              file.name.endsWith('.py') ||
              file.name.endsWith('.java') ||
              file.name.endsWith('.cpp') ||
              file.name.endsWith('.c') ||
              file.name.endsWith('.h') ||
              file.name.endsWith('.css') ||
              file.name.endsWith('.html')
            ) {
              type = 'code';
            }
            
            const newFile = {
              id: `file-${Date.now()}-${Math.random()}`,
              name: file.name,
              type: type
            };
            
            setUploadedFiles(prev => [...prev, newFile]);
          });
        }}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50/90 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <svg className="w-12 h-12 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-blue-600 font-medium">Drop files to upload</p>
              <p className="text-blue-500 text-sm mt-1">Images, documents, and code files</p>
            </div>
          </div>
        )}

        <div className={`flex ${inputMode === 'make' && viewState === 'focused' ? 'flex-row' : 'flex-col'} ${stateStyles.containerPadding} ${stateStyles.gap}`}>
          {/* Textarea - always visible and functional */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={effectivePlaceholder}
            disabled={disabled || loading}
            autoFocus={autoFocus}
            className={`${inputMode === 'make' && viewState === 'focused' ? 'flex-1' : 'w-full'} px-6 bg-transparent outline-none resize-none transition-all duration-500 ease-out ${isCenteredPlaceholder ? 'text-center placeholder:text-center' : 'text-left placeholder:text-left'} ${stateStyles.textColor} placeholder-slate-600`}
            style={{
              paddingTop: stateStyles.padding,
              paddingBottom: stateStyles.padding,
              height: stateStyles.height,
              lineHeight: '1.5',
              transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.5s cubic-bezier(0.4, 0, 0.2, 1), text-align 0.3s ease-out',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              minHeight: stateStyles.height,
              maxHeight: stateStyles.height,
              overflow: 'clip',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } as React.CSSProperties}
            rows={1}
          />

          {/* Actions on the right side in Make mode (focused) */}
          {inputMode === 'make' && viewState === 'focused' && (
            <div className="flex flex-col gap-2 items-center justify-start pt-2">
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

              {/* Settings Button */}
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 rounded bg-white border-0 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}

              {/* Salesforce Cloud Button */}
              <button
                type="button"
                onClick={() => {
                  if (salesforceConnected) {
                    setShowManageConnectionModal(true);
                  } else {
                    setShowSalesforceModal(true);
                    setSalesforceAuthStep('login');
                  }
                }}
                className={`p-2 rounded bg-white border-0 transition-colors flex items-center justify-center ${
                  salesforceConnected ? 'text-blue-600 hover:text-blue-700' : 'text-slate-500 hover:text-indigo-600'
                }`}
                title={salesforceConnected ? "Manage Salesforce connection" : "Connect Salesforce"}
              >
                <Cloud className="w-5 h-5" />
              </button>

              {/* Plus Button */}
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={(e) => {
                    if (menuCloseTimeoutRef.current) {
                      clearTimeout(menuCloseTimeoutRef.current);
                      menuCloseTimeoutRef.current = null;
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({ 
                      top: rect.top - 8, 
                      left: rect.left 
                    });
                    setShowContextMenu(true);
                  }}
                  onMouseLeave={() => {
                    menuCloseTimeoutRef.current = setTimeout(() => {
                      setShowContextMenu(false);
                    }, 300);
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({ 
                      top: rect.top - 8, 
                      left: rect.left 
                    });
                    setShowContextMenu(!showContextMenu);
                  }}
                  className="p-2 rounded bg-white border-0 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center"
                  title="Add context"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Context Chips - Show uploaded files, code snippets, and connected sandboxes */}
        {!(inputMode === 'make' && viewState === 'focused') && (uploadedFiles.length > 0 || codeSnippets.length > 0 || (salesforceConnected && selectedSandboxes.length > 0)) && (
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
                {/* Uploaded Files */}
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 text-xs transition-colors group"
                  >
                    <span className="text-slate-700">
                      <span className="font-medium capitalize">{file.type}</span>: {file.name}
                    </span>
                    <button
                      onClick={() => setUploadedFiles(uploadedFiles.filter(f => f.id !== file.id))}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-all"
                      title="Remove"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Pasted Code Snippets */}
                {codeSnippets.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 text-xs transition-colors group"
                  >
                    <span className="text-slate-700">
                      <span className="font-medium">Code</span>: {snippet.lineCount} lines
                    </span>
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-all"
                      title="Remove"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* Connected Salesforce Sandboxes */}
                {salesforceConnected && selectedSandboxes.map((sandboxId) => {
                  const sandbox = [
                    { id: 'prod', name: 'Production' },
                    { id: 'dev', name: 'Dev Sandbox' },
                    { id: 'qa', name: 'QA Sandbox' },
                    { id: 'staging', name: 'Staging Sandbox' },
                    { id: 'uat', name: 'UAT Sandbox' },
                    { id: 'demo', name: 'Demo Sandbox' },
                  ].find(s => s.id === sandboxId);
                  
                  return sandbox ? (
                    <div
                      key={sandboxId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-full border border-blue-200 text-xs transition-colors group"
                    >
                      <span className="text-slate-700">
                        <span className="font-medium">Sandbox</span>: {sandbox.name}
                      </span>
                      <button
                        onClick={() => {
                          const newSandboxes = selectedSandboxes.filter(id => id !== sandboxId);
                          setSelectedSandboxes(newSandboxes);
                          if (newSandboxes.length === 0) {
                            setSalesforceConnected(false);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 transition-all"
                        title="Remove"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
        )}

        {/* Actions Row - Hidden in Make mode focused state */}
        {!(inputMode === 'make' && viewState === 'focused') && (
          <div className="flex flex-row justify-between items-center bg-white relative">
            {/* Action Left: Plus and Settings Buttons */}
            <div className="flex flex-row items-center gap-2 px-2">
              {/* Plus Button with Context Menu */}
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={(e) => {
                    // Clear any pending close timeout
                    if (menuCloseTimeoutRef.current) {
                      clearTimeout(menuCloseTimeoutRef.current);
                      menuCloseTimeoutRef.current = null;
                    }
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({ 
                      top: rect.top - 8, 
                      left: rect.left 
                    });
                    setShowContextMenu(true);
                  }}
                  onMouseLeave={() => {
                    // Delay closing the menu
                    menuCloseTimeoutRef.current = setTimeout(() => {
                      setShowContextMenu(false);
                    }, 300);
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({ 
                      top: rect.top - 8, 
                      left: rect.left 
                    });
                    setShowContextMenu(!showContextMenu);
                  }}
                  className="p-2 rounded bg-white border-0 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center"
                  title="Add context"
                >
                  <Plus className="w-5 h-5" />
                </button>

              {/* Context Menu Dropdown - Always floats above with safe positioning - Rendered via Portal */}
              {showContextMenu && createPortal(
                <div 
                  ref={menuRef}
                  className="fixed w-56 bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl py-1.5 animate-in fade-in duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 2000,
                    bottom: `${Math.max(window.innerHeight - menuPosition.top + 8, 280)}px`,
                    left: `${menuPosition.left}px`,
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                  onMouseEnter={() => {
                    // Clear any pending close timeout when hovering over menu
                    if (menuCloseTimeoutRef.current) {
                      clearTimeout(menuCloseTimeoutRef.current);
                      menuCloseTimeoutRef.current = null;
                    }
                    setShowContextMenu(true);
                  }}
                  onMouseLeave={() => {
                    // Delay closing the menu
                    menuCloseTimeoutRef.current = setTimeout(() => {
                      setShowContextMenu(false);
                    }, 300);
                  }}
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
                  
                  {/* Uploaded Files Section */}
                  {uploadedFiles.length > 0 && (
                    <>
                      <div className="border-t border-slate-100 mt-1 pt-1"></div>
                      <div className="px-3 py-1.5">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Added Context:
                        </p>
                      </div>
                      <div className="py-0.5 max-h-32 overflow-y-auto">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-blue-50 transition-colors"
                          >
                            <span className="text-sm">
                              {file.type === 'document' ? '📄' : file.type === 'image' ? '🖼️' : '💻'}
                            </span>
                            <span className="text-xs text-slate-700 truncate flex-1">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>,
                document.body
              )}
              </div>

              {/* Salesforce Cloud Button */}
              <button
                type="button"
                onClick={() => {
                  if (salesforceConnected) {
                    setShowManageConnectionModal(true);
                  } else {
                    setShowSalesforceModal(true);
                    setSalesforceAuthStep('login');
                  }
                }}
                className={`p-2 rounded bg-white border-0 transition-colors flex items-center justify-center ${
                  salesforceConnected ? 'text-blue-600 hover:text-blue-700' : 'text-slate-500 hover:text-indigo-600'
                }`}
                title={salesforceConnected ? "Manage Salesforce connection" : "Connect Salesforce"}
              >
                <Cloud className="w-5 h-5" />
              </button>

              {/* Settings Button - Square with Icon */}
              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 rounded bg-white border-0 text-slate-500 hover:text-indigo-600 transition-colors flex items-center justify-center"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Send button - More prominent in Make mode */}
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={(!value.trim() && codeSnippets.length === 0) || disabled || loading}
              className={`${inputMode === 'make' ? 'px-6 py-3' : 'p-3.5'} rounded-xl transition-all duration-200 flex items-center gap-2 ${
                (value.trim() || codeSnippets.length > 0) && !disabled && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
              {inputMode === 'make' && (
                <span className="font-medium text-sm">Submit</span>
              )}
            </button>
          </div>
          )}

        {/* Environment Section - Show connected Salesforce sandboxes in Make mode */}
        {inputMode === 'make' && viewState === 'focused' && salesforceConnected && selectedSandboxes.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-3 bg-white">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Environment:</span>
              <div className="flex flex-wrap gap-2">
                {selectedSandboxes.map((sandboxId) => {
                  const sandbox = [
                    { id: 'prod', name: 'Production' },
                    { id: 'dev', name: 'Dev Sandbox' },
                    { id: 'qa', name: 'QA Sandbox' },
                    { id: 'staging', name: 'Staging Sandbox' },
                    { id: 'uat', name: 'UAT Sandbox' },
                    { id: 'demo', name: 'Demo Sandbox' },
                  ].find(s => s.id === sandboxId);
                  
                  return sandbox ? (
                    <div
                      key={sandboxId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full border border-green-300 text-xs"
                    >
                      <span className="text-slate-700 font-medium">
                        Sandbox: {sandbox.name}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Character count for long messages */}
        {value.length > 200 && (
          <div className="px-6 pb-2 text-xs text-slate-500 font-body">
            {value.length} characters
          </div>
        )}
      </div>

      {/* Upload Modal - Rendered via Portal */}
      {showUploadModal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {pageContext === 'workspace' ? 'Add Images and Documents for This Conversation' : 'Add Images and Documents'}
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.h,.css,.html"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles(Array.from(e.target.files));
                  }
                }}
                className="hidden"
              />

              {/* Drag and drop area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalDragging(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setModalDragging(false);
                  
                  const files = Array.from(e.dataTransfer.files);
                  setSelectedFiles(files);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  modalDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-blue-400'
                }`}
              >
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-slate-600 mb-2">Drag and drop files here</p>
                <p className="text-xs text-slate-500">or click to browse</p>
              </div>

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Selected files ({selectedFiles.length}):</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                        <span className="text-slate-700 truncate">{file.name}</span>
                        <button
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                          className="text-slate-400 hover:text-red-600 ml-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Add selected files to uploadedFiles
                    const newFiles = selectedFiles.map(file => {
                      const fileType = file.type;
                      let type: 'document' | 'image' | 'code' = 'document';
                      
                      if (fileType.startsWith('image/')) {
                        type = 'image';
                      } else if (
                        fileType.includes('javascript') ||
                        fileType.includes('typescript') ||
                        fileType.includes('python') ||
                        fileType.includes('java') ||
                        file.name.endsWith('.js') ||
                        file.name.endsWith('.ts') ||
                        file.name.endsWith('.tsx') ||
                        file.name.endsWith('.jsx') ||
                        file.name.endsWith('.py') ||
                        file.name.endsWith('.java') ||
                        file.name.endsWith('.cpp') ||
                        file.name.endsWith('.c') ||
                        file.name.endsWith('.h') ||
                        file.name.endsWith('.css') ||
                        file.name.endsWith('.html')
                      ) {
                        type = 'code';
                      }
                      
                      return {
                        id: `${Date.now()}-${Math.random()}`,
                        name: file.name,
                        type: type
                      };
                    });
                    
                    setUploadedFiles([...uploadedFiles, ...newFiles]);
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  disabled={selectedFiles.length === 0}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Settings Modal - Rendered via Portal */}
      {showSettingsModal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {pageContext === 'workspace' ? 'Settings for This Conversation' : 'Settings for Your Main Chats & Work'}
                  </h3>
                  {pageContext !== 'workspace' && (
                    <p className="text-sm text-slate-500 mt-1">
                      (specific conversations can be customized on that work)
                    </p>
                  )}
                </div>
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
              {/* Long Term Memory Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-slate-700">Long term memory</h4>
                    <p className="text-xs text-slate-500 mt-1">Remember context across conversations</p>
                  </div>
                  <button
                    onClick={() => setLongTermMemory(!longTermMemory)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      longTermMemory ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        longTermMemory ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Conversation Context Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">
                  {pageContext === 'workspace' ? 'Context for This Conversation' : 'Conversation Context'}
                </h4>
                {uploadedFiles.length === 0 ? (
                  <div className="bg-slate-50 rounded-lg p-6 text-center text-sm text-slate-500">
                    No documents, images, or code uploaded yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {file.type === 'document' ? '📄' : file.type === 'image' ? '🖼️' : '💻'}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{file.name}</div>
                            <div className="text-xs text-slate-500 capitalize">{file.type}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter(f => f.id !== file.id))}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Agents Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Agents</h4>
                <p className="text-xs text-slate-500 mb-4">Select the agents that will assist you</p>
                <div className="space-y-3">
                  {[
                    { id: 'salesforce-expert', name: 'Salesforce Expert', description: 'Deep Salesforce knowledge' },
                    { id: 'support-ninja', name: 'Support Ninja', description: 'Customer support specialist' },
                    { id: 'strategy-boss', name: 'Strategy & Plan Boss', description: 'Strategic planning expert' },
                    { id: 'maker-madman', name: 'Maker Madman', description: 'Building & creation expert' },
                  ].map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        if (selectedAgents.includes(agent.id)) {
                          setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                        } else {
                          setSelectedAgents([...selectedAgents, agent.id]);
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAgents.includes(agent.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Space reserved for personality icon */}
                          <div className="h-8 mb-2">
                            {/* Icon will go here */}
                          </div>
                          <div className="font-semibold text-slate-900">{agent.name}</div>
                          <div className="text-sm text-slate-600">{agent.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-4 ${
                          selectedAgents.includes(agent.id)
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300'
                        }`}>
                          {selectedAgents.includes(agent.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Actions</h4>
                <div className="bg-slate-50 rounded-lg p-6 text-center text-sm text-slate-500">
                  No actions configured yet
                </div>
              </div>

              {/* Scheduled Jobs Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Scheduled Jobs</h4>
                <div className="bg-slate-50 rounded-lg p-6 text-center text-sm text-slate-500">
                  No scheduled jobs configured yet
                </div>
              </div>

              {/* Integrations Section */}
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Integrations</h4>
                <p className="text-xs text-slate-500 mb-4">Integrations allow agents to further help you in all of their answers with work context</p>
                
                {/* Show connected integrations */}
                <div className="space-y-2 mb-4">
                  {salesforceConnected && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.548 21.115c-1.068-0.379-2.011-1.021-2.757-1.891-0.745-0.87-1.304-1.966-1.627-3.204-0.323-1.238-0.397-2.574-0.205-3.897 0.192-1.323 0.675-2.594 1.42-3.706 0.745-1.112 1.743-2.041 2.908-2.703 1.165-0.662 2.476-1.046 3.82-1.118 1.344-0.072 2.694 0.163 3.938 0.685 1.244 0.522 2.353 1.315 3.234 2.309 0.881 0.994 1.513 2.166 1.844 3.421 0.331 1.255 0.353 2.562 0.063 3.815-0.29 1.253-0.881 2.425-1.722 3.415-0.841 0.99-1.908 1.778-3.113 2.297-1.205 0.519-2.522 0.756-3.839 0.691-1.317-0.065-2.608-0.418-3.764-1.028z"/>
                      </svg>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">Salesforce</div>
                        <div className="text-xs text-slate-600">{selectedSandboxes.length} sandbox{selectedSandboxes.length !== 1 ? 'es' : ''} connected</div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Connected</span>
                    </div>
                  )}
                  
                  {!salesforceConnected && (
                    <div className="bg-slate-50 rounded-lg p-4 text-center text-sm text-slate-500">
                      No integrations connected yet
                    </div>
                  )}
                </div>

                {/* Manage integrations link */}
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    setShowAllIntegrationsModal(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Manage integrations
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Integration Modal (Slack, Jira, Confluence, Org) - Rendered via Portal */}
      {showIntegrationModal && activeIntegrationType && createPortal(
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
                    You need to set up {getIntegrationInfo(activeIntegrationType)?.title.replace('Add ', '')} in Integrations first.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowIntegrationModal(false);
                    setShowAllIntegrationsModal(true);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Integrations
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
        </div>,
        document.body
      )}

      {/* Salesforce Auth Modal */}
      {showSalesforceModal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowSalesforceModal(false);
            setSalesforceAuthStep('login');
            setSelectedSandboxes([]);
          }}
        >
          <div 
            className={`rounded-2xl shadow-2xl w-full animate-in fade-in zoom-in-95 duration-200 relative ${
              salesforceAuthStep === 'login' 
                ? 'max-w-md bg-[#F4F6F9]' 
                : salesforceAuthStep === 'auth'
                ? 'max-w-md bg-[#F4F6F9]'
                : salesforceAuthStep === 'thinking'
                ? 'max-w-md bg-white p-8'
                : 'max-w-lg p-8 bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Always visible */}
            <button
              onClick={() => {
                setShowSalesforceModal(false);
                setSalesforceAuthStep('login');
                setSelectedSandboxes([]);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors z-10"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Login Screen */}
            {salesforceAuthStep === 'login' && (
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Connect to Salesforce</h3>
                  <p className="text-sm text-slate-600">
                    Connect your Salesforce org to enable seamless collaboration and deployment
                  </p>
                </div>

                {/* White card with login form - just like real Salesforce */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                  <div className="space-y-6">
                    {/* Username */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-slate-600">Username</label>
                        <span className="text-xs text-slate-500">1 Saved Username</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-3 border-2 border-blue-400 rounded focus:outline-none focus:border-blue-500 text-slate-900"
                          placeholder=""
                          defaultValue=""
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-slate-300 rounded focus:outline-none focus:border-blue-500 text-slate-900"
                          placeholder=""
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Log In Button */}
                    <button
                      onClick={() => setSalesforceAuthStep('auth')}
                      className="w-full py-3 bg-[#0176D3] hover:bg-[#014f92] text-white font-medium rounded transition-colors"
                    >
                      Log In
                    </button>

                    {/* Remember me */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 border-2 border-slate-300 rounded"
                      />
                      <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
                    </div>

                    {/* Links */}
                    <div className="flex justify-between items-center pt-2 text-sm">
                      <button className="text-[#0176D3] hover:underline">Forgot Your Password?</button>
                      <button className="text-[#0176D3] hover:underline">Use Custom Domain</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auth Screen - Salesforce OAuth style */}
            {salesforceAuthStep === 'auth' && (
              <div className="p-8">
                {/* Salesforce Logo */}
                <div className="text-center mb-6">
                  <div className="inline-block bg-[#00A1E0] rounded-lg p-3 mb-4">
                    <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M56 25c0-6.9-5.6-12.5-12.5-12.5-2.8 0-5.3.9-7.4 2.4-1.1-3.3-4.2-5.7-7.9-5.7-4.6 0-8.3 3.7-8.3 8.3 0 .5 0 1 .1 1.5-2 .8-3.4 2.8-3.4 5.1 0 3.1 2.5 5.6 5.6 5.6h30c4.1 0 7.5-3.4 7.5-7.5z" fill="white"/>
                      <path d="M70 31c0-5.2-4.2-9.4-9.4-9.4-2.1 0-4 .7-5.5 1.8-.9-2.6-3.3-4.5-6.2-4.5-3.6 0-6.5 2.9-6.5 6.5 0 .4 0 .8.1 1.1-1.5.8-2.5 2.4-2.5 4.2 0 2.6 2.1 4.8 4.8 4.8h22.5c3.1 0 5.6-2.5 5.6-5.6z" fill="white"/>
                      <path d="M84 28c0-3.5-2.8-6.3-6.3-6.3-1.4 0-2.7.4-3.7 1.2-.7-2-2.6-3.5-4.8-3.5-2.7 0-4.9 2.2-4.9 4.9 0 .3 0 .5.1.8-1 .5-1.7 1.6-1.7 2.8 0 1.8 1.4 3.2 3.2 3.2h15c2.1 0 3.8-1.7 3.8-3.8z" fill="white"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Allow Access?</h3>
                </div>

                {/* White card with permissions */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Copado is asking to:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Access and manage your data</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Provide access to your data via the Web</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Perform requests on your behalf at any time</span>
                    </li>
                  </ul>
                  <p className="text-sm text-slate-700 font-medium">
                    Do you want to allow access for Copado AI?
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setSalesforceAuthStep('login')}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 font-medium transition-colors text-sm"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => {
                      setSalesforceAuthStep('thinking');
                      setTimeout(() => setSalesforceAuthStep('sandboxes'), 2000);
                    }}
                    className="flex-1 px-4 py-2.5 bg-[#0176D3] text-white rounded hover:bg-[#014f92] font-medium transition-colors text-sm"
                  >
                    Allow
                  </button>
                </div>

                {/* Footer text */}
                <p className="text-xs text-slate-500 text-center">
                  To revoke access at any time, go to your personal settings.
                </p>
              </div>
            )}

            {/* Thinking Screen */}
            {salesforceAuthStep === 'thinking' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Cloud className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Locating your sandboxes...</h3>
                <p className="text-sm text-slate-600">This will just take a moment</p>
              </div>
            )}

            {/* Sandbox Selection Screen */}
            {salesforceAuthStep === 'sandboxes' && (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Select Sandboxes</h3>
                  <p className="text-sm text-slate-600">
                    It's advised to select all sandboxes you'd want to work on
                  </p>
                </div>

                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {[
                    { id: 'prod', name: 'Production', type: 'Production' },
                    { id: 'dev', name: 'Dev Sandbox', type: 'Developer' },
                    { id: 'qa', name: 'QA Sandbox', type: 'Developer Pro' },
                    { id: 'staging', name: 'Staging Sandbox', type: 'Partial Copy' },
                    { id: 'uat', name: 'UAT Sandbox', type: 'Full Copy' },
                    { id: 'demo', name: 'Demo Sandbox', type: 'Developer' },
                  ].map((sandbox) => (
                    <button
                      key={sandbox.id}
                      onClick={() => {
                        setSelectedSandboxes(prev => 
                          prev.includes(sandbox.id) 
                            ? prev.filter(id => id !== sandbox.id)
                            : [...prev, sandbox.id]
                        );
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedSandboxes.includes(sandbox.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">{sandbox.name}</div>
                          <div className="text-sm text-slate-600">{sandbox.type}</div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedSandboxes.includes(sandbox.id)
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300'
                        }`}>
                          {selectedSandboxes.includes(sandbox.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSalesforceAuthStep('auth')}
                    className="flex-1 px-4 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setSalesforceAuthStep('connected');
                      setSalesforceConnected(true);
                    }}
                    disabled={selectedSandboxes.length === 0}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect ({selectedSandboxes.length})
                  </button>
                </div>
              </>
            )}

            {/* Connected Screen */}
            {salesforceAuthStep === 'connected' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Connected!</h3>
                  <p className="text-sm text-slate-600">
                    You've successfully connected {selectedSandboxes.length} sandbox{selectedSandboxes.length !== 1 ? 'es' : ''}
                  </p>
                </div>

                <button
                  onClick={() => setShowSalesforceModal(false)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Manage Connection Modal */}
      {showManageConnectionModal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowManageConnectionModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowManageConnectionModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 text-center mb-2">Salesforce Connection</h3>
              <p className="text-sm text-slate-600 text-center">
                Manage your connected Salesforce environments
              </p>
            </div>

            {/* Connected Sandboxes */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Connected Environments</h4>
              <div className="space-y-2">
                {[
                  { id: 'prod', name: 'Production', type: 'Production' },
                  { id: 'dev', name: 'Dev Sandbox', type: 'Developer' },
                  { id: 'qa', name: 'QA Sandbox', type: 'Developer Pro' },
                  { id: 'staging', name: 'Staging Sandbox', type: 'Partial Copy' },
                  { id: 'uat', name: 'UAT Sandbox', type: 'Full Copy' },
                  { id: 'demo', name: 'Demo Sandbox', type: 'Developer' },
                ].filter(sandbox => selectedSandboxes.includes(sandbox.id)).map((sandbox) => (
                  <div
                    key={sandbox.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{sandbox.name}</div>
                      <div className="text-xs text-slate-600">{sandbox.type}</div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Connected"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disconnect Button */}
            <button
              onClick={() => {
                setSalesforceConnected(false);
                setSelectedSandboxes([]);
                setShowManageConnectionModal(false);
              }}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Disconnect All
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* All Integrations Modal - Rendered via Portal */}
      {showAllIntegrationsModal && createPortal(
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAllIntegrationsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">All Integrations</h3>
                <p className="text-sm text-slate-500 mt-1">Connect your tools and services</p>
              </div>
              <button 
                onClick={() => setShowAllIntegrationsModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6">
              {/* Left Column: Integrations */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                {/* Salesforce */}
                <button
                  onClick={() => {
                    setShowAllIntegrationsModal(false);
                    if (salesforceConnected) {
                      setShowManageConnectionModal(true);
                    } else {
                      setShowSalesforceModal(true);
                      setSalesforceAuthStep('login');
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    salesforceConnected
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Cloud className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-slate-900">Salesforce</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Connect your Salesforce org and sandboxes</p>
                  {salesforceConnected ? (
                    <span className="text-xs text-green-600 font-medium">✓ Connected</span>
                  ) : (
                    <span className="text-xs text-slate-500">Not connected</span>
                  )}
                </button>

                {/* Slack */}
                <button
                  onClick={() => {
                    setShowAllIntegrationsModal(false);
                    handleOpenIntegrationModal('slack');
                  }}
                  className="p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <span className="font-semibold text-slate-900">Slack</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Connect Slack channels for context</p>
                  <span className="text-xs text-slate-500">Not connected</span>
                </button>

                {/* Jira */}
                <button
                  onClick={() => {
                    setShowAllIntegrationsModal(false);
                    onNavigateToWorkspace?.({
                      type: 'library-item',
                      title: 'Connect Jira to Copado',
                      topic: 'Integration Setup',
                      initialPrompt: `I need help connecting Jira to Copado. Here's the setup guide:

⚙️ **1. Prerequisites**

✅ Admin access to both Jira Cloud and Copado.
✅ A Copado Connected App installed in your Salesforce org.
✅ Your Jira Cloud URL (e.g. https://yourteam.atlassian.net).

🧩 **2. Create a Jira API token**

• Go to https://id.atlassian.com/manage/api-tokens.
• Click Create API token, give it a name like "Copado Integration," and copy it.
• Note your Atlassian email address (the one used to log in).
• You'll use both email + token for authentication from Copado.

🔐 **3. In Copado (Salesforce) – Add Jira connection**

• In Salesforce, open the Copado Setup tab.
• Navigate to Connections → Add New Connection.
• Choose Type = Jira.
• Enter:
  - Jira Base URL: https://yourteam.atlassian.net
  - Username: your Atlassian email
  - Password / Token: the API token you created
• Click Test Connection — it should return Success.
• Save the connection.

**4. Map Jira projects and issue types**

• Go to Copado Setup → Jira Project Mappings.
• Add a new mapping for each Jira project you want to sync.
• Jira Project Key
• Copado Environment or Release Name
• Optionally map issue types, status values, or custom fields if you want two-way updates.

**5. Enable automatic sync**

• In Copado, enable the Jira Integration Job or set up a Copado Job Scheduler.
• Decide whether you want:
  - Push → Jira: Create/update Jira issues from Copado User Stories.
  - Pull ← Jira: Sync Jira stories into Copado for release tracking.
• Verify by creating or updating a test story — Copado should log the transaction in the Integration Logs tab.

🧠 **Tips**

• Use OAuth 2.0 (3-legged) if your org enforces SSO — you'll need an Atlassian developer app registration.
• Limit Copado's Jira user permissions to the relevant projects only.
• You can also run Apex jobs (Copado → Jira Sync) manually if automations are paused.

Can you help me with any questions I have about this setup?`
                    });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    jiraConnected
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Ticket className="w-6 h-6 text-blue-500" />
                    <span className="font-semibold text-slate-900">Jira</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Connect Jira tickets and projects</p>
                  {jiraConnected ? (
                    <span className="text-xs text-green-600 font-medium">✓ Connected</span>
                  ) : (
                    <span className="text-xs text-slate-500">Not connected</span>
                  )}
                </button>

                {/* Confluence */}
                <button
                  onClick={() => {
                    setShowAllIntegrationsModal(false);
                    handleOpenIntegrationModal('confluence');
                  }}
                  className="p-4 rounded-lg border-2 border-slate-200 bg-white hover:border-slate-300 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Paperclip className="w-6 h-6 text-indigo-600" />
                    <span className="font-semibold text-slate-900">Confluence</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Connect Confluence documentation</p>
                  <span className="text-xs text-slate-500">Not connected</span>
                </button>
                </div>
              </div>

              {/* Right Column: API Key Section */}
              <div className="w-80 border-l border-slate-200 pl-6">
                <h4 className="text-base font-semibold text-slate-700 mb-3">Create API Key</h4>
                <p className="text-xs text-slate-500 mb-4">Generate an API key to integrate with external services</p>
              
              <div className="space-y-3">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Production API Key"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                </div>

                {/* Value Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter API key value"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-mono"
                  />
                </div>

                {/* Create Button */}
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                >
                  Create API Key
                </button>
              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowAllIntegrationsModal(false)}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AIInput;
