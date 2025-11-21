import type { ConversationConfig, ConversationMessage } from './types';

export const meganConversation: ConversationConfig = {
  // Core details
  title: "What did Megan do?",
  theme: "Team Progress Review",
  agent: {
    name: "Copado AI",
    role: "General Assistant",
    personality: "Helpful and informative"
  },
  
  // Dates
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  
  // Authentication - requires login for work data
  authentication: {
    required: true,
    guestMode: false,
    gateMessage: "Please sign in to view team member activity and work history."
  },
  
  // Metadata
  metadata: {
    topic: 'Strategy',
    difficulty: 'intermediate',
    category: 'general',
    estimatedTime: '5 minutes',
    prerequisites: []
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
      content: "First off, in this effort, Megan:\n\n• Redesigned the AI input component with Ask/Make modes\n• Moved settings that pertain to chat to the AI component\n• Made the AI input self contained and contextual\n• Adjusted the information architecture to be more intuitive\n• Gave people a way to get to things quickly by bookmarking\n• Added Learn and Pricing to top center on main pages\n• Added Dashboard next to a person's name (it's my stuff!)",
      isUser: false,
      timestamp: new Date(),
      options: [
        "Why??",
        "What is the result of making the AI component self contained?",
        "I'm so bored: entertain me"
      ]
    }
  ],
  
  handleResponse: (userText: string, _currentMessages, _context, _isAuthenticated = true): ConversationMessage | ConversationMessage[] | null => {
    
    // Question 1: Why??
    if (userText === "Why??") {
      return {
        id: Date.now().toString(),
        content: "Both ChatGPT and Claude say that the number one 'mistake' that happens in chat is pressing 'enter'. Some flow with it and some don't. It really depends what one is trying to do.\n\nIn Copado's sake, people may be either just chatting or building and we don't want to trip them up.\n\nAll features work for both modes. However, in 'make' mode one presses 'submit' to submit. This way they can type and type.\n\nAlso, try copy and pasting long code into either for fun!",
        isUser: false,
        timestamp: new Date(),
        options: [
          "Why a self-contained AI component is useful?",
          "Move on"
        ]
      };
    }
    
    // Question 2: What is the result of making the AI component self contained?
    if (userText === "What is the result of making the AI component self contained?" || 
        userText === "Why a self-contained AI component is useful?") {
      return {
        id: Date.now().toString(),
        content: "A self-contained AI input makes it possible to embed it, with its settings and integrations, etc. into apps you make: a chrome extension or an app exchange app that embeds where people work.\n\nIt also makes it more clear to the end user that is attached to the AI input. Rather than navigate to settings or integrations somewhere else it is all right there.\n\nSure, it saves your preferences. But if you want to add a Slack channel or confluence situation to a project, then it is more clear.",
        isUser: false,
        timestamp: new Date(),
        options: [
          "Blah, blah what can Copado do for me today?",
          "What else did Megan do?"
        ]
      };
    }
    
    // Question 3: I'm so bored
    if (userText === "I'm so bored: entertain me") {
      return {
        id: Date.now().toString(),
        content: "How to save Okra seeds:\n\n1. Let okra pods mature on the plant until they're brown and dry\n2. Harvest the pods when they start to split open\n3. Remove seeds from the pods\n4. Spread seeds out to dry completely (5-7 days)\n5. Store in a cool, dry place in an envelope or jar\n6. Label with variety and date\n7. Seeds remain viable for 2-4 years\n\n🌱 Pro tip: Only save seeds from heirloom/open-pollinated varieties, not hybrids!",
        isUser: false,
        timestamp: new Date(),
        options: [
          "That's actually interesting",
          "What else did Megan do?"
        ]
      };
    }
    
    // Navigation options
    if (userText === "Move on" || userText === "What else did Megan do?" || userText === "That's actually interesting") {
      return {
        id: Date.now().toString(),
        content: "Pick any topic from the highlights on the right to explore Megan's work in more detail! Each one is clickable.",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText === "Blah, blah what can Copado do for me today?") {
      return {
        id: Date.now().toString(),
        content: "That would open the 'What can Copado do?' workspace - but you're already in a workspace! Navigate back to the home page to check it out.",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Highlight clicks - simple acknowledgments for now
    if (userText.includes("Redesigned the AI input") || userText.includes("Ask/Make modes")) {
      return {
        id: Date.now().toString(),
        content: "The AI input redesign with Ask/Make modes helps prevent the 'accidental enter' problem. Ask mode submits on Enter, while Make mode requires clicking Submit - perfect for long form content!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("Moved settings") || userText.includes("chat to the AI component")) {
      return {
        id: Date.now().toString(),
        content: "Moving settings directly to the AI component makes it self-contained and contextual. Everything you need is right where you're working!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("self contained") || userText.includes("contextual")) {
      return {
        id: Date.now().toString(),
        content: "A self-contained AI component can be embedded anywhere - Chrome extensions, App Exchange apps, or anywhere people work. It brings the power with it!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("information architecture") || userText.includes("intuitive")) {
      return {
        id: Date.now().toString(),
        content: "The IA improvements make navigation more intuitive - everything has its place and works consistently across the app.",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("bookmarking") || userText.includes("quickly")) {
      return {
        id: Date.now().toString(),
        content: "Quick access via bookmarking (now called 'pins') lets you save anything important for later - conversations, artifacts, templates. It's instant recapture!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("Learn and Pricing") || userText.includes("top center") || userText.includes("top nav")) {
      return {
        id: Date.now().toString(),
        content: "Adding Learn and Pricing to the top nav makes key resources easily accessible from anywhere in the app. No more hunting!",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    if (userText.includes("Dashboard") || userText.includes("my stuff")) {
      return {
        id: Date.now().toString(),
        content: "The Dashboard next to your name is your personal hub - 'it's my stuff!' Quick access to recent work, saved items, and artifacts you've created.",
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      content: "Click any topic from the highlights on the right to learn more about what Megan built!",
      isUser: false,
      timestamp: new Date()
    };
  }
};
