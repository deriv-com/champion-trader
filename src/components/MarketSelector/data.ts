export interface Tab {
  id: string;
  label: string;
}

export const tabs: Tab[] = [
  { id: 'favourites', label: 'Favourites' },
  { id: 'all', label: 'All' },
  { id: 'derived', label: 'Derived' },
  { id: 'forex', label: 'Forex' },
  { id: 'stocks', label: 'Stocks & indices' },
  { id: 'commodities', label: 'Commodities' }
];
