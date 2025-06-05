import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';

const PlanoIntervencaoScreen = ({ navigation, route }) => {
  const { patientId, jsonParcial } = route.params;

  const planos = [
    {
      id: 1,
      plan_name: "Plano Intervencao 1",
      plan_type: "intervencao",
      behaviors: [
        {
          id: 1,
          behavior_name: "Comportamento A",
          activities: [
            { id: 1, activity_name: "Atividade A1", tries: 10 },
            { id: 2, activity_name: "Atividade A2", tries: 5 }
          ]
        },
        {
          id: 2,
          behavior_name: "Comportamento B",
          activities: [
            { id: 3, activity_name: "Atividade B1", tries: 8 },
            { id: 4, activity_name: "Atividade B2", tries: 6 }
          ]
        }
      ]
    },
    {
      id: 2,
      plan_name: "Plano Intervencao 2",
      plan_type: "intervencao",
      behaviors: [
        {
          id: 1,
          behavior_name: "Comportamento C",
          activities: [
            { id: 1, activity_name: "Atividade C1", tries: 7 },
            { id: 2, activity_name: "Atividade C2", tries: 9 }
          ]
        },
        {
          id: 2,
          behavior_name: "Comportamento D",
          activities: [
            { id: 3, activity_name: "Atividade D1", tries: 4 },
            { id: 4, activity_name: "Atividade D2", tries: 10 }
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

  const handleNext = () => {
    if (!selectedPlanoId) {
      alert('Por favor, selecione um plano primeiro!');
      return;
    }

    let selectedBehaviors = [];

    if (selectedBehaviorPickers.length === 0) {
      if (availableBehaviors.length === 0) {
        alert('Este plano não possui comportamentos e você não adicionou nenhum.');
        return;
      } else {
        selectedBehaviors = availableBehaviors;
      }
    } else {
      selectedBehaviors = selectedBehaviorPickers
        .map((picker) => availableBehaviors.find((b) => b.id === picker.selectedBehaviorId))
        .filter(Boolean);

      if (selectedBehaviors.length === 0) {
        alert('Por favor, selecione comportamentos válidos!');
        return;
      }
    }

    const planoSelecionado = planos.find((p) => p.id === selectedPlanoId);

    const novoJsonParcial = {
      ...jsonParcial,
      plan_name: planoSelecionado ? planoSelecionado.plan_name : '',
      behaviors: selectedBehaviors.map((b) => ({
        behavior_name: b.behavior_name,
        activities: b.activities.map((a) => ({
          activity_name: a.activity_name,
          tries: []
        }))
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
              {availableBehaviors.map((b) => (
                <Text key={b.id} style={styles.behaviorListItem}>• {b.behavior_name}</Text>
              ))}
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

export default PlanoIntervencaoScreen;
