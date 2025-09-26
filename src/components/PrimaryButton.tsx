import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityHint?: string;
}

export const PrimaryButton: React.FC<Props> = ({ label, onPress, disabled, accessibilityHint }) => {
  const { colours } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? `${colours.primary}55` : colours.primary,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      <Text style={[styles.label, { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
});
