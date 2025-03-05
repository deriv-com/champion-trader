import { AreaChart } from 'lucide-react';

interface DurationOptionsProps {
  className?: string;
}

export const DurationOptions: React.FC<DurationOptionsProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center p-4 ${className}`}>
      <div className="flex items-center gap-4 pr-4">
        <button className="text-gray-600 hover:text-gray-700" aria-label="chart">
          <AreaChart className="w-5 h-5" />
        </button>
        <div className='w-0.5 h-5 bg-gray-100'></div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-primary text-primary">1t</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">1m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">2m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">3m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">5m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">10m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">15m</button>
        <button className="text-sm font-medium text-gray-500 text-secondary">30m</button>
      </div>
    </div>
  );
};
