import { useState, useRef, useEffect } from 'react';
import { AIInput, TemplateCard, TopNav, TabToggle } from '../components/ui';
import FindTemplatesModal from '../components/ui/FindTemplatesModal';
import Conversation, { type ConversationMessage } from '../components/Conversation';
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
  onNavigateToDashboard?: () => void;
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
  onNavigateToDashboard,
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
      category: "Deploy",
      categoryColor: "slate" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Automate pre-deployment checks and fixes to catch issues before they reach production. Saves an average of 35 hours per deployment cycle.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Test",
      categoryColor: "green" as const,
      savedHours: 28,
      title: "Automated Test Coverage Analysis",
      description: "Identify gaps in test coverage and generate automated test scripts for your Salesforce org. Ensures 95%+ coverage before deployment.",
      favorites: 892,
      views: 89
    },
    {
      category: "Org Magic",
      categoryColor: "purple" as const,
      savedHours: 42,
      title: "Permission Set Audit & Remediation",
      description: "Review and fix permission set misconfigurations automatically. Reduces security risks while maintaining user access requirements.",
      favorites: 567,
      views: 203
    },
    {
      category: "Build",
      categoryColor: "amber" as const,
      savedHours: 51,
      title: "Data Cleanup & Validation Workflow",
      description: "Automate data quality checks and cleanup processes. Identifies duplicates, missing fields, and validation errors across your org.",
      favorites: 1089,
      views: 312
    },
    {
      category: "Plan",
      categoryColor: "slate" as const,
      savedHours: 19,
      title: "API Integration Health Monitor",
      description: "Track and optimize API usage across your Salesforce org. Prevents limit exceptions and identifies optimization opportunities.",
      favorites: 723,
      views: 145
    },
    {
      category: "Org Magic",
      categoryColor: "indigo" as const,
      savedHours: 63,
      title: "Query Optimization & Indexing",
      description: "Analyze and optimize slow queries in your org. Automatically suggests indexes and query improvements to boost performance.",
      favorites: 1445,
      views: 278
    },
  ];

  // Auto-scroll to bottom of conversation
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on page load/refresh
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Helper function to clean AIInput messages (handles mode prefixes automatically)
  const cleanAIInputMessage = (text: string): string => {
    // Remove mode prefixes like [ASK] or [MAKE] that AIInput adds
    return text.replace(/^\[(ASK|MAKE)\]\s*/i, '').trim();
  };

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void) => {
    // Clean the message from AIInput (removes mode prefixes)
    const cleanText = cleanAIInputMessage(text);
    if (!cleanText) return;

    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);

    // Create user conversation message with proper format
    const userConversationMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: {
        type: 'text',
        content: cleanText
      },
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
      // Use the response message as-is (it already has proper MessageContent format)
      const aiMessage: ConversationMessage = {
        id: response.conversationMessage.id,
        content: typeof response.conversationMessage.content === 'string'
          ? { type: 'text', content: response.conversationMessage.content }
          : response.conversationMessage.content,
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
          onCreateProject(cleanText);
        }, 1500);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-fadeIn relative">
      <style>{`
        .annotation-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          z-index: 10;
          border: 2px solid white;
        }
        
        .annotation-wrapper {
          position: relative;
        }
      `}</style>
      {/* Top Navigation Bar */}
      <TopNav
        showLogo={true}
        logoText="+ COPADO AI"
        onLogoClick={() => {
          // Navigate to home - could use window.location for now
          if (window.location.pathname.includes('copado-home-page') || window.location.pathname.includes('app.html')) {
            window.location.href = window.location.pathname.includes('copado-home-page') 
              ? '/Mego-Proto-Experiments/copado-home-page.html?view=home'
              : '/Mego-Proto-Experiments/app.html?view=home';
          }
        }}
        onLearnClick={() => console.log('Learn clicked')}
        onIntegrationsClick={() => console.log('Integrations clicked')}
        onPricingClick={() => console.log('Pricing clicked')}
        onSearchClick={() => console.log('Search clicked')}
        onDashboardClick={() => {
          if (onNavigateToDashboard) {
            onNavigateToDashboard();
          } else {
            // Fallback navigation
            const url = window.location.pathname.includes('copado-home-page') 
              ? '/Mego-Proto-Experiments/copado-home-page.html?view=dashboard'
              : '/Mego-Proto-Experiments/app.html?view=dashboard';
            window.location.href = url;
          }
        }}
        onAvatarClick={() => setShowMenu(!showMenu)}
        userName={userName}
        isLoggedIn={true}
        connectedIntegrations={{
          salesforce: true,
          slack: true,
          jira: false,
          github: false,
        }}
        salesforceOrg={{
          name: 'Acme Corp',
          sandbox: 'dev-sandbox-01',
        }}
        onIntegrationClick={(integration) => console.log(`${integration} clicked`)}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto w-full">
        {/* Welcome Heading */}
        <div className="text-center mb-3 py-2">
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-2 sm:mb-3">
            Welcome, <span className="text-blue-600">{userName}</span>. Let's go!
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">
            Great work comes alive here
          </h1>
        </div>

          {/* Conversation Section */}
          <div className="mb-4 sm:mb-6">
            {/* Conversation Messages */}
            <div className="mb-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {conversationMessages.length > 0 && (
                <>
                  <Conversation
                    messages={conversationMessages}
                    showTypingIndicator={showCopadoTyping}
                    onQuestionClick={(question) => handleSendMessage(question, setShowCopadoTyping)}
                  />
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* AI Input */}
            <div className="mb-4">
              <AIInput
                placeholder={conversationMessages.length > 0 ? "Continue the conversation..." : "Start a conversation or pick up where you left off"}
                onSendMessage={(text) => handleSendMessage(text, setShowCopadoTyping)}
                onIntegrationsClick={() => console.log('Integrations clicked')}
                autoFocus={false}
                isLoggedIn={true}
                pageContext="home"
                hasConversation={conversationMessages.length > 0}
                messages={[]}
                showTypingIndicator={showCopadoTyping}
              />
            </div>

            {/* Quick Actions - Below AI Input */}
            {conversationMessages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700 mb-2 text-center">Quick actions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Quick summary of Copado",
                    "Create a deployment plan",
                    "Analyze my org health",
                    "Help with user management"
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(action, setShowCopadoTyping)}
                      className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show "Creating workspace..." message after second user message */}
            {userMessageCount === 2 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-blue-700">
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
        </div>

        {/* Pick up these Section - Below Conversation */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Pick up these
            </h2>
            
            {/* Toggle Button */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <TabToggle
                tabs={[
                  { id: 'recent', label: 'Recent', count: recentItems.length },
                  { id: 'favorites', label: 'Favorites', count: favoritedTemplates.length },
                  { id: 'suggested', label: 'Suggested Templates' }
                ]}
                activeTab={activeTab}
                onTabChange={(id) => setActiveTab(id as 'recent' | 'favorites' | 'suggested' | 'work' | 'templates')}
                size="default"
                variant="blue"
              />
              
              <button
                onClick={() => setShowFindTemplatesModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Find Templates
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
