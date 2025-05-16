import React from 'react';
import { Button, Card, CardHeader, CardContent, Form, FormInput } from '../../components';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

interface SettingsFormValues {
  username: string;
  email: string;
  apiKey: string;
  maxConcurrentJobs: string;
  respectRobotsTxt: boolean;
  defaultCrawlDelay: string;
  proxyEnabled: boolean;
  proxyUrl: string;
}

const SettingsPage: React.FC = () => {
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      username: 'admin',
      email: 'admin@kobe-scraper.com',
      apiKey: 'sk-kobe-1234567890abcdef',
      maxConcurrentJobs: '5',
      respectRobotsTxt: true,
      defaultCrawlDelay: '2',
      proxyEnabled: false,
      proxyUrl: '',
    },
  });
  
  const handleSubmit: SubmitHandler<SettingsFormValues> = (data) => {
    console.log('Settings updated:', data);
    // In a real application, this would send the data to the API
    alert('Settings updated successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader title="Account Settings" description="Manage your account information" />
          <CardContent>
            <Form form={form} onSubmit={handleSubmit} className="space-y-4">
              <FormInput 
                name="username" 
                label="Username" 
              />
              <FormInput 
                name="email" 
                label="Email Address" 
                type="email"
              />
              <FormInput 
                name="apiKey" 
                label="API Key" 
                type="password"
                rightIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                }
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Save Account Settings
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Scraper Settings" description="Configure default scraper behavior" />
          <CardContent>
            <Form form={form} onSubmit={handleSubmit} className="space-y-4">
              <FormInput 
                name="maxConcurrentJobs" 
                label="Max Concurrent Jobs" 
                type="number"
                helperText="Maximum number of scraper jobs to run simultaneously"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="respectRobotsTxt"
                  {...form.register('respectRobotsTxt')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="respectRobotsTxt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Respect robots.txt
                </label>
              </div>
              <FormInput 
                name="defaultCrawlDelay" 
                label="Default Crawl Delay (seconds)" 
                type="number"
                helperText="Time to wait between requests to the same domain"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Save Scraper Settings
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader title="Proxy Configuration" description="Configure proxy settings for web scraping" />
          <CardContent>
            <Form form={form} onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="proxyEnabled"
                  {...form.register('proxyEnabled')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="proxyEnabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Proxy
                </label>
              </div>
              
              <FormInput 
                name="proxyUrl" 
                label="Proxy URL" 
                placeholder="http://proxy.example.com:8080"
                helperText="URL for your proxy server including protocol and port"
                disabled={!form.watch('proxyEnabled')}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  onClick={form.handleSubmit(handleSubmit)}
                >
                  Save Proxy Settings
                </Button>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
