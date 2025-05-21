import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainLayout from '../components/MainLayout';

const ConfiguracoesScreen = ({ navigation }) => {
  return (
    <MainLayout 
      title="Configurações" 
      navigation={navigation}
      showBackButton={false}
    >
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Configurações</Text>
        {/* Resto do conteúdo da tela aqui */}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
  },
  welcomeText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
});

export default ConfiguracoesScreen;