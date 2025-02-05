import { ReactNode } from 'react';
import Numpad from "@/components/Numpad/Numpad";

export interface BottomSheetConfig {
  [key: string]: {
    body: ReactNode;
  };
}

import StakeBody from "@/components/BottomSheet/StakeBody";
import DurationBody from "@/components/BottomSheet/DurationBody";

export const bottomSheetConfig: BottomSheetConfig = {
  'stake': {
    body: <StakeBody />,
  },
  'duration': {
    body: <DurationBody />,
  },
};
