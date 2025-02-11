import { ReactNode } from 'react';
import { DurationController } from '@/components/Duration';
import { StakeController } from '@/components/Stake';
import { guideConfig } from './guideConfig';

export interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
  };
}

export const bottomSheetConfig: BottomSheetConfig = {
  'stake': {
    body: <StakeController />
  },
  'duration': {
    body: <DurationController />
  },
  'how-to-trade': {
    body: guideConfig["rise-fall"].body
  }
};
