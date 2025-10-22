/**
 * AI Input - Context Page (Workspace) Variant
 * 
 * Use this for: Workspace pages, project pages, chat panels
 * 
 * Copy this entire component to use in your page
 */

import { useState } from 'react';
import { AIInput } from '../index';

export function AIInputContextPageExample() {
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
    <div className="w-full p-6">
      <AIInput
        placeholder="Continue the conversation..."
        onSendMessage={handleSendMessage}
        onIntegrationsClick={handleIntegrationsClick}
        isLoggedIn={true}
        pageContext="workspace"
        hasConversation={messageCount > 0}
      />
    </div>
  );
}

export default AIInputContextPageExample;

