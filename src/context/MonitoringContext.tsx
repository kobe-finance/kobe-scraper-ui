import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '../services/websocket';

// Job status types
export type JobStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

// Log level types
export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

// Log entry structure
export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  jobId?: string;
  source?: string;
  details?: any;
}

// Error with potential solution
export interface ErrorWithSolution {
  id: string;
  timestamp: number;
  message: string;
  code?: string;
  jobId?: string;
  source?: string;
  stack?: string;
  solutions?: string[];
  resolved?: boolean;
}

// Job stats interface
export interface JobStats {
  pagesScraped: number;
  pagesRemaining: number;
  itemsExtracted: number;
  errorsEncountered: number;
  requestsPerMinute: number;
  avgResponseTime: number;
  dataSize: number;
}

// Job progress interface
export interface JobProgress {
  jobId: string;
  status: JobStatus;
  progress: number;
  stats: JobStats;
  startTime?: number;
  estimatedEndTime?: number;
  currentActivity?: string;
}

// Context interface
interface MonitoringContextValue {
  connected: boolean;
  connectionStatus: string;
  jobs: Record<string, JobProgress>;
  logs: LogEntry[];
  errors: ErrorWithSolution[];
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  clearLogs: () => void;
  filterLogs: (filter: LogFilter) => LogEntry[];
  markErrorResolved: (errorId: string) => void;
  sendCommand: (command: string, payload?: any) => void;
}

// Log filter options
export interface LogFilter {
  level?: LogLevel[];
  jobId?: string;
  source?: string;
  search?: string;
  startTime?: number;
  endTime?: number;
}

// Default context value
const defaultContextValue: MonitoringContextValue = {
  connected: false,
  connectionStatus: 'closed',
  jobs: {},
  logs: [],
  errors: [],
  activeJobId: null,
  setActiveJobId: () => {},
  clearLogs: () => {},
  filterLogs: () => [],
  markErrorResolved: () => {},
  sendCommand: () => {},
};

// Create context
const MonitoringContext = createContext<MonitoringContextValue>(defaultContextValue);

// Custom hook to use the monitoring context
export const useMonitoring = () => useContext(MonitoringContext);

// Provider component
export const MonitoringProvider: React.FC<{ children: ReactNode; websocketUrl: string }> = ({ 
  children, 
  websocketUrl 
}) => {
  const { status, messages, sendMessage } = useWebSocket(websocketUrl);
  const [jobs, setJobs] = useState<Record<string, JobProgress>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errors, setErrors] = useState<ErrorWithSolution[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const latestMessage = messages[messages.length - 1];
    
    switch (latestMessage.type) {
      case 'job_status':
        handleJobStatusUpdate(latestMessage.data);
        break;
      case 'job_progress':
        handleJobProgressUpdate(latestMessage.data);
        break;
      case 'log':
        handleLogMessage(latestMessage.data);
        break;
      case 'error':
        handleErrorMessage(latestMessage.data);
        break;
      case 'stats_update':
        handleStatsUpdate(latestMessage.data);
        break;
    }
  }, [messages]);
  
  // Handle job status updates
  const handleJobStatusUpdate = (data: any) => {
    const { jobId, status } = data;
    
    setJobs(prev => {
      const updatedJobs = { ...prev };
      
      if (updatedJobs[jobId]) {
        updatedJobs[jobId] = {
          ...updatedJobs[jobId],
          status,
        };
      } else {
        updatedJobs[jobId] = {
          jobId,
          status,
          progress: 0,
          stats: {
            pagesScraped: 0,
            pagesRemaining: 0,
            itemsExtracted: 0,
            errorsEncountered: 0,
            requestsPerMinute: 0,
            avgResponseTime: 0,
            dataSize: 0,
          },
        };
      }
      
      return updatedJobs;
    });
  };
  
  // Handle job progress updates
  const handleJobProgressUpdate = (data: any) => {
    const { jobId, progress, currentActivity, estimatedEndTime } = data;
    
    setJobs(prev => {
      const updatedJobs = { ...prev };
      
      if (updatedJobs[jobId]) {
        updatedJobs[jobId] = {
          ...updatedJobs[jobId],
          progress,
          currentActivity,
          estimatedEndTime,
        };
      }
      
      return updatedJobs;
    });
  };
  
  // Handle log messages
  const handleLogMessage = (data: LogEntry) => {
    setLogs(prev => [...prev, { ...data, timestamp: data.timestamp || Date.now() }].slice(-1000)); // Keep last 1000 logs
  };
  
  // Handle error messages
  const handleErrorMessage = (data: ErrorWithSolution) => {
    setErrors(prev => [...prev, { ...data, timestamp: data.timestamp || Date.now(), resolved: false }]);
  };
  
  // Handle stats updates
  const handleStatsUpdate = (data: any) => {
    const { jobId, stats } = data;
    
    setJobs(prev => {
      const updatedJobs = { ...prev };
      
      if (updatedJobs[jobId]) {
        updatedJobs[jobId] = {
          ...updatedJobs[jobId],
          stats: {
            ...updatedJobs[jobId].stats,
            ...stats,
          },
        };
      }
      
      return updatedJobs;
    });
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Filter logs based on criteria
  const filterLogs = (filter: LogFilter): LogEntry[] => {
    return logs.filter(log => {
      // Filter by level
      if (filter.level && filter.level.length > 0 && !filter.level.includes(log.level)) {
        return false;
      }
      
      // Filter by job ID
      if (filter.jobId && log.jobId !== filter.jobId) {
        return false;
      }
      
      // Filter by source
      if (filter.source && log.source !== filter.source) {
        return false;
      }
      
      // Filter by search text
      if (filter.search && !log.message.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Filter by time range
      if (filter.startTime && log.timestamp < filter.startTime) {
        return false;
      }
      
      if (filter.endTime && log.timestamp > filter.endTime) {
        return false;
      }
      
      return true;
    });
  };
  
  // Mark an error as resolved
  const markErrorResolved = (errorId: string) => {
    setErrors(prev => 
      prev.map(error => 
        error.id === errorId ? { ...error, resolved: true } : error
      )
    );
  };
  
  // Send a command to the server
  const sendCommand = (command: string, payload: any = {}) => {
    sendMessage({
      type: 'command',
      command,
      payload,
      timestamp: Date.now(),
    });
  };
  
  // Context value
  const value: MonitoringContextValue = {
    connected: status === 'open',
    connectionStatus: status,
    jobs,
    logs,
    errors,
    activeJobId,
    setActiveJobId,
    clearLogs,
    filterLogs,
    markErrorResolved,
    sendCommand,
  };
  
  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  );
};

export default MonitoringContext;
