import { useTradeStore } from '@/stores/tradeStore';
import { useClientStore } from '@/stores/clientStore';
import { tradeTypeConfigs } from '@/config/tradeTypes';

export type TradeAction = 'buy_rise' | 'buy_fall' | 'buy_higher' | 'buy_lower' | 'buy_touch' | 'buy_no_touch' | 'buy_multiplier';

export const useTradeActions = () => {
  const { stake, duration, allowEquals, trade_type } = useTradeStore();
  const { balance } = useClientStore();

  // Create a map of action names to their contract types
  const actionContractMap = Object.values(tradeTypeConfigs).reduce((map, config) => {
    config.buttons.forEach(button => {
      map[button.actionName] = button.contractType;
    });
    return map;
  }, {} as Record<TradeAction, string>);

  const actions: Record<TradeAction, () => Promise<void>> = {
    buy_rise: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        allowEquals, 
        balance,
        contractType: actionContractMap.buy_rise,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_fall: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        allowEquals, 
        balance,
        contractType: actionContractMap.buy_fall,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_higher: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        balance,
        contractType: actionContractMap.buy_higher,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_lower: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        balance,
        contractType: actionContractMap.buy_lower,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_touch: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        balance,
        contractType: actionContractMap.buy_touch,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_no_touch: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        balance,
        contractType: actionContractMap.buy_no_touch,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    },
    buy_multiplier: async () => {
      console.log('Buying with:', { 
        stake, 
        duration, 
        balance,
        contractType: actionContractMap.buy_multiplier,
        trade_type
      });
      // TODO: Implement actual API call with contractType
    }
  };

  return actions;
};
