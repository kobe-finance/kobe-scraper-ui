import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { Form, FormInput, Button, Card, CardHeader, CardContent, CardFooter } from '..';

// Registration form validation schema using Zod
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Infer TypeScript type from the schema
type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form with zod validation
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      // Call register method from auth context
      await registerUser(data.name, data.email, data.password);
      
      // Navigate to dashboard after successful registration
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific registration errors
      if (error instanceof Error && error.message.includes('already exists')) {
        setAuthError('An account with this email already exists.');
      } else {
        setAuthError('Registration failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = form.watch('password');
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  
  // Password strength class and text
  const getStrengthClass = () => {
    if (passwordStrength <= 2) return 'bg-red-500 dark:bg-red-700';
    if (passwordStrength <= 3) return 'bg-yellow-500 dark:bg-yellow-700';
    return 'bg-green-500 dark:bg-green-700';
  };
  
  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Moderate';
    return 'Strong';
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader
          title="Create your account"
          description="Sign up to start using Kobe Scraper"
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
              name="name"
              label="Full Name"
              autoComplete="name"
              placeholder="John Doe"
            />
            
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
              autoComplete="new-password"
              placeholder="••••••••"
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
            />
            
            {/* Password strength indicator */}
            {form.watch('password') && (
              <div className="space-y-1">
                <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-1 rounded-full ${getStrengthClass()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Password strength: <span className="font-medium">{getStrengthText()}</span>
                </p>
              </div>
            )}
            
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
            />
            
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...form.register('terms')}
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {form.formState.errors.terms && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {form.formState.errors.terms.message}
              </p>
            )}
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button
            fullWidth
            isLoading={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            type="submit"
          >
            Create Account
          </Button>
          
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
