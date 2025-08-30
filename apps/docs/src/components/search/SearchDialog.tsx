'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  X,
  FileText,
  Code2,
  Play,
  BookOpen
} from 'lucide-react';
import { useSearch } from '@/components/providers/SearchProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  docs: FileText,
  api: Code2,
  examples: Play,
  guides: BookOpen,
} as const;

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { query, results, isLoading, search, clearSearch } = useSearch();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) {
          // Open search (handled by parent)
        }
      }
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          window.location.href = selectedResult.url;
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    search(value);
  }, [search]);

  const handleClose = useCallback(() => {
    setInputValue('');
    clearSearch();
    onClose();
  }, [clearSearch, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div className="flex min-h-full items-start justify-center p-4 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-gray-200 px-4 dark:border-gray-700">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 bg-transparent px-4 py-4 text-gray-900 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    <span>Searching...</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => {
                    const Icon = categoryIcons[result.category as keyof typeof categoryIcons] || FileText;
                    const isSelected = index === selectedIndex;
                    
                    return (
                      <motion.a
                        key={result.id}
                        href={result.url}
                        onClick={handleClose}
                        className={cn(
                          'flex items-start space-x-3 px-4 py-3 transition-colors',
                          isSelected
                            ? 'bg-brand-50 text-brand-900 dark:bg-brand-950/50 dark:text-brand-100'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        )}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{result.title}</div>
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {result.content.length > 120
                              ? result.content.substring(0, 120) + '...'
                              : result.content
                            }
                          </div>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {result.category}
                            </span>
                            {result.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-gray-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              ) : query ? (
                <div className="py-12 text-center">
                  <Search size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    No results found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search terms or browse the documentation.
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Search size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Start typing to search
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Search through documentation, API references, and examples.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">↵</kbd>
                    <span>to select</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">↑↓</kbd>
                    <span>to navigate</span>
                  </span>
                </div>
                <span className="flex items-center space-x-1">
                  <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">esc</kbd>
                  <span>to close</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
