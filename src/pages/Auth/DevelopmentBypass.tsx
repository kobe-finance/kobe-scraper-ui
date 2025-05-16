import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components';

/**
 * This component provides a development bypass for the login page
 * Only to be used in development environment, never in production
 */
export const DevelopmentBypass: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBypass = () => {
    // Set a mock token in localStorage to simulate authenticated state
    localStorage.setItem('kobe_auth_token', 'dev-token-123');
    localStorage.setItem('kobe_user', JSON.stringify({
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'admin'
    }));
    
    // Navigate to the dashboard
    navigate('/dashboard');
  };
  
  return (
    <div className="mt-4">
      <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-md">
        <p className="text-sm text-yellow-700 mb-2">
          <strong>Development Environment Only:</strong> Use the button below to bypass authentication.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={handleBypass}
          className="bg-yellow-500 hover:bg-yellow-600 border-yellow-600"
        >
          Bypass Authentication (Dev Only)
        </Button>
      </div>
    </div>
  );
};
