import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  dateLabel: string;
  isCurrentMonth: boolean;
  completed: boolean;
  onPress: () => void;
  accessibilityLabel: string;
  note?: string | null;
}

export const DayCell: React.FC<Props> = ({
  dateLabel,
  isCurrentMonth,
  completed,
  onPress,
  accessibilityLabel,
  note,
}) => {
  const { colours } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        {
          borderColor: colours.border,
          backgroundColor: pressed ? `${colours.secondary}22` : 'transparent',
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={note ? 'Note attached' : undefined}
    >
      <View style={styles.inner}>
        <Text
          style={[
            styles.date,
            { color: isCurrentMonth ? colours.text : colours.subtleText, fontWeight: completed ? '700' : '500' },
          ]}
        >
          {dateLabel}
        </Text>
        <View
          style={[
            styles.mark,
            {
              borderColor: colours.primary,
              backgroundColor: completed ? `${colours.primary}22` : 'transparent',
            },
          ]}
        >
          {completed && <Text style={[styles.xMark, { color: colours.primary }]}>×</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderRadius: 12,
    margin: 4,
    minHeight: 68,
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
  },
  date: {
    fontSize: 12,
  },
  mark: {
    alignSelf: 'center',
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xMark: {
    fontSize: 32,
    lineHeight: 32,
  },
});
