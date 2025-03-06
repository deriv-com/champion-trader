import { Switch } from "@/components/ui/switch";

interface ToggleProps {
    label: string;
    value: boolean;
    onChange: () => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ label, value, onChange }) => {
    const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div className="flex items-center justify-between">
            <span id={id} className="text-sm text-gray-700">
                {label}
            </span>
            <Switch
                checked={value}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-primary"
                aria-labelledby={id}
            />
        </div>
    );
};

export default ToggleButton;
