import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';

// Onboarding Steps
import WelcomeStep from './steps/WelcomeStep';
import ProfileSetupStep from './steps/ProfileSetupStep';
import ProjectSetupStep from './steps/ProjectSetupStep';
import DataSourcesStep from './steps/DataSourcesStep';
import CompletionStep from './steps/CompletionStep';

// Define the step structure
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<StepProps>;
}

// Props passed to each step component
export interface StepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  onSkip: () => void;
  currentData: any;
  stepIndex: number;
  totalSteps: number;
}

// User onboarding data structure
export interface OnboardingData {
  profileCompleted: boolean;
  projectCompleted: boolean;
  dataSourcesCompleted: boolean;
  preferences: {
    notificationsEnabled: boolean;
    theme: string;
    exportFormat: string;
    defaultSchedule: string;
  };
  profile: {
    fullName: string;
    jobTitle: string;
    company: string;
    industry: string;
  };
  project: {
    name: string;
    description: string;
    targetWebsites: string[];
  };
  dataSources: {
    sources: string[];
    frequency: string;
    proxyEnabled: boolean;
  };
}

const OnboardingWizard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isSkippable, setIsSkippable] = useState(false);
  
  // Initialize onboarding data
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profileCompleted: false,
    projectCompleted: false,
    dataSourcesCompleted: false,
    preferences: {
      notificationsEnabled: true,
      theme: 'system',
      exportFormat: 'csv',
      defaultSchedule: 'daily',
    },
    profile: {
      fullName: user?.name || '',
      jobTitle: '',
      company: '',
      industry: '',
    },
    project: {
      name: '',
      description: '',
      targetWebsites: [],
    },
    dataSources: {
      sources: [],
      frequency: 'daily',
      proxyEnabled: true,
    }
  });

  // Define all steps in the onboarding process
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Kobe Scraper',
      description: 'Get started with a few simple steps',
      component: WelcomeStep,
    },
    {
      id: 'profile',
      title: 'Setup Your Profile',
      description: 'Tell us a bit about yourself',
      component: ProfileSetupStep,
    },
    {
      id: 'project',
      title: 'Create Your First Project',
      description: 'Define what you want to scrape',
      component: ProjectSetupStep,
    },
    {
      id: 'data-sources',
      title: 'Configure Data Sources',
      description: 'Select your initial data sources',
      component: DataSourcesStep,
    },
    {
      id: 'completion',
      title: 'All Set!',
      description: 'Your scraper is ready to go',
      component: CompletionStep,
    },
  ];

  // Check if user has already completed onboarding
  useEffect(() => {
    if (isAuthenticated && user) {
      // This could be a real API call to check onboarding status
      const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted') === 'true';
      
      if (hasCompletedOnboarding && location.pathname !== '/onboarding/demo') {
        setOnboardingCompleted(true);
      }
      
      // Allow skipping for returning users
      setIsSkippable(localStorage.getItem('registrationDate') !== null);
    }
  }, [isAuthenticated, user, location.pathname]);

  // Handle moving to the next step
  const handleNext = (stepData?: any) => {
    if (stepData) {
      // Update data for the current step
      const updatedData = { ...onboardingData };
      
      switch (currentStep) {
        case 1: // Profile step
          updatedData.profile = { ...updatedData.profile, ...stepData };
          updatedData.profileCompleted = true;
          break;
        case 2: // Project step
          updatedData.project = { ...updatedData.project, ...stepData };
          updatedData.projectCompleted = true;
          break;
        case 3: // Data sources step
          updatedData.dataSources = { ...updatedData.dataSources, ...stepData };
          updatedData.dataSourcesCompleted = true;
          break;
        default:
          // For steps that don't have specific data
          break;
      }
      
      setOnboardingData(updatedData);
    }
    
    // Move to next step if not at the end
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      // Onboarding completed
      completeOnboarding();
    }
  };

  // Handle moving to the previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle skipping the onboarding process
  const handleSkip = () => {
    if (currentStep === steps.length - 1) {
      // If on the last step, complete normally
      completeOnboarding();
    } else {
      // Skip to dashboard
      localStorage.setItem('onboardingCompleted', 'true');
      navigate('/dashboard');
    }
  };

  // Mark onboarding as completed and redirect to dashboard
  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    // If this is the demo, don't redirect
    if (location.pathname === '/onboarding/demo') {
      // Reset to first step for demo purposes
      setCurrentStep(0);
    } else {
      navigate('/dashboard');
    }
  };

  // If onboarding is already completed and this is not the demo, redirect to dashboard
  if (onboardingCompleted && location.pathname !== '/onboarding/demo') {
    return <Navigate to="/dashboard" replace />;
  }

  // Get the current step component
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Step content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <CurrentStepComponent
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            currentData={onboardingData}
            stepIndex={currentStep}
            totalSteps={steps.length}
          />
        </div>

        {/* Skip button - only show if skippable and not on the last step */}
        {isSkippable && currentStep < steps.length - 1 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Skip setup and go to dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
