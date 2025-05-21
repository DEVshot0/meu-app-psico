import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';

const RelatoriosScreen = ({ navigation }) => {
  // Dados mockados dos relatórios
  const relatoriosData = [
    { id: 1, nome: 'João Silva', atividade: 'Terapia Ocupacional', status: 'Concluído' },
    { id: 2, nome: 'Maria Oliveira', atividade: 'Fisioterapia', status: 'Em Andamento' },
    { id: 3, nome: 'Carlos Souza', atividade: 'Avaliação Psicológica', status: 'Concluído' },
    { id: 4, nome: 'Ana Costa', atividade: 'Fonoaudiologia', status: 'Em Andamento' },
    { id: 5, nome: 'Lucas Almeida', atividade: 'Psicoterapia', status: 'Concluído' },
  ];

  // Função para determinar a cor de fundo com base no status
  const getStatusColor = (status) => {
    switch(status) {
      case 'Concluído': return '#4CAF50'; // Verde
      case 'Em Andamento': return '#FFC107'; // Amarelo
      default: return '#FFFFFF';
    }
  };

  return (
    <MainLayout 
      title="Relatórios" 
      navigation={navigation}
      showBackButton={false}
    >
      <ScrollView style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.column1]}>Nome</Text>
          <Text style={[styles.headerText, styles.column2]}>Atividade</Text>
          <Text style={[styles.headerText, styles.column3]}>Status</Text>
        </View>

        {relatoriosData.map((item, index) => (
          <View 
            key={item.id} 
            style={[
              styles.dataRow, 
              { backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#FFFFFF' }
            ]}
          >
            <Text style={[styles.dataText, styles.column1]}>{item.nome}</Text>
            <Text style={[styles.dataText, styles.column2]}>{item.atividade}</Text>
            <View style={[styles.statusCell, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão de Voltar */}
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
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
    flex: 2, // 40% da largura
  },
  column2: {
    flex: 3, // 40% da largura
  },
  column3: {
    flex: 2, // 20% da largura
  },
  // Estilo do botão de voltar
  buttonWrapper: {
    padding: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RelatoriosScreen;
