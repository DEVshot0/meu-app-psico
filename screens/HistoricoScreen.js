import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';

const HistoricoScreen = ({ navigation }) => {
  // Dados simulados do histórico
  const historicoData = [
    { id: 1, data: '10/05/2023', atividade: 'Terapia Ocupacional', profissional: 'Dra. Ana Clara', status: 'Concluído' },
    { id: 2, data: '12/05/2023', atividade: 'Fisioterapia', profissional: 'Dr. Marcos Silva', status: 'Concluído' },
    { id: 3, data: '15/05/2023', atividade: 'Avaliação Psicológica', profissional: 'Dra. Fernanda Rocha', status: 'Cancelado' },
    { id: 4, data: '18/05/2023', atividade: 'Fonoaudiologia', profissional: 'Dra. Carla Santos', status: 'Concluído' },
    { id: 5, data: '20/05/2023', atividade: 'Terapia Ocupacional', profissional: 'Dra. Ana Clara', status: 'Pendente' },
    { id: 6, data: '22/05/2023', atividade: 'Fisioterapia', profissional: 'Dr. Marcos Silva', status: 'Agendado' },
    { id: 7, data: '25/05/2023', atividade: 'Psicoterapia', profissional: 'Dr. Lucas Almeida', status: 'Concluído' },
  ];

  // Função para determinar a cor de fundo com base no status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Concluído': return '#4CAF50'; // Verde
      case 'Cancelado': return '#F44336'; // Vermelho
      case 'Pendente': return '#FFC107'; // Amarelo
      case 'Agendado': return '#2196F3'; // Azul
      default: return '#FFFFFF';
    }
  };

  return (
    <MainLayout 
      title="Histórico" 
      navigation={navigation}
      showBackButton={false}
    >
      <ScrollView style={styles.container}>


        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.column1]}>Data</Text>
          <Text style={[styles.headerText, styles.column2]}>Atividade</Text>
          <Text style={[styles.headerText, styles.column3]}>Profissional</Text>
          <Text style={[styles.headerText, styles.column4]}>Status</Text>
        </View>

        {historicoData.map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.dataRow, 
              { backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#FFFFFF' }
            ]}
          >
            <Text style={[styles.dataText, styles.column1]}>{item.data}</Text>
            <Text style={[styles.dataText, styles.column2]}>{item.atividade}</Text>
            <Text style={[styles.dataText, styles.column3]}>{item.profissional}</Text>
            <View style={[styles.statusCell, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}

          {/* Botão de Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: '#2f6b5e',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dataText: {
    color: '#333',
    textAlign: 'center',
  },
  statusCell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Definição das colunas
  column1: {
    flex: 1, // 20% da largura
  },
  column2: {
    flex: 2, // 30% da largura
  },
  column3: {
    flex: 2, // 30% da largura
  },
  column4: {
    flex: 1, // 20% da largura
  },
  // Estilo do botão de Voltar
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HistoricoScreen;
