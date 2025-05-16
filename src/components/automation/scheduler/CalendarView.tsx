import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ScheduledJob } from './types';
import { getCalendarEventsFromJobs } from './mockData';

// Set up localizer for the calendar
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  jobs: ScheduledJob[];
  onSelectJob: (job: ScheduledJob) => void;
  conflicts: { jobId: string; message: string }[];
}

/**
 * Calendar view component for visualizing scheduled jobs
 * Uses react-big-calendar to provide a full calendar interface
 */
const CalendarView: React.FC<CalendarViewProps> = ({ jobs, onSelectJob, conflicts }) => {
  const [viewMode, setViewMode] = useState<string>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Convert jobs to calendar events
  const events = useMemo(() => getCalendarEventsFromJobs(jobs), [jobs]);

  // Handle event selection
  const handleSelectEvent = (event: any) => {
    const job = jobs.find(j => j.id === event.jobId);
    if (job) {
      onSelectJob(job);
    }
  };

  // Custom event component to display job details and conflict indicators
  const EventComponent = ({ event }: { event: any }) => {
    const hasConflict = conflicts.some(c => c.jobId === event.jobId);
    
    return (
      <div 
        className={`p-1 rounded overflow-hidden text-xs ${event.className} ${hasConflict ? 'border-2 border-red-500' : ''}`}
      >
        <div className="font-medium truncate">{event.title}</div>
        <div className="truncate text-xs opacity-75">{event.extendedProps?.workflowName}</div>
        {hasConflict && (
          <div className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></div>
        )}
      </div>
    );
  };

  // Custom toolbar component
  const CustomToolbar = ({ date, onNavigate, onView, label }: any) => {
    return (
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => onNavigate('TODAY')}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onNavigate('PREV')}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={() => onNavigate('NEXT')}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            &gt;
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </h2>
        
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => onView(Views.DAY)}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              viewMode === Views.DAY
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => onView(Views.WEEK)}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              viewMode === Views.WEEK
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => onView(Views.MONTH)}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              viewMode === Views.MONTH
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => onView(Views.AGENDA)}
            className={`px-3 py-1.5 border rounded-md text-sm font-medium ${
              viewMode === Views.AGENDA
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[600px] w-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={viewMode as any}
        onView={(view) => setViewMode(view)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        onSelectEvent={handleSelectEvent}
        selectable
        popup
        components={{
          event: EventComponent,
          toolbar: CustomToolbar,
        }}
        eventPropGetter={(event) => ({
          className: event.className || '',
        })}
        className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
      />
      
      {/* Job status legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <span className="h-3 w-3 bg-blue-100 border border-blue-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Scheduled</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-yellow-100 border border-yellow-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Running</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-green-100 border border-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-red-100 border border-red-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-gray-100 border border-gray-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Paused</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 bg-white border-2 border-red-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Conflict</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total jobs: <span className="font-semibold">{jobs.length}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Conflicts: <span className="font-semibold text-red-600">{conflicts.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
