import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { Form, FormInput, Button, Card, CardHeader, CardContent, CardFooter } from '..';

// Login form validation schema using Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});

// Infer TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the return URL from location state or default to dashboard
  const from = (location.state as any)?.from || '/';

  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      // Call login method from auth context
      await login(data.email, data.password);
      
      // Navigate to the return URL after successful login
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader
          title="Log in to your account"
          description="Enter your credentials to access the Kobe Scraper dashboard"
        />
        <CardContent>
          <Form
            form={form}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            {authError && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-200">
                {authError}
              </div>
            )}
            
            <FormInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
            
            <FormInput
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...form.register('rememberMe')}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Forgot your password?
              </Link>
            </div>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button
            fullWidth
            isLoading={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
          >
            Sign in
          </Button>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
