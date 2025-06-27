import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';
import { apiService } from '../src/services/apiService';

const CriarPlanoScreen = ({ navigation }) => {
  const [form, setForm] = useState({ nome: '', tipo: '', paciente: '' });
  const [pacientes, setPacientes] = useState([]);
  const [availableBehaviors, setAvailableBehaviors] = useState([]);
  const [selectedBehaviorAux, setSelectedBehaviorAux] = useState([]);
  const [showBehaviorModal, setShowBehaviorModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [plano, setPlano] = useState(null);
  const [selectedBehaviorToAdd, setSelectedBehaviorToAdd] = useState('');
  const [newActivity, setNewActivity] = useState({ name: '', tries: '', rewards: '' });
  const [currentBehaviorAuxId, setCurrentBehaviorAuxId] = useState(null);
  const [activitiesByBehaviorAux, setActivitiesByBehaviorAux] = useState({});

  useEffect(() => {
    const fetchPacientesEComportamentos = async () => {
      try {
        const pacientes = await apiService('GET', null, 'api/v1/patient/');
        setPacientes(pacientes);

        const behaviors = await apiService('GET', null, 'api/v1/behaviors/');
        console.log(behaviors);
        setAvailableBehaviors(behaviors);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        Alert.alert('Erro', 'Não foi possível carregar pacientes ou comportamentos');
      }
    };

    fetchPacientesEComportamentos();
  }, []);

  const handleCadastroPlano = async () => {
    if (!form.nome || !form.tipo || !form.paciente) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const planoCriado = await apiService('POST', {
        plan_name: form.nome,
        plan_type: form.tipo,
        patient_id: form.paciente
      }, 'api/v1/intervention_plan/');

      setPlano(planoCriado);
      Alert.alert('Sucesso', 'Plano cadastrado com sucesso! Agora adicione comportamentos.');
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro na requisição', error.message);
    }
  };

  const handleAddBehaviorToPlan = async () => {
    if (!selectedBehaviorToAdd || !plano?.id) return;

    try {
      const vinculo = await apiService('POST', {
        plan_id: plano.id,
        behavior_id: selectedBehaviorToAdd
      }, 'api/v1/behaviors_aux/');

      setSelectedBehaviorAux(prev => [...prev, vinculo]);
      setActivitiesByBehaviorAux(prev => ({ ...prev, [vinculo.id]: [] }));
      setSelectedBehaviorToAdd('');
      setShowBehaviorModal(false);
      Alert.alert('Sucesso', 'Comportamento vinculado ao plano!');
    } catch (err) {
      console.error('Erro ao vincular comportamento:', err);
      Alert.alert('Erro', 'Não foi possível vincular o comportamento');
    }
  };

  const handleAddActivity = async () => {
    if (!newActivity.name || !newActivity.tries || (form.tipo !== 'avaliacao' && !newActivity.rewards)) {
      Alert.alert('Erro', 'Preencha todos os campos da atividade!');
      return;
    }

    try {
      const payload = {
        activity_name: newActivity.name,
        tries: parseInt(newActivity.tries),
        behavior_aux_id: currentBehaviorAuxId
      };
      if (form.tipo !== 'avaliacao') {
        payload.rewards = parseInt(newActivity.rewards);
      }

      const atividade = await apiService('POST', payload, 'api/v1/activities/');

      setActivitiesByBehaviorAux(prev => ({
        ...prev,
        [currentBehaviorAuxId]: [...(prev[currentBehaviorAuxId] || []), atividade]
      }));

      setShowActivityModal(false);
      setNewActivity({ name: '', tries: '', rewards: '' });
      Alert.alert('Sucesso', 'Atividade adicionada!');
    } catch (err) {
      console.error('Erro ao adicionar atividade:', err);
      Alert.alert('Erro', 'Não foi possível adicionar a atividade');
    }
  };

  return (
    <MainLayout title="Criar Plano" navigation={navigation} showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        {!plano ? (
          <>
            <TextInput
              placeholder="Nome do Plano"
              style={styles.input}
              value={form.nome}
              onChangeText={(text) => setForm({ ...form, nome: text })}
              placeholderTextColor="#A9A9A9"
            />

            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={form.tipo}
                onValueChange={(value) => setForm({ ...form, tipo: value })}
                style={{ color: '#6A6A6A' }}
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
                style={{ color: '#6A6A6A' }}
              >
                <Picker.Item label="Selecione o Paciente" value="" />
                {pacientes.map((p) => (
                  <Picker.Item key={p.id} label={p.patient_name} value={p.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleCadastroPlano}>
              <Text style={styles.submitButtonText}>Cadastrar Plano</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.planoCard}>
            <Text style={styles.label}>Plano Criado:</Text>
            <Text>Nome: {plano.plan_name}</Text>
            <Text>Tipo: {plano.plan_type}</Text>
            <Text>ID Paciente: {plano.patient_id}</Text>
          </View>
        )}

        {plano && (
          <>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowBehaviorModal(true)}>
              <Text style={styles.addButtonText}>Adicionar Comportamento</Text>
            </TouchableOpacity>

            {selectedBehaviorAux.map((aux) => {
              const behavior = availableBehaviors.find(b => b.id === aux.behavior_id);
              return (
                <View key={aux.id} style={styles.behaviorRow}>
                  <Text style={{ fontWeight: 'bold' }}>{behavior?.behavior_name}</Text>
                  <TouchableOpacity style={styles.addButton} onPress={() => {
                    setCurrentBehaviorAuxId(aux.id);
                    setShowActivityModal(true);
                  }}>
                    <Text style={styles.addButtonText}>Adicionar Atividade</Text>
                  </TouchableOpacity>
                  {(activitiesByBehaviorAux[aux.id] || []).map((act, idx) => (
                    <View key={idx} style={styles.activityRow}>
                      <Text>
                        • {act.activity_name} | Tentativas: {act.tries}
                        {form.tipo !== 'avaliacao' ? ` | Prêmios: ${act.rewards}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </>
        )}

        <Modal visible={showBehaviorModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {console.log('Dados no momento do render do Modal:', availableBehaviors)}
              <Text style={styles.label}>Selecionar comportamento:</Text>
              <View style={styles.dropdownWrapper}>
                <Picker
                  mode="dropdown"
                  selectedValue={selectedBehaviorToAdd}
                  onValueChange={(value) => setSelectedBehaviorToAdd(value)}
                  style={{ color: '#6A6A6A' }}
                >
                  <Picker.Item label="Selecione um comportamento" value="" />
                  {availableBehaviors.map(b => (
                    <Picker.Item key={b.id} label={b.behavior_name} value={String(b.id)} />
                  ))}
                </Picker>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <Pressable style={styles.cancelButton} onPress={() => setShowBehaviorModal(false)}>
                  <Text style={styles.submitButtonText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.submitButton} onPress={handleAddBehaviorToPlan}>
                  <Text style={styles.submitButtonText}>Adicionar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showActivityModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Nova Atividade:</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 2, marginRight: 5 }}>
                  <Text>Nome</Text>
                  <TextInput style={styles.input} value={newActivity.name} onChangeText={(t) => setNewActivity({ ...newActivity, name: t })} />
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text>Tentativas</Text>
                  <TextInput keyboardType="numeric" style={styles.input} value={newActivity.tries} onChangeText={(t) => setNewActivity({ ...newActivity, tries: t })} />
                </View>
                {form.tipo !== 'avaliacao' && (
                  <View style={{ flex: 1 }}>
                    <Text>Prêmios</Text>
                    <TextInput keyboardType="numeric" style={styles.input} value={newActivity.rewards} onChangeText={(t) => setNewActivity({ ...newActivity, rewards: t })} />
                  </View>
                )}
              </View>
              <Pressable style={[styles.submitButton, { marginTop: 20 }]} onPress={handleAddActivity}>
                <Text style={styles.submitButtonText}>Salvar Atividade</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
  addButton: {
    backgroundColor: '#2f6b5e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  behaviorRow: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1
  },
  activityRow: {
    paddingVertical: 5,
    paddingLeft: 10
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  planoCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16
  }
});

export default CriarPlanoScreen;
