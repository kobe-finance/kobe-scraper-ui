import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '../../services/apiClient';
import type { ApiError } from '../../services/apiClient';
import { Button, Card, CardContent, CardHeader, Form, FormField, FormInput, FormItem, Input } from '../../components';
import { ScrapeResultDisplay } from './components/ScrapeResultDisplay';
import { JobStatusIndicator } from './components/JobStatusIndicator';

// Form validation schema
const scrapeFormSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  selector: z.string().optional(),
  useJavascript: z.boolean().default(false),
  maxDepth: z.number().int().min(1).max(3).default(1),
});

type ScrapeFormValues = z.infer<typeof scrapeFormSchema>;

// Main ScraperInterface component
const ScraperInterface: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'basic' | 'advanced' | 'fullPage'>('basic');

  // Form setup
  const form = useForm<ScrapeFormValues>({
    resolver: zodResolver(scrapeFormSchema),
    defaultValues: {
      url: '',
      selector: '',
      useJavascript: false,
      maxDepth: 1,
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<ScrapeFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveJobId(null);

    try {
      let response;

      switch (selectedMode) {
        case 'basic':
          response = await apiClient.scrapeUrl(data.url, data.selector || undefined, data.maxDepth);
          setResult(response);
          break;
        
        case 'fullPage':
          response = await apiClient.scrapeFullPage(data.url);
          setResult(response);
          break;
        
        case 'advanced':
          // Start a background job for advanced scraping with JavaScript
          const schema = {
            title: { selector: 'h1', attribute: 'text' },
            content: { 
              selector: 'main, #main-content, #content, .content, article', 
              attribute: 'html' 
            },
            links: {
              selector: 'a',
              multiple: true,
              data: {
                text: { selector: '', attribute: 'text' },
                href: { selector: '', attribute: 'href' }
              }
            }
          };
          
          const jobResponse = await apiClient.startScrapeJob(data.url, schema);
          
          if (jobResponse.job_id) {
            setActiveJobId(jobResponse.job_id);
          } else {
            throw new Error('Failed to start scraping job');
          }
          break;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'An error occurred during scraping');
      console.error('Scraping error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job completion
  const handleJobComplete = (jobResult: any) => {
    setResult(jobResult);
    setActiveJobId(null);
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Web Scraper</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Scrape a Website</h2>
            <div className="flex space-x-2">
              <Button 
                variant={selectedMode === 'basic' ? 'primary' : 'outline'}
                onClick={() => setSelectedMode('basic')}
                disabled={isLoading}
              >
                Basic
              </Button>
              <Button 
                variant={selectedMode === 'fullPage' ? 'primary' : 'outline'}
                onClick={() => setSelectedMode('fullPage')}
                disabled={isLoading}
              >
                Full Page
              </Button>
              <Button 
                variant={selectedMode === 'advanced' ? 'primary' : 'outline'}
                onClick={() => setSelectedMode('advanced')}
                disabled={isLoading}
              >
                Advanced (JS)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="form-field">
                <FormItem label="URL to Scrape" error={form.formState.errors.url?.message}>
                  <FormInput name="url">
                    <Input
                      {...form.register('url')}
                      placeholder="https://example.com"
                      disabled={isLoading}
                    />
                  </FormInput>
                </FormItem>
              </div>
              
              {selectedMode === 'basic' && (
                <div className="form-field">
                  <FormItem label="CSS Selector (Optional)" error={form.formState.errors.selector?.message}>
                    <FormInput name="selector">
                      <Input
                        {...form.register('selector')}
                        placeholder=".product-item, #main-content"
                        disabled={isLoading}
                      />
                    </FormInput>
                  </FormItem>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Scraping...' : 'Start Scrape'}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Job Status */}
      {activeJobId && (
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-xl font-semibold">Job Status</h2>
          </CardHeader>
          <CardContent>
            <JobStatusIndicator 
              jobId={activeJobId}
              onComplete={handleJobComplete}
              onError={handleError}
            />
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded-md text-red-600">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Scraping Results</h2>
          </CardHeader>
          <CardContent>
            <ScrapeResultDisplay result={result} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScraperInterface;
