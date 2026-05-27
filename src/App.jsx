import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import confetti from 'canvas-confetti';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin; // Dynamically resolve production base URL or relative local proxy

export default function App() {
  // 1. Theme Configuration (Dark by default)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('antigravity_theme');
    return savedTheme || 'dark';
  });

  // Apply theme class to root html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.backgroundColor = '#03000a';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.backgroundColor = '#f6f8fd';
    }
    localStorage.setItem('antigravity_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // 2. Chat Conversations State
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('antigravity_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse conversations', e);
      }
    }
    return [];
  });

  const [activeId, setActiveId] = useState(() => {
    const savedActive = localStorage.getItem('antigravity_active_id');
    return savedActive || '';
  });

  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync conversations to LocalStorage
  useEffect(() => {
    localStorage.setItem('antigravity_chats', JSON.stringify(conversations));
  }, [conversations]);

  // Sync active chat ID to LocalStorage
  useEffect(() => {
    if (activeId) {
      localStorage.setItem('antigravity_active_id', activeId);
    } else {
      localStorage.removeItem('antigravity_active_id');
    }
  }, [activeId]);

  // Auto-create a conversation on startup if list is empty
  useEffect(() => {
    if (conversations.length === 0) {
      handleCreateConversation();
    } else if (!activeId || !conversations.some(c => c.id === activeId)) {
      setActiveId(conversations[0].id);
    }
  }, []);

  const handleCreateConversation = (title = 'New Conversation') => {
    const newChat = {
      id: crypto.randomUUID(),
      title: title,
      messages: [],
      model: 'gpt-4.1-mini',
      createdAt: new Date().toISOString()
    };
    setConversations(prev => [newChat, ...prev]);
    setActiveId(newChat.id);
    return newChat.id;
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    // Cancel speech synthesizer on chat transition
    window.speechSynthesis.cancel();
  };

  const handleDeleteConversation = (id) => {
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    
    if (activeId === id) {
      if (filtered.length > 0) {
        setActiveId(filtered[0].id);
      } else {
        // If everything was deleted, Sidebar hook will auto-create a new one
        setActiveId('');
      }
    }
    // Cancel speaking if deleting active chat
    window.speechSynthesis.cancel();
  };

  const handleRenameConversation = (id, newTitle) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleClearAllConversations = () => {
    setConversations([]);
    setActiveId('');
    localStorage.removeItem('antigravity_chats');
    localStorage.removeItem('antigravity_active_id');
    window.speechSynthesis.cancel();
    
    // Auto trigger creation of empty chat
    setTimeout(() => {
      handleCreateConversation();
    }, 100);
  };

  const handleSendMessage = async (text) => {
    let currentActiveId = activeId;
    
    // Safety check: if no active conversation exists, create one
    if (!currentActiveId) {
      currentActiveId = handleCreateConversation();
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Find current conversation
    const currentChat = conversations.find(c => c.id === currentActiveId);
    if (!currentChat) return;

    // Append user message
    const updatedMessages = [...currentChat.messages, userMessage];
    
    // Determine rename on first message
    const isFirstMessage = currentChat.messages.length === 0;
    const computedTitle = isFirstMessage 
      ? text.length > 28 ? `${text.slice(0, 26)}...` : text
      : currentChat.title;

    // Update conversation state with user message
    setConversations(prev =>
      prev.map(c => 
        c.id === currentActiveId 
          ? { ...c, title: computedTitle, messages: updatedMessages } 
          : c
      )
    );

    setIsTyping(true);

    // Setup placeholder message for incoming AI response
    const aiMessageId = crypto.randomUUID();
    const aiPlaceholder = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    };

    setConversations(prev =>
      prev.map(c => 
        c.id === currentActiveId 
          ? { ...c, messages: [...updatedMessages, aiPlaceholder] } 
          : c
      )
    );

    try {
      // Connect to the Express server streaming endpoint
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Server connection failed: ${response.statusText}`);
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamedResponse = '';

      // Set indicator to false as stream begins rendering
      setIsTyping(false);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }

              try {
                const parsed = JSON.parse(dataStr);
                
                if (parsed.error) {
                  throw new Error(parsed.error);
                }

                if (parsed.content) {
                  streamedResponse += parsed.content;
                  
                  // Incremental state updates as chunks stream in
                  setConversations(prev =>
                    prev.map(c => {
                      if (c.id === currentActiveId) {
                        return {
                          ...c,
                          messages: c.messages.map(msg => 
                            msg.id === aiMessageId 
                              ? { ...msg, content: streamedResponse } 
                              : msg
                          )
                        };
                      }
                      return c;
                    })
                  );
                }
              } catch (e) {
                // Skip incomplete or unparseable lines
              }
            }
          }
        }
      }

      // Confetti burst removed as per user request

    } catch (error) {
      console.error('Connection Error:', error);
      setIsTyping(false);
      
      const errorContent = `🔴 **Failed to fetch AI response.** \n\n*Error details:* \`${error.message}\`\n\nEnsure your server is running by executing \`npm run dev\` in the project workspace, and verify that the Express port is correct.`;
      
      setConversations(prev =>
        prev.map(c => {
          if (c.id === currentActiveId) {
            return {
              ...c,
              messages: c.messages.map(msg => 
                msg.id === aiMessageId 
                  ? { ...msg, content: errorContent } 
                  : msg
              )
            };
          }
          return c;
        })
      );
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a020f0', '#00f0ff', '#ff007f'],
      disableForReducedMotion: true
    });
  };

  const activeChat = conversations.find(c => c.id === activeId);

  return (
    <div className={`relative flex w-screen h-screen overflow-hidden ${
      theme === 'dark' ? 'bg-cyber-dark text-white' : 'bg-cyber-lightBg text-gray-900'
    }`}>
      
      {/* Premium Floating Neon Gradient Particles background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Purple Orb */}
        <div className={`absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full mix-blend-screen animate-float-slow opacity-15 filter blur-[90px] ${
          theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'
        }`} />
        {/* Cyan Orb */}
        <div className={`absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full mix-blend-screen animate-float-slow animation-delay-4000 opacity-15 filter blur-[110px] ${
          theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-200'
        }`} />
        {/* Pink Glow Orb */}
        <div className={`absolute top-[30%] right-[30%] w-[400px] h-[400px] rounded-full mix-blend-screen animate-float-slow animation-delay-2000 opacity-10 filter blur-[80px] ${
          theme === 'dark' ? 'bg-pink-600' : 'bg-pink-200'
        }`} />
      </div>

      {/* Main Application Layout wrapper */}
      <div className="relative z-10 flex w-full h-full">
        {/* Collapsible Sidebar */}
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
          onClearAllConversations={handleClearAllConversations}
          theme={theme}
          toggleTheme={toggleTheme}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Central Chat area */}
        <ChatArea
          conversation={activeChat}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          theme={theme}
        />
      </div>
    </div>
  );
}
