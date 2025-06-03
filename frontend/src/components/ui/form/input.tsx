import * as React from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/utils/cn';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';
import { EyeIcon as EyeRconReact, EyeOff } from 'lucide-react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };


const EyeIcon = ({ open }: { open: boolean }) => (
  open ? (
    <EyeOff />
  ) : (
    <EyeRconReact />
  )
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, registration, ...props }, ref) => {
    const [show,setShow] = React.useState(false)
    const isPassword = type === "password"
    return (
      <FieldWrapper label={label} error={error}>
        <div className="relative">
          <input
            type={isPassword ? (show ? 'text' : 'password') : type}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              isPassword ? 'pr-10' : '',
              className,
            )}
            ref={ref}
            {...registration}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={show} />
            </button>
          )}
        </div>
        </FieldWrapper>
    );
  },
);
Input.displayName = 'Input';

export { Input };
