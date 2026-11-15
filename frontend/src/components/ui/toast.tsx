import * as React from 'react';
import {
  ToastProvider as PrimitiveToastProvider,
  ToastViewport,
  ToastAction,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';

const ToastProvider = ({ children, ...props }: React.PropsWithChildren<React.ComponentProps<typeof PrimitiveToastProvider>>) => (
  <PrimitiveToastProvider
    {...props}
    duration={5000}
    swipeDirection="right"
  >
    {children}
  </PrimitiveToastProvider>
);
ToastProvider.displayName = PrimitiveToastProvider.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof PrimitiveToastProvider>,
  React.ComponentPropsWithoutRef<typeof PrimitiveToastProvider>
>(({ className, ...props }, ref) => (
  <PrimitiveToastProvider
    {...props}
    ref={ref}
    className={cn('w-full max-w-xs pointer-events-none z-[99] md:absolute md:top-4 md:z-[99] md:right-4', className)}
  >
    <ToastViewport className="pointer-events-auto w-full max-w-xs">
    </ToastViewport>
  </PrimitiveToastProvider>
);
Toast.displayName = PrimitiveToastProvider.displayName;

const ToastAction = ({ className = '', children, ...props }: React.ComponentProps<typeof PrimitiveToastAction>) => (
  <PrimitiveToastAction
    className={cn(
      'flex items-center space-x-2 rounded-md border border-input bg-popover px-3 py-1.5 text-sm shadow-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
);
ToastAction.displayName = PrimitiveToastAction.displayName;

const ToastTitle = ({ className = '', children, ...props }: React.ComponentProps<typeof PrimitiveToastTitle>) => (
  <PrimitiveToastTitle
    className={cn('text-sm font-medium', className)}
    {...props}
  >
    {children}
  </PrimitiveToastTitle>
);
ToastTitle.displayName = PrimitiveToastTitle.displayName;

const ToastDescription = ({ className = '', children, ...props }: React.ComponentProps<typeof PrimitiveToastDescription>) => (
  <PrimitiveToastDescription
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  >
    {children}
  </PrimitiveToastDescription>
);
ToastDescription.displayName = PrimitiveToastDescription.displayName;

const ToastClose = ({ className = '', ...props }: React.ComponentProps<typeof PrimitiveToastClose>) => (
  <PrimitiveToastClose
    className={cn(
      'rounded-md border-input bg-popover p-1.5 hover:bg-accent hover:text-accent-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
    aria-label="Close"
  />
);
ToastClose.displayName = PrimitiveToastClose.displayName;

export { ToastProvider, Toast, ToastAction, ToastTitle, ToastDescription, ToastClose };