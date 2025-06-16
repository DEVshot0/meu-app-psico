// components/FormularioCadastro.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormularioCadastro = ({
  formData,
  onChange,
  onToggle,
  onSubmit,
  onCancel,
  isLoading,
  handleOpenDiagnostico
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Responsável</Text>

      <TextInput style={styles.input} placeholder="Email*" value={formData.email} onChangeText={t => onChange('email', t)} />
      <TextInput style={styles.input} placeholder="Username*" value={formData.username} onChangeText={t => onChange('username', t)} />
      <TextInput style={styles.input} placeholder="Password*" secureTextEntry value={formData.password} onChangeText={t => onChange('password', t)} />
      <TextInput style={styles.input} placeholder="Nome Completo*" value={formData.full_name} onChangeText={t => onChange('full_name', t)} />
      <TextInput style={styles.input} placeholder="Data de Nascimento*" value={formData.birth_date} onChangeText={t => onChange('birth_date', t, '99/99/9999')} keyboardType="numeric" maxLength={10} />
      <TextInput style={styles.input} placeholder="Telefone*" value={formData.phone_number} onChangeText={t => onChange('phone_number', t, '(99) 99999-9999')} keyboardType="phone-pad" maxLength={15} />

      <Text style={styles.sectionTitle}>Paciente</Text>
      <TextInput style={styles.input} placeholder="Nome do Paciente*" value={formData.patient_name} onChangeText={t => onChange('patient_name', t)} />
      
      <TouchableOpacity style={styles.input} onPress={handleOpenDiagnostico}>
        <Text style={formData.diagnosis_name ? styles.inputText : styles.placeholderText}>
          {formData.diagnosis_name || 'Selecione o Diagnóstico*'}
        </Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Data de Nascimento*" value={formData.patient_birth_date} onChangeText={t => onChange('patient_birth_date', t, '99/99/9999')} keyboardType="numeric" maxLength={10} />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={[styles.checkbox, formData.consent_form && styles.checkboxChecked]}
          onPress={() => onToggle('consent_form')}
        >
          {formData.consent_form && <Ionicons name="checkmark" size={20} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>Termo de Consentimento</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel} disabled={isLoading}>
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
    color: "#555",
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
    width: 24, height: 24,
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  checkboxChecked: { backgroundColor: '#2f6b5e' },
  checkboxLabel: { fontSize: 16 },
});

export default FormularioCadastro;
