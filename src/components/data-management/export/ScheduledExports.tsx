import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  TrashIcon, 
  PencilIcon, 
  PlusIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

export interface ScheduledExport {
  id: string;
  name: string;
  schedule: {
    frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:MM format
    day?: number; // Day of week (0-6) or day of month (1-31)
    startDate?: string; // YYYY-MM-DD format
    endDate?: string; // YYYY-MM-DD format
  };
  format: string;
  formatConfig: Record<string, any>;
  lastRun?: string;
  nextRun?: string;
  enabled: boolean;
}

interface ScheduledExportsProps {
  schedules: ScheduledExport[];
  onAddSchedule: (schedule: Omit<ScheduledExport, 'id'>) => void;
  onUpdateSchedule: (id: string, schedule: Partial<ScheduledExport>) => void;
  onDeleteSchedule: (id: string) => void;
  onToggleSchedule: (id: string, enabled: boolean) => void;
  exportFormats: { id: string; name: string }[];
  className?: string;
}

/**
 * Component for managing scheduled data exports
 * Allows users to create, edit, and delete export schedules
 */
const ScheduledExports: React.FC<ScheduledExportsProps> = ({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onToggleSchedule,
  exportFormats,
  className = ''
}) => {
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduledExport['schedule']['frequency']>('daily');
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [scheduleDay, setScheduleDay] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(exportFormats[0]?.id || '');

  // Reset form
  const resetForm = () => {
    setScheduleName('');
    setScheduleFrequency('daily');
    setScheduleTime('12:00');
    setScheduleDay(1);
    setStartDate('');
    setEndDate('');
    setSelectedFormat(exportFormats[0]?.id || '');
  };

  // Start adding a new schedule
  const handleAddSchedule = () => {
    setIsAddingSchedule(true);
    resetForm();
  };

  // Start editing an existing schedule
  const handleEditSchedule = (schedule: ScheduledExport) => {
    setEditingScheduleId(schedule.id);
    setScheduleName(schedule.name);
    setScheduleFrequency(schedule.schedule.frequency);
    setScheduleTime(schedule.schedule.time || '12:00');
    setScheduleDay(schedule.schedule.day || 1);
    setStartDate(schedule.schedule.startDate || '');
    setEndDate(schedule.schedule.endDate || '');
    setSelectedFormat(schedule.format);
  };

  // Save schedule (add new or update existing)
  const handleSaveSchedule = () => {
    const scheduleData = {
      name: scheduleName,
      schedule: {
        frequency: scheduleFrequency,
        time: scheduleTime,
        day: scheduleDay,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      },
      format: selectedFormat,
      formatConfig: {},
      enabled: true
    };

    if (editingScheduleId) {
      onUpdateSchedule(editingScheduleId, scheduleData);
      setEditingScheduleId(null);
    } else {
      onAddSchedule(scheduleData);
      setIsAddingSchedule(false);
    }

    resetForm();
  };

  // Cancel adding/editing
  const handleCancel = () => {
    setIsAddingSchedule(false);
    setEditingScheduleId(null);
    resetForm();
  };

  // Format frequency for display
  const formatFrequency = (schedule: ScheduledExport): string => {
    switch (schedule.schedule.frequency) {
      case 'once':
        return `Once on ${schedule.schedule.startDate || 'scheduled date'}`;
      case 'hourly':
        return 'Every hour';
      case 'daily':
        return `Daily at ${schedule.schedule.time || '00:00'}`;
      case 'weekly':
        return `Weekly on ${getDayName(schedule.schedule.day || 0)} at ${schedule.schedule.time || '00:00'}`;
      case 'monthly':
        return `Monthly on day ${schedule.schedule.day || 1} at ${schedule.schedule.time || '00:00'}`;
      default:
        return 'Custom schedule';
    }
  };

  // Get day name from index
  const getDayName = (dayIndex: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex % 7];
  };

  // Render day selector based on frequency
  const renderDaySelector = () => {
    if (scheduleFrequency === 'weekly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Day of Week
          </label>
          <select
            value={scheduleDay}
            onChange={(e) => setScheduleDay(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={0}>Sunday</option>
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
          </select>
        </div>
      );
    } else if (scheduleFrequency === 'monthly') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Day of Month
          </label>
          <select
            value={scheduleDay}
            onChange={(e) => setScheduleDay(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      );
    }
    
    return null;
  };

  // Render schedule form (add/edit)
  const renderScheduleForm = () => {
    return (
      <div className="mb-6 bg-white rounded-lg border p-4 dark:bg-gray-800 dark:border-gray-700">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editingScheduleId ? 'Edit Schedule' : 'Add New Schedule'}
        </h4>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Schedule Name
            </label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Daily export, Monthly backup, etc."
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={scheduleFrequency}
              onChange={(e) => setScheduleFrequency(e.target.value as ScheduledExport['schedule']['frequency'])}
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="once">Once</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          {scheduleFrequency !== 'hourly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
          
          {renderDaySelector()}
          
          {scheduleFrequency === 'once' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
          
          {scheduleFrequency !== 'once' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Export Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {exportFormats.map((format) => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSaveSchedule}
            disabled={!scheduleName || !selectedFormat}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            <CheckIcon className="h-4 w-4 mr-1" />
            {editingScheduleId ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          Scheduled Exports
        </h3>
        
        {!isAddingSchedule && !editingScheduleId && (
          <button
            type="button"
            onClick={handleAddSchedule}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Schedule
          </button>
        )}
      </div>
      
      {(isAddingSchedule || editingScheduleId) && renderScheduleForm()}
      
      {schedules.length === 0 && !isAddingSchedule ? (
        <div className="text-center py-8 bg-white rounded-lg border dark:bg-gray-800 dark:border-gray-700">
          <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No scheduled exports configured.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a schedule to automate your data exports.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`border rounded-lg overflow-hidden bg-white dark:bg-gray-800 dark:border-gray-700 ${
                !schedule.enabled ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {schedule.name}
                  </span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                    {exportFormats.find(f => f.id === schedule.format)?.name || schedule.format}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer mr-3">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={schedule.enabled}
                      onChange={() => onToggleSchedule(schedule.id, !schedule.enabled)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => handleEditSchedule(schedule)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => onDeleteSchedule(schedule.id)}
                    className="p-1 text-gray-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="px-4 py-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start">
                    <ClockIcon className="h-4 w-4 text-gray-500 mt-0.5 dark:text-gray-400" />
                    <div className="ml-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {formatFrequency(schedule)}
                      </div>
                      {(schedule.schedule.startDate || schedule.schedule.endDate) && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {schedule.schedule.startDate && (
                            <>From: {new Date(schedule.schedule.startDate).toLocaleDateString()}</>
                          )}
                          {schedule.schedule.startDate && schedule.schedule.endDate && (
                            <> · </>
                          )}
                          {schedule.schedule.endDate && (
                            <>To: {new Date(schedule.schedule.endDate).toLocaleDateString()}</>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5 dark:text-gray-400" />
                    <div className="ml-2">
                      {schedule.lastRun && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last run: {new Date(schedule.lastRun).toLocaleString()}
                        </div>
                      )}
                      {schedule.nextRun && (
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          Next run: {new Date(schedule.nextRun).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledExports;
