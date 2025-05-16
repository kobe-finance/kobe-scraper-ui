import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, CardContent } from '../../components';
import { ScraperConfigurationModal, type ScraperFormValues } from './components/ScraperConfigurationModal';
import { useApi } from '../../hooks/useApi';
import type { Scraper } from '../../core/types/scraper';

const ScrapersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrapers, setScrapers] = useState<Scraper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get API services from our hook
  const api = useApi();
  
  // Fetch scrapers on component mount
  useEffect(() => {
    fetchScrapers();
  }, []);

  // Fetch scrapers from the API
  const fetchScrapers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.scraper.listScrapers();
      setScrapers(response.data);
    } catch (err) {
      setError('Failed to load scrapers. Please try again.');
      console.error('Error fetching scrapers:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for creating a new scraper
  const handleCreateScraper = async (data: ScraperFormValues) => {
    try {
      await api.scraper.createScraper({
        name: data.name,
        description: data.description,
        url: data.url,
        selector: data.selector,
        selector_type: 'css', // Default to CSS selector for now
        max_depth: data.maxDepth,
        proxy_type: data.proxyType,
        proxy_url: data.proxyUrl,
        javascript_enabled: data.javascriptEnabled,
        respect_robots_txt: data.respectRobotsTxt
      });
      
      // After successful creation, refresh the scrapers list
      fetchScrapers();
      
      console.log('Scraper created successfully!');
    } catch (error) {
      console.error('Failed to create scraper:', error);
      throw error; // Let the modal handle the error
    }
  };
  
  // Handler for running a scraper
  const handleRunScraper = async (scraperId: string) => {
    try {
      await api.scraper.runScraper({
        scraper_id: scraperId,
        options: {
          max_pages: 10 // Default value
        }
      });
      
      // Show success message or navigate to jobs page
      console.log('Scraper started successfully!');
    } catch (error) {
      console.error('Failed to run scraper:', error);
      setError('Failed to run scraper. Please try again.');
    }
  };
  
  // Handler for editing a scraper
  const handleEditScraper = (scraperId: string) => {
    // Navigate to edit page or open edit modal
    console.log('Edit scraper:', scraperId);
    // This would be implemented in a future iteration
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scrapers</h1>
        <Button 
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          }
          onClick={() => setIsModalOpen(true)}
        >
          Create Scraper
        </Button>
      </div>
      
      {/* Display error message if there is one */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right text-red-700 hover:text-red-900"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          <span className="ml-2">Loading scrapers...</span>
        </div>
      )}
      
      {/* Scrapers grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scrapers.length === 0 ? (
            <Card className="col-span-3">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No scrapers found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first scraper to get started.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Scraper
                </Button>
              </CardContent>
            </Card>
          ) : (
            scrapers.map((scraper) => (
              <Card key={scraper.id} isHoverable>
                <CardHeader 
                  title={scraper.name} 
                  description={scraper.url}
                  action={
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEditScraper(scraper.id)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleRunScraper(scraper.id)}
                      >
                        Run
                      </Button>
                    </div>
                  }
                />
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        scraper.status === 'active' ? 'text-green-600' 
                        : scraper.status === 'inactive' ? 'text-yellow-600' 
                        : 'text-gray-600'
                      }`}>
                        {scraper.status.charAt(0).toUpperCase() + scraper.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Run:</span>
                      <span className="font-medium">
                        {scraper.last_run_date ? new Date(scraper.last_run_date).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium">{new Date(scraper.creation_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Crawl Depth:</span>
                      <span className="font-medium">{scraper.max_depth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
      
      {/* Scraper Configuration Modal */}
      <ScraperConfigurationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateScraper}
      />
    </div>
  );
};

export default ScrapersPage;
