import React from 'react';
import { useBottomSheetStore } from '@/stores/bottomSheetStore';

interface MarketSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({ isOpen, onClose }) => {
  const { setBottomSheet } = useBottomSheetStore();

  React.useEffect(() => {
    if (isOpen) {
      setBottomSheet(true, 'market-info', undefined, onClose);
    }
  }, [isOpen, onClose, setBottomSheet]);

  return null;
};
