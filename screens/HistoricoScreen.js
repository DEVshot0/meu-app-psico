import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';
import AddPatientForm from '../components/AddPatientForm';
import { apiService } from '../src/services/apiService';

const HistoricoScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchPacientes = async () => {
    setIsLoading(true);
    try {
      const pacientes = await apiService('GET', null, 'api/v1/patient/');
      setData(pacientes);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const filteredData = data.filter(item =>
    item.patient_name && item.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setShowFormModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    fetchPacientes();
    Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este paciente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deletePatient(id)
      },
    ]);
  };

  const deletePatient = async (id) => {
    try {
      const csrfToken = await AsyncStorage.getItem('csrfToken');
      await apiService('DELETE', null, `api/v1/patient/${id}/`, csrfToken);
      setData(data.filter(item => item.id !== id));
      Alert.alert('Sucesso', 'Paciente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao excluir o paciente');
    }
  };

  const handleEditPatient = (patient) => {
    navigation.navigate('EditarPacienteScreen', {
      patientId: patient.id,
      onPatientUpdated: (updatedPatient) => {
        setData(data.map(p => p.id === updatedPatient.id ? updatedPatient : p));
      }
    });
  };

  if (isLoading) {
    return (
      <MainLayout title="Histórico" navigation={navigation} showBackButton={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f6b5e" />
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Histórico" navigation={navigation} showBackButton={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar pacientes: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPacientes}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Histórico" navigation={navigation} showBackButton={false}>
      <ScrollView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar paciente"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        </View>

        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => handleEditPatient(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>Nome:</Text> {item.patient_name}
                  </Text>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>Data Nasc.:</Text> {item.birth_date}
                  </Text>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>Gênero:</Text> {item.gender}
                  </Text>
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditPatient(item);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={24} color="#2980b9" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.trashButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>
            {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
          </Text>
        )}

        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Text style={styles.addButtonText}>Adicionar novo</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showFormModal}
        animationType="slide"
        onRequestClose={() => setShowFormModal(false)}
      >
        <MainLayout
          title="Cadastrar Paciente"
          navigation={navigation}
          showBackButton={true}
          onBackPress={() => setShowFormModal(false)}
        >
          <AddPatientForm
            onCancel={() => setShowFormModal(false)}
            onSuccess={handleFormSuccess}
          />
        </MainLayout>
      </Modal>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEDEDE',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderColor: '#2f6b5e',
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 16,
    color: '#2f6b5e',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
  },
  trashButton: {
    marginLeft: 0,
  },
  addButton: {
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2f6b5e',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 50,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default HistoricoScreen;
