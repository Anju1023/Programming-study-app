import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileFrame = ({ children, className }: MobileFrameProps) => {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-white shadow-2xl lg:shadow-none">
      <main className={cn("pb-20", className)}>{children}</main>
    </div>
  );
};
