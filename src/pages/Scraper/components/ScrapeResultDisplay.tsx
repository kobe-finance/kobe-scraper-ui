import React, { useState } from 'react';
import { Button } from '../../../components';

interface ScrapeResultDisplayProps {
  result: any;
}

/**
 * Component to display scraping results in a user-friendly format
 */
export const ScrapeResultDisplay: React.FC<ScrapeResultDisplayProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  if (!result) {
    return null;
  }

  const isSuccess = result.status === 'success';
  
  const renderContent = () => {
    if (viewMode === 'raw') {
      return (
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      );
    }
    
    // Handle error state
    if (!isSuccess) {
      return (
        <div className="text-red-500">
          <p className="font-semibold">Error:</p>
          <p>{result.error || 'Unknown error occurred'}</p>
        </div>
      );
    }
    
    // Handle full page content
    if (result.data?.metadata) {
      const { metadata, content, links, media, interactive } = result.data;
      
      return (
        <div className="space-y-6">
          {/* Metadata Section */}
          {metadata && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Page Metadata</h3>
              <div className="grid grid-cols-2 gap-2">
                {metadata.title && (
                  <div>
                    <span className="font-medium">Title:</span> {metadata.title}
                  </div>
                )}
                {metadata.description && (
                  <div>
                    <span className="font-medium">Description:</span> {metadata.description}
                  </div>
                )}
                {metadata.language && (
                  <div>
                    <span className="font-medium">Language:</span> {metadata.language}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Content Section */}
          {content && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Content</h3>
              
              {/* Headings */}
              {content.headings && content.headings.length > 0 && (
                <div>
                  <h4 className="font-medium">Headings:</h4>
                  <ul className="list-disc pl-5">
                    {content.headings.map((heading: any, index: number) => (
                      <li key={index} className={`text-${heading.level === 1 ? 'lg' : 'base'}`}>
                        {heading.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Paragraphs - Show only first 3 */}
              {content.paragraphs && content.paragraphs.length > 0 && (
                <div>
                  <h4 className="font-medium">Paragraphs:</h4>
                  <div className="space-y-2">
                    {content.paragraphs.slice(0, 3).map((paragraph: string, index: number) => (
                      <p key={index} className="text-sm text-gray-700">{paragraph}</p>
                    ))}
                    {content.paragraphs.length > 3 && (
                      <p className="text-sm text-gray-500 italic">
                        {content.paragraphs.length - 3} more paragraphs not shown...
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Lists */}
              {content.lists && content.lists.length > 0 && (
                <div>
                  <h4 className="font-medium">Lists:</h4>
                  <div className="space-y-2">
                    {content.lists.slice(0, 2).map((list: any, index: number) => (
                      <div key={index}>
                        <p className="text-sm font-medium">{list.type === 'ol' ? 'Ordered' : 'Unordered'} List:</p>
                        <ul className={`${list.type === 'ol' ? 'list-decimal' : 'list-disc'} pl-5`}>
                          {list.items.slice(0, 5).map((item: string, idx: number) => (
                            <li key={idx} className="text-sm">{item}</li>
                          ))}
                          {list.items.length > 5 && (
                            <li className="text-sm text-gray-500 italic">
                              {list.items.length - 5} more items...
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tables */}
              {content.tables && content.tables.length > 0 && (
                <div>
                  <h4 className="font-medium">Tables:</h4>
                  <p className="text-sm text-gray-500">
                    {content.tables.length} table(s) found. View raw data to see details.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Links Section */}
          {links && links.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Links</h3>
              <p className="text-sm">{links.length} links found on the page</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {links.slice(0, 10).map((link: any, index: number) => (
                  <li key={index} className="text-sm truncate">
                    <span className="text-blue-500">{link.text || 'Unnamed Link'}</span>: {link.url}
                  </li>
                ))}
                {links.length > 10 && (
                  <li className="text-sm text-gray-500 italic col-span-2">
                    {links.length - 10} more links not shown...
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Media Section */}
          {media && (Object.keys(media).some(key => media[key] && media[key].length > 0)) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Media</h3>
              
              {media.images && media.images.length > 0 && (
                <div>
                  <h4 className="font-medium">Images:</h4>
                  <p className="text-sm">{media.images.length} images found on the page</p>
                </div>
              )}
              
              {media.videos && media.videos.length > 0 && (
                <div>
                  <h4 className="font-medium">Videos:</h4>
                  <p className="text-sm">{media.videos.length} videos found on the page</p>
                </div>
              )}
            </div>
          )}
          
          {/* Interactive Elements */}
          {interactive && (Object.keys(interactive).some(key => interactive[key] && interactive[key].length > 0)) && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold border-b pb-1">Interactive Elements</h3>
              
              {interactive.forms && interactive.forms.length > 0 && (
                <div>
                  <h4 className="font-medium">Forms:</h4>
                  <p className="text-sm">{interactive.forms.length} forms found on the page</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Handle basic scrape results or custom extraction schema
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {result.title && (
            <div>
              <span className="font-medium">Page Title:</span> {result.title}
            </div>
          )}
          {result.content_length && (
            <div>
              <span className="font-medium">Content Length:</span> {result.content_length} bytes
            </div>
          )}
        </div>
        
        {result.data && Object.keys(result.data).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

// Handle full page content
if (result.data?.metadata) {
const { metadata, content, links, media, interactive } = result.data;
  
return (
<div className="space-y-6">
{/* Metadata Section */}
{metadata && (
<div className="space-y-2">
<h3 className="text-lg font-semibold border-b pb-1">Page Metadata</h3>
<div className="grid grid-cols-2 gap-2">
{metadata.title && (
<div>
<span className="font-medium">Title:</span> {metadata.title}
</div>
)}
{metadata.description && (
<div>
<span className="font-medium">Description:</span> {metadata.description}
</div>
)}
{metadata.language && (
<div>
<span className="font-medium">Language:</span> {metadata.language}
</div>
)}
</div>
</div>
)}

{/* Content Section */}
{content && (
<div className="space-y-2">
<h3 className="text-lg font-semibold border-b pb-1">Content</h3>
  
{/* Headings */}
{content.headings && content.headings.length > 0 && (
<div>
<h4 className="font-medium">Headings:</h4>
<ul className="list-disc pl-5">
{content.headings.map((heading: any, index: number) => (
<li key={index} className={`text-${heading.level === 1 ? 'lg' : 'base'}`}>
{heading.text}
</li>
))}
</ul>
</div>
)}

{/* Paragraphs - Show only first 3 */}
{content.paragraphs && content.paragraphs.length > 0 && (
<div>
<h4 className="font-medium">Paragraphs:</h4>
<div className="space-y-2">
{content.paragraphs.slice(0, 3).map((paragraph: string, index: number) => (
<p key={index} className="text-sm text-gray-700">{paragraph}</p>
))}
{content.paragraphs.length > 3 && (
<p className="text-sm text-gray-500 italic">
{content.paragraphs.length - 3} more paragraphs not shown...
</p>
)}
</div>
</div>
)}

{/* Lists */}
{content.lists && content.lists.length > 0 && (
<div>
<h4 className="font-medium">Lists:</h4>
<div className="space-y-2">
{content.lists.slice(0, 2).map((list: any, index: number) => (
<div key={index}>
<p className="text-sm font-medium">{list.type === 'ol' ? 'Ordered' : 'Unordered'} List:</p>
<ul className={list.type === 'ol' ? 'list-decimal pl-5' : 'list-disc pl-5'}>
{list.items.slice(0, 5).map((item: string, idx: number) => (
<li key={idx} className="text-sm">{item}</li>
))}
{list.items.length > 5 && (
<li className="text-sm text-gray-500 italic">
{list.items.length - 5} more items...
</li>
)}
</ul>
</div>
))}
</div>
</div>
)}

{/* Tables */}
{content.tables && content.tables.length > 0 && (
<div>
<h4 className="font-medium">Tables:</h4>
<p className="text-sm text-gray-500">
{content.tables.length} table(s) found. View raw data to see details.
</p>
</div>
)}
</div>
)}

{/* Links Section */}
{links && links.length > 0 && (
<div className="space-y-2">
<h3 className="text-lg font-semibold border-b pb-1">Links</h3>
<p className="text-sm">{links.length} links found on the page</p>
<ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
{links.slice(0, 10).map((link: any, index: number) => (
<li key={index} className="text-sm truncate">
<span className="text-blue-500">{link.text || 'Unnamed Link'}</span>: {link.url}
</li>
))}
{links.length > 10 && (
<li className="text-sm text-gray-500 italic col-span-2">
{links.length - 10} more links not shown...
</li>
)}
</ul>
</div>
)}

{/* Media Section */}
{media && (Object.keys(media).some(key => media[key] && media[key].length > 0)) && (
<div className="space-y-2">
<h3 className="text-lg font-semibold border-b pb-1">Media</h3>
  
{media.images && media.images.length > 0 && (
<div>
<h4 className="font-medium">Images:</h4>
<p className="text-sm">{media.images.length} images found on the page</p>
</div>
)}

{media.videos && media.videos.length > 0 && (
<div>
<h4 className="font-medium">Videos:</h4>
<p className="text-sm">{media.videos.length} videos found on the page</p>
</div>
)}
</div>
)}

{/* Interactive Elements */}
{interactive && (Object.keys(interactive).some(key => interactive[key] && interactive[key].length > 0)) && (
<div className="space-y-2">
<h3 className="text-lg font-semibold border-b pb-1">Interactive Elements</h3>
  
{interactive.forms && interactive.forms.length > 0 && (
<div>
<h4 className="font-medium">Forms:</h4>
<p className="text-sm">{interactive.forms.length} forms found on the page</p>
</div>
)}
</div>
)}
</div>
);
}

// Handle basic scrape results or custom extraction schema
return (
<div className="space-y-4">
<div className="grid grid-cols-2 gap-2">
{result.title && (
<div>
<span className="font-medium">Page Title:</span> {result.title}
</div>
)}
{result.content_length && (
<div>
<span className="font-medium">Content Length:</span> {result.content_length} bytes
</div>
)}
</div>
  
{result.data && Object.keys(result.data).length > 0 && (
<div>
<h3 className="text-lg font-semibold mb-2">Extracted Data:</h3>
<div className="bg-gray-50 p-4 rounded-md">
<pre className="whitespace-pre-wrap text-sm">
{JSON.stringify(result.data, null, 2)}
</pre>
</div>
</div>
)}
</div>
);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'formatted' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('formatted')}
          >
            Formatted View
          </Button>
          <Button
            variant={viewMode === 'raw' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('raw')}
          >
            Raw JSON
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-md">
        {renderContent()}
      </div>
    </div>
  );
};
