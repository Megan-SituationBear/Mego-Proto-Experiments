// Central export for all conversations
export { meganConversation } from './meganConversation';
export { copadoTodayConversation } from './copadoTodayConversation';
export { copadoCanDoConversation } from './copadoCanDoConversation';
export { riskAnalysisConversation } from './riskAnalysisConversation';
export { roadmapConversation } from './roadmapConversation';
export { technicalConversation } from './technicalConversation';
export { codeConversation } from './codeConversation';

export type { ConversationConfig, ConversationMessage, ConversationHandler } from './types';

// Map workspace titles to conversations for easy lookup
export const conversationMap: Record<string, any> = {
  "What did Megan do?": () => import('./meganConversation').then(m => m.meganConversation),
  "What can Copado do?": () => import('./copadoCanDoConversation').then(m => m.copadoCanDoConversation),
  "What can Copado do for me today?": () => import('./copadoTodayConversation').then(m => m.copadoTodayConversation),
  "Analyze users for risk and deprecate": () => import('./riskAnalysisConversation').then(m => m.riskAnalysisConversation),
  "Strategize roadmap": () => import('./roadmapConversation').then(m => m.roadmapConversation),
  // Add more mappings as needed
};

