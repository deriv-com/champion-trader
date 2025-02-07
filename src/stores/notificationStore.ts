import { create } from 'zustand';
import { toast } from 'sonner';

export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

export interface NotificationConfig {
  position?: ToastPosition;
  duration?: number;
  closeButton?: boolean;
  className?: string;
}

export interface NotificationStore {
  config: NotificationConfig;
  setConfig: (config: Partial<NotificationConfig>) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => Promise<T>;
}

const defaultConfig: NotificationConfig = {
  position: 'top-right',
  duration: 4000,
  closeButton: true,
  className: 'rounded-lg',
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  config: defaultConfig,
  setConfig: (newConfig) =>
    set((state) => ({ config: { ...state.config, ...newConfig } })),

  success: (message, description) => {
    const { config } = get();
    toast.success(description ? `${message}\n${description}` : message, {
      ...config
    });
  },

  error: (message, description) => {
    const { config } = get();
    toast.error(description ? `${message}\n${description}` : message, {
      ...config
    });
  },

  info: (message, description) => {
    const { config } = get();
    toast(description ? `${message}\n${description}` : message, {
      ...config,
      className: `${config.className} bg-blue-50`,
    });
  },

  warning: (message, description) => {
    const { config } = get();
    toast(description ? `${message}\n${description}` : message, {
      ...config,
      className: `${config.className} bg-yellow-50`,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ): Promise<T> => {
    const { config } = get();
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...config
    });
    return promise;
  },
}));
