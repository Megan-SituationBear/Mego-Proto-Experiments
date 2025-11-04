import type { ConversationConfig } from './types';

export const technicalConversation: ConversationConfig = {
  title: "Technical Implementation Help",
  theme: "Advanced Technical",
  agent: {
    name: "Technical Expert",
    role: "Salesforce Expert",
    personality: "Precise and technical"
  },
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  authentication: {
    required: true,
    guestMode: false,
    gateMessage: "Technical implementations require authentication to access your connected environments. Please sign in."
  },
  metadata: {
    topic: 'Deploy',
    difficulty: 'expert',
    category: 'technical',
    estimatedTime: '30 minutes',
    prerequisites: ['Technical knowledge', 'Salesforce org access']
  },
  context: { images: [], documents: [], connectedOrgs: [] },
  artifacts: [],
  
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
      options: []
    }
  ],
  
  handleResponse: (_userText: string, _currentMessages, _context, _isAuthenticated = true) => {
    return null;
  }
};

