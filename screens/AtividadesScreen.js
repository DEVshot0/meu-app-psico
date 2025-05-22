import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockPacientes = ['Paciente 1', 'Paciente 2', 'Paciente 3'];
const mockAtividades = ['Atividade A', 'Atividade B', 'Atividade C'];

const AtividadesScreen = ({ navigation }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedAtividade, setSelectedAtividade] = useState('');
  const [form, setForm] = useState({ activity_name: '', tries: '', rewards: '', behavior_aux_id: '' });
  const [userLevel, setUserLevel] = useState(null);
  const [behaviorOptions, setBehaviorOptions] = useState([]);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const level = await AsyncStorage.getItem('userLevel');
      setUserLevel(Number(level));
    };
    fetchUserLevel();

    const fetchBehaviors = async () => {
      try {
        const [auxRes, plansRes, behaviorsRes] = await Promise.all([
          fetch('https://iscdeploy.pythonanywhere.com/api/v1/behaviors_aux/'),
          fetch('https://iscdeploy.pythonanywhere.com/api/v1/plans/full/'),
          fetch('https://iscdeploy.pythonanywhere.com/api/v1/behaviors/')
        ]);

        const auxData = await auxRes.json();
        const plans = await plansRes.json();
        const behaviors = await behaviorsRes.json();

        console.log('Dados recebidos:');
        console.log('auxData:', auxData);
        console.log('plans:', plans);
        console.log('behaviors:', behaviors);



        const options = auxData.map((item) => {
          const plan = plans.find((p) => String(p.id) === String(item.plan_id));
          const behavior = plan?.behaviors?.find((b) => String(b.id) === String(item.behavior_id));

          console.log(`Item ID ${item.id} - behavior_id: ${item.behavior_id}, encontrado:`, behavior);
          console.log(`Item ID ${item.id} - plan_id: ${item.plan_id}, encontrado:`, plan);

          return {
            id: item.id,
            label: `${item.id} -  ${behavior?.behavior_name || 'Desconhecido'} | ${plan?.plan_name || 'Desconhecido'}`,
          };
        });

        setBehaviorOptions(options);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert(`Erro: ${error.message}`);
      }
    };

    fetchBehaviors();
  }, []);

  const handleVoltar = () => {
    setSelectedAction(null);
    setSelectedPaciente('');
    setSelectedAtividade('');
    setForm({ activity_name: '', tries: '', rewards: '', behavior_aux_id: '' });
  };

  const handleCadastrarAtividade = async () => {
    try {
      const csrfToken = await AsyncStorage.getItem('csrfToken');
      if (!csrfToken) {
        alert('Token CSRF não encontrado. Faça login novamente.');
        return;
      }
  
      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/activities/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
        },
        body: JSON.stringify({
          activity_name: form.activity_name,
          tries: parseInt(form.tries),
          rewards: parseInt(form.rewards),
          behavior_aux_id: parseInt(form.behavior_aux_id),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Atividade enviada:', data);
        alert('Atividade cadastrada com sucesso!');
        handleVoltar();
      } else {
        console.error('Erro ao cadastrar atividade:', data);
        alert(`Erro: ${data?.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar atividade:', error);
      alert('Erro ao enviar atividade');
    }
  };
  

  const handleAplicarAtividade = () => {
    console.log('Atividade aplicada:', {
      paciente: selectedPaciente,
      atividade: selectedAtividade
    });
    alert('Atividade aplicada com sucesso!');
    handleVoltar();
  };

  const renderDropdown = () => (
    <ScrollView>
      <Text style={styles.label}>Selecione uma Atividade:</Text>
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={selectedAtividade}
          onValueChange={(value) => setSelectedAtividade(value)}
        >
          <Picker.Item label="Escolha uma atividade" value="" />
          {mockAtividades.map((atividade, idx) => (
            <Picker.Item key={idx} label={atividade} value={atividade} />
          ))}
        </Picker>
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
        <Text style={styles.cancelButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const canCreateActivities = userLevel === 1 || userLevel === 2;

  return (
    <MainLayout title="Atividades" navigation={navigation} showBackButton={false}>
      <View style={styles.content}>
        {selectedAction === 'Aplicar' ? (
          <ScrollView>
            <Text style={styles.label}>Selecione um Paciente:</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedPaciente}
                onValueChange={(value) => setSelectedPaciente(value)}
              >
                <Picker.Item label="Escolha um paciente" value="" />
                {mockPacientes.map((paciente, idx) => (
                  <Picker.Item key={idx} label={paciente} value={paciente} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Selecione uma Atividade:</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedAtividade}
                onValueChange={(value) => setSelectedAtividade(value)}
              >
                <Picker.Item label="Escolha uma atividade" value="" />
                {mockAtividades.map((atividade, idx) => (
                  <Picker.Item key={idx} label={atividade} value={atividade} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleAplicarAtividade}>
              <Text style={styles.submitButtonText}>Aplicar Atividade</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : selectedAction === 'Cadastrar' ? (
          <ScrollView>
            <TextInput
              placeholder="Nome da Atividade"
              style={styles.input}
              value={form.activity_name}
              onChangeText={(text) => setForm({ ...form, activity_name: text })}
            />
            <TextInput
              placeholder="Número de Tentativas"
              style={styles.input}
              keyboardType="numeric"
              value={form.tries}
              onChangeText={(text) => setForm({ ...form, tries: text })}
            />
            <TextInput
              placeholder="Número de Recompensas"
              style={styles.input}
              keyboardType="numeric"
              value={form.rewards}
              onChangeText={(text) => setForm({ ...form, rewards: text })}
            />
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={form.behavior_aux_id}
                onValueChange={(value) => setForm({ ...form, behavior_aux_id: value })}
              >
                <Picker.Item label="Selecione o Comportamento Auxiliar" value="" />
                {behaviorOptions.map((item) => (
                  <Picker.Item key={item.id} label={item.label} value={item.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleCadastrarAtividade}>
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : selectedAction === 'Ver' || selectedAction === 'Aplicação' || selectedAction === 'Avaliação' ? (
          renderDropdown()
        ) : (
          <>
            <View style={styles.grid}>
              {canCreateActivities && (
                <SquareCard
                  iconName="add-outline"
                  description="Cadastrar Atividades"
                  onPress={() => setSelectedAction('Cadastrar')}
                />
              )}
              <SquareCard
                iconName="eye-outline"
                description="Ver Atividades"
                onPress={() => setSelectedAction('Ver')}
              />
              <SquareCard
                iconName="medkit-outline"
                description="Atividades de Aplicação"
                onPress={() => setSelectedAction('Aplicação')}
              />
              <SquareCard
                iconName="clipboard-outline"
                description="Atividades de Avaliação"
                onPress={() => setSelectedAction('Avaliação')}
              />
              <SquareCard
                iconName="play-outline"
                description="Aplicar Atividades"
                onPress={() => setSelectedAction('Aplicar')}
              />
              <SquareCard
                iconName="arrow-back-outline"
                description="Voltar"
                onPress={() => navigation.goBack()}
              />
            </View>
          </>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Dimensions.get('window').width * 0.05,
    paddingTop: 15,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 80,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 80,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
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

export default AtividadesScreen;