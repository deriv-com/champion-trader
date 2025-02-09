import { ReactNode } from 'react';
import { DurationController } from '@/components/Duration';
import { StakeController } from '@/components/Stake';

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
  }
};
