import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TagIcon, 
  StarIcon, 
  ClockIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Pattern, PatternLibraryItem } from './types';

interface PatternLibraryProps {
  patterns: PatternLibraryItem[];
  onPatternSelect: (pattern: Pattern) => void;
  onPatternDelete: (patternId: string) => Promise<void>;
  onPatternDuplicate: (pattern: Pattern) => Promise<void>;
  onCreatePattern: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Component for browsing and managing the pattern library
 * Shows patterns by category, usage, and allows searching/filtering
 */
const PatternLibrary: React.FC<PatternLibraryProps> = ({
  patterns,
  onPatternSelect,
  onPatternDelete,
  onPatternDuplicate,
  onCreatePattern,
  isLoading = false,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'updated' | 'usage'>('updated');
  const [filterVerified, setFilterVerified] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique tags from patterns
  const allTags = Array.from(
    new Set(patterns.flatMap((pattern) => pattern.tags))
  ).sort();

  // Filter patterns based on search query and selected tags
  const filteredPatterns = patterns.filter((item) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      item.pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.pattern.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by tags
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => item.tags.includes(tag));

    // Filter by verified status
    const matchesVerified = !filterVerified || item.isVerified;

    return matchesSearch && matchesTags && matchesVerified;
  });

  // Sort patterns based on selected sort option
  const sortedPatterns = [...filteredPatterns].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.pattern.name.localeCompare(b.pattern.name);
      case 'rating':
        return b.rating - a.rating;
      case 'usage':
        return b.usageCount - a.usageCount;
      case 'updated':
      default:
        return new Date(b.pattern.updatedAt).getTime() - new Date(a.pattern.updatedAt).getTime();
    }
  });

  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle pattern deletion with confirmation
  const handleDelete = async (patternId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this pattern? This action cannot be undone.')) {
      await onPatternDelete(patternId);
    }
  };

  // Handle pattern duplication
  const handleDuplicate = async (pattern: Pattern, e: React.MouseEvent) => {
    e.stopPropagation();
    await onPatternDuplicate(pattern);
  };

  // Format date to display how long ago it was updated
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        if (diffMinutes === 0) {
          return 'Just now';
        }
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    } else {
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
    }
  };

  // Get pattern type icon
  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <span className="text-xs">Aa</span>
          </span>
        );
      case 'regex':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            <span className="text-xs">.*</span>
          </span>
        );
      case 'css':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <span className="text-xs">#id</span>
          </span>
        );
      case 'xpath':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            <span className="text-xs">//</span>
          </span>
        );
      case 'attribute':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
            <span className="text-xs">@</span>
          </span>
        );
      case 'table':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            <span className="text-xs">[][]</span>
          </span>
        );
      case 'list':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
            <span className="text-xs">•••</span>
          </span>
        );
      case 'nested':
        return (
          <span className="inline-flex items-center p-1 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
            <span className="text-xs">{ }</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Pattern Library
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Browse, search, and manage your extraction patterns
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              onClick={onCreatePattern}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
              New Pattern
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* Search and filter bar */}
          <div className="sm:flex sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow mb-3 sm:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patterns by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-md ${
                  showFilters 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                title="Show filters"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                }`}
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  {viewMode === 'grid' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Filters and sort options */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Sort options */}
                <div>
                  <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sort by
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="updated">Last Updated</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="usage">Usage Count</option>
                  </select>
                </div>

                {/* Verified filter */}
                <div className="flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="filter-verified"
                      type="checkbox"
                      checked={filterVerified}
                      onChange={(e) => setFilterVerified(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="filter-verified" className="font-medium text-gray-700 dark:text-gray-300">
                      Verified Only
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Show only verified patterns
                    </p>
                  </div>
                </div>
              </div>

              {/* Tag filters */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                  {allTags.length === 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      No tags available
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pattern list/grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : sortedPatterns.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center dark:bg-gray-800 dark:border-gray-700">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No patterns found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery || selectedTags.length > 0 || filterVerified
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating a new pattern'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onCreatePattern}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Pattern
                </button>
              </div>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
              {sortedPatterns.map((item) => (
                <div
                  key={item.pattern.id}
                  onClick={() => onPatternSelect(item.pattern)}
                  className={`group border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow dark:border-gray-700 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-white dark:bg-gray-800 flex items-center'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-2">
                            {getPatternTypeIcon(item.pattern.type)}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.pattern.name}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.pattern.type} pattern
                                {item.isVerified && (
                                  <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Verified</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">{item.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          {item.pattern.description || 'No description provided'}
                        </p>
                        
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTag(tag);
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center dark:bg-gray-750">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon className="h-3.5 w-3.5 mr-1" />
                          {formatDate(item.pattern.updatedAt)}
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(item.pattern, e)}
                            className="p-1 rounded-md hover:bg-gray-200 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
                            title="Duplicate pattern"
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.pattern.id, e)}
                            className="p-1 rounded-md hover:bg-red-100 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400"
                            title="Delete pattern"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full p-3">
                      <div className="flex items-center">
                        {getPatternTypeIcon(item.pattern.type)}
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.pattern.name}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{item.pattern.type} pattern</span>
                            <span className="mx-1.5">•</span>
                            <ClockIcon className="h-3 w-3 mr-0.5" />
                            <span>{formatDate(item.pattern.updatedAt)}</span>
                            {item.isVerified && (
                              <>
                                <span className="mx-1.5">•</span>
                                <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">{item.rating.toFixed(1)}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(item.pattern, e)}
                          className="p-1 rounded-md hover:bg-gray-200 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
                          title="Duplicate pattern"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.pattern.id, e)}
                          className="p-1 rounded-md hover:bg-red-100 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400"
                          title="Delete pattern"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatternLibrary;
