import { act } from '@testing-library/react';
import { useNotificationStore } from '../notificationStore';
import { toast } from 'sonner';

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: Object.assign(
    jest.fn(),
    {
      success: jest.fn(),
      error: jest.fn(),
      promise: jest.fn(),
    }
  ),
}));

describe('notificationStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to default state
    act(() => {
      useNotificationStore.getState().setConfig({
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });
  });

  describe('config management', () => {
    it('should initialize with default config', () => {
      const config = useNotificationStore.getState().config;
      expect(config).toEqual({
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });

    it('should update config partially', () => {
      act(() => {
        useNotificationStore.getState().setConfig({
          position: 'bottom-right',
          duration: 5000,
        });
      });

      const config = useNotificationStore.getState().config;
      expect(config).toEqual({
        position: 'bottom-right',
        duration: 5000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });
  });

  describe('notification methods', () => {
    it('should show success notification', () => {
      useNotificationStore.getState().success('Success', 'Operation completed');
      expect(toast.success).toHaveBeenCalledWith('Success\nOperation completed', {
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });

    it('should show error notification', () => {
      useNotificationStore.getState().error('Error', 'Something went wrong');
      expect(toast.error).toHaveBeenCalledWith('Error\nSomething went wrong', {
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });

    it('should show info notification with blue background', () => {
      useNotificationStore.getState().info('Info', 'Here is some information');
      expect(toast).toHaveBeenCalledWith('Info\nHere is some information', {
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg bg-blue-50',
      });
    });

    it('should show warning notification with yellow background', () => {
      useNotificationStore.getState().warning('Warning', 'Please be careful');
      expect(toast).toHaveBeenCalledWith('Warning\nPlease be careful', {
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg bg-yellow-50',
      });
    });

    it('should handle promise notifications', async () => {
      const mockPromise = Promise.resolve('success');
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      const result = useNotificationStore.getState().promise(mockPromise, messages);

      expect(toast.promise).toHaveBeenCalledWith(mockPromise, {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
        ...useNotificationStore.getState().config,
      });

      await expect(result).resolves.toBe('success');
    });

    it('should handle single message notifications', () => {
      useNotificationStore.getState().success('Success');
      expect(toast.success).toHaveBeenCalledWith('Success', {
        position: 'top-right',
        duration: 4000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });

    it('should handle notifications with custom config', () => {
      act(() => {
        useNotificationStore.getState().setConfig({
          position: 'bottom-left',
          duration: 5000,
        });
      });

      useNotificationStore.getState().success('Success', 'Custom config');
      expect(toast.success).toHaveBeenCalledWith('Success\nCustom config', {
        position: 'bottom-left',
        duration: 5000,
        closeButton: true,
        className: 'rounded-lg',
      });
    });

    it('should handle promise rejection', async () => {
      const mockError = new Error('Test error');
      const mockPromise = Promise.reject(mockError);
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      const promise = useNotificationStore.getState().promise(mockPromise, messages);

      expect(toast.promise).toHaveBeenCalledWith(mockPromise, {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
        ...useNotificationStore.getState().config,
      });

      await expect(promise).rejects.toEqual(mockError);
    });
  });
});
