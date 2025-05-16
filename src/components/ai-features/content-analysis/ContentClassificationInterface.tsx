import React, { useState } from 'react';
import {
  DocumentTextIcon,
  ArrowPathIcon,
  TagIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CategoryPrediction {
  category: string;
  confidence: number;
  description?: string;
}

interface ClassificationResult {
  id: string;
  contentId: string;
  predictions: CategoryPrediction[];
  createdAt: string;
  modelName?: string;
  modelVersion?: string;
}

interface ContentClassificationInterfaceProps {
  result: ClassificationResult | null;
  contentText: string;
  isLoading: boolean;
  onClassify: (taxonomyId?: string) => Promise<void>;
  onAddCustomCategory: (category: string) => Promise<void>;
  availableTaxonomies?: { id: string; name: string; description?: string }[];
  className?: string;
}

/**
 * Component for classifying content into different categories
 * Provides automatic classification and custom category assignment
 */
const ContentClassificationInterface: React.FC<ContentClassificationInterfaceProps> = ({
  result,
  contentText,
  isLoading,
  onClassify,
  onAddCustomCategory,
  availableTaxonomies = [],
  className = '',
}) => {
  const [selectedTaxonomyId, setSelectedTaxonomyId] = useState<string | undefined>(
    availableTaxonomies.length > 0 ? availableTaxonomies[0].id : undefined
  );
  const [customCategory, setCustomCategory] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [minConfidence, setMinConfidence] = useState(0.1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle classify action
  const handleClassify = async () => {
    setIsClassifying(true);
    try {
      await onClassify(selectedTaxonomyId);
    } catch (error) {
      console.error('Error classifying content:', error);
    } finally {
      setIsClassifying(false);
    }
  };

  // Handle adding custom category
  const handleAddCustomCategory = async () => {
    if (!customCategory.trim()) return;
    
    setIsAddingCategory(true);
    try {
      await onAddCustomCategory(customCategory);
      setCustomCategory('');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error adding custom category:', error);
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Format confidence as percentage
  const formatConfidence = (confidence: number): string => {
    return `${Math.round(confidence * 100)}%`;
  };

  // Get color class based on confidence
  const getConfidenceColorClass = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Get background color class based on confidence
  const getConfidenceBgClass = (confidence: number): string => {
    if (confidence >= 0.8) return 'bg-green-100 dark:bg-green-900/30';
    if (confidence >= 0.6) return 'bg-blue-100 dark:bg-blue-900/30';
    if (confidence >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-gray-100 dark:bg-gray-750';
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get filtered predictions based on confidence threshold
  const getFilteredPredictions = (): CategoryPrediction[] => {
    if (!result) return [];
    return result.predictions
      .filter(prediction => prediction.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  };

  // Truncate content text for preview
  const truncateContentText = (text: string, maxLength = 150): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Content Classification
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Automatically categorize content using AI or assign custom categories
            </p>
          </div>
          {!isLoading && (
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className={`p-1.5 rounded-md ${
                  showAdvancedOptions 
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                    : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                }`}
                title="Advanced options"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                onClick={handleClassify}
                disabled={isClassifying}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isClassifying ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    {result ? 'Reclassify' : 'Classify Content'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Advanced options */}
        {showAdvancedOptions && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md dark:bg-gray-750">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="taxonomy-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Classification Taxonomy
                </label>
                <select
                  id="taxonomy-select"
                  value={selectedTaxonomyId || ''}
                  onChange={(e) => setSelectedTaxonomyId(e.target.value || undefined)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {availableTaxonomies.map((taxonomy) => (
                    <option key={taxonomy.id} value={taxonomy.id}>{taxonomy.name}</option>
                  ))}
                  {availableTaxonomies.length === 0 && (
                    <option value="">Default Taxonomy</option>
                  )}
                </select>
                {selectedTaxonomyId && availableTaxonomies.find(t => t.id === selectedTaxonomyId)?.description && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {availableTaxonomies.find(t => t.id === selectedTaxonomyId)?.description}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confidence Threshold: {formatConfidence(minConfidence)}
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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only show categories with confidence above this threshold
                </p>
              </div>
            </div>
            
            {result?.modelName && (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Model: {result.modelName} {result.modelVersion && `(v${result.modelVersion})`}
              </div>
            )}
          </div>
        )}

        {/* Content snippet */}
        <div className="bg-gray-50 p-3 rounded-md mb-6 dark:bg-gray-750">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400">
            Content Preview
          </h4>
          <p className="text-sm text-gray-700 line-clamp-3 dark:text-gray-300">
            {truncateContentText(contentText)}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : !result ? (
          <div className="text-center py-10 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 dark:bg-gray-750 dark:border-gray-700">
            <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No classification yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Run classification to categorize this content automatically.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleClassify}
                disabled={isClassifying}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isClassifying ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    Classify Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Classification results */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 flex items-center mb-3 dark:text-gray-300">
                <TagIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                Detected Categories
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  (Classified {formatDate(result.createdAt)})
                </span>
              </h4>
              
              {getFilteredPredictions().length > 0 ? (
                <div className="space-y-3">
                  {getFilteredPredictions().map((prediction, index) => (
                    <div 
                      key={index}
                      className={`${getConfidenceBgClass(prediction.confidence)} rounded-lg p-3 flex justify-between items-center`}
                    >
                      <div>
                        <h5 className={`text-sm font-medium ${getConfidenceColorClass(prediction.confidence)}`}>
                          {prediction.category}
                        </h5>
                        {prediction.description && (
                          <p className="text-xs text-gray-600 mt-0.5 dark:text-gray-400">
                            {prediction.description}
                          </p>
                        )}
                      </div>
                      <div className={`text-sm font-medium ${getConfidenceColorClass(prediction.confidence)}`}>
                        {formatConfidence(prediction.confidence)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-md dark:bg-gray-750 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No categories with confidence above the threshold.
                    {minConfidence > 0.1 && " Try lowering the confidence threshold."}
                  </p>
                </div>
              )}
            </div>
            
            {/* Add custom category */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 flex items-center mb-3 dark:text-gray-300">
                <PlusIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                Add Custom Category
              </h4>
              
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter a custom category..."
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {showSuccessMessage && (
                    <div className="absolute inset-y-0 right-3 flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  disabled={!customCategory.trim() || isAddingCategory}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {isAddingCategory ? (
                    <ArrowPathIcon className="animate-spin h-4 w-4" />
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentClassificationInterface;
