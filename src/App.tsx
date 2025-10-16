import React, { useState } from 'react';
import IntroPage from './components/IntroPage';
import ChatPanel from './components/ChatPanel';
import Workspace from './components/Workspace';
import { ConversationMessage, MessageContent } from './components/Conversation';
import './App.css';

// Keep the old interface for ChatPanel compatibility
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'proto2'>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);

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

    // First message: Echo back what they said and ask a follow-up
    if (currentUserMessageCount === 1) {
      const echoResponse = `I see you mentioned "${userText}". That sounds interesting! Can you tell me more about what you're trying to accomplish?`;
      oldMessage.text = echoResponse;
      newMessage.content = {
        type: 'text',
        content: echoResponse
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
        setTimeout(() => {
          setCurrentView('proto2');
        }, 1500); // Wait 1.5s to show the "creating workspace" message
      }
    }, 1200);
  };

  const handleViewProto2 = () => {
    setCurrentView('proto2');
  };

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onViewProto2={handleViewProto2} 
        onSendMessage={(text, setTypingIndicator) => handleSendMessage(text, setTypingIndicator)}
        messages={messages}
        conversationMessages={conversationMessages}
        userMessageCount={userMessageCount}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Chat Panel - 1/3 */}
      <div className="w-1/3 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col">
        <ChatPanel 
          messages={messages} 
          onSendMessage={(text) => handleSendMessage(text)}
          hasStarted={hasStarted}
        />
      </div>
      
      {/* Right Workspace - 2/3 */}
      <div className="w-2/3 flex flex-col">
        <Workspace hasStarted={hasStarted} />
      </div>
    </div>
  );
}

export default App;