import { useEffect, useState } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isDesktop: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isDesktop: true,
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      setDeviceInfo({
        isMobile: isMobileDevice,
        isDesktop: !isMobileDevice,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return deviceInfo;
};
