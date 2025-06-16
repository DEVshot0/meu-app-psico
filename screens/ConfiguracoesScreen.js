import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import MainLayout from '../components/MainLayout';
import UserProfileCard from '../components/UserProfileCard';
import { getUserData, setUserData, clearUserSession } from '../utils/storageUtil';

const ConfiguracoesScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserDataState] = useState({
    full_name: 'Carregando...',
    email: 'carregando@email.com',
    profile_pic: 'https://i.pravatar.cc/300'
  });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    profile_pic: ''
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const stored = await getUserData();
        const fallback = {
          full_name: 'Usuário Demonstração',
          email: 'demo@email.com',
          profile_pic: 'https://i.pravatar.cc/300'
        };

        const data = stored || fallback;

        if (!stored) await setUserData(fallback);

        setUserDataState(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!formData.full_name.trim() || !formData.email.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const updated = {
      ...userData,
      full_name: formData.full_name,
      email: formData.email,
      profile_pic: formData.profile_pic || 'https://i.pravatar.cc/300'
    };

    try {
      await setUserData(updated);
      setUserDataState(updated);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao salvar perfil.');
    }
  };

  const handleLogout = async () => {
    try {
      await clearUserSession();
      navigation.replace('Login');
      Alert.alert('Logout', 'Você foi desconectado');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao sair da conta');
    }
  };

  return (
    <MainLayout title="Configurações" navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <UserProfileCard
          isEditing={isEditing}
          userData={userData}
          formData={formData}
          setFormData={setFormData}
        />

        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => setIsEditing(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.button, styles.edit]} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.logout]} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair da Conta</Text>
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
  actions: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  edit: { backgroundColor: '#2f6b5e' },
  save: { backgroundColor: '#2f6b5e' },
  cancel: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  logout: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e74c3c'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold'
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ConfiguracoesScreen;
