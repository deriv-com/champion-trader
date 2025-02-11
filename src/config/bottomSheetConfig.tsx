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
  },
  'how-to-trade': {
    body: (
      <div className="p-4">
    <h2 className="text-lg font-bold mb-4">Rise/Fall</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Rise</h3>
        <p className="text-gray-600 mb-2">If you select Rise, you win the payout if the exit spot is strictly higher than the entry spot.</p>
        <img src="/rise.png" alt="rise" />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Fall</h3>
        <p className="text-gray-600 mb-2">If you select Fall, you win the payout if the exit spot is strictly lower than the entry spot.</p>
        <img src="/fall.png" alt="fall" />

      </div>
      <div>
        <h3 className="font-semibold mb-2">Additional Information</h3>
        <p className="text-gray-600">If you select “Allow equals”, you win the payout if exit spot is higher than or equal to entry spot for Rise. Similarly, you win the payout if exit spot is lower than or equal to entry spot for Fall.</p>
      </div>
    </div>
  </div>
    )
  }
};
