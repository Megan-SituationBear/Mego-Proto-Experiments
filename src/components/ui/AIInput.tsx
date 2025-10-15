import React, { useState, useRef, useEffect } from 'react';

interface Integration {
  name: string;
  icon: string;
  description: string;
}

interface AIInputProps {
  placeholder?: string;
  onSendMessage?: (text: string) => void;
  onUploadImage?: () => void;
  onUploadDoc?: () => void;
  onExamineSlack?: () => void;
  onAddConfluence?: () => void;
  onIntegrationsClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

// Define input states based on user requirements
type InputState = 'default' | 'typing' | 'pasting-file' | 'attached-image' | 'attached-doc' | 'integrated' | 'typing-with-at' | 'loading' | 'error' | 'success';

const AIInput: React.FC<AIInputProps> = ({
  placeholder = "Try: @Copado what do you do? Or, @project Let's Go!",
  onSendMessage,
  onUploadImage,
  onUploadDoc,
  onExamineSlack,
  onAddConfluence,
  onIntegrationsClick,
  className = "",
  disabled = false,
  loading = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [inputState, setInputState] = useState<InputState>('default');
  const [isFocused, setIsFocused] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<File | null>(null);
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [hasAtSymbol, setHasAtSymbol] = useState(false);
  const [isPastingFile, setIsPastingFile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input state based on loading prop
  useEffect(() => {
    if (loading) {
      setInputState('loading');
    } else if (errorMessage) {
      setInputState('error');
    } else if (inputState === 'loading') {
      setInputState('success');
      // Clear success state after a short delay
      setTimeout(() => setInputState('default'), 1000);
    }
  }, [loading, errorMessage]);

  // Check for @ symbol in input text
  useEffect(() => {
    const atSymbolPresent = inputText.includes('@');
    setHasAtSymbol(atSymbolPresent);
  }, [inputText]);

  // Main state management based on current conditions
  useEffect(() => {
    if (loading) {
      setInputState('loading');
      return;
    }
    
    if (errorMessage) {
      setInputState('error');
      return;
    }
    
    if (isPastingFile) {
      setInputState('pasting-file');
      return;
    }
    
    if (attachedImage) {
      setInputState('attached-image');
      return;
    }
    
    if (attachedDoc) {
      setInputState('attached-doc');
      return;
    }
    
    if (activeIntegration) {
      setInputState('integrated');
      return;
    }
    
    if (inputText.length > 0) {
      if (hasAtSymbol) {
        setInputState('typing-with-at');
      } else {
        setInputState('typing');
      }
    } else {
      setInputState('default');
    }
  }, [loading, errorMessage, isPastingFile, attachedImage, attachedDoc, activeIntegration, inputText, hasAtSymbol]);

  // Handle typing state with debounce
  useEffect(() => {
    if (inputText.length > 0 && !isPastingFile && !attachedImage && !attachedDoc && !activeIntegration) {
      setIsTyping(true);
      
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, 500);
      
      setTypingTimeout(timeout);
    } else {
      setIsTyping(false);
    }

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [inputText, isPastingFile, attachedImage, attachedDoc, activeIntegration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && onSendMessage && !disabled && !loading) {
      setInputState('loading');
      setErrorMessage(null);
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputText(value);
    setErrorMessage(null); // Clear error when user starts typing
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    let hasFile = false;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        hasFile = true;
        setIsPastingFile(true);
        
        // Handle file pasting based on type
        if (item.type.startsWith('image/')) {
          setAttachedImage(item.getAsFile());
        } else if (item.type.includes('document') || item.type.includes('text')) {
          setAttachedDoc(item.getAsFile());
        }
        
        // Clear pasting state after a delay
        setTimeout(() => {
          setIsPastingFile(false);
        }, 2000);
        break;
      }
    }
    
    if (!hasFile) {
      setIsPastingFile(false);
    }
  };

  const handleUploadImage = () => {
    if (onUploadImage) {
      onUploadImage();
      setAttachedImage(new File([''], 'uploaded-image.jpg', { type: 'image/jpeg' }));
    }
  };

  const handleUploadDoc = () => {
    if (onUploadDoc) {
      onUploadDoc();
      setAttachedDoc(new File([''], 'uploaded-doc.pdf', { type: 'application/pdf' }));
    }
  };

  const handleExamineSlack = () => {
    if (onExamineSlack) {
      onExamineSlack();
      setActiveIntegration('slack');
    }
  };

  const handleAddConfluence = () => {
    if (onAddConfluence) {
      onAddConfluence();
      setActiveIntegration('confluence');
    }
  };

  const handleIntegrationsClick = () => {
    if (onIntegrationsClick) {
      onIntegrationsClick();
      setActiveIntegration('integrated');
    }
  };

  const removeAttachment = (type: 'image' | 'doc') => {
    if (type === 'image') {
      setAttachedImage(null);
    } else {
      setAttachedDoc(null);
    }
  };

  const clearIntegration = () => {
    setActiveIntegration(null);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowPlusMenu(false); // Close plus menu when input is focused
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handlePlusMenuToggle = () => {
    setShowPlusMenu(!showPlusMenu);
    if (!showPlusMenu) {
      // Close any existing errors when opening menu
      setErrorMessage(null);
    }
  };

  const handleMenuItemClick = (action: () => void) => {
    try {
      action();
      setShowPlusMenu(false);
    } catch (error) {
      setErrorMessage('An error occurred with this action');
      setShowPlusMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowPlusMenu(false);
      setErrorMessage(null);
    }
  };

  // Close plus menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPlusMenu(false);
    };

    if (showPlusMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPlusMenu]);

  // Get dynamic classes based on state
  const getInputBoxClasses = () => {
    const baseClasses = "bg-white rounded-3xl shadow-lg border p-4 md:p-6 transition-all duration-200";
    
    switch (inputState) {
      case 'loading':
        return `${baseClasses} border-blue-300 shadow-blue-100`;
      case 'error':
        return `${baseClasses} border-red-300 shadow-red-100`;
      case 'success':
        return `${baseClasses} border-green-300 shadow-green-100`;
      case 'typing':
        return `${baseClasses} border-blue-200 shadow-blue-50`;
      case 'typing-with-at':
        return `${baseClasses} border-purple-200 shadow-purple-50`;
      case 'pasting-file':
        return `${baseClasses} border-orange-300 shadow-orange-100 animate-pulse`;
      case 'attached-image':
        return `${baseClasses} border-green-300 shadow-green-100`;
      case 'attached-doc':
        return `${baseClasses} border-blue-300 shadow-blue-100`;
      case 'integrated':
        return `${baseClasses} border-indigo-300 shadow-indigo-100`;
      case 'default':
      default:
        return `${baseClasses} border-blue-100/60`;
    }
  };

  const getInputClasses = () => {
    const baseClasses = "w-full text-base md:text-lg py-3 md:py-4 px-4 md:px-6 border-none outline-none bg-transparent text-center focus:ring-0 transition-all duration-200";
    
    if (disabled || loading) {
      return `${baseClasses} text-gray-400 placeholder-gray-300 cursor-not-allowed`;
    }
    
    switch (inputState) {
      case 'error':
        return `${baseClasses} text-red-700 placeholder-red-400`;
      case 'success':
        return `${baseClasses} text-green-700 placeholder-green-400`;
      default:
        return `${baseClasses} text-gray-700 placeholder-gray-400`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Error Message */}
      {errorMessage && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center">
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Main Input Box */}
      <div className={getInputBoxClasses()}>
        <form onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            {/* Attachment indicators */}
            {(attachedImage || attachedDoc || activeIntegration || isPastingFile) && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {isPastingFile && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    <div className="animate-spin rounded-full h-3 w-3 border border-orange-600 border-t-transparent"></div>
                    <span>Pasting file...</span>
                  </div>
                )}
                {attachedImage && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Image</span>
                    <button onClick={() => removeAttachment('image')} className="text-green-600 hover:text-green-800">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {attachedDoc && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Document</span>
                    <button onClick={() => removeAttachment('doc')} className="text-blue-600 hover:text-blue-800">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {activeIntegration && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>{activeIntegration}</span>
                    <button onClick={clearIntegration} className="text-indigo-600 hover:text-indigo-800">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={
                isPastingFile ? "Pasting large file..." :
                attachedImage ? "Image attached - add your message..." :
                attachedDoc ? "Document attached - add your message..." :
                activeIntegration ? "Integration active - add your message..." :
                hasAtSymbol ? "Continue typing with @..." :
                placeholder
              }
              className={`${getInputClasses()} ${(attachedImage || attachedDoc || activeIntegration || isPastingFile) ? 'pl-32' : ''}`}
              disabled={disabled || loading}
            />
            
            {/* @ symbol indicator */}
            {hasAtSymbol && !loading && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xs font-bold">@</span>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && !loading && !hasAtSymbol && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            )}
          </div>
        </form>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
          {/* Left side icons */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Plus Icon */}
            <button
              type="button"
              onClick={handlePlusMenuToggle}
              disabled={disabled || loading}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                disabled || loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              } ${showPlusMenu ? 'bg-gray-50' : ''}`}
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            {/* Grid/App Launcher Icon */}
            <button 
              type="button"
              disabled={disabled || loading}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-300 flex items-center justify-center transition-colors ${
                disabled || loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            
            {/* Salesforce Cloud Logo */}
            <div className="flex items-center">
              <div className={`w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded flex items-center justify-center transition-opacity ${
                disabled || loading ? 'opacity-50' : ''
              }`}>
                <span className="text-white text-xs font-bold">SF</span>
              </div>
            </div>
          </div>

          {/* Right side send button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!inputText.trim() || disabled || loading}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
              inputState === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } ${
              !inputText.trim() || disabled || loading
                ? 'opacity-40 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent"></div>
            ) : inputState === 'success' ? (
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Plus Menu Popover */}
      {showPlusMenu && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <button 
            type="button"
            onClick={() => handleMenuItemClick(handleUploadImage)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700">Upload image</span>
          </button>
          <button 
            type="button"
            onClick={() => handleMenuItemClick(handleUploadDoc)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">Upload doc</span>
          </button>
          <button 
            type="button"
            onClick={() => handleMenuItemClick(handleExamineSlack)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-gray-700">Examine Slack channel</span>
          </button>
          <button 
            type="button"
            onClick={() => handleMenuItemClick(handleAddConfluence)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-gray-700">Add confluence doc</span>
          </button>
          <hr className="my-2 border-gray-100" />
          <button
            type="button"
            onClick={() => handleMenuItemClick(handleIntegrationsClick)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-gray-700">Add integrations</span>
          </button>
        </div>
      )}

      {/* Click outside to close popover */}
      {showPlusMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPlusMenu(false)}
        />
      )}
    </div>
  );
};

export default AIInput;
