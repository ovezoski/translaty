import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type RadioButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress, disabled = false }) => {
  return (
  <TouchableOpacity
    style={[
      styles.container,
      selected && styles.containerSelected,
      disabled && styles.containerDisabled
    ]}
    onPress={onPress}
    disabled={disabled}
  >
      <Text style={styles.label}>{label}</Text>
      {selected && (
        <Ionicons name="checkmark-done-outline" size={21} color="white" />
      )}
      {disabled && (
        <Ionicons name="remove-circle-outline" size={21} color="white" />
      )}
    </TouchableOpacity>
  );
};

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
  containerSelected: {
    backgroundColor: '#007AFF33',
  },
  containerDisabled: {
    backgroundColor: 'rgba(200, 0, 0, 0.2)',
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOuterCircle: {
    borderColor: '#007AFF',
  },
  disabledCircle: {
    borderColor: 'darkred',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 16,
    color: 'white',
  },
});

export default RadioButton;

