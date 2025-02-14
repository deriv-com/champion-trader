import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  content: React.ReactNode;
  variant?: 'success' | 'error' | 'black';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ content, variant = 'success', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-[999]',
        'px-6 py-3 rounded-lg shadow-lg',
        'animate-in fade-in slide-in-from-top-4',
        {
          'bg-emerald-600 text-white': variant === 'success',
          'bg-red-600 text-white': variant === 'error',
          'bg-gray-900 text-white': variant === 'black'
        }
      )}
      role="alert"
    >
      {typeof content === 'string' ? (
        <div className="flex items-center gap-2">
          {variant === 'success' && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
          {variant === 'error' && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <span className="text-sm font-medium">{content}</span>
        </div>
      ) : (
        content
      )}
    </div>
  );
};
