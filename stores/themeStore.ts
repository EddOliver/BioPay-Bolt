import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    tabBar: string;
    tabBarBorder: string;
  };
}

const lightColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  primary: '#3B82F6',
  secondary: '#6B7280',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E5E7EB',
};

const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#60A5FA',
  secondary: '#94A3B8',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  card: '#1E293B',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  tabBar: '#1E293B',
  tabBarBorder: '#334155',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      get colors() {
        return get().isDarkMode ? darkColors : lightColors;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
          }
        },
      })),
    }
  )
);