import { create } from 'zustand';
import { Toast } from '@/components/ui/toast';
import { type FC } from 'react';
import { type JSX } from 'react/jsx-runtime';

interface ToastOptions {
  content: React.ReactNode;
  variant?: 'success' | 'error' | 'black';
  duration?: number;
}

interface ToastState {
  options: ToastOptions | null;
  show: boolean;
  toast: (options: ToastOptions) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  options: null,
  show: false,
  toast: (options: ToastOptions) => 
    set({ options, show: true }),
  hideToast: () => set({ show: false })
}));

// Toast Provider component to be used in App.tsx
export const ToastProvider: FC = (): JSX.Element | null => {
  const { options, show, hideToast } = useToastStore();

  if (!show || !options) return null;

  return <Toast content={options.content} variant={options.variant} duration={options.duration} onClose={hideToast} />;
};
