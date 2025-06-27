import React, { useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import FormularioCadastro from '../components/FormularioCadastro';
import { criarProfissionalVazio } from '../models/profissionalModel';
import { apiService } from '../src/services/apiService';
import { mask as masker, unMask } from 'react-native-mask-text';

const camposFormularioProfissional = [
  { tipo: 'titulo', label: 'Dados do Usuário' },
  { nome: 'email', placeholder: 'Email*' },
  { nome: 'username', placeholder: 'Usuário*' },
  { nome: 'password', placeholder: 'Senha*', tipo: 'password' },

  { tipo: 'titulo', label: 'Dados do Profissional' },
  { nome: 'full_name', placeholder: 'Nome Completo*' },
  { nome: 'birth_date', placeholder: 'Data de Nascimento*', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'gender', placeholder: 'Gênero' },
  { nome: 'nationality', placeholder: 'Nacionalidade' },
  { nome: 'addres', placeholder: 'Endereço' },
  { nome: 'phone_number', placeholder: 'Telefone*', teclado: 'phone-pad', mascara: '(99) 99999-9999', maxLength: 15 },
  { nome: 'cpf', placeholder: 'CPF', teclado: 'numeric', mascara: '999.999.999-99', maxLength: 14 },
  { nome: 'rg', placeholder: 'RG' },
  { nome: 'academic_backgorund', placeholder: 'Formação Acadêmica' },
  { nome: 'especialization', placeholder: 'Especialização' },
  { nome: 'position', placeholder: 'Cargo' },
  { nome: 'department', placeholder: 'Departamento' },
  { nome: 'admission_date', placeholder: 'Data de Admissão', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'work_scale', placeholder: 'Escala de Trabalho' },
  { nome: 'observations', placeholder: 'Observações' },

  { tipo: 'titulo', label: 'Informações de Aplicação' },
  { nome: 'patient_name', placeholder: 'Nome do Paciente*' },
  { nome: 'diagnosis_name', tipo: 'customButton', placeholder: 'Diagnóstico*' },
  { nome: 'patient_birth_date', placeholder: 'Nascimento do Paciente*', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'consent_form', tipo: 'checkbox', label: 'Termo de Consentimento' }
];

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
    const newValue = mask ? masker(value, mask, { maskAutomatically: true }) : value;
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['email', 'username', 'password', 'full_name', 'birth_date', 'phone_number', 'patient_name', 'diagnosis_id', 'patient_birth_date'];
    const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());

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
        cpf: unMask(formData.cpf),
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

      navigation.navigate('EditarProfissional', { userId: response['user id'] });
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
        setFormData(prev => ({
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
            campos={camposFormularioProfissional}
            placeholderTextColor="#A9A9A9"
            formData={formData}
            onChange={handleInputChange}
            onToggle={handleToggle}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
            onCustomPress={{ diagnosis_name: handleOpenDiagnostico }}
          />
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 15 }}>
          <SquareCard iconName="person-add-outline" description="Cadastrar" onPress={() => setShowForm(true)} />
          <SquareCard iconName="people-outline" description="Gerenciar Profissionais" onPress={() => navigation.navigate('GerenciarProfissionais')} />
          <SquareCard iconName="arrow-back-outline" description="Voltar" onPress={() => navigation.goBack()} />
        </View>
      )}
    </MainLayout>
  );
};

export default ProfissionalScreen;
