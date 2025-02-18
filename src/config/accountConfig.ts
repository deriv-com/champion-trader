export interface AccountInfo {
  id: string;
  displayName: string;
  currency: string;
  accountNumber: string;
}

export const accountData: AccountInfo[] = [
  {
    id: 'usd',
    displayName: 'US Dollar',
    currency: 'USD',
    accountNumber: 'CR3644252',
  },
  {
    id: 'btc',
    displayName: 'Bitcoin',
    currency: 'BTC',
    accountNumber: 'CR4457254',
  },
  {
    id: 'eth',
    displayName: 'Ethereum',
    currency: 'ETH',
    accountNumber: 'CR3997677',
  },
  {
    id: 'usdc',
    displayName: 'USD Coin',
    currency: 'USDC',
    accountNumber: 'CR5084140',
  },
  {
    id: 'tusdt',
    displayName: 'Tether TRC20',
    currency: 'tUSDT',
    accountNumber: 'CR6164701',
  }
];
