import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  time: string;
}

interface WorkItem {
  stepNumber: number;
  title: string;
  content: string;
}

interface ProjectPageProps {
  projectTitle: string;
  projectDate: string;
  onBack: () => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({
  projectTitle,
  projectDate,
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'AI Assistant',
      text: `I understand you want to create ${projectTitle}. I've analyzed your requirements and created a comprehensive plan. Here's what we'll build:`,
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('progress');
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [workItemPreview, setWorkItemPreview] = useState<WorkItem | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputValue,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadWorkItem = (item: WorkItem) => {
    setWorkItemPreview(item);
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <header className="min-h-16 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{projectTitle}</h1>
          <span className="text-sm text-gray-500">{projectDate}</span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 bg-white rounded-md text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 bg-white rounded-md text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            <span className="hidden sm:inline">Duplicate</span>
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`px-4 py-2 border border-gray-200 bg-white rounded-md text-sm hover:bg-gray-50 transition-all flex items-center gap-2 ${
              isFavorite ? 'text-amber-500' : ''
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <span className="hidden sm:inline">Favorite</span>
          </button>
        </div>
      </header>

      {/* Main Container - Split View */}
      <div className={`flex flex-1 overflow-hidden transition-all duration-300 ${isChatCollapsed ? 'grid-cols-[0fr_1fr]' : 'grid-cols-[1fr_3fr]'}`} style={{ display: 'grid' }}>
        {/* Left Section - Chat (1/4 width) */}
        <section className={`relative border-r border-gray-200 flex flex-col bg-gray-50 overflow-hidden transition-all duration-300 ${isChatCollapsed ? 'w-0 border-0' : ''}`}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsChatCollapsed(!isChatCollapsed)}
            className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-5 h-16 bg-blue-600 text-white flex items-center justify-center rounded-r z-10 hover:bg-blue-700 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d={isChatCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="px-6 py-5 bg-white border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              💬 Modify Your Work
            </h2>
            <p className="text-xs text-gray-600 mt-1">Chat with AI to make changes to your project</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Work Item Preview */}
            {workItemPreview && (
              <div className="bg-white border-2 border-blue-600 rounded-lg p-4 mb-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                      {workItemPreview.stepNumber}
                    </span>
                    {workItemPreview.title}
                  </h3>
                  <button
                    onClick={() => setWorkItemPreview(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{workItemPreview.content}</p>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div key={message.id} className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
                    message.isUser ? 'bg-blue-600' : 'bg-indigo-600'
                  }`}>
                    {message.isUser ? 'U' : '🤖'}
                  </div>
                  <span className="text-xs font-medium text-gray-900">{message.sender}</span>
                  <span className="text-xs text-gray-400">{message.time}</span>
                </div>
                <div className="pl-9">
                  <p className="text-sm text-gray-700 leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your modification request..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none outline-none focus:border-blue-500 transition-all"
              rows={3}
            />
          </div>
        </section>

        {/* Right Section (3/4 width) */}
        <section className="flex flex-col bg-white overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex px-6 overflow-x-auto">
              {[
                { id: 'progress', label: 'In Progress' },
                { id: 'steps', label: 'Suggested Steps' },
                { id: 'code', label: 'View Code' },
                { id: 'artifacts', label: 'All Artifacts' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'progress' && (
              <div>
                {/* Action Items Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                    <span className="text-blue-600">📋</span>
                    <span className="font-semibold text-gray-900">Action Items</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-blue-600 text-lg">🎯</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Business Goal</div>
                        <div className="text-xs text-gray-600 mt-1">Create {projectTitle}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-indigo-600 text-lg">🤖</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">AI Generated Plan</div>
                        <div className="text-xs text-gray-600 mt-1">Implementation plan created • Development in progress</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-600 text-lg">📄</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">Active Components</div>
                        <div className="text-xs text-gray-600 mt-1">Building your project structure and components</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-1">✓</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Current Modifications</h3>
                      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
AI-Generated Implementation Status:

<strong>Phase 1: Project Setup</strong> (In Progress)
• ✅ Created project structure
• ✅ Set up development environment
• 🔄 Implementing core functionality

<strong>Current Activity:</strong>
• Generating project components
• Building feature modules
• Creating documentation

Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

The AI is actively building your project. All generated code, components, and documentation appear in the respective tabs as they're created.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-3">
                {[
                  { num: 1, title: 'Set up Core Infrastructure', desc: 'Foundation and basic structure • 70% Complete', content: 'Create the foundational structure with database models, API endpoints, and basic functionality.' },
                  { num: 2, title: 'Build Main Features', desc: 'Core functionality implementation • 45% Complete', content: 'Develop the primary features and user-facing components.' },
                  { num: 3, title: 'Integration Setup', desc: 'Connect external services • 20% Complete', content: 'Set up integrations with third-party APIs and services.' },
                  { num: 4, title: 'Testing & QA', desc: 'Comprehensive testing • Not Started', content: 'Write tests and ensure quality across all components.' },
                  { num: 5, title: 'Deployment', desc: 'Production deployment • Not Started', content: 'Deploy to production environment and monitor performance.' },
                ].map((step) => (
                  <button
                    key={step.num}
                    onClick={() => loadWorkItem({ stepNumber: step.num, title: step.title, content: step.content })}
                    className="w-full text-left p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-1">
                        {step.num}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{step.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{step.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'code' && (
              <div>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-5 font-mono text-xs leading-relaxed overflow-x-auto mb-4">
                  <div className="text-green-400">// Your project code will appear here</div>
                  <div className="text-gray-400">// As the AI generates components and modules</div>
                  <div className="mt-4">
                    <span className="text-purple-400">function</span> <span className="text-yellow-300">initializeProject</span>() {'{'}
                  </div>
                  <div className="pl-4 text-gray-300">
                    <span className="text-purple-400">const</span> project = <span className="text-orange-400">"{projectTitle}"</span>;
                  </div>
                  <div className="pl-4 text-gray-300">
                    console.<span className="text-blue-400">log</span>(<span className="text-orange-400">"Setting up project..."</span>);
                  </div>
                  <div>{'}'}</div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>Last scanned: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-gray-400">•</span>
                    <span>Found <span className="text-green-600 font-medium">0</span> errors</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'artifacts' && (
              <div className="space-y-3">
                {[
                  { name: 'Project Setup', type: 'Configuration', time: '5 mins ago' },
                  { name: 'Component Library', type: 'React Components', time: '10 mins ago' },
                  { name: 'API Documentation', type: 'Markdown', time: '15 mins ago' },
                  { name: 'Style Guide', type: 'CSS', time: '20 mins ago' },
                ].map((artifact, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{artifact.name}</div>
                      <div className="text-xs text-gray-600">{artifact.type} • {artifact.time}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-white transition-all">
                        Apply
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectPage;
