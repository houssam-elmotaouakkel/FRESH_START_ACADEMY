import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Safe storage wrapper — falls back to in-memory when localStorage is blocked (e.g. Brave Shields)
const safeStorage = () => {
  try {
    // Test if localStorage is accessible
    const testKey = '__zs_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return createJSONStorage(() => localStorage);
  } catch {
    // Fallback: in-memory storage (theme won't persist across reloads but app won't crash)
    const mem = new Map();
    return createJSONStorage(() => ({
      getItem: (k) => mem.get(k) ?? null,
      setItem: (k, v) => mem.set(k, v),
      removeItem: (k) => mem.delete(k),
    }));
  }
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' | 'dark' | 'system'

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const current = get().theme;
        const next = current === 'light' ? 'dark' : 'light';
        set({ theme: next });
        applyTheme(next);
      },

      initTheme: () => {
        applyTheme(get().theme);
      },
    }),
    {
      name: 'theme-storage',
      storage: safeStorage(),
    }
  )
);

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useThemeStore.getState();
    if (theme === 'system') {
      applyTheme('system');
    }
  });
}

export default useThemeStore;
