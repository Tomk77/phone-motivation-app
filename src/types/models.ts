export type ThemePreference = 'light' | 'dark' | 'system';

export interface Goal {
  id: string;
  name: string;
  createdAt: string;
}

export interface Entry {
  id: string;
  goalId: string;
  dateISO: string; // yyyy-mm-dd
  completed: boolean;
  note?: string | null;
  updatedAt: string;
}

export interface Settings {
  reminderTimeLocal: string; // HH:mm
  theme: ThemePreference;
  allowLateMark: boolean;
  firstRunComplete: boolean;
}

export interface AppStateStatus {
  isInitialised: boolean;
  isLoading: boolean;
  error?: string | null;
}
