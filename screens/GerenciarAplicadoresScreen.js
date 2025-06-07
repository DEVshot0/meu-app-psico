import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GerenciarAplicadoresScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAplicadores = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/aplicator/');
      if (!response.ok) {
        throw new Error('Falha ao buscar aplicadores');
      }
      const aplicadores = await response.json();
      setData(aplicadores);
    } catch (error) {
      console.error('Erro ao buscar aplicadores:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAplicadores();
  }, []);

  const filteredData = data.filter(item =>
    item.full_name && item.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este aplicador?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        style: 'destructive', 
        onPress: () => deleteAplicador(id)
      },
    ]);
  };

  const deleteAplicador = async (id) => {
    try {
      const csrfToken = await AsyncStorage.getItem('csrfToken');
      const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/aplicator/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
      });

      if (response.ok) {
        setData(data.filter(item => item.id !== id));
        Alert.alert('Sucesso', 'Aplicador excluído com sucesso!');
      } else {
        throw new Error('Falha ao excluir aplicador');
      }
    } catch (error) {
      console.error('Erro ao excluir aplicador:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao excluir o aplicador');
    }
  };

  const handleEdit = (aplicador) => {
    navigation.navigate('EditarAplicador', { aplicador });
  };

  if (isLoading) {
    return (
      <MainLayout title="Gerenciar Aplicadores" navigation={navigation} showBackButton={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2f6b5e" />
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Gerenciar Aplicadores" navigation={navigation} showBackButton={true}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar aplicadores: {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => fetchAplicadores()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Gerenciar Aplicadores" 
      navigation={navigation}
      showBackButton={true}
    >
      {/* Botões fixos no topo */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tabButton}
          onPress={() => navigation.navigate('GerenciarProfissionais')}
        >
          <Text style={styles.tabButtonText}>Profissionais</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.tabButtonActive]}>
          <Text style={styles.tabButtonTextActive}>Aplicadores</Text>
        </TouchableOpacity>
      </View>

      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar aplicador"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>

      {/* Lista de aplicadores */}
      <ScrollView style={styles.container}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              onPress={() => handleEdit(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>Nome:</Text> {item.full_name}
                  </Text>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>CPF:</Text> {item.cpf || 'Não informado'}
                  </Text>
                  <Text style={styles.cardLabel}>
                    <Text style={styles.boldText}>Telefone:</Text> {item.phone_number || 'Não informado'}
                  </Text>
                </View>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
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
            {searchQuery ? 'Nenhum aplicador encontrado' : 'Nenhum aplicador cadastrado'}
          </Text>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#2f6b5e',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#2f6b5e',
    fontWeight: 'bold',
  },
  tabButtonTextActive: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
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

export default GerenciarAplicadoresScreen;
