import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { Copy, Check, Volume2, VolumeX, Sparkles, User, Clock } from 'lucide-react';

export default function MessageBubble({ message, theme }) {
  const { role, content, timestamp } = message;
  const isAi = role === 'assistant' || role === 'system';

  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Monitor SpeechSynthesis changes to reset speaking icon if speech finishes naturally
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any other speech first

      // Strip out markdown symbols for cleaner narration
      const cleanText = content
        .replace(/```[\s\S]*?```/g, '[Code Block]') // Skip reading complete code blocks
        .replace(/`([^`]+)`/g, '$1')
        .replace(/[*#_\[\]\(\)]/g, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      // Select an elegant english voice if available
      const voices = window.speechSynthesis.getVoices();
      const EnglishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
      );
      if (EnglishVoice) {
        utterance.voice = EnglishVoice;
      }

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Format the time display (e.g. "10:45 AM")
  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
        isAi
          ? theme === 'dark'
            ? 'bg-cyber-card border-zinc-850/40 hover:border-zinc-800/50 shadow-sm'
            : 'bg-cyber-lightCard border-zinc-200 hover:border-zinc-250 shadow-sm'
          : theme === 'dark'
            ? 'bg-zinc-900/30 border-transparent'
            : 'bg-zinc-100/40 border-transparent'
      }`}
    >
      {/* Icon Avatar */}
      <div className={`relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
        isAi
          ? 'bg-gradient-to-tr from-zinc-700 to-zinc-400 shadow-neon-purple text-white'
          : theme === 'dark'
            ? 'bg-zinc-900/40 border border-zinc-800 text-zinc-400'
            : 'bg-zinc-100 border border-zinc-200 text-zinc-700'
      }`}>
        {isAi ? (
          <Sparkles className="w-4.5 h-4.5 animate-pulse" />
        ) : (
          <User className="w-4.5 h-4.5" />
        )}
      </div>

      {/* Bubble Core */}
      <div className="flex-1 min-w-0">
        {/* Title bar / Sender Name */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-sm font-semibold tracking-tight ${
            isAi 
              ? theme === 'dark' ? 'text-white' : 'text-gray-900'
              : theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'
          }`}>
            {isAi ? '𝗧𝗶𝘁𝗖𝗼𝗱𝗲 Core' : 'You'}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTime(timestamp)}</span>
          </span>
        </div>

        {/* Message Content Rendered as Markdown */}
        <div className="prose-custom">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Overwrite native code element with our customized CodeBlock component
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInlineCode = inline || !match;
                
                return !isInlineCode ? (
                  <CodeBlock
                    language={match[1]}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              // Wrap tables in a responsive horizontal overflow container
              table({ children, ...props }) {
                return (
                  <div className="overflow-x-auto w-full my-4 border border-zinc-200 dark:border-zinc-850/40 rounded-lg">
                    <table className="w-full border-collapse text-left" {...props}>
                      {children}
                    </table>
                  </div>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Action Toolbar on Hover (and fully visible on mobile) */}
        <div className={`flex items-center gap-1.5 mt-3.5 pt-2 border-t transition-opacity duration-200 ${
          theme === 'dark' ? 'border-zinc-900' : 'border-zinc-200'
        } opacity-0 group-hover:opacity-100 max-md:opacity-100`}>
          
          {/* Copy Message button */}
          <button
            onClick={handleCopyText}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              theme === 'dark'
                ? 'border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-650 hover:text-zinc-900'
            }`}
            title="Copy response"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Text-To-Speech button */}
          {isAi && (
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                isSpeaking 
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40'
                  : theme === 'dark'
                    ? 'border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                    : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-650 hover:text-zinc-900'
              }`}
              title={isSpeaking ? "Mute narration" : "Speak response"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 animate-bounce" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Speak</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
