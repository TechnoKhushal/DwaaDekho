import * as React from 'react';
import {
  Dialog as PrimitiveDialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Modal = ({ children, open, onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (open: boolean) => void }) => {
  return (
    <PrimitiveDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </PrimitiveDialog>
  );
};
Modal.displayName = PrimitiveDialog.displayName;

const ModalTrigger = ({ className = '', children, ...props }: React.ComponentProps<typeof DialogTrigger>) => (
  <DialogTrigger
    className={cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
  </DialogTrigger>
);
ModalTrigger.displayName = DialogTrigger.displayName;

const ModalPortal = ({ children, ...props }: React.ComponentProps<typeof DialogPortal>) => (
  <DialogPortal {...props}>
    {children}
  </DialogPortal>
);
ModalPortal.displayName = DialogPortal.displayName;

const ModalOverlay = ({ className = '', ...props }: React.ComponentProps<typeof DialogOverlay>) => (
  <DialogOverlay
    className={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
    {...props}
  />
);
ModalOverlay.displayName = DialogOverlay.displayName;

const ModalHeader = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}>
    {children}
  </div>
);
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = ({ className = '', children, ...props }: React.ComponentProps<typeof DialogTitle>) => (
  <DialogTitle
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  >
    {children}
  </DialogTitle>
);
ModalTitle.displayName = DialogTitle.displayName;

const ModalDescription = ({ className = '', children, ...props }: React.ComponentProps<typeof DialogDescription>) => (
  <DialogDescription
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  >
    {children}
  </DialogDescription>
);
ModalDescription.displayName = DialogDescription.displayName;

const ModalContent = ({ className = '', children, ...props }: React.ComponentProps<typeof DialogContent>) => (
  <DialogPortal>
    <ModalOverlay />
    <DialogContent
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogContent>
  </DialogPortal>
);
ModalContent.displayName = DialogContent.displayName;

const ModalFooter = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
ModalFooter.displayName = 'ModalFooter';

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
};