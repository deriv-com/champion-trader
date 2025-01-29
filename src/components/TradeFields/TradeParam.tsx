import { Card, CardContent } from "@/components/ui/card";

interface TradeParamProps {
  label: string;
  value: string;
}

const TradeParam: React.FC<TradeParamProps> = ({ label, value }) => (
  <Card className="flex-1">
    <CardContent className="p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-bold text-gray-700">{value}</div>
    </CardContent>
  </Card>
);

export default TradeParam;
