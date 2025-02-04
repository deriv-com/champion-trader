import { ReactNode } from 'react';

export interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
  };
}

export const bottomSheetConfig: BottomSheetConfig = {
  'rise-contract': {
    body: (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-center">
          <h2 className="text-lg font-semibold mx-auto">Rise Contract</h2>
        </div>
      </div>
    )
  }
};
