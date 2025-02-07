import { render } from '@testing-library/react';
import { NotificationProvider } from '../NotificationProvider';
import * as notificationStoreModule from '@/stores/notificationStore';
import type { NotificationConfig, NotificationStore } from '@/stores/notificationStore';

// Mock the Toaster component from sonner
jest.mock('sonner', () => ({
  Toaster: jest.fn(({ position, duration, closeButton, className, theme, richColors, expand }) => (
    <div data-testid="mock-toaster" data-position={position} data-duration={duration} data-close-button={closeButton} data-class-name={className} data-theme={theme} data-rich-colors={richColors} data-expand={expand}>
      Toaster
    </div>
  )),
}));

// Mock the notification store
jest.mock('@/stores/notificationStore');

describe('NotificationProvider', () => {
  const createMockStore = (config: NotificationConfig): NotificationStore => ({
    config,
    setConfig: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    promise: jest.fn(),
  });

  const defaultConfig: NotificationConfig = {
    position: 'top-right',
    duration: 4000,
    closeButton: true,
    className: 'rounded-lg',
  };

  const mockStore = createMockStore(defaultConfig);

  beforeEach(() => {
    // Setup default mock implementation
    jest.spyOn(notificationStoreModule, 'useNotificationStore').mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockStore);
      }
      return mockStore;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children', () => {
    const { getByText } = render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('renders Toaster with correct default props', () => {
    const { getByTestId } = render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    const toaster = getByTestId('mock-toaster');
    expect(toaster).toHaveAttribute('data-position', 'top-right');
    expect(toaster).toHaveAttribute('data-duration', '4000');
    expect(toaster).toHaveAttribute('data-close-button', 'true');
    expect(toaster).toHaveAttribute('data-class-name', 'rounded-lg');
    expect(toaster).toHaveAttribute('data-theme', 'light');
    expect(toaster).toHaveAttribute('data-rich-colors', 'true');
    expect(toaster).toHaveAttribute('data-expand', 'true');
  });

  it('renders Toaster with custom config from store', () => {
    const customConfig: NotificationConfig = {
      position: 'bottom-left',
      duration: 5000,
      closeButton: false,
      className: 'custom-class',
    };

    const customStore = createMockStore(customConfig);

    jest.spyOn(notificationStoreModule, 'useNotificationStore').mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(customStore);
      }
      return customStore;
    });

    const { getByTestId } = render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    const toaster = getByTestId('mock-toaster');
    expect(toaster).toHaveAttribute('data-position', 'bottom-left');
    expect(toaster).toHaveAttribute('data-duration', '5000');
    expect(toaster).toHaveAttribute('data-close-button', 'false');
    expect(toaster).toHaveAttribute('data-class-name', 'custom-class');
  });

  it('updates Toaster when config changes', () => {
    const { getByTestId, rerender } = render(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    // Initial render with default config
    let toaster = getByTestId('mock-toaster');
    expect(toaster).toHaveAttribute('data-position', 'top-right');

    // Update config
    const updatedConfig: NotificationConfig = {
      ...defaultConfig,
      position: 'bottom-right',
    };

    const updatedStore = createMockStore(updatedConfig);

    jest.spyOn(notificationStoreModule, 'useNotificationStore').mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(updatedStore);
      }
      return updatedStore;
    });

    // Re-render with new config
    rerender(
      <NotificationProvider>
        <div>Test Child</div>
      </NotificationProvider>
    );

    toaster = getByTestId('mock-toaster');
    expect(toaster).toHaveAttribute('data-position', 'bottom-right');
  });
});
