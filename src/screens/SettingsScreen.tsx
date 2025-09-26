import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useTheme } from '../context/ThemeProvider';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectGoal, selectSettings } from '../store/selectors';
import { TimeField } from '../components/TimeField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { persistSettings, renameGoal, deleteAllData } from '../store/actions';
import { rescheduleDailyReminder } from '../services/notificationScheduler';
import { logger } from '../utils/logger';
import { exportStateToJson } from '../services/exporter';
import { useStore } from '../store/StoreProvider';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { successHaptic, errorHaptic } from '../services/haptics';

const THEMES: Array<{ label: string; value: 'light' | 'dark' | 'system' }> = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export const SettingsScreen: React.FC = () => {
  const { colours } = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const goal = useAppSelector(selectGoal);
  const store = useStore();

  const [reminderTime, setReminderTime] = useState(settings.reminderTimeLocal);
  const [goalName, setGoalName] = useState(goal?.name ?? '');
  const [themePreference, setThemePreference] = useState(settings.theme);
  const [lateMark, setLateMark] = useState(settings.allowLateMark);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const handleSaveReminder = async () => {
    if (!/^\d{2}:\d{2}$/.test(reminderTime)) {
      Alert.alert('Reminder time', 'Please enter a valid 24 hour time.');
      return;
    }
    try {
      await dispatch(persistSettings({ reminderTimeLocal: reminderTime }));
      await rescheduleDailyReminder(reminderTime);
      await successHaptic();
      Alert.alert('Reminder updated', `Daily reminder set for ${reminderTime}`);
    } catch (error) {
      logger.error('Failed to save reminder', error);
      await errorHaptic();
      Alert.alert('Reminder time', 'We could not update your reminder.');
    }
  };

  const handleSaveGoal = async () => {
    if (!goalName.trim()) {
      Alert.alert('Rename goal', 'Name cannot be empty.');
      return;
    }
    try {
      await dispatch(renameGoal(goalName.trim()));
      await successHaptic();
      Alert.alert('Goal renamed');
    } catch (error) {
      logger.error('Failed to rename goal', error);
      await errorHaptic();
      Alert.alert('Rename goal', 'We could not update the name.');
    }
  };

  const handleThemeChange = async (value: 'light' | 'dark' | 'system') => {
    setThemePreference(value);
    await dispatch(persistSettings({ theme: value }));
  };

  const handleLateMarkChange = async (value: boolean) => {
    setLateMark(value);
    await dispatch(persistSettings({ allowLateMark: value }));
  };

  const handleExport = async () => {
    try {
      const uri = await exportStateToJson(store.getState());
      Alert.alert('Export complete', `Saved to ${uri}`);
    } catch (error) {
      logger.error('Export failed', error);
      Alert.alert('Export data', 'We could not export your data.');
    }
  };

  const handleDeleteAll = async () => {
    setDeleteVisible(false);
    try {
      await dispatch(deleteAllData());
      Alert.alert('All data removed');
    } catch (error) {
      logger.error('Failed to delete data', error);
      Alert.alert('Delete data', 'We could not delete your data.');
    }
  };

  return (
    <ScreenShell scrollable>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colours.text }]}>Reminder time</Text>
        <TimeField value={reminderTime} onChange={setReminderTime} />
        <PrimaryButton label="Save reminder" onPress={handleSaveReminder} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colours.text }]}>Rename goal</Text>
        <TextInput
          value={goalName}
          onChangeText={setGoalName}
          style={[styles.input, { borderColor: colours.border, color: colours.text, backgroundColor: colours.surface }]}
          accessibilityLabel="Goal name"
        />
        <PrimaryButton label="Save name" onPress={handleSaveGoal} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colours.text }]}>Theme</Text>
        <View style={styles.themeRow}>
          {THEMES.map((theme) => {
            const isSelected = theme.value === themePreference;
            return (
              <Pressable
                key={theme.value}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: isSelected ? colours.primary : 'transparent',
                    borderColor: colours.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleThemeChange(theme.value)}
              >
                <Text style={{ color: isSelected ? '#FFFFFF' : colours.text }}>{theme.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colours.text }]}>Allow Late Mark</Text>
        <View style={styles.switchRow}>
          <Text style={{ flex: 1, color: colours.subtleText }}>
            Allow marking yesterday within 12 hours after midnight.
          </Text>
          <Switch
            value={lateMark}
            onValueChange={handleLateMarkChange}
            thumbColor={lateMark ? colours.primary : colours.border}
          />
        </View>
      </View>

      <View style={styles.section}>
        <PrimaryButton label="Export data" onPress={handleExport} />
        <PrimaryButton label="Delete all data" onPress={() => setDeleteVisible(true)} />
      </View>

      <ConfirmDeleteModal
        visible={deleteVisible}
        onCancel={() => setDeleteVisible(false)}
        onConfirm={handleDeleteAll}
      />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  themeChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
