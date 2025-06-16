import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PacientePicker = ({ pacientes, selectedId, onSelect }) => {
  return (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={selectedId}
        onValueChange={(value) => {
          const paciente = pacientes.find(p => p.id === value);
          onSelect(value, paciente?.patient_name || '');
        }}
      >
        <Picker.Item label="Escolha um paciente" value="" />
        {pacientes.map(p => (
          <Picker.Item key={p.id} label={p.patient_name} value={p.id} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 80,
    width: '100%',
    marginBottom: 30,
    overflow: 'hidden',
  },
});

export default PacientePicker;
