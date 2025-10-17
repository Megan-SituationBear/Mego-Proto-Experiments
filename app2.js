import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Plus, Settings, ChevronDown
} from 'lucide-react';

// AI Input Component - The Star of the Show
const AIInput = ({ onSubmit, placeholder = "Try: @Copado what do you do? Or, @project Let's Go!", autoFocus = false, hasMessages = false }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && (isFocused || hasBeenFocused)) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300); // Max height of 300px
      textarea.style.height = Math.max(newHeight, 100) + 'px'; // Min expanded height of 100px
    } else if (textarea && !hasBeenFocused) {
      textarea.style.height = '36px'; // Compact height
    }
  }, [value, isFocused, hasBeenFocused]);

  // Keep expanded when there are messages
  useEffect(() => {
    if (hasMessages && !hasBeenFocused) {
      setHasBeenFocused(true);
    }
  }, [hasMessages, hasBeenFocused]);

  // Autofocus on mount if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value);
      setValue('');
      // Don't collapse if there are messages (conversation is ongoing)
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasBeenFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Keep expanded if there's content or if there are messages
    if (!value.trim() && !hasMessages) {
      setHasBeenFocused(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`relative bg-white rounded-2xl transition-all duration-500 ease-out transform ${
        isFocused 
          ? 'border-2 border-blue-500 shadow-2xl ring-4 ring-blue-100' 
          : hasBeenFocused
            ? 'border-2 border-gray-200 shadow-lg hover:border-gray-300 hover:shadow-xl'
            : 'border border-gray-200 shadow-md hover:border-gray-300 hover:shadow-lg'
      }`}>
        <div className={`flex items-start transition-all duration-500 ${hasBeenFocused ? 'p-3' : 'p-2'}`}>
          {/* Left action buttons */}
          <div className={`flex items-center gap-1 pl-1 transition-all duration-500 ${hasBeenFocused ? 'pt-3' : 'pt-0'}`}>
            <button 
              className={`hover:bg-gray-100 rounded-lg transition-all duration-300 ${hasBeenFocused ? 'p-2.5' : 'p-2'}`}
              title="Add attachment"
            >
              <Plus className={`text-gray-600 transition-all duration-300 ${hasBeenFocused ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </button>
            <button 
              className={`hover:bg-gray-100 rounded-lg transition-all duration-300 ${hasBeenFocused ? 'p-2.5' : 'p-2'}`}
              title="Settings"
            >
              <Settings className={`text-gray-600 transition-all duration-300 ${hasBeenFocused ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </button>
          </div>

          {/* Textarea that grows */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={hasBeenFocused ? placeholder : "Ask Copado anything..."}
            className={`flex-1 px-4 bg-transparent outline-none resize-none font-body transition-all duration-500 ${
              value ? 'text-slate-900' : 'text-gray-400'
            } ${isFocused ? 'placeholder-gray-500' : 'placeholder-gray-400'} ${!hasBeenFocused ? 'text-center text-sm' : 'text-lg'}`}
            style={{
              paddingTop: hasBeenFocused ? '20px' : '8px',
              paddingBottom: hasBeenFocused ? '20px' : '8px',
              height: hasBeenFocused ? '100px' : '36px',
              lineHeight: hasBeenFocused ? '1.5' : '1.25',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            rows="1"
          />

          {/* Send button */}
          <div className={`transition-all duration-500 ${hasBeenFocused ? 'pt-3' : 'pt-0'}`}>
            <button 
              onClick={handleSubmit}
              disabled={!value.trim()}
              className={`mr-2 rounded-xl transition-all duration-300 ${
                value.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${hasBeenFocused ? 'p-3.5' : 'p-2.5'}`}
              title="Send message"
            >
              <Send className={`transition-all duration-300 ${hasBeenFocused ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </button>
          </div>
        </div>

        {/* Character count for long messages */}
        {value.length > 200 && (
          <div className="px-6 pb-2 text-xs text-gray-500 font-body">
            {value.length} characters
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInputCount, setUserInputCount] = useState(0);
  const [showWorkspaceLink, setShowWorkspaceLink] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [workspaceId] = useState(() => `ws-${Math.random().toString(36).substr(2, 9)}`);
  const [isAIThinking, setIsAIThinking] = useState(false);

  // Add global font styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
      
      * {
        font-family: 'Inter', sans-serif;
      }
      
      h1, h2, h3, h4, h5, h6, .font-heading {
        font-family: 'Roboto', sans-serif;
        letter-spacing: -0.03em;
      }
      
      body, p, span, a, button, input, textarea, .font-body {
        font-family: 'Inter', sans-serif;
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // AI Response generator - contextual based on user input
  const getAIResponse = (userMessage, inputCount) => {
    // Analyze user message for context
    const message = userMessage.toLowerCase();
    
    if (inputCount === 1) {
      if (message.includes('copado')) {
        return "Copado helps you ship Salesforce updates 10x faster with AI-powered DevOps. What part of your release process takes the most time?";
      } else if (message.includes('deploy') || message.includes('build')) {
        return "I can help optimize your deployment pipeline. What's your current build time, and what technology stack are you using?";
      } else if (message.includes('test') || message.includes('quality')) {
        return "Testing is crucial for quality. Are you looking to automate your test suite or improve test coverage?";
      } else if (message.includes('salesforce')) {
        return "Salesforce development has unique challenges. What specific part of your Salesforce workflow needs the most attention?";
      } else if (message.includes('@project')) {
        return "Let's set up a project for you! What's the main goal you're trying to achieve with your Salesforce implementation?";
      } else {
        return "That's interesting! Can you tell me more about your specific use case and what you're trying to achieve?";
      }
    } else {
      return "This looks serious. Making a workspace so we can focus on the output...";
    }
  };

  const handleSendMessage = (value) => {
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: value,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setUserInputCount(prev => prev + 1);
    setIsAIThinking(true);

    // Add AI response after a short delay
    setTimeout(() => {
      const aiResponseText = getAIResponse(value, userInputCount + 1);
      const newAIMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newAIMessage]);
      setIsAIThinking(false);

      // Show workspace link after 3rd input
      if (userInputCount + 1 === 3) {
        setTimeout(() => {
          setShowWorkspaceLink(true);
        }, 1000);
      }
    }, 1200);
  };

  const templates = [
    {
      category: "Smooth Deployment",
      title: "Analyze, Fix & Automate Your Builds Before Deploying",
      categoryColor: "bg-amber-100 text-amber-700"
    },
    {
      category: "Strategy & Planning",
      title: "Analyze, Fix & Automate Your Builds Before Deploying",
      categoryColor: "bg-purple-100 text-purple-700"
    },
    {
      category: "Develop And Deploy",
      title: "Analyze, Fix & Automate Your Builds Before Deploying",
      categoryColor: "bg-amber-100 text-amber-700"
    }
  ];

  // Workspace Page Component
  if (currentPage === 'workspace') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setCurrentPage('landing');
                    // Reset conversation for fresh start
                    setMessages([]);
                    setUserInputCount(0);
                    setShowWorkspaceLink(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronDown className="w-5 h-5 text-gray-600 -rotate-90" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-slate-950 font-heading">Your Workspace</span>
                  <span className="text-sm text-gray-500 font-body">ID: {workspaceId}</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-body">
                Sign Up to Save
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-slate-950 mb-4 font-heading">
              Welcome to Your Workspace! 🚀
            </h1>
            <p className="text-lg text-slate-600 mb-6 font-body">
              This is your dedicated space to work on optimizing your Salesforce processes. 
              Everything we discussed is saved here.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <p className="text-blue-900 font-medium mb-2">Ready to continue?</p>
              <p className="text-blue-700">Sign up now to save your progress and unlock all features.</p>
            </div>
          </div>

          {/* Show conversation history */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-slate-950 mb-4 font-heading">Our Conversation</h3>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-slate-800'
                  }`}>
                    <p className="font-body">{msg.text}</p>
                    <span className={`text-xs mt-2 block ${
                      msg.isUser ? 'text-blue-200' : 'text-gray-500'
                    }`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-16 gap-3">
            <button className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-body">
              Login
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-body">
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section - Full Viewport Height with proper spacing */}
      <section className="min-h-screen h-screen md:h-auto md:min-h-screen flex flex-col justify-center px-4 relative">
        <div className="max-w-6xl mx-auto text-center w-full">
          {/* Content wrapper with negative margin to keep centered when input grows */}
          <div className={`${messages.length > 2 ? '-mt-24' : messages.length > 0 ? '-mt-20' : '-mt-16'} transition-all duration-500`}>
            {/* Infinity Logo */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Headlines */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-slate-950 mb-4 md:mb-6 font-heading leading-tight">
              Supercharge Salesforce <span className="text-blue-600">Work</span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 font-body max-w-3xl mx-auto px-4 transition-all duration-500 ${messages.length > 0 ? 'mb-6 md:mb-8' : 'mb-10 md:mb-16'}`}>
              Speed Up Everyday Work, Without Sacrificing Quality
            </p>

            {/* AI Input Component */}
            <div className={`w-full max-w-4xl mx-auto px-2 sm:px-0 transition-all duration-500 ${messages.length > 0 ? 'mb-4' : 'mb-8 md:mb-12'}`}>
              <div className="relative" style={{ minHeight: '60px' }}>
                <AIInput 
                  placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
                  onSubmit={handleSendMessage}
                  autoFocus={false}
                  hasMessages={messages.length > 0}
                />
              </div>
              
              {/* Integrated Conversation - Part of the same component */}
              {messages.length > 0 && (
                <div 
                  className="mt-4 space-y-3 max-h-[320px] overflow-y-auto px-3 py-4 rounded-2xl border border-gray-200/50 transition-all duration-500 ease-out"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.3)', 
                    backdropFilter: 'blur(10px)',
                    animation: 'slideDown 0.5s ease-out'
                  }}
                >
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-left ${
                        msg.isUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white/90 border border-gray-200 text-slate-800 shadow-sm'
                      } transition-all duration-500 ease-out`}>
                        <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* AI Thinking Indicator */}
                  {isAIThinking && (
                    <div className="flex justify-start">
                      <div className="bg-white/90 border border-gray-200 shadow-sm px-4 py-2.5 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Workspace Link - Shows after 3 inputs */}
                  {showWorkspaceLink && (
                    <div className="flex justify-center pt-2 transition-all duration-500 ease-out">
                      <button
                        onClick={() => setCurrentPage('workspace')}
                        className="group bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          Open Your Workspace 
                          <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Version info */}
            <div className="text-xs sm:text-sm text-gray-600 font-body">
              Version number 34910. 
              <a href="#" className="text-blue-600 hover:underline ml-2">Documentation</a>
              <a href="#" className="text-blue-600 hover:underline ml-2">Learning Videos</a>
            </div>
          </div>
        </div>

        {/* Animated Floating Arrow with Text - Hide when conversation starts */}
        {messages.length === 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-xs sm:text-sm text-gray-500 font-body mb-2">cool things to do</p>
            <div className="animate-bounce">
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto" />
            </div>
          </div>
        )}
      </section>

      {/* Conversation Section - Shows after first message */}
      {messages.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-slate-800'
                  } transition-all duration-500 ease-out`}>
                    <p className="font-body">{msg.text}</p>
                    <span className={`text-xs mt-2 block ${
                      msg.isUser ? 'text-blue-200' : 'text-gray-500'
                    }`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* AI Thinking Indicator */}
              {isAIThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workspace Link - Shows after 3 inputs */}
              {showWorkspaceLink && (
                <div className="flex justify-center transition-all duration-500 ease-out">
                  <button
                    onClick={() => setCurrentPage('workspace')}
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-2">
                      Open Your Workspace 
                      <ChevronDown className="w-5 h-5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Quick Start Templates Section */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-gray-400 uppercase tracking-wide text-sm font-body mb-2">
              COPY. MODIFY. LEARN
            </p>
            <h2 className="text-4xl font-bold text-white font-heading">
              Quick Start Templates
            </h2>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {templates.map((template, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-body ${template.categoryColor}`}>
                    {template.category}
                  </span>
                  <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 leading-snug font-heading">
                  {template.title}
                </h3>
              </div>
            ))}
          </div>

          {/* View Full Library Button */}
          <div className="text-center">
            <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors font-body">
              View Full Library
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm font-body mb-2">
            Copyright Copaco 2025-2029{' '}
            <a href="#" className="text-blue-500 hover:underline">View Documentation</a>
          </p>
          <a href="#" className="text-blue-500 hover:underline text-sm font-body">
            Enterprise Inquiries
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;