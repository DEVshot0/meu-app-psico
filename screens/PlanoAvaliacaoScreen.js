import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';

const PlanoAvaliacaoScreen = ({ navigation, route }) => {
  const { patientId } = route.params;

  const planos = [
    {
      id: 3,
      plan_name: "Plano Avaliacao 1",
      plan_type: "avaliacao",
      behaviors: [
        {
          id: 1,
          behavior_name: "Percepção",
          activities: [
            { id: 1, activity_name: "Atividade E1", tries: 5 },
            { id: 2, activity_name: "Atividade E2", tries: 6 }
          ]
        },
        {
          id: 2,
          behavior_name: "Tato",
          activities: [
            { id: 3, activity_name: "Atividade F1", tries: 8 },
            { id: 4, activity_name: "Atividade F2", tries: 7 }
          ]
        }
      ]
    },
    {
      id: 4,
      plan_name: "Plano Avaliacao 2",
      plan_type: "avaliacao",
      behaviors: [
        {
          id: 1,
          behavior_name: "Audição",
          activities: [
            { id: 1, activity_name: "Atividade G1", tries: 9 },
            { id: 2, activity_name: "Atividade G2", tries: 10 }
          ]
        },
        {
          id: 2,
          behavior_name: "Visão",
          activities: [
            { id: 3, activity_name: "Atividade H1", tries: 6 },
            { id: 4, activity_name: "Atividade H2", tries: 8 }
          ]
        }
      ]
    }
  ];

  const [selectedPlanoId, setSelectedPlanoId] = useState('');
  const [availableBehaviors, setAvailableBehaviors] = useState([]);
  const [selectedBehaviorPickers, setSelectedBehaviorPickers] = useState([]);

  const handlePlanoChange = (value) => {
    setSelectedPlanoId(value);
    const planoSelecionado = planos.find((p) => p.id === value);
    if (planoSelecionado) {
      setAvailableBehaviors(planoSelecionado.behaviors);
      setSelectedBehaviorPickers([]); // reseta os pickers de comportamento
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

  const handleNext = () => {
    if (!selectedPlanoId) {
      alert('Por favor, selecione um plano primeiro!');
      return;
    }
  
    let selectedBehaviors = [];
  
    if (selectedBehaviorPickers.length === 0) {
      // Caso não tenha pickers adicionados, usa os comportamentos do plano
      if (availableBehaviors.length === 0) {
        alert('Este plano não possui comportamentos e você não adicionou nenhum.');
        return;
      } else {
        selectedBehaviors = availableBehaviors;
      }
    } else {
      // Caso tenha pickers, usa os que foram selecionados
      selectedBehaviors = selectedBehaviorPickers
        .map((picker) => availableBehaviors.find((b) => b.id === picker.selectedBehaviorId))
        .filter(Boolean);
  
      if (selectedBehaviors.length === 0) {
        alert('Por favor, selecione comportamentos válidos!');
        return;
      }
    }
  
    // Pegamos o nome do plano:
    const planoSelecionado = planos.find((p) => p.id === selectedPlanoId);
  
    // Navega para tela de ATIVIDADES, levando plan_name e behaviors
    navigation.navigate('PlanoAvaliacaoAtividades', {
      patientId,
      planoId: selectedPlanoId,
      plan_name: planoSelecionado ? planoSelecionado.plan_name : '',
      selectedBehaviors
    });
  };
  
  

  return (
    <MainLayout title="Plano de Avaliação" navigation={navigation} showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Selecione um Plano de Avaliação:</Text>

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
            {/* VISUALIZAÇÃO DOS COMPORTAMENTOS */}
            <Text style={styles.label}>Comportamentos do plano:</Text>
            <View style={styles.behaviorList}>
              {availableBehaviors.map((b) => (
                <Text key={b.id} style={styles.behaviorListItem}>• {b.behavior_name}</Text>
              ))}
            </View>

            {/* SELEÇÃO DE COMPORTAMENTOS */}
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
              <Text style={styles.addButtonText}>Adicionar Comportamento</Text>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
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
    marginBottom: 5
  },
  behaviorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  behaviorPickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden'
  },
  removeButton: {
    fontSize: 24,
    color: 'red',
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
    fontWeight: 'bold'
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PlanoAvaliacaoScreen;
