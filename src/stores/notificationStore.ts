import { create } from "zustand";
import toast, { ToastPosition } from "react-hot-toast";

export type { ToastPosition };

export interface NotificationConfig {
    position?: ToastPosition;
    duration?: number;
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
    position: "top-right",
    duration: 4000,
    className: "rounded-lg",
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    config: defaultConfig,
    setConfig: (newConfig) => {
        const currentConfig = get().config;
        set({ config: { ...currentConfig, ...newConfig } });
    },

    success: (message: string, description?: string) => {
        const { config } = get();
        toast.success(description ? `${message}\n${description}` : message, {
            ...config,
            className: `${config.className} bg-green-50`,
        });
    },

    error: (message: string, description?: string) => {
        const { config } = get();
        toast.error(description ? `${message}\n${description}` : message, {
            ...config,
            className: `${config.className} bg-red-50`,
        });
    },

    info: (message: string, description?: string) => {
        const { config } = get();
        toast(description ? `${message}\n${description}` : message, {
            ...config,
            className: `${config.className} bg-blue-50`,
            icon: "🔵",
        });
    },

    warning: (message: string, description?: string) => {
        const { config } = get();
        toast(description ? `${message}\n${description}` : message, {
            ...config,
            className: `${config.className} bg-yellow-50`,
            icon: "⚠️",
        });
    },

    promise: <T>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error: string }
    ): Promise<T> => {
        const { config } = get();
        toast.promise(promise, messages, config);
        return promise;
    },
}));
