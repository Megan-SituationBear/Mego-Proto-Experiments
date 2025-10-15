import React, { useState } from 'react';
import IntroPage from './components/IntroPage';
import ChatPanel from './components/ChatPanel';
import Workspace from './components/Workspace';
import './App.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'proto2'>('intro');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!hasStarted) {
      setHasStarted(true);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response with customer planning focus
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1200);
  };

  const handleViewProto2 = () => {
    setCurrentView('proto2');
  };

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onViewProto2={handleViewProto2} 
        onSendMessage={handleSendMessage}
        messages={messages}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Chat Panel - 1/3 */}
      <div className="w-1/3 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col">
        <ChatPanel 
          messages={messages} 
          onSendMessage={handleSendMessage}
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