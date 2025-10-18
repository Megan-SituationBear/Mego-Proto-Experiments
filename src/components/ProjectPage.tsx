import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  isCopado: boolean;
  time: string;
  type?: 'text' | 'question' | 'loading';
  options?: string[];
  selectedOptions?: string[];
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
      sender: 'Copado AI',
      text: 'Building out your project',
      isCopado: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'loading',
    },
    {
      id: '2',
      sender: 'Copado AI',
      text: "Let's get a little more information to do this right.",
      isCopado: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    },
    {
      id: '3',
      sender: 'Copado AI',
      text: 'How do you want somebody to use this scheduling app?',
      isCopado: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'question',
      options: ['On phone', 'Schedule appointment', 'Receive emails', 'Use LDS'],
      selectedOptions: [],
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTabs, setShowTabs] = useState(false);
  const [activeTab, setActiveTab] = useState('Steps');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tabs = ['Steps', 'Code', 'Documentation'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputValue,
      isCopado: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Reset textarea height
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const toggleOption = (messageId: string, option: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId && msg.type === 'question') {
        const selectedOptions = msg.selectedOptions || [];
        const newSelectedOptions = selectedOptions.includes(option)
          ? selectedOptions.filter(o => o !== option)
          : [...selectedOptions, option];
        return { ...msg, selectedOptions: newSelectedOptions };
      }
      return msg;
    }));
  };

  const getOptionIcon = (option: string) => {
    const icons: { [key: string]: string } = {
      'On phone': '📱',
      'Schedule appointment': '📅',
      'Receive emails': '✉️',
      'Use LDS': '☁️',
    };
    return icons[option] || '•';
  };

  return (
    <div className="flex flex-col h-screen bg-white">
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
            <span>Share</span>
          </button>
          <button className="px-4 py-2 border border-gray-200 bg-white rounded-md text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            <span>Duplicate</span>
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
            <span>Favorite</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Chat Input at Top */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            rows={1}
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Tabs (show when needed) */}
        {showTabs && (
          <div className="bg-white border-b border-gray-200">
            <div className="flex px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl mx-auto w-full">
          {messages.map((message) => (
            <div key={message.id} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    message.isCopado ? 'bg-indigo-600' : 'bg-blue-600'
                  }`}
                >
                  {message.isCopado ? '🤖' : 'U'}
                </div>
                <span className="text-sm font-semibold text-gray-900">{message.sender}</span>
                <span className="text-xs text-gray-400">{message.time}</span>
              </div>
              <div className="pl-10">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {message.text}
                  {message.type === 'loading' && (
                    <span className="inline-flex gap-1 ml-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </span>
                  )}
                </p>
                {message.type === 'question' && message.options && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 mt-2 mb-3">
                      Question: Click all that apply to your project
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {message.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleOption(message.id, option)}
                          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                            message.selectedOptions?.includes(option)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <span>{getOptionIcon(option)}</span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Next Action (Fixed at bottom) */}
        <div className="bg-white border-t border-gray-200 px-6 py-5 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center gap-4 px-4 py-4 bg-blue-50 border border-blue-300 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                <line x1="6" y1="6" x2="6.01" y2="6"/>
                <line x1="6" y1="18" x2="6.01" y2="18"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 mb-0.5">Set up your sandbox</div>
              <div className="text-xs text-gray-600">Connect to your development environment to start building</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all">
              Set Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
