import { useState } from 'react';
import IntroPage from './components/IntroPage';
import HomePage from './components/HomePage';
import OnboardingFlow from './components/OnboardingFlow';
import TemplatePage from './components/TemplatePage';
import PricingPage from './components/PricingPage';
import ProjectPage from './components/ProjectPage';
import ChatPanel from './components/ChatPanel';
import Workspace from './components/Workspace';
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
  const [currentView, setCurrentView] = useState<'intro' | 'home' | 'onboarding' | 'template' | 'pricing' | 'proto2'>('intro');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProjects, setHasProjects] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [projectTitle, setProjectTitle] = useState('Landing Page Redesign');

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

  const handleSendMessage = (text: string, setTypingIndicator?: (show: boolean) => void) => {
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

      // Auto-transition to workspace after second user message
      if (newUserMessageCount === 2) {
        // Set the project title to the user's second message
        setProjectTitle(text);
        setTimeout(() => {
          setCurrentView('proto2');
        }, 1500); // Wait 1.5s to show the "creating workspace" message
      }
    }, 1200);
  };

  const handleViewProto2 = () => {
    setCurrentView('proto2');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignUp = () => {
    // After sign-up modal, go to onboarding flow
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasProjects(false);
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

  const handleToggleProjects = () => {
    setHasProjects(!hasProjects);
  };

  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    if (isLoggedIn) {
      // Logged in users: go directly to project creation
      setProjectTitle(template.title);
      setCurrentView('proto2');
      setHasStarted(true);
    } else {
      // Logged out users: show full template page with CTA
      setCurrentView('template');
    }
  };

  const handleUseTemplate = () => {
    // This is only called from TemplatePage (logged out users)
    setCurrentView('pricing');
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
  };

  const handleSelectPlan = (plan: string) => {
    console.log('Selected plan:', plan);
    setCurrentView('onboarding');
  };

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onViewProto2={handleViewProto2}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onViewTemplate={handleViewTemplate}
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

  if (currentView === 'home') {
    return (
      <div>
        <HomePage 
          hasProjects={hasProjects}
          onCreateProject={handleCreateProject}
          onOpenProject={handleOpenProject}
          onLogout={handleLogout}
          onViewTemplate={handleViewTemplate}
          onSendMessage={(text) => {
            console.log('Creating project from message:', text);
            handleCreateProject();
          }}
        />
        {/* Debug button for testing */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={handleToggleProjects}
            className="px-4 py-2 rounded bg-gray-600 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Toggle Projects
          </button>
        </div>
      </div>
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