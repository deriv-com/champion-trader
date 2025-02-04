import { BarChart2, Clock, Expand } from 'lucide-react';

interface DurationOptionsProps {
  className?: string;
}

export const DurationOptions: React.FC<DurationOptionsProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-between p-4 border-t border-b ${className}`}>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-primary">1t</button>
        <button className="text-sm font-medium text-gray-500">1m</button>
        <button className="text-sm font-medium text-gray-500">2m</button>
        <button className="text-sm font-medium text-gray-500">3m</button>
        <button className="text-sm font-medium text-gray-500">5m</button>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700" aria-label="chart">
          <BarChart2 className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700" aria-label="clock">
          <Clock className="w-5 h-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-700" aria-label="expand">
          <Expand className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
