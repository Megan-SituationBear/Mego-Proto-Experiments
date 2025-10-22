/**
 * AI Input - Logged Out Variant
 * 
 * Use this for: Landing pages, marketing pages, logged-out experience
 * 
 * Copy this entire component to use in your page
 */

import { useState } from 'react';
import { AIInput } from '../index';

export function AIInputLoggedOutExample() {
  const [messageCount, setMessageCount] = useState(0);

  const handleSendMessage = (text: string) => {
    console.log('Message sent:', text);
    setMessageCount(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <AIInput
        placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
        onSendMessage={handleSendMessage}
        isLoggedIn={false}
        pageContext="home"
        hasConversation={messageCount > 0}
      />
    </div>
  );
}

export default AIInputLoggedOutExample;

