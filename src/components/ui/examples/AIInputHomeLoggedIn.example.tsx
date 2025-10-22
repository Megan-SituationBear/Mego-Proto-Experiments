/**
 * AI Input - Home Page Logged In Variant
 * 
 * Use this for: Dashboard home page, logged-in welcome screen
 * 
 * Copy this entire component to use in your page
 */

import { useState } from 'react';
import { AIInput } from '../index';
import type { ConversationMessage } from '../index';

export function AIInputHomeLoggedInExample() {
  const [messageCount, setMessageCount] = useState(0);

  const handleSendMessage = (text: string) => {
    console.log('Message sent:', text);
    setMessageCount(prev => prev + 1);
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
        isLoggedIn={true}
        pageContext="home"
        hasConversation={messageCount > 0}
      />
    </div>
  );
}

export default AIInputHomeLoggedInExample;

