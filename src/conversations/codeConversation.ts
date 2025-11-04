import { ConversationConfig } from './types';

export const codeConversation: ConversationConfig = {
  metadata: {
    topic: 'Make',
    difficulty: 'advanced',
    category: 'code',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "Help me write some code",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "I'll help you write code. What are you building?\n\n[TO BE DESIGNED]",
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

