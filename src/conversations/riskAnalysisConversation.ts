import { ConversationConfig } from './types';

export const riskAnalysisConversation: ConversationConfig = {
  metadata: {
    topic: 'Analyze',
    difficulty: 'advanced',
    category: 'analysis',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "Analyze users for risk and deprecate",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "I'll analyze your Salesforce org for user risks and deprecated features...\n\n[TO BE DESIGNED]",
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

