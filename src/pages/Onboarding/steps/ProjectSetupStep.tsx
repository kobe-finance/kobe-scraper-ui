import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StepProps } from '../OnboardingWizard';

interface ProjectFormValues {
  name: string;
  description: string;
}

const ProjectSetupStep: React.FC<StepProps> = ({ onNext, onPrevious, currentData }) => {
  const [targetWebsites, setTargetWebsites] = useState<string[]>(
    currentData.project.targetWebsites || []
  );
  const [websiteInput, setWebsiteInput] = useState('');
  const [inputError, setInputError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    defaultValues: {
      name: currentData.project.name || '',
      description: currentData.project.description || '',
    }
  });

  const validateUrl = (url: string) => {
    // Basic URL validation
    try {
      // Add protocol if missing
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddWebsite = () => {
    if (!websiteInput.trim()) {
      setInputError('Please enter a website URL');
      return;
    }

    if (!validateUrl(websiteInput)) {
      setInputError('Please enter a valid website URL');
      return;
    }

    // Normalize URL format
    let normalizedUrl = websiteInput.trim();
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Check for duplicates
    if (targetWebsites.includes(normalizedUrl)) {
      setInputError('This website is already in your list');
      return;
    }

    setTargetWebsites([...targetWebsites, normalizedUrl]);
    setWebsiteInput('');
    setInputError('');
  };

  const handleRemoveWebsite = (websiteToRemove: string) => {
    setTargetWebsites(targetWebsites.filter(site => site !== websiteToRemove));
  };

  const onSubmit = (data: ProjectFormValues) => {
    if (targetWebsites.length === 0) {
      setInputError('Please add at least one target website');
      return;
    }

    onNext({
      ...data,
      targetWebsites,
    });
  };

  return (
    <div className="p-6 sm:p-8">
      <div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Create Your First Project
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Define what data you want to collect and from where.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.name 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              placeholder="e.g. Competitor Price Monitoring"
              {...register('name', { required: 'Project name is required' })}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={3}
              className={`
                shadow-sm block w-full sm:text-sm rounded-md 
                ${errors.description 
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-400' 
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'}
              `}
              placeholder="Briefly describe what data you want to collect and how you plan to use it"
              {...register('description', { required: 'Project description is required' })}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="websites" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Websites
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add the websites you want to scrape data from
          </p>
          <div className="mt-2 flex rounded-md shadow-sm">
            <input
              type="text"
              id="websites"
              value={websiteInput}
              onChange={(e) => setWebsiteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddWebsite();
                }
              }}
              className="focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white dark:border-gray-700 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
              placeholder="www.example.com"
            />
            <button
              type="button"
              onClick={handleAddWebsite}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            >
              Add
            </button>
          </div>
          {inputError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{inputError}</p>
          )}

          {/* List of added websites */}
          {targetWebsites.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Websites:</h4>
              <ul className="mt-2 space-y-2">
                {targetWebsites.map((website, index) => (
                  <li 
                    key={index}
                    className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded-md"
                  >
                    <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                      {website}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWebsite(website)}
                      className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example sites tooltip */}
          {targetWebsites.length === 0 && (
            <div className="rounded-md bg-blue-50 dark:bg-blue-900 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Examples</h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>For competitor price monitoring, try adding:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>amazon.com</li>
                      <li>walmart.com</li>
                      <li>target.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
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

export default ProjectSetupStep;
