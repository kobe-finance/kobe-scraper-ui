import React, { useState } from 'react';
import {
  UserIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArrowPathIcon,
  SparklesIcon,
  Squares2X2Icon,
  ListBulletIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface Entity {
  id: string;
  text: string;
  type: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  metadata?: Record<string, any>;
}

interface EntityGroup {
  type: string;
  count: number;
  entities: Entity[];
}

interface EntityRecognitionResult {
  id: string;
  contentId: string;
  entities: Entity[];
  createdAt: string;
}

interface EntityRecognitionVisualizationProps {
  result: EntityRecognitionResult | null;
  contentText: string;
  isLoading: boolean;
  onAnalyze: () => Promise<void>;
  className?: string;
}

/**
 * Component for visualizing named entities in extracted content
 * Highlights entities in text and provides filters and categorization
 */
const EntityRecognitionVisualization: React.FC<EntityRecognitionVisualizationProps> = ({
  result,
  contentText,
  isLoading,
  onAnalyze,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'highlight' | 'list'>('highlight');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle analyze action
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await onAnalyze();
    } catch (error) {
      console.error('Error analyzing entities:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get entities filtered by type and confidence
  const getFilteredEntities = (): Entity[] => {
    if (!result) return [];
    
    return result.entities.filter(entity => {
      const typeMatches = !filterType || entity.type === filterType;
      const confidenceMatches = entity.confidence >= minConfidence;
      return typeMatches && confidenceMatches;
    });
  };

  // Group entities by type
  const getEntityGroups = (): EntityGroup[] => {
    if (!result) return [];
    
    const entityMap = new Map<string, Entity[]>();
    
    result.entities.forEach(entity => {
      if (entity.confidence >= minConfidence) {
        if (!entityMap.has(entity.type)) {
          entityMap.set(entity.type, []);
        }
        entityMap.get(entity.type)!.push(entity);
      }
    });
    
    return Array.from(entityMap.entries()).map(([type, entities]) => ({
      type,
      count: entities.length,
      entities,
    })).sort((a, b) => b.count - a.count);
  };

  // Get unique entity types from result
  const getEntityTypes = (): string[] => {
    if (!result) return [];
    
    const types = new Set<string>();
    result.entities.forEach(entity => types.add(entity.type));
    
    return Array.from(types);
  };

  // Get icon for entity type
  const getEntityTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'person':
        return <UserIcon className="h-4 w-4" />;
      case 'organization':
      case 'company':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'location':
      case 'place':
        return <GlobeAltIcon className="h-4 w-4" />;
      case 'date':
      case 'time':
        return <CalendarIcon className="h-4 w-4" />;
      case 'money':
      case 'currency':
        return <CurrencyDollarIcon className="h-4 w-4" />;
      default:
        return <TagIcon className="h-4 w-4" />;
    }
  };

  // Get color class for entity type
  const getEntityTypeColorClass = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'person':
        return 'text-blue-600 dark:text-blue-400';
      case 'organization':
      case 'company':
        return 'text-purple-600 dark:text-purple-400';
      case 'location':
      case 'place':
        return 'text-green-600 dark:text-green-400';
      case 'date':
      case 'time':
        return 'text-amber-600 dark:text-amber-400';
      case 'money':
      case 'currency':
        return 'text-emerald-600 dark:text-emerald-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Get background color class for entity type
  const getEntityTypeBgClass = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'person':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'organization':
      case 'company':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case 'location':
      case 'place':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'date':
      case 'time':
        return 'bg-amber-100 dark:bg-amber-900/30';
      case 'money':
      case 'currency':
        return 'bg-emerald-100 dark:bg-emerald-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  // Get border color class for entity type
  const getEntityTypeBorderClass = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'person':
        return 'border-blue-200 dark:border-blue-900';
      case 'organization':
      case 'company':
        return 'border-purple-200 dark:border-purple-900';
      case 'location':
      case 'place':
        return 'border-green-200 dark:border-green-900';
      case 'date':
      case 'time':
        return 'border-amber-200 dark:border-amber-900';
      case 'money':
      case 'currency':
        return 'border-emerald-200 dark:border-emerald-900';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format confidence percentage
  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  // Render text with highlighted entities
  const renderHighlightedText = (): React.ReactNode => {
    if (!result || !contentText) return contentText;
    
    const filteredEntities = getFilteredEntities()
      .sort((a, b) => a.startIndex - b.startIndex);
    
    if (filteredEntities.length === 0) return contentText;
    
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    
    filteredEntities.forEach((entity, index) => {
      if (entity.startIndex > lastIndex) {
        segments.push(contentText.substring(lastIndex, entity.startIndex));
      }
      
      const entityText = contentText.substring(entity.startIndex, entity.endIndex);
      
      segments.push(
        <span 
          key={`entity-${index}`}
          className={`${getEntityTypeBgClass(entity.type)} px-1 rounded-sm ${getEntityTypeColorClass(entity.type)} cursor-help`}
          title={`${entity.type} (${formatConfidence(entity.confidence)})`}
        >
          {entityText}
        </span>
      );
      
      lastIndex = entity.endIndex;
    });
    
    if (lastIndex < contentText.length) {
      segments.push(contentText.substring(lastIndex));
    }
    
    return <>{segments}</>;
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Entity Recognition
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Identify and categorize named entities in the content
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {/* View mode selector */}
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setViewMode('highlight')}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                  viewMode === 'highlight'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4 mr-1" />
                Highlight
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md border ${
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                }`}
              >
                <ListBulletIcon className="h-4 w-4 mr-1" />
                List
              </button>
            </div>
            
            {!isLoading && (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-1 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-1 h-4 w-4" />
                    {result ? 'Refresh' : 'Analyze'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : !result ? (
          <div className="text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 dark:bg-gray-750 dark:border-gray-700">
            <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No entity analysis yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Run entity recognition to identify people, organizations, locations, and more in this content.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    Run Entity Recognition
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <label htmlFor="entity-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filter by Type
                  </label>
                  <select
                    id="entity-type-filter"
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {getEntityTypes().map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minimum Confidence: {formatConfidence(minConfidence)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={minConfidence}
                    onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                    className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {getEntityGroups().map((group) => (
                  <button
                    key={group.type}
                    type="button"
                    onClick={() => setFilterType(filterType === group.type ? null : group.type)}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${
                      filterType === group.type
                        ? `${getEntityTypeBgClass(group.type)} ${getEntityTypeColorClass(group.type)}`
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-650 dark:text-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center">
                      {getEntityTypeIcon(group.type)}
                      <span className="ml-1">{group.type}</span>
                    </span>
                    <span className="ml-1.5 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs dark:bg-gray-600 dark:text-gray-200">
                      {group.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Analysis date */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Analyzed {formatDate(result.createdAt)} • Found {result.entities.length} entities
            </div>
            
            {/* Entity display */}
            {viewMode === 'highlight' ? (
              <div className="bg-white rounded-lg border p-4 dark:bg-gray-750 dark:border-gray-700">
                <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200">
                  {renderHighlightedText()}
                </div>
                
                {getFilteredEntities().length === 0 && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No entities match the current filters.
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg border dark:bg-gray-750 dark:border-gray-700">
                {getEntityGroups().length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getEntityGroups().map((group) => (
                      <div key={group.type} className="p-4">
                        <div className="flex items-center mb-3">
                          <div className={`p-1.5 rounded-md ${getEntityTypeBgClass(group.type)}`}>
                            {getEntityTypeIcon(group.type)}
                          </div>
                          <h4 className={`ml-2 text-sm font-medium ${getEntityTypeColorClass(group.type)}`}>
                            {group.type}
                            <span className="ml-1.5 text-gray-500 font-normal dark:text-gray-400">
                              ({group.count} {group.count === 1 ? 'entity' : 'entities'})
                            </span>
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {group.entities
                            .filter(entity => entity.confidence >= minConfidence)
                            .map((entity) => (
                              <div 
                                key={entity.id} 
                                className={`p-2 rounded border ${getEntityTypeBorderClass(group.type)}`}
                              >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {entity.text}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  Confidence: {formatConfidence(entity.confidence)}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No entities match the current filters.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityRecognitionVisualization;
