import React, { Suspense } from "react";
import { TradeButton } from "@/components/TradeButton";
import { Chart } from "@/components/Chart";
import { AddMarketButton } from "@/components/AddMarketButton";
import { DurationOptions } from "@/components/DurationOptions";
import { useTradeStore } from "@/stores/tradeStore";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface MarketInfoProps {
  title: string;
  subtitle: string;
}

const MarketInfo: React.FC<MarketInfoProps> = ({ title, subtitle }) => (
  <Card className="flex-1">
    <CardContent className="flex items-center gap-3 p-3">
      <div>
        <div className="text-sm font-bold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
      </div>
    </CardContent>
  </Card>
);

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

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between px-4">
    <span className="text-sm text-gray-700">{label}</span>
    <Switch 
      checked={value}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-primary"
    />
  </div>
);

export const TradePage: React.FC = () => {
  const { stake, duration, allowEquals, toggleAllowEquals } = useTradeStore();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center w-full gap-2 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AddMarketButton />
        </Suspense>
        <div className="flex flex-1 gap-2">
          <MarketInfo 
            title="Vol. 100 (1s) Index" 
            subtitle="Rise/Fall" 
          />
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Chart className="flex-1" />
      </Suspense>

      <Suspense fallback={<div>Loading...</div>}>
        <DurationOptions />
      </Suspense>
      
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-4">
          <TradeParam label="Duration" value={duration} />
          <TradeParam label="Stake" value={stake} />
        </div>

        <ToggleButton 
          label="Allow equals" 
          value={allowEquals} 
          onChange={toggleAllowEquals} 
        />
      </div>

      <div className="flex gap-2 p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <TradeButton
            className="bg-emerald-500 hover:bg-emerald-600 rounded-full"
            title="Rise"
            label="Payout"
            value="19.55 USD"
            title_position="right"
          />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <TradeButton
            className="bg-rose-500 hover:bg-rose-600 rounded-full"
            title="Fall"
            label="Payout"
            value="19.55 USD"
            title_position="left"
          />
        </Suspense>
      </div>
    </div>
  );
};
