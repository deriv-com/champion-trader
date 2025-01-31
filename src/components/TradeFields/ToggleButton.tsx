import { Switch } from "@/components/ui/switch";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between px-4">
    <span className="text-sm text-gray-700">{label}</span>
    <Switch
      checked={value}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-primary"
    />
  </div>
);

export default ToggleButton;
