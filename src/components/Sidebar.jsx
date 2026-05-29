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
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-30 flex flex-col w-[280px] border-r transition-all duration-300 md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          theme === 'dark'
            ? 'glass-panel border-zinc-900 text-gray-200'
            : 'glass-panel-light border-zinc-200 text-gray-800'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 pt-7 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-400 shadow-neon-purple">
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-white via-zinc-250 to-zinc-400 bg-clip-text text-transparent dark:block hidden">
                ChatNova
              </h1>
              <h1 className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-zinc-950 to-zinc-750 bg-clip-text text-transparent dark:hidden block">
                ChatNova
              </h1>
              <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-widest block -mt-0.5">
                Next-Gen Core
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/5 dark:text-zinc-400 text-zinc-650 transition-colors"
            title="Close Sidebar"
          >
            <X className="h-4.5 w-4.5 md:hidden block" />
            <ChevronLeft className="h-4.5 w-4.5 md:block hidden" />
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
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium text-[14px] transition-all duration-300 bg-gradient-to-r from-zinc-800 via-zinc-750 to-zinc-900 hover:from-zinc-700 hover:to-zinc-850 text-white shadow-neon-purple hover:shadow-zinc-900/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 px-3 overflow-y-auto space-y-1.5">
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-550">
            Recent Conversations
          </div>
          
          <AnimatePresence initial={false}>
            {conversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-3 py-4 text-xs italic text-zinc-500/60 text-center"
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
                          ? 'bg-zinc-900/45 border-zinc-700/60 text-white shadow-neon-purple'
                          : 'bg-zinc-100 border-zinc-300 text-zinc-950 shadow-sm'
                        : theme === 'dark'
                          ? 'bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-white'
                          : 'bg-transparent border-transparent text-zinc-650 hover:bg-zinc-100/50 hover:text-zinc-950'
                    }`}
                  >
                    <MessageSquare className={`h-4.5 w-4.5 shrink-0 ${
                      isActive ? 'text-zinc-300' : 'text-zinc-550'
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
                          className="w-full bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:border-zinc-500"
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
                            theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-200 text-zinc-650 hover:text-zinc-950'
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
                            theme === 'dark' ? 'hover:bg-zinc-800 text-rose-400 hover:text-rose-350' : 'hover:bg-zinc-200 text-rose-600 hover:text-rose-800'
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
          theme === 'dark' ? 'border-zinc-900 bg-zinc-950/10' : 'border-zinc-200 bg-zinc-100/10'
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
                  ? 'border-zinc-800 bg-zinc-900/20 hover:bg-rose-950/20 hover:border-rose-900/30 text-zinc-400 hover:text-rose-300'
                  : 'border-zinc-200 bg-white/50 hover:bg-rose-50 hover:border-rose-200 text-rose-600'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}

          {/* User Theme switcher */}
          <div className="flex items-center justify-center px-1">
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center gap-2 w-full p-2.5 rounded-xl border transition-all duration-300 hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-850 text-zinc-200'
                  : 'bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-800'
              }`}
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              <span className="text-xs font-semibold uppercase tracking-wider">
                {theme === 'dark' ? 'Obsidian' : 'Slate'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
