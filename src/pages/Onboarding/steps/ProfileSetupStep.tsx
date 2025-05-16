import React from 'react';
import { useForm } from 'react-hook-form';
import type { StepProps } from '../OnboardingWizard';

// List of industry options
const industryOptions = [
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'finance', label: 'Finance' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'retail', label: 'Retail' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'technology', label: 'Technology' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'other', label: 'Other' },
];

interface ProfileFormValues {
  fullName: string;
  jobTitle: string;
  company: string;
  industry: string;
}

const ProfileSetupStep: React.FC<StepProps> = ({ onNext, onPrevious, currentData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    mode: 'onChange',
    defaultValues: {
      fullName: currentData.profile.fullName || '',
      jobTitle: currentData.profile.jobTitle || '',
      company: currentData.profile.company || '',
      industry: currentData.profile.industry || '',
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    onNext(data);
  };

  return (
    <div className="p-6 sm:p-8">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Setup Your Profile
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This information helps us tailor your experience and provide better support.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.fullName 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Title
          </label>
          <div className="mt-1">
            <input
              id="jobTitle"
              type="text"
              autoComplete="organization-title"
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.jobTitle 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              {...register('jobTitle', { required: 'Job title is required' })}
            />
            {errors.jobTitle && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.jobTitle.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company or Organization
          </label>
          <div className="mt-1">
            <input
              id="company"
              type="text"
              autoComplete="organization"
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.company 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              {...register('company', { required: 'Company name is required' })}
            />
            {errors.company && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.company.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Industry
          </label>
          <div className="mt-1">
            <select
              id="industry"
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.industry 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              {...register('industry', { required: 'Industry is required' })}
            >
              <option value="">Select your industry</option>
              {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.industry.message}</p>
            )}
          </div>
        </div>

        {/* Tooltip */}
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Privacy Note</h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  We only use this information to personalize your experience. Your data is secure and will never be shared with third parties without your consent.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-5 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Back
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetupStep;
