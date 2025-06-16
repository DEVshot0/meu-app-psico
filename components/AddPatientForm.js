import React, { useState } from 'react';
import { ScrollView, Modal, View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unMask } from 'react-native-mask-text';

import FormularioCadastro from './FormularioCadastro';
import { criarPacienteVazio } from '../models/PacienteModel';
import { useDiagnoses } from '../hooks/useDiagnoses';
import { apiService } from '../src/services/apiService';

const AddPatientForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(criarPacienteVazio());
  const [isLoading, setIsLoading] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const { diagnoses, fetchDiagnoses } = useDiagnoses();

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (field, value, mask = null) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const toggleCheckbox = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'email', 'username', 'password', 'full_name',
      'birth_date', 'phone_number', 'patient_name',
      'diagnosis_id', 'patient_birth_date'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        user: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          level: 4
        },
        responsible: {
          full_name: formData.full_name,
          birth_date: formatDateForAPI(formData.birth_date),
          gender: formData.gender,
          nationality: formData.nationality,
          address: formData.address,
          phone_number: unMask(formData.phone_number),
          cpf: unMask(formData.cpf),
          rg: formData.rg
        },
        patient: {
          patient_name: formData.patient_name,
          diagnosis_id: parseInt(formData.diagnosis_id),
          birth_date: formatDateForAPI(formData.patient_birth_date),
          gender: formData.patient_gender,
          nationality: formData.patient_nationality,
          cpf: unMask(formData.patient_cpf),
          rg: formData.patient_rg,
          agreement_card: formData.agreement_card,
          sus_card: formData.sus_card,
          medical_history: formData.medical_history,
          allergies: formData.allergies,
          medication_in_use: formData.medication_in_use,
          familiar_history: formData.familiar_history,
          first_consultation: formatDateForAPI(formData.first_consultation),
          observations: formData.observations,
          consent_form: formData.consent_form,
          authorization_to_share_data: formData.authorization_to_share_data
        }
      };

      await apiService('POST', requestBody, 'api/v1/register/responsible-patient/');
      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao cadastrar o paciente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDiagnosis = (item) => {
    setFormData({
      ...formData,
      diagnosis_id: item.id,
      diagnosis_name: item.diagnosis || `Diagnóstico ${item.id}`
    });
    setShowDiagnosisModal(false);
  };

  const renderDiagnosisItem = ({ item }) => (
    <TouchableOpacity 
      style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }}
      onPress={() => handleSelectDiagnosis(item)}
    >
      <Text style={{ fontSize: 16 }}>{item.diagnosis || `Diagnóstico ${item.id}`}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <FormularioCadastro
        formData={formData}
        onChange={handleInputChange}
        onToggle={toggleCheckbox}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        handleOpenDiagnostico={() => {
          fetchDiagnoses();
          setShowDiagnosisModal(true);
        }}
      />

      <Modal
        visible={showDiagnosisModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDiagnosisModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Diagnóstico</Text>
            <FlatList
              data={diagnoses}
              renderItem={renderDiagnosisItem}
              keyExtractor={(item) => item.id.toString()}
            />
            <TouchableOpacity onPress={() => setShowDiagnosisModal(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2f6b5e'
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#2f6b5e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default AddPatientForm;
