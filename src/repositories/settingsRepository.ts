import * as SecureStore from 'expo-secure-store';
import { Settings } from '../types/models';
import { DEFAULT_REMINDER_TIME } from '../utils/constants';

const KEY = 'crossday-settings';

export const fetchSettings = async (): Promise<Settings> => {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) {
    return {
      reminderTimeLocal: DEFAULT_REMINDER_TIME,
      theme: 'system',
      allowLateMark: false,
      firstRunComplete: false,
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      reminderTimeLocal: parsed.reminderTimeLocal ?? DEFAULT_REMINDER_TIME,
      theme: parsed.theme ?? 'system',
      allowLateMark: Boolean(parsed.allowLateMark),
      firstRunComplete: Boolean(parsed.firstRunComplete),
    };
  } catch (error) {
    return {
      reminderTimeLocal: DEFAULT_REMINDER_TIME,
      theme: 'system',
      allowLateMark: false,
      firstRunComplete: false,
    };
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  await SecureStore.setItemAsync(KEY, JSON.stringify(settings));
};

export const clearSettings = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(KEY);
};
