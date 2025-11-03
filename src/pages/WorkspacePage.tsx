import { useState } from 'react';
import TopNav from '../components/ui/TopNav';
import AIInput from '../components/ui/AIInput';
import type { ConversationMessage } from '../components/ui/AIInput';

type WorkspaceType = 'chat' | 'library-item' | 'artifact';

interface WorkspacePageProps {
  workspaceType?: WorkspaceType;
  workspaceId?: string; // e.g., "copado-summary", "deployment-plan", etc.
  workspaceTitle?: string;
  workspaceTopic?: string; // e.g., "Deploy", "Analyze", "Learn"
  initialPrompt?: string;
  userName?: string;
  onNavigateHome?: () => void;
  onBack?: () => void;
}

const WorkspacePage = ({
  workspaceType = 'chat',
  workspaceTitle = 'Workspace',
  workspaceTopic = 'General',
  initialPrompt = '',
  userName = 'You',
  onNavigateHome,
  onBack,
}: WorkspacePageProps) => {
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Determine primary action based on workspace type
  const getPrimaryAction = () => {
    switch (workspaceType) {
      case 'library-item':
        return { label: 'Remix', icon: '✨' };
      case 'artifact':
        return { label: 'Deploy', icon: '🚀' };
      case 'chat':
      default:
        return { label: 'Share', icon: '↗' };
    }
  };

  const primaryAction = getPrimaryAction();

  // Initialize conversation with the initial prompt if provided
  useState(() => {
    if (initialPrompt && conversationMessages.length === 0) {
      // Add user's initial message
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

    // Simulate AI response
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <TopNav
        showLogo={true}
        logoText="+ COPADO AI"
        onLogoClick={onNavigateHome || (() => {
          const url = window.location.pathname.includes('copado-home-page') 
            ? '/Mego-Proto-Experiments/copado-home-page.html?view=home'
            : '/Mego-Proto-Experiments/app.html?view=home';
          window.location.href = url;
        })}
        onAvatarClick={() => setShowMenu(!showMenu)}
        userName={userName}
        isLoggedIn={true}
        connectedIntegrations={{
          salesforce: true,
          slack: false,
          jira: false,
          github: false,
        }}
        salesforceOrg={{
          name: 'Acme Corp',
          sandbox: 'dev-sandbox-01',
        }}
      />

      {/* Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Left: Back Button */}
          <button
            onClick={onBack || onNavigateHome || (() => window.history.back())}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Go back"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          {/* Center: Topic Badge + Title */}
          <div className="flex-1 flex flex-col items-center justify-center mx-8">
            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full mb-2">
              {workspaceTopic}
            </span>
            <h1 className="text-xl font-bold text-slate-900">{workspaceTitle}</h1>
          </div>

          {/* Right: Favorite + Primary Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg 
                className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`} 
                fill={isFavorite ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            <button
              onClick={() => console.log(`Primary action: ${primaryAction.label}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              {primaryAction.label}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat */}
        <div className="w-96 border-r border-slate-200 bg-white flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-6">
            {conversationMessages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">Start a conversation</p>
              </div>
            )}

            {conversationMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {showTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200">
            <AIInput
              onSendMessage={handleSendMessage}
              placeholder="Message about this workspace..."
              disabled={false}
              loading={showTyping}
              autoFocus={false}
              isLoggedIn={true}
              pageContext="workspace"
              hasConversation={conversationMessages.length > 0}
              messages={conversationMessages}
              showTypingIndicator={showTyping}
            />
          </div>
        </div>

        {/* Right Side - Work Area */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto p-8">
            {/* Work Area Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{workspaceTitle}</h1>
              <p className="text-slate-600">
                Workspace for {workspaceType.split('-').join(' ')}
              </p>
            </div>

            {/* Placeholder for workspace content */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Work Area</h3>
              <p className="text-sm text-slate-600 mb-4">
                This is where workspace content will appear
              </p>
              <p className="text-xs text-slate-500">
                Documents, code, deployments, and other artifacts will be displayed here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Menu (if needed) */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Menu</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Menu content can be added here */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspacePage;

