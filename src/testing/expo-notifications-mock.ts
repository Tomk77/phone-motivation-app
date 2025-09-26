export const AndroidImportance = { DEFAULT: 1 };
export const IosAuthorizationStatus = { PROVISIONAL: 2 };
export const getPermissionsAsync = async () => ({ granted: true });
export const requestPermissionsAsync = async () => ({ granted: true });
export const scheduleNotificationAsync = async () => 'id';
export const cancelScheduledNotificationAsync = async () => undefined;
export const setNotificationHandler = () => undefined;
export const setNotificationChannelAsync = async () => undefined;
export const addNotificationResponseReceivedListener = () => ({ remove: () => undefined });
