import React from 'react';
import { Toaster } from 'sonner';
import { useNotificationStore } from '@/stores/notificationStore';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const config = useNotificationStore((state) => state.config);

  return (
    <>
      <Toaster
        position={config.position}
        duration={config.duration}
        closeButton={config.closeButton}
        className={config.className}
        theme="light"
        richColors
        expand
      />
      {children}
    </>
  );
};
