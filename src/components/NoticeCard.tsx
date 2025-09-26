import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  text: string;
  tone?: 'info' | 'warning';
}

export const NoticeCard: React.FC<Props> = ({ text, tone = 'info' }) => {
  const { colours } = useTheme();
  const background = tone === 'warning' ? `${colours.danger}22` : `${colours.secondary}22`;
  const border = tone === 'warning' ? colours.danger : colours.secondary;
  return (
    <View style={[styles.container, { backgroundColor: background, borderColor: border }]}> 
      <Text style={[styles.text, { color: colours.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  text: {
    fontSize: 16,
  },
});
