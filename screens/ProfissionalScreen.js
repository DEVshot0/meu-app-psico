import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Ionicons } from '@expo/vector-icons';
import { mask as masker, unMask } from 'react-native-mask-text';

const mockProfissionais = [
  { id: 1, nome: 'Dra. Ana Clara', especializacao: 'Psiquiatria' },
  { id: 2, nome: 'Dr. Marcos Silva', especializacao: 'Psicologia Clínica' },
  { id: 3, nome: 'Dra. Fernanda Rocha', especializacao: 'Neurologia' },
  { id: 4, nome: 'Dr. Lucas Almeida', especializacao: 'Terapia Cognitivo-Comportamental' },
];

const ProfissionalScreen = ({ navigation }) => {
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [managing, setManaging] = useState(false);
  const [formData, setFormData] = useState({
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
    especialization: '',
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
      case 'Cadastrar':
        setShowForm(true);
        setViewing(false);
        setManaging(false);
        break;
      case 'Ver':
        setViewing(true);
        setShowForm(false);
        setManaging(false);
        break;
      case 'Gerenciar':
        setManaging(true);
        setShowForm(false);
        setViewing(false);
        break;
      default:
        setShowForm(false);
        setViewing(false);
        setManaging(false);
    }
  };

  const handleSubmit = async () => {
    // Validação dos campos obrigatórios
    const requiredFields = ['full_name', 'birth_date', 'phone_number', 'cpf', 'especialization', 'user_id'];
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

      console.log("Dados que seriam enviados:", dataToSend);
      
      // Exemplo de requisição (comentada)
      /*
      const response = await fetch('https://api.seuendpoint.com/profissionais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      if (!response.ok) throw new Error('Erro ao cadastrar profissional');
      
      const data = await response.json();
      */
      
      Alert.alert('Sucesso', 'Profissional cadastrado com sucesso!');
      setShowForm(false);
      // Limpar formulário
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
        especialization: '',
        curriculum: '',
        position: '',
        department: '',
        admission_date: '',
        work_scale: '',
        observations: '',
        user_id: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar profissional:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o profissional');
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
      title="Profissional" 
      navigation={navigation}
      showBackButton={false}
    >
      <View style={styles.content}>
        {showForm ? (
          <ScrollView style={styles.formContainer}>
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
            <TextInput
              style={styles.input}
              placeholder="Especialização*"
              value={formData.especialization}
              onChangeText={(text) => handleInputChange('especialization', text)}
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
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowForm(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : viewing ? (
          <View style={{ flex: 1 }}>
            <ScrollView>
              {mockProfissionais.map((prof) => (
                <View key={prof.id} style={styles.card}>
                  <Text style={styles.cardText}>Nome: {prof.nome}</Text>
                  <Text style={styles.cardText}>Especialização: {prof.especializacao}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setViewing(false)}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : managing ? (
          <View style={{ flex: 1 }}>
            <ScrollView>
              {mockProfissionais.map((prof) => (
                <View key={prof.id} style={styles.manageCard}>
                  <View style={styles.manageTextContainer}>
                    <Text style={styles.cardText}>Nome: {prof.nome}</Text>
                    <Text style={styles.cardText}>Especialização: {prof.especializacao}</Text>
                  </View>
                  <View style={styles.icons}>
                    <TouchableOpacity onPress={() => Alert.alert('Editar', 'Editar profissional')}>
                      <Ionicons name="pencil-outline" size={24} color="#2980b9" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert('Excluir', 'Excluir profissional')}>
                      <Ionicons name="close-circle-outline" size={24} color="#c0392b" style={{ marginLeft: 10 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setManaging(false)}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <SquareCard 
              iconName="person-add-outline" 
              description="Cadastrar"
              onPress={() => handleCardPress('Cadastrar')}
            />
            <SquareCard 
              iconName="people-outline" 
              description="Ver Profissionais"
              onPress={() => handleCardPress('Ver')}
            />
            <SquareCard 
              iconName="settings-outline" 
              description="Gerenciar"
              onPress={() => handleCardPress('Gerenciar')}
            />
            <SquareCard 
              iconName="arrow-back-outline" 
              description="Voltar"
              onPress={() => navigation.goBack()}
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
  formContainer: {
    flex: 1,
    padding: 20,
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
  card: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  manageTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfissionalScreen;