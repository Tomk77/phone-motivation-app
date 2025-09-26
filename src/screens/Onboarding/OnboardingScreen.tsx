import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Switch, Alert, Platform } from 'react-native';
import { ScreenShell } from '../../components/ScreenShell';
import { useTheme } from '../../context/ThemeProvider';
import { PrimaryButton } from '../../components/PrimaryButton';
import { TimeField } from '../../components/TimeField';
import { DEFAULT_REMINDER_TIME } from '../../utils/constants';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { completeOnboarding, persistSettings } from '../../store/actions';
import { requestReminderPermissions, scheduleDailyReminder } from '../../services/notificationScheduler';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectSettings } from '../../store/selectors';
import { logger } from '../../utils/logger';
import { successHaptic, errorHaptic } from '../../services/haptics';

export const OnboardingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const existingSettings = useAppSelector(selectSettings);
  const { colours } = useTheme();
  const [step, setStep] = useState(0);
  const [goalName, setGoalName] = useState('');
  const [reminderTime, setReminderTime] = useState(existingSettings.reminderTimeLocal || DEFAULT_REMINDER_TIME);
  const [allowLateMark, setAllowLateMark] = useState(existingSettings.allowLateMark);
  const [isRequesting, setIsRequesting] = useState(false);

  const nextDisabled = step === 0 ? goalName.trim().length < 2 : reminderTime.length !== 5;

  const handleNext = () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    }
  };

  const handleComplete = async () => {
    setIsRequesting(true);
    try {
      const { granted } = await requestReminderPermissions();
      if (!granted) {
        await errorHaptic();
        Alert.alert(
          'Permission needed',
          'CrossDay uses local notifications to remind you at the end of the day.',
        );
        setIsRequesting(false);
        return;
      }
      await dispatch(
        completeOnboarding({
          goalName: goalName.trim(),
          reminderTimeLocal: reminderTime,
          allowLateMark,
          theme: existingSettings.theme,
          firstRunComplete: true,
        }),
      );
      await scheduleDailyReminder(reminderTime);
      await successHaptic();
      await dispatch(persistSettings({ allowLateMark }));
    } catch (error) {
      logger.error('Failed to complete onboarding', error);
      await errorHaptic();
      Alert.alert('We could not finish onboarding', 'Please try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <ScreenShell scrollable>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colours.text }]}>Build your chain</Text>
        <Text style={[styles.body, { color: colours.subtleText }]}>
          Name your goal and choose a daily reminder time. Mark each day to grow your streak.
        </Text>
      </View>

      {step === 0 && (
        <View style={styles.card}>
          <Text style={[styles.label, { color: colours.text }]}>Goal name</Text>
          <TextInput
            value={goalName}
            onChangeText={setGoalName}
            placeholder="Stopped smoking"
            placeholderTextColor={colours.subtleText}
            style={[styles.input, { borderColor: colours.border, backgroundColor: colours.surface, color: colours.text }]}
            accessibilityLabel="Goal name"
          />
        </View>
      )}

      {step === 1 && (
        <View style={styles.card}>
          <TimeField value={reminderTime} onChange={setReminderTime} />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colours.text }]}>Allow Late Mark</Text>
              <Text style={{ color: colours.subtleText }}>
                Let CrossDay nudge you to mark yesterday for 12 hours after midnight.
              </Text>
            </View>
            <Switch
              value={allowLateMark}
              onValueChange={setAllowLateMark}
              thumbColor={allowLateMark ? colours.primary : colours.border}
              accessibilityLabel="Allow Late Mark"
            />
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.card}>
          <Text style={{ color: colours.text, fontSize: 18, fontWeight: '600' }}>Enable reminders</Text>
          <Text style={{ color: colours.subtleText }}>
            {Platform.OS === 'ios'
              ? 'CrossDay uses local notifications to remind you at the end of the day.'
              : 'CrossDay sends a local reminder at your chosen time.'}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        {step < 2 ? (
          <PrimaryButton label="Next" onPress={handleNext} disabled={nextDisabled} />
        ) : (
          <PrimaryButton
            label={isRequesting ? 'Setting up…' : 'Enable notifications'}
            onPress={handleComplete}
            disabled={isRequesting}
          />
        )}
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
  },
  actions: {
    marginTop: 'auto',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
