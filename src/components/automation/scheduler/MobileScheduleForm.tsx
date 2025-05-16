import React, { useState, useEffect } from 'react';
import { ScheduledJob, ScheduleFrequency, DayOfWeek } from './types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MobileScheduleFormProps {
  job: ScheduledJob;
  isNewJob: boolean;
  onSave: (job: ScheduledJob) => void;
  onDelete: (jobId: string) => void;
  onCancel: () => void;
}

/**
 * Mobile-optimized schedule form component
 * Features larger touch targets, simplified layout, and improved accessibility
 */
const MobileScheduleForm: React.FC<MobileScheduleFormProps> = ({
  job,
  isNewJob,
  onSave,
  onDelete,
  onCancel
}) => {
  const [formData, setFormData] = useState<ScheduledJob>(job);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Update form data when job changes
  useEffect(() => {
    setFormData(job);
    setConfirmDelete(false);
    setErrors({});
  }, [job]);

  // Sample workflows for the dropdown
  const sampleWorkflows = [
    { id: 'workflow-1', name: 'E-commerce Scraper' },
    { id: 'workflow-2', name: 'Price Analyzer' },
    { id: 'workflow-3', name: 'Competitor Tracker' },
    { id: 'workflow-4', name: 'Export Pipeline' },
    { id: 'workflow-5', name: 'Stock Tracker' }
  ];

  // Form steps for mobile-friendly wizard
  const steps = [
    { title: 'Basic Info', description: 'Name and workflow' },
    { title: 'Schedule Type', description: 'One-time or recurring' },
    { title: 'Timing', description: 'When to run' },
    { title: 'Review', description: 'Finalize details' }
  ];

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

  // Days of the week for the checkbox group
  const daysOfWeek: Array<{ value: DayOfWeek; label: string }> = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  // Next step button handler
  const handleNextStep = () => {
    // Validate current step before proceeding
    const validationErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      if (!formData.name.trim()) {
        validationErrors.name = 'Job name is required';
      }
      if (!formData.workflowId) {
        validationErrors.workflowId = 'Workflow is required';
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  // Previous step button handler
  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  return (
    <div className="h-full flex flex-col" role="dialog" aria-labelledby="mobile-schedule-form-title">
      {/* Mobile form header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
        <h2 
          id="mobile-schedule-form-title" 
          className="text-lg font-medium text-gray-900 dark:text-white"
        >
          {isNewJob ? 'Create New Job' : 'Edit Job Schedule'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Step indicator */}
      <nav aria-label="Progress" className="mb-6">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li 
              key={step.title} 
              className={stepIdx !== steps.length - 1 ? 'flex-1' : ''} 
              aria-current={currentStep === stepIdx ? 'step' : undefined}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep === stepIdx
                      ? 'bg-indigo-600 text-white'
                      : currentStep > stepIdx
                      ? 'bg-indigo-400 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  <span className="text-sm">{stepIdx + 1}</span>
                </div>
                <span 
                  className={`mt-2 text-xs ${
                    currentStep === stepIdx 
                      ? 'text-indigo-700 dark:text-indigo-400 font-medium' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`w-full h-0.5 ${
                    currentStep > stepIdx
                      ? 'bg-indigo-400'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Job name */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.name ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600" id="name-error">{errors.name}</p>
              )}
            </div>

            {/* Workflow selection */}
            <div>
              <label htmlFor="workflowId" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workflow
              </label>
              <select
                id="workflowId"
                name="workflowId"
                value={formData.workflowId}
                onChange={handleChange}
                className={`shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${errors.workflowId ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'}`}
                aria-invalid={errors.workflowId ? 'true' : 'false'}
                aria-describedby={errors.workflowId ? 'workflow-error' : undefined}
              >
                <option value="">Select a workflow</option>
                {sampleWorkflows.map(workflow => (
                  <option key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </option>
                ))}
              </select>
              {errors.workflowId && (
                <p className="mt-2 text-sm text-red-600" id="workflow-error">{errors.workflowId}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Schedule Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Schedule type */}
            <div>
              <fieldset>
                <legend className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Schedule Type
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="schedule-one-time"
                      name="scheduleType"
                      type="radio"
                      value="one-time"
                      checked={formData.scheduleType === 'one-time'}
                      onChange={() => setFormData({...formData, scheduleType: 'one-time', frequency: 'once'})}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="schedule-one-time" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                      One-time Job
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="schedule-recurring"
                      name="scheduleType"
                      type="radio"
                      value="recurring"
                      checked={formData.scheduleType === 'recurring'}
                      onChange={() => setFormData({...formData, scheduleType: 'recurring', frequency: 'daily'})}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="schedule-recurring" className="ml-3 block text-base text-gray-700 dark:text-gray-300">
                      Recurring Job
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Frequency - only for recurring jobs */}
            {formData.scheduleType === 'recurring' && (
              <div>
                <label htmlFor="frequency" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="minutely">Every Minute</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            {/* Weekly schedule options */}
            {formData.scheduleType === 'recurring' && formData.frequency === 'weekly' && (
              <div>
                <fieldset>
                  <legend className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days of Week
                  </legend>
                  {errors.daysOfWeek && (
                    <p className="mt-2 text-sm text-red-600" id="daysOfWeek-error">{errors.daysOfWeek}</p>
                  )}
                  <div className="mt-3 flex justify-between">
                    {daysOfWeek.map(day => (
                      <div key={day.value} className="flex flex-col items-center">
                        <input
                          id={`day-${day.value}`}
                          name={`day-${day.value}`}
                          type="checkbox"
                          checked={(formData.daysOfWeek || []).includes(day.value)}
                          onChange={handleCheckboxChange}
                          className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                          aria-describedby={errors.daysOfWeek ? 'daysOfWeek-error' : undefined}
                        />
                        <label
                          htmlFor={`day-${day.value}`}
                          className="mt-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Timing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Time selection - mobile-friendly controls */}
            <div>
              <label htmlFor="time" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.hourOfDay !== undefined ? `${String(formData.hourOfDay).padStart(2, '0')}:${String(formData.minuteOfHour || 0).padStart(2, '0')}` : ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  setFormData({
                    ...formData,
                    hourOfDay: hours,
                    minuteOfHour: minutes
                  });
                }}
                className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Date selection for one-time jobs */}
            {formData.scheduleType === 'one-time' && (
              <div>
                <label htmlFor="date" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.startTime ? new Date(formData.startTime).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    const currentDate = formData.startTime ? new Date(formData.startTime) : new Date();
                    currentDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    setFormData({
                      ...formData,
                      startTime: currentDate.toISOString(),
                      nextRunTime: currentDate.toISOString()
                    });
                  }}
                />
              </div>
            )}

            {/* Timezone */}
            <div>
              <label htmlFor="timezone" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone || 'UTC'}
                onChange={handleChange}
                className="shadow-sm block w-full px-4 py-3 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Australia/Sydney">Sydney (AEST)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Job Summary</h3>
              
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-white">{formData.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Workflow</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-white">
                    {sampleWorkflows.find(w => w.id === formData.workflowId)?.name || 'None'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Schedule Type</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-white capitalize">
                    {formData.scheduleType === 'one-time' ? 'One-time' : `${formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)}`}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-white">
                    {formData.hourOfDay !== undefined ? 
                      `${String(formData.hourOfDay).padStart(2, '0')}:${String(formData.minuteOfHour || 0).padStart(2, '0')}` : 
                      'Not set'}
                  </dd>
                </div>
                
                {formData.scheduleType === 'recurring' && formData.frequency === 'weekly' && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Days</dt>
                    <dd className="mt-1 text-base text-gray-900 dark:text-white">
                      {formData.daysOfWeek?.map(day => 
                        day.charAt(0).toUpperCase() + day.slice(1)
                      ).join(', ') || 'None'}
                    </dd>
                  </div>
                )}
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</dt>
                  <dd className="mt-1 text-base text-gray-900 dark:text-white">
                    {formData.timezone || 'UTC'}
                  </dd>
                </div>
              </dl>
            </div>

            {!isNewJob && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="text-base font-medium text-red-800 dark:text-red-300 mb-2">Danger Zone</h3>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                      : 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400'
                  }`}
                  aria-label={confirmDelete ? 'Confirm delete job' : 'Delete job'}
                >
                  {confirmDelete ? 'Confirm Delete' : 'Delete Job'}
                </button>
                {confirmDelete && (
                  <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                    This action cannot be undone.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={currentStep > 0 ? handlePrevStep : onCancel}
          className="inline-flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          {currentStep > 0 ? 'Back' : 'Cancel'}
        </button>
        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            {isNewJob ? 'Create Job' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileScheduleForm;
