import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';

const HomeScreen = ({ navigation }) => {
  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    const fetchLevel = async () => {
      const level = await AsyncStorage.getItem('userLevel');
      setUserLevel(Number(level)); // converte para número
    };
    fetchLevel();
  }, []);

  const allCards = [
    { label: 'Atividades', icon: 'list-outline', route: 'Atividades' },
    { label: 'Paciente', icon: 'people-outline', route: 'Paciente' },
    { label: 'Profissional', icon: 'person-outline', route: 'Profissional' },
    { label: 'Planos', icon: 'document-outline', route: 'Planos' },
    { label: 'Relatórios', icon: 'bar-chart-outline', route: 'Relatorios' },
    { label: 'Histórico', icon: 'time-outline', route: 'Historico' },
    { label: 'Configurações', icon: 'settings-outline', route: 'Configuracoes' },
  ];

  // Filtra os cards de acordo com o nível do usuário
  const getVisibleCards = () => {
    switch(userLevel) {
      case 1: // Nível 1 - Todos os cards
        return allCards;
      case 2: // Nível 2 - Remove apenas Profissional
        return allCards.filter(card => card.label !== 'Profissional');
      case 3: // Nível 3 - Remove Paciente e Profissional
        return allCards.filter(card => 
          !['Paciente', 'Profissional'].includes(card.label)
        );
      case 4: // Nível 4 - Apenas Planos, Histórico e Configurações
        return allCards.filter(card =>
          ['Planos', 'Histórico', 'Configurações'].includes(card.label)
        );
      default: // Caso padrão (se não tiver nível definido)
        return [];
    }
  };

  const visibleCards = getVisibleCards();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear(); // Limpa todos os dados salvos
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <MainLayout 
      title="Início" 
      navigation={navigation}
      showBackButton={false}
    >
      <ScrollView contentContainerStyle={styles.grid}>
        {visibleCards.map((card) => (
          <SquareCard 
            key={card.label}
            iconName={card.icon}
            description={card.label}
            onPress={() => navigation.navigate(card.route)}
          />
        ))}

        <SquareCard 
          iconName="log-out-outline"
          description="Sair"
          onPress={handleLogout}
        />
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
    paddingTop: 15,
    paddingBottom: 40,
  },
});

export default HomeScreen;