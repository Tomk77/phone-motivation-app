import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  current: number;
  best: number;
}

export const StreakCard: React.FC<Props> = ({ current, best }) => {
  const { colours } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colours.surface, borderColor: colours.border }]}> 
      <View style={styles.row}>
        <Text style={[styles.heading, { color: colours.subtleText }]}>Current streak</Text>
        <Text style={[styles.value, { color: colours.text }]}>{current} day{current === 1 ? '' : 's'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.heading, { color: colours.subtleText }]}>Best streak</Text>
        <Text style={[styles.value, { color: colours.text }]}>{best} day{best === 1 ? '' : 's'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 16,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});
