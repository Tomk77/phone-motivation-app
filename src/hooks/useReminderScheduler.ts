import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppSelector } from './useAppSelector';
import { selectSettings } from '../store/selectors';
import { rescheduleDailyReminder } from '../services/notificationScheduler';
import { logger } from '../utils/logger';

export const useReminderScheduler = () => {
  const settings = useAppSelector(selectSettings);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!settings.firstRunComplete) {
      return;
    }
    rescheduleDailyReminder(settings.reminderTimeLocal).catch((error) =>
      logger.error('Failed to reschedule reminder', error),
    );
  }, [settings.firstRunComplete, settings.reminderTimeLocal]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        if (settings.firstRunComplete) {
          rescheduleDailyReminder(settings.reminderTimeLocal).catch((error) =>
            logger.error('Failed to reschedule reminder on resume', error),
          );
        }
      }
      appState.current = nextState;
    });
    return () => subscription.remove();
  }, [settings.firstRunComplete, settings.reminderTimeLocal]);
};
