import { useState, useEffect, useRef } from 'react';
import AIInput from '../components/ui/AIInput';
import PricingModal from '../components/ui/PricingModal';
import type { ConversationMessage } from '../components/ui/AIInput';
import { meganConversation, copadoCanDoConversation } from '../conversations';

type WorkspaceType = 'chat' | 'library-item' | 'artifact';

interface WorkspacePageProps {
  workspaceType?: WorkspaceType;
  workspaceId?: string; // e.g., "copado-summary", "deployment-plan", etc.
  workspaceTitle?: string;
  workspaceTopic?: string; // e.g., "Deploy", "Analyze", "Learn"
  initialPrompt?: string;
  environment?: string; // Selected environment for Make mode workspaces
  onNavigateHome?: () => void;
  onBack?: () => void;
  onSaveWorkspace?: (title: string, workspaceData: any) => void;
}

const WorkspacePage = ({
  workspaceType: _workspaceType = 'chat',
  workspaceTitle = 'Workspace',
  workspaceTopic = 'General',
  initialPrompt = '',
  environment,
  onNavigateHome,
  onBack,
  onSaveWorkspace: _onSaveWorkspace,
}: WorkspacePageProps) => {
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeRightPanelTab, setActiveRightPanelTab] = useState<'overview' | 'preview' | 'code' | 'artifacts'>('overview');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(75); // percentage - 3/4 of page by default
  const [isResizing, setIsResizing] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<ConversationMessage[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [mobileActiveTab, setMobileActiveTab] = useState<'work' | 'highlights' | 'code' | 'artifacts'>('work');
  
  // Tasks state for "What can Copado do?" workspace
  const [tasks, setTasks] = useState([
    { id: 1, text: "Connect your Salesforce org", completed: false },
    { id: 2, text: "Set up your first project", completed: false },
    { id: 3, text: "Configure deployment pipeline", completed: false },
    { id: 4, text: "Invite your team members", completed: false }
  ]);
  
  // Refs for scrolling to messages
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Determine which tabs to show based on topic
  const topicsWithoutCode = ['Strategy', 'Planning', 'Learn'];
  const showCodeTab = !topicsWithoutCode.includes(workspaceTopic);

  // Determine primary action based on topic
  const getPrimaryAction = () => {
    const topicsWithDownload = ['Learn', 'Strategy', 'Planning'];
    if (topicsWithDownload.includes(workspaceTopic)) {
      return { label: 'Download', icon: '↓' };
    }
    return { label: 'Apply', icon: '✓' };
  };

  const primaryAction = getPrimaryAction();

  const handlePrimaryAction = () => {
    // Show pricing modal for all primary actions
    setShowPricingModal(true);
  };

  // Handle panel resizing
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const container = document.querySelector('.work-container');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain between 30% and 70%
    if (newWidth >= 30 && newWidth <= 70) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add and remove mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Initialize conversation with the initial prompt if provided
  useState(() => {
    if (initialPrompt && conversationMessages.length === 0) {
      // Load conversation from separate file for "What did Megan do?"
      if (workspaceTitle === "What did Megan do?") {
        setConversationMessages(meganConversation.initialMessages);
        return;
      }
      
      // Load conversation for "What can Copado do?"
      if (workspaceTitle === "What can Copado do?") {
        setConversationMessages(copadoCanDoConversation.initialMessages);
        return;
      }
      
      // Default conversation for other prompts
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        content: initialPrompt,
        isUser: true,
        timestamp: new Date()
      };
      
      setConversationMessages([userMessage]);
      setShowTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          content: `I'll help you with "${initialPrompt}". Let me gather the relevant information...`,
          isUser: false,
          timestamp: new Date()
        };
        setConversationMessages(prev => [...prev, aiMessage]);
        setShowTyping(false);
      }, 2000);
    }
  });

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userMessage]);
    setShowTyping(true);

    // Use conversation handler for "What did Megan do?" workspace
    if (workspaceTitle === "What did Megan do?" && meganConversation.handleResponse) {
      setTimeout(() => {
        const response = meganConversation.handleResponse!(text, conversationMessages);
        
        if (response) {
          // Handle single or multiple messages
          const messages = Array.isArray(response) ? response : [response];
          setConversationMessages(prev => [...prev, ...messages]);
        } else {
          // Fallback response if conversation doesn't handle this input
          const aiMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            content: `Here's my response to: "${text}"`,
            isUser: false,
            timestamp: new Date()
          };
          setConversationMessages(prev => [...prev, aiMessage]);
        }
        
        setShowTyping(false);
      }, 1500);
      return;
    }
    
    // Use conversation handler for "What can Copado do?" workspace
    if (workspaceTitle === "What can Copado do?" && copadoCanDoConversation.handleResponse) {
      setTimeout(() => {
        const response = copadoCanDoConversation.handleResponse!(text, conversationMessages);
        
        if (response) {
          // Handle single or multiple messages
          const messages = Array.isArray(response) ? response : [response];
          setConversationMessages(prev => [...prev, ...messages]);
        } else {
          // Fallback response if conversation doesn't handle this input
          const aiMessage: ConversationMessage = {
            id: (Date.now() + 1).toString(),
            content: `Here's my response to: "${text}"`,
            isUser: false,
            timestamp: new Date()
          };
          setConversationMessages(prev => [...prev, aiMessage]);
        }
        
        setShowTyping(false);
      }, 1500);
      return;
    }

    // Default response for other workspaces
    setTimeout(() => {
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        content: `Here's my response to: "${text}"`,
        isUser: false,
        timestamp: new Date()
      };
      setConversationMessages(prev => [...prev, aiMessage]);
      setShowTyping(false);
    }, 1500);
  };

  const handlePinMessage = (message: ConversationMessage) => {
    const isAlreadyPinned = pinnedMessages.some(m => m.id === message.id);
    if (isAlreadyPinned) {
      setPinnedMessages(prev => prev.filter(m => m.id !== message.id));
    } else {
      setPinnedMessages(prev => [...prev, message]);
    }
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      // Switch to work tab on mobile
      setMobileActiveTab('work');
      
      // Scroll to message with smooth behavior, positioned at top
      messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest' 
      });
      
      // Add a brief highlight effect
      messageElement.style.transition = 'background-color 0.3s';
      messageElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      setTimeout(() => {
        messageElement.style.backgroundColor = '';
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Left: Back Button */}
          <button
            onClick={onBack || onNavigateHome || (() => window.history.back())}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            title="Go back"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          {/* Center: Title with Item Label */}
          <div className="flex-1 flex items-center justify-center mx-2 sm:mx-8 overflow-hidden">
            <div className="text-center overflow-hidden">
              <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                <span className="text-slate-500 font-normal hidden sm:inline">{workspaceTopic}:</span>
                <span className="sm:hidden text-slate-500 font-normal">{workspaceTopic.substring(0, 4)}:</span> {workspaceTitle}
              </h1>
              {environment && (
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-xs text-slate-500 hidden sm:inline">Environment:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full border border-green-300 text-xs font-medium text-slate-700">
                    {environment}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Pin + Share + Primary Action */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={isPinned ? 'Unpin' : 'Pin'}
            >
              <svg 
                className={`w-4 h-4 sm:w-5 sm:h-5 ${isPinned ? 'fill-green-500 text-green-500' : 'text-slate-400'}`} 
                fill={isPinned ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <button
              onClick={() => console.log('Share workspace')}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
              title="Share workspace"
            >
              <svg className="w-5 h-5 text-slate-400 hover:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            <button
              onClick={handlePrimaryAction}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <span className="hidden sm:inline">{primaryAction.label}</span>
              <span className="sm:hidden">{primaryAction.icon}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tabs - Only visible on mobile */}
      <div className="lg:hidden bg-white border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          <button
            onClick={() => setMobileActiveTab('work')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              mobileActiveTab === 'work'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setMobileActiveTab('highlights')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              mobileActiveTab === 'highlights'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Highlights
          </button>
          {showCodeTab && (
            <button
              onClick={() => setMobileActiveTab('code')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                mobileActiveTab === 'code'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Code
            </button>
          )}
          <button
            onClick={() => setMobileActiveTab('artifacts')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              mobileActiveTab === 'artifacts'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Artifacts
          </button>
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        {/* Split Layout: Conversation (Left) + Tabbed Panel (Right) - Desktop Only */}
        <div className="flex-1 flex overflow-hidden work-container">
            {/* Left: Conversation Area - Desktop: resizable, Mobile: conditional */}
            <div 
              className={`flex flex-col lg:border-r border-slate-200 ${
                mobileActiveTab !== 'work' ? 'hidden lg:flex' : 'flex'
              }`}
              style={{ width: window.innerWidth >= 1024 ? `${leftPanelWidth}%` : '100%' }}
            >
              {/* Conversation Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                {conversationMessages.length > 0 ? (
                  conversationMessages.map((msg) => {
                    const isPinned = pinnedMessages.some(m => m.id === msg.id);
                    return (
                      <div 
                        key={msg.id}
                        ref={(el) => { messageRefs.current[msg.id] = el; }}
                      >
                        <div 
                          className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} group`}
                          onMouseEnter={() => !msg.isUser && setHoveredMessageId(msg.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          <div className="flex items-start gap-2 max-w-[95%] sm:max-w-[80%]">
                            <div 
                              className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                                msg.isUser 
                                  ? 'bg-slate-100 text-slate-900' 
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {/* Pin Icon - Only show for Copado messages */}
                            {!msg.isUser && (
                              <button
                                onClick={() => handlePinMessage(msg)}
                                className={`p-1.5 rounded-full transition-all ${
                                  hoveredMessageId === msg.id || isPinned
                                    ? 'opacity-100' 
                                    : 'opacity-0'
                                } ${
                                  isPinned 
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                                title={isPinned ? "Unpin message" : "Pin to highlights"}
                              >
                                <svg 
                                  className="w-4 h-4" 
                                  fill={isPinned ? "currentColor" : "none"}
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      {/* Option Pills */}
                      {msg.options && msg.options.length > 0 && (
                        <div className="flex justify-start mt-2">
                          <div className="flex flex-wrap gap-2 max-w-[80%]">
                            {msg.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(option)}
                                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-full hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all duration-200 text-sm font-medium shadow-sm"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-slate-500 text-sm">Start a conversation to begin working</p>
                    </div>
                  </div>
                )}
                
                {/* Typing Indicator */}
                {showTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Input - Locked at Bottom */}
              <div className="border-t border-slate-200 p-3 sm:p-4 bg-white sticky bottom-0">
                <AIInput
                  onSendMessage={handleSendMessage}
                  placeholder="your move ..."
                  disabled={false}
                  loading={showTyping}
                  autoFocus={false}
                  isLoggedIn={true}
                  pageContext="workspace"
                  defaultMode="ask"
                  availableModes={['ask']}
                />
              </div>
            </div>

            {/* Resizable Divider - Desktop Only */}
            <div
              className={`hidden lg:block w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors ${
                isResizing ? 'bg-blue-500' : ''
              }`}
              onMouseDown={handleMouseDown}
              style={{ userSelect: 'none' }}
            />

            {/* Right: Tabbed Panel - Desktop: always visible, Mobile: conditional */}
            <div 
              className={`flex-col bg-slate-50 ${
                mobileActiveTab === 'work' ? 'hidden lg:flex' : 'flex'
              }`}
              style={{ width: window.innerWidth >= 1024 ? `${100 - leftPanelWidth}%` : '100%' }}
            >
              {/* Tabs Header - Desktop Only */}
              <div className="hidden lg:flex items-center gap-1 px-4 py-3 border-b border-slate-200 bg-white">
                <button 
                  onClick={() => setActiveRightPanelTab('overview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeRightPanelTab === 'overview' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Highlights
                </button>
                {!showCodeTab ? (
                  <button 
                    onClick={() => setActiveRightPanelTab('preview')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      activeRightPanelTab === 'preview' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Preview
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveRightPanelTab('code')}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                      activeRightPanelTab === 'code' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Code
                  </button>
                )}
                <button 
                  onClick={() => setActiveRightPanelTab('artifacts')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeRightPanelTab === 'artifacts' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Artifacts
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-4 sm:p-6">
                {(activeRightPanelTab === 'overview' || mobileActiveTab === 'highlights') && (
                  <div className="space-y-4">
                    {/* Key Metrics - Moved to Top */}
                    <div className="grid grid-cols-3 gap-3">
                      {workspaceTitle === "What did Megan do?" ? (
                        <>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">Components</p>
                            <p className="text-xl font-bold text-slate-900">12</p>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">Features</p>
                            <p className="text-xl font-bold text-slate-900">24</p>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">This Week</p>
                            <p className="text-xl font-bold text-slate-900">8</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">Progress</p>
                            <p className="text-xl font-bold text-slate-900">65%</p>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">Items</p>
                            <p className="text-xl font-bold text-slate-900">8</p>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-slate-500 mb-0.5">Time Saved</p>
                            <p className="text-xl font-bold text-slate-900">4h</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Pinned Messages */}
                    {pinnedMessages.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <h4 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Pinned Messages
                        </h4>
                        <div className="space-y-2">
                          {pinnedMessages.map((msg) => (
                            <button
                              key={msg.id}
                              onClick={() => scrollToMessage(msg.id)}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm text-slate-900 group-hover:text-blue-600 line-clamp-2">{msg.content}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlights / Steps / Tasks */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        {workspaceTitle === "What can Copado do?" ? "Key Highlights" : "Key Highlights"}
                      </h4>
                      <div className="space-y-2">
                        {workspaceTitle === "What can Copado do?" ? (
                          <>
                            <div className="space-y-3">
                              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-900 mb-2">Why Copado is different</h5>
                                <ul className="text-xs text-slate-600 space-y-1">
                                  <li>• Lorem ipsum dolor sit amet consectetur adipiscing elit</li>
                                  <li>• Sed do eiusmod tempor incididunt ut labore et dolore magna</li>
                                  <li>• Ut enim ad minim veniam quis nostrud exercitation</li>
                                  <li>• Duis aute irure dolor in reprehenderit in voluptate</li>
                                </ul>
                              </div>
                              
                              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-900 mb-2">Make it work for you</h5>
                                <p className="text-xs text-slate-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                              </div>
                              
                              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-900 mb-2">Keep it dynamic</h5>
                                <p className="text-xs text-slate-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.</p>
                              </div>
                              
                              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <h5 className="text-sm font-semibold text-slate-900 mb-2">Set it up</h5>
                                <div className="space-y-2 mt-3">
                                  {tasks.map((task) => (
                                    <div key={task.id} className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => {
                                          setTasks(tasks.map(t => 
                                            t.id === task.id ? { ...t, completed: !t.completed } : t
                                          ));
                                        }}
                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                      />
                                      <label className={`text-xs ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                        {task.text}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : workspaceTitle === "What did Megan do?" ? (
                          <>
                            <button
                              onClick={() => handleSendMessage("Tell me about Chat Design 1")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Chat Design 1</p>
                                <p className="text-xs text-slate-600 mt-1">Self contained, contextual chat component to embed anywhere</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Tell me about Chat Design 2")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Chat Design 2: Make Mode</p>
                                <p className="text-xs text-slate-600 mt-1">Why?</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Tell me about Chat Design 3")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Chat Design 3: Moving Items</p>
                                <p className="text-xs text-slate-600 mt-1">Moving items to chat does what?</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Tell me about Onboarding")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Onboarding</p>
                                <p className="text-xs text-slate-600 mt-1">Integrations and Salesforce w/in chat, Quick start - tell me about these</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Tell me about Access w/o overbuilding")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Access w/o Overbuilding</p>
                                <p className="text-xs text-slate-600 mt-1">Use Pins for timely recapture, Pin anything - a chat sentence, artifact, instruction</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Tell me about Information Architecture")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Information Architecture</p>
                                <p className="text-xs text-slate-600 mt-1">All work the same - Why do that?</p>
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSendMessage("Tell me about Copado's deployment features")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Deployment Automation</p>
                                <p className="text-xs text-slate-600 mt-1">Learn about automated deployment pipelines</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Explain Copado's testing capabilities")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Quality Testing</p>
                                <p className="text-xs text-slate-600 mt-1">Automated testing and quality gates</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("How does Copado integrate with Salesforce?")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Salesforce Integration</p>
                                <p className="text-xs text-slate-600 mt-1">Native integration with Salesforce orgs</p>
                              </div>
                            </button>
                            <button
                              onClick={() => handleSendMessage("Show me Copado's collaboration features")}
                              className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all text-left group"
                            >
                              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Team Collaboration</p>
                                <p className="text-xs text-slate-600 mt-1">Work together with your team in real-time</p>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(activeRightPanelTab === 'preview') && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 sm:p-12 text-center h-full flex items-center justify-center">
                    <div>
                      <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Preview</h3>
                      <p className="text-sm text-slate-600">
                        Visual preview will appear here
                      </p>
                    </div>
                  </div>
                )}

                {(activeRightPanelTab === 'code' || mobileActiveTab === 'code') && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 sm:p-12 text-center h-full flex items-center justify-center">
                    <div>
                      <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Code</h3>
                      <p className="text-sm text-slate-600">
                        Generated code will appear here
                      </p>
                    </div>
                  </div>
                )}

                {(activeRightPanelTab === 'artifacts' || mobileActiveTab === 'artifacts') && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Artifacts</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Generated artifacts and results from this workspace
                      </p>
                    </div>

                    {/* Artifacts List */}
                    <div className="space-y-4">
                {/* Example Artifact 1 */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        <span className="text-slate-500 font-normal">Artifact:</span> User Story
                      </h3>
                      <p className="text-sm text-slate-600">Created just now</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Share"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowPricingModal(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Artifact Preview */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Title:</span>
                        <p className="text-slate-900 mt-1">As a sales manager, I want to view team performance metrics in real-time</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Acceptance Criteria:</span>
                        <ul className="list-disc list-inside text-slate-900 mt-1 space-y-1">
                          <li>Dashboard displays current quarter metrics</li>
                          <li>Metrics update every 5 minutes</li>
                          <li>Ability to filter by team member</li>
                        </ul>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Priority:</span>
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">High</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example Artifact 2 */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        <span className="text-slate-500 font-normal">Artifact:</span> Apex Class
                      </h3>
                      <p className="text-sm text-slate-600">Created 2 minutes ago</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Share"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setShowPricingModal(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Artifact Preview */}
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-700">PerformanceMetricsController.cls</span>
                        <span className="text-xs text-slate-500">156 lines</span>
                      </div>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
{`public class PerformanceMetricsController {
    @AuraEnabled(cacheable=true)
    public static List<MetricData> getTeamMetrics() {
        // Implementation here
        return metrics;
    }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                      {/* Empty State (can be shown when no artifacts) */}
                      {/* <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                        <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Artifacts Yet</h3>
                        <p className="text-sm text-slate-600 mb-4">
                          Artifacts will appear here as you complete work
                        </p>
                      </div> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        feature="saving workspaces and applying changes"
      />
    </div>
  );
};

export default WorkspacePage;

