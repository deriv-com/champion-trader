import { render } from '@testing-library/react';
import { NotificationProvider } from '../NotificationProvider';
import * as notificationStore from '@/stores/notificationStore';

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
  beforeEach(() => {
    // Setup default mock implementation
    jest.spyOn(notificationStore, 'useNotificationStore').mockImplementation((selector: any) =>
      selector({
        config: {
          position: 'top-right',
          duration: 4000,
          closeButton: true,
          className: 'rounded-lg',
        },
      })
    );
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
    expect(toaster).toHaveAttribute('data-rich-colors', '');
    expect(toaster).toHaveAttribute('data-expand', '');
  });

  it('renders Toaster with custom config from store', () => {
    jest.spyOn(notificationStore, 'useNotificationStore').mockImplementation((selector: any) =>
      selector({
        config: {
          position: 'bottom-left',
          duration: 5000,
          closeButton: false,
          className: 'custom-class',
        },
      })
    );

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
});
