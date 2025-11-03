/**
 * AI Input - Logged Out Variant
 * 
 * Use this for: Landing pages, marketing pages, logged-out experience
 * 
 * Copy this entire component to use in your page
 */

import { useState } from 'react';
import { AIInput } from '../index';
import type { ConversationMessage } from '../index';

export function AIInputLoggedOutExample() {
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
        content: `I see you mentioned "${text}". That sounds interesting! Can you tell me more about what you're trying to accomplish?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AIInput
        placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
        onSendMessage={handleSendMessage}
        messages={messages}
        showTypingIndicator={isTyping}
        isLoggedIn={false}
        pageContext="home"
        hasConversation={messages.length > 0}
      />
    </div>
  );
}

export default AIInputLoggedOutExample;

