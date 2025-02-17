export interface AccountInfo {
  id: string;
  displayName: string;
  currency: string;
  accountNumber: string;
  symbol: string;
}

export const accountData: AccountInfo[] = [
  {
    id: 'usd',
    displayName: 'US Dollar',
    currency: 'USD',
    accountNumber: 'CR3644252',
    symbol: '$'
  },
  {
    id: 'btc',
    displayName: 'Bitcoin',
    currency: 'BTC',
    accountNumber: 'CR4457254',
    symbol: '₿'
  },
  {
    id: 'eth',
    displayName: 'Ethereum',
    currency: 'ETH',
    accountNumber: 'CR3997677',
    symbol: 'Ξ'
  },
  {
    id: 'usdc',
    displayName: 'USD Coin',
    currency: 'USDC',
    accountNumber: 'CR5084140',
    symbol: '$'
  },
  {
    id: 'usdt',
    displayName: 'Tether TRC20',
    currency: 'USDT',
    accountNumber: 'CR6164701',
    symbol: '₮'
  }
];
