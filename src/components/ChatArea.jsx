import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { Send, Sparkles, ArrowDown, HelpCircle, Code, HelpCircle as TableIcon, Menu } from 'lucide-react';

export default function ChatArea({
  conversation,
  onSendMessage,
  isTyping,
  theme,
  onToggleSidebar
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messages = conversation?.messages || [];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle scroll detection to show a floating "Scroll Down" button if user scrolled up
  const handleScroll = () => {
    const element = scrollAreaRef.current;
    if (!element) return;
    
    // If user is scrolled up by more than 300px, show scroll-to-bottom anchor
    const isScrolledUp = element.scrollHeight - element.scrollTop - element.clientHeight > 300;
    setShowScrollDown(isScrolledUp);
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Bento style suggestion prompts
  const suggestionCards = [
    {
      title: "Write QuickSort",
      desc: "Implement a sorting algorithm with an explanation table.",
      icon: <Code className="h-5 w-5 text-zinc-450 dark:text-zinc-300" />,
      prompt: "Write a JavaScript QuickSort function with a markdown table explaining its complexities"
    },
    {
      title: "Compare UI Systems",
      desc: "Compare Material Design, Tailwind, and Shadcn UI frameworks.",
      icon: <TableIcon className="h-5 w-5 text-zinc-450 dark:text-zinc-300" />,
      prompt: "Show a markdown table comparing Material Design, Tailwind, Ant Design, and Shadcn UI"
    },
    {
      title: "Design System Concepts",
      desc: "Explain the trends of Glassmorphism and Neon design.",
      icon: <Sparkles className="h-5 w-5 text-zinc-450 dark:text-zinc-300" />,
      prompt: "Explain the current trends of Glassmorphism and Neon glow design in 2026"
    },
    {
      title: "Showcase System Config",
      desc: "Generate a beautiful JSON block of environment specifications.",
      icon: <HelpCircle className="h-5 w-5 text-zinc-450 dark:text-zinc-300" />,
      prompt: "Write an intellectual response showcasing custom JSON configuration syntax"
    }
  ];

  return (
    <div className="relative flex flex-col flex-1 h-full min-w-0 overflow-hidden">
      
      {/* Sticky Top Header Bar */}
      <div className={`sticky top-0 z-20 flex items-center justify-between h-16 shrink-0 px-4 md:px-8 border-b backdrop-blur-md ${
        theme === 'dark'
          ? 'border-zinc-900 bg-zinc-950/80 text-white'
          : 'border-zinc-200 bg-white/80 text-gray-900'
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger Toggle */}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl md:hidden transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-zinc-900 text-zinc-300'
                : 'hover:bg-zinc-100 text-zinc-800'
            }`}
            title="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col">
            <h3 className="text-sm font-bold truncate max-w-[180px] sm:max-w-[320px]">
              {conversation?.title || 'New Chat'}
            </h3>
            <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase -mt-0.5">
              {conversation?.model || 'gpt-4.1-mini'}
            </span>
          </div>
        </div>
        
        {/* Active status indicator on the right */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="hidden sm:inline">Active Session</span>
        </div>
      </div>

      {/* Scrollable Conversation messages body */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6"
      >
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            /* Welcome / Onboarding Screen if conversation is empty */
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col items-center justify-center min-h-[75%] text-center max-w-2xl mx-auto px-4 py-8"
            >
              {/* Massive pulsating glow orb */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-cyber-glow/10 blur-3xl animate-pulse-glow" />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-zinc-700 to-zinc-400 shadow-neon-purple">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>

              <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-400'
                  : 'bg-gradient-to-r from-zinc-950 to-zinc-700'
              } bg-clip-text text-transparent`}>
                How can I spark your curiosity?
              </h2>
              <p className={`text-sm mt-2.5 mb-8 max-w-md ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'
              }`}>
                Welcome to ChatNova. Supply your API Key in <code className="text-zinc-355 font-mono bg-zinc-900/60 px-1.5 py-0.5 rounded border border-zinc-800">.env</code> to connect live, or run immediate UI simulation tests below.
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {suggestionCards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(card.prompt)}
                    className={`flex items-start gap-3.5 p-4 rounded-xl text-left ${
                      theme === 'dark' ? 'glass-card' : 'glass-card-light'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      theme === 'dark' ? 'bg-zinc-900/60 border border-zinc-800' : 'bg-zinc-150'
                    }`}>
                      {card.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold tracking-tight ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{card.title}</h4>
                      <p className={`text-xs mt-1 leading-normal ${
                        theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'
                      }`}>{card.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Render active message list */
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  theme={theme}
                />
              ))}

              {/* AI Typing Loader Bubble */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 p-5 rounded-2xl border ${
                    theme === 'dark'
                      ? 'bg-zinc-950/45 border-zinc-800/40 shadow-sm'
                      : 'bg-zinc-50 border-zinc-200 shadow-sm'
                  } max-w-3xl mx-auto w-full`}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-tr from-zinc-700 to-zinc-400 shadow-neon-purple text-white">
                    <Sparkles className="w-4.5 h-4.5 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <span className={`text-xs font-semibold tracking-wider uppercase ${
                      theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                      ChatNova is streaming...
                    </span>
                    <div className="flex items-center gap-1.5 py-1.5">
                      <span className={`w-2 h-2 rounded-full typing-dot ${theme === 'dark' ? 'bg-zinc-400' : 'bg-zinc-800'}`} />
                      <span className={`w-2 h-2 rounded-full typing-dot ${theme === 'dark' ? 'bg-zinc-500' : 'bg-zinc-600'}`} />
                      <span className={`w-2 h-2 rounded-full typing-dot ${theme === 'dark' ? 'bg-zinc-600' : 'bg-zinc-450'}`} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Scroll Down button */}
      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-28 right-8 z-10 p-2.5 rounded-full border shadow-lg bg-zinc-900/90 hover:bg-zinc-800 border-zinc-700/50 text-white animate-bounce transition-colors"
          title="Scroll to bottom"
        >
          <ArrowDown className="h-4.5 w-4.5" />
        </button>
      )}

      {/* Bottom prompt Input Pane */}
      <div className={`p-4 border-t ${
        theme === 'dark'
          ? 'border-zinc-900 bg-zinc-950/40'
          : 'border-zinc-200 bg-white/70'
      } backdrop-blur-md`}>
        <div className="max-w-3xl mx-auto relative">
          
          {/* Glassmorphic input container */}
          <div className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-zinc-950/50 border-zinc-800 focus-within:border-zinc-500 focus-within:shadow-neon-cyan'
              : 'bg-white border-zinc-250 shadow-sm focus-within:border-zinc-450'
          }`}>
            
            {/* Input textarea */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ChatNova anything... (Enter to send, Shift+Enter for new line)"
              rows={1}
              data-gramm="false"
              data-enable-grammarly="false"
              spellCheck="false"
              className={`flex-1 min-h-[48px] max-h-[160px] bg-transparent outline-none border-none py-3 px-3.5 text-sm resize-none ${
                theme === 'dark' ? 'text-white placeholder-zinc-500' : 'text-gray-800 placeholder-zinc-400'
              }`}
              style={{
                scrollbarWidth: 'none',
              }}
            />

            {/* Action buttons (Send) */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                input.trim()
                  ? theme === 'dark'
                    ? 'bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-sm'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:scale-105 shadow-sm'
                  : theme === 'dark'
                    ? 'bg-zinc-900/30 text-zinc-650 cursor-not-allowed border border-zinc-800/50'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
              }`}
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Prompt metadata reminder */}
          <div className="flex items-center justify-between mt-2 px-2 text-[10px] font-medium text-zinc-550">
            <span>Powered by {conversation?.model || 'gpt-4.1-mini'}</span>
            <span className="hidden sm:inline">Shift + Enter for newline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
