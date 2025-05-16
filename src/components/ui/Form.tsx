import React from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from 'react-hook-form';
import type { 
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldValues,
} from 'react-hook-form';
import { cn } from '../../utils/cn';
import { Input } from './Input';
import type { InputProps } from './Input';

interface FormProps<TFormValues extends FieldValues> 
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<TFormValues>;
  onSubmit: SubmitHandler<TFormValues>;
}

const Form = <TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<TFormValues>) => {
  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

interface FormFieldProps<TFormValues extends FieldValues> {
  name: string;
  render: (props: { field: any; fieldState: any; formState: any }) => React.ReactNode;
}

const FormField = <TFormValues extends FieldValues>({
  name,
  render,
}: FormFieldProps<TFormValues>) => {
  const form = useFormContext();
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState, formState }) => render({ field, fieldState, formState })}
    />
  );
};

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  helperText?: string;
  error?: string;
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, label, htmlFor, helperText, error, ...props }, ref) => {
    const id = htmlFor || '';
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        {children}
        {(helperText || error) && (
          <p
            className={cn(
              "text-xs",
              error ? 'text-red-500' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
FormItem.displayName = 'FormItem';

interface FormInputProps extends Omit<InputProps, 'error' | 'success'> {
  name: string;
}

const FormInput = ({ name, ...props }: FormInputProps) => {
  const { control, formState: { errors } } = useFormContext();
  const errorMessage = errors[name]?.message as string | undefined;
  
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <Input
          error={errorMessage}
          success={!errorMessage && field.value !== ''}
          {...field}
          {...props}
        />
      )}
    />
  );
};

interface UseFormControllerProps<TFormValues extends FieldValues> extends UseFormProps<TFormValues> {
  defaultValues: Record<string, any>;
}

const useFormController = <TFormValues extends FieldValues>({
  defaultValues,
  ...formProps
}: UseFormControllerProps<TFormValues>) => {
  return useForm<TFormValues>({
    defaultValues: defaultValues as UnknownKeysParam<TFormValues>,
    ...formProps,
  });
};

// This is a TypeScript helper to handle the defaultValues type
type UnknownKeysParam<T> = T extends Record<string, unknown> ? T : never;

export { Form, FormField, FormItem, FormInput, useFormController };
