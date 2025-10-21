import type { ConversationMessage } from '../components/Conversation';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const generateAIResponse = (
  userText: string,
  currentUserMessageCount: number
): { message: Message; conversationMessage: ConversationMessage } => {
  const lowerText = userText.toLowerCase();
  
  // Create old format message for ChatPanel
  const oldMessage: Message = {
    id: (Date.now() + 1).toString(),
    text: "",
    isUser: false,
    timestamp: new Date()
  };

  // Create new format message for Conversation component
  const newMessage: ConversationMessage = {
    id: (Date.now() + 1).toString(),
    content: { type: 'text', content: "" },
    isUser: false,
    timestamp: new Date()
  };

  // First message: Ask about the business case
  if (currentUserMessageCount === 1) {
    oldMessage.text = "Tell me about the business case, please. Is it for a customer? Internal? What do you want it to do?";
    newMessage.content = {
      type: 'text',
      content: "Tell me about the business case, please. Is it for a customer? Internal? What do you want it to do?"
    };
    return { message: oldMessage, conversationMessage: newMessage };
  }

  // Second message: Show "Creating workspace..." message
  if (currentUserMessageCount === 2) {
    oldMessage.text = "Perfect! Let me create a workspace for you to dive deeper into this...";
    newMessage.content = {
      type: 'text',
      content: "Perfect! Let me create a workspace for you to dive deeper into this..."
    };
    return { message: oldMessage, conversationMessage: newMessage };
  }

  // Default responses for workspace (after transition)
  if (lowerText.includes('deploy') || lowerText.includes('deployment')) {
    oldMessage.text = "I'll help you create a deployment plan. Here's what we need to do:";
    newMessage.content = {
      type: 'step-by-step',
      content: "Deployment Plan",
      metadata: {
        steps: [
          "Review current org configuration",
          "Run dependency analysis",
          "Create deployment package",
          "Execute pre-deployment tests",
          "Deploy to staging environment"
        ]
      }
    };
  } else if (lowerText.includes('artifact') || lowerText.includes('create')) {
    oldMessage.text = "I've created a deployment artifact for you.";
    newMessage.content = {
      type: 'artifact',
      content: "This artifact includes all the necessary components for your deployment with proper dependency management and metadata.",
      metadata: {
        artifactName: "deployment-artifact-v1.2.zip"
      }
    };
  } else if (lowerText.includes('question') || lowerText.includes('help')) {
    oldMessage.text = "I can help you with several things. What would you like to know more about?";
    newMessage.content = {
      type: 'question',
      content: "I can help you with several things. What would you like to know more about?",
      metadata: {
        steps: [
          "Deployment planning",
          "Org analysis",
          "Best practices",
          "Troubleshooting"
        ]
      }
    };
  } else {
    oldMessage.text = "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?";
    newMessage.content = {
      type: 'text',
      content: "I understand you want to create a plan for your customer. Let me help you build a comprehensive strategy. What's your customer's current Salesforce situation?"
    };
  }

  return { message: oldMessage, conversationMessage: newMessage };
};
