import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface shadow-sm hover:shadow-md transition-shadow',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card';

export { Card };