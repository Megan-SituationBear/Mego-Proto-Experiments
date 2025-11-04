// Shared types for conversations

export interface ConversationMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[]; // Multiple choice options
  requiresAction?: boolean; // Does user need to complete something to proceed?
  actionType?: 'upload' | 'connect' | 'select' | 'configure'; // Type of action required
}

export interface ConversationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  requirements?: string[]; // What needs to be done to complete this step
  nextStep?: string; // ID of next step
}

export interface ConversationArtifact {
  id: string;
  type: 'code' | 'document' | 'salesforce-work-item' | 'user-story' | 'deployment-plan';
  title: string;
  theme?: string; // Category or theme
  bodyContent: string;
  language?: string; // For code artifacts
  metadata: {
    dateCreated: Date;
    dateModified: Date;
    author?: string;
    version?: string;
  };
  salesforceDetails?: {
    objectType?: string;
    recordId?: string;
    status?: string;
  };
}

export interface ConversationContext {
  images?: Array<{
    id: string;
    url: string;
    filename: string;
    uploadedAt: Date;
  }>;
  documents?: Array<{
    id: string;
    filename: string;
    type: string;
    uploadedAt: Date;
  }>;
  connectedOrgs?: Array<{
    id: string;
    name: string;
    type: 'production' | 'sandbox';
  }>;
}

export interface Agent {
  name: string;
  role: 'Salesforce Expert' | 'Support Ninja' | 'Strategy & Plan Boss' | 'Maker Madman' | 'General Assistant';
  avatar?: string;
  personality?: string;
}

export interface ConversationConfig {
  // Core conversation details
  title: string;
  theme: string; // Topic/category
  agent: Agent;
  
  // Dates
  dateCreated: Date;
  dateModified: Date;
  
  // Initial messages to display when conversation starts
  initialMessages: ConversationMessage[];
  
  // Steps in the conversation flow
  steps?: ConversationStep[];
  
  // Handler for user responses - returns new AI message(s) to add
  handleResponse?: (
    userText: string, 
    currentMessages: ConversationMessage[],
    context?: ConversationContext,
    isAuthenticated?: boolean
  ) => ConversationMessage | ConversationMessage[] | null;
  
  // Artifacts produced during the conversation
  artifacts?: ConversationArtifact[];
  
  // Context (uploaded files, connected systems)
  context?: ConversationContext;
  
  // Quick actions to show (optional)
  quickActions?: string[];
  
  // Authentication settings
  authentication?: {
    required: boolean; // Does this conversation require login?
    guestMode: boolean; // Can guests start this conversation?
    gateAfterMessages?: number; // Show auth gate after N messages (for "try before login" pattern)
    gateMessage?: string; // Custom message to show at auth gate
    limitedFeatures?: string[]; // Features not available to guests
  };
  
  // Conversation metadata
  metadata?: {
    topic: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category?: 'strategy' | 'technical' | 'analysis' | 'code' | 'general';
    estimatedTime?: string; // e.g., "10 minutes"
    prerequisites?: string[];
  };
}

export type ConversationHandler = (
  userText: string,
  currentMessages: ConversationMessage[],
  context?: ConversationContext,
  isAuthenticated?: boolean
) => ConversationMessage | ConversationMessage[] | null;

