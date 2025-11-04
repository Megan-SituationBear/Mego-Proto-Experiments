import { ConversationConfig } from './types';

export const technicalConversation: ConversationConfig = {
  metadata: {
    topic: 'Deploy',
    difficulty: 'expert',
    category: 'technical',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "I need help with a technical implementation",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "I'm here to help with technical implementations. Let me know what you're working on...\n\n[TO BE DESIGNED]",
      isUser: false,
      timestamp: new Date(),
      options: [
        // Add conversation options here
      ]
    }
  ],
  
  handleResponse: (userText: string) => {
    // Conversation logic to be added
    return null;
  }
};

