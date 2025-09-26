import {
  scheduleDailyReminder,
  requestReminderPermissions,
  setNotificationsApi,
} from '../services/notificationScheduler';

const calls: Record<string, any[]> = {};

const stub = {
  getPermissionsAsync: async () => ({ granted: true }),
  requestPermissionsAsync: async () => ({ granted: true }),
  scheduleNotificationAsync: async (...args: any[]) => {
    calls.schedule = args;
    return 'id';
  },
  cancelScheduledNotificationAsync: async () => {
    calls.cancelled = ['ok'];
  },
  setNotificationHandler: () => undefined,
  setNotificationChannelAsync: async () => {
    calls.channel = ['set'];
  },
  addNotificationResponseReceivedListener: () => ({ remove: () => undefined }),
  AndroidImportance: { DEFAULT: 1 },
  IosAuthorizationStatus: { PROVISIONAL: 2 },
};

setNotificationsApi(stub as any);

describe('notification scheduler', () => {
  it('requests permission', async () => {
    const result = await requestReminderPermissions();
    expect(result.granted).toBe(true);
  });

  it('schedules notification with trigger', async () => {
    await scheduleDailyReminder('21:00');
    expect(calls.schedule).toBeTruthy();
  });
});
