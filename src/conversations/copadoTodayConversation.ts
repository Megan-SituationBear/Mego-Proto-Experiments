import { ConversationConfig } from './types';

export const copadoTodayConversation: ConversationConfig = {
  metadata: {
    topic: 'Learn',
    difficulty: 'beginner',
    category: 'general',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "What can Copado do for me today?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "Great question! Let me show you what Copado AI can help you accomplish today...\n\n[TO BE DESIGNED]",
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

