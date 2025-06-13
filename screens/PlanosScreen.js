import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlanosScreen = ({ navigation }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPlano, setSelectedPlano] = useState('');
  const [form, setForm] = useState({ nome: '', tipo: '', profissional: '', paciente: '' });
  const [vinculo, setVinculo] = useState({ planoId: '', comportamentoId: '' });
  const [userLevel, setUserLevel] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [comportamentos, setComportamentos] = useState([]);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const level = await AsyncStorage.getItem('userLevel');
      setUserLevel(Number(level));
    };

    const fetchPacientes = async () => {
      try {
        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/patient/', {
          method: 'GET',
          headers: {
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Erro ao buscar pacientes');
        const data = await response.json();
        setPacientes(data);
      } catch (err) {
        console.error('Erro ao carregar pacientes:', err);
      }
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

    const fetchComportamentos = async () => {
      try {
        const res = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/behaviors/', {
          method: 'GET',
          headers: {
            'Referer': 'https://iscdeploy.pythonanywhere.com/',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        const data = await res.json();
        setComportamentos(data);
      } catch (err) {
        console.error('Erro ao carregar comportamentos:', err);
      }
    };

    fetchUserLevel();
    fetchPacientes();
    fetchPlanos();
    fetchComportamentos();
  }, []);

  const handleVoltar = () => {
    setSelectedAction(null);
    setForm({ nome: '', tipo: '', profissional: '', paciente: '' });
    setVinculo({ planoId: '', comportamentoId: '' });
    setSelectedPlano('');
  };

  const handleCadastroPlano = async () => {
    if (!form.nome || !form.tipo || !form.paciente) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const csrfToken = await AsyncStorage.getItem('csrfToken');
      if (!csrfToken) {
        Alert.alert('Erro', 'Token CSRF não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/intervention_plan/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          plan_name: form.nome,
          plan_type: form.tipo,
          patient_id: form.paciente
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao cadastrar (raw response):', errorText);
        Alert.alert('Erro ao cadastrar plano', errorText);
        return;
      }

      Alert.alert('Sucesso', 'Plano cadastrado com sucesso!');
      handleVoltar();
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro na requisição', error.message);
    }
  };

  const canCreatePlans = userLevel === 1 || userLevel === 2;

  return (
    <MainLayout title="Planos" navigation={navigation} showBackButton={false}>
      <View style={styles.content}>
        {selectedAction === 'Cadastrar' ? (
          <ScrollView>
            <TextInput placeholder="Nome do Plano" style={styles.input} value={form.nome} onChangeText={(text) => setForm({ ...form, nome: text })} />
            <View style={styles.dropdownWrapper}>
              <Picker selectedValue={form.tipo} onValueChange={(value) => setForm({ ...form, tipo: value })}>
                <Picker.Item label="Tipo do Plano" value="" />
                <Picker.Item label="Intervenção" value="intervencao" />
                <Picker.Item label="Avaliação" value="avaliacao" />
              </Picker>
            </View>
            <View style={styles.dropdownWrapper}>
              <Picker selectedValue={form.paciente} onValueChange={(value) => setForm({ ...form, paciente: value })}>
                <Picker.Item label="Selecione o Paciente" value="" />
                {pacientes.map((paciente) => (
                  <Picker.Item key={paciente.id} label={paciente.patient_name} value={paciente.id} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleCadastroPlano}>
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : selectedAction?.startsWith('Selecionar') ? (
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
              <SquareCard iconName="add-outline" description="Criar Plano" onPress={() => setSelectedAction('Cadastrar')} />
            )}
            <SquareCard iconName="document-outline" description="Plano Existente" onPress={() => setSelectedAction('Selecionar Existente')} />
            <SquareCard iconName="checkmark-done-outline" description="Aplicar Plano" onPress={() => navigation.navigate('Aplicar')} />
            <SquareCard iconName="arrow-back-outline" description="Voltar" onPress={() => navigation.goBack()} />
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
});

export default PlanosScreen;
