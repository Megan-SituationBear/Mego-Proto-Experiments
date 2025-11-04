// Shared types for conversations

export interface ConversationMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];
}

export interface ConversationConfig {
  // Initial messages to display when conversation starts
  initialMessages: ConversationMessage[];
  
  // Handler for user responses - returns new AI message(s) to add
  handleResponse?: (
    userText: string, 
    currentMessages: ConversationMessage[]
  ) => ConversationMessage | ConversationMessage[] | null;
  
  // Quick actions to show (optional)
  quickActions?: string[];
  
  // Conversation metadata
  metadata?: {
    topic: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category?: 'strategy' | 'technical' | 'analysis' | 'code' | 'general';
  };
}

export type ConversationHandler = (
  userText: string,
  currentMessages: ConversationMessage[]
) => ConversationMessage | ConversationMessage[] | null;

