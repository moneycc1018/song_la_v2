import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("text-muted-foreground", {
  variants: {
    size: {
      default: "size-4",
      lg: "size-6",
      xl: "size-12",
      icon: "size-9",
    },
    variant: {
      default: "text-primary",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface SpinnerProps extends React.ComponentProps<"svg">, VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      className={cn("animate-spin", spinnerVariants({ size, variant, className }))}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="9" />
      <path className="opacity-75" d="M12 3a9 9 0 0 1 9 9" />
      <span className="sr-only">Loading...</span>
    </svg>
  );
}

export { Spinner };
