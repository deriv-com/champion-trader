import { useSSEStore } from '@/stores/sseStore';
import { MarketSSEService } from '@/services/api/sse/market/service';
import { ContractSSEService } from '@/services/api/sse/contract/service';

jest.mock('@/services/api/sse/market/service');
jest.mock('@/services/api/sse/contract/service');

describe('SSE Store', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useSSEStore.setState({
      marketService: null,
      contractService: null,
      instrumentPrices: {},
      contractPrices: {},
      isMarketConnected: false,
      isContractConnected: false,
      marketError: null,
      contractError: null,
    });
    jest.clearAllMocks();
  });

  describe('Market SSE Service', () => {
    let fakeMarketService: any;
    let onMock: jest.Mock;
    let onErrorMock: jest.Mock;
    let connectMock: jest.Mock;
    let disconnectMock: jest.Mock;
    let subscribeToPriceMock: jest.Mock;
    let unsubscribeFromPriceMock: jest.Mock;

    beforeEach(() => {
      onMock = jest.fn().mockImplementation((event: string, handler: Function) => {
        // Store the handler in the fake service instance for simulation
        fakeMarketService[event] = handler;
      });
      onErrorMock = jest.fn().mockImplementation((handler: Function) => {
        fakeMarketService['error'] = handler;
      });
      connectMock = jest.fn();
      disconnectMock = jest.fn();
      subscribeToPriceMock = jest.fn();
      unsubscribeFromPriceMock = jest.fn();

      fakeMarketService = {
        disconnect: disconnectMock,
        connect: connectMock,
        on: onMock,
        onError: onErrorMock,
        subscribeToPrice: subscribeToPriceMock,
        unsubscribeFromPrice: unsubscribeFromPriceMock,
      };

      // When a new MarketSSEService is instantiated, return our fake service
      (MarketSSEService as jest.Mock).mockImplementation(() => fakeMarketService);
    });

    it('initializes market service and updates connection state on open event', () => {
      const store = useSSEStore.getState();
      store.initializeMarketService();

      // No previous service to disconnect
      expect(disconnectMock).not.toHaveBeenCalled();

      // Simulate the "open" event
      fakeMarketService['open']();

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.isMarketConnected).toBe(true);
      expect(updatedStore.marketError).toBeNull();
      expect(updatedStore.instrumentPrices).toEqual({});
    });

    it('updates instrumentPrices when receiving instrument_price event', () => {
      const store = useSSEStore.getState();
      store.initializeMarketService();

      const priceData = { instrument_id: 'inst1', price: 123 };
      // Simulate the "instrument_price" event
      fakeMarketService['instrument_price'](priceData);

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.instrumentPrices['inst1']).toEqual(priceData);
    });

    it('calls subscribeToPrice and unsubscribeFromPrice on corresponding actions', () => {
      const store = useSSEStore.getState();
      store.initializeMarketService();

      store.subscribeToInstrumentPrice('inst1');
      expect(subscribeToPriceMock).toHaveBeenCalledWith('inst1');

      store.unsubscribeFromInstrumentPrice('inst1');
      expect(unsubscribeFromPriceMock).toHaveBeenCalledWith('inst1');
    });

    it('updates marketError and resets connection state on error event', () => {
      const store = useSSEStore.getState();
      store.initializeMarketService();

      const testError = new Event('error');
      // Simulate an error event
      fakeMarketService['error'](testError);

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.marketError).toEqual({ error: 'SSE connection error' });
      expect(updatedStore.isMarketConnected).toBe(false);
    });
  });

  describe('Contract SSE Service', () => {
    let fakeContractService: any;
    let onMock: jest.Mock;
    let onErrorMock: jest.Mock;
    let connectMock: jest.Mock;
    let disconnectMock: jest.Mock;
    let requestPriceMock: jest.Mock;
    let cancelPriceMock: jest.Mock;

    beforeEach(() => {
      onMock = jest.fn().mockImplementation((event: string, handler: Function) => {
        fakeContractService[event] = handler;
      });
      onErrorMock = jest.fn().mockImplementation((handler: Function) => {
        fakeContractService['error'] = handler;
      });
      connectMock = jest.fn();
      disconnectMock = jest.fn();
      requestPriceMock = jest.fn();
      cancelPriceMock = jest.fn();

      fakeContractService = {
        disconnect: disconnectMock,
        connect: connectMock,
        on: onMock,
        onError: onErrorMock,
        requestPrice: requestPriceMock,
        cancelPrice: cancelPriceMock,
      };

      (ContractSSEService as jest.Mock).mockImplementation((_authToken: string) => {
        return fakeContractService;
      });
    });

    it('initializes contract service and updates connection state on open event', () => {
      const store = useSSEStore.getState();
      store.initializeContractService('dummy-token');

      expect(disconnectMock).not.toHaveBeenCalled();

      // Simulate the "open" event
      fakeContractService['open']();

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.isContractConnected).toBe(true);
      expect(updatedStore.contractError).toBeNull();
      expect(updatedStore.contractPrices).toEqual({});
    });

    it('updates contractPrices when receiving contract_price event', () => {
      const store = useSSEStore.getState();
      store.initializeContractService('dummy-token');

      const priceData = {
        date_start: 100,
        date_expiry: 200,
        instrument: 'instrA',
        trade_type: 'buy',
        currency: 'USD',
        payout: 50,
        strike: 10,
      };

      // Simulate the "contract_price" event
      fakeContractService['contract_price'](priceData);

      const key = JSON.stringify({
        duration: (priceData.date_expiry - priceData.date_start) + '',
        instrument: priceData.instrument,
        trade_type: priceData.trade_type,
        currency: priceData.currency,
        payout: priceData.payout,
        strike: priceData.strike,
      });

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.contractPrices[key]).toEqual(priceData);
    });

    it('calls requestPrice and cancelPrice on corresponding actions', () => {
      const store = useSSEStore.getState();
      store.initializeContractService('dummy-token');

      const params = { sample: 'data' };

      store.requestContractPrice(params as any);
      expect(requestPriceMock).toHaveBeenCalledWith(params);

      store.cancelContractPrice(params as any);
      expect(cancelPriceMock).toHaveBeenCalledWith(params);
    });

    it('updates contractError and resets connection state on error event', () => {
      const store = useSSEStore.getState();
      store.initializeContractService('dummy-token');

      const testError = new Event('error');
      // Simulate an error event
      fakeContractService['error'](testError);

      const updatedStore = useSSEStore.getState();
      expect(updatedStore.contractError).toEqual({ error: 'SSE connection error' });
      expect(updatedStore.isContractConnected).toBe(false);
    });
  });
});
