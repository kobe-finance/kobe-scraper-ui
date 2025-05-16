import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary-600 dark:text-primary-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Kobe Scraper
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start your web scraping journey today
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
