import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

type RadioButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress, disabled = false }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
      <View style={[styles.outerCircle, selected && styles.selectedOuterCircle, disabled && styles.disabledCircle]}>
        {selected && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default RadioButton;

