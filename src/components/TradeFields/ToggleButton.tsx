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
      <span id={id} className="text-sm text-textPrimaryColor">
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
        <div className="w-11 h-6 bg-backgroundSoft peer-checked:bg-primaryColor rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-textPrimaryColor after:rounded-full after:h-5 after:w-5 after:transition-all border border-gray-400 dark:border-gray-600"></div>
      </label>
    </div>
  );
};

export default ToggleButton;
