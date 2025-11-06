import type { ConversationConfig } from './types';

export const copadoTodayConversation: ConversationConfig = {
  // Core details
  title: "What can Copado do for me today?",
  theme: "Getting Started",
  agent: {
    name: "Copado AI",
    role: "General Assistant",
    personality: "Friendly and encouraging"
  },
  
  // Dates
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  
  // Authentication settings - allow guests to try, then prompt for login
  authentication: {
    required: false, // Can use without login initially
    guestMode: true, // Allow guests to start
    gateAfterMessages: 3, // Show auth gate after 3 messages
    gateMessage: "To continue and save your work, please sign in or create a free account. You'll get access to all features, saved conversations, and more!",
    limitedFeatures: ['Save artifacts', 'Connect integrations', 'Access history']
  },
  
  // Metadata
  metadata: {
    topic: 'Learn',
    difficulty: 'beginner',
    category: 'general',
    estimatedTime: '3 minutes',
    prerequisites: []
  },
  
  // Steps (example structure)
  steps: [
    {
      id: 'step-1',
      title: 'Learn about Copado AI',
      description: 'Understand what Copado AI can do',
      status: 'in-progress',
      requirements: ['Watch introduction'],
      nextStep: 'step-2'
    },
    {
      id: 'step-2',
      title: 'Connect your first integration',
      description: 'Connect Salesforce to get started',
      status: 'pending',
      requirements: ['Salesforce connected'],
      nextStep: 'step-3'
    },
    {
      id: 'step-3',
      title: 'Try your first action',
      description: 'Create something with Copado AI',
      status: 'pending',
      requirements: ['Complete an action']
    }
  ],
  
  // Context (can be populated as user progresses)
  context: {
    images: [],
    documents: [],
    connectedOrgs: []
  },
  
  // Artifacts (will be created during conversation)
  artifacts: [],
  
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
        "Show me quick wins",
        "Help me deploy code",
        "Analyze my org",
        "Create documentation"
      ]
    }
  ],
  
  handleResponse: (userText: string, currentMessages, _context, isAuthenticated = false) => {
    // Check if we need to show auth gate
    // Count AI messages (not user messages) to determine if we've hit the gate
    const aiMessageCount = currentMessages.filter(m => !m.isUser).length;
    const gateAfterMessages = 3; // From authentication config
    
    // If user is not authenticated and we've reached the gate threshold, show auth prompt
    if (!isAuthenticated && aiMessageCount >= gateAfterMessages) {
      return {
        id: Date.now().toString(),
        content: "To continue and save your work, please sign in or create a free account. You'll get access to all features, saved conversations, and more!",
        isUser: false,
        timestamp: new Date(),
        requiresAction: true,
        actionType: 'connect', // This would trigger auth modal
        options: ["Sign In", "Create Account", "Continue as Guest (limited)"]
      };
    }
    
    // Regular conversation logic
    if (userText === "Show me quick wins") {
      return {
        id: Date.now().toString(),
        content: "Here are some quick wins you can accomplish right now...\n\n[TO BE DESIGNED]",
        isUser: false,
        timestamp: new Date(),
        options: ["Tell me more", "Let's start"]
      };
    }
    
    // Add more conversation logic here
    return null;
  }
};

