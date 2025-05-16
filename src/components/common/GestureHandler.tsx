import React, { useRef, useEffect, ReactNode } from 'react';

interface GestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  className?: string;
}

/**
 * GestureHandler component for detecting touch gestures
 * Supports swipe left, right, up, and down gestures
 */
const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  className = '',
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      // Check if the swipe was horizontal or vertical
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe) {
        if (deltaX > swipeThreshold && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < -swipeThreshold && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        if (deltaY > swipeThreshold && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < -swipeThreshold && onSwipeUp) {
          onSwipeUp();
        }
      }

      touchStartRef.current = null;
    };

    const el = document.getElementById('gesture-container');
    if (el) {
      el.addEventListener('touchstart', handleTouchStart);
      el.addEventListener('touchend', handleTouchEnd);

      return () => {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold]);

  return (
    <div id="gesture-container" className={className}>
      {children}
    </div>
  );
};

export default GestureHandler;
