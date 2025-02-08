import { useTradeStore } from '@/stores/tradeStore';
import { useClientStore } from '@/stores/clientStore';
import { useToastStore } from '@/stores/toastStore';
import { tradeTypeConfigs } from '@/config/tradeTypes';
import { buyContract } from '@/services/api/rest/buy/buyService';
import { parseDuration, formatDuration } from '@/utils/duration';
import { DurationRangesResponse } from '@/services/api/rest/duration/types';

export type TradeAction = 'buy_rise' | 'buy_fall' | 'buy_higher' | 'buy_lower' | 'buy_touch' | 'buy_no_touch' | 'buy_multiplier';

export const useTradeActions = () => {
  const { stake, duration, allowEquals, trade_type, instrument } = useTradeStore();
  const { balance, currency } = useClientStore();
  const { showToast } = useToastStore();

  // Create a map of action names to their contract types
  const actionContractMap = Object.values(tradeTypeConfigs).reduce((map, config) => {
    config.buttons.forEach(button => {
      map[button.actionName] = button.contractType;
    });
    return map;
  }, {} as Record<TradeAction, string>);

  const actions: Record<TradeAction, () => Promise<void>> = {
    buy_rise: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_rise,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_fall: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_fall,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_higher: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_higher,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_lower: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_lower,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_touch: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_touch,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_no_touch: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_no_touch,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    },
    buy_multiplier: async () => {
      try {
        const response = await buyContract({
          duration: (() => {
            const { value, type } = parseDuration(duration);
            return formatDuration(Number(value), type);
          })(),
          instrument: instrument,
          trade_type: actionContractMap.buy_multiplier,
          currency,
          payout: stake.toString(), // TODO: update after BE fix
          strike: stake.toString(),
        });
        showToast(`Successfully bought ${response.trade_type} contract`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to buy contract', 'error');
      }
    }
  };

  return actions;
};
