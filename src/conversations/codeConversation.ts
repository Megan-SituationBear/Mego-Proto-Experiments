import type { ConversationConfig } from './types';

export const codeConversation: ConversationConfig = {
  title: "Code Generation Help",
  theme: "Code Creation",
  agent: {
    name: "Code Assistant",
    role: "Maker Madman",
    personality: "Creative and solution-focused"
  },
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  authentication: {
    required: false,
    guestMode: true,
    gateAfterMessages: 2,
    gateMessage: "To save and deploy your code, please sign in or create an account.",
    limitedFeatures: ['Save code', 'Deploy to org', 'Version control']
  },
  metadata: {
    topic: 'Make',
    difficulty: 'advanced',
    category: 'code',
    estimatedTime: '20 minutes',
    prerequisites: []
  },
  context: { images: [], documents: [], connectedOrgs: [] },
  artifacts: [],
  
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
      options: []
    }
  ],
  
  handleResponse: (_userText: string, _currentMessages, _context, _isAuthenticated = false) => {
    // Conversation logic to be added
    return null;
  }
};

