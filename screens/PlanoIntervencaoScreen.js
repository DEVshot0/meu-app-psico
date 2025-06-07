import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanoIntervencaoScreen = ({ navigation, route }) => {
  const { patientId, jsonParcial } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [planos, setPlanos] = useState([]);
  const [selectedPlanoId, setSelectedPlanoId] = useState('');
  const [availableBehaviors, setAvailableBehaviors] = useState([]);
  const [selectedBehaviorPickers, setSelectedBehaviorPickers] = useState([]);
  const [newBehaviorName, setNewBehaviorName] = useState('');

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        const csrfToken = await AsyncStorage.getItem('csrfToken');
        if (!csrfToken) {
          throw new Error('Token CSRF não encontrado');
        }

        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/plans/full/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'X-CSRFToken': csrfToken,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao obter planos');
        }

        const data = await response.json();

        // Filtrar planos de INTERVENÇÃO com robustez no plan_type
        const planosIntervencao = data.filter(plano => {
          const tipoNormalizado = plano.plan_type.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return tipoNormalizado.includes('intervencao');
        });

        setPlanos(planosIntervencao);
      } catch (error) {
        console.error('Erro ao buscar planos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os planos de intervenção');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const handlePlanoChange = (value) => {
    setSelectedPlanoId(value);
    const planoSelecionado = planos.find((p) => p.id === value);
    if (planoSelecionado) {
      setAvailableBehaviors(planoSelecionado.behaviors || []);
      setSelectedBehaviorPickers([]);
    } else {
      setAvailableBehaviors([]);
      setSelectedBehaviorPickers([]);
    }
  };

  const handleAddBehaviorPicker = () => {
    setSelectedBehaviorPickers((prev) => [
      ...prev,
      { selectedBehaviorId: '' }
    ]);
  };

  const handleRemoveBehaviorPicker = (index) => {
    const updatedPickers = [...selectedBehaviorPickers];
    updatedPickers.splice(index, 1);
    setSelectedBehaviorPickers(updatedPickers);
  };

  const handleBehaviorChange = (index, value) => {
    const updatedPickers = [...selectedBehaviorPickers];
    updatedPickers[index].selectedBehaviorId = value;
    setSelectedBehaviorPickers(updatedPickers);
  };

  const handleAddNewBehavior = () => {
    if (newBehaviorName.trim() === '') {
      Alert.alert('Atenção', 'Digite um nome para o comportamento');
      return;
    }

    const newBehavior = {
      id: `novo-${Date.now()}`, // id único temporário
      behavior_name: newBehaviorName.trim(),
      activities: [] // sem atividades ainda
    };

    setAvailableBehaviors((prev) => [...prev, newBehavior]);
    setNewBehaviorName('');
    Alert.alert('Sucesso', 'Comportamento adicionado com sucesso!');
  };

  const handleNext = () => {
    if (!selectedPlanoId) {
      Alert.alert('Atenção', 'Por favor, selecione um plano primeiro!');
      return;
    }

    let selectedBehaviors = [];

    if (selectedBehaviorPickers.length === 0) {
      if (availableBehaviors.length === 0) {
        Alert.alert('Atenção', 'Este plano não possui comportamentos e você não adicionou nenhum.');
        return;
      } else {
        selectedBehaviors = availableBehaviors;
      }
    } else {
      selectedBehaviors = selectedBehaviorPickers
        .map((picker) => availableBehaviors.find((b) => b.id === picker.selectedBehaviorId))
        .filter(Boolean);

      if (selectedBehaviors.length === 0) {
        Alert.alert('Atenção', 'Por favor, selecione comportamentos válidos!');
        return;
      }
    }

    const planoSelecionado = planos.find((p) => p.id === selectedPlanoId);

    const novoJsonParcial = {
      ...jsonParcial,
      plan_name: planoSelecionado ? planoSelecionado.plan_name : '',
      behaviors: selectedBehaviors.map((b) => ({
        behavior_name: b.behavior_name,
        activities: b.activities ? b.activities.map((a) => ({
          activity_name: a.activity_name,
          tries: []
        })) : []
      }))
    };

    console.log('JSON PARCIAL ATUALIZADO:', JSON.stringify(novoJsonParcial, null, 2));

    navigation.navigate('PlanoIntervencaoAtividades', {
      patientId,
      planoId: selectedPlanoId,
      plan_name: planoSelecionado ? planoSelecionado.plan_name : '',
      selectedBehaviors,
      jsonParcial: novoJsonParcial
    });
  };

  if (isLoading) {
    return (
      <MainLayout title="Plano de Intervenção" navigation={navigation} showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f6b5e" />
          <Text style={styles.loadingText}>Carregando planos...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Plano de Intervenção" navigation={navigation} showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Selecione um Plano de Intervenção:</Text>

        <View style={styles.pickerWrapper}>
          <Picker selectedValue={selectedPlanoId} onValueChange={handlePlanoChange}>
            <Picker.Item label="Escolha um plano" value="" />
            {planos.map((plano) => (
              <Picker.Item key={plano.id} label={plano.plan_name} value={plano.id} />
            ))}
          </Picker>
        </View>

        {selectedPlanoId !== '' && (
          <>
            <Text style={styles.label}>Comportamentos do plano:</Text>
            <View style={styles.behaviorList}>
              {availableBehaviors.length > 0 ? (
                availableBehaviors.map((b) => (
                  <Text key={b.id} style={styles.behaviorListItem}>• {b.behavior_name}</Text>
                ))
              ) : (
                <Text style={styles.behaviorListItem}>Nenhum comportamento disponível</Text>
              )}
            </View>

            <Text style={styles.label}>Selecione os comportamentos:</Text>

            {selectedBehaviorPickers.map((picker, index) => (
              <View key={index} style={styles.behaviorRow}>
                <View style={styles.behaviorPickerWrapper}>
                  <Picker
                    selectedValue={picker.selectedBehaviorId}
                    onValueChange={(value) => handleBehaviorChange(index, value)}
                  >
                    <Picker.Item label="Escolha um comportamento" value="" />
                    {availableBehaviors.map((b) => (
                      <Picker.Item key={b.id} label={b.behavior_name} value={b.id} />
                    ))}
                  </Picker>
                </View>

                <TouchableOpacity onPress={() => handleRemoveBehaviorPicker(index)}>
                  <Text style={styles.removeButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddBehaviorPicker}>
              <Text style={styles.addButtonText}>Adicionar Comportamento (Picker)</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Adicionar novo comportamento (manual):</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do novo comportamento"
              value={newBehaviorName}
              onChangeText={setNewBehaviorName}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddNewBehavior}>
              <Text style={styles.addButtonText}>Adicionar novo comportamento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Próximo</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2f6b5e'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2f6b5e'
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden'
  },
  behaviorList: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  behaviorListItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  behaviorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  behaviorPickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 10,
    overflow: 'hidden'
  },
  input: {
    borderWidth: 1,
    borderColor: '#2f6b5e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  removeButton: {
    fontSize: 24,
    color: '#e74c3c',
    marginLeft: 10
  },
  addButton: {
    backgroundColor: '#2f6b5e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default PlanoIntervencaoScreen;
