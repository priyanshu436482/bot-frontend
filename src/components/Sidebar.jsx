import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MessageSquare, Trash2, Edit2, Check, X, 
  Menu, ChevronLeft, Moon, Sun, Sparkles, AlertCircle 
} from 'lucide-react';

export default function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  onRenameConversation,
  onClearAllConversations,
  theme,
  toggleTheme,
  isOpen,
  setIsOpen
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (e, id, currentTitle) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (e, id) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Sidebar Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-40 p-2.5 rounded-xl md:hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-cyber-darker/80 border border-purple-900/30 text-purple-200' 
            : 'bg-white/80 border border-indigo-100 text-indigo-900 shadow-md'
        } backdrop-blur-md hover:scale-105`}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col w-[280px] border-r transition-all duration-300 md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'glass-panel border-purple-950/20 text-gray-200'
            : 'glass-panel-light border-indigo-100 text-gray-800'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyber-glow to-cyber-neonCyan shadow-neon-purple">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyber-neonCyan bg-clip-text text-transparent dark:block hidden">
                ChatNova
              </h1>
              <h1 className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-indigo-900 to-purple-700 bg-clip-text text-transparent dark:hidden block">
                ChatNova
              </h1>
              <span className="text-[9px] font-semibold text-purple-400 uppercase tracking-widest block -mt-0.5">
                Next-Gen Core
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:block hidden p-1.5 rounded-lg hover:bg-white/5 dark:text-purple-300 text-indigo-700 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => {
              onCreateConversation();
              // On mobile, automatically close sidebar on chat creation
              if (window.innerWidth < 768) setIsOpen(false);
            }}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium text-[14px] transition-all duration-300 bg-gradient-to-r from-cyber-glow via-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white shadow-neon-purple hover:shadow-purple-900/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 px-3 overflow-y-auto space-y-1.5">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-purple-400/80">
            Recent Conversations
          </div>
          
          <AnimatePresence initial={false}>
            {conversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-4 text-xs italic text-purple-300/60 text-center"
              >
                No active conversations
              </motion.div>
            ) : (
              conversations.map((chat) => {
                const isActive = chat.id === activeId;
                const isEditing = chat.id === editingId;

                return (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      if (!isEditing) {
                        onSelectConversation(chat.id);
                        if (window.innerWidth < 768) setIsOpen(false);
                      }
                    }}
                    className={`group relative flex items-center gap-2.5 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-purple-950/30 border-purple-500/35 text-white shadow-neon-purple'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-950 shadow-md'
                        : theme === 'dark'
                          ? 'bg-transparent border-transparent text-purple-300/80 hover:bg-white/5 hover:text-white'
                          : 'bg-transparent border-transparent text-indigo-950/70 hover:bg-indigo-50/50 hover:text-indigo-950'
                    }`}
                  >
                    <MessageSquare className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-cyber-neonCyan' : 'text-purple-400/60'
                    }`} />
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 w-full mr-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(e, chat.id);
                            if (e.key === 'Escape') handleCancelRename(e);
                          }}
                          autoFocus
                          className="w-full bg-purple-950/60 border border-purple-500/30 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={(e) => handleSaveRename(e, chat.id)}
                          className="p-0.5 rounded text-emerald-400 hover:bg-white/10"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-0.5 rounded text-rose-400 hover:bg-white/10"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13px] font-medium truncate pr-16 select-none">
                        {chat.title}
                      </span>
                    )}

                    {/* Desktop Hover Row Actions */}
                    {!isEditing && (
                      <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-150">
                        <button
                          onClick={(e) => handleStartRename(e, chat.id, chat.title)}
                          className={`p-1 rounded transition-colors ${
                            theme === 'dark' ? 'hover:bg-purple-900/40 text-purple-300/80 hover:text-white' : 'hover:bg-indigo-100 text-indigo-700 hover:text-indigo-950'
                          }`}
                          title="Rename chat"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(chat.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            theme === 'dark' ? 'hover:bg-purple-900/40 text-rose-400/80 hover:text-rose-400' : 'hover:bg-indigo-100 text-rose-600 hover:text-rose-800'
                          }`}
                          title="Delete chat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className={`p-4 space-y-2.5 border-t ${
          theme === 'dark' ? 'border-purple-950/20 bg-purple-950/5' : 'border-indigo-100 bg-indigo-50/10'
        }`}>
          {/* Clear All Chats */}
          {conversations.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete ALL chats? This cannot be undone.")) {
                  onClearAllConversations();
                }
              }}
              className={`flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-purple-900/20 bg-purple-950/10 hover:bg-rose-950/30 hover:border-rose-900/40 text-rose-300'
                  : 'border-indigo-100 bg-white/50 hover:bg-rose-50 hover:border-rose-200 text-rose-600'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}

          {/* User Theme switcher and system status */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-purple-950/30 border-purple-900/30 hover:bg-purple-900/40 text-cyan-400'
                  : 'bg-white border-indigo-100 hover:bg-indigo-50 text-indigo-700'
              }`}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              <span className="text-xs font-semibold uppercase tracking-wider">
                {theme === 'dark' ? 'Crystal' : 'Cyber'}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-purple-400/80 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
