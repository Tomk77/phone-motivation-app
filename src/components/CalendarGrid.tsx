import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getMonthGrid, parseISODate } from '../utils/date';
import { DayCell } from './DayCell';
import { Entry } from '../types/models';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  month: Date;
  entries: Record<string, Entry>;
  onSelectDate: (dateISO: string) => void;
}

export const CalendarGrid: React.FC<Props> = ({ month, entries, onSelectDate }) => {
  const { colours } = useTheme();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells = getMonthGrid(month);

  return (
    <View>
      <View style={styles.weekRow}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={[styles.weekLabel, { color: colours.subtleText }]}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map(({ dateISO, isCurrentMonth }) => {
          const entry = entries[dateISO];
          const date = parseISODate(dateISO);
          const label = date.getDate().toString();
          const accessibleLabel = `${date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
          })}${entry?.completed ? ', marked complete' : ''}${entry?.note ? ', note added' : ''}`;
          return (
            <DayCell
              key={dateISO}
              dateLabel={label}
              isCurrentMonth={isCurrentMonth}
              completed={Boolean(entry?.completed)}
              note={entry?.note}
              accessibilityLabel={accessibleLabel}
              onPress={() => onSelectDate(dateISO)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
});
