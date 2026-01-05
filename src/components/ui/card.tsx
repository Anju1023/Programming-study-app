import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl border-2 border-slate-200 bg-white p-4 transition-all",
          active && "border-duo-blue bg-blue-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
