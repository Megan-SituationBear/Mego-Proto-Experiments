import { useState, useEffect } from 'react';
import AIInput from '../components/ui/AIInput';
import type { ConversationMessage } from '../components/ui/AIInput';

type WorkspaceType = 'chat' | 'library-item' | 'artifact';

interface WorkspacePageProps {
  workspaceType?: WorkspaceType;
  workspaceId?: string; // e.g., "copado-summary", "deployment-plan", etc.
  workspaceTitle?: string;
  workspaceTopic?: string; // e.g., "Deploy", "Analyze", "Learn"
  initialPrompt?: string;
  onNavigateHome?: () => void;
  onBack?: () => void;
  onSaveWorkspace?: (title: string, workspaceData: any) => void;
}

const WorkspacePage = ({
  workspaceType = 'chat',
  workspaceTitle = 'Workspace',
  workspaceTopic = 'General',
  initialPrompt = '',
  onNavigateHome,
  onBack,
  onSaveWorkspace,
}: WorkspacePageProps) => {
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeRightPanelTab, setActiveRightPanelTab] = useState<'preview' | 'code' | 'summary' | 'outcome'>('preview');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState(workspaceTitle);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);

  // Determine primary action based on workspace type
  const getPrimaryAction = () => {
    switch (workspaceType) {
      case 'library-item':
        return { label: 'Save', icon: '💾' };
      case 'artifact':
        return { label: 'Deploy', icon: '🚀' };
      case 'chat':
      default:
        return { label: 'Share', icon: '↗' };
    }
  };

  const primaryAction = getPrimaryAction();

  const handlePrimaryAction = () => {
    if (workspaceType === 'library-item') {
      setSaveTitle(workspaceTitle);
      setShowSaveModal(true);
    } else {
      console.log(`Primary action: ${primaryAction.label}`);
    }
  };

  const handleSaveWorkspace = () => {
    onSaveWorkspace?.(saveTitle, {
      type: workspaceType,
      title: saveTitle,
      topic: workspaceTopic,
      conversationMessages,
      createdAt: new Date(),
    });
    setShowSaveModal(false);
    // Optionally navigate home after saving
    onNavigateHome?.();
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

          {/* Center: Title with Item Label */}
          <div className="flex-1 flex items-center justify-center mx-8">
            <h1 className="text-xl font-bold text-slate-900">
              <span className="text-slate-500 font-normal">{workspaceTopic}:</span> {workspaceTitle}
            </h1>
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
              onClick={handlePrimaryAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
            >
              {primaryAction.label}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        {/* Split Layout: Conversation (Left) + Tabbed Panel (Right) */}
        <div className="flex-1 flex overflow-hidden work-container">
            {/* Left: Conversation Area */}
            <div 
              className="flex flex-col border-r border-slate-200"
              style={{ width: `${leftPanelWidth}%` }}
            >
              {/* Conversation Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {conversationMessages.length > 0 ? (
                  conversationMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.isUser 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))
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

              {/* AI Input - Inside Conversation Area */}
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <AIInput
                  onSendMessage={handleSendMessage}
                  placeholder="Message about this workspace..."
                  disabled={false}
                  loading={showTyping}
                  autoFocus={false}
                  isLoggedIn={true}
                  pageContext="workspace"
                  defaultMode="ask"
                  availableModes={['ask', 'make']}
                />
              </div>
            </div>

            {/* Resizable Divider */}
            <div
              className={`w-1 bg-slate-200 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors ${
                isResizing ? 'bg-blue-500' : ''
              }`}
              onMouseDown={handleMouseDown}
              style={{ userSelect: 'none' }}
            />

            {/* Right: Tabbed Panel */}
            <div 
              className="flex flex-col bg-slate-50"
              style={{ width: `${100 - leftPanelWidth}%` }}
            >
              {/* Tabs Header */}
              <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 bg-white">
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
                <button 
                  onClick={() => setActiveRightPanelTab('summary')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeRightPanelTab === 'summary' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Summary
                </button>
                <button 
                  onClick={() => setActiveRightPanelTab('outcome')}
                  className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                    activeRightPanelTab === 'outcome' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Outcome
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-auto p-6">
                {activeRightPanelTab === 'preview' && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center h-full flex items-center justify-center">
                    <div>
                      <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Preview</h3>
                      <p className="text-sm text-slate-600">
                        Generated previews will appear here
                      </p>
                    </div>
                  </div>
                )}

                {activeRightPanelTab === 'code' && (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center h-full flex items-center justify-center">
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

                {activeRightPanelTab === 'summary' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Overview of your workspace progress
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                      <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Summary View</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        View a comprehensive summary of your workspace
                      </p>
                      <p className="text-xs text-slate-500">
                        Key metrics, progress, and insights will be displayed here
                      </p>
                    </div>
                  </div>
                )}

                {activeRightPanelTab === 'outcome' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Outcome</h3>
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
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Favorite"
                      >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Download
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
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Favorite"
                      >
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Download
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

      {/* Save/Rename Modal */}
      {showSaveModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSaveModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Save Workspace</h3>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4">
              Give your workspace a name (optional)
            </p>

            {/* Title Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Workspace Name
              </label>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Enter workspace name"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkspace}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;

