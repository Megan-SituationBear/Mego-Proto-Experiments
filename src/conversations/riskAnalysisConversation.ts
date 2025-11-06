import type { ConversationConfig } from './types';

export const riskAnalysisConversation: ConversationConfig = {
  title: "Analyze Users for Risk and Deprecate",
  theme: "Risk Analysis",
  agent: {
    name: "Risk Analyzer",
    role: "Salesforce Expert",
    personality: "Analytical and thorough"
  },
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  authentication: {
    required: true,
    guestMode: false,
    gateMessage: "Org analysis requires an authenticated Salesforce connection. Please sign in to continue."
  },
  metadata: {
    topic: 'Analyze',
    difficulty: 'advanced',
    category: 'analysis',
    estimatedTime: '15 minutes',
    prerequisites: ['Salesforce org connected', 'Admin access']
  },
  context: { images: [], documents: [], connectedOrgs: [] },
  artifacts: [],
  
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
      options: []
    }
  ],
  
  handleResponse: (_userText: string, _currentMessages, _context, _isAuthenticated = true) => {
    return null;
  }
};

