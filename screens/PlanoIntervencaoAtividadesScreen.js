import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';

const PlanoIntervencaoAtividadesScreen = ({ navigation, route }) => {
  const { patientId, planoId, selectedBehaviors, jsonParcial } = route.params;

  const [behaviorActivities, setBehaviorActivities] = useState(
    selectedBehaviors.map((behavior) => ({
      behavior_name: behavior.behavior_name,
      availableActivities: behavior.activities,
      selectedActivities: behavior.activities.map((activity) => ({
        selectedActivityId: activity.id,
        activity_name: activity.activity_name,
        tries: activity.tries
      }))
    }))
  );

  const handleAddActivityPicker = (behaviorIndex) => {
    const updated = [...behaviorActivities];
    updated[behaviorIndex].selectedActivities.push({
      selectedActivityId: '',
      activity_name: '',
      tries: 1
    });
    setBehaviorActivities(updated);
  };

  const handleRemoveActivityPicker = (behaviorIndex, activityIndex) => {
    const updated = [...behaviorActivities];
    updated[behaviorIndex].selectedActivities.splice(activityIndex, 1);
    setBehaviorActivities(updated);
  };

  const handleActivityChange = (behaviorIndex, activityIndex, value) => {
    const updated = [...behaviorActivities];
    const selectedActivity = updated[behaviorIndex].availableActivities.find(a => a.id === value);

    updated[behaviorIndex].selectedActivities[activityIndex] = {
      selectedActivityId: value,
      activity_name: selectedActivity ? selectedActivity.activity_name : '',
      tries: selectedActivity ? selectedActivity.tries : 1
    };

    setBehaviorActivities(updated);
  };

  const handleTriesChange = (behaviorIndex, activityIndex, value) => {
    const updated = [...behaviorActivities];
    updated[behaviorIndex].selectedActivities[activityIndex].tries = value;
    setBehaviorActivities(updated);
  };

  const handleNext = () => {
    const behaviorsFinal = behaviorActivities.map((behavior) => ({
      behavior_name: behavior.behavior_name,
      activities: behavior.selectedActivities
        .filter((sa) => sa.selectedActivityId)
        .map((sa) => ({
          activity_name: sa.activity_name,
          tries: Array.from({ length: parseInt(sa.tries) }, () => ({
            sleep_time: '0s',
            result: null,
            time: null,
            reward: null
          }))
        }))
    }));

    const totalActivities = behaviorsFinal.reduce(
      (sum, behavior) => sum + behavior.activities.length,
      0
    );

    if (totalActivities === 0) {
      alert('Por favor, selecione pelo menos uma atividade!');
      return;
    }

    const novoJsonParcial = {
      ...jsonParcial,
      behaviors: behaviorsFinal
    };

    console.log('JSON PARCIAL ATUALIZADO:', JSON.stringify(novoJsonParcial, null, 2));

    navigation.navigate('ExecucaoPlano', {
      patientId,
      planoId,
      behaviors: behaviorsFinal,
      jsonParcial: novoJsonParcial
    });
  };

  return (
    <MainLayout title="Seleção de Atividades" navigation={navigation} showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {behaviorActivities.map((behavior, behaviorIndex) => (
          <View key={behaviorIndex} style={styles.behaviorBlock}>
            <Text style={styles.behaviorTitle}>{behavior.behavior_name}</Text>

            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Atividade</Text>
              <Text style={styles.headerText}>Tentativas</Text>
            </View>

            {behavior.selectedActivities.map((sa, activityIndex) => (
              <View key={activityIndex} style={styles.activityRow}>
                <View style={styles.activityPickerWrapper}>
                  <Picker
                    selectedValue={sa.selectedActivityId}
                    onValueChange={(value) =>
                      handleActivityChange(behaviorIndex, activityIndex, value)
                    }
                  >
                    <Picker.Item label="Escolha uma atividade" value="" />
                    {behavior.availableActivities.map((a) => (
                      <Picker.Item key={a.id} label={a.activity_name} value={a.id} />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  style={styles.triesInput}
                  keyboardType="numeric"
                  value={String(sa.tries)}
                  onChangeText={(value) =>
                    handleTriesChange(behaviorIndex, activityIndex, value)
                  }
                />

                <TouchableOpacity
                  onPress={() =>
                    handleRemoveActivityPicker(behaviorIndex, activityIndex)
                  }
                >
                  <Text style={styles.removeButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddActivityPicker(behaviorIndex)}
            >
              <Text style={styles.addButtonText}>Adicionar Atividade</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  behaviorBlock: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10
  },
  behaviorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '45%'
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  activityPickerWrapper: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10
  },
  triesInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginRight: 10,
    textAlign: 'center'
  },
  removeButton: {
    fontSize: 24,
    color: 'red'
  },
  addButton: {
    backgroundColor: '#2f6b5e',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PlanoIntervencaoAtividadesScreen;
