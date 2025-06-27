import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MainLayout from '../components/MainLayout';
import * as DocumentPicker from 'expo-document-picker';
import { criarProfissionalVazio } from '../models/profissionalModel';
import { apiService } from '../src/services/apiService';
import FileUploadSection from '../components/FileUploadSection';
import FormularioCadastro from '../components/FormularioCadastro';
import { mask } from 'react-native-mask-text';

const camposFormularioProfissional = [
  { tipo: 'titulo', label: 'Usuário' },
  { nome: 'email', placeholder: 'Email*' },
  { nome: 'username', placeholder: 'Username*' },
  { nome: 'password', placeholder: 'Senha*', tipo: 'password' },
  { tipo: 'titulo', label: 'Profissional' },
  { nome: 'full_name', placeholder: 'Nome Completo*' },
  { nome: 'birth_date', placeholder: 'Data de Nascimento', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'gender', placeholder: 'Gênero' },
  { nome: 'nationality', placeholder: 'Nacionalidade' },
  { nome: 'address', placeholder: 'Endereço' },
  { nome: 'phone_number', placeholder: 'Telefone', teclado: 'phone-pad', mascara: '(99) 99999-9999', maxLength: 15 },
  { nome: 'cpf', placeholder: 'CPF', teclado: 'numeric', mascara: '999.999.999-99', maxLength: 14 },
  { nome: 'rg', placeholder: 'RG' },
  { nome: 'academic_background', placeholder: 'Formação Acadêmica' },
  { nome: 'especialization', placeholder: 'Especialização' },
  { nome: 'position', placeholder: 'Cargo' },
  { nome: 'department', placeholder: 'Departamento' },
  { nome: 'admission_date', placeholder: 'Data de Admissão', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'work_scale', placeholder: 'Escala de Trabalho' },
  { nome: 'observations', placeholder: 'Observações' }
];

const EditarProfissionalScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    ...criarProfissionalVazio(),
    email: '',
    username: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(false);

  const userId = route.params?.userId;
  const csrfToken = route.params?.csrfToken;

  useEffect(() => {
    if (!userId) return Alert.alert('Erro', 'userId não foi passado.');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiService('GET', null, `api/v1/professional/?user_id=${userId}`);
      if (Array.isArray(data) && data.length > 0) {
        const prof = data[0];
        setFormData(prev => ({
          ...prev,
          ...prof,
          email: prof.user?.email || '',
          username: prof.user?.username || ''
        }));
        await fetchAttachments(prof.user_id);
      } else {
        Alert.alert('Erro', 'Nenhum profissional encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados do profissional.');
    }
  };

  const fetchAttachments = async (userId) => {
    setIsLoadingAttachments(true);
    try {
      const data = await apiService('POST', { user_id: userId }, 'api/v1/files-by-user/', csrfToken);
      setAttachments(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar anexos.');
    } finally {
      setIsLoadingAttachments(false);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = `api/v1/professional/${formData.id}/`;
      await apiService('PUT', formData, endpoint, csrfToken);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Profissional atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar profissional.');
    }
  };

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets?.length > 0) {
        setIsUploading(true);
        const file = result.assets[0];

        const formDataUpload = new FormData();
        formDataUpload.append('user_id', formData.user_id);
        formDataUpload.append('attachments', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });

        await fetch('https://iscdeploy.pythonanywhere.com/api/v1/upload-files/', {
          method: 'POST',
          body: formDataUpload,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'X-CSRFToken': csrfToken,
          },
        });

        Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
        await fetchAttachments(formData.user_id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (campo, valor, mascara = null) => {
    setFormData(prev => ({
      ...prev,
      [campo]: mascara ? mask(valor, mascara) : valor
    }));
  };

  const handleToggle = (campo) => {
    setFormData(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  return (
    <MainLayout title="Editar Profissional" navigation={navigation} showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        {isEditing ? (
          <FormularioCadastro
            campos={camposFormularioProfissional}
            formData={formData}
            onChange={handleChange}
            onToggle={handleToggle}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
            isLoading={false}
            placeholderTextColor="#A9A9A9"
          />
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.label}><Text style={styles.bold}>Nome:</Text> {formData.full_name}</Text>
            <Text style={styles.label}><Text style={styles.bold}>CPF:</Text> {formData.cpf}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Telefone:</Text> {formData.phone_number}</Text>
            <Text style={styles.label}><Text style={styles.bold}>Cargo:</Text> {formData.position}</Text>
            <FileUploadSection
              attachments={attachments}
              isLoadingAttachments={isLoadingAttachments}
            />
          </View>
        )}

        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.updateButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.updateButtonText}>Atualizar dados</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFile} disabled={isUploading}>
          <Text style={styles.uploadButtonText}>{isUploading ? 'Enviando...' : 'Adicionar Arquivo'}</Text>
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
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2f6b5e',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
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
  uploadButton: {
    backgroundColor: '#2f6b5e',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditarProfissionalScreen;
