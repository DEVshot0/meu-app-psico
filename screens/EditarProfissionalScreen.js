import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import MainLayout from '../components/MainLayout';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const EditarProfissionalScreen = ({ navigation, route }) => {
  const [professional, setProfessional] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log('ROUTE.PARAMS:', route.params);

    const fetchProfessional = async () => {
      try {
        if (!route.params?.userId) {
          console.error('userId não fornecido.');
          Alert.alert('Erro', 'userId não foi passado.');
          return;
        }

        const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/professional/?user_id=${route.params.userId}`);
        console.log('Response status:', response.status);

        const dataList = await response.json();
        console.log('Data retornado:', dataList);

        if (Array.isArray(dataList) && dataList.length > 0) {
          setProfessional(dataList[0]);
        } else {
          Alert.alert('Erro', 'Nenhum profissional encontrado para este userId.');
        }
      } catch (error) {
        console.error('Erro ao buscar profissional:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do profissional.');
      }
    };

    fetchProfessional();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        full_name: professional.full_name,
        birth_date: professional.birth_date,
        gender: professional.gender,
        nationality: professional.nationality,
        addres: professional.addres,
        phone_number: professional.phone_number,
        cpf: professional.cpf,
        rg: professional.rg,
        academic_backgorund: professional.academic_backgorund,
        especialization: professional.especialization,
        position: professional.position,
        department: professional.department,
        admission_date: professional.admission_date,
        work_scale: professional.work_scale,
        observations: professional.observations,
        user_id: professional.user_id
      };

      console.log('Payload enviado no PUT:', JSON.stringify(payload, null, 2));

      const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/professional/${professional.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados do profissional atualizados com sucesso!');
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar profissional:', response.status, errorData);
        Alert.alert('Erro', 'Não foi possível atualizar os dados do profissional.');
      }
    } catch (error) {
      console.error('Erro ao atualizar profissional:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar os dados.');
    }
  };

  const handleApplyPlan = () => {
    const jsonParcial = {
      patient_name: "",
      plan_name: "",
      aplication_date: new Date().toISOString().slice(0, 10),
      aplicator_name: professional.full_name,
      behaviors: []
    };

    console.log('JSON PARCIAL ATÉ O MOMENTO:', JSON.stringify(jsonParcial, null, 2));

    navigation.navigate('AplicarPlano', { jsonParcial });
  };

  const handleUploadFile = async () => {
    try {
      console.log('Clique no botão Adicionar Arquivo');
  
      const csrfToken = route.params?.csrfToken;
      console.log('CSRF Token recebido da rota:', csrfToken);
  
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
  
      console.log('Resultado da seleção de arquivo:', result);
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Arquivo selecionado com sucesso, iniciando upload...');
        setIsUploading(true);
  
        const file = result.assets[0];
  
        const formData = new FormData();
        formData.append('user_id', professional.user_id);
        formData.append('attachments', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });
  
        console.log('Iniciando fetch para upload com headers:');
        console.log({
          'Content-Type': 'multipart/form-data',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        });
  
        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/upload-files/', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'X-CSRFToken': csrfToken,
          },
        });
  
        console.log('UPLOAD STATUS:', response.status);
  
        const responseText = await response.text();
        console.log('Upload response:', responseText);
  
        if (response.ok) {
          Alert.alert('Sucesso', 'Arquivo enviado com sucesso!');
        } else {
          console.error('Erro ao enviar arquivo:', response.status, responseText);
          Alert.alert('Erro', `Não foi possível enviar o arquivo. Código: ${response.status}`);
        }
      } else {
        console.log('Usuário cancelou seleção do arquivo ou nenhum arquivo selecionado.');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar enviar o arquivo.');
    } finally {
      setIsUploading(false);
    }
  };
  
  
  
  
  
  

  return (
    <MainLayout 
      title="Editar Profissional" 
      navigation={navigation} 
      showBackButton={true}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={professional.full_name || ''}
                onChangeText={(text) => setProfessional({ ...professional, full_name: text })}
                placeholder="Nome do Profissional"
              />
              <TextInput
                style={styles.input}
                value={professional.birth_date || ''}
                onChangeText={(text) => setProfessional({ ...professional, birth_date: text })}
                placeholder="Data de Nascimento (AAAA-MM-DD)"
              />
              <TextInput
                style={styles.input}
                value={professional.gender || ''}
                onChangeText={(text) => setProfessional({ ...professional, gender: text })}
                placeholder="Gênero"
              />
              <TextInput
                style={styles.input}
                value={professional.cpf || ''}
                onChangeText={(text) => setProfessional({ ...professional, cpf: text })}
                placeholder="CPF"
              />
              <TextInput
                style={styles.input}
                value={professional.phone_number || ''}
                onChangeText={(text) => setProfessional({ ...professional, phone_number: text })}
                placeholder="Telefone"
              />
              <TextInput
                style={styles.input}
                value={professional.position || ''}
                onChangeText={(text) => setProfessional({ ...professional, position: text })}
                placeholder="Cargo"
              />
              <TextInput
                style={styles.input}
                value={professional.department || ''}
                onChangeText={(text) => setProfessional({ ...professional, department: text })}
                placeholder="Departamento"
              />
              <TextInput
                style={styles.input}
                value={professional.observations || ''}
                onChangeText={(text) => setProfessional({ ...professional, observations: text })}
                placeholder="Observações"
                multiline
              />
            </>
          ) : (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Nome:</Text> {professional.full_name}</Text>
              <Text style={styles.label}><Text style={styles.bold}>CPF:</Text> {professional.cpf}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Telefone:</Text> {professional.phone_number}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Cargo:</Text> {professional.position}</Text>
            </>
          )}
        </View>

        {isEditing ? (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.updateButtonText}>Atualizar dados</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={handleApplyPlan}
        >
          <Text style={styles.mainButtonText}>Aplicar Plano</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={handleUploadFile}
          disabled={isUploading}
        >
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Enviando...' : 'Adicionar Arquivo'}
          </Text>
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
  input: {
    height: 45,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2f6b5e',
    backgroundColor: 'white',
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
  },
  uploadButton: {
    backgroundColor: '#4a7c72',
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
