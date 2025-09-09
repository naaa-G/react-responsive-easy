// @ts-nocheck - React type conflicts with Recharts components
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useVirtualScrolling, VirtualScrollingOptions } from '../../hooks/useVirtualScrolling';
import { PerformanceSnapshot } from '../../core/PerformanceMonitor';
import './VirtualScrollingList.css';

export interface VirtualScrollingListProps {
  items: PerformanceSnapshot[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  enableHorizontal?: boolean;
  itemWidth?: number;
  containerWidth?: number;
  renderItem: (item: PerformanceSnapshot, index: number, style: React.CSSProperties) => React.ReactNode;
  onItemClick?: (item: PerformanceSnapshot, index: number) => void;
  onItemDoubleClick?: (item: PerformanceSnapshot, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  emptyMessage?: string;
  searchQuery?: string;
  sortBy?: keyof PerformanceSnapshot;
  sortOrder?: 'asc' | 'desc';
  filterFn?: (item: PerformanceSnapshot) => boolean;
}

/**
 * Enterprise-grade virtual scrolling list component for large datasets
 * Optimized for performance with thousands of items
 */
export const VirtualScrollingList: React.FC<VirtualScrollingListProps> = ({
  items,
  itemHeight = 60,
  containerHeight = 400,
  overscan = 5,
  enableHorizontal = false,
  itemWidth = 200,
  containerWidth = 800,
  renderItem,
  onItemClick,
  onItemDoubleClick,
  className = '',
  style,
  loading = false,
  emptyMessage = 'No items to display',
  searchQuery = '',
  sortBy,
  sortOrder = 'asc',
  filterFn
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<PerformanceSnapshot[]>(items);
  const [sortedItems, setSortedItems] = useState<PerformanceSnapshot[]>(items);

  // Filter items based on search query and filter function
  useEffect(() => {
    let filtered = items;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return (
          new Date(item.timestamp).toISOString().toLowerCase().includes(query) ||
          Object.values(item.metrics).some(value => 
            typeof value === 'string' ? value.toLowerCase().includes(query) :
            typeof value === 'number' ? value.toString().includes(query) : false
          )
        );
      });
    }

    // Apply custom filter
    if (filterFn) {
      filtered = filtered.filter(filterFn);
    }

    setSearchResults(filtered);
  }, [items, searchQuery, filterFn]);

  // Sort items
  useEffect(() => {
    if (!sortBy) {
      setSortedItems(searchResults);
      return;
    }

    const sorted = [...searchResults].sort((a, b) => {
      const aValue = a[sortBy] as any;
      const bValue = b[sortBy] as any;

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setSortedItems(sorted);
  }, [searchResults, sortBy, sortOrder]);

  // Virtual scrolling configuration
  const virtualScrollingOptions: VirtualScrollingOptions = {
    itemHeight,
    containerHeight,
    overscan,
    enableHorizontal,
    itemWidth,
    containerWidth
  };

  const [virtualState, virtualActions, virtualRefs] = useVirtualScrolling(
    sortedItems,
    virtualScrollingOptions
  );

  // Handle item interactions
  const handleItemClick = useCallback((item: PerformanceSnapshot, index: number) => {
    onItemClick?.(item, index);
  }, [onItemClick]);

  const handleItemDoubleClick = useCallback((item: PerformanceSnapshot, index: number) => {
    onItemDoubleClick?.(item, index);
  }, [onItemDoubleClick]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        virtualActions.scrollToIndex(Math.min(
          virtualState.endIndex + 1,
          sortedItems.length - 1
        ));
        break;
      case 'ArrowUp':
        event.preventDefault();
        virtualActions.scrollToIndex(Math.max(
          virtualState.startIndex - 1,
          0
        ));
        break;
      case 'Home':
        event.preventDefault();
        virtualActions.scrollToTop();
        break;
      case 'End':
        event.preventDefault();
        virtualActions.scrollToBottom();
        break;
      case 'PageDown':
        event.preventDefault();
        virtualActions.scrollToIndex(Math.min(
          virtualState.endIndex + 10,
          sortedItems.length - 1
        ));
        break;
      case 'PageUp':
        event.preventDefault();
        virtualActions.scrollToIndex(Math.max(
          virtualState.startIndex - 10,
          0
        ));
        break;
    }
  }, [virtualActions, virtualState, sortedItems.length]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    // Custom scroll handling if needed
  }, []);

  // Loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="virtual-scrolling-loading">
      {Array.from({ length: Math.ceil(containerHeight / itemHeight) }).map((_, index) => (
        <div
          key={index}
          className="virtual-scrolling-skeleton-item"
          style={{ height: itemHeight }}
        >
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-line skeleton-line--long" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const renderEmptyState = () => (
    <div className="virtual-scrolling-empty">
      <div className="empty-icon">📊</div>
      <div className="empty-message">{emptyMessage}</div>
      {searchQuery && (
        <div className="empty-suggestion">
          Try adjusting your search criteria
        </div>
      )}
    </div>
  );

  // Render virtual items
  const renderVirtualItems = () => {
    if (loading) {
      return renderLoadingSkeleton();
    }

    if (sortedItems.length === 0) {
      return renderEmptyState();
    }

    return (
      <div
        className="virtual-scrolling-content"
        style={{
          height: virtualState.totalHeight,
          width: enableHorizontal ? virtualState.totalWidth : '100%',
          position: 'relative'
        }}
      >
        {virtualState.visibleItems.map(({ item, index, offset }) => (
          <div
            key={`${item.timestamp.getTime()}-${index}`}
            className="virtual-scrolling-item"
            style={{
              position: 'absolute',
              top: offset,
              left: 0,
              height: itemHeight,
              width: enableHorizontal ? itemWidth : '100%',
              transform: `translateY(${virtualState.scrollTop}px)`,
              zIndex: 1
            }}
            onClick={() => handleItemClick(item, index)}
            onDoubleClick={() => handleItemDoubleClick(item, index)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(item, index);
              }
            }}
          >
            {renderItem(item, index, {
              height: itemHeight,
              width: enableHorizontal ? itemWidth : '100%'
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-scrolling-container ${className}`}
      style={{
        height: containerHeight,
        width: enableHorizontal ? containerWidth : '100%',
        overflow: 'auto',
        position: 'relative',
        ...style
      }}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      role="list"
      tabIndex={0}
      aria-label={`Virtual scrolling list with ${sortedItems.length} items`}
      aria-live="polite"
    >
      {/* Scroll indicators */}
      {virtualState.isScrolling && (
        <div className="virtual-scrolling-indicator">
          <div className="scroll-indicator">
            {virtualState.scrollDirection === 'down' ? '↓' : '↑'}
          </div>
        </div>
      )}

      {/* Virtual content */}
      {renderVirtualItems()}

      {/* Scroll position indicator */}
      <div className="virtual-scrolling-position">
        <div className="position-info">
          {virtualState.startIndex + 1}-{virtualState.endIndex + 1} of {sortedItems.length}
        </div>
        <div className="position-percentage">
          {Math.round((virtualState.scrollTop / Math.max(virtualState.totalHeight - containerHeight, 1)) * 100)}%
        </div>
      </div>

      {/* Performance metrics */}
      <div className="virtual-scrolling-metrics">
        <div className="metric">
          <span className="metric-label">Visible:</span>
          <span className="metric-value">{virtualState.visibleItems.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Total:</span>
          <span className="metric-value">{sortedItems.length}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Height:</span>
          <span className="metric-value">{Math.round(virtualState.totalHeight)}px</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for virtual scrolling list with advanced features
 */
export function useVirtualScrollingList<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    searchQuery?: string;
    sortBy?: keyof T;
    sortOrder?: 'asc' | 'desc';
    filterFn?: (item: T) => boolean;
  }
) {
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [sortedItems, setSortedItems] = useState<T[]>(items);

  // Filter items
  useEffect(() => {
    let filtered = items;

    if (options.searchQuery?.trim()) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        return Object.values(item as any).some(value => 
          typeof value === 'string' ? value.toLowerCase().includes(query) :
          typeof value === 'number' ? value.toString().includes(query) : false
        );
      });
    }

    if (options.filterFn) {
      filtered = filtered.filter(options.filterFn);
    }

    setFilteredItems(filtered);
  }, [items, options.searchQuery, options.filterFn]);

  // Sort items
  useEffect(() => {
    if (!options.sortBy) {
      setSortedItems(filteredItems);
      return;
    }

    const sorted = [...filteredItems].sort((a, b) => {
      const aValue = a[options.sortBy!];
      const bValue = b[options.sortBy!];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }

      return options.sortOrder === 'asc' ? comparison : -comparison;
    });

    setSortedItems(sorted);
  }, [filteredItems, options.sortBy, options.sortOrder]);

  const virtualScrollingOptions: VirtualScrollingOptions = {
    itemHeight: options.itemHeight,
    containerHeight: options.containerHeight,
    overscan: 5
  };

  const [virtualState, virtualActions, virtualRefs] = useVirtualScrolling(
    sortedItems,
    virtualScrollingOptions
  );

  return {
    items: sortedItems,
    virtualState,
    virtualActions,
    virtualRefs,
    totalItems: items.length,
    filteredItems: filteredItems.length,
    visibleItems: virtualState.visibleItems.length
  };
}

export default VirtualScrollingList;
