import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { darkTheme, lightTheme, ThemeColours } from '../theme/colors';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectSettings } from '../store/selectors';

interface ThemeContextValue {
  colours: ThemeColours;
  mode: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useAppSelector(selectSettings);
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const mode: 'light' | 'dark' = theme === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : theme;

  const value = useMemo<ThemeContextValue>(() => {
    const colours = mode === 'dark' ? darkTheme : lightTheme;
    return { colours, mode };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
