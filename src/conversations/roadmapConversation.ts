import type { ConversationConfig } from './types';

export const roadmapConversation: ConversationConfig = {
  title: "Strategize Roadmap",
  theme: "Strategic Planning",
  agent: {
    name: "Strategy Assistant",
    role: "Strategy & Plan Boss",
    personality: "Strategic and forward-thinking"
  },
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  authentication: {
    required: false,
    guestMode: true,
    gateAfterMessages: 4,
    gateMessage: "To save your roadmap and continue planning, please sign in or create an account.",
    limitedFeatures: ['Save roadmap', 'Export plan', 'Share with team']
  },
  metadata: {
    topic: 'Strategy',
    difficulty: 'intermediate',
    category: 'strategy',
    estimatedTime: '20 minutes',
    prerequisites: []
  },
  context: { images: [], documents: [], connectedOrgs: [] },
  artifacts: [],
  
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
      options: []
    }
  ],
  
  handleResponse: (_userText: string, _currentMessages, _context, _isAuthenticated = false) => {
    return null;
  }
};

