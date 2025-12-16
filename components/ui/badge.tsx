import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  cn(
    "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow]",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring",
    "aria-invalid:ring-destructive/50 aria-invalid:border-destructive",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
        destructive: "bg-destructive [a&]:hover:bg-destructive/90 text-primary-foreground border-transparent",
        outline: "text-primary [a&]:hover:bg-primary [a&]:hover:text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
