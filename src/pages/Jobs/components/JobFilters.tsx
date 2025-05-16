import React, { useState } from 'react';
import { Card, CardContent, Input, Button } from '../../../components';

type JobStatus = 'all' | 'running' | 'completed' | 'failed' | 'queued' | 'cancelled';

export interface JobFiltersProps {
  onFilterChange: (filters: JobFiltersState) => void;
  isLoading?: boolean;
}

export interface JobFiltersState {
  search: string;
  status: JobStatus;
  dateRange: {
    from: string;
    to: string;
  };
}

export const defaultFilters: JobFiltersState = {
  search: '',
  status: 'all',
  dateRange: {
    from: '',
    to: '',
  },
};

export const JobFilters: React.FC<JobFiltersProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<JobFiltersState>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'from' || name === 'to') {
      setFilters({
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [name]: value,
        },
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  const handleStatusChange = (status: JobStatus) => {
    setFilters({
      ...filters,
      status,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1">
            <Input
              type="text"
              name="search"
              placeholder="Search jobs by name or URL..."
              value={filters.search}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.status === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('all')}
              disabled={isLoading}
            >
              All
            </Button>
            <Button
              variant={filters.status === 'running' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('running')}
              disabled={isLoading}
            >
              Running
            </Button>
            <Button
              variant={filters.status === 'completed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
              disabled={isLoading}
            >
              Completed
            </Button>
            <Button
              variant={filters.status === 'failed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('failed')}
              disabled={isLoading}
            >
              Failed
            </Button>

            {/* Toggle advanced filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={isLoading}
              className="ml-auto"
            >
              {isExpanded ? 'Less Filters' : 'More Filters'}
            </Button>
          </div>
        </div>

        {/* Advanced filters */}
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <Input
                type="date"
                name="from"
                value={filters.dateRange.from}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <Input
                type="date"
                name="to"
                value={filters.dateRange.to}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFilters}
                disabled={isLoading}
                className="flex-1"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
