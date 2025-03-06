import { useEffect, useState } from "react";

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
            const width = window.innerWidth;

            setDeviceInfo({
                isMobile: width <= 600,
                isDesktop: width > 1280,
            });
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);

        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    return deviceInfo;
};
