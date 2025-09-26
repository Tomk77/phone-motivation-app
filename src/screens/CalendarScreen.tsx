import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenShell } from '../components/ScreenShell';
import { useTheme } from '../context/ThemeProvider';
import { CalendarGrid } from '../components/CalendarGrid';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectEntriesRecord } from '../store/selectors';
import { formatMonthTitle, parseISODate } from '../utils/date';
import { NoteModal } from '../components/NoteModal';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateNote } from '../store/actions';

export const CalendarScreen: React.FC = () => {
  const { colours } = useTheme();
  const entries = useAppSelector(selectEntriesRecord);
  const dispatch = useAppDispatch();
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [noteVisible, setNoteVisible] = useState(false);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + (direction === 'next' ? 1 : -1));
      return next;
    });
  };

  const handleSelectDate = (dateISO: string) => {
    setSelectedDate(dateISO);
    setNoteVisible(true);
  };

  const handleSaveNote = async (value: string | null) => {
    if (!selectedDate) {
      return;
    }
    await dispatch(updateNote(selectedDate, value));
    setNoteVisible(false);
  };

  const noteDateLabel = selectedDate
    ? parseISODate(selectedDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <ScreenShell scrollable>
      <View style={styles.header}>
        <Pressable
          onPress={() => handleMonthChange('prev')}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          style={[styles.navButton, { borderColor: colours.border }]}
        >
          <Text style={{ color: colours.text }}>‹</Text>
        </Pressable>
        <Text style={[styles.monthTitle, { color: colours.text }]}>{formatMonthTitle(month)}</Text>
        <Pressable
          onPress={() => handleMonthChange('next')}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          style={[styles.navButton, { borderColor: colours.border }]}
        >
          <Text style={{ color: colours.text }}>›</Text>
        </Pressable>
      </View>
      <CalendarGrid month={month} entries={entries} onSelectDate={handleSelectDate} />
      <NoteModal
        visible={noteVisible}
        note={selectedDate ? entries[selectedDate]?.note ?? null : null}
        dateLabel={noteDateLabel}
        onClose={() => setNoteVisible(false)}
        onSave={handleSaveNote}
      />
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  navButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
