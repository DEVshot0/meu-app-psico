import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { mask as masker } from 'react-native-mask-text';
import { apiService } from '../src/services/apiService';
import FormularioCadastro from '../components/FormularioCadastro';
import DiagnosticoModal from '../components/DiagnosticoModal';
import { pacienteModel } from '../models/PacienteModel';

const camposFormularioPaciente = [
  { tipo: 'titulo', label: 'Responsável' },
  { nome: 'email', placeholder: 'Email*' },
  { nome: 'username', placeholder: 'Usuário*' },
  { nome: 'password', placeholder: 'Senha*', tipo: 'password' },
  { nome: 'full_name', placeholder: 'Nome Completo*' },
  { nome: 'birth_date', placeholder: 'Data de Nascimento*', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'gender', placeholder: 'Gênero' },
  { nome: 'nationality', placeholder: 'Nacionalidade' },
  { nome: 'address', placeholder: 'Endereço' },
  { nome: 'phone_number', placeholder: 'Telefone*', teclado: 'phone-pad', mascara: '(99) 99999-9999', maxLength: 15 },
  { nome: 'cpf', placeholder: 'CPF', teclado: 'numeric', mascara: '999.999.999-99', maxLength: 14 },
  { nome: 'rg', placeholder: 'RG' },

  { tipo: 'titulo', label: 'Paciente' },
  { nome: 'patient_name', placeholder: 'Nome do Paciente*' },
  { nome: 'diagnosis_name', tipo: 'customButton', placeholder: 'Selecione o Diagnóstico*' },
  { nome: 'patient_birth_date', placeholder: 'Nascimento do Paciente*', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'patient_gender', placeholder: 'Gênero' },
  { nome: 'patient_nationality', placeholder: 'Nacionalidade' },
  { nome: 'patient_cpf', placeholder: 'CPF', teclado: 'numeric', mascara: '999.999.999-99', maxLength: 14 },
  { nome: 'patient_rg', placeholder: 'RG' },
  { nome: 'agreement_card', placeholder: 'Convênio' },
  { nome: 'sus_card', placeholder: 'Cartão SUS' },
  { nome: 'medical_history', placeholder: 'Histórico Médico' },
  { nome: 'allergies', placeholder: 'Alergias' },
  { nome: 'medication_in_use', placeholder: 'Medicamentos em uso' },
  { nome: 'familiar_history', placeholder: 'Histórico Familiar' },
  { nome: 'first_consultation', placeholder: 'Primeira Consulta', teclado: 'numeric', mascara: '99/99/9999', maxLength: 10 },
  { nome: 'observations', placeholder: 'Observações' },

  { tipo: 'titulo', label: 'Consentimentos' },
  { nome: 'consent_form', tipo: 'checkbox', label: 'Termo de Consentimento' },
  { nome: 'authorization_to_share_data', tipo: 'checkbox', label: 'Autorização para Compartilhar Dados' }
];

const PacienteScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [formData, setFormData] = useState({ ...pacienteModel });

  const handleInputChange = (field, value, mask = null) => {
    let newValue = value;
    if (mask) {
      newValue = masker(value, mask, {
        maskAutomatically: field.includes('birth_date') || field.includes('consultation')
      });
    }
    setFormData(prev => ({ ...prev, [field]: newValue }));
  };

  const toggleCheckbox = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const formatDateForAPI = (date) => {
    if (!date) return '';
    const [d, m, y] = date.split('/');
    return `${y}-${m}-${d}`;
  };

  const handleCardPress = (action) => {
    switch (action) {
      case 'Voltar':
        navigation.navigate('Home');
        break;
      case 'Historico':
        navigation.navigate('Historico');
        break;
      case 'Cadastrar Paciente':
        setFormData({ ...pacienteModel });
        fetchDiagnoses();
        setShowForm(true);
        break;
    }
  };

  const fetchDiagnoses = async () => {
    try {
      const data = await apiService('GET', null, 'api/v1/diagnosis/');
      setDiagnoses(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os diagnósticos');
    }
  };

  const handleSelectDiagnosis = (item) => {
    setFormData(prev => ({
      ...prev,
      diagnosis_id: item.id,
      diagnosis_name: item.diagnosis || `Diagnóstico ${item.id}`
    }));
    setShowDiagnosisModal(false);
  };

  const handleSubmit = async () => {
    const required = [
      'email', 'username', 'password', 'full_name',
      'birth_date', 'phone_number',
      'patient_name', 'diagnosis_id', 'patient_birth_date'
    ];
    const missing = required.filter(f => !formData[f]);
    if (missing.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    setIsLoading(true);

    const body = {
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
        phone_number: formData.phone_number.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        rg: formData.rg
      },
      patient: {
        patient_name: formData.patient_name,
        diagnosis_id: parseInt(formData.diagnosis_id),
        birth_date: formatDateForAPI(formData.patient_birth_date),
        gender: formData.patient_gender,
        nationality: formData.patient_nationality,
        cpf: formData.patient_cpf.replace(/\D/g, ''),
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

    try {
      const response = await apiService('POST', body, 'api/v1/register/responsible-patient/');
      Alert.alert('Sucesso', 'Paciente cadastrado!');
      navigation.navigate('EditarPaciente', { userId: response['user id'] });
      setFormData({ ...pacienteModel });
      setShowForm(false);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Erro ao cadastrar paciente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout title="Paciente" navigation={navigation} showBackButton={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        {showForm ? (
          <ScrollView contentContainerStyle={{ padding: 15 }}>
            <FormularioCadastro
              campos={camposFormularioPaciente}
              formData={formData}
              onChange={handleInputChange}
              onToggle={toggleCheckbox}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isLoading}
              onCustomPress={{ diagnosis_name: () => setShowDiagnosisModal(true) }}
            />
          </ScrollView>
        ) : (
          <View style={styles.gridContainer}>
            <SquareCard iconName="person-add-outline" description="Cadastrar Paciente" onPress={() => handleCardPress('Cadastrar Paciente')} />
            <SquareCard iconName="arrow-back-outline" description="Voltar" onPress={() => handleCardPress('Voltar')} />
            <SquareCard iconName="time-outline" description="Histórico" onPress={() => handleCardPress('Historico')} />
          </View>
        )}

        <DiagnosticoModal
          visible={showDiagnosisModal}
          diagnoses={diagnoses}
          onSelect={handleSelectDiagnosis}
          onClose={() => setShowDiagnosisModal(false)}
        />
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05
  }
});

export default PacienteScreen;
