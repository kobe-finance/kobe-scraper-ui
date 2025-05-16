import React, { useState } from 'react';
import { 
  PlusIcon, 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';
import { NestedPattern, Pattern, PatternType } from '../types';
import PatternTypeSelector from '../PatternTypeSelector';

interface NestedPatternFormProps {
  pattern: NestedPattern;
  onChange: (updates: Partial<NestedPattern>) => void;
  errors: Record<string, string>;
}

/**
 * Form component for configuring nested pattern extraction
 * Allows building hierarchical patterns for complex data structures
 */
const NestedPatternForm: React.FC<NestedPatternFormProps> = ({
  pattern,
  onChange,
  errors,
}) => {
  const [expandedChildIndex, setExpandedChildIndex] = useState<number | null>(null);

  // Common root selector examples
  const rootExamples = [
    { selector: '.product-card', description: 'Product cards' },
    { selector: '.search-result-item', description: 'Search result items' },
    { selector: 'article', description: 'Article elements' },
    { selector: '.user-profile', description: 'User profile containers' },
    { selector: '.review-item', description: 'Review items' },
  ];

  // Add a new child pattern
  const addChildPattern = (type: PatternType = 'text') => {
    const newChildId = `child_${Date.now()}`;
    
    // Create a basic child pattern of the selected type
    let newChild: any = {
      id: newChildId,
      name: `Child Pattern ${pattern.children.length + 1}`,
      type,
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add type-specific properties
    switch (type) {
      case 'text':
        newChild = {
          ...newChild,
          content: '',
          isCaseSensitive: false,
          isWholeWord: false,
        };
        break;
      case 'regex':
        newChild = {
          ...newChild,
          expression: '',
          flags: 'gi',
          groups: [],
        };
        break;
      case 'css':
        newChild = {
          ...newChild,
          selector: '',
          multiple: true,
        };
        break;
      case 'xpath':
        newChild = {
          ...newChild,
          path: '',
          multiple: true,
        };
        break;
      case 'attribute':
        newChild = {
          ...newChild,
          elementSelector: '',
          attributeName: '',
        };
        break;
    }
    
    onChange({
      children: [...pattern.children, newChild],
    });
    
    // Expand the newly added child
    setExpandedChildIndex(pattern.children.length);
  };

  // Remove a child pattern
  const removeChildPattern = (index: number) => {
    const newChildren = [...pattern.children];
    newChildren.splice(index, 1);
    onChange({ children: newChildren });
    
    // Adjust expanded index if needed
    if (expandedChildIndex === index) {
      setExpandedChildIndex(null);
    } else if (expandedChildIndex !== null && expandedChildIndex > index) {
      setExpandedChildIndex(expandedChildIndex - 1);
    }
  };

  // Update a child pattern
  const updateChildPattern = (index: number, updates: Partial<Pattern>) => {
    const newChildren = [...pattern.children];
    newChildren[index] = {
      ...newChildren[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    onChange({ children: newChildren });
  };

  // Move a child pattern up or down
  const moveChildPattern = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === pattern.children.length - 1)
    ) {
      return;
    }
    
    const newChildren = [...pattern.children];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the items
    [newChildren[index], newChildren[newIndex]] = [
      newChildren[newIndex],
      newChildren[index],
    ];
    
    onChange({ children: newChildren });
    
    // Adjust expanded index if needed
    if (expandedChildIndex === index) {
      setExpandedChildIndex(newIndex);
    } else if (expandedChildIndex === newIndex) {
      setExpandedChildIndex(index);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="root-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Root Selector
        </label>
        <div className="mt-1">
          <input
            id="root-selector"
            type="text"
            value={pattern.rootSelector}
            onChange={(e) => onChange({ rootSelector: e.target.value })}
            className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:text-white ${
              errors.rootSelector ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g. .product-card, article, .search-result"
          />
          {errors.rootSelector && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rootSelector}</p>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          CSS selector for the container elements that hold the nested data
        </p>
      </div>

      {/* Quick root examples */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Root Examples (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {rootExamples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange({ rootSelector: example.selector })}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
              title={example.description}
            >
              {example.selector}
            </button>
          ))}
        </div>
      </div>

      {/* Child patterns */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Child Patterns
          </h3>
          
          {errors.children && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.children}</p>
          )}
        </div>

        {pattern.children.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No child patterns defined. Add patterns to extract data from each matched container.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pattern.children.map((child, index) => (
              <div 
                key={child.id} 
                className="border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {/* Child pattern header */}
                <div 
                  className={`flex items-center justify-between px-4 py-3 ${
                    expandedChildIndex === index 
                      ? 'bg-gray-50 dark:bg-gray-750' 
                      : 'border-b border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setExpandedChildIndex(expandedChildIndex === index ? null : index)}
                      className="inline-flex items-center mr-2 text-gray-500 dark:text-gray-400"
                    >
                      {expandedChildIndex === index ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2 dark:text-gray-300">
                        {child.name}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {child.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => updateChildPattern(index, { isEnabled: !child.isEnabled })}
                      className={`p-1 rounded-md text-xs ${
                        child.isEnabled
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {child.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => moveChildPattern(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:text-gray-400"
                      title="Move up"
                    >
                      <ChevronUpIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => moveChildPattern(index, 'down')}
                      disabled={index === pattern.children.length - 1}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 dark:text-gray-400"
                      title="Move down"
                    >
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeChildPattern(index)}
                      className="p-1 rounded-md hover:bg-red-100 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400"
                      title="Remove child pattern"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Expanded child pattern content */}
                {expandedChildIndex === index && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div>
                        <label 
                          htmlFor={`child-name-${index}`} 
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            id={`child-name-${index}`}
                            type="text"
                            value={child.name}
                            onChange={(e) => updateChildPattern(index, { name: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Pattern Type
                        </label>
                        <div className="mt-1">
                          <PatternTypeSelector
                            selectedType={child.type}
                            onChange={(type) => {
                              if (
                                type !== child.type &&
                                confirm(
                                  'Changing pattern type will reset this child pattern. Continue?'
                                )
                              ) {
                                // Remove this child and add a new one of the selected type
                                removeChildPattern(index);
                                addChildPattern(type);
                              }
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Type-specific fields based on child type */}
                      <div className="bg-gray-50 p-4 rounded-md dark:bg-gray-750">
                        {child.type === 'text' && (
                          <div>
                            <label 
                              htmlFor={`child-text-${index}`} 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Text to Match
                            </label>
                            <div className="mt-1">
                              <textarea
                                id={`child-text-${index}`}
                                rows={2}
                                value={child.content}
                                onChange={(e) => updateChildPattern(index, { content: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {child.type === 'regex' && (
                          <div>
                            <label 
                              htmlFor={`child-regex-${index}`} 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Regular Expression
                            </label>
                            <div className="mt-1">
                              <input
                                id={`child-regex-${index}`}
                                type="text"
                                value={child.expression}
                                onChange={(e) => updateChildPattern(index, { expression: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {child.type === 'css' && (
                          <div>
                            <label 
                              htmlFor={`child-css-${index}`} 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              CSS Selector
                            </label>
                            <div className="mt-1">
                              <input
                                id={`child-css-${index}`}
                                type="text"
                                value={child.selector}
                                onChange={(e) => updateChildPattern(index, { selector: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {child.type === 'xpath' && (
                          <div>
                            <label 
                              htmlFor={`child-xpath-${index}`} 
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              XPath Expression
                            </label>
                            <div className="mt-1">
                              <input
                                id={`child-xpath-${index}`}
                                type="text"
                                value={child.path}
                                onChange={(e) => updateChildPattern(index, { path: e.target.value })}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                            </div>
                          </div>
                        )}
                        
                        {child.type === 'attribute' && (
                          <div className="space-y-3">
                            <div>
                              <label 
                                htmlFor={`child-element-${index}`} 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Element Selector
                              </label>
                              <div className="mt-1">
                                <input
                                  id={`child-element-${index}`}
                                  type="text"
                                  value={child.elementSelector}
                                  onChange={(e) => updateChildPattern(index, { elementSelector: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                            </div>
                            <div>
                              <label 
                                htmlFor={`child-attribute-${index}`} 
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Attribute Name
                              </label>
                              <div className="mt-1">
                                <input
                                  id={`child-attribute-${index}`}
                                  type="text"
                                  value={child.attributeName}
                                  onChange={(e) => updateChildPattern(index, { attributeName: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Add child pattern button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => addChildPattern()}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Add Child Pattern
          </button>
        </div>
      </div>

      {/* Nested pattern explanation */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 text-sm text-blue-700 dark:text-blue-300">
            <p>
              Nested patterns extract structured data from repeated elements on a page. First, the root selector finds all container elements. Then, each child pattern extracts specific data from within each container.
            </p>
            <div className="mt-2">
              <p className="font-medium mb-1">Perfect for:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Product cards with titles, prices, and descriptions</li>
                <li>Search results with multiple data points</li>
                <li>Social media posts with author, content, and engagement metrics</li>
                <li>Comments with username, date, and text</li>
                <li>Any list of items with consistent structured data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Pattern Structure Visualization */}
      <div className="mt-4">
        <details className="text-sm">
          <summary className="text-primary-600 cursor-pointer dark:text-primary-400">
            Nested Pattern Structure Example
          </summary>
          
          <div className="mt-2 p-3 bg-gray-50 rounded-md dark:bg-gray-750">
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              This example shows how nested patterns extract structured data from product cards:
            </p>
            
            <div className="border border-gray-300 rounded dark:border-gray-600">
              <div className="bg-white p-3 font-mono text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                <pre>{`<div class="products-grid">
  <div class="product-card">  <!-- Root Selector -->
    <h3 class="product-title">Smartphone X</h3>  <!-- Child: CSS selector ".product-title" -->
    <span class="price">$699</span>  <!-- Child: CSS selector ".price" -->
    <div class="rating">4.5/5</div>  <!-- Child: CSS selector ".rating" -->
  </div>
  
  <div class="product-card">  <!-- Root Selector -->
    <h3 class="product-title">Laptop Pro</h3>  <!-- Child: CSS selector ".product-title" -->
    <span class="price">$1299</span>  <!-- Child: CSS selector ".price" -->
    <div class="rating">4.8/5</div>  <!-- Child: CSS selector ".rating" -->
  </div>
  
  <div class="product-card">  <!-- Root Selector -->
    <h3 class="product-title">Wireless Earbuds</h3>  <!-- Child: CSS selector ".product-title" -->
    <span class="price">$129</span>  <!-- Child: CSS selector ".price" -->
    <div class="rating">4.2/5</div>  <!-- Child: CSS selector ".rating" -->
  </div>
</div>`}</pre>
              </div>
            </div>
            
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
              Output will be structured as an array of objects, with each object containing the child pattern results:
            </p>
            
            <div className="mt-2 border border-gray-300 rounded dark:border-gray-600">
              <div className="bg-white p-3 font-mono text-xs text-gray-700 overflow-x-auto dark:bg-gray-800 dark:text-gray-300">
                <pre>{`[
  {
    "title": "Smartphone X",
    "price": "$699",
    "rating": "4.5/5"
  },
  {
    "title": "Laptop Pro",
    "price": "$1299",
    "rating": "4.8/5"
  },
  {
    "title": "Wireless Earbuds",
    "price": "$129",
    "rating": "4.2/5"
  }
]`}</pre>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default NestedPatternForm;
