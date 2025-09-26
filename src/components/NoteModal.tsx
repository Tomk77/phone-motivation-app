import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  visible: boolean;
  dateLabel: string;
  note: string | null;
  onClose: () => void;
  onSave: (value: string | null) => void;
}

export const NoteModal: React.FC<Props> = ({ visible, dateLabel, note, onClose, onSave }) => {
  const { colours } = useTheme();
  const [value, setValue] = useState(note ?? '');

  React.useEffect(() => {
    if (visible) {
      setValue(note ?? '');
    }
  }, [visible, note]);

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colours.background }]}> 
        <Text style={[styles.title, { color: colours.text }]}>Note for {dateLabel}</Text>
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text.slice(0, 120))}
          placeholder="Add a short note (optional)"
          placeholderTextColor={colours.subtleText}
          multiline
          accessibilityLabel="Daily note"
          style={[styles.input, { color: colours.text, borderColor: colours.border, backgroundColor: colours.surface }]}
          maxLength={120}
        />
        <View style={styles.actions}>
          <PrimaryButton label="Save" onPress={() => onSave(value.trim() ? value.trim() : null)} />
          <PrimaryButton label="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  actions: {
    gap: 16,
  },
});
