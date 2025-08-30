'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardIcon, 
  CheckIcon,
  PlayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Button } from './Button';
import { copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
  showCopy?: boolean;
  showRun?: boolean;
  showPreview?: boolean;
  onRun?: () => void;
  onPreview?: () => void;
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  showLineNumbers = false,
  highlightLines = [],
  className,
  showCopy = true,
  showRun = false,
  showPreview = false,
  onRun,
  onPreview,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={cn('group relative overflow-hidden rounded-lg bg-gray-900', className)}>
      {/* Header */}
      {(title || showCopy || showRun || showPreview) && (
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
          <div className="flex items-center space-x-2">
            {/* Traffic Lights */}
            <div className="flex space-x-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            
            {title && (
              <span className="ml-2 text-sm font-medium text-gray-300">
                {title}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {showPreview && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreview}
                className="h-7 px-2 text-gray-400 hover:text-gray-200"
              >
                <EyeIcon className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {showRun && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRun}
                className="h-7 px-2 text-gray-400 hover:text-gray-200"
              >
                <PlayIcon className="h-3.5 w-3.5" />
              </Button>
            )}
            
            {showCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-gray-400 hover:text-gray-200"
              >
                {copied ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center"
                  >
                    <CheckIcon className="h-3.5 w-3.5 text-green-400" />
                  </motion.div>
                ) : (
                  <ClipboardIcon className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Code Content */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code className={`language-${language} text-gray-100`}>
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => {
                    const lineNumber = index + 1;
                    const isHighlighted = highlightLines.includes(lineNumber);
                    
                    return (
                      <tr
                        key={index}
                        className={cn(
                          isHighlighted && 'bg-brand-500/10 border-l-2 border-brand-500'
                        )}
                      >
                        <td className="select-none pr-4 text-right text-gray-500 w-12">
                          {lineNumber}
                        </td>
                        <td className={cn('pl-4', isHighlighted && 'pl-2')}>
                          <SyntaxHighlight code={line} language={language} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <SyntaxHighlight code={code} language={language} />
            )}
          </code>
        </pre>
        
        {/* Copy overlay for hover effect */}
        {showCopy && !title && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ClipboardIcon className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Simple syntax highlighting component (client-only to avoid hydration issues)
function SyntaxHighlight({ code, language }: { code: string; language: string }) {
  // Return plain text to avoid hydration mismatches
  // In production, this would use a proper syntax highlighter like Prism.js
  return <span className="text-gray-100">{code}</span>;
}
