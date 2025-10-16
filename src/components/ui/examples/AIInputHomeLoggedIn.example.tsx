/**
 * AI Input - Home Page Logged In Variant
 * 
 * Use this for: Dashboard home page, logged-in welcome screen
 * 
 * Copy this entire component to use in your page
 */

import React, { useState } from 'react';
import { AIInput, ConversationMessage } from '../index';

export function AIInputHomeLoggedInExample() {
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
        content: "Great! I'll help you with that. Let me gather some information and create a plan for you.",
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
    <div className="w-full max-w-4xl mx-auto px-4">
      <AIInput
        placeholder="What would you like to work on today?"
        onSendMessage={handleSendMessage}
        onIntegrationsClick={handleIntegrationsClick}
        messages={messages}
        showTypingIndicator={isTyping}
        isLoggedIn={true}
        pageContext="home"
        hasConversation={messages.length > 0}
      />
    </div>
  );
}

export default AIInputHomeLoggedInExample;

