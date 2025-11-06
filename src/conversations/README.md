# Conversation System Documentation

## Overview

The conversation system allows you to create rich, interactive AI conversations with:
- Multiple choice options
- Sequential steps with requirements
- Artifact generation (code, documents, Salesforce items)
- Context tracking (uploaded files, connected orgs)
- Authentication gates for guest users
- Agent personalities

## File Structure

```
conversations/
├── types.ts                      # TypeScript interfaces
├── index.ts                      # Central exports
├── README.md                     # This file
├── meganConversation.ts          # Example: Team progress review (Auth required)
├── copadoTodayConversation.ts    # Example: Getting started (Guest mode with gate)
├── riskAnalysisConversation.ts   # Example: Risk analysis (Auth required)
├── roadmapConversation.ts        # Example: Strategic planning (Guest mode with gate)
├── technicalConversation.ts      # Example: Technical help (Auth required)
└── codeConversation.ts           # Example: Code generation (Guest mode with gate)
```

## Core Types

### ConversationMessage
Each message in the conversation:
```typescript
{
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];              // Multiple choice buttons
  requiresAction?: boolean;        // Blocks progress until action
  actionType?: 'upload' | 'connect' | 'select' | 'configure';
}
```

### ConversationStep
Sequential workflow steps:
```typescript
{
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  requirements?: string[];         // What needs to be done
  nextStep?: string;               // ID of next step
}
```

### ConversationArtifact
Generated outputs:
```typescript
{
  id: string;
  type: 'code' | 'document' | 'salesforce-work-item' | 'user-story' | 'deployment-plan';
  title: string;
  theme?: string;
  bodyContent: string;
  language?: string;               // For code artifacts
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
```

### ConversationContext
Files and connections:
```typescript
{
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
```

## Authentication Patterns

### Pattern 1: Fully Open (No Auth Required)
```typescript
authentication: {
  required: false,
  guestMode: true,
  // No gate - fully accessible
}
```

### Pattern 2: Try Before Login (Guest Mode with Gate)
```typescript
authentication: {
  required: false,
  guestMode: true,
  gateAfterMessages: 3,           // Show auth prompt after 3 AI messages
  gateMessage: "To continue and save your work, please sign in...",
  limitedFeatures: ['Save artifacts', 'Export', 'Share']
}
```

### Pattern 3: Auth Required (No Guest Access)
```typescript
authentication: {
  required: true,
  guestMode: false,
  gateMessage: "Please sign in to access this feature."
}
```

## Creating a New Conversation

### 1. Create the File
```typescript
// src/conversations/myConversation.ts
import { ConversationConfig } from './types';

export const myConversation: ConversationConfig = {
  // Core details
  title: "My Conversation Title",
  theme: "Category/Theme",
  agent: {
    name: "Assistant Name",
    role: "Salesforce Expert", // or other role
    personality: "Helpful and friendly"
  },
  
  // Dates
  dateCreated: new Date('2024-11-04'),
  dateModified: new Date('2024-11-04'),
  
  // Authentication
  authentication: {
    required: false,
    guestMode: true,
    gateAfterMessages: 3,
    gateMessage: "Custom auth message...",
    limitedFeatures: ['Feature 1', 'Feature 2']
  },
  
  // Metadata
  metadata: {
    topic: 'Learn',
    difficulty: 'beginner',
    category: 'general',
    estimatedTime: '5 minutes',
    prerequisites: []
  },
  
  // Context & Artifacts
  context: { images: [], documents: [], connectedOrgs: [] },
  artifacts: [],
  
  // Initial messages
  initialMessages: [
    {
      id: '1',
      content: "User's initial message",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: '2',
      content: "AI's response with options",
      isUser: false,
      timestamp: new Date(),
      options: ["Option 1", "Option 2", "Option 3"]
    }
  ],
  
  // Response handler
  handleResponse: (userText, currentMessages, context, isAuthenticated = false) => {
    // Check auth gate
    if (!isAuthenticated) {
      const aiMessageCount = currentMessages.filter(m => !m.isUser).length;
      if (aiMessageCount >= 3) {
        return {
          id: Date.now().toString(),
          content: "Please sign in to continue...",
          isUser: false,
          timestamp: new Date(),
          requiresAction: true,
          actionType: 'connect',
          options: ["Sign In", "Create Account"]
        };
      }
    }
    
    // Your conversation logic
    if (userText === "Option 1") {
      return {
        id: Date.now().toString(),
        content: "Response to Option 1",
        isUser: false,
        timestamp: new Date(),
        options: ["Next option"]
      };
    }
    
    return null; // Default/fallback
  }
};
```

### 2. Export from index.ts
```typescript
export { myConversation } from './myConversation';
```

### 3. Use in WorkspacePage
The WorkspacePage component will automatically load the conversation based on the workspace title.

## Examples

### Guest Mode with Auth Gate
See `copadoTodayConversation.ts` - allows 3 messages before requiring auth.

### Requires Auth
See `meganConversation.ts` - blocks access without authentication.

### With Steps
See `copadoTodayConversation.ts` - shows multi-step workflow.

## Best Practices

1. **Auth Gate Timing**: Set `gateAfterMessages` to 2-4 for best UX
2. **Limited Features**: Be specific about what guests can't do
3. **Clear Messages**: Make gate messages action-oriented
4. **Fallback Logic**: Always return something in `handleResponse`
5. **Context Awareness**: Use `context` parameter to check connected orgs, files
6. **Progressive Disclosure**: Start simple, add options as needed

## Future Enhancements

- [ ] Dynamic step generation based on user choices
- [ ] Artifact preview in chat
- [ ] Multi-agent conversations
- [ ] Conversation templates
- [ ] Auto-save conversation state
- [ ] Conversation branching/forking

