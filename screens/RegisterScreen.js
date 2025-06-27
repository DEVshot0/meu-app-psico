import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiService } from '../src/services/apiService';

const RegisterScreen = ({ navigation }) => {
  // Dados básicos do usuário
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('3'); // Default: Aplicador
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dados específicos por tipo
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Masculino');
  const [nationality, setNationality] = useState('brasil');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  
  // Campos específicos para Admin
  const [institutionName, setInstitutionName] = useState('');
  const [professionalRegistration, setProfessionalRegistration] = useState('');
  const [adminPosition, setAdminPosition] = useState('');
  
  // Campos específicos para Aplicador
  const [academicBackground, setAcademicBackground] = useState('');
  const [aplicatorPosition, setAplicatorPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date());
  const [workScale, setWorkScale] = useState('');
  const [observations, setObservations] = useState('');
  
  // Campos específicos para Professional
  const [specialization, setSpecialization] = useState('');
  const [professionalPosition, setProfessionalPosition] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword || !fullName) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      let endpoint = '';
      let payload = {
        user: {
          email,
          username,
          password,
          level: parseInt(level),
        }
      };

      const commonFields = {
        full_name: fullName,
        birth_date: formatDate(birthDate),
        gender,
        nationality,
        addres: address,
        phone_number: phoneNumber,
        cpf,
        rg,
      };

      switch(level) {
        case '1': // Admin
          endpoint = 'https://iscdeploy.pythonanywhere.com/api/v1/register/admin/';
          payload.admin = {
            ...commonFields,
            instituition_name: institutionName,
            professinal_registration: professionalRegistration,
            position: adminPosition,
          };
          break;
        case '2': // Professional
          endpoint = 'https://iscdeploy.pythonanywhere.com/api/v1/register/professional/';
          payload.professional = {
            ...commonFields,
            academic_backgorund: academicBackground,
            especialization: specialization,
            position: professionalPosition,
            department,
            admission_date: formatDate(admissionDate),
            work_scale,
            observations,
          };
          break;
        case '3': // Aplicator
          endpoint = 'https://iscdeploy.pythonanywhere.com/api/v1/register/aplicator/';
          payload.aplicator = {
            ...commonFields,
            academic_backgorund: academicBackground,
            position: aplicatorPosition,
            department,
            admission_date: formatDate(admissionDate),
            work_scale,
            observations,
          };
          break;
        case '4': // Responsible
          endpoint = 'https://iscdeploy.pythonanywhere.com/api/v1/register/responsible/';
          payload.responsible = commonFields;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.goBack();
      } else {
        const errorMessage = data.detail || Object.values(data).join('\n');
        Alert.alert('Erro', errorMessage);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Não foi possível concluir o registro');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCommonFields = () => (
    <>
      <TextInput 
        placeholder="Nome completo*"
        placeholderTextColor="#A9A9A9"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Data de nascimento: {birthDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={setGender}
      >
        <Picker.Item label="Masculino" value="Masculino" />
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker>
      
      <TextInput 
        placeholder="Nacionalidade"
        placeholderTextColor="#A9A9A9"
        value={nationality}
        onChangeText={setNationality}
        style={styles.input}
      />
      
      <TextInput 
        placeholder="Endereço"
        placeholderTextColor="#A9A9A9"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      
      <TextInput 
        placeholder="Telefone"
        placeholderTextColor="#A9A9A9"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
      
      <TextInput 
        placeholder="CPF"
        placeholderTextColor="#A9A9A9"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <TextInput 
        placeholder="RG"
        placeholderTextColor="#A9A9A9"
        value={rg}
        onChangeText={setRg}
        keyboardType="numeric"
        style={styles.input}
      />
    </>
  );

  const renderAdminFields = () => (
    <>
      <TextInput 
        placeholder="Nome da instituição*"
        placeholderTextColor="#A9A9A9"
        value={institutionName}
        onChangeText={setInstitutionName}
        style={styles.input}
      />
      
      <TextInput 
        placeholder="Registro profissional*"
        placeholderTextColor="#A9A9A9"
        value={professionalRegistration}
        onChangeText={setProfessionalRegistration}
        style={styles.input}
      />
      
      <TextInput 
        placeholder="Cargo*"
        placeholderTextColor="#A9A9A9"
        value={adminPosition}
        onChangeText={setAdminPosition}
        style={styles.input}
      />
    </>
  );

  const renderProfessionalFields = () => (
    <>
      <TextInput 
        placeholder="Formação acadêmica*"
        value={academicBackground}
        onChangeText={setAcademicBackground}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Especialização*"
        value={specialization}
        onChangeText={setSpecialization}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Cargo*"
        value={professionalPosition}
        onChangeText={setProfessionalPosition}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Departamento"
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Escala de trabalho"
        value={workScale}
        onChangeText={setWorkScale}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Observações"
        value={observations}
        onChangeText={setObservations}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
        multiline
      />
    </>
  );

  const renderAplicatorFields = () => (
    <>
      <TextInput 
        placeholder="Formação acadêmica*"
        value={academicBackground}
        onChangeText={setAcademicBackground}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Cargo*"
        value={aplicatorPosition}
        onChangeText={setAplicatorPosition}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Departamento"
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Escala de trabalho"
        value={workScale}
        onChangeText={setWorkScale}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
      />
      
      <TextInput 
        placeholder="Observações"
        value={observations}
        onChangeText={setObservations}
        style={styles.input}
        placeholderTextColor="#A9A9A9"
        multiline
      />
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.innerContainer}>
            <StatusBar backgroundColor="#2f6b5e" barStyle="light-content" />
            
            <View style={styles.mainContent}>
              <Text style={styles.title}>Cadastro</Text>
              
              <Picker
                selectedValue={level}
                style={styles.levelPicker}
                onValueChange={setLevel}
              >
                <Picker.Item label="Administrador" value="1" />
                <Picker.Item label="Profissional" value="2" />
                <Picker.Item label="Aplicador" value="3" />
                <Picker.Item label="Responsável" value="4" />
              </Picker>

              <Text style={styles.sectionTitle}>Dados de Acesso</Text>
              <TextInput 
                placeholder="E-mail*"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#A9A9A9"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput 
                placeholder="Nome de usuário*"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                placeholderTextColor="#A9A9A9"
                autoCapitalize="none"
              />
              
              <TextInput 
                placeholder="Senha*"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#A9A9A9"
              />
              
              <TextInput 
                placeholder="Confirmar senha*"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#A9A9A9"
              />

              <Text style={styles.sectionTitle}>Dados Pessoais</Text>
              {renderCommonFields()}

              {level === '1' && (
                <>
                  <Text style={styles.sectionTitle}>Dados de Administrador</Text>
                  {renderAdminFields()}
                </>
              )}

              {level === '2' && (
                <>
                  <Text style={styles.sectionTitle}>Dados Profissionais</Text>
                  {renderProfessionalFields()}
                </>
              )}

              {level === '3' && (
                <>
                  <Text style={styles.sectionTitle}>Dados do Aplicador</Text>
                  {renderAplicatorFields()}
                </>
              )}
            </View>
            
            <View style={styles.whiteBox}>
              <TouchableOpacity 
                style={styles.registerButton} 
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.loginText}>
                Já tem uma conta?{' '}
                <Text 
                  style={styles.loginLink}
                  onPress={() => navigation.goBack()}
                >
                  Faça login
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f6b5e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
    marginBottom: 5,
  },
  whiteBox: {
    backgroundColor: 'white',
    width: '100%',
    padding: 25,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  title: {
    fontSize: 32,
    color: '#fbb040',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2f6b5e',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  levelPicker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    color: '#6A6A6A'
  },
  registerButton: {
    backgroundColor: '#2f6b5e',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    color: '#666',
    textAlign: 'center',
  },
  loginLink: {
    color: '#2f6b5e',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;