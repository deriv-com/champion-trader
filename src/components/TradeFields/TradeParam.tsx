import { Card, CardContent } from "@/components/ui/card";

interface TradeParamProps {
  label: string;
  value: string;
  onClick?: () => void;
}

const TradeParam: React.FC<TradeParamProps> = ({ label, value, onClick }) => {
  return (
    <Card 
      className={`flex-1 ${onClick ? 'cursor-pointer' : ''}`}
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
