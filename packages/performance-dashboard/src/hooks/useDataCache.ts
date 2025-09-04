import { useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

/**
 * Custom hook for intelligent data caching with TTL and size limits
 */
export function useDataCache<T>(options: CacheOptions = {}) {
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // 5 minutes default TTL

  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T, customTtl?: number): void => {
    // Remove oldest entries if cache is full
    if (cache.current.size >= maxSize) {
      const oldestKey = cache.current.keys().next().value;
      if (oldestKey) {
        cache.current.delete(oldestKey);
      }
    }

    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    });
  }, [ttl, maxSize]);

  const clear = useCallback((): void => {
    cache.current.clear();
  }, []);

  const has = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    if (!entry) return false;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const size = useCallback((): number => {
    return cache.current.size;
  }, []);

  const cleanup = useCallback((): void => {
    const now = Date.now();
    for (const [key, entry] of cache.current.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        cache.current.delete(key);
      }
    }
  }, []);

  return {
    get,
    set,
    clear,
    has,
    size,
    cleanup
  };
}
