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
    
    // Chat Design 1: Self-contained contextual chat
    if (userText === "Tell me about Chat Design 1") {
      const nextOptions = [];
      if (!exploredTopics.has("chat3")) nextOptions.push("How does moving items work with this?");
      if (!exploredTopics.has("ia")) nextOptions.push("How does this fit the overall IA?");
      if (!exploredTopics.has("onboarding")) nextOptions.push("How is onboarding integrated?");
      if (nextOptions.length === 0) nextOptions.push("Explore another topic");
      
      return {
        id: Date.now().toString(),
        content: `**Chat Design 1: Self-Contained, Contextual Chat**\n\nThe AI input component is designed to be embedded anywhere - home page, workspaces, or even future integrations.\n\n**Key Features:**\n• Works standalone or contextual (adapts to where it lives)\n• Same component, different contexts\n• Can be "for this conversation" or "global"\n• Settings and integrations scoped to context\n\nThis means you can drop the chat anywhere and it just works, while being smart about its environment.\n\n${remainingTopics > 0 ? `💡 ${remainingTopics} more topic${remainingTopics > 1 ? 's' : ''} to explore!` : '🎉 All topics explored!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Chat Design 2: Make Mode
    if (userText === "Tell me about Chat Design 2") {
      const nextOptions = [];
      if (!exploredTopics.has("chat1")) nextOptions.push("How is this chat component designed?");
      if (!exploredTopics.has("ia")) nextOptions.push("Does Make mode fit the IA pattern?");
      if (!exploredTopics.has("access")) nextOptions.push("Can I pin things from Make mode?");
      if (nextOptions.length === 0) nextOptions.push("Show me something else");
      
      return {
        id: Date.now().toString(),
        content: `**Chat Design 2: Make Mode - Why?**\n\nMake mode solves a specific problem: generating artifacts requires different inputs than asking questions.\n\n**Why it exists:**\n• Separates "Ask" (quick back-and-forth) from "Make" (creating something)\n• Make mode has: larger input, environment selection, no Enter-to-send\n• Forces intentionality - you're building, not chatting\n• First submission creates a dedicated workspace\n\n**The benefit?** Clear mental model - Ask = conversation, Make = creation.\n\n${remainingTopics > 0 ? `⚡ ${remainingTopics} more design decision${remainingTopics > 1 ? 's' : ''} waiting!` : '✨ You\'ve seen it all!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Chat Design 3: Moving Items
    if (userText === "Tell me about Chat Design 3") {
      const nextOptions = [];
      if (!exploredTopics.has("chat1")) nextOptions.push("Tell me about the chat component itself");
      if (!exploredTopics.has("chat2")) nextOptions.push("How does this work in Make mode?");
      if (nextOptions.length < 2 && !exploredTopics.has("access")) nextOptions.push("Can I pin these chips?");
      if (nextOptions.length === 0) nextOptions.push("What else is there?");
      
      return {
        id: Date.now().toString(),
        content: `**Chat Design 3: Moving Items to Chat**\n\nDrag & drop or attach items (images, docs, code) and they become context chips below the input.\n\n**What it does:**\n• Items show as removable chips\n• AI uses them as context for responses\n• Works in both Ask and Make modes\n• Persists across the conversation\n\n**Why chips?** Claude-style design - clear, removable, visual feedback that context is active.\n\n**The architectural win:**\nBy keeping context *with* the chat, you don't need:\n• Sidebar panels for files\n• Dedicated document viewers\n• Context switchers in the nav\n\n**This frees up the UI.** For example, having docs with the chat means we can completely re-do the top nav without worrying about context management. The chat is self-contained.\n\n${remainingTopics > 0 ? `🔍 ${remainingTopics} topic${remainingTopics > 1 ? 's' : ''} left to discover!` : '🏆 Full tour complete!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Onboarding
    if (userText === "Tell me about Onboarding") {
      const nextOptions = [];
      if (!exploredTopics.has("chat1")) nextOptions.push("How does the chat support this?");
      if (!exploredTopics.has("chat3")) nextOptions.push("Can I attach files during onboarding?");
      if (!exploredTopics.has("ia")) nextOptions.push("How does onboarding fit the IA?");
      if (nextOptions.length === 0) nextOptions.push("Continue exploring");
      
      return {
        id: Date.now().toString(),
        content: `**Onboarding: Integrations & Quick Start**\n\nOnboarding happens *inside the chat* - no separate screens.\n\n**Integrations:**\n• Salesforce auth flow happens in modals\n• Quick start questions guide setup\n• "Tell me about X" prompts for learning\n• Everything accessible from the + menu\n\n**Why in-chat?** Reduces friction. Users learn by doing, not by reading docs. The AI guides them through setup conversationally.\n\n${remainingTopics > 0 ? `📚 ${remainingTopics} more insight${remainingTopics > 1 ? 's' : ''} available!` : '🎓 You\'re a Copado expert now!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Access w/o Overbuilding
    if (userText === "Tell me about Access w/o overbuilding") {
      const nextOptions = [];
      if (!exploredTopics.has("chat3")) nextOptions.push("What about those context chips?");
      if (!exploredTopics.has("ia")) nextOptions.push("Where do pins show up?");
      if (!exploredTopics.has("chat1")) nextOptions.push("Can I pin from anywhere?");
      if (nextOptions.length === 0) nextOptions.push("Keep learning");
      
      return {
        id: Date.now().toString(),
        content: `**Access w/o Overbuilding: Use Pins**\n\nPins are the secret weapon for recapture without building complex features.\n\n**Pin anything:**\n• A specific chat message (the answer you need)\n• An artifact (code, document)\n• An instruction or template\n\n**Why it works:**\n• No folders, no complex organization\n• Fast recapture via Pinned tab\n• Works across the entire app\n• Simple mental model: "I'll need this later" → Pin it\n\nPins = bookmarks done right.\n\n${remainingTopics > 0 ? `💎 ${remainingTopics} gem${remainingTopics > 1 ? 's' : ''} still hidden!` : '💯 Perfect score!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Information Architecture
    if (userText === "Tell me about Information Architecture") {
      const nextOptions = [];
      if (!exploredTopics.has("chat2")) nextOptions.push("How does Make mode follow this?");
      if (!exploredTopics.has("chat1")) nextOptions.push("Does the chat fit this pattern?");
      if (!exploredTopics.has("onboarding")) nextOptions.push("How does onboarding use this?");
      if (nextOptions.length === 0) nextOptions.push("See what's left");
      
      return {
        id: Date.now().toString(),
        content: `**Information Architecture: All Work the Same**\n\nWorkspaces, templates, quick actions - they all use the same structure.\n\n**Why consistency?**\n• Same left/right panel layout\n• Same nav pattern (back, title, actions)\n• Same tabs (Highlights, Code/Preview, Artifacts)\n• Reduces cognitive load\n\n**The benefit?** Learn it once, use it everywhere. Whether you're analyzing, deploying, or learning - the interface feels familiar.\n\nConsistency = speed.\n\n${remainingTopics > 0 ? `🎯 ${remainingTopics} concept${remainingTopics > 1 ? 's' : ''} remaining!` : '🌟 Journey complete!'}`,
        isUser: false,
        timestamp: new Date(),
        options: nextOptions
      };
    }

    // Bridging questions - dynamically route to related topics
    if (userText === "How does moving items work with this?" || userText === "What about those context chips?") {
      return meganConversation.handleResponse!("Tell me about Chat Design 3", currentMessages, _context, _isAuthenticated);
    }
    
    if (userText === "How does this fit the overall IA?" || userText === "Does Make mode fit the IA pattern?" || 
        userText === "Where do pins show up?" || userText === "How does onboarding fit the IA?") {
      return meganConversation.handleResponse!("Tell me about Information Architecture", currentMessages, _context, _isAuthenticated);
    }
    
    if (userText === "How is onboarding integrated?" || userText === "How does the chat support this?" || 
        userText === "How does onboarding use this?") {
      return meganConversation.handleResponse!("Tell me about Onboarding", currentMessages, _context, _isAuthenticated);
    }
    
    if (userText === "How is this chat component designed?" || userText === "Tell me about the chat component itself" || 
        userText === "Does the chat fit this pattern?" || userText === "Can I pin from anywhere?") {
      return meganConversation.handleResponse!("Tell me about Chat Design 1", currentMessages, _context, _isAuthenticated);
    }
    
    if (userText === "How does this work in Make mode?" || userText === "How does Make mode follow this?" || 
        userText === "Can I pin things from Make mode?") {
      return meganConversation.handleResponse!("Tell me about Chat Design 2", currentMessages, _context, _isAuthenticated);
    }
    
    if (userText === "Can I pin these chips?" || userText === "Can I attach files during onboarding?") {
      return meganConversation.handleResponse!("Tell me about Access w/o overbuilding", currentMessages, _context, _isAuthenticated);
    }

    // Generic navigation prompts
    if (userText === "Explore another topic" || userText === "Show me something else" || userText === "What else is there?" ||
        userText === "Continue exploring" || userText === "Keep learning" || userText === "See what's left") {
      const unexplored = [];
      if (!exploredTopics.has("chat1")) unexplored.push("Chat Design 1");
      if (!exploredTopics.has("chat2")) unexplored.push("Chat Design 2: Make Mode");
      if (!exploredTopics.has("chat3")) unexplored.push("Chat Design 3: Moving Items");
      if (!exploredTopics.has("onboarding")) unexplored.push("Onboarding");
      if (!exploredTopics.has("access")) unexplored.push("Access w/o Overbuilding");
      if (!exploredTopics.has("ia")) unexplored.push("Information Architecture");
      
      if (unexplored.length > 0) {
        return {
          id: Date.now().toString(),
          content: `Check out these unexplored topics in the highlights:\n\n${unexplored.map(t => `• ${t}`).join('\n')}\n\nClick any one to continue your journey! 🗺️`,
          isUser: false,
          timestamp: new Date()
        };
      } else {
        return {
          id: Date.now().toString(),
          content: "🎉 You've explored everything! You now have a complete understanding of Megan's design decisions. Feel free to revisit any topic from the highlights!",
          isUser: false,
          timestamp: new Date()
        };
      }
    }
    
    // Default response for other inputs
    return {
      id: Date.now().toString(),
      content: `${exploredTopics.size > 0 ? '👀 ' : ''}Pick any topic from the highlights on the right to explore! ${remainingTopics > 0 ? `${remainingTopics} topic${remainingTopics > 1 ? 's' : ''} waiting for you.` : 'Or revisit any you\'ve seen!'}`,
      isUser: false,
      timestamp: new Date()
    };
  }
};

