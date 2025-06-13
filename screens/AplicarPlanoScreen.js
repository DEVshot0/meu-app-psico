import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MainLayout from '../components/MainLayout';

const AplicarPlanoScreen = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [selectedPacienteName, setSelectedPacienteName] = useState('');
  const [aplicatorName, setAplicatorName] = useState('');
  const [aplicationDate, setAplicationDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPacientes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/patient/');
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        alert(`Erro ao buscar pacientes: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    const hoje = new Date();
    const options = {
      timeZone: 'America/Sao_Paulo'
    };

    const dia = hoje.toLocaleString('pt-BR', { day: '2-digit', ...options });
    const mes = hoje.toLocaleString('pt-BR', { month: '2-digit', ...options });
    const ano = hoje.toLocaleString('pt-BR', { year: 'numeric', ...options });

    const dataFormatada = `${dia}/${mes}/${ano}`;
    setAplicationDate(dataFormatada);
  }, []);

  const handleNavigate = (screenName) => {
    if (!selectedPacienteId || !aplicatorName) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const jsonParcial = {
      patient_name: selectedPacienteName,
      plan_name: "", // será preenchido depois
      aplication_date: aplicationDate,
      aplicator_name: aplicatorName,
      behaviors: []
    };

    // ✅ LOG do jsonParcial no console
    console.log('JSON PARCIAL ATÉ O MOMENTO:', JSON.stringify(jsonParcial, null, 2));

    navigation.navigate(screenName, { jsonParcial });
  };

  return (
    <MainLayout title="Aplicar Planos" navigation={navigation} showBackButton={true}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Selecione um Paciente:</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2f6b5e" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedPacienteId}
              onValueChange={(value) => {
                setSelectedPacienteId(value);
                const pacienteSelecionado = pacientes.find(p => p.id === value);
                setSelectedPacienteName(pacienteSelecionado ? pacienteSelecionado.patient_name : '');
              }}
            >
              <Picker.Item label="Escolha um paciente" value="" />
              {pacientes.map((paciente) => (
                <Picker.Item key={paciente.id} label={paciente.patient_name} value={paciente.id} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Nome do aplicador:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do aplicador"
          value={aplicatorName}
          onChangeText={setAplicatorName}
        />

        <Text style={styles.label}>Data da aplicação:</Text>
        <Text style={styles.autoDate}>{aplicationDate}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate('PlanoIntervencao')}
        >
          <Text style={styles.buttonText}>Plano de Intervenção</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigate('PlanoAvaliacao')}
        >
          <Text style={styles.buttonText}>Plano de Avaliação</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 80,
    width: '100%',
    marginBottom: 30,
    overflow: 'hidden',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '100%',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#888"
  },
  autoDate: {
    fontSize: 16,
    marginBottom: 20,
    alignSelf: 'flex-start',
    color: '#333'
  },
  button: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 80,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AplicarPlanoScreen;
