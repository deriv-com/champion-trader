import { useNotificationStore } from '../notificationStore';
import toast from 'react-hot-toast';

// Create interface for mocked toast functions
interface MockToast extends jest.Mock {
  success: jest.Mock;
  error: jest.Mock;
  promise: jest.Mock;
}

// Mock react-hot-toast
jest.mock('react-hot-toast', () => {
  const mockToast: MockToast = Object.assign(
    jest.fn(),
    {
      success: jest.fn(),
      error: jest.fn(),
      promise: jest.fn(),
    }
  );
  return {
    __esModule: true,
    default: mockToast,
  };
});

describe('notificationStore', () => {
  const mockedToast = toast as unknown as MockToast;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('config', () => {
    it('should have default config', () => {
      const store = useNotificationStore.getState();
      expect(store.config).toEqual({
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg',
      });
    });

    it('should update config', () => {
      const store = useNotificationStore.getState();
      store.setConfig({ position: 'bottom-left', duration: 5000 });
      expect(store.config).toEqual({
        position: 'bottom-left',
        duration: 5000,
        className: 'rounded-lg',
      });
    });
  });

  describe('notifications', () => {
    it('should show success notification', () => {
      const store = useNotificationStore.getState();
      store.success('Success', 'Operation completed');
      
      expect(mockedToast.success).toHaveBeenCalledWith('Success\nOperation completed', {
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg bg-green-50',
      });
    });

    it('should show error notification', () => {
      const store = useNotificationStore.getState();
      store.error('Error', 'Something went wrong');
      
      expect(mockedToast.error).toHaveBeenCalledWith('Error\nSomething went wrong', {
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg bg-red-50',
      });
    });

    it('should show info notification', () => {
      const store = useNotificationStore.getState();
      store.info('Info', 'Some information');
      
      expect(mockedToast).toHaveBeenCalledWith('Info\nSome information', {
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg bg-blue-50',
        icon: '🔵',
      });
    });

    it('should show warning notification', () => {
      const store = useNotificationStore.getState();
      store.warning('Warning', 'Be careful');
      
      expect(mockedToast).toHaveBeenCalledWith('Warning\nBe careful', {
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg bg-yellow-50',
        icon: '⚠️',
      });
    });

    it('should handle promise notification', async () => {
      const store = useNotificationStore.getState();
      const promise = Promise.resolve('result');
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      store.promise(promise, messages);
      
      expect(mockedToast.promise).toHaveBeenCalledWith(
        promise,
        {
          loading: messages.loading,
          success: messages.success,
          error: messages.error,
        },
        {
          position: 'top-right',
          duration: 4000,
          className: 'rounded-lg',
        }
      );
    });

    it('should show notification without description', () => {
      const store = useNotificationStore.getState();
      store.success('Success');
      
      expect(mockedToast.success).toHaveBeenCalledWith('Success', {
        position: 'top-right',
        duration: 4000,
        className: 'rounded-lg bg-green-50',
      });
    });
  });
});
