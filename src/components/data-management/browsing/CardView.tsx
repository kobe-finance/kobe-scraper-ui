import React, { useState, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface CardViewProps<T extends object> {
  data: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  height?: number;
  cardHeight?: number;
  cardsPerRow?: number;
  className?: string;
  onCardClick?: (item: T) => void;
  selectedItemId?: string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * A responsive card view component with virtualization for handling large datasets
 * Displays data in a grid of cards instead of a table
 */
function CardView<T extends object>({
  data,
  renderCard,
  height = 600,
  cardHeight = 220,
  cardsPerRow = 3,
  className = '',
  onCardClick,
  selectedItemId,
  isLoading = false,
  emptyMessage = 'No data available'
}: CardViewProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);
  
  // Update parent width on resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };
    
    // Initial width calculation
    updateWidth();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);
  
  // Adjust cardsPerRow based on container width
  const responsiveCardsPerRow = React.useMemo(() => {
    if (parentWidth < 640) return 1; // Small screens
    if (parentWidth < 768) return 2; // Medium screens
    return cardsPerRow; // Large screens
  }, [parentWidth, cardsPerRow]);
  
  // Calculate row count
  const rowCount = Math.ceil(data.length / responsiveCardsPerRow);
  
  // Set up row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => containerRef.current,
    estimateSize: () => cardHeight + 16, // Add gap
    overscan: 5,
  });
  
  // Rendering loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Rendering empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-32 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      style={{ height, overflowY: 'auto' }} 
      className={`w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <div 
        className="relative w-full"
        style={{ height: `${rowCount * (cardHeight + 16)}px` }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const rowStartIndex = virtualRow.index * responsiveCardsPerRow;
          
          return (
            <div
              key={virtualRow.index}
              className="absolute w-full grid gap-4"
              style={{
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
                gridTemplateColumns: `repeat(${responsiveCardsPerRow}, minmax(0, 1fr))`,
                height: `${cardHeight}px`,
              }}
            >
              {Array.from({ length: responsiveCardsPerRow }).map((_, colIndex) => {
                const dataIndex = rowStartIndex + colIndex;
                if (dataIndex >= data.length) return null;
                
                const item = data[dataIndex];
                const isSelected = 
                  selectedItemId !== undefined && 
                  'id' in item && 
                  item.id === selectedItemId;
                
                return (
                  <div 
                    key={dataIndex}
                    onClick={() => onCardClick && onCardClick(item)}
                    className={`${onCardClick ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    {renderCard(item, dataIndex)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardView;
