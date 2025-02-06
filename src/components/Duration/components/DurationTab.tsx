import React from 'react';
import { Chip } from '@/components/ui/chip';

interface DurationTabProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const DurationTab: React.FC<DurationTabProps> = ({ 
  label, 
  isSelected, 
  onSelect 
}) => {
  return (
    <Chip isSelected={isSelected} onClick={onSelect}>
      {label}
    </Chip>
  );
};
