import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ className, children, open, ...props }, ref) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex" ref={ref} {...props}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        <div className={cn('relative ml-auto h-full w-full max-w-md bg-surface p-6 shadow-xl overflow-y-auto', className)}>
          {children}
        </div>
      </div>
    );
  }
);
Drawer.displayName = 'Drawer';

export { Drawer };