import React, { useState } from 'react';
import {
  FaceSmileIcon,
  FaceFrownIcon,
  ArrowPathIcon,
  ChartBarIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  MinusIcon,
  ChevronDownIcon,
  ChevronDoubleDownIcon,
  SparklesIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
  compound: number;
}

interface SentimentAnalysis {
  id: string;
  contentId: string;
  score: SentimentScore;
  createdAt: string;
  sentences?: {
    text: string;
    score: SentimentScore;
  }[];
  keywords?: {
    word: string;
    score: number;
  }[];
}

interface SentimentAnalysisDisplayProps {
  analysis: SentimentAnalysis | null;
  contentText: string;
  isLoading: boolean;
  onAnalyze: () => Promise<void>;
  className?: string;
}

/**
 * Component for displaying sentiment analysis results for content
 * Shows overall sentiment scores and sentence-level breakdowns
 */
const SentimentAnalysisDisplay: React.FC<SentimentAnalysisDisplayProps> = ({
  analysis,
  contentText,
  isLoading,
  onAnalyze,
  className = '',
}) => {
  const [showSentenceBreakdown, setShowSentenceBreakdown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle analyze action
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await onAnalyze();
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get sentiment label based on compound score
  const getSentimentLabel = (score: number): string => {
    if (score >= 0.6) return 'Very Positive';
    if (score >= 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.6) return 'Negative';
    return 'Very Negative';
  };

  // Get sentiment icon based on compound score
  const getSentimentIcon = (score: number) => {
    if (score >= 0.2) {
      return <FaceSmileIcon className="h-5 w-5 text-green-500 dark:text-green-400" />;
    } else if (score <= -0.2) {
      return <FaceFrownIcon className="h-5 w-5 text-red-500 dark:text-red-400" />;
    } else {
      return <MinusIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  // Get color class based on sentiment score
  const getSentimentColorClass = (score: number): string => {
    if (score >= 0.6) return 'text-green-600 dark:text-green-400';
    if (score >= 0.2) return 'text-green-500 dark:text-green-400';
    if (score > -0.2) return 'text-gray-600 dark:text-gray-400';
    if (score > -0.6) return 'text-red-500 dark:text-red-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Get background color class based on sentiment score
  const getSentimentBgClass = (score: number): string => {
    if (score >= 0.6) return 'bg-green-100 dark:bg-green-900/30';
    if (score >= 0.2) return 'bg-green-50 dark:bg-green-900/20';
    if (score > -0.2) return 'bg-gray-50 dark:bg-gray-800';
    if (score > -0.6) return 'bg-red-50 dark:bg-red-900/20';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  // Get trend icon based on sentiment score
  const getTrendIcon = (score: number) => {
    if (score >= 0.6) {
      return <ChevronDoubleUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
    } else if (score >= 0.2) {
      return <ChevronUpIcon className="h-4 w-4 text-green-500 dark:text-green-400" />;
    } else if (score > -0.2) {
      return <MinusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    } else if (score > -0.6) {
      return <ChevronDownIcon className="h-4 w-4 text-red-500 dark:text-red-400" />;
    } else {
      return <ChevronDoubleDownIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
    }
  };

  // Format score as percentage
  const formatScorePercentage = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  // Calculate sentiment distribution for visualization
  const calculateDistribution = (score: SentimentScore) => {
    const total = score.positive + score.negative + score.neutral;
    return {
      positive: total > 0 ? (score.positive / total) * 100 : 0,
      negative: total > 0 ? (score.negative / total) * 100 : 0,
      neutral: total > 0 ? (score.neutral / total) * 100 : 0,
    };
  };

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Highlight sentiment in text
  const highlightSentiment = (text: string, score: number): React.ReactNode => {
    return (
      <span className={`${getSentimentBgClass(score)} px-1 py-0.5 rounded ${getSentimentColorClass(score)}`}>
        {text}
      </span>
    );
  };

  // Creates a visual sentiment bar
  const renderSentimentBar = (score: SentimentScore) => {
    const distribution = calculateDistribution(score);
    
    return (
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div
          className="h-full bg-green-500 float-left dark:bg-green-600"
          style={{ width: `${distribution.positive}%` }}
        ></div>
        <div
          className="h-full bg-gray-400 float-left dark:bg-gray-500"
          style={{ width: `${distribution.neutral}%` }}
        ></div>
        <div
          className="h-full bg-red-500 float-left dark:bg-red-600"
          style={{ width: `${distribution.negative}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm dark:bg-gray-800 dark:border-gray-700 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
              <FaceSmileIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Sentiment Analysis
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Analyze the emotional tone of extracted content
            </p>
          </div>
          {!isLoading && (
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isAnalyzing ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    {analysis ? 'Refresh Analysis' : 'Analyze Sentiment'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : !analysis ? (
          <div className="text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-300 dark:bg-gray-750 dark:border-gray-700">
            <QuestionMarkCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No sentiment analysis yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Run a sentiment analysis to evaluate the emotional tone of this content.
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
                    Analyze Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Sentiment */}
            <div className={`rounded-lg p-4 ${getSentimentBgClass(analysis.score.compound)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getSentimentIcon(analysis.score.compound)}
                  <h4 className={`ml-2 text-lg font-medium ${getSentimentColorClass(analysis.score.compound)}`}>
                    {getSentimentLabel(analysis.score.compound)}
                  </h4>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Analyzed {formatDate(analysis.createdAt)}
                </div>
              </div>
              
              <div className="mt-4">
                {renderSentimentBar(analysis.score)}
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <div>Negative</div>
                  <div>Neutral</div>
                  <div>Positive</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-70 rounded p-2 text-center dark:bg-gray-700 dark:bg-opacity-70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Positive</div>
                  <div className="text-lg font-medium text-green-600 mt-1 dark:text-green-400">
                    {formatScorePercentage(analysis.score.positive)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-70 rounded p-2 text-center dark:bg-gray-700 dark:bg-opacity-70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Neutral</div>
                  <div className="text-lg font-medium text-gray-600 mt-1 dark:text-gray-300">
                    {formatScorePercentage(analysis.score.neutral)}
                  </div>
                </div>
                <div className="bg-white bg-opacity-70 rounded p-2 text-center dark:bg-gray-700 dark:bg-opacity-70">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Negative</div>
                  <div className="text-lg font-medium text-red-600 mt-1 dark:text-red-400">
                    {formatScorePercentage(analysis.score.negative)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Keywords */}
            {analysis.keywords && analysis.keywords.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 dark:text-gray-300 flex items-center">
                  <ChartBarIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                  Sentiment Keywords
                </h4>
                <div className="bg-white rounded-lg border p-4 dark:bg-gray-750 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword, index) => (
                      <div 
                        key={index} 
                        className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${getSentimentBgClass(keyword.score)}`}
                      >
                        <span className={getSentimentColorClass(keyword.score)}>{keyword.word}</span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400">
                          {getTrendIcon(keyword.score)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sentence-level Analysis */}
            {analysis.sentences && analysis.sentences.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowSentenceBreakdown(!showSentenceBreakdown)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
                >
                  <span className="flex items-center">
                    <ChartBarIcon className="h-4 w-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Sentence-level Breakdown
                  </span>
                  {showSentenceBreakdown ? (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                
                {showSentenceBreakdown && (
                  <div className="bg-white rounded-lg border p-4 dark:bg-gray-750 dark:border-gray-700">
                    <div className="space-y-3">
                      {analysis.sentences.map((sentence, index) => (
                        <div key={index} className="pb-3 border-b border-gray-100 last:border-0 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              {getTrendIcon(sentence.score.compound)}
                              <span className={`ml-1 text-xs font-medium ${getSentimentColorClass(sentence.score.compound)}`}>
                                {getSentimentLabel(sentence.score.compound)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{formatScorePercentage(sentence.score.positive)} pos</span>
                              <span>{formatScorePercentage(sentence.score.negative)} neg</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">
                            {highlightSentiment(sentence.text, sentence.score.compound)}
                          </div>
                        </div>
                      ))}
                    </div>
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

export default SentimentAnalysisDisplay;
