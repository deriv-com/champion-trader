import create from "zustand";

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => {
  const storedTheme = localStorage.getItem("isDarkMode") === "true";

  if (storedTheme) {
    document.documentElement.classList.add("dark");
  }

  return {
    isDarkMode: storedTheme,
    toggleTheme: () => set((state) => {
      const newMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", String(newMode));
      document.documentElement.classList.toggle("dark", newMode);
      return { isDarkMode: newMode };
    }),
  };
});
