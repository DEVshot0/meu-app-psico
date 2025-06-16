import React, { useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import FormularioCadastro from '../components/FormularioCadastro';
import { criarProfissionalVazio } from '../models/profissionalModel';
import { apiService } from '../src/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mask as masker, unMask } from 'react-native-mask-text';

const ProfissionalScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...criarProfissionalVazio(),
    email: '',
    username: '',
    password: '',
    patient_name: '',
    diagnosis_id: null,
    diagnosis_name: '',
    patient_birth_date: '',
    consent_form: false
  });

  const handleInputChange = (field, value, mask = null) => {
    let newValue = value;
    if (mask) {
      newValue = masker(newValue, mask, {
        maskAutomatically: field.includes('date'),
      });
    }
    setFormData({ ...formData, [field]: newValue });
  };

  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['email', 'username', 'password', 'full_name', 'birth_date', 'phone_number', 'patient_name', 'diagnosis_id', 'patient_birth_date'];

    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    if (missingFields.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    setIsLoading(true);
    try {
      const user = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        level: 2,
      };

      const professional = {
        full_name: formData.full_name,
        birth_date: formData.birth_date,
        gender: formData.gender,
        nationality: formData.nationality,
        address: formData.addres,
        phone_number: unMask(formData.phone_number),
        cpf: formData.cpf,
        rg: formData.rg,
        academic_background: formData.academic_backgorund,
        specialization: formData.especialization,
        position: formData.position,
        department: formData.department,
        admission_date: formData.admission_date,
        work_schedule: formData.work_scale,
        observations: formData.observations,
        patient_name: formData.patient_name,
        patient_birth_date: formData.patient_birth_date,
        diagnosis_id: formData.diagnosis_id,
        consent_form: formData.consent_form
      };

      const payload = { user, professional };
      const response = await apiService('POST', payload, 'api/v1/register/professional/');

      Alert.alert('Sucesso', 'Profissional cadastrado com sucesso!');
      const userId = response['user id'];
      navigation.navigate('EditarProfissional', { userId });

      setShowForm(false);
      setFormData({ ...criarProfissionalVazio(), email: '', username: '', password: '' });
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    } finally {
      setIsLoading(false);
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

  return (
    <MainLayout title="Profissional" navigation={navigation} showBackButton={false}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2f6b5e" />
        </View>
      ) : showForm ? (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          <FormularioCadastro
            formData={formData}
            onChange={handleInputChange}
            onToggle={handleToggle}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
            handleOpenDiagnostico={handleOpenDiagnostico}
          />
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 }}>
          <SquareCard
            iconName="person-add-outline"
            description="Cadastrar"
            onPress={() => setShowForm(true)}
          />
          <SquareCard
            iconName="people-outline"
            description="Gerenciar Profissionais"
            onPress={() => navigation.navigate('GerenciarProfissionais')}
          />
          <SquareCard
            iconName="arrow-back-outline"
            description="Voltar"
            onPress={() => navigation.goBack()}
          />
        </View>
      )}
    </MainLayout>
  );
};

export default ProfissionalScreen;
