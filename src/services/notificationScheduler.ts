import * as NotificationsModule from 'expo-notifications';
import { Platform } from 'react-native';
import { combineDateTimeToNext, getReminderHourMinute } from '../utils/date';
import { NOTIFICATION_IDENTIFIER } from '../utils/constants';

const CHANNEL_ID = 'crossday-reminders';

type NotificationsApi = typeof NotificationsModule;

let notificationsApi: NotificationsApi = NotificationsModule;

export const setNotificationsApi = (api: NotificationsApi) => {
  notificationsApi = api;
};

notificationsApi.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface PermissionResult {
  granted: boolean;
}

export const requestReminderPermissions = async (): Promise<PermissionResult> => {
  const settings = await notificationsApi.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return { granted: true };
  }
  const response = await notificationsApi.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: false,
      allowAnnouncements: false,
    },
  });
  return { granted: response.granted || response.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL };
};

export const configureAndroidChannel = async () => {
  if (Platform.OS === 'android') {
    await notificationsApi.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily reminder',
      importance: Notifications.AndroidImportance.DEFAULT,
      enableVibrate: false,
      sound: undefined,
      lightColor: '#2563EB',
    });
  }
};

export const scheduleDailyReminder = async (time24: string): Promise<void> => {
  await configureAndroidChannel();
  await cancelDailyReminder();
  const triggerTime = combineDateTimeToNext(time24);
  const { hour, minute } = getReminderHourMinute(time24);

  await notificationsApi.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: 'It is time to mark your day in CrossDay',
      body: 'Tap to open CrossDay and mark the day complete.',
      sound: undefined,
    },
    trigger:
      Platform.OS === 'android'
        ? {
            hour,
            minute,
            repeats: true,
            channelId: CHANNEL_ID,
          }
        : {
            date: triggerTime,
            repeats: true,
          },
  });
};

export const cancelDailyReminder = async (): Promise<void> => {
  await notificationsApi.cancelScheduledNotificationAsync(NOTIFICATION_IDENTIFIER);
};

export const rescheduleDailyReminder = async (time24: string): Promise<void> => {
  await scheduleDailyReminder(time24);
};

export const addNotificationResponseListener = (
  handler: (response: Notifications.NotificationResponse) => void,
): Notifications.Subscription => notificationsApi.addNotificationResponseReceivedListener(handler);
