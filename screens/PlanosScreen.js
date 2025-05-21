import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockProfissionais = [
  { id: 1, nome: 'Dra. Ana Clara' },
  { id: 2, nome: 'Dr. Marcos Silva' },
  { id: 3, nome: 'Dra. Fernanda Rocha' },
  { id: 4, nome: 'Dr. Lucas Almeida' },
];

const mockPlanos = ['Plano 1', 'Plano 2', 'Plano 3', 'Plano 4'];

const PlanosScreen = ({ navigation }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPlano, setSelectedPlano] = useState('');
  const [form, setForm] = useState({
    nome: '',
    tipo: '',
    profissional: '',
  });
  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const level = await AsyncStorage.getItem('userLevel');
      setUserLevel(Number(level));
    };
    fetchUserLevel();
  }, []);

  const handleVoltar = () => {
    setSelectedAction(null);
    setForm({ nome: '', tipo: '', profissional: '' });
    setSelectedPlano('');
  };

  const handleCadastroPlano = () => {
    console.log('Novo plano:', form);
    alert('Plano cadastrado com sucesso!');
    handleVoltar();
  };

  // Verifica se o usuário pode criar planos (níveis 1 e 2)
  const canCreatePlans = userLevel === 1 || userLevel === 2;

  return (
    <MainLayout 
      title="Planos" 
      navigation={navigation}
      showBackButton={false}
    >
      <View style={styles.content}>
        {selectedAction === 'Cadastrar' ? (
          <ScrollView>
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
                <Picker.Item label="Intervenção" value="Intervenção" />
                <Picker.Item label="Avaliação" value="Avaliação" />
              </Picker>
            </View>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={form.profissional}
                onValueChange={(value) => setForm({ ...form, profissional: value })}
              >
                <Picker.Item label="Selecione o Profissional" value="" />
                {mockProfissionais.map((prof) => (
                  <Picker.Item key={prof.id} label={prof.nome} value={prof.nome} />
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
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedPlano}
                onValueChange={(value) => setSelectedPlano(value)}
              >
                <Picker.Item label="Selecione um Plano" value="" />
                {mockPlanos.map((plano, index) => (
                  <Picker.Item key={index} label={plano} value={plano} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={handleVoltar}>
              <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <>
            <View style={styles.grid}>
              {/* Mostra o card de criar apenas para níveis 1 e 2 */}
              {canCreatePlans && (
                <SquareCard
                  iconName="add-outline"
                  description="Criar Plano"
                  onPress={() => setSelectedAction('Cadastrar')}
                />
              )}
              <SquareCard
                iconName="document-outline"
                description="Plano Existente"
                onPress={() => setSelectedAction('Selecionar Existente')}
              />
              <SquareCard
                iconName="medkit-outline"
                description="Plano de Intervenção"
                onPress={() => setSelectedAction('Selecionar Intervenção')}
              />
              <SquareCard
                iconName="clipboard-outline"
                description="Plano de Avaliação"
                onPress={() => setSelectedAction('Selecionar Avaliação')}
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
  input: {
    height: 50,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 80,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
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
  centerCardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default PlanosScreen;
