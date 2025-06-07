import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import MainLayout from '../components/MainLayout';

const EditarPacienteScreen = ({ navigation, route }) => {
  const [paciente, setPaciente] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [diagnosesList, setDiagnosesList] = useState([]);
  const [showDiagnosesModal, setShowDiagnosesModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState('');
  const [aplicatorName, setAplicatorName] = useState('');
  const [aplicationDate, setAplicationDate] = useState('');

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/patient/${route.params.patientId}`);
        const data = await response.json();
        setPaciente(data);
      } catch (error) {
        console.error('Erro ao buscar paciente:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do paciente.');
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/diagnosis/`);
        const data = await response.json();
        setDiagnosesList(data);
      } catch (error) {
        console.error('Erro ao buscar diagnoses:', error);
        Alert.alert('Erro', 'Não foi possível carregar os diagnósticos.');
      }
    };

    fetchPaciente();
    fetchDiagnoses();

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatada = `${ano}-${mes}-${dia}`;
    setAplicationDate(dataFormatada);
  }, []);

  const toggleDiagnosis = (id) => {
    let newDiagnoses = [...paciente.diagnoses];
    if (newDiagnoses.includes(id)) {
      newDiagnoses = newDiagnoses.filter((item) => item !== id);
    } else {
      newDiagnoses.push(id);
    }
    setPaciente({ ...paciente, diagnoses: newDiagnoses });
  };

  const handleSave = async () => {
    try {
      const payload = {
        patient_name: paciente.patient_name,
        birth_date: paciente.birth_date,
        gender: paciente.gender,
        nationality: paciente.nationality,
        cpf: paciente.cpf,
        rg: paciente.rg,
        agreement_card: paciente.agreement_card,
        sus_card: paciente.sus_card,
        medical_history: paciente.medical_history,
        allergies: paciente.allergies,
        medication_in_use: paciente.medication_in_use,
        familiar_history: paciente.familiar_history,
        first_consultation: paciente.first_consultation,
        observations: paciente.observations,
        consent_form: paciente.consent_form,
        authorization_to_share_data: paciente.authorization_to_share_data,
        responsible_id: paciente.responsible_id,
        diagnoses: paciente.diagnoses
      };

      console.log('Payload enviado no PUT:', JSON.stringify(payload, null, 2));

      const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/patient/${paciente.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar paciente:', response.status, errorData);
        Alert.alert('Erro', 'Não foi possível atualizar os dados do paciente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar os dados.');
    }
  };

  const handleAction = (action) => {
    if (action === 'Relatórios') {
      navigation.navigate('Relatorios', { patientId: paciente.id });
    } else if (action === 'Novo plano') {
      navigation.navigate('Planos', { patientId: paciente.id });
    } else {
      Alert.alert('Ação', `Você clicou em: ${action}`);
    }
  };

  return (
    <MainLayout 
      title="Editar Paciente" 
      navigation={navigation} 
      showBackButton={true}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={paciente.patient_name || ''}
                onChangeText={(text) => setPaciente({ ...paciente, patient_name: text })}
                placeholder="Nome"
              />
              {/* Adicione os demais campos conforme mostrado anteriormente */}
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDiagnosesModal(true)}
              >
                <Text style={{ color: paciente.diagnoses && paciente.diagnoses.length > 0 ? '#000' : '#999' }}>
                  {paciente.diagnoses && paciente.diagnoses.length > 0
                    ? `Diagnoses selecionadas: ${paciente.diagnoses.join(', ')}`
                    : 'Selecionar Diagnósticos'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showDiagnosesModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDiagnosesModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecione Diagnósticos</Text>
                    {diagnosesList.map((diag) => (
                      <TouchableOpacity
                        key={diag.id}
                        style={styles.checkboxItem}
                        onPress={() => toggleDiagnosis(diag.id)}
                      >
                        <Text style={{ flex: 1 }}>{diag.diagnosis}</Text>
                        <Text>{paciente.diagnoses && paciente.diagnoses.includes(diag.id) ? '✔️' : '⬜️'}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowDiagnosesModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Fechar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </>
          ) : (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Nome:</Text> {paciente.patient_name}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Diagnósticos:</Text> {paciente.diagnoses ? paciente.diagnoses.join(', ') : 'Nenhum'}</Text>
            </>
          )}
        </View>

        {isEditing ? (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.updateButtonText}>Atualizar dados</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => handleAction('Novo plano')}
        >
          <Text style={styles.mainButtonText}>Novo plano</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => handleAction('Relatórios')}
        >
          <Text style={styles.mainButtonText}>Relatórios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => handleAction('Enviar e-mail')}
        >
          <Text style={styles.mainButtonText}>Enviar e-mail</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 40,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2f6b5e',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#2f6b5e',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2f6b5e',
    backgroundColor: 'white',
  },
  updateButton: {
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#2f6b5e',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 25,
    marginBottom: 25,
  },
  updateButtonText: {
    color: '#2f6b5e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    alignSelf: 'center',
    backgroundColor: '#2f6b5e',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: '#2f6b5e',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 15,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f6b5e',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default EditarPacienteScreen;
