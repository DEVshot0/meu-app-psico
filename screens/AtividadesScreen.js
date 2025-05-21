import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import SquareCard from '../components/SquareCard';
import { Picker } from '@react-native-picker/picker';

const mockPacientes = ['Paciente 1', 'Paciente 2', 'Paciente 3'];
const mockAtividades = ['Atividade A', 'Atividade B', 'Atividade C'];
const mockProfissionais = ['Dra. Ana Clara', 'Dr. Marcos Silva', 'Dra. Fernanda Rocha'];

const AtividadesScreen = ({ navigation }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [selectedAtividade, setSelectedAtividade] = useState('');
  const [form, setForm] = useState({ nome: '', tipo: '', profissional: '' });

  const handleVoltar = () => {
    setSelectedAction(null);
    setSelectedPaciente('');
    setSelectedAtividade('');
    setForm({ nome: '', tipo: '', profissional: '' });
  };

  const handleCadastrarAtividade = () => {
    console.log('Nova atividade:', form);
    alert('Atividade cadastrada com sucesso!');
    handleVoltar();
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

  return (
    <MainLayout 
      title="Atividades" 
      navigation={navigation}
      showBackButton={false}
    >
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
              value={form.nome}
              onChangeText={(text) => setForm({ ...form, nome: text })}
            />
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={form.tipo}
                onValueChange={(value) => setForm({ ...form, tipo: value })}
              >
                <Picker.Item label="Tipo da Atividade" value="" />
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
                {mockProfissionais.map((prof, idx) => (
                  <Picker.Item key={idx} label={prof} value={prof} />
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
              <SquareCard
                iconName="add-outline"
                description="Cadastrar Atividades"
                onPress={() => setSelectedAction('Cadastrar')}
              />
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