import { ReactNode } from 'react';
import { DurationController } from '@/components/Duration';
import { MarketSelectorList } from '@/components/MarketSelector/MarketSelectorList';
import { StakeController } from '@/components/Stake';
import { guideConfig } from './guideConfig';

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
    body: <StakeController />
  },
  'duration': {
    body: <DurationController />
  },
  'how-to-trade': {
    body: (
      <div>
        {guideConfig["rise-fall"].header}
        {guideConfig["rise-fall"].body}
      </div>
    )
  }
};
