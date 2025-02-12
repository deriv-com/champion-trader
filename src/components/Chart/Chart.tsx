import React from 'react';
import { cn } from '@/lib/utils';

interface ChartProps {
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({ className }) => {
  return (
    <div className={cn("contents", className)}>
      <div className="flex-1 bg-gray-100 h-full w-full rounded-lg flex items-center justify-center">
      Chart Component
      </div>
    </div>
  );
};
