/**
 * AI Input - Context Page (Workspace) Variant
 * 
 * Use this for: Workspace pages, project pages, chat panels
 * 
 * Copy this entire component to use in your page
 */

import React, { useState } from 'react';
import { AIInput, ConversationMessage } from '../index';

export function AIInputContextPageExample() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages([...messages, userMsg]);

    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after 1.2 seconds
    setTimeout(() => {
      const aiMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        content: "I understand. I'll help you build that out. Let me create the necessary components and configuration.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleIntegrationsClick = () => {
    console.log('Integrations modal opened');
    // You can trigger your integrations modal here
  };

  return (
    <div className="w-full p-6">
      <AIInput
        placeholder="Continue the conversation..."
        onSendMessage={handleSendMessage}
        onIntegrationsClick={handleIntegrationsClick}
        messages={messages}
        showTypingIndicator={isTyping}
        isLoggedIn={true}
        pageContext="workspace"
        hasConversation={messages.length > 0}
      />
    </div>
  );
}

export default AIInputContextPageExample;

