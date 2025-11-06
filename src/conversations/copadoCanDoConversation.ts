import type { ConversationConfig, ConversationMessage } from './types';

export const copadoCanDoConversation: ConversationConfig = {
  title: "What can Copado do?",
  theme: "Product Overview",
  agent: {
    name: "Copado AI",
    role: "General Assistant",
    personality: "Enthusiastic and helpful"
  },
  dateCreated: new Date('2024-11-06'),
  dateModified: new Date('2024-11-06'),
  authentication: {
    required: false,
    guestMode: true,
    gateAfterMessages: 5,
    gateMessage: "Sign up to unlock the full Copado experience!"
  },
  metadata: {
    topic: 'Learn',
    difficulty: 'beginner',
    category: 'general',
    estimatedTime: '5 minutes',
    prerequisites: []
  },
  
  initialMessages: [
    {
      id: '1',
      content: "What can Copado do?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "Great question! Let me show you what makes Copado special and help you get started.\n\nFirst, what do you want to speed up?",
      isUser: false,
      timestamp: new Date(),
      options: [
        "Planning",
        "Strategy",
        "Boring org stuff",
        "Deploying over the weekend",
        "Other, I'll tell you"
      ]
    }
  ],
  
  handleResponse: (userText: string, currentMessages, _context, _isAuthenticated = false): ConversationMessage | ConversationMessage[] | null => {
    // Track conversation state
    const hasAnsweredSpeedUp = currentMessages.some(m => 
      ["Planning", "Strategy", "Boring org stuff", "Deploying over the weekend", "Other, I'll tell you"].includes(m.content)
    );
    const hasAnsweredTechLevel = currentMessages.some(m => 
      ["Super techy", "Somewhat technical", "Not technical at all", "I just want it to work"].includes(m.content)
    );
    
    // Highlight clicks - display their content in work area
    if (userText === "Show me why Copado is different") {
      return {
        id: Date.now().toString(),
        content: `**Why Copado is different**\n\nHere are the key differentiators:\n\n• Lorem ipsum dolor sit amet consectetur adipiscing elit\n• Sed do eiusmod tempor incididunt ut labore et dolore magna\n• Ut enim ad minim veniam quis nostrud exercitation\n• Duis aute irure dolor in reprehenderit in voluptate\n\nWant to dive deeper into any of these?`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "Make it work for you") {
      return {
        id: Date.now().toString(),
        content: `**Make it work for you**\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.\n\nCopado adapts to your workflow and team structure. Let me know if you'd like to see specific examples!`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "Keep it dynamic") {
      return {
        id: Date.now().toString(),
        content: `**Keep it dynamic**\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.\n\nCopado evolves with your needs. What would you like to explore next?`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "Set it up") {
      return {
        id: Date.now().toString(),
        content: `**Set it up**\n\nGreat! Let's get you started. Complete these tasks:\n\n✓ Connect your Salesforce org\n✓ Set up your first project\n✓ Configure deployment pipeline\n✓ Invite your team members\n\nCheck the tasks on the right and mark them off as you go!`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Question 1: What to speed up
    if (["Planning", "Strategy", "Boring org stuff", "Deploying over the weekend"].includes(userText)) {
      return {
        id: Date.now().toString(),
        content: `Perfect! Copado can definitely help with ${userText.toLowerCase()}. We'll make sure you get the right tools.\n\nNext question: How techy are you?`,
        isUser: false,
        timestamp: new Date(),
        options: [
          "Super techy",
          "Somewhat technical",
          "Not technical at all",
          "I just want it to work"
        ]
      };
    }
    
    if (userText === "Other, I'll tell you") {
      return {
        id: Date.now().toString(),
        content: "Tell me what you'd like to speed up, and I'll show you how Copado can help!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Question 2: Tech level
    if (["Super techy", "Somewhat technical", "Not technical at all", "I just want it to work"].includes(userText)) {
      return {
        id: Date.now().toString(),
        content: `Got it - ${userText.toLowerCase()}! I'll tailor the experience for you.\n\n✅ Great! Now let's get you set up. Check out the tasks on the right to complete your setup!`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // If they've answered both, guide to tasks
    if (hasAnsweredSpeedUp && hasAnsweredTechLevel) {
      return {
        id: Date.now().toString(),
        content: "Check out the tasks on the right to complete your setup and start using Copado! 🚀",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Default
    return {
      id: Date.now().toString(),
      content: "Let me know what you'd like to explore! You can also check out the highlights on the right.",
      isUser: false,
      timestamp: new Date()
    };
  }
};

