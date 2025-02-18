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
      <span id={id} className="text-sm text-gray-700 dark:text-white">
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
        <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
      </label>
    </div>
  );
};

export default ToggleButton;
