import { ConversationConfig, ConversationMessage } from './types';

export const meganConversation: ConversationConfig = {
  metadata: {
    topic: 'Strategy',
    difficulty: 'intermediate',
    category: 'general',
  },
  
  initialMessages: [
    {
      id: '1',
      content: "What did Megan do?",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "I'll analyze Megan's recent work across all your connected systems. Let me pull that together for you...",
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '3',
      content: "Here's what Megan accomplished:\n\n**This Week:**\n• Redesigned the AI input component with Ask/Make modes\n• Implemented environment selection for Make mode\n• Built out workspace navigation system\n• Created dashboard with Recent/Pinned/Artifacts tabs\n\n**Key Contributions:**\n• Replaced Favorites with Pinned (bookmark icon)\n• Added conversation tracking (5-item recent cap)\n• Integrated FindTemplatesModal for quick actions\n• Improved dashboard layout with inline stats\n\nWould you like me to drill into any specific area?",
      isUser: false,
      timestamp: new Date(),
      options: [
        "Tell me about the AI Input redesign",
        "Tell me about Dashboard improvements",
        "Tell me about Environment selection",
        "I don't care"
      ]
    }
  ],
  
  handleResponse: (userText: string): ConversationMessage | ConversationMessage[] | null => {
    // Handle "Tell me about X" responses
    if (userText.startsWith("Tell me about")) {
      return {
        id: Date.now().toString(),
        content: `Great question! One of the key improvements is the ability to get back to artifacts.\n\nNow you can easily access your saved artifacts from:\n• The home page Recent tab\n• The dashboard Artifacts tab\n• Any workspace you've created\n\nThis makes it simple to find and continue work on any generated output.\n\nWant to know more about finding artifacts?`,
        isUser: false,
        timestamp: new Date(),
        options: ["Yes", "No"]
      };
    }
    
    // Handle Yes/No responses
    if (userText === "Yes") {
      return {
        id: Date.now().toString(),
        content: `Awesome! Here's how the artifact system works:\n\n**Finding Artifacts:**\n• All artifacts are automatically saved\n• Access them from the Artifacts tab on the home page\n• Each artifact shows when it was created and what type it is\n• You can pin artifacts for quick access\n\n**Working with Artifacts:**\n• Click any artifact to open it in a workspace\n• Download artifacts with one click\n• Share artifacts with your team\n• Apply changes directly from the workspace\n\nThe system tracks everything so you never lose your work!`,
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "No") {
      return {
        id: Date.now().toString(),
        content: "No problem! Let me know if you have any other questions.",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "I don't care") {
      return {
        id: Date.now().toString(),
        content: "Got it! Is there anything else I can help you with?",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Default response for other inputs
    return null;
  }
};

