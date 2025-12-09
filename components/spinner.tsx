import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      xl: "size-12",
      icon: "size-10",
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
      className={cn(spinnerVariants({ size, variant, className }))}
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      {/* 無障礙閱讀輔助 */}
      <span className="sr-only">Loading...</span>
    </svg>
  );
}

export { Spinner };
