import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, required, ...props }, ref) => (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    >
      {required ? (
        <>
          {props.children}
          <span className="ml-1 text-destructive">*</span>
        </>
      ) : (
        props.children
      )}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };