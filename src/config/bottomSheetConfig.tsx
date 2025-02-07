import { ReactNode } from 'react';
import { DurationController } from '@/components/Duration';

export interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
  };
}

export const bottomSheetConfig: BottomSheetConfig = {
  'stake': {
    body: (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-center">
          <h2 className="text-lg font-semibold mx-auto">Stake</h2>
        </div>
      </div>
    )
  },
  'duration': {
    body: (
      <div className="flex flex-col h-full">
        <DurationController />
      </div>
    )
  },
  'how-to-trade': {
    body: (
      <div className="p-4">
    <h2 className="text-lg font-semibold mb-4">How to trade Rise/Fall</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">1. Select Duration</h3>
        <p className="text-gray-600">Choose how long you want to trade for - from 1 minute up to 15 minutes.</p>
      </div>
      <div>
        <h3 className="font-medium mb-2">2. Set your Stake</h3>
        <p className="text-gray-600">Enter the amount you want to trade with.</p>
      </div>
      <div>
        <h3 className="font-medium mb-2">3. Make your Prediction</h3>
        <p className="text-gray-600">Click "Rise" if you think the market will go up, or "Fall" if you think it will go down.</p>
      </div>
      <div>
        <h3 className="font-medium mb-2">4. Track your Trade</h3>
        <p className="text-gray-600">Watch the chart to see how the market moves during your selected duration.</p>
      </div>
    </div>
  </div>
    )
  }
};
