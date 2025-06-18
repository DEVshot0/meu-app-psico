import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MainLayout from '../components/MainLayout';
import { useDiagnoses } from '../hooks/useDiagnoses';
import { criarPacienteVazio } from '../models/PacienteModel';
import { apiService } from '../src/services/apiService';
import FileUploadSection from '../components/FileUploadSection';
import FormularioCadastro from '../components/FormularioCadastro';
import { mask } from 'react-native-mask-text';

const camposFormularioPaciente = [
  { tipo: 'titulo', label: 'Responsável' },
  { nome: 'email', placeholder: 'Email*' },
  { nome: 'username', placeholder: 'Username*' },
  { nome: 'password', placeholder: 'Senha*', tipo: 'password' },
  { tipo: 'titulo', label: 'Paciente' },
  { nome: 'patient_name', placeholder: 'Nome do Paciente*' },
  { nome: 'diagnosis_name', tipo: 'customButton', placeholder: 'Selecione o Diagnóstico*' },
  { nome: 'patient_birth_date', placeholder: 'Nascimento do Paciente*', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'consent_form', tipo: 'checkbox', label: 'Termo de Consentimento' }
];

const EditarPacienteScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    ...criarPacienteVazio(),
    email: '',
    username: '',
    password: '',
    patient_name: '',
    patient_birth_date: '',
    diagnosis_id: null,
    diagnosis_name: '',
    consent_form: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { diagnoses, fetchDiagnoses } = useDiagnoses();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService('GET', null, `api/v1/patient/${route.params.patientId}`);
        setFormData(prev => ({
          ...prev,
          ...data,
          patient_name: data.patient_name,
          patient_birth_date: data.patient_birth_date,
          diagnosis_id: data.diagnosis_id,
          diagnosis_name: data.diagnosis_name,
          consent_form: data.consent_form || false
        }));
        await fetchAttachments();
        await fetchDiagnoses();
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchData();
  }, []);

  const fetchAttachments = async () => {
    try {
      setIsLoadingAttachments(true);
      const data = await apiService('POST', route.params.csrfToken, 'api/v1/files-by-user/', {
        user_id: route.params.patientId
      });
      setAttachments(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os anexos.');
    } finally {
      setIsLoadingAttachments(false);
    }
  };

  const handleUploadFile = async () => {
    const success = await apiService('UPLOAD', route.params.csrfToken, 'api/v1/upload-files/', formData.id);
    if (success) {
      Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
      await fetchAttachments();
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiService('PUT', route.params.csrfToken, `api/v1/patient/${formData.id}/`, formData);
      if (response) {
        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar dados do paciente.');
    }
  };

  const handleToggle = (campo) => {
    setFormData(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleChange = (campo, valor, mascara = null) => {
    setFormData(prev => ({
      ...prev,
      [campo]: mascara ? mask(valor, mascara) : valor
    }));
  };

  const handleOpenDiagnostico = () => {
    navigation.navigate('SelecionarDiagnostico', {
      onSelect: (diagnostico) => {
        setFormData((prev) => ({
          ...prev,
          diagnosis_id: diagnostico.id,
          diagnosis_name: diagnostico.nome
        }));
      }
    });
  };

  return (
    <MainLayout title="Editar Paciente" navigation={navigation} showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <FormularioCadastro
          campos={camposFormularioPaciente}
          formData={formData}
          onChange={handleChange}
          onToggle={handleToggle}
          onSubmit={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={false}
          onCustomPress={{ diagnosis_name: handleOpenDiagnostico }}
        />

        <FileUploadSection
          attachments={attachments}
          isLoadingAttachments={isLoadingAttachments}
          onUpload={handleUploadFile}
          isUploading={isUploading}
        />

        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.updateButtonText}>Atualizar dados</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Planos', { patientId: formData.id })}>
          <Text style={styles.mainButtonText}>Novo plano</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('Relatorios', { patientId: formData.id })}>
          <Text style={styles.mainButtonText}>Relatórios</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
  },
  updateButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#2f6b5e',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  updateButtonText: {
    color: '#2f6b5e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: '#2f6b5e',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#2f6b5e',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default EditarPacienteScreen;
