import React, { useState, useEffect, useMemo } from 'react';
import { LogEntry, LogFilter, LogLevel, useMonitoring } from '../../context/MonitoringContext';

interface LogViewerProps {
  jobId?: string;
  maxHeight?: string;
  className?: string;
  autoScroll?: boolean;
}

const LogLevelBadge: React.FC<{ level: LogLevel }> = ({ level }) => {
  const config = {
    debug: { bg: 'bg-gray-200', text: 'text-gray-800' },
    info: { bg: 'bg-blue-200', text: 'text-blue-800' },
    warning: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
    error: { bg: 'bg-red-200', text: 'text-red-800' }
  };

  const style = config[level] || config.info;

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>
      {level.toUpperCase()}
    </span>
  );
};

const LogViewer: React.FC<LogViewerProps> = ({
  jobId,
  maxHeight = '400px',
  className = '',
  autoScroll = true
}) => {
  const { logs, clearLogs, filterLogs } = useMonitoring();
  const [filter, setFilter] = useState<LogFilter>({
    level: ['debug', 'info', 'warning', 'error'],
    jobId: jobId,
    search: ''
  });

  const logContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter logs based on current filter settings
  const filteredLogs = useMemo(() => {
    return filterLogs(filter);
  }, [logs, filter, filterLogs]);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  // Update jobId filter when jobId prop changes
  useEffect(() => {
    setFilter(prev => ({ ...prev, jobId }));
  }, [jobId]);

  const handleLevelFilterChange = (level: LogLevel) => {
    setFilter(prev => {
      const levels = [...(prev.level || [])];
      
      if (levels.includes(level)) {
        return {
          ...prev,
          level: levels.filter(l => l !== level)
        };
      } else {
        return {
          ...prev,
          level: [...levels, level]
        };
      }
    });
  };

  const handleSearchChange = (search: string) => {
    setFilter(prev => ({ ...prev, search }));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className={`flex flex-col bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Log Viewer</h3>
        <div className="flex space-x-2">
          <button
            onClick={clearLogs}
            className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => handleLevelFilterChange('debug')}
            className={`px-2 py-1 text-xs rounded ${
              filter.level?.includes('debug') 
                ? 'bg-gray-700 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Debug
          </button>
          <button
            onClick={() => handleLevelFilterChange('info')}
            className={`px-2 py-1 text-xs rounded ${
              filter.level?.includes('info') 
                ? 'bg-blue-700 text-white' 
                : 'bg-blue-200 text-blue-700'
            }`}
          >
            Info
          </button>
          <button
            onClick={() => handleLevelFilterChange('warning')}
            className={`px-2 py-1 text-xs rounded ${
              filter.level?.includes('warning') 
                ? 'bg-yellow-700 text-white' 
                : 'bg-yellow-200 text-yellow-700'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => handleLevelFilterChange('error')}
            className={`px-2 py-1 text-xs rounded ${
              filter.level?.includes('error') 
                ? 'bg-red-700 text-white' 
                : 'bg-red-200 text-red-700'
            }`}
          >
            Error
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search logs..."
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {filter.search && (
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => handleSearchChange('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div 
        ref={logContainerRef}
        className="overflow-auto font-mono text-sm"
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No logs to display</div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Time
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Level
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                {!jobId && (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Source
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <LogLevelBadge level={log.level} />
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-900">
                    {log.message}
                    {log.details && (
                      <details className="mt-1">
                        <summary className="text-blue-600 cursor-pointer text-xs">Details</summary>
                        <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                          {typeof log.details === 'string' 
                            ? log.details 
                            : JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                  {!jobId && (
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {log.source || log.jobId || 'system'}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
