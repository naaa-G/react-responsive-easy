import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface VirtualScrollingOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  threshold?: number;
  enableHorizontal?: boolean;
  itemWidth?: number;
  containerWidth?: number;
}

export interface VirtualScrollingState {
  startIndex: number;
  endIndex: number;
  visibleItems: any[];
  totalHeight: number;
  totalWidth: number;
  scrollTop: number;
  scrollLeft: number;
  isScrolling: boolean;
  scrollDirection: 'up' | 'down' | 'left' | 'right' | null;
}

export interface VirtualScrollingActions {
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
  scrollToOffset: (offset: number, direction?: 'vertical' | 'horizontal') => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollToLeft: () => void;
  scrollToRight: () => void;
  getItemOffset: (index: number) => number;
  getVisibleRange: () => { start: number; end: number };
  updateItemHeight: (index: number, height: number) => void;
  updateItemWidth: (index: number, width: number) => void;
}

export interface VirtualScrollingRef {
  containerRef: React.RefObject<HTMLElement>;
  scrollElementRef: React.RefObject<HTMLElement>;
}

/**
 * Enterprise-grade virtual scrolling hook for handling large datasets
 * with dynamic item heights, horizontal scrolling, and performance optimizations
 */
export function useVirtualScrolling<T = any>(
  items: T[],
  options: VirtualScrollingOptions
): [VirtualScrollingState, VirtualScrollingActions, VirtualScrollingRef] {
  const {
    itemHeight,
    containerHeight,
    overscan = 5,
    threshold = 100,
    enableHorizontal = false,
    itemWidth = 200,
    containerWidth = 800
  } = options;

  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const scrollElementRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const itemHeightsRef = useRef<Map<number, number>>(new Map());
  const itemWidthsRef = useRef<Map<number, number>>(new Map());
  const lastScrollTopRef = useRef(0);
  const lastScrollLeftRef = useRef(0);

  // State
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (items.length === 0) return { start: 0, end: 0 };

    let startIndex = 0;
    let endIndex = items.length - 1;
    let currentOffset = 0;

    // Find start index
    for (let i = 0; i < items.length; i++) {
      const height = itemHeightsRef.current.get(i) || itemHeight;
      if (currentOffset + height > scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      currentOffset += height;
    }

    // Find end index
    currentOffset = 0;
    for (let i = 0; i < items.length; i++) {
      const height = itemHeightsRef.current.get(i) || itemHeight;
      currentOffset += height;
      if (currentOffset > scrollTop + containerHeight) {
        endIndex = Math.min(items.length - 1, i + overscan);
        break;
      }
    }

    return { start: startIndex, end: endIndex };
  }, [items.length, scrollTop, containerHeight, itemHeight, overscan]);

  // Calculate total dimensions
  const totalHeight = useMemo(() => {
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += itemHeightsRef.current.get(i) || itemHeight;
    }
    return height;
  }, [items.length, itemHeight]);

  const totalWidth = useMemo(() => {
    if (!enableHorizontal) return containerWidth;
    let width = 0;
    for (let i = 0; i < items.length; i++) {
      width += itemWidthsRef.current.get(i) || itemWidth;
    }
    return width;
  }, [items.length, itemWidth, enableHorizontal, containerWidth]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      offset: getItemOffset(visibleRange.start + index)
    }));
  }, [items, visibleRange]);

  // Scroll event handler
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    const newScrollTop = target.scrollTop;
    const newScrollLeft = target.scrollLeft;

    // Determine scroll direction
    const verticalDirection = newScrollTop > lastScrollTopRef.current ? 'down' : 'up';
    const horizontalDirection = newScrollLeft > lastScrollLeftRef.current ? 'right' : 'left';
    
    setScrollDirection(verticalDirection);
    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set scrolling to false after threshold
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      setScrollDirection(null);
    }, threshold);

    lastScrollTopRef.current = newScrollTop;
    lastScrollLeftRef.current = newScrollLeft;
  }, [threshold]);

  // Attach scroll listener
  useEffect(() => {
    const scrollElement = scrollElementRef.current || containerRef.current;
    if (!scrollElement) return;

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Actions
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    const scrollElement = scrollElementRef.current || containerRef.current;
    if (!scrollElement || index < 0 || index >= items.length) return;

    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemHeightsRef.current.get(i) || itemHeight;
    }

    let targetScrollTop = offset;
    if (align === 'center') {
      targetScrollTop = offset - containerHeight / 2;
    } else if (align === 'end') {
      targetScrollTop = offset - containerHeight;
    }

    scrollElement.scrollTop = Math.max(0, targetScrollTop);
  }, [items.length, itemHeight, containerHeight]);

  const scrollToOffset = useCallback((offset: number, direction: 'vertical' | 'horizontal' = 'vertical') => {
    const scrollElement = scrollElementRef.current || containerRef.current;
    if (!scrollElement) return;

    if (direction === 'vertical') {
      scrollElement.scrollTop = Math.max(0, offset);
    } else if (enableHorizontal) {
      scrollElement.scrollLeft = Math.max(0, offset);
    }
  }, [enableHorizontal]);

  const scrollToTop = useCallback(() => {
    scrollToOffset(0, 'vertical');
  }, [scrollToOffset]);

  const scrollToBottom = useCallback(() => {
    scrollToOffset(totalHeight, 'vertical');
  }, [scrollToOffset, totalHeight]);

  const scrollToLeft = useCallback(() => {
    scrollToOffset(0, 'horizontal');
  }, [scrollToOffset]);

  const scrollToRight = useCallback(() => {
    scrollToOffset(totalWidth, 'horizontal');
  }, [scrollToOffset, totalWidth]);

  const getItemOffset = useCallback((index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemHeightsRef.current.get(i) || itemHeight;
    }
    return offset;
  }, [itemHeight]);

  const getVisibleRange = useCallback(() => {
    return visibleRange;
  }, [visibleRange]);

  const updateItemHeight = useCallback((index: number, height: number) => {
    itemHeightsRef.current.set(index, height);
  }, []);

  const updateItemWidth = useCallback((index: number, width: number) => {
    itemWidthsRef.current.set(index, width);
  }, []);

  // State object
  const state: VirtualScrollingState = {
    startIndex: visibleRange.start,
    endIndex: visibleRange.end,
    visibleItems,
    totalHeight,
    totalWidth,
    scrollTop,
    scrollLeft,
    isScrolling,
    scrollDirection
  };

  // Actions object
  const actions: VirtualScrollingActions = {
    scrollToIndex,
    scrollToOffset,
    scrollToTop,
    scrollToBottom,
    scrollToLeft,
    scrollToRight,
    getItemOffset,
    getVisibleRange,
    updateItemHeight,
    updateItemWidth
  };

  // Refs object
  const refs: VirtualScrollingRef = {
    containerRef,
    scrollElementRef
  };

  return [state, actions, refs];
}

/**
 * Hook for dynamic item heights in virtual scrolling
 */
export function useDynamicItemHeights<T = any>(
  items: T[],
  getItemHeight: (item: T, index: number) => number
) {
  const itemHeightsRef = useRef<Map<number, number>>(new Map());
  const totalHeightRef = useRef(0);

  const updateHeight = useCallback((index: number, height: number) => {
    const oldHeight = itemHeightsRef.current.get(index) || 0;
    itemHeightsRef.current.set(index, height);
    totalHeightRef.current += height - oldHeight;
  }, []);

  const getHeight = useCallback((index: number) => {
    return itemHeightsRef.current.get(index) || getItemHeight(items[index], index);
  }, [items, getItemHeight]);

  const getTotalHeight = useCallback(() => {
    return totalHeightRef.current;
  }, []);

  // Initialize heights for all items
  useEffect(() => {
    let total = 0;
    items.forEach((item, index) => {
      const height = getItemHeight(item, index);
      itemHeightsRef.current.set(index, height);
      total += height;
    });
    totalHeightRef.current = total;
  }, [items, getItemHeight]);

  return {
    updateHeight,
    getHeight,
    getTotalHeight,
    itemHeights: itemHeightsRef.current
  };
}

/**
 * Hook for virtual scrolling with windowing
 */
export function useWindowing<T = any>(
  items: T[],
  windowSize: number = 50,
  itemHeight: number = 50
) {
  const [windowStart, setWindowStart] = useState(0);
  const [windowEnd, setWindowEnd] = useState(Math.min(windowSize, items.length));

  const visibleItems = useMemo(() => {
    return items.slice(windowStart, windowEnd);
  }, [items, windowStart, windowEnd]);

  const moveWindow = useCallback((direction: 'up' | 'down', amount: number = 1) => {
    if (direction === 'up') {
      setWindowStart(prev => Math.max(0, prev - amount));
      setWindowEnd(prev => Math.max(windowSize, prev - amount));
    } else {
      setWindowStart(prev => Math.min(items.length - windowSize, prev + amount));
      setWindowEnd(prev => Math.min(items.length, prev + amount));
    }
  }, [items.length, windowSize]);

  const jumpToWindow = useCallback((startIndex: number) => {
    const clampedStart = Math.max(0, Math.min(items.length - windowSize, startIndex));
    setWindowStart(clampedStart);
    setWindowEnd(clampedStart + windowSize);
  }, [items.length, windowSize]);

  return {
    visibleItems,
    windowStart,
    windowEnd,
    moveWindow,
    jumpToWindow,
    totalItems: items.length,
    windowSize
  };
}