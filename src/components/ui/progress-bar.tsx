import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
  color?: "green" | "blue" | "yellow" | "red";
}

const colorMap = {
  green: "bg-duo-green",
  blue: "bg-duo-blue",
  yellow: "bg-duo-yellow",
  red: "bg-duo-red",
};

export const ProgressBar = ({
  value,
  className,
  color = "green",
}: ProgressBarProps) => {
  return (
    <div
      className={cn(
        "h-4 w-full overflow-hidden rounded-full bg-slate-200",
        className,
      )}
    >
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out",
          colorMap[color],
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      >
        <div className="h-1 w-full bg-white/20" /> {/* 光沢感 */}
      </div>
    </div>
  );
};
