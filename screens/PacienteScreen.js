import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Ionicons } from '@expo/vector-icons';
import { mask as masker, unMask } from 'react-native-mask-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PacienteScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    birth_date: '',
    gender: '',
    nationality: '',
    address: '',
    phone_number: '',
    cpf: '',
    rg: '',
    patient_name: '',
    diagnosis_id: '',
    diagnosis_name: '',
    patient_birth_date: '',
    patient_gender: '',
    patient_nationality: '',
    patient_cpf: '',
    patient_rg: '',
    agreement_card: '',
    sus_card: '',
    medical_history: '',
    allergies: '',
    medication_in_use: '',
    familiar_history: '',
    first_consultation: '',
    observations: '',
    consent_form: false,
    authorization_to_share_data: false
  });
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const getCsrfToken = async () => {
      const token = await AsyncStorage.getItem('csrfToken');
      setCsrfToken(token);
    };
    getCsrfToken();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/diagnosis/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao obter diagnósticos');
      }

      const data = await response.json();
      setDiagnoses(data);
    } catch (error) {
      console.error('Erro ao buscar diagnósticos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os diagnósticos');
    }
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
        setShowForm(true);
        fetchDiagnoses();
        setFormData({
          email: '',
          username: '',
          password: '',
          full_name: '',
          birth_date: '',
          gender: '',
          nationality: '',
          address: '',
          phone_number: '',
          cpf: '',
          rg: '',
          patient_name: '',
          diagnosis_id: '',
          diagnosis_name: '',
          patient_birth_date: '',
          patient_gender: '',
          patient_nationality: '',
          patient_cpf: '',
          patient_rg: '',
          agreement_card: '',
          sus_card: '',
          medical_history: '',
          allergies: '',
          medication_in_use: '',
          familiar_history: '',
          first_consultation: '',
          observations: '',
          consent_form: false,
          authorization_to_share_data: false
        });
        break;
      default:
        Alert.alert('Ação', `Fui clicado: ${action}`);
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'email', 'username', 'password', 
      'full_name', 'birth_date', 'phone_number',
      'patient_name', 'diagnosis_id', 'patient_birth_date'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    if (!csrfToken) {
      Alert.alert('Erro', 'Token CSRF não encontrado');
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

      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/register/responsible-patient/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
        setShowForm(false);
        setFormData({
          email: '',
          username: '',
          password: '',
          full_name: '',
          birth_date: '',
          gender: '',
          nationality: '',
          address: '',
          phone_number: '',
          cpf: '',
          rg: '',
          patient_name: '',
          diagnosis_id: '',
          diagnosis_name: '',
          patient_birth_date: '',
          patient_gender: '',
          patient_nationality: '',
          patient_cpf: '',
          patient_rg: '',
          agreement_card: '',
          sus_card: '',
          medical_history: '',
          allergies: '',
          medication_in_use: '',
          familiar_history: '',
          first_consultation: '',
          observations: '',
          consent_form: false,
          authorization_to_share_data: false
        });
      } else {
        const errorMsg = data.detail || 'Erro ao cadastrar paciente';
        Alert.alert('Erro', errorMsg);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o paciente');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForAPI = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (field, value, mask = null) => {
    let newValue = value;
    if (mask) {
      newValue = masker(newValue, mask, {
        maskAutomatically: field.includes('birth_date') || field.includes('consultation')
      });
    }

    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const toggleCheckbox = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field]
    });
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
      style={styles.diagnosisItem}
      onPress={() => handleSelectDiagnosis(item)}
    >
      <Text style={styles.diagnosisText}>
        {item.diagnosis || `Diagnóstico ${item.id}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <MainLayout title="Paciente" navigation={navigation} showBackButton={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.content}>
          {showForm ? (
            <ScrollView 
              style={styles.formContainer}
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.formTitle}>Cadastrar Paciente e Responsável</Text>

              {/* Seção do Responsável */}
              <Text style={styles.sectionTitle}>Dados do Responsável</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Email*"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Username*"
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password*"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Nome completo*"
                value={formData.full_name}
                onChangeText={(text) => handleInputChange('full_name', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/AAAA)*"
                value={formData.birth_date}
                onChangeText={(text) => handleInputChange('birth_date', text, '99/99/9999')}
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
                placeholder="CPF (XXX.XXX.XXX-XX)"
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

              {/* Seção do Paciente */}
              <Text style={styles.sectionTitle}>Dados do Paciente</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nome do Paciente*"
                value={formData.patient_name}
                onChangeText={(text) => handleInputChange('patient_name', text)}
              />
              
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDiagnosisModal(true)}
              >
                <Text style={formData.diagnosis_name ? styles.inputText : styles.placeholderText}>
                  {formData.diagnosis_name || 'Selecione o Diagnóstico*'}
                </Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/AAAA)*"
                value={formData.patient_birth_date}
                onChangeText={(text) => handleInputChange('patient_birth_date', text, '99/99/9999')}
                keyboardType="numeric"
                maxLength={10}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Gênero do Paciente"
                value={formData.patient_gender}
                onChangeText={(text) => handleInputChange('patient_gender', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Nacionalidade do Paciente"
                value={formData.patient_nationality}
                onChangeText={(text) => handleInputChange('patient_nationality', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="CPF do Paciente (XXX.XXX.XXX-XX)"
                value={formData.patient_cpf}
                onChangeText={(text) => handleInputChange('patient_cpf', text, '999.999.999-99')}
                keyboardType="numeric"
                maxLength={14}
              />
              
              <TextInput
                style={styles.input}
                placeholder="RG do Paciente"
                value={formData.patient_rg}
                onChangeText={(text) => handleInputChange('patient_rg', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Carteira do Convênio"
                value={formData.agreement_card}
                onChangeText={(text) => handleInputChange('agreement_card', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Cartão SUS"
                value={formData.sus_card}
                onChangeText={(text) => handleInputChange('sus_card', text)}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Histórico Médico"
                value={formData.medical_history}
                onChangeText={(text) => handleInputChange('medical_history', text)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Alergias"
                value={formData.allergies}
                onChangeText={(text) => handleInputChange('allergies', text)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Medicação em Uso"
                value={formData.medication_in_use}
                onChangeText={(text) => handleInputChange('medication_in_use', text)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Histórico Familiar"
                value={formData.familiar_history}
                onChangeText={(text) => handleInputChange('familiar_history', text)}
                multiline
              />
              
              <TextInput
                style={styles.input}
                placeholder="Primeira Consulta (DD/MM/AAAA)"
                value={formData.first_consultation}
                onChangeText={(text) => handleInputChange('first_consultation', text, '99/99/9999')}
                keyboardType="numeric"
                maxLength={10}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Observações"
                value={formData.observations}
                onChangeText={(text) => handleInputChange('observations', text)}
                multiline
              />
              
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={[styles.checkbox, formData.consent_form && styles.checkboxChecked]}
                  onPress={() => toggleCheckbox('consent_form')}
                >
                  {formData.consent_form && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Termo de Consentimento</Text>
              </View>
              
              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={[styles.checkbox, formData.authorization_to_share_data && styles.checkboxChecked]}
                  onPress={() => toggleCheckbox('authorization_to_share_data')}
                >
                  {formData.authorization_to_share_data && <Ionicons name="checkmark" size={20} color="white" />}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Autorização para Compartilhar Dados</Text>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Cadastrar</Text>
                )}
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
                description="Cadastrar Paciente"
                onPress={() => handleCardPress('Cadastrar Paciente')}
              />
              <SquareCard 
                iconName="arrow-back-outline" 
                description="Voltar"
                onPress={() => handleCardPress('Voltar')}
              />
              <SquareCard 
                iconName="time-outline" 
                description="Histórico"
                onPress={() => handleCardPress('Historico')}
              />
            </View>
          )}

          {/* Modal de seleção de diagnóstico */}
          <Modal
            visible={showDiagnosisModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowDiagnosisModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione o Diagnóstico</Text>
                <FlatList
                  data={diagnoses}
                  renderItem={renderDiagnosisItem}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.diagnosisList}
                />
                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowDiagnosisModal(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f6b5e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#2f6b5e',
    borderBottomWidth: 1,
    borderBottomColor: '#2f6b5e',
    paddingBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: 'black',
  },
  placeholderText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
  },
  submitButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#2f6b5e',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2f6b5e',
  },
  diagnosisList: {
    marginBottom: 15,
  },
  diagnosisItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  diagnosisText: {
    fontSize: 16,
  },
  modalCloseButton: {
    backgroundColor: '#2f6b5e',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PacienteScreen;