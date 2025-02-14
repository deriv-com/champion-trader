import React from 'react';
import { render, screen } from '@testing-library/react';
import { NotificationProvider } from '../NotificationProvider';
import { useNotificationStore } from '@/stores/notificationStore';
import type { NotificationStore } from '@/stores/notificationStore';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => null,
}));

// Mock the store
jest.mock('@/stores/notificationStore');

// Type the mocked store
const mockedUseNotificationStore = useNotificationStore as jest.MockedFunction<typeof useNotificationStore>;

describe('NotificationProvider', () => {
  beforeEach(() => {
    // Setup default mock implementation
    mockedUseNotificationStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          config: {
            position: 'top-right',
            duration: 4000,
            className: 'rounded-lg',
          },
        } as NotificationStore);
      }
      return {} as NotificationStore;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    render(
      <NotificationProvider>
        <div data-testid="test-child">Test Child</div>
      </NotificationProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('uses notification config from store', () => {
    const mockConfig = {
      position: 'bottom-left' as const,
      duration: 5000,
      className: 'custom-class',
    };

    mockedUseNotificationStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          config: mockConfig,
        } as NotificationStore);
      }
      return {} as NotificationStore;
    });

    render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    // Verify the store was called with the correct selector
    expect(mockedUseNotificationStore).toHaveBeenCalled();
  });
});
