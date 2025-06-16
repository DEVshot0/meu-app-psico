import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanosScreen = ({ navigation }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const level = await AsyncStorage.getItem('userLevel');
      setUserLevel(Number(level));
    };

    const fetchPlanos = async () => {
      try {
        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/plans/full/', {
          method: 'GET',
          headers: {
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Erro ao buscar planos');
        const data = await response.json();
        setPlanos(data);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      }
    };

    fetchUserLevel();
    fetchPlanos();
  }, []);

  const handleVoltar = () => {
    setSelectedAction(null);
  };

  const canCreatePlans = userLevel === 1 || userLevel === 2;

  return (
    <MainLayout title="Planos" navigation={navigation} showBackButton={false}>
      <View style={styles.content}>
        {selectedAction === 'Selecionar Existente' ? (
          <ScrollView>
            <Text style={styles.title}>Planos Cadastrados</Text>
            {planos.map((plano) => (
              <View key={plano.id} style={styles.planRow}>
                <Text style={styles.planId}>{plano.id}</Text>
                <Text style={styles.planName}>{plano.plan_name}</Text>
                <Text style={styles.planType}>{plano.plan_type}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.grid}>
            {canCreatePlans && (
              <SquareCard
                iconName="add-outline"
                description="Criar Plano"
                onPress={() => navigation.navigate('CriarPlano')}
              />
            )}
            <SquareCard
              iconName="document-outline"
              description="Plano Existente"
              onPress={() => setSelectedAction('Selecionar Existente')}
            />
            <SquareCard
              iconName="checkmark-done-outline"
              description="Aplicar Plano"
              onPress={() => navigation.navigate('Aplicar')}
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
  content: { flex: 1, padding: 15 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
    paddingTop: 15,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  planId: {
    width: '10%',
    fontWeight: 'bold',
    color: '#2f6b5e',
  },
  planName: {
    width: '60%',
    textAlign: 'center',
  },
  planType: {
    width: '30%',
    textAlign: 'right',
    fontStyle: 'italic',
    color: '#666',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlanosScreen;
