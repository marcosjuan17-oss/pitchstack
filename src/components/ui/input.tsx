import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-[var(--radius-md)] bg-surface px-3 text-base text-fg shadow-[var(--shadow-border)]",
      "placeholder:text-subtle",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
