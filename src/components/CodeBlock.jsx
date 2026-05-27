import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-purple-900/30 shadow-md">
      {/* Codeblock Header */}
      <div className="flex items-center justify-between bg-purple-950/70 px-4 py-2 text-xs font-medium text-purple-200 border-b border-purple-900/30">
        <span className="font-mono text-cyan-400 uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded bg-purple-900/30 px-2.5 py-1 text-purple-300 transition-colors hover:bg-purple-900/60 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <div className="text-[13.5px]">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'rgba(7, 2, 13, 0.95)',
          }}
        >
          {String(value).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
