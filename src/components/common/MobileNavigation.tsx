import React, { useState } from 'react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import GestureHandler from './GestureHandler';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  current: boolean;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  onNavigate: (itemId: string) => void;
  title?: string;
  logo?: React.ReactNode;
}

/**
 * Mobile-optimized navigation component
 * Features slide-out drawer, larger touch targets, and gesture support
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navigationItems,
  onNavigate,
  title = 'Application',
  logo
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (itemId: string) => {
    onNavigate(itemId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile navigation header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {logo && <div className="mr-3">{logo}</div>}
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h1>
          </div>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer with gesture support */}
      <GestureHandler
        onSwipeLeft={() => isOpen && setIsOpen(false)}
        className={`fixed inset-0 z-40 transform transition ease-in-out duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        ></div>
        
        <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800 shadow-xl">
          <div className="absolute top-0 right-0 pt-2 pr-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-shrink-0 flex items-center px-4">
            {logo && <div className="mr-3">{logo}</div>}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2">
              <ul className="space-y-1" role="menu" aria-orientation="vertical" aria-labelledby="mobile-menu-button">
                {navigationItems.map((item) => (
                  <li key={item.id} role="none">
                    <button
                      onClick={() => handleNavigate(item.id)}
                      className={`
                        group w-full flex items-center py-4 px-3 text-base font-medium rounded-md
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800
                        ${
                          item.current
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                      role="menuitem"
                      aria-current={item.current ? 'page' : undefined}
                    >
                      <item.icon
                        className={`
                          mr-4 flex-shrink-0 h-6 w-6
                          ${
                            item.current
                              ? 'text-indigo-600 dark:text-indigo-300'
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                          }
                        `}
                        aria-hidden="true"
                      />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
