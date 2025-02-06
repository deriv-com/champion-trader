import React from 'react';
import { DurationTab } from './DurationTab';

interface DurationTabListProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const DURATION_TYPES = [
  { label: 'Ticks', value: 'tick' },
  { label: 'Seconds', value: 'second' },
  { label: 'Minutes', value: 'minute' },
  { label: 'Hours', value: 'hour' },
  { label: 'End Time', value: 'day' }
];

export const DurationTabList: React.FC<DurationTabListProps> = ({
  selectedType,
  onTypeSelect
}) => {
  return (
    <div 
      className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}>
      <div className="flex gap-4 min-w-min px-4 py-2">
        {DURATION_TYPES.map(({ label, value }) => (
          <div key={value} className="shrink-0">
            <DurationTab
              label={label}
              isSelected={selectedType === value}
              onSelect={() => onTypeSelect(value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
