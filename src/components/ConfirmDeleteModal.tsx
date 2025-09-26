import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../context/ThemeProvider';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const REQUIRED = 'DELETE';

export const ConfirmDeleteModal: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  const { colours } = useTheme();
  const [value, setValue] = useState('');

  React.useEffect(() => {
    if (visible) {
      setValue('');
    }
  }, [visible]);

  const isValid = value.trim().toUpperCase() === REQUIRED;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={[styles.container, { backgroundColor: colours.background }]}> 
        <Text style={[styles.title, { color: colours.text }]}>Delete all data</Text>
        <Text style={{ color: colours.subtleText }}>
          This action is irreversible. Type DELETE to confirm you understand.
        </Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Type DELETE"
          placeholderTextColor={colours.subtleText}
          style={[styles.input, { borderColor: colours.border, color: colours.text, backgroundColor: colours.surface }]}
          accessibilityLabel="Confirmation text"
        />
        <PrimaryButton label="Confirm" onPress={onConfirm} disabled={!isValid} />
        <PrimaryButton label="Cancel" onPress={onCancel} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
  },
});
