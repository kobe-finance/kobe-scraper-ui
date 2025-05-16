import React from 'react';
import { Button, Card, CardHeader, CardContent } from '../../components';

const ResultsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Scraping Results</h1>
        <div className="flex space-x-2">
          <Button variant="outline" leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
            </svg>
          }>
            Save View
          </Button>
          <Button variant="secondary" leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }>
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader title="Total Results" description="All data points" />
          <CardContent>
            <div className="text-3xl font-bold text-primary-600">12,452</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Jobs" description="Contributing jobs" />
          <CardContent>
            <div className="text-3xl font-bold text-secondary-600">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Domains" description="Unique domains" />
          <CardContent>
            <div className="text-3xl font-bold text-green-600">18</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader title="Last Updated" description="Most recent data" />
          <CardContent>
            <div className="text-xl font-medium text-gray-800 dark:text-gray-200">2025-05-10</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader title="Data Explorer" description="Browse collected data" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-full max-w-md">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    placeholder="Search results..."
                    type="search"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <select
                  id="category"
                  name="category"
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option>All Categories</option>
                  <option>Products</option>
                  <option>Pricing</option>
                  <option>Reviews</option>
                  <option>Articles</option>
                </select>
                
                <select
                  id="date"
                  name="date"
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option>All Dates</option>
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Source
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Date Collected
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        Product Item {i}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {i % 2 === 0 ? 'Products' : 'Pricing'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        example{i}.com
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        2025-05-{10 - i}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">View</Button>
                          <Button size="sm" variant="outline">Download</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">12,452</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button variant="outline" size="sm" className="rounded-l-md">Previous</Button>
                    <Button variant="ghost" size="sm">1</Button>
                    <Button variant="primary" size="sm">2</Button>
                    <Button variant="ghost" size="sm">3</Button>
                    <Button variant="ghost" size="sm">...</Button>
                    <Button variant="ghost" size="sm">10</Button>
                    <Button variant="outline" size="sm" className="rounded-r-md">Next</Button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsPage;
