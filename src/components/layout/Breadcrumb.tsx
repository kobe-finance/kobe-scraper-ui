import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Dynamic breadcrumb component that automatically generates
 * breadcrumb navigation based on the current route
 */
const Breadcrumb: React.FC = () => {
  const location = useLocation();
  
  // Skip rendering breadcrumbs on the home page
  if (location.pathname === '/') {
    return null;
  }
  
  // Split the path into segments and filter out empty segments
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Skip rendering if there are no valid segments
  if (pathSegments.length === 0) {
    return null;
  }
  
  // Format a segment for display (capitalize and remove hyphens)
  const formatSegment = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm font-medium">
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathSegments.map((segment, index) => {
          // Build the URL for this breadcrumb
          const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
          // Check if this is the last segment
          const isLast = index === pathSegments.length - 1;
          
          return (
            <li key={segment}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                
                {isLast ? (
                  <span className="ml-1 text-gray-700 dark:text-gray-300">
                    {formatSegment(segment)}
                  </span>
                ) : (
                  <Link
                    to={url}
                    className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {formatSegment(segment)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
