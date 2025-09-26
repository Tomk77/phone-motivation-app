export const colours = {
  primary: '#2563EB',
  secondary: '#10B981',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0B0F14',
  textLight: '#0B0F14',
  textDark: '#E6E6E6',
  surfaceLight: '#F5F7FB',
  surfaceDark: '#121923',
  borderLight: '#E2E8F0',
  borderDark: '#1F2933',
  danger: '#EF4444',
};

export const lightTheme = {
  background: colours.backgroundLight,
  surface: colours.surfaceLight,
  text: colours.textLight,
  subtleText: '#475569',
  border: colours.borderLight,
  primary: colours.primary,
  secondary: colours.secondary,
  danger: colours.danger,
};

export const darkTheme = {
  background: colours.backgroundDark,
  surface: colours.surfaceDark,
  text: colours.textDark,
  subtleText: '#94A3B8',
  border: colours.borderDark,
  primary: colours.primary,
  secondary: colours.secondary,
  danger: colours.danger,
};

export type ThemeColours = typeof lightTheme;
