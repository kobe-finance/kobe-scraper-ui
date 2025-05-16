import React, { useState } from 'react';
import {
  HashtagIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface Keyword {
  text: string;
  score: number;
  type?: string;
  occurrences?: number;
}

interface KeywordExtractionResult {
  id: string;
  contentId: string;
  keywords: Keyword[];
  createdAt: string;
  algorithm?: string;
}

interface KeywordExtractionToolsProps {
  result: KeywordExtractionResult | null;
  contentText: string;
  isLoading: boolean;
  onExtract: (options?: { limit?: number; minScore?: number }) => Promise<void>;
  className?: string;
}

/**
 * Component for extracting and analyzing keywords from content
 * Shows keyword lists, relevance scores, and visualization options
 */
const KeywordExtractionTools: React.FC<KeywordExtractionToolsProps> = ({
  result,
  contentText,
  isLoading,
  onExtract,
  className = '',
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [keywordLimit, setKeywordLimit] = useState(20);
  const [minScore, setMinScore] = useState(0.1);
  const [viewMode, setViewMode] = useState<'list' | 'cloud' | 'chart'>('list');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  // Handle extract action
  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      await onExtract({ limit: keywordLimit, minScore });
    } catch (error) {
      console.error('Error extracting keywords:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  // Copy keywords to clipboard
  const copyToClipboard = () => {
    if (!result) return;
    
    const keywordText = result.keywords
      .map(k => `${k.text} (${formatScore(k.score)})`)
      .join('\n');
    
    navigator.clipboard.writeText(keywordText).then(() => {
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    });
  };

  // Format score as percentage
  const formatScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  // Get color class based on score
  const getScoreColorClass = (score: number): string => {
    if (score >= 0.7) return 'text-green-600 dark:text-green-400';
    if (score >= 0.4) return 'text-blue-600 dark:text-blue-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  // Get background color class based on score
  const getScoreBgClass = (score: number): string => {
    if (score >= 0.7) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 0.4) return 'bg-blue-100 dark:bg-blue-900/30';
    return 'bg-gray-100 dark:bg-gray-750';
  };

  // Calculate font size for keyword cloud based on score
  const getFontSizeForCloud = (score: number): number => {
    const minSize = 0.75;
    const maxSize = 2;
    return minSize + (maxSize - minSize) * score;
  };

  // Get filtered keywords based on min score
  const getFilteredKeywords = (): Keyword[] => {
    if (!result) return [];
    
    return result.keywords
      .filter(keyword => keyword.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, keywordLimit);
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <HashtagIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Keyword Extraction
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Extract and analyze key terms and phrases from content
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            {!isLoading && (
              <>
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className={`p-1.5 rounded-md ${
                    showOptions 
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' 
                      : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
                  }`}
                  title="Extraction options"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={isExtracting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  {isExtracting ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                      {result ? 'Refresh Keywords' : 'Extract Keywords'}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Extraction options */}
        {showOptions && (
          <div className="mb-6 bg-gray-50 p-4 rounded-md dark:bg-gray-750">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="keyword-limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Keyword Limit
                </label>
                <select
                  id="keyword-limit"
                  value={keywordLimit}
                  onChange={(e) => setKeywordLimit(Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={10}>10 keywords</option>
                  <option value={20}>20 keywords</option>
                  <option value={50}>50 keywords</option>
                  <option value={100}>100 keywords</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum Score: {formatScore(minScore)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.05"
                  value={minScore}
                  onChange={(e) => setMinScore(parseFloat(e.target.value))}
                  className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3 dark:text-gray-300">View Mode:</span>
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md border ${
                    viewMode === 'list'
                      ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                  }`}
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cloud')}
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium border-t border-b ${
                    viewMode === 'cloud'
                      ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                  }`}
                >
                  Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('chart')}
                  className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md border ${
                    viewMode === 'chart'
                      ? 'bg-primary-50 text-primary-700 border-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-650'
                  }`}
                >
                  Chart
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : !result ? (
          <div className="text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 dark:bg-gray-750 dark:border-gray-700">
            <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No keywords extracted</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Extract keywords to identify important terms and phrases in this content.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isExtracting ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    Extract Keywords
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Keywords header with copy button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getFilteredKeywords().length} keywords extracted
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(result.createdAt)}
                </span>
              </div>
              
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {showCopiedNotification ? (
                  <>
                    <CheckIcon className="mr-1 h-3 w-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="mr-1 h-3 w-3" />
                    Copy All
                  </>
                )}
              </button>
            </div>
            
            {/* Keywords display based on view mode */}
            {getFilteredKeywords().length > 0 ? (
              <div className="bg-white rounded-lg border p-4 dark:bg-gray-750 dark:border-gray-700">
                {viewMode === 'list' && (
                  <div className="space-y-2">
                    {getFilteredKeywords().map((keyword, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {keyword.text}
                          </span>
                          {keyword.type && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              {keyword.type}
                            </span>
                          )}
                        </div>
                        <div className={`text-sm font-medium ${getScoreColorClass(keyword.score)}`}>
                          {formatScore(keyword.score)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {viewMode === 'cloud' && (
                  <div className="flex flex-wrap gap-2 justify-center py-4">
                    {getFilteredKeywords().map((keyword, index) => (
                      <div 
                        key={index}
                        className={`px-2 py-1 rounded-full ${getScoreBgClass(keyword.score)}`}
                        style={{ fontSize: `${getFontSizeForCloud(keyword.score)}rem` }}
                      >
                        <span className={getScoreColorClass(keyword.score)}>{keyword.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {viewMode === 'chart' && (
                  <div className="space-y-2">
                    {getFilteredKeywords().slice(0, 10).map((keyword, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {keyword.text}
                          </span>
                          <span className={`text-xs font-medium ${getScoreColorClass(keyword.score)}`}>
                            {formatScore(keyword.score)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className={`h-2 rounded-full ${
                              keyword.score >= 0.7 
                                ? 'bg-green-500 dark:bg-green-600'
                                : keyword.score >= 0.4
                                ? 'bg-blue-500 dark:bg-blue-600'
                                : 'bg-gray-400 dark:bg-gray-500'
                            }`}
                            style={{ width: `${keyword.score * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-md dark:bg-gray-750 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No keywords with confidence above the threshold.
                  {minScore > 0.1 && " Try lowering the minimum score."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordExtractionTools;
