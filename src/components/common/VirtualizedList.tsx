import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useVirtual } from 'react-virtual';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  width?: string | number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  keyExtractor: (item: T, index: number) => string;
  overscan?: number;
  className?: string;
  itemClassName?: string;
  estimateSize?: (index: number) => number;
  getScrollElement?: () => HTMLElement | null;
}

/**
 * A virtualized list component that efficiently renders only visible items
 * Uses react-virtual for performance optimization
 */
function VirtualizedList<T>({
  items,
  height,
  width = '100%',
  itemHeight,
  renderItem,
  onItemClick,
  keyExtractor,
  overscan = 5,
  className = '',
  itemClassName = '',
  estimateSize,
  getScrollElement
}: VirtualizedListProps<T>): React.ReactElement {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Use the getScrollElement function if provided, otherwise use parentRef
  const getScrollElementFn = useCallback(() => {
    if (getScrollElement) {
      return getScrollElement();
    }
    return parentRef.current;
  }, [getScrollElement]);
  
  // Setup virtual list with react-virtual
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: parentRef,
    estimateSize: estimateSize || (() => itemHeight),
    overscan,
    getScrollElement: getScrollElementFn
  });
  
  // Handle item click
  const handleItemClick = useCallback((item: T, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
    }
  }, [onItemClick]);
  
  // Improved scroll restoration
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Save scroll position when unmounting
  useEffect(() => {
    return () => {
      if (parentRef.current) {
        setScrollOffset(parentRef.current.scrollTop);
      }
    };
  }, []);
  
  // Restore scroll position on remount
  useEffect(() => {
    if (parentRef.current && scrollOffset > 0) {
      parentRef.current.scrollTop = scrollOffset;
    }
  }, [scrollOffset]);
  
  return (
    <div
      ref={parentRef}
      className={`overflow-auto ${className}`}
      style={{
        height,
        width,
        position: 'relative'
      }}
      role="list"
      aria-label="Virtualized list"
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.virtualItems.map(virtualRow => {
          const item = items[virtualRow.index];
          return (
            <div
              key={keyExtractor(item, virtualRow.index)}
              className={`absolute top-0 left-0 w-full ${itemClassName}`}
              style={{
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`
              }}
              onClick={() => handleItemClick(item, virtualRow.index)}
              role="listitem"
              tabIndex={0}
              data-index={virtualRow.index}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(VirtualizedList) as typeof VirtualizedList;
