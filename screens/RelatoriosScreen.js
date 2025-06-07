import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import MainLayout from '../components/MainLayout';

// Dados simulados
const applications = [
  {
    application_id: 1,
    patient_name: "João da Silva",
    plan_name: "Plano Intervencao 1",
    aplication_date: "04/06/2025",
    aplicator_name: "Carlos Mendes",
    behaviors: [
      {
        behavior_name: "Comportamento A",
        activities: [
          {
            activity_name: "Atividade A1",
            tries: [
              { sleep_time: "5s", result: "fez", time: "3s", reward: "Sim" },
              { sleep_time: "5s", result: "fez_com_ajuda", time: "5s", reward: "Não" },
              { sleep_time: "5s", result: "nao_fez", time: "4s", reward: null }
            ]
          }
        ]
      }
    ]
  },
  {
    application_id: 2,
    patient_name: "Maria Oliveira",
    plan_name: "Plano Avaliação Cognitiva",
    aplication_date: "03/06/2025",
    aplicator_name: "Fernanda Lima",
    behaviors: [
      {
        behavior_name: "Memória Curta",
        activities: [
          {
            activity_name: "Repetir Palavras",
            tries: [
              { sleep_time: "5s", result: "fez", time: "2s", reward: "Sim" },
              { sleep_time: "5s", result: "fez", time: "1s", reward: "Sim" }
            ]
          }
        ]
      }
    ]
  },
];

const RelatoriosScreen = ({ navigation }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  const formatDateShort = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    const shortYear = year.slice(-2);
    return `${day}/${month}/${shortYear}`;
  };

  return (
    <MainLayout 
      title="Relatórios" 
      navigation={navigation}
      showBackButton={false}
    >
      <ScrollView style={styles.container}>

        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, styles.columnDate]}>Data</Text>
          <Text style={[styles.headerText, styles.columnPaciente]}>Paciente</Text>
          <Text style={[styles.headerText, styles.columnPlano]}>Plano</Text>
        </View>

        {/* Lista */}
        {applications.map((item, index) => (
          <TouchableOpacity 
            key={item.application_id} 
            style={[
              styles.dataRow, 
              { backgroundColor: index % 2 === 0 ? '#F5F5F5' : '#FFFFFF' }
            ]}
            onPress={() => setSelectedApplication(item)}
          >
            <Text style={[styles.dataText, styles.columnDate]}>{formatDateShort(item.aplication_date)}</Text>
            <Text style={[styles.dataText, styles.columnPaciente]}>{item.patient_name}</Text>
            <Text style={[styles.dataText, styles.columnPlano]}>{item.plan_name}</Text>
          </TouchableOpacity>
        ))}

        {/* Botão de Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de detalhes */}
      <Modal
        visible={!!selectedApplication}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedApplication(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedApplication && (
              <>
                <Text style={styles.modalTitle}>Detalhes da Aplicação</Text>

                <Text style={styles.modalLabel}>Paciente: {selectedApplication.patient_name}</Text>
                <Text style={styles.modalLabel}>Plano: {selectedApplication.plan_name}</Text>
                <Text style={styles.modalLabel}>Aplicador: {selectedApplication.aplicator_name}</Text>
                <Text style={styles.modalLabel}>Data: {formatDateShort(selectedApplication.aplication_date)}</Text>

                <ScrollView style={styles.modalScroll}>
                  {selectedApplication.behaviors.map((behavior, bIndex) => (
                    <View key={bIndex} style={styles.modalBlock}>
                      <Text style={styles.modalSubTitle}>Comportamento: {behavior.behavior_name}</Text>
                      {behavior.activities.map((activity, aIndex) => (
                        <View key={aIndex} style={styles.modalSubBlock}>
                          <Text style={styles.modalActivityTitle}>Atividade: {activity.activity_name}</Text>

                          {/* Cabeçalho da tabela */}
                          <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Ação</Text>
                            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Resultado</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Tempo</Text>
                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Reforço</Text>
                          </View>

                          {activity.tries.map((tryItem, tIndex) => (
                            <View key={tIndex} style={styles.tableRow}>
                              <Text style={[styles.tableCell, { flex: 1 }]}>{tIndex + 1}</Text>
                              <Text style={[styles.tableCell, { flex: 2 }]}>{mapResult(tryItem.result)}</Text>
                              <Text style={[styles.tableCell, { flex: 1 }]}>{tryItem.time}</Text>
                              <Text style={[styles.tableCell, { flex: 1 }]}>{tryItem.reward ?? ''}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity 
                  onPress={() => setSelectedApplication(null)} 
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </MainLayout>
  );
};

const mapResult = (result) => {
  switch (result) {
    case 'fez': return 'Fez';
    case 'fez_com_ajuda': return 'Fez com ajuda';
    case 'nao_fez': return 'Não fez';
    case 'pulado': return 'Pulado';
    default: return 'N/A';
  }
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
  columnDate: { flex: 1.2 },
  columnPaciente: { flex: 2 },
  columnPlano: { flex: 2 },

  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalScroll: {
    marginTop: 15,
  },
  modalBlock: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  modalSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubBlock: {
    marginBottom: 10,
  },
  modalActivityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 6,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2f6b5e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RelatoriosScreen;
