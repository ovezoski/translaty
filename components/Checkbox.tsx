import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onPress, disabled = false }) => (
  <TouchableOpacity
    style={[
      styles.container,
      checked && styles.containerChecked,
      disabled && styles.containerDisabled
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.label}>{label}</Text>
    {checked && (
      <Ionicons name="checkmark-done-outline" size={21} color="white" />
    )}
    {disabled && (
      <Ionicons name="remove-circle-outline" size={21} color="white" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: 60,
    borderRadius: 10,
  },
  containerChecked: {
    backgroundColor: '#007AFF33',
  },
  containerDisabled: {
    backgroundColor: 'rgba(200, 0, 0, 0.2)',
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
});

export default Checkbox;
