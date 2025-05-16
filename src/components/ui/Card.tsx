import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isHoverable?: boolean;
  isSelectable?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isHoverable, isSelectable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base card styles with direct Tailwind utility classes
          'rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950',
          // Conditional styling
          isHoverable && 'transition-shadow hover:shadow-md',
          isSelectable && 'cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900',
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// Define proper type for CardHeaderProps to avoid TypeScript errors
interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
        {props.children}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    />
  );
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  );
});
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
