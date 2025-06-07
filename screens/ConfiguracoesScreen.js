import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Alert 
} from 'react-native';
import MainLayout from '../components/MainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfiguracoesScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    full_name: 'Carregando...',
    email: 'carregando@email.com',
    profile_pic: 'https://i.pravatar.cc/300' // Imagem padrão
  });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    profile_pic: ''
  });

  // Carrega dados do AsyncStorage ao iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
          setFormData({
            full_name: parsedData.full_name,
            email: parsedData.email,
            profile_pic: parsedData.profile_pic || 'https://i.pravatar.cc/300'
          });
        } else {
          // Dados mockados para demonstração
          const demoData = {
            full_name: 'Usuário Demonstração',
            email: 'demo@email.com',
            profile_pic: 'https://i.pravatar.cc/300'
          };
          await AsyncStorage.setItem('userData', JSON.stringify(demoData));
          setUserData(demoData);
          setFormData(demoData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Limpa o AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      // Navega para a tela de Login
      navigation.replace('Login');
      Alert.alert('Logout', 'Você foi desconectado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair da conta');
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Validação simples
      if (!formData.full_name.trim() || !formData.email.trim()) {
        Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
        return;
      }

      // Atualiza no AsyncStorage (simulando backend)
      const updatedData = {
        ...userData,
        full_name: formData.full_name,
        email: formData.email,
        profile_pic: formData.profile_pic || 'https://i.pravatar.cc/300'
      };

      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
      
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    }
  };

  return (
    <MainLayout title="Configurações" navigation={navigation} showBackButton={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: isEditing ? formData.profile_pic : userData.profile_pic }} 
            style={styles.profileImage} 
            onError={() => setFormData({...formData, profile_pic: 'https://i.pravatar.cc/300'})}
          />
          
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={formData.full_name}
                onChangeText={(text) => setFormData({...formData, full_name: text})}
                placeholder="Nome Completo"
              />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder="Email"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={formData.profile_pic}
                onChangeText={(text) => setFormData({...formData, profile_pic: text})}
                placeholder="URL da Foto (opcional)"
              />
            </>
          ) : (
            <>
              <Text style={styles.profileName}>{userData.full_name}</Text>
              <Text style={styles.profileEmail}>{userData.email}</Text>
            </>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveChanges}
              >
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#2f6b5e'
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f6b5e',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  actionsContainer: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#2f6b5e',
  },
  saveButton: {
    backgroundColor: '#2f6b5e',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfiguracoesScreen;