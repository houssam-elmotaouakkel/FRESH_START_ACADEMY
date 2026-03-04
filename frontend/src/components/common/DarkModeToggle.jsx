import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import useThemeStore from '../../store/themeStore';

const themes = [
  { value: 'light', icon: FiSun, label: 'Clair' },
  { value: 'dark', icon: FiMoon, label: 'Sombre' },
  { value: 'system', icon: FiMonitor, label: 'Système' },
];

function DarkModeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-1 bg-secondary-100 dark:bg-gray-700 rounded-full p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-1.5 rounded-full transition-colors ${
            theme === value
              ? 'bg-white dark:bg-gray-600 text-primary-700 dark:text-primary-300 shadow-sm'
              : 'text-secondary-500 dark:text-gray-400 hover:text-secondary-700 dark:hover:text-gray-200'
          }`}
          aria-label={label}
          title={label}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

export default DarkModeToggle;
