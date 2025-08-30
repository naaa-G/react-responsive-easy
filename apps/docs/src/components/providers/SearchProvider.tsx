'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Fuse from 'fuse.js';

interface SearchItem {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  tags?: string[];
}

interface SearchContextValue {
  query: string;
  results: SearchItem[];
  isLoading: boolean;
  search: (query: string) => void;
  clearSearch: () => void;
  addItems: (items: SearchItem[]) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);

  const addItems = useCallback((items: SearchItem[]) => {
    setSearchItems(prev => {
      const newItems = [...prev, ...items];
      const fuseInstance = new Fuse(newItems, {
        keys: [
          { name: 'title', weight: 0.4 },
          { name: 'content', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true
      });
      setFuse(fuseInstance);
      return newItems;
    });
  }, []);

  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim() || !fuse) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate async search
    setTimeout(() => {
      const searchResults = fuse.search(searchQuery, { limit: 10 });
      setResults(searchResults.map(result => result.item));
      setIsLoading(false);
    }, 100);
  }, [fuse]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  const value: SearchContextValue = {
    query,
    results,
    isLoading,
    search,
    clearSearch,
    addItems
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
