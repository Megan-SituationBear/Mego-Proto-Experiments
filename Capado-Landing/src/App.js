import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Plus, Settings, ChevronDown
} from 'lucide-react';

// AI Input Component - The Star of the Show
const AIInput = ({ onSubmit, placeholder = "Try: @Copado what do you do? Or, @project Let's Go!", autoFocus = false }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = newHeight + 'px';
    }
  }, [value]);

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
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full">
      <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 transform ${
        isFocused 
          ? 'border-blue-500 shadow-2xl scale-[1.02] ring-4 ring-blue-100' 
          : 'border-gray-200 shadow-xl hover:border-gray-300 hover:shadow-2xl'
      }`}>
        <div className="flex items-start p-3">
          <div className="flex items-center gap-2 pl-2 pt-3">
            <button 
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Add attachment"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`flex-1 px-4 py-5 text-lg bg-transparent outline-none resize-none font-body transition-all duration-200 ${
              value ? 'text-slate-900' : 'text-gray-400'
            } ${isFocused ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
            style={{
              minHeight: '60px',
              maxHeight: '300px',
              lineHeight: '1.5'
            }}
            rows="1"
          />

          <div className="pt-3">
            <button 
              onClick={handleSubmit}
              disabled={!value.trim()}
              className={`mr-2 p-3.5 rounded-xl transition-all duration-200 ${
                value.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

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

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <section className="min-h-screen h-screen md:h-auto md:min-h-screen flex flex-col justify-center px-4 relative">
        <div className="max-w-6xl mx-auto text-center w-full">
          <div className="-mt-20">
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <svg width="32" height="32" className="md:w-10 md:h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.178 8.00001C16.412 6.23401 13.549 6.23401 11.784 8.00001L12 8.21601L12.216 8.00001C13.982 6.23401 16.845 6.23401 18.611 8.00001C20.377 9.76601 20.377 12.629 18.611 14.394C16.845 16.16 13.982 16.16 12.216 14.394L12 14.178L11.784 14.394C10.018 16.16 7.15497 16.16 5.38897 14.394C3.62297 12.628 3.62297 9.76601 5.38897 8.00001C7.15497 6.23401 10.018 6.23401 11.784 8.00001L12 8.21601L11.784 8.00001C10.018 6.23401 7.15497 6.23401 5.38897 8.00001C3.62297 9.76601 3.62297 12.629 5.38897 14.394C7.15497 16.16 10.018 16.16 11.784 14.394L12 14.178L12.216 14.394C13.982 16.16 16.845 16.16 18.611 14.394C20.377 12.628 20.377 9.76601 18.611 8.00001C16.845 6.23401 13.982 6.23401 12.216 8.00001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-slate-950 mb-4 md:mb-6 font-heading leading-tight">
              Supercharge Salesforce <span className="text-blue-600">Work</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 md:mb-16 font-body max-w-3xl mx-auto px-4">
              Speed Up Everyday Work, Without Sacrificing Quality
            </p>

            <div className="w-full max-w-4xl mx-auto mb-8 md:mb-12 px-2 sm:px-0">
              <AIInput 
                placeholder="Try: @Copado what do you do? Or, @project Let's Go!"
                onSubmit={(value) => console.log('Submitted:', value)}
                autoFocus={true}
              />
            </div>

            <div className="text-xs sm:text-sm text-gray-600 font-body">
              Version number 34910. 
              <a href="#" className="text-blue-600 hover:underline ml-2">Documentation</a>
              <a href="#" className="text-blue-600 hover:underline ml-2">Learning Videos</a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs sm:text-sm text-gray-500 font-body mb-2">cool things to do</p>
          <div className="animate-bounce">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto" />
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 uppercase tracking-wide text-sm font-body mb-2">
              COPY. MODIFY. LEARN
            </p>
            <h2 className="text-4xl font-bold text-white font-heading">
              Quick Start Templates
            </h2>
          </div>

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

          <div className="text-center">
            <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors font-body">
              View Full Library
            </button>
          </div>
        </div>
      </section>

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