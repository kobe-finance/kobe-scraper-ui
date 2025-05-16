import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ThemeProvider } from './context';
import { ProtectedRoute } from './components/auth';
import DemoJobConfig from './pages/Demo/DemoJobConfig';
import TestPage from './pages/TestPage'; // Import our test page

// Layouts
import { MainLayout, AuthLayout } from './layouts';

// Pages - Using lazy loading for better performance
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const ScrapersPage = lazy(() => import('./pages/Scrapers/ScrapersPage'));
const JobsPage = lazy(() => import('./pages/Jobs/JobsPage'));
const ResultsPage = lazy(() => import('./pages/Results/ResultsPage'));
const SettingsPage = lazy(() => import('./pages/Settings/SettingsPage'));
const ComponentsPage = lazy(() => import('./pages/Components/ComponentsPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const OnboardingWizard = lazy(() => import('./pages/Onboarding/OnboardingWizard'));
const ScraperInterface = lazy(() => import('./pages/Scraper/ScraperInterface'));
const MonitoringPage = lazy(() => import('./pages/Monitoring/MonitoringPage'));
const OptimizedMobileWorkflowBuilder = lazy(() => import('./components/automation/OptimizedMobileWorkflowBuilder'));
const OptimizedMobileSchedulerInterface = lazy(() => import('./components/automation/scheduler/OptimizedMobileSchedulerInterface'));
const DocumentationPage = lazy(() => import('./components/documentation/DocumentationPage'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Demo Routes - No Authentication Required */}
            <Route path="/demo/job-config" element={<DemoJobConfig />} />
            
            {/* Onboarding Routes */}
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/onboarding/demo" element={<OnboardingWizard />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Route>

            {/* Direct Access for Development */}
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="scrapers" element={<ScrapersPage />} />
              <Route path="scraper" element={<ScraperInterface />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="workflow" element={<OptimizedMobileWorkflowBuilder />} />
              <Route path="scheduler" element={<OptimizedMobileSchedulerInterface />} />
              <Route path="monitoring" element={<MonitoringPage />} />
              <Route path="monitoring/:jobId" element={<MonitoringPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="components" element={<ComponentsPage />} />
              <Route path="docs" element={<DocumentationPage />} />
              <Route path="docs/introduction" element={<DocumentationPage page="introduction" />} />
              <Route path="docs/installation" element={<DocumentationPage page="installation" />} />
              <Route path="docs/first-scraper" element={<DocumentationPage page="first-scraper" />} />
              <Route path="docs/workflow-basics" element={<DocumentationPage page="workflow-basics" />} />
              <Route path="docs/node-types" element={<DocumentationPage page="node-types" />} />
              <Route path="docs/advanced-workflows" element={<DocumentationPage page="advanced-workflows" />} />
              <Route path="docs/authentication" element={<DocumentationPage page="authentication" />} />
              <Route path="docs/scraper-endpoints" element={<DocumentationPage page="scraper-endpoints" />} />
              <Route path="docs/results-api" element={<DocumentationPage page="results-api" />} />
              <Route path="docs/schedule-types" element={<DocumentationPage page="schedule-types" />} />
              <Route path="docs/cron-expressions" element={<DocumentationPage page="cron-expressions" />} />
              <Route path="docs/managing-schedules" element={<DocumentationPage page="managing-schedules" />} />
              <Route path="docs/ecommerce-scraping" element={<DocumentationPage page="ecommerce-scraping" />} />
              <Route path="docs/working-with-apis" element={<DocumentationPage page="working-with-apis" />} />
              <Route path="docs/data-processing" element={<DocumentationPage page="data-processing" />} />
              <Route path="docs/common-issues" element={<DocumentationPage page="common-issues" />} />
              <Route path="docs/best-practices" element={<DocumentationPage page="best-practices" />} />
              <Route path="docs/support-resources" element={<DocumentationPage page="support-resources" />} />
            </Route>
            
            {/* Main App Routes (Protected) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="scrapers" element={<ScrapersPage />} />
              <Route path="scraper" element={<ScraperInterface />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="monitoring" element={<MonitoringPage />} />
              <Route path="monitoring/:jobId" element={<MonitoringPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="components" element={<ComponentsPage />} />
            </Route>

            {/* Simple test page for checking navigation directly */}
            <Route path="/test" element={<Suspense fallback={<LoadingFallback />}>
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Navigation Test Links</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <h2 className="text-xl font-semibold mb-3">Main Navigation</h2>
                    <div className="space-y-2">
                      <div><a href="/app" className="text-blue-500 hover:underline">/app - Dashboard</a></div>
                      <div><a href="/app/scheduler" className="text-blue-500 hover:underline">/app/scheduler - Scheduler</a></div>
                      <div><a href="/app/workflow" className="text-blue-500 hover:underline">/app/workflow - Workflow Builder</a></div>
                      <div><a href="/app/scrapers" className="text-blue-500 hover:underline">/app/scrapers - Scrapers</a></div>
                      <div><a href="/app/jobs" className="text-blue-500 hover:underline">/app/jobs - Jobs</a></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <h2 className="text-xl font-semibold mb-3">Secondary Navigation</h2>
                    <div className="space-y-2">
                      <div><a href="/app/monitoring" className="text-blue-500 hover:underline">/app/monitoring - Monitoring</a></div>
                      <div><a href="/app/results" className="text-blue-500 hover:underline">/app/results - Results</a></div>
                      <div><a href="/app/settings" className="text-blue-500 hover:underline">/app/settings - Settings</a></div>
                      <div><a href="/app/components" className="text-blue-500 hover:underline">/app/components - Components</a></div>
                      <div><a href="/app/docs" className="text-blue-500 hover:underline">/app/docs - Documentation</a></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded md:col-span-2">
                    <h2 className="text-xl font-semibold mb-3">Other Pages</h2>
                    <div className="space-y-2">
                      <div><a href="/" className="text-blue-500 hover:underline">/ - Landing Page</a></div>
                      <div><a href="/dashboard" className="text-blue-500 hover:underline">/dashboard - Protected Dashboard</a></div>
                      <div><a href="/auth/login" className="text-blue-500 hover:underline">/auth/login - Login Page</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </Suspense>} />
            
            {/* Test page for diagnosis */}
            <Route path="/test-page" element={<TestPage />} />
            
            {/* Redirect any unknown routes to Landing if not authenticated, Dashboard if authenticated */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
