import React, { useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View, ToastAndroid } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useTheme } from '../context/ThemeProvider';
import { PrimaryButton } from '../components/PrimaryButton';
import { NoticeCard } from '../components/NoticeCard';
import { StreakCard } from '../components/StreakCard';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectEntriesRecord, selectGoal, selectSettings, selectStreaks } from '../store/selectors';
import { todayISO, yesterdayISO, withinLateMarkWindow, formatDateGB } from '../utils/date';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleEntry, updateNote } from '../store/actions';
import { successHaptic, errorHaptic } from '../services/haptics';

export const TodayScreen: React.FC = () => {
  const { colours } = useTheme();
  const goal = useAppSelector(selectGoal);
  const entries = useAppSelector(selectEntriesRecord);
  const settings = useAppSelector(selectSettings);
  const streaks = useAppSelector(selectStreaks);
  const dispatch = useAppDispatch();

  const [noteDraft, setNoteDraft] = useState('');

  const today = todayISO();
  const yesterday = yesterdayISO();
  const todayEntry = entries[today];
  const yesterdayEntry = entries[yesterday];

  const canMarkToday = !todayEntry?.completed;
  const canMarkYesterday = useMemo(() => {
    if (!settings.allowLateMark) {
      return false;
    }
    if (yesterdayEntry?.completed) {
      return false;
    }
    return withinLateMarkWindow(new Date());
  }, [settings.allowLateMark, yesterdayEntry?.completed]);

  React.useEffect(() => {
    setNoteDraft(todayEntry?.note ?? '');
  }, [todayEntry?.note]);

  const handleMark = async (dateISO: string) => {
    try {
      await dispatch(toggleEntry({ dateISO, completed: true, note: dateISO === today ? noteDraft : undefined }));
      if (dateISO === today && noteDraft.trim()) {
        await dispatch(updateNote(dateISO, noteDraft.trim()));
      }
      await successHaptic();
      if (Platform.OS === 'android') {
        // eslint-disable-next-line no-undef
        ToastAndroid.show('Nice one. Chain extended', ToastAndroid.SHORT);
      } else {
        Alert.alert('Nice one. Chain extended');
      }
    } catch (error) {
      await errorHaptic();
      Alert.alert('Could not mark the day', 'Please try again.');
    }
  };

  const handleNoteBlur = async () => {
    if (!noteDraft.trim()) {
      return;
    }
    await dispatch(updateNote(today, noteDraft.trim()));
  };

  return (
    <ScreenShell scrollable>
      <View accessibilityRole="header" style={styles.header}>
        <Text style={[styles.title, { color: colours.text }]}>{goal?.name ?? 'Your goal'}</Text>
        <Text style={{ color: colours.subtleText }}>Keep the chain going.</Text>
      </View>

      <StreakCard current={streaks.current} best={streaks.best} />

      {streaks.isBroken && (
        <NoticeCard text="You missed a day. Your current streak has reset" tone="warning" />
      )}

      {canMarkYesterday && (
        <NoticeCard
          text={`You can still mark ${formatDateGB(yesterday)}. Tap below to keep the chain alive.`}
          tone="info"
        />
      )}

      <PrimaryButton
        label={canMarkToday ? 'Mark today complete' : 'Today already marked'}
        onPress={() => handleMark(today)}
        disabled={!canMarkToday}
        accessibilityHint="Marks today with an X"
      />

      {canMarkYesterday && (
        <PrimaryButton
          label="Mark yesterday complete"
          onPress={() => handleMark(yesterday)}
          accessibilityHint="Marks yesterday during the Late Mark window"
        />
      )}

      <View style={styles.noteCard}>
        <Text style={[styles.noteLabel, { color: colours.text }]}>Add a note</Text>
        <TextInput
          value={noteDraft}
          onChangeText={setNoteDraft}
          onBlur={handleNoteBlur}
          placeholder="Optional note (120 characters)"
          placeholderTextColor={colours.subtleText}
          maxLength={120}
          style={[styles.noteInput, { borderColor: colours.border, color: colours.text, backgroundColor: colours.surface }]}
          accessibilityLabel="Quick note"
        />
      </View>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  noteCard: {
    gap: 12,
  },
  noteLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
});
