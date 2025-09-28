import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onPress, disabled = false }) => (
  <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
    <View style={[styles.box, checked && styles.boxChecked, disabled && styles.boxDisabled]}>
      {checked && <View style={styles.innerBox} />}
    </View>
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  box: {
    height: 24,
    width: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#777',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF33',
  },
  boxDisabled: {
    borderColor: 'darkred',
  },
  innerBox: {
    height: 12,
    width: 12,
    borderRadius: 2,
    backgroundColor: '#007AFF',
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default Checkbox;
