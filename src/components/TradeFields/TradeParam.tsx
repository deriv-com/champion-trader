import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TradeParamProps {
  label: string;
  value: string;
  className?: string;
  onClick?: () => void;
}

const TradeParam: React.FC<TradeParamProps> = ({ label, value, className, onClick }) => {
  return (
    <Card 
      className={cn(`flex-1 ${onClick ? 'cursor-pointer' : ''}`, className)}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-bold text-gray-700">{value}</div>
      </CardContent>
    </Card>
  );
};

export default TradeParam;
