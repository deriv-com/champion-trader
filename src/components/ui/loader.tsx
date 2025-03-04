import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
} as const;

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className,
  ...props
}) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center"
      {...props}
    >
      <div
        data-testid="loading-spinner"
        className={cn(
          "animate-spin rounded-full border-t-2 border-b-2 border-blue-500",
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
