import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MainLayout from '../components/MainLayout';
import FormularioCadastro from '../components/FormularioCadastro';
import { criarAplicadorVazio } from '../models/aplicatorModel';
import { apiService } from '../src/services/apiService';
import * as DocumentPicker from 'expo-document-picker';

const EditarAplicadorScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    ...criarAplicadorVazio(),
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
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = route.params?.userId;
  const csrfToken = route.params?.csrfToken;

  useEffect(() => {
    if (!userId) {
      Alert.alert('Erro', 'userId não foi passado.');
      return;
    }
    carregarAplicador();
  }, []);

  const carregarAplicador = async () => {
    try {
      const data = await apiService.get(`/aplicator/?user_id=${userId}`);
      if (Array.isArray(data) && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          ...data[0],
          email: data[0].user?.email || '',
          username: data[0].user?.username || '',
          patient_name: data[0].patient_name || '',
          patient_birth_date: data[0].patient_birth_date || '',
          diagnosis_id: data[0].diagnosis_id || null,
          diagnosis_name: data[0].diagnosis_name || '',
          consent_form: data[0].consent_form || false
        }));
        carregarAnexos();
      } else {
        Alert.alert('Erro', 'Nenhum aplicador encontrado.');
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro ao buscar dados do aplicador.');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarAnexos = async () => {
    try {
      setIsLoadingAttachments(true);
      const data = await apiService.post('/files-by-user/', { user_id: userId }, csrfToken);
      setAttachments(data);
    } catch (e) {
      Alert.alert('Erro', 'Erro ao carregar anexos.');
    } finally {
      setIsLoadingAttachments(false);
    }
  };

  const handleInputChange = (key, value, mask = null) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        role: 'aplicator',
        phone_number: formData.phone_number.replace(/\D/g, '')
      };
      await apiService.put(`/aplicator/${formData.id}/`, payload, csrfToken);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Aplicador atualizado!');
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Erro ao salvar aplicador.');
    }
  };

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets?.length) {
        setIsUploading(true);
        const file = result.assets[0];
        const formDataUpload = new FormData();
        formDataUpload.append('user_id', formData.user_id);
        formDataUpload.append('attachments', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });
        await apiService.upload('/upload-files/', formDataUpload, csrfToken);
        Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
        carregarAnexos();
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro ao enviar arquivo.');
    } finally {
      setIsUploading(false);
    }
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

  const handleApplyPlan = () => {
    navigation.navigate('AplicarPlano', {
      jsonParcial: {
        patient_name: formData.patient_name,
        plan_name: '',
        aplication_date: new Date().toISOString().slice(0, 10),
        aplicator_name: formData.full_name,
        behaviors: [],
      },
    });
  };

  return (
    <MainLayout title="Editar Aplicador" navigation={navigation} showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <ActivityIndicator color="#2f6b5e" size="large" />
        ) : (
          <>
            <FormularioCadastro
              formData={formData}
              onChange={handleInputChange}
              onToggle={handleToggle}
              onSubmit={handleSubmit}
              onCancel={() => setIsEditing(false)}
              isLoading={false}
              handleOpenDiagnostico={handleOpenDiagnostico}
            />

            {isEditing ? (
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>Salvar alterações</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.updateButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.updateButtonText}>Atualizar dados</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.mainButton} onPress={handleApplyPlan}>
              <Text style={styles.mainButtonText}>Aplicar Plano</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFile} disabled={isUploading}>
              <Text style={styles.uploadButtonText}>
                {isUploading ? 'Enviando...' : 'Adicionar Arquivo'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.attachmentsTitle}>Anexos:</Text>
            {isLoadingAttachments ? (
              <ActivityIndicator color="#2f6b5e" />
            ) : attachments.length > 0 ? (
              attachments.map((a, i) => (
                <Text key={i} style={styles.attachmentItem}>{a.attachments.split('/').pop()}</Text>
              ))
            ) : (
              <Text style={styles.label}>Nenhum anexo encontrado.</Text>
            )}
          </>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  saveButton: {
    backgroundColor: '#2f6b5e', borderRadius: 25, padding: 10, alignItems: 'center', marginBottom: 10,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  updateButton: {
    borderWidth: 2, borderColor: '#2f6b5e', borderRadius: 25, padding: 10, alignItems: 'center', marginBottom: 10,
  },
  updateButtonText: { color: '#2f6b5e', fontSize: 16, fontWeight: 'bold' },
  mainButton: {
    backgroundColor: '#2f6b5e', borderRadius: 25, padding: 15, alignItems: 'center', marginBottom: 15,
  },
  mainButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  uploadButton: {
    backgroundColor: '#4a7c72', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 15,
  },
  uploadButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  attachmentsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  attachmentItem: { fontSize: 14, marginVertical: 4, color: '#2f6b5e' },
  label: { color: '#999', fontStyle: 'italic' },
});

export default EditarAplicadorScreen;
