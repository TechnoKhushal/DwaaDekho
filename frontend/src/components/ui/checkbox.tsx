import * as React from 'react';
import {
  Checkbox as Primitive,
  CheckboxProps as PrimitiveCheckboxProps,
} from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Primitive>,
  React.ComponentPropsWithoutRef<typeof Primitive>
>(({ className, ...props }, ref) => (
  <Primitive
    className={cn(
      'h-4 w-4 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 data-[state=unchecked]:border-input data-[state=unchecked]:bg-background hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));
Checkbox.displayName = Primitive.displayName;

export { Checkbox };