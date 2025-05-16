import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../../components/ui/Input';
import type { JobFormValues } from './types';

export const ScheduleConfigTab: React.FC = () => {
  const { register, formState: { errors }, watch } = useFormContext<JobFormValues>();
  const scheduleType = watch('scheduleType');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Schedule Configuration</h3>
        
        <div className="space-y-2">
          <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Schedule Type
          </label>
          <select
            id="scheduleType"
            {...register('scheduleType')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="once">Run Once (Immediately)</option>
            <option value="scheduled">Scheduled (One Time)</option>
            <option value="recurring">Recurring Schedule</option>
          </select>
          {errors.scheduleType && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.scheduleType.message}</p>
          )}
        </div>
        
        {scheduleType === 'scheduled' && (
          <div className="space-y-2">
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Scheduled Date & Time
            </label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              {...register('scheduledDate')}
              className="w-full"
            />
            {errors.scheduledDate && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.scheduledDate.message}</p>
            )}
          </div>
        )}
        
        {scheduleType === 'recurring' && (
          <>
            <div className="space-y-2">
              <label htmlFor="recurringType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Recurring Pattern
              </label>
              <select
                id="recurringType"
                {...register('recurringType')}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom (CRON Expression)</option>
              </select>
              {errors.recurringType && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.recurringType.message}</p>
              )}
            </div>
            
            {watch('recurringType') === 'hourly' && (
              <div className="space-y-2">
                <label htmlFor="hourlyInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Run every X hours
                </label>
                <Input
                  id="hourlyInterval"
                  type="number"
                  {...register('hourlyInterval', { valueAsNumber: true })}
                  min={1}
                  max={24}
                  placeholder="1"
                  className="w-full"
                />
                {errors.hourlyInterval && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.hourlyInterval.message}</p>
                )}
              </div>
            )}
            
            {watch('recurringType') === 'daily' && (
              <div className="space-y-2">
                <label htmlFor="dailyTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Run at this time daily
                </label>
                <Input
                  id="dailyTime"
                  type="time"
                  {...register('dailyTime')}
                  className="w-full"
                />
                {errors.dailyTime && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.dailyTime.message}</p>
                )}
              </div>
            )}
            
            {watch('recurringType') === 'weekly' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center">
                        <input
                          id={`day-${day}`}
                          type="checkbox"
                          {...register(`weeklyDays.${day.toLowerCase()}`)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="weeklyTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Run at this time
                  </label>
                  <Input
                    id="weeklyTime"
                    type="time"
                    {...register('weeklyTime')}
                    className="w-full"
                  />
                  {errors.weeklyTime && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.weeklyTime.message}</p>
                  )}
                </div>
              </>
            )}
            
            {watch('recurringType') === 'monthly' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="monthlyDay" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Day of Month
                  </label>
                  <Input
                    id="monthlyDay"
                    type="number"
                    {...register('monthlyDay', { valueAsNumber: true })}
                    min={1}
                    max={31}
                    placeholder="1"
                    className="w-full"
                  />
                  {errors.monthlyDay && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.monthlyDay.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="monthlyTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Run at this time
                  </label>
                  <Input
                    id="monthlyTime"
                    type="time"
                    {...register('monthlyTime')}
                    className="w-full"
                  />
                  {errors.monthlyTime && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.monthlyTime.message}</p>
                  )}
                </div>
              </>
            )}
            
            {watch('recurringType') === 'custom' && (
              <div className="space-y-2">
                <label htmlFor="cronExpression" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  CRON Expression
                </label>
                <Input
                  id="cronExpression"
                  {...register('cronExpression')}
                  placeholder="0 0 * * *"
                  className="w-full"
                />
                {errors.cronExpression && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.cronExpression.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  5-field CRON expression (minute hour day-of-month month day-of-week)
                </p>
              </div>
            )}
          </>
        )}
        
        <div className="space-y-2">
          <label htmlFor="priorityLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority Level
          </label>
          <select
            id="priorityLevel"
            {...register('priorityLevel')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.priorityLevel && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.priorityLevel.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="runImmediate"
              type="checkbox"
              {...register('runImmediate')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="runImmediate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Run immediately after save (regardless of schedule)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
