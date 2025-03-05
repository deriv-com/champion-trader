import { useThemeStore } from "@/stores/themeStore";

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: () => void;
}

const ToggleButton: React.FC<ToggleProps> = ({ label }) => {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  return (
    <div className="flex items-center justify-between">
      <span id={id} className="text-sm text-primary">
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
        <div className="w-11 h-6 bg-background-soft peer-checked:bg-primary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-text-primary after:rounded-full after:h-5 after:w-5 after:transition-all border border-gray-400 border-secondary"></div>
      </label>
    </div>
  );
};

export default ToggleButton;
