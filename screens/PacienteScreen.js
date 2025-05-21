import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Ionicons } from '@expo/vector-icons';
import { mask as masker, unMask } from 'react-native-mask-text';

const mockPacientes = [
  { id: 1, nome: 'João Silva', idade: 35, status: 'Ativo', diagnostico: 'Ansiedade' },
  { id: 2, nome: 'Maria Oliveira', idade: 28, status: 'Inativo', diagnostico: 'Depressão' },
  { id: 3, nome: 'Carlos Souza', idade: 42, status: 'Ativo', diagnostico: 'TOC' },
  { id: 4, nome: 'Fernanda Lima', idade: 30, status: 'Ativo', diagnostico: 'Transtorno Bipolar' },
  { id: 5, nome: 'Lucas Costa', idade: 19, status: 'Ativo', diagnostico: 'Fobia Social' },
];

const PacienteScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [viewingPatients, setViewingPatients] = useState(false);
  const [managingPatients, setManagingPatients] = useState(false);
  const [formType, setFormType] = useState(''); // 'aplicador' ou 'responsavel'
  const [formData, setFormData] = useState({
    role: '',
    full_name: '',
    birth_date: '',
    gender: '',
    nationality: '',
    address: '',
    phone_number: '',
    cpf: '',
    rg: '',
    academic_background: '',
    curriculum: '',
    position: '',
    department: '',
    admission_date: '',
    work_scale: '',
    observations: '',
    user_id: ''
  });

  const handleCardPress = (action) => {
    switch (action) {
      case 'Voltar':
        navigation.navigate('Home');
        break;
      case 'Cadastrar Aplicador':
        setShowForm(true);
        setViewingPatients(false);
        setManagingPatients(false);
        setFormType('aplicador');
        setFormData({
          role: 'professional',
          full_name: '',
          birth_date: '',
          gender: '',
          nationality: '',
          address: '',
          phone_number: '',
          cpf: '',
          rg: '',
          academic_background: '',
          curriculum: '',
          position: '',
          department: '',
          admission_date: '',
          work_scale: '',
          observations: '',
          user_id: ''
        });
        break;
      case 'Cadastrar Responsavel':
        setShowForm(true);
        setViewingPatients(false);
        setManagingPatients(false);
        setFormType('responsavel');
        setFormData({
          role: 'responsible',
          full_name: '',
          birth_date: '',
          gender: '',
          nationality: '',
          address: '',
          phone_number: '',
          cpf: '',
          rg: '',
          academic_background: '',
          curriculum: '',
          position: '',
          department: '',
          admission_date: '',
          work_scale: '',
          observations: '',
          user_id: ''
        });
        break;
      case 'Ver Pacientes':
        setViewingPatients(true);
        setShowForm(false);
        setManagingPatients(false);
        break;
      case 'Gerenciar Pacientes':
        setManagingPatients(true);
        setShowForm(false);
        setViewingPatients(false);
        break;
      default:
        Alert.alert('Ação', `Fui clicado: ${action}`);
    }
  };

  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    const requiredFields = ['full_name', 'birth_date', 'phone_number', 'user_id'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    // Validação do user_id (deve ser número)
    if (isNaN(formData.user_id)) {
      Alert.alert('Atenção', 'O ID do usuário deve ser um número');
      return;
    }

    // Validação da data (formato DD/MM/AAAA)
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(formData.birth_date)) {
      Alert.alert('Atenção', 'Data de nascimento inválida. Use o formato DD/MM/AAAA');
      return;
    }

    try {
      // Preparando os dados para envio
      const dataToSend = {
        ...formData,
        birth_date: formatDateForAPI(formData.birth_date),
        phone_number: unMask(formData.phone_number),
        cpf: unMask(formData.cpf),
        admission_date: formData.admission_date ? formatDateForAPI(formData.admission_date) : '',
        user_id: parseInt(formData.user_id) // Garante que é número
      };

      // Remove campos não necessários para responsável
      if (formType === 'responsavel') {
        delete dataToSend.academic_background;
        delete dataToSend.curriculum;
        delete dataToSend.position;
        delete dataToSend.department;
        delete dataToSend.admission_date;
        delete dataToSend.work_scale;
        delete dataToSend.observations;
      }

      console.log("Dados que seriam enviados:", dataToSend);
      
      // Exemplo de requisição (comentada)
      /*
      const endpoint = formType === 'aplicador' 
        ? 'https://api.seuendpoint.com/profissionais' 
        : 'https://api.seuendpoint.com/responsaveis';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) throw new Error('Erro ao cadastrar');
      
      const data = await response.json();
      */
      
      Alert.alert('Sucesso', `${formType === 'aplicador' ? 'Aplicador' : 'Responsável'} cadastrado com sucesso!`);
      setShowForm(false);
      // Limpar formulário
      setFormData({
        role: '',
        full_name: '',
        birth_date: '',
        gender: '',
        nationality: '',
        address: '',
        phone_number: '',
        cpf: '',
        rg: '',
        academic_background: '',
        curriculum: '',
        position: '',
        department: '',
        admission_date: '',
        work_scale: '',
        observations: '',
        user_id: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      Alert.alert('Erro', `Ocorreu um erro ao cadastrar ${formType === 'aplicador' ? 'o aplicador' : 'o responsável'}`);
    }
  };

  // Função para formatar data para o padrão API (AAAA-MM-DD)
  const formatDateForAPI = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  // Função para aplicar máscaras
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

  return (
    <MainLayout 
      title="Paciente" 
      navigation={navigation}
      showBackButton={false}
    >
      <View style={styles.content}>
        {showForm ? (
          <ScrollView style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {formType === 'aplicador' ? 'Cadastrar Aplicador' : 'Cadastrar Responsável'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="ID do Usuário* (Número)"
              value={formData.user_id}
              onChangeText={(text) => handleInputChange('user_id', text)}
              keyboardType="numeric"
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

            {formType === 'aplicador' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Formação Acadêmica"
                  value={formData.academic_background}
                  onChangeText={(text) => handleInputChange('academic_background', text)}
                />
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
                  placeholder="Data de Admissão (DD/MM/AAAA)"
                  value={formData.admission_date}
                  onChangeText={(text) => handleInputChange('admission_date', text, '99/99/9999')}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Escala de Trabalho"
                  value={formData.work_scale}
                  onChangeText={(text) => handleInputChange('work_scale', text)}
                />
                <TextInput
                  style={[styles.input, { height: 100 }]}
                  placeholder="Observações"
                  value={formData.observations}
                  onChangeText={(text) => handleInputChange('observations', text)}
                  multiline
                />
              </>
            )}
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : viewingPatients ? (
          <View style={{ flex: 1 }}>
            <ScrollView>
              {mockPacientes.map((paciente) => (
                <View key={paciente.id} style={styles.patientCard}>
                  <Text style={styles.patientText}>Nome: {paciente.nome}</Text>
                  <Text style={styles.patientText}>Idade: {paciente.idade}</Text>
                  <Text style={styles.patientText}>Status: {paciente.status}</Text>
                  <Text style={styles.patientText}>Diagnóstico: {paciente.diagnostico}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setViewingPatients(false)}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : managingPatients ? (
          <View style={{ flex: 1 }}>
            <ScrollView>
              {mockPacientes.map((paciente) => (
              <View key={paciente.id} style={styles.manageCard}>
                <View style={styles.manageTextContainer}>
                  <Text style={styles.patientText}>Nome: {paciente.nome}</Text>
                  <Text style={styles.patientText}>Idade: {paciente.idade}</Text>
                  <Text style={styles.patientText}>Diagnóstico: {paciente.diagnostico}</Text>
                </View>
                <View style={styles.icons}>
                  <TouchableOpacity onPress={() => Alert.alert('Edição', 'Editar paciente')}>
                    <Ionicons name="pencil-outline" size={24} color="#2980b9" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Alert.alert('Exclusão', 'Excluir paciente')}>
                    <Ionicons name="close-circle-outline" size={24} color="#c0392b" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setManagingPatients(false)}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <View style={styles.rowContainer}>
              <SquareCard 
                iconName="person-add-outline" 
                description="Cadastrar Aplicador"
                onPress={() => handleCardPress('Cadastrar Aplicador')}
                style={styles.halfWidth}
              />
              <SquareCard 
                iconName="person-add-outline" 
                description="Cadastrar Responsável"
                onPress={() => handleCardPress('Cadastrar Responsavel')}
                style={styles.halfWidth}
              />
            </View>
            <SquareCard 
              iconName="people-outline" 
              description="Ver Pacientes"
              onPress={() => handleCardPress('Ver Pacientes')}
            />
            <SquareCard 
              iconName="settings-outline" 
              description="Gerenciar Pacientes"
              onPress={() => handleCardPress('Gerenciar Pacientes')}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfWidth: {
    width: '48%',
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
  patientCard: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  patientText: {
    fontSize: 16,
  },
  manageTextContainer: {
    flex: 1,
    paddingRight: 10,
  },  
  manageCard: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PacienteScreen;