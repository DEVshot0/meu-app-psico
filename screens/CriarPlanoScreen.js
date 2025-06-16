import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';
import { apiService } from '../src/services/apiService';

const CriarPlanoScreen = ({ navigation }) => {
  const [form, setForm] = useState({ nome: '', tipo: '', paciente: '' });
  const [pacientes, setPacientes] = useState([]);
  const [availableBehaviors, setAvailableBehaviors] = useState([]);
  const [selectedBehaviorPickers, setSelectedBehaviorPickers] = useState([]);
  const [newBehaviorName, setNewBehaviorName] = useState('');

  useEffect(() => {
    const fetchPacientesEComportamentos = async () => {
      try {
        const pacientes = await apiService('GET', null, 'api/v1/patient/');
        setPacientes(pacientes);

        const behaviors = await apiService('GET', null, 'api/v1/behaviors/');
        setAvailableBehaviors(behaviors);
        if (behaviors.length > 0) {
          setSelectedBehaviorPickers([{
            selectedBehaviorId: behaviors[0].id,
            newActivityName: '',
            newActivityTries: '1',
            activities: []
          }]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        Alert.alert('Erro', 'Não foi possível carregar pacientes ou comportamentos');
      }
    };

    fetchPacientesEComportamentos();
  }, []);

  const handleAddBehaviorPicker = () => {
    setSelectedBehaviorPickers((prev) => [
      ...prev,
      { selectedBehaviorId: availableBehaviors[0]?.id || '', newActivityName: '', newActivityTries: '1', activities: [] }
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
    updatedPickers[index].activities = [];
    setSelectedBehaviorPickers(updatedPickers);
  };

  const handleAddNewBehavior = () => {
    if (newBehaviorName.trim() === '') {
      Alert.alert('Atenção', 'Digite um nome para o comportamento');
      return;
    }

    const newBehavior = {
      id: `novo-${Date.now()}`,
      behavior_name: newBehaviorName.trim(),
      activities: []
    };

    setAvailableBehaviors((prev) => [...prev, newBehavior]);
    setSelectedBehaviorPickers((prev) => [
      ...prev,
      { selectedBehaviorId: newBehavior.id, newActivityName: '', newActivityTries: '1', activities: [] }
    ]);
    setNewBehaviorName('');
    Alert.alert('Sucesso', 'Comportamento adicionado com sucesso!');
  };

  const handleActivityNameChange = (index, value) => {
    const updated = [...selectedBehaviorPickers];
    updated[index].newActivityName = value;
    setSelectedBehaviorPickers(updated);
  };

  const handleActivityTriesChange = (index, value) => {
    const updated = [...selectedBehaviorPickers];
    updated[index].newActivityTries = value;
    setSelectedBehaviorPickers(updated);
  };

  const handleAddNewActivity = (index) => {
    const updated = [...selectedBehaviorPickers];
    const name = updated[index].newActivityName.trim();
    const tries = parseInt(updated[index].newActivityTries);

    if (!name || isNaN(tries) || tries <= 0) {
      Alert.alert('Erro', 'Nome e tentativas válidas são obrigatórios');
      return;
    }

    updated[index].activities.push({ activity_name: name, tries });
    updated[index].newActivityName = '';
    updated[index].newActivityTries = '1';
    setSelectedBehaviorPickers(updated);
    Alert.alert('Sucesso', 'Atividade adicionada com sucesso!');
  };

  const handleCadastroPlano = async () => {
    if (!form.nome || !form.tipo || !form.paciente) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const plano = await apiService('POST', {
        plan_name: form.nome,
        plan_type: form.tipo,
        patient_id: form.paciente
      }, 'api/v1/intervention_plan/');

      const planoId = plano.id;

      for (const picker of selectedBehaviorPickers) {
        await apiService('POST', {
          plan: planoId,
          behavior_name: availableBehaviors.find(b => b.id === picker.selectedBehaviorId)?.behavior_name || 'Novo comportamento',
          activities: picker.activities.map(a => ({ activity_name: a.activity_name, tries: Array.from({ length: a.tries }, () => ({ sleep_time: '0s', result: null, time: null, reward: null })) }))
        }, 'api/v1/behaviors/');
      }

      Alert.alert('Sucesso', 'Plano cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro na requisição', error.message);
    }
  };

  return (
    <MainLayout title="Criar Plano" navigation={navigation} showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Nome do Plano"
          style={styles.input}
          value={form.nome}
          onChangeText={(text) => setForm({ ...form, nome: text })}
        />

        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={form.tipo}
            onValueChange={(value) => setForm({ ...form, tipo: value })}
          >
            <Picker.Item label="Tipo do Plano" value="" />
            <Picker.Item label="Intervenção" value="intervencao" />
            <Picker.Item label="Avaliação" value="avaliacao" />
          </Picker>
        </View>

        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={form.paciente}
            onValueChange={(value) => setForm({ ...form, paciente: value })}
          >
            <Picker.Item label="Selecione o Paciente" value="" />
            {pacientes.map((p) => (
              <Picker.Item key={p.id} label={p.patient_name} value={p.id} />
            ))}
          </Picker>
        </View>

        {form.tipo !== '' && (
          <>
            <Text style={styles.label}>Comportamentos do plano:</Text>
            {selectedBehaviorPickers.map((picker, index) => (
              <View key={index} style={styles.behaviorRow}>
                <View style={styles.behaviorInlineRow}>
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

                {picker.activities.map((a, i) => (
                  <Text key={i} style={{ marginBottom: 4 }}>
                    • {a.activity_name} ({a.tries} tentativa{a.tries > 1 ? 's' : ''})
                  </Text>
                ))}

                <TextInput
                  style={styles.input}
                  placeholder="Nova atividade"
                  value={picker.newActivityName}
                  onChangeText={(value) => handleActivityNameChange(index, value)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Tentativas"
                  keyboardType="numeric"
                  value={picker.newActivityTries}
                  onChangeText={(value) => handleActivityTriesChange(index, value)}
                />

                <TouchableOpacity style={styles.addButton} onPress={() => handleAddNewActivity(index)}>
                  <Text style={styles.addButtonText}>Adicionar Atividade</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={handleAddBehaviorPicker}>
              <Text style={styles.addButtonText}>Adicionar Comportamento</Text>
            </TouchableOpacity>

            <View style={styles.manualBehaviorSection}>
              <Text style={styles.label}>Adicionar Comportamento manualmente:</Text>
              <TextInput
                style={styles.input}
                placeholder="Novo comportamento"
                value={newBehaviorName}
                onChangeText={setNewBehaviorName}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddNewBehavior}>
                <Text style={styles.addButtonText}>Adicionar Comportamento manualmente</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleCadastroPlano}>
          <Text style={styles.submitButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15 },
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 80,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#888",
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 80,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  behaviorRow: {
    marginBottom: 20
  },
  behaviorInlineRow: {
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
  manualBehaviorSection: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 15,
    marginTop: 10
  }
});

export default CriarPlanoScreen;
