import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TimeField: React.FC<Props> = ({ value, onChange }) => {
  const { colours } = useTheme();
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (input: string) => {
    const next = input.replace(/[^0-9:]/g, '');
    if (next.length === 2 && value.length === 1) {
      onChange(`${next}:`);
      return;
    }
    if (/^\d{0,2}:?\d{0,2}$/.test(next)) {
      onChange(next);
    }
  };

  React.useEffect(() => {
    if (!value) {
      setError('Required');
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(value)) {
      setError('Use HH:MM');
      return;
    }
    const [hh, mm] = value.split(':').map(Number);
    if (hh > 23 || mm > 59) {
      setError('Invalid time');
      return;
    }
    setError(null);
  }, [value]);

  return (
    <View>
      <Text style={[styles.label, { color: colours.text }]}>Reminder time (24 hour)</Text>
      <TextInput
        value={value}
        onChangeText={handleChange}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        style={[styles.input, { borderColor: error ? colours.danger : colours.border, color: colours.text, backgroundColor: colours.surface }]}
        accessibilityLabel="Reminder time"
        placeholder="21:00"
        placeholderTextColor={colours.subtleText}
      />
      {error && <Text style={[styles.error, { color: colours.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
  },
  error: {
    marginTop: 8,
  },
});
