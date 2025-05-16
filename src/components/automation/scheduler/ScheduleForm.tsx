import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ScheduledJob, ScheduleFrequency, DayOfWeek } from './types';

interface ScheduleFormProps {
  job: ScheduledJob;
  isNewJob: boolean;
  onSave: (job: ScheduledJob) => void;
  onDelete: (jobId: string) => void;
}

/**
 * Schedule form component for configuring job schedules
 * Supports one-time and recurring schedules with various frequency options
 */
const ScheduleForm: React.FC<ScheduleFormProps> = ({
  job,
  isNewJob,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<ScheduledJob>(job);
  const [startDate, setStartDate] = useState<Date | null>(
    job.startTime ? new Date(job.startTime) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    job.endTime ? new Date(job.endTime) : null
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when job changes
  useEffect(() => {
    setFormData(job);
    setStartDate(job.startTime ? new Date(job.startTime) : null);
    setEndDate(job.endTime ? new Date(job.endTime) : null);
    setConfirmDelete(false);
    setErrors({});
  }, [job]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('day-')) {
      const day = name.replace('day-', '') as DayOfWeek;
      const currentDays = formData.daysOfWeek || [];
      
      setFormData({
        ...formData,
        daysOfWeek: checked
          ? [...currentDays, day]
          : currentDays.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };

  // Handle schedule type change
  const handleScheduleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scheduleType = e.target.value as 'one-time' | 'recurring';
    
    setFormData({
      ...formData,
      scheduleType,
      frequency: scheduleType === 'one-time' ? 'once' : 'daily'
    });
  };

  // Handle start date change
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      setFormData({
        ...formData,
        startTime: date.toISOString(),
        nextRunTime: date.toISOString()
      });
    }
  };

  // Handle end date change
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setFormData({
      ...formData,
      endTime: date ? date.toISOString() : null
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      validationErrors.name = 'Job name is required';
    }
    
    if (!formData.workflowId) {
      validationErrors.workflowId = 'Workflow is required';
    }
    
    if (!startDate) {
      validationErrors.startTime = 'Start time is required';
    }
    
    if (formData.scheduleType === 'recurring' && formData.frequency === 'weekly' && (!formData.daysOfWeek || formData.daysOfWeek.length === 0)) {
      validationErrors.daysOfWeek = 'Select at least one day of the week';
    }
    
    if (formData.scheduleType === 'recurring' && formData.frequency === 'monthly' && !formData.dayOfMonth) {
      validationErrors.dayOfMonth = 'Day of month is required';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Save the job
    onSave(formData);
  };

  // Handle delete button click
  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(job.id);
    } else {
      setConfirmDelete(true);
    }
  };

  // Sample workflows for the dropdown
  const sampleWorkflows = [
    { id: 'workflow-1', name: 'E-commerce Scraper' },
    { id: 'workflow-2', name: 'Price Analyzer' },
    { id: 'workflow-3', name: 'Competitor Tracker' },
    { id: 'workflow-4', name: 'Export Pipeline' },
    { id: 'workflow-5', name: 'Stock Tracker' }
  ];

  // Days of the week for the checkbox group
  const daysOfWeek: Array<{ value: DayOfWeek; label: string }> = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Get list of days for the month selector
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            {isNewJob ? 'Create New Job' : 'Edit Job Schedule'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Configure when and how this job should run
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Job name */}
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.name ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Workflow selection */}
            <div className="sm:col-span-3">
              <label htmlFor="workflowId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Workflow
              </label>
              <div className="mt-1">
                <select
                  id="workflowId"
                  name="workflowId"
                  value={formData.workflowId}
                  onChange={handleChange}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.workflowId ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                >
                  <option value="">Select a workflow</option>
                  {sampleWorkflows.map(workflow => (
                    <option key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </option>
                  ))}
                </select>
                {errors.workflowId && (
                  <p className="mt-2 text-sm text-red-600">{errors.workflowId}</p>
                )}
              </div>
            </div>

            {/* Schedule type */}
            <div className="sm:col-span-3">
              <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Schedule Type
              </label>
              <div className="mt-1">
                <select
                  id="scheduleType"
                  name="scheduleType"
                  value={formData.scheduleType}
                  onChange={handleScheduleTypeChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value="one-time">One-time Job</option>
                  <option value="recurring">Recurring Job</option>
                </select>
              </div>
            </div>

            {/* Frequency - only for recurring jobs */}
            {formData.scheduleType === 'recurring' && (
              <div className="sm:col-span-3">
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Frequency
                </label>
                <div className="mt-1">
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  >
                    <option value="minutely">Every Minute</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="custom">Custom (Cron)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Start Date and Time */}
            <div className="sm:col-span-3">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date & Time
              </label>
              <div className="mt-1">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.startTime ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholderText="Select start date and time"
                />
                {errors.startTime && (
                  <p className="mt-2 text-sm text-red-600">{errors.startTime}</p>
                )}
              </div>
            </div>

            {/* End Date and Time (optional) */}
            <div className="sm:col-span-3">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date & Time (Optional)
              </label>
              <div className="mt-1">
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholderText="Select end date and time"
                  minDate={startDate || undefined}
                  isClearable
                />
              </div>
            </div>

            {/* Weekly schedule options */}
            {formData.scheduleType === 'recurring' && formData.frequency === 'weekly' && (
              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days of Week
                  </legend>
                  {errors.daysOfWeek && (
                    <p className="mt-2 text-sm text-red-600">{errors.daysOfWeek}</p>
                  )}
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-7 gap-2">
                    {daysOfWeek.map(day => (
                      <div key={day.value} className="flex items-center">
                        <input
                          id={`day-${day.value}`}
                          name={`day-${day.value}`}
                          type="checkbox"
                          checked={(formData.daysOfWeek || []).includes(day.value)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                        />
                        <label
                          htmlFor={`day-${day.value}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {/* Monthly schedule options */}
            {formData.scheduleType === 'recurring' && formData.frequency === 'monthly' && (
              <div className="sm:col-span-3">
                <label htmlFor="dayOfMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Day of Month
                </label>
                <div className="mt-1">
                  <select
                    id="dayOfMonth"
                    name="dayOfMonth"
                    value={formData.dayOfMonth || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? undefined : parseInt(e.target.value);
                      setFormData({
                        ...formData,
                        dayOfMonth: value
                      });
                    }}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.dayOfMonth ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">Select day</option>
                    {daysOfMonth.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                    <option value="last">Last day</option>
                  </select>
                  {errors.dayOfMonth && (
                    <p className="mt-2 text-sm text-red-600">{errors.dayOfMonth}</p>
                  )}
                </div>
              </div>
            )}

            {/* Custom cron expression */}
            {formData.scheduleType === 'recurring' && formData.frequency === 'custom' && (
              <div className="sm:col-span-6">
                <label htmlFor="cron" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cron Expression
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="cron"
                    id="cron"
                    value={formData.cron || ''}
                    onChange={handleChange}
                    placeholder="* * * * *"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Format: minute hour day-of-month month day-of-week
                  </p>
                </div>
              </div>
            )}

            {/* Time fields for hourly, daily, and other recurring schedules */}
            {formData.scheduleType === 'recurring' && 
             ['hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'].includes(formData.frequency) && (
              <>
                {/* For hourly schedules, show minute selector */}
                {formData.frequency === 'hourly' && (
                  <div className="sm:col-span-3">
                    <label htmlFor="minuteOfHour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Minute of Hour
                    </label>
                    <div className="mt-1">
                      <select
                        id="minuteOfHour"
                        name="minuteOfHour"
                        value={formData.minuteOfHour || 0}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            minuteOfHour: parseInt(e.target.value)
                          });
                        }}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                
                {/* For daily, weekly, monthly, etc. show hour and minute selectors */}
                {formData.frequency !== 'hourly' && (
                  <>
                    <div className="sm:col-span-3">
                      <label htmlFor="hourOfDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hour of Day
                      </label>
                      <div className="mt-1">
                        <select
                          id="hourOfDay"
                          name="hourOfDay"
                          value={formData.hourOfDay || 0}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              hourOfDay: parseInt(e.target.value)
                            });
                          }}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                
                    <div className="sm:col-span-3">
                      <label htmlFor="minuteOfHour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Minute of Hour
                      </label>
                      <div className="mt-1">
                        <select
                          id="minuteOfHour"
                          name="minuteOfHour"
                          value={formData.minuteOfHour || 0}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              minuteOfHour: parseInt(e.target.value)
                            });
                          }}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        >
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Timezone */}
            {formData.scheduleType === 'recurring' && (
              <div className="sm:col-span-3">
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Timezone
                </label>
                <div className="mt-1">
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone || 'UTC'}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Australia/Sydney">Sydney (AEST)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form actions */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-right sm:px-6 flex justify-between">
          <div>
            {!isNewJob && (
              <button
                type="button"
                onClick={handleDelete}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                  confirmDelete
                    ? 'text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                    : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500'
                }`}
              >
                {confirmDelete ? 'Confirm Delete' : 'Delete Job'}
              </button>
            )}
          </div>
          <div className="space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData(job);
                setStartDate(job.startTime ? new Date(job.startTime) : null);
                setEndDate(job.endTime ? new Date(job.endTime) : null);
                setErrors({});
                setConfirmDelete(false);
              }}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isNewJob ? 'Create Job' : 'Update Job'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;
