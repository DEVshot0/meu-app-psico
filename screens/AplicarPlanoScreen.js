import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import MainLayout from '../components/MainLayout';
import { getHojeFormatado } from '../utils/dateUtil';
import { usePacientes } from '../hooks/usePacientes';
import PacientePicker from '../components/PacientePIcker';

const AplicarPlanoScreen = ({ navigation }) => {
  const { pacientes, isLoading } = usePacientes();

  const [selectedPacienteId, setSelectedPacienteId] = useState('');
  const [selectedPacienteName, setSelectedPacienteName] = useState('');
  const [aplicatorName, setAplicatorName] = useState('');
  const [aplicationDate, setAplicationDate] = useState('');

  useEffect(() => {
    setAplicationDate(getHojeFormatado());
  }, []);

  const handleNavigate = (screenName) => {
    if (!selectedPacienteId || !aplicatorName) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const jsonParcial = {
      patient_name: selectedPacienteName,
      plan_name: '',
      aplication_date: aplicationDate,
      aplicator_name: aplicatorName,
      behaviors: []
    };

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
          <PacientePicker
            pacientes={pacientes}
            selectedId={selectedPacienteId}
            onSelect={(id, name) => {
              setSelectedPacienteId(id);
              setSelectedPacienteName(name);
            }}
          />
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
