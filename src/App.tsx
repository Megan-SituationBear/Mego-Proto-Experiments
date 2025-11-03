import { useState } from 'react';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import OnboardingFlow from './pages/OnboardingFlow';
import TemplatePage from './pages/TemplatePage';
import PricingPage from './pages/PricingPage';
import WorkItemPage from './pages/WorkItemPage';
import WorkspacePage from './pages/WorkspacePage';
import type { ConversationMessage } from './components/Conversation';
import './App.css';

/**
 * Main App Component - Acts as router and manages global navigation state
 * 
 * Pages manage their own internal state (UI, forms, etc.)
 * App manages cross-page state (auth, navigation, selected items)
 * Work Item pages need conversation state passed from App for continuity
 */
function App() {
  // Check URL parameter to start directly at home page or dashboard
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view');
  const initialView = viewParam === 'home' ? 'home' : viewParam === 'dashboard' ? 'dashboard' : 'intro';
  
  // Navigation state
  const [currentView, setCurrentView] = useState<'intro' | 'home' | 'dashboard' | 'onboarding' | 'template' | 'pricing' | 'work-item' | 'workspace'>(initialView);
  
  // Auth state - if starting at home, treat as logged in
  const [isLoggedIn, setIsLoggedIn] = useState(initialView === 'home');
  const [isSignUpFlow, setIsSignUpFlow] = useState(true); // Track if user is signing up vs logging in
  
  // Workspace state
  const [workspaceConfig, setWorkspaceConfig] = useState<{
    type: 'chat' | 'library-item' | 'artifact';
    title: string;
    topic: string;
    initialPrompt: string;
  } | null>(null);
  
  // User data (could be moved to context in future)
  const [userName, setUserName] = useState('Jill');
  const [hasProjects, setHasProjects] = useState(false);
  const [favoritedTemplates, setFavoritedTemplates] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [recentItems, setRecentItems] = useState<any[]>([]); // Track recent work items
  
  // Selected item state
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [workItemType, setWorkItemType] = useState<'project' | 'artifact'>('project');
  const [isDuplicatedTemplate, setIsDuplicatedTemplate] = useState(false);
  
  // Conversation state (for work items)
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);

  // ============ AI Message Generation ============
  
  const generateAIResponse = (userText: string, currentUserMessageCount: number): ConversationMessage => {
    const lowerText = userText.toLowerCase();

    // Create message for Conversation component
    const newMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      content: { type: 'text', content: "" },
      isUser: false,
      timestamp: new Date()
    };

    // First message: Ask about the business case
    if (currentUserMessageCount === 1) {
      newMessage.content = {
        type: 'text',
        content: "Tell me about the business case, please. Is it for a customer? Internal? What do you want it to do?"
      };
      return newMessage;
    }

    // Second message: Show "Creating workspace..." message
    if (currentUserMessageCount === 2) {
      newMessage.content = {
        type: 'text',
        content: "Perfect! Let me create a workspace for you to dive deeper into this..."
      };
      return newMessage;
    }

    // Default responses for workspace (after transition)
    if (lowerText.includes('deploy') || lowerText.includes('deployment')) {
      newMessage.content = {
        type: 'step-by-step',
        content: "Deployment Plan",
        metadata: {
          steps: [
            "Review current org configuration",
            "Run dependency analysis",
            "Create deployment package",
            "Execute pre-deployment tests",
            "Deploy to staging environment"
          ]
        }
      };
    } else if (lowerText.includes('artifact') || lowerText.includes('create')) {
      newMessage.content = {
        type: 'artifact',
        content: "This artifact includes all the necessary components for your deployment with proper dependency management and metadata.",
        metadata: {
          artifactName: "deployment-artifact-v1.2.zip"
        }
      };
    } else if (lowerText.includes('question') || lowerText.includes('help')) {
      newMessage.content = {
        type: 'question',
        content: "I can help you with several things. What would you like to know more about?",
        metadata: {
          steps: [
            "Deployment planning",
            "Org analysis",
            "Best practices",
            "Troubleshooting"
          ]
        }
      };
    } else {
      newMessage.content = {
        type: 'text',
        content: "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?"
      };
    }

    return newMessage;
  };

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void, fromWorkItem: boolean = false) => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);

    // User message
    const userConversationMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: { type: 'text', content: text },
      isUser: true,
      timestamp: new Date()
    };

    setConversationMessages(prev => [...prev, userConversationMessage]);
    
    // Show typing indicator
    if (setTypingIndicator) {
      setTypingIndicator(true);
    }

    // Simulate AI response based on input and message count
    setTimeout(() => {
      const response = generateAIResponse(text, newUserMessageCount);
      setConversationMessages(prev => [...prev, response]);
      
      // Hide typing indicator
      if (setTypingIndicator) {
        setTypingIndicator(false);
      }

      // Auto-transition to workspace after second user message (only from home page, not from work item)
      if (newUserMessageCount === 2 && !fromWorkItem && currentView === 'home') {
        setTimeout(() => {
          // Create new project work item
          const newProject = {
            title: text,
            category: 'New Project',
            savedHours: 0,
            id: Date.now().toString(),
            startedAt: new Date(),
          };
          setSelectedTemplate(newProject);
          setActiveProjects(prev => [...prev, newProject]);
          setHasProjects(true);
          setWorkItemType('project');
          setCurrentView('work-item');
        }, 1500); // Wait 1.5s to show the "creating workspace" message
      }
    }, 1200);
  };

  // ============ Navigation Handlers ============
  
  const handleLogin = () => {
    setIsSignUpFlow(false); // Login: skip questions
    setCurrentView('onboarding');
  };

  const handleSignUp = () => {
    setIsSignUpFlow(true); // Sign up: include questions
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = (name?: string) => {
    if (name && name.trim()) {
      setUserName(name.trim());
    }
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasProjects(false);
    setFavoritedTemplates([]);
    setActiveProjects([]);
    setConversationMessages([]);
    setUserMessageCount(0);
    setHasStarted(false);
    setCurrentView('intro');
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
  };

  // ============ Template & Project Handlers ============
  
  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setWorkItemType('project'); // Templates are always 'project' type
    setIsDuplicatedTemplate(false); // Reset duplicated state when viewing a template
    
    // Add to recent items when viewing
    const templateWithTimestamp = {
      ...template,
      lastAccessed: new Date(),
    };
    setRecentItems(prev => [templateWithTimestamp, ...prev.filter(item => item.id !== template.id)].slice(0, 10));
    
    setCurrentView('work-item'); // Navigate to work item template page
  };

  const handleToggleFavorite = (template: any, isFavorited: boolean) => {
    if (isFavorited) {
      // Add to favorites
      setFavoritedTemplates(prev => [...prev, template]);
      setHasProjects(true);
    } else {
      // Remove from favorites
      setFavoritedTemplates(prev => 
        prev.filter(t => t.title !== template.title)
      );
      // If no more favorites, hide "Your Work" tab
      if (favoritedTemplates.length === 1) {
        setHasProjects(false);
      }
    }
  };

  const handleUseTemplate = (customName?: string) => {
    if (isLoggedIn || workItemType === 'artifact') {
      // Create new work item with custom name
      const newProject = {
        ...selectedTemplate,
        title: customName || selectedTemplate?.title || 'My Project',
        id: Date.now().toString(),
        startedAt: new Date(),
        isWorkingOn: true, // Mark as "Working On" status
        lastAccessed: new Date(),
      };
      
      // Add to active projects (shows in "My Work")
      setActiveProjects(prev => [...prev, newProject]);
      setHasProjects(true);
      
      // Add to recent items (shows in hamburger menu)
      setRecentItems(prev => [newProject, ...prev.filter(item => item.id !== newProject.id)].slice(0, 10)); // Keep last 10
      
      // Set as current template and mark as duplicated
      setSelectedTemplate(newProject);
      setIsDuplicatedTemplate(true);
      
      // Reset conversation for new project
      setConversationMessages([]);
      setUserMessageCount(0);
      setHasStarted(false);
    } else {
      // Show pricing for logged out users
      setCurrentView('pricing');
    }
  };

  const handleCreateProject = (title?: string) => {
    const newProject = {
      title: title || 'New Project',
      category: 'New Project',
      savedHours: 0,
      id: Date.now().toString(),
      startedAt: new Date(),
    };
    setActiveProjects(prev => [...prev, newProject]);
    setHasProjects(true);
    setSelectedTemplate(newProject);
    setWorkItemType('project');
    setCurrentView('work-item');
  };

  const handleSelectPlan = (plan: string) => {
    if (plan === 'Free') {
      handleLogin();
    } else {
      setCurrentView('onboarding');
    }
  };

  const handleNavigateToWorkspace = (config: {
    type: 'chat' | 'library-item' | 'artifact';
    title: string;
    topic: string;
    initialPrompt: string;
  }) => {
    setWorkspaceConfig(config);
    setCurrentView('workspace');
  };

  // ============ Render Views ============

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onViewTemplate={handleViewTemplate}
        onViewPricing={() => setCurrentView('pricing')}
      />
    );
  }

  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} isSignUp={isSignUpFlow} />;
  }

  if (currentView === 'template') {
    return (
      <TemplatePage
        template={selectedTemplate}
        onBack={handleBackToIntro}
        onUseTemplate={() => setCurrentView('pricing')}
      />
    );
  }

  if (currentView === 'pricing') {
    return (
      <PricingPage
        onBack={handleBackToIntro}
        onSelectPlan={handleSelectPlan}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage 
        userName={userName}
        hasProjects={hasProjects}
        favoritedTemplates={favoritedTemplates}
        activeProjects={activeProjects}
        recentItems={recentItems}
        onCreateProject={handleCreateProject}
        onLogout={handleLogout}
        onViewTemplate={handleViewTemplate}
        onNavigateToDashboard={() => setCurrentView('dashboard')}
        onNavigateToWorkspace={handleNavigateToWorkspace}
      />
    );
  }

  if (currentView === 'workspace') {
    if (!workspaceConfig) {
      setCurrentView('home');
      return null;
    }

    return (
      <WorkspacePage
        workspaceType={workspaceConfig.type}
        workspaceTitle={workspaceConfig.title}
        workspaceTopic={workspaceConfig.topic}
        initialPrompt={workspaceConfig.initialPrompt}
        onNavigateHome={() => setCurrentView('home')}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'dashboard') {
    // Calculate stats from projects
    const dashboardStats = {
      totalTimeSaved: activeProjects.reduce((sum, p) => sum + (p.savedHours || 0), 0),
      totalProjects: activeProjects.length,
      totalDeployments: activeProjects.reduce((sum, p) => sum + (p.deployments || 0), 0),
    };

    return (
      <DashboardPage
        userName={userName}
        projects={activeProjects}
        stats={dashboardStats}
        onViewProject={handleViewTemplate}
        onAvatarClick={() => setCurrentView('home')}
        salesforceOrg={{
          name: 'Acme Corp',
          sandbox: 'dev-sandbox-01',
        }}
        connectedIntegrations={{
          salesforce: true,
          slack: true,
          jira: false,
          github: false,
        }}
        onLogoClick={() => {
          if (window.location.pathname.includes('copado-home-page') || window.location.pathname.includes('app.html')) {
            window.location.href = window.location.pathname.includes('copado-home-page') 
              ? '/Mego-Proto-Experiments/copado-home-page.html?view=home'
              : '/Mego-Proto-Experiments/app.html?view=home';
          }
        }}
        onSearchClick={() => console.log('Search clicked')}
        onDashboardClick={() => setCurrentView('dashboard')}
        onLearnClick={() => console.log('Learn clicked')}
        onIntegrationsClick={() => console.log('Integrations clicked')}
        onPricingClick={() => setCurrentView('pricing')}
        onIntegrationClick={(integration) => console.log(`${integration} clicked`)}
      />
    );
  }

  if (currentView === 'work-item') {
    // Check if current template is favorited
    const isFavorited = favoritedTemplates.some(t => t.title === selectedTemplate?.title);
    // Check if this is a new project created from conversation
    const isNewProject = hasStarted && conversationMessages.length >= 2;
    
    return (
      <WorkItemPage
        type={workItemType}
        isLoggedIn={isLoggedIn}
        templateData={selectedTemplate}
        initialIsFavorite={isFavorited}
        isNewProject={isNewProject}
        isDuplicatedTemplate={isDuplicatedTemplate}
        onBack={() => {
          // Always reset conversation when going back to home
          setConversationMessages([]);
          setUserMessageCount(0);
          setHasStarted(false);
          setIsDuplicatedTemplate(false);
          setCurrentView(isLoggedIn ? 'home' : 'intro');
        }}
        onUseTemplate={handleUseTemplate}
        onToggleFavorite={(isFavorited) => handleToggleFavorite(selectedTemplate, isFavorited)}
        onSignIn={handleLogin}
        conversationMessages={conversationMessages}
        onSendMessage={(text, setTypingIndicator) => handleSendMessage(text, setTypingIndicator, true)}
        userMessageCount={userMessageCount}
      />
    );
  }

  // Fallback
  return null;
}

export default App;
