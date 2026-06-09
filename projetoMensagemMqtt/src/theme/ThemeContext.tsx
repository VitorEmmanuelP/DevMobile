import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { ThemeColors, ThemeMode, themes } from './theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: themes[mode],
      toggleTheme: () => setMode((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme precisa estar dentro de um ThemeProvider.');
  }
  return context;
}
