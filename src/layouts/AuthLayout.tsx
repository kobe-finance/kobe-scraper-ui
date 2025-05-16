import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout for authentication pages (login, register, forgot password)
 * Provides a simple centered layout with branding
 */
const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
