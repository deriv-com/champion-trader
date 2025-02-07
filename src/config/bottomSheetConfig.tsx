import { ReactNode } from 'react';
import { DurationController } from '@/components/Duration';
import { MarketSelectorList } from '@/components/MarketSelector/MarketSelectorList';

export interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
    height?: string;
  };
}

export const bottomSheetConfig: BottomSheetConfig = {
  'market-info': {
    body: <MarketSelectorList />,
  },
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
  }
};
