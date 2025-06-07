import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mask as masker, unMask } from 'react-native-mask-text';

const ProfissionalScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState('Profissional');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    nationality: '',
    address: '',
    phone_number: '',
    cpf: '',
    rg: '',
    academic_background: '',
    specialization: '',
    position: '',
    department: '',
    admission_date: '',
    work_schedule: '',
    observations: '',
    user_email: '',
    user_username: '',
    user_password: 'senha123'
  });

  const handleCardPress = (action) => {
    if (action === 'Cadastrar') {
      setShowForm(true);
    } else if (action === 'Voltar') {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    const requiredFields = ['full_name', 'birth_date', 'phone_number', 'cpf', 'user_email', 'user_username'];
    if (tipoCadastro === 'Profissional') {
      requiredFields.push('specialization');
    }

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    if (!csrfToken) {
      throw new Error('Token CSRF não encontrado. Faça login novamente.');
    }
    setIsLoading(true);

    try {
      const user = {
        email: formData.user_email,
        username: formData.user_username,
        password: formData.user_password,
        level: tipoCadastro === 'Profissional' ? 2 : 3
      };

      const commonData = {
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.address,
        phone_number: unMask(formData.phone_number),
        cpf: formData.cpf,
        rg: formData.rg,
        academic_background: formData.academic_background,
        position: formData.position,
        department: formData.department,
        admission_date: formData.admission_date,
        work_schedule: formData.work_schedule,
        observations: formData.observations
      };

      const payload = { user };

      if (tipoCadastro === 'Profissional') {
        payload.professional = { 
          ...commonData, 
          specialization: formData.specialization
        };
      } else {
        payload.aplicator = { ...commonData };
      }

      const endpoint = tipoCadastro === 'Profissional' 
        ? 'https://iscdeploy.pythonanywhere.com/api/v1/register/professional/' 
        : 'https://iscdeploy.pythonanywhere.com/api/v1/register/aplicator/';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao cadastrar');
      }

      Alert.alert('Sucesso', `${tipoCadastro} cadastrado com sucesso!`);
      setShowForm(false);
      setFormData({
        full_name: '',
        birth_date: '',
        gender: '',
        nationality: '',
        address: '',
        phone_number: '',
        cpf: '',
        rg: '',
        academic_background: '',
        specialization: '',
        position: '',
        department: '',
        admission_date: '',
        work_schedule: '',
        observations: '',
        user_email: '',
        user_username: '',
        user_password: 'senha123'
      });
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao cadastrar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value, mask = null) => {
    let newValue = value;

    if (mask) {
      newValue = masker(newValue, mask, {
        maskAutomatically: field === 'birth_date' || field === 'admission_date'
      });
    }

    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  if (isLoading) {
    return (
      <MainLayout title="Profissional" navigation={navigation} showBackButton={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f6b5e" />
          <Text style={styles.loadingText}>Enviando dados...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Profissional" navigation={navigation} showBackButton={false}>
      <View style={styles.content}>
        {showForm ? (
          <ScrollView style={styles.formContainer}>
            <Text style={{ fontSize: 16, marginBottom: 5, fontWeight: 'bold' }}>Tipo de Cadastro:</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 15 }}>
              <Picker
                selectedValue={tipoCadastro}
                onValueChange={(value) => setTipoCadastro(value)}
              >
                <Picker.Item label="Profissional" value="Profissional" />
                <Picker.Item label="Aplicador" value="Aplicador" />
              </Picker>
            </View>

            <Text style={styles.sectionTitle}>Dados de Acesso</Text>
            <TextInput
              style={styles.input}
              placeholder="Email do usuário*"
              value={formData.user_email}
              onChangeText={(text) => handleInputChange('user_email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Username*"
              value={formData.user_username}
              onChangeText={(text) => handleInputChange('user_username', text)}
              autoCapitalize="none"
            />

            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome completo*"
              value={formData.full_name}
              onChangeText={(text) => handleInputChange('full_name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Nascimento (AAAA-MM-DD)*"
              value={formData.birth_date}
              onChangeText={(text) => handleInputChange('birth_date', text, '9999-99-99')}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={styles.input}
              placeholder="Gênero"
              value={formData.gender}
              onChangeText={(text) => handleInputChange('gender', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Nacionalidade"
              value={formData.nationality}
              onChangeText={(text) => handleInputChange('nationality', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone* (XX) XXXXX-XXXX"
              value={formData.phone_number}
              onChangeText={(text) => handleInputChange('phone_number', text, '(99) 99999-9999')}
              keyboardType="phone-pad"
              maxLength={15}
            />
            <TextInput
              style={styles.input}
              placeholder="CPF* (XXX.XXX.XXX-XX)"
              value={formData.cpf}
              onChangeText={(text) => handleInputChange('cpf', text, '999.999.999-99')}
              keyboardType="numeric"
              maxLength={14}
            />
            <TextInput
              style={styles.input}
              placeholder="RG"
              value={formData.rg}
              onChangeText={(text) => handleInputChange('rg', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Formação Acadêmica"
              value={formData.academic_background}
              onChangeText={(text) => handleInputChange('academic_background', text)}
            />
            {tipoCadastro === 'Profissional' && (
              <TextInput
                style={styles.input}
                placeholder="Especialização*"
                value={formData.specialization}
                onChangeText={(text) => handleInputChange('specialization', text)}
              />
            )}

            <Text style={styles.sectionTitle}>Dados Profissionais</Text>
            <TextInput
              style={styles.input}
              placeholder="Cargo"
              value={formData.position}
              onChangeText={(text) => handleInputChange('position', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Departamento"
              value={formData.department}
              onChangeText={(text) => handleInputChange('department', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de Admissão (AAAA-MM-DD)"
              value={formData.admission_date}
              onChangeText={(text) => handleInputChange('admission_date', text, '9999-99-99')}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              style={styles.input}
              placeholder="Escala de Trabalho"
              value={formData.work_schedule}
              onChangeText={(text) => handleInputChange('work_schedule', text)}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Observações"
              value={formData.observations}
              onChangeText={(text) => handleInputChange('observations', text)}
              multiline
            />

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Enviando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowForm(false)}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.gridContainer}>
            <SquareCard
              iconName="person-add-outline"
              description="Cadastrar"
              onPress={() => handleCardPress('Cadastrar')}
            />
            <SquareCard
              iconName="people-outline"
              description="Gerenciar Profissionais"
              onPress={() => navigation.navigate('GerenciarProfissionais')}
            />
            <SquareCard
              iconName="arrow-back-outline"
              description="Voltar"
              onPress={() => handleCardPress('Voltar')}
            />
          </View>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2f6b5e',
  },
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2f6b5e',
  },
});

export default ProfissionalScreen;