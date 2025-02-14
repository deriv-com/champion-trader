import { ReactNode } from 'react';
import { MarketSelectorList } from '@/components/MarketSelector/MarketSelectorList';

export interface LeftSidebarConfig {
  [key: string]: {
    body: ReactNode;
    title?: string;
  };
}

export const leftSidebarConfig: LeftSidebarConfig = {
  'market-list': {
    body: <MarketSelectorList />,
  },
  // Add more sidebar components here as needed
};
