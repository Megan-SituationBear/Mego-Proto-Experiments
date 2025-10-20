import { useState } from 'react';
import { AIInput, TemplateCard } from './ui';
import FindTemplatesModal from './ui/FindTemplatesModal';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface HomePageProps {
  userName?: string;
  hasProjects?: boolean;
  favoritedTemplates?: any[];
  activeProjects?: any[];
  onCreateProject?: () => void;
  onOpenProject?: (projectId: string) => void;
  onLogout?: () => void;
  onSendMessage?: (text: string, setTypingIndicator?: (show: boolean) => void) => void;
  onViewTemplate?: (template: any) => void;
  messages?: Message[];
  conversationMessages?: any[];
  userMessageCount?: number;
}

const HomePage: React.FC<HomePageProps> = ({
  userName = 'User',
  hasProjects = false,
  favoritedTemplates = [],
  activeProjects = [],
  onCreateProject,
  onLogout,
  onSendMessage,
  onViewTemplate,
  userMessageCount = 0,
}) => {
  const [showFindTemplatesModal, setShowFindTemplatesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'work' | 'templates'>(hasProjects ? 'work' : 'templates');
  const [showCopadoTyping, setShowCopadoTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const recommendedTemplates = [
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
    {
      category: "Deployment Fixes",
      categoryColor: "gray" as const,
      savedHours: 35,
      title: "Schedule Work Analyze & Fix Before Each Deployment",
      description: "Body text body text body text Body text body text body text Body text body text Body text body text.",
      favorites: 1234,
      views: 154
    },
  ];

  // const _handleSendMessage = (text: string) => {
  //   if (!text.trim()) return;

  //   // Add user message
  //   const newMessages = [...conversationMessages, { text, isUser: true }];
  //   setConversationMessages(newMessages);
  //   setShowConversation(true);
  //   setIsAITyping(true);

  //   const newCount = userMessageCount + 1;
  //   setUserMessageCount(newCount);

  //   // Simulate AI response
  //   setTimeout(() => {
  //     let aiResponse = '';
      
  //     if (newCount === 1) {
  //       aiResponse = "Great! Tell me more about what you're trying to build. What's the main goal of this project?";
  //     } else if (newCount === 2) {
  //       aiResponse = "Perfect! I have enough information to get started. Let me create your project workspace...";
  //     }

  //     setConversationMessages([...newMessages, { text: aiResponse, isUser: false }]);
  //     setIsAITyping(false);

  //     // After second exchange, create project
  //     if (newCount === 2) {
  //       setTimeout(() => {
  //         if (onSendMessage) {
  //           onSendMessage(text);
  //         }
  //       }, 1500);
  //     }
  //   }, 1000);
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold text-blue-600">+ COPADI AI</span>
            </div>

            {/* Right: Hamburger Menu */}
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

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
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              showMenu ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="4" x2="16" y2="16" strokeLinecap="round"/>
                  <line x1="16" y1="4" x2="4" y2="16" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* User Info Section */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                  {userName.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">Free Plan</p>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="py-4">
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to settings (placeholder)
                }}
                className="w-full px-6 py-3 text-left text-base text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="3"/>
                  <path d="M10 1v2m0 14v2M4.22 4.22l1.42 1.42m8.72 8.72l1.42 1.42M1 10h2m14 0h2M4.22 15.78l1.42-1.42m8.72-8.72l1.42-1.42"/>
                </svg>
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to help (placeholder)
                }}
                className="w-full px-6 py-3 text-left text-base text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="10" cy="10" r="9"/>
                  <path d="M10 14v.5M10 6v5"/>
                </svg>
                <span>Help & Documentation</span>
              </button>
            </div>

            {/* Logout Button at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onLogout?.();
                }}
                className="w-full px-6 py-3 text-left text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3M8 17l-5-5 5-5m-5 5h12"/>
                </svg>
                <span>Logout</span>
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
          <AIInput
            placeholder="What action do you want to start?"
            onSendMessage={(text) => {
              if (onSendMessage) {
                onSendMessage(text, setShowCopadoTyping);
              } else if (onCreateProject) {
                onCreateProject();
              }
            }}
            onIntegrationsClick={() => console.log('Integrations clicked')}
            autoFocus={false}
            isLoggedIn={true}
            pageContext="home"
            hasConversation={false}
            messages={[]}
            showTypingIndicator={showCopadoTyping}
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

        {/* Your Work | Templates For You Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              <button 
                onClick={() => setActiveTab('work')}
                className={`${activeTab === 'work' ? 'text-slate-900' : 'text-gray-400'} hover:text-slate-900 transition-colors`}
              >
                Your Work
              </button>
              <span className="text-gray-400 mx-2">|</span>
              <button 
                onClick={() => setActiveTab('templates')}
                className={`${activeTab === 'templates' ? 'text-slate-900' : 'text-gray-400'} hover:text-slate-900 transition-colors`}
              >
                Templates For You
              </button>
            </h2>
            <button
              onClick={() => setShowFindTemplatesModal(true)}
              className="px-6 py-2 rounded border border-gray-300 text-slate-900 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Find Templates
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'templates' ? (
              recommendedTemplates.map((template, index) => (
                <TemplateCard
                  key={index}
                  category={template.category}
                  categoryColor={template.categoryColor}
                  savedHours={template.savedHours}
                  title={template.title}
                  description={template.description}
                  favorites={template.favorites}
                  views={template.views}
                  onClick={() => onViewTemplate?.(template)}
                />
              ))
            ) : (
              (activeProjects.length > 0 || favoritedTemplates.length > 0) ? (
                <>
                  {/* Active Projects */}
                  {activeProjects.map((project, index) => (
                    <TemplateCard
                      key={`project-${index}`}
                      category={project.category || 'Active Project'}
                      categoryColor={project.categoryColor || 'blue'}
                      savedHours={project.savedHours}
                      title={project.title}
                      description={project.description || 'Work in progress'}
                      favorites={project.favorites}
                      views={project.views}
                      onClick={() => onViewTemplate?.(project)}
                    />
                  ))}
                  {/* Favorited Templates */}
                  {favoritedTemplates.map((template, index) => (
                    <TemplateCard
                      key={`favorite-${index}`}
                      category={template.category}
                      categoryColor={template.categoryColor}
                      savedHours={template.savedHours}
                      title={template.title}
                      description={template.description}
                      favorites={template.favorites}
                      views={template.views}
                      onClick={() => onViewTemplate?.(template)}
                    />
                  ))}
                </>
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No work items yet. Use a template or star one to add it to your work!</p>
                </div>
              )
            )}
          </div>
        </div>

      </main>

      {/* Find Templates Modal */}
      <FindTemplatesModal
        isOpen={showFindTemplatesModal}
        onClose={() => setShowFindTemplatesModal(false)}
        onSelectTemplate={(template) => {
          setShowFindTemplatesModal(false);
          onViewTemplate?.(template);
        }}
      />
    </div>
  );
};

export default HomePage;
