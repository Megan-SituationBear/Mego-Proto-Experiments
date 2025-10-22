import { useState } from 'react';
import { AIInput, ConversationDisplay, TemplateCard, TopNav, type ConversationMessage } from '../components/ui';
import FindTemplatesModal from '../components/ui/FindTemplatesModal';
import { generateAIResponse } from '../utils/aiMessageGenerator';

interface HomePageProps {
  userName?: string;
  hasProjects?: boolean;
  favoritedTemplates?: any[];
  activeProjects?: any[];
  recentItems?: any[];
  onCreateProject?: (title?: string) => void;
  onLogout?: () => void;
  onViewTemplate?: (template: any) => void;
}

/**
 * HomePage - Dashboard for logged-in users
 * Manages its own conversation and UI state
 */
const HomePage: React.FC<HomePageProps> = ({
  userName = 'User',
  hasProjects: _hasProjects = false,
  favoritedTemplates = [],
  activeProjects: _activeProjects = [],
  recentItems = [],
  onCreateProject,
  onLogout,
  onViewTemplate,
}) => {
  // UI state
  const [showFindTemplatesModal, setShowFindTemplatesModal] = useState(false);
  const [selectedGoalsForTemplates, setSelectedGoalsForTemplates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites' | 'suggested' | 'work' | 'templates'>(
    recentItems.length > 0 ? 'recent' : 
    favoritedTemplates.length > 0 ? 'favorites' : 
    'suggested'
  );
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Conversation state - managed internally
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [userMessageCount, setUserMessageCount] = useState(0);

  const recommendedTemplates = [
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
  ];

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    if (!text.trim()) return;

    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);

    // Create user conversation message
    const userConversationMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userConversationMessage]);
    
    // Show typing indicator
    if (setTypingIndicator) {
      setTypingIndicator(true);
    }

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(text, newUserMessageCount);
      // Convert complex message format to simple string content
      const aiMessage: ConversationMessage = {
        id: response.conversationMessage.id,
        content: typeof response.conversationMessage.content === 'string' 
          ? response.conversationMessage.content 
          : response.conversationMessage.content.content,
        isUser: false,
        timestamp: response.conversationMessage.timestamp
      };
      setConversationMessages(prev => [...prev, aiMessage]);
      
      // Hide typing indicator
      if (setTypingIndicator) {
        setTypingIndicator(false);
      }

      // After second exchange, create project
      if (newUserMessageCount === 2 && onCreateProject) {
        setTimeout(() => {
          onCreateProject(text);
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-fadeIn">
      {/* Top Navigation Bar */}
      <TopNav
        title=""
        showBackButton={false}
        showLogo={true}
        logoText="+ COPADO AI"
        showHamburger={true}
        onHamburgerClick={() => setShowMenu(!showMenu)}
      />

      {/* Slide-out Drawer Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Drawer Panel */}
          <div 
            className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              showMenu ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Close Button */}
            <div className="flex items-center justify-start p-6">
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Free Plan Banner */}
            <div className="mx-6 mb-6 p-4 bg-cyan-100 rounded text-center">
              <p className="text-sm font-semibold text-slate-800">YOU'RE ON THE FREE PLAN</p>
              <button className="text-sm text-blue-600 font-semibold hover:underline">
                UPGRADE TO USE TEMPLATES
              </button>
            </div>

            {/* Recent */}
            <div className="px-6 py-3">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setActiveTab('work');
                  }}
                  className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  Recent
                </button>
                {recentItems.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    {recentItems.length}
                  </span>
                )}
              </div>
              {recentItems.length > 0 && (
                <div className="ml-2 mt-2 space-y-1">
                  {recentItems.slice(0, 5).map((item, index) => (
                    <button
                      key={item.id || index}
                      onClick={() => {
                        setShowMenu(false);
                        onViewTemplate?.(item);
                      }}
                      className="w-full text-left py-2 px-3 text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors"
                    >
                      {item.isWorkingOn && <span className="text-green-600 mr-1">●</span>}
                      {item.title.substring(0, 35)}{item.title.length > 35 ? '...' : ''}
                    </button>
                  ))}
                  {recentItems.length > 5 && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setActiveTab('work');
                      }}
                      className="w-full text-left py-2 px-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all {recentItems.length} items →
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Favorite */}
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setActiveTab('work');
                  }}
                  className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  Favorite
                </button>
                {favoritedTemplates.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    {favoritedTemplates.length}
                  </span>
                )}
              </div>
            </div>
            
            {/* Templates */}
            <button
              onClick={() => {
                setShowMenu(false);
                setActiveTab('templates');
              }}
              className="w-full text-left px-6 py-3 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Templates
            </button>

            {/* Divider */}
            <div className="border-t border-slate-200 my-4"></div>

            {/* Account Section */}
            <div className="px-6 space-y-1">
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to account
                }}
                className="w-full text-left py-3 text-base text-slate-900 hover:text-blue-600 transition-colors"
              >
                My Account
              </button>
              
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to billing
                }}
                className="w-full text-left py-3 text-base text-slate-900 hover:text-blue-600 transition-colors"
              >
                Billing & Subscriptions
              </button>
              
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to settings
                }}
                className="w-full text-left py-3 text-base text-slate-900 hover:text-blue-600 transition-colors"
              >
                Settings
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-4"></div>

            {/* Logout */}
            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout?.();
                }}
                className="w-full text-left py-3 text-base text-slate-900 hover:text-red-600 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-8">
            Welcome, <span className="text-blue-600">{userName}</span>.
          </h1>
        </div>

        {/* AI Input Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          {/* AI Input Component */}
          <AIInput
            placeholder="What action do you want to start?"
            onSendMessage={(text) => handleSendMessage(text, setShowCopadoTyping)}
            onIntegrationsClick={() => console.log('Integrations clicked')}
            autoFocus={false}
            isLoggedIn={true}
            pageContext="home"
            hasConversation={conversationMessages.length > 0}
          />

          {/* Conversation Display (appears BELOW input) */}
          <ConversationDisplay
            messages={conversationMessages}
            showTypingIndicator={showCopadoTyping}
            variant="default"
            onDownloadArtifact={(itemId, name, content) => {
              console.log('Download artifact:', itemId, name);
              // Create download
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = name;
              a.click();
            }}
            onViewArtifact={(itemId, name) => {
              console.log('View artifact:', itemId, name);
              // Navigate to artifact detail view
            }}
            onDownloadCode={(itemId, fileName, content) => {
              console.log('Download code:', itemId, fileName);
              // Create download
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName;
              a.click();
            }}
            onBlockerAction={(messageId, actionType) => {
              console.log('Blocker action:', messageId, actionType);
              // Handle blocker actions (e.g., open Salesforce connection modal)
            }}
          />

          {/* Show "Creating workspace..." message after second user message */}
          {userMessageCount === 2 && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="font-medium">Creating workspace...</span>
              </div>
            </div>
          )}
        </div>

        {/* Pick up these Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Pick up these
            </h2>
            
            {/* Toggle Button */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'recent'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'favorites'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('suggested')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'suggested'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Suggested Templates
                </button>
              </div>
              
              <button
                onClick={() => setShowFindTemplatesModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Find Templates
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'recent' ? (
              recentItems.length > 0 ? (
                recentItems.map((item, index) => (
                  <TemplateCard
                    key={`recent-${index}`}
                    category={item.category || 'Recent Item'}
                    title={item.title}
                    description={item.description || 'Recently accessed'}
                    remixCount={item.views || 0}
                    favoriteCount={item.favorites || 0}
                    variant="standard"
                    isFavorited={favoritedTemplates.some(t => t.title === item.title)}
                    onClick={() => onViewTemplate?.(item)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">No recent items yet. Start working on templates to see them here!</p>
                </div>
              )
            ) : activeTab === 'favorites' ? (
              favoritedTemplates.length > 0 ? (
                favoritedTemplates.map((template, index) => (
                  <TemplateCard
                    key={`favorite-${index}`}
                    category={template.category}
                    title={template.title}
                    description={template.description}
                    remixCount={template.views || 0}
                    favoriteCount={template.favorites || 0}
                    variant="standard"
                    isFavorited={true}
                    onClick={() => onViewTemplate?.(template)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500">No favorites yet. Star templates to save them here!</p>
                </div>
              )
            ) : (
              // Suggested Templates
              recommendedTemplates.map((template, index) => (
                <TemplateCard
                  key={`suggested-${index}`}
                  category={template.category}
                  title={template.title}
                  description={template.description}
                  remixCount={template.views || 0}
                  favoriteCount={template.favorites || 0}
                  variant="standard"
                  isFavorited={false}
                  onClick={() => onViewTemplate?.(template)}
                />
              ))
            )}
          </div>
        </div>

      </main>

      {/* Find Templates Modal - Logged in users get direct access */}
      <FindTemplatesModal
        isOpen={showFindTemplatesModal}
        onClose={() => {
          setShowFindTemplatesModal(false);
          setSelectedGoalsForTemplates([]);
        }}
        onSelectTemplate={(template) => {
          setShowFindTemplatesModal(false);
          setSelectedGoalsForTemplates([]);
          onViewTemplate?.(template);
        }}
        initialGoals={selectedGoalsForTemplates}
      />
    </div>
  );
};

export default HomePage;
