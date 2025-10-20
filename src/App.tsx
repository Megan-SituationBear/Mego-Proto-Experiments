import { useState } from 'react';
import IntroPage from './components/IntroPage';
import HomePage from './components/HomePage';
import OnboardingFlow from './components/OnboardingFlow';
import TemplatePage from './components/TemplatePage';
import PricingPage from './components/PricingPage';
import ProjectPage from './components/ProjectPage';
import WorkItemTemplate from './components/WorkItemTemplate';
// import ChatPanel from './components/ChatPanel';
// import Workspace from './components/Workspace';
import type { ConversationMessage } from './components/Conversation';
import './App.css';

// Keep the old interface for ChatPanel compatibility
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'home' | 'onboarding' | 'template' | 'pricing' | 'proto2' | 'work-item'>('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProjects, setHasProjects] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [workItemType, setWorkItemType] = useState<'project' | 'artifact'>('project');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [projectTitle, setProjectTitle] = useState('Landing Page Redesign');
  const userName = 'Jill'; // Could be set from auth in future
  const [favoritedTemplates, setFavoritedTemplates] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [isDuplicatedTemplate, setIsDuplicatedTemplate] = useState(false);

  const generateAIResponse = (userText: string, currentUserMessageCount: number): { message: Message; conversationMessage: ConversationMessage } => {
    const lowerText = userText.toLowerCase();
    
    // Create old format message for ChatPanel
    const oldMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "",
      isUser: false,
      timestamp: new Date()
    };

    // Create new format message for Conversation component
    const newMessage: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      content: { type: 'text', content: "" },
      isUser: false,
      timestamp: new Date()
    };

    // First message: Ask about the business case
    if (currentUserMessageCount === 1) {
      oldMessage.text = "Tell me about the business case, please. Is it for a customer? Internal? What do you want it to do?";
      newMessage.content = {
        type: 'text',
        content: "Tell me about the business case, please. Is it for a customer? Internal? What do you want it to do?"
      };
      return { message: oldMessage, conversationMessage: newMessage };
    }

    // Second message: Show "Creating workspace..." message
    if (currentUserMessageCount === 2) {
      oldMessage.text = "Perfect! Let me create a workspace for you to dive deeper into this...";
      newMessage.content = {
        type: 'text',
        content: "Perfect! Let me create a workspace for you to dive deeper into this..."
      };
      return { message: oldMessage, conversationMessage: newMessage };
    }

    // Default responses for workspace (after transition)
    if (lowerText.includes('deploy') || lowerText.includes('deployment')) {
      oldMessage.text = "I'll help you create a deployment plan. Here's what we need to do:";
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
      oldMessage.text = "I've created a deployment artifact for you.";
      newMessage.content = {
        type: 'artifact',
        content: "This artifact includes all the necessary components for your deployment with proper dependency management and metadata.",
        metadata: {
          artifactName: "deployment-artifact-v1.2.zip"
        }
      };
    } else if (lowerText.includes('question') || lowerText.includes('help')) {
      oldMessage.text = "I can help you with several things. What would you like to know more about?";
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
      oldMessage.text = "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?";
      newMessage.content = {
        type: 'text',
        content: "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?"
      };
    }

    return { message: oldMessage, conversationMessage: newMessage };
  };

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void, fromWorkItem: boolean = false) => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    // Increment user message count
    const newUserMessageCount = userMessageCount + 1;
    setUserMessageCount(newUserMessageCount);

    // User message in both formats
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    const userConversationMessage: ConversationMessage = {
      id: Date.now().toString(),
      content: { type: 'text', content: text },
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationMessages(prev => [...prev, userConversationMessage]);
    
    // Show typing indicator
    if (setTypingIndicator) {
      setTypingIndicator(true);
    }

    // Simulate AI response based on input and message count
    setTimeout(() => {
      const response = generateAIResponse(text, newUserMessageCount);
      setMessages(prev => [...prev, response.message]);
      setConversationMessages(prev => [...prev, response.conversationMessage]);
      
      // Hide typing indicator
      if (setTypingIndicator) {
        setTypingIndicator(false);
      }

      // Auto-transition to workspace after second user message (only from home page, not from work item)
      if (newUserMessageCount === 2 && !fromWorkItem && currentView === 'home') {
        // Set the project title to the user's second message
        setProjectTitle(text);
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasProjects(false);
    setMessages([]);
    setConversationMessages([]);
    setUserMessageCount(0);
    setHasStarted(false);
    setCurrentView('intro');
  };

  const handleCreateProject = () => {
    setCurrentView('proto2');
    setHasStarted(true);
  };

  const handleOpenProject = (projectId: string) => {
    console.log('Opening project:', projectId);
    setCurrentView('proto2');
    setHasStarted(true);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    setWorkItemType('project'); // Templates are always 'project' type
    setIsDuplicatedTemplate(false); // Reset duplicated state when viewing a template
    setCurrentView('work-item'); // Navigate to work item template page
  };

  const handleToggleFavorite = (template: any, isFavorited: boolean) => {
    if (isFavorited) {
      // Add to favorites
      setFavoritedTemplates(prev => [...prev, template]);
      setHasProjects(true); // Show "Your Work" tab
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

  // Available for future use - view work item directly
  // const handleViewWorkItem = (type: 'project' | 'artifact', template?: any) => {
  //   setWorkItemType(type);
  //   if (template) {
  //     setSelectedTemplate(template);
  //   }
  //   setCurrentView('work-item');
  // };

  const handleUseTemplate = () => {
    // This is only called from TemplatePage (logged out users)
    setCurrentView('pricing');
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
  };

  const handleSelectPlan = (plan: string) => {
    console.log('Selected plan:', plan);
    if (plan === 'Free') {
      // Free plan: log in and go directly to home
      setIsLoggedIn(true);
      setCurrentView('home');
    } else {
      // Other plans: go to onboarding
      setCurrentView('onboarding');
    }
  };

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onViewTemplate={handleViewTemplate}
        onViewPricing={() => setCurrentView('pricing')}
        onSendMessage={(text, setTypingIndicator) => handleSendMessage(text, setTypingIndicator)}
        messages={messages}
        conversationMessages={conversationMessages}
        userMessageCount={userMessageCount}
      />
    );
  }

  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'template') {
    return (
      <TemplatePage
        template={selectedTemplate}
        onBack={handleBackToIntro}
        onUseTemplate={handleUseTemplate}
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

  if (currentView === 'work-item') {
    // Check if current template is favorited
    const isFavorited = favoritedTemplates.some(t => t.title === selectedTemplate?.title);
    // Check if this is a new project created from conversation
    const isNewProject = hasStarted && conversationMessages.length >= 2;
    
    return (
      <WorkItemTemplate
        type={workItemType}
        isLoggedIn={isLoggedIn}
        templateData={selectedTemplate}
        initialIsFavorite={isFavorited}
        isNewProject={isNewProject}
        isDuplicatedTemplate={isDuplicatedTemplate}
        onBack={() => {
          // Always reset conversation when going back to home
          setMessages([]);
          setConversationMessages([]);
          setUserMessageCount(0);
          setHasStarted(false);
          setIsDuplicatedTemplate(false);
          setCurrentView(isLoggedIn ? 'home' : 'intro');
        }}
        onUseTemplate={() => {
          if (isLoggedIn || workItemType === 'artifact') {
            // Add to active projects and show in "My Work"
            const newProject = {
              ...selectedTemplate,
              id: Date.now().toString(),
              startedAt: new Date(),
            };
            setActiveProjects(prev => [...prev, newProject]);
            setHasProjects(true);
            
            // Set project title and create new project view
            setProjectTitle(selectedTemplate?.title || 'New Project');
            setSelectedTemplate(newProject);
            setIsDuplicatedTemplate(true);
            
            // Reset conversation for new project
            setConversationMessages([]);
            setMessages([]);
            setUserMessageCount(0);
            setHasStarted(false);
          } else {
            setCurrentView('pricing');
          }
        }}
        onToggleFavorite={(isFavorited) => handleToggleFavorite(selectedTemplate, isFavorited)}
        onSignIn={handleLogin}
        conversationMessages={conversationMessages}
        onSendMessage={(text, setTypingIndicator) => handleSendMessage(text, setTypingIndicator, true)}
        userMessageCount={userMessageCount}
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
        onCreateProject={handleCreateProject}
        onOpenProject={handleOpenProject}
        onLogout={handleLogout}
        onViewTemplate={handleViewTemplate}
        onSendMessage={(text, setTypingIndicator) => handleSendMessage(text, setTypingIndicator)}
        conversationMessages={conversationMessages}
        userMessageCount={userMessageCount}
      />
    );
  }

  // Use new ProjectPage for in-progress projects
  return (
    <ProjectPage
      projectTitle={projectTitle}
      projectDate={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      onBack={() => setCurrentView('home')}
    />
  );
}

export default App;