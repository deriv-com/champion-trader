import { AreaChart } from "lucide-react";

interface DurationOptionsProps {
    className?: string;
}

export const DurationOptions: React.FC<DurationOptionsProps> = ({ className = "" }) => {
    return (
        <div className={`flex items-center px-4 py-3 ${className}`}>
            <div className="flex items-center gap-4 pr-4">
                <button className="text-theme-muted hover:text-theme" aria-label="chart">
                    <AreaChart className="w-5 h-5" />
                </button>
                <div className="w-0.5 h-5 bg-theme-border"></div>
            </div>
            <div className="flex items-center gap-4">
                <button className="text-sm font-medium text-theme-muted">1t</button>
                <button className="text-sm font-medium text-theme-muted">1m</button>
                <button className="text-sm font-medium text-theme-muted">2m</button>
                <button className="text-sm font-medium text-theme-muted">3m</button>
                <button className="text-sm font-medium text-theme-muted">5m</button>
                <button className="text-sm font-medium text-theme-muted">10m</button>
                <button className="text-sm font-medium text-theme-muted">15m</button>
                <button className="text-sm font-medium text-theme-muted">30m</button>
            </div>
        </div>
    );
};
