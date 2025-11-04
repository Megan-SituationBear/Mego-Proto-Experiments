import { ConversationConfig } from './types';

export const roadmapConversation: ConversationConfig = {
  metadata: {
    topic: 'Strategy',
    difficulty: 'intermediate',
    category: 'strategy',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "Strategize roadmap",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "Let's strategize your roadmap. I'll help you plan and prioritize your initiatives...\n\n[TO BE DESIGNED]",
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

