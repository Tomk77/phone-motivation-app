import * as Haptics from 'expo-haptics';

export const successHaptic = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const errorHaptic = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
