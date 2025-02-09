import { create } from 'zustand';
import { Toast } from '@/components/ui/toast';
import { type FC } from 'react';
import { type JSX } from 'react/jsx-runtime';

interface ToastState {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  showToast: (message: string, type: 'success' | 'error') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  type: 'success',
  show: false,
  showToast: (message: string, type: 'success' | 'error') => 
    set({ message, type, show: true }),
  hideToast: () => set({ show: false })
}));

// Toast Provider component to be used in App.tsx
export const ToastProvider: FC = (): JSX.Element | null => {
  const { message, type, show, hideToast } = useToastStore();

  if (!show) return null;

  return <Toast message={message} type={type} onClose={hideToast} />;
};
