import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormularioCadastro = ({
  campos,
  formData,
  onChange,
  onToggle,
  onSubmit,
  onCancel,
  isLoading,
  onCustomPress = {},
}) => {
  return (
    <View>
      {campos.map((campo, index) => {
        if (campo.tipo === 'titulo') {
          return (
            <Text key={index} style={styles.sectionTitle}>
              {campo.label}
            </Text>
          );
        }

        if (campo.tipo === 'checkbox') {
          return (
            <View key={campo.nome} style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  formData[campo.nome] && styles.checkboxChecked,
                ]}
                onPress={() => onToggle(campo.nome)}
              >
                {formData[campo.nome] && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>{campo.label}</Text>
            </View>
          );
        }

        if (campo.tipo === 'customButton') {
          return (
            <TouchableOpacity
              key={campo.nome}
              style={styles.input}
              onPress={onCustomPress[campo.nome]}
            >
              <Text
                style={
                  formData[campo.nome] ? styles.inputText : styles.placeholderText
                }
              >
                {formData[campo.nome] || campo.placeholder}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TextInput
            key={campo.nome}
            style={styles.input}
            placeholder={campo.placeholder}
            secureTextEntry={campo.tipo === 'password'}
            value={formData[campo.nome]}
            onChangeText={(t) => onChange(campo.nome, t, campo.mascara)}
            keyboardType={campo.teclado || 'default'}
            maxLength={campo.maxLength || undefined}
          />
        );
      })}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={isLoading}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    justifyContent: 'center',
    color: '#555',
  },
  inputText: { fontSize: 16, color: 'black' },
  placeholderText: { fontSize: 16, color: 'rgba(0,0,0,0.5)' },
  submitButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: '#2f6b5e' },
  checkboxLabel: { fontSize: 16 },
});

export default FormularioCadastro;
