import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import MainLayout from '../components/MainLayout';

const EditarAplicadorScreen = ({ navigation, route }) => {
  const [aplicator, setAplicator] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAplicator = async () => {
      try {
        const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/aplicator/${route.params.aplicator.id}/`);
        const data = await response.json();
        setAplicator(data);
      } catch (error) {
        console.error('Erro ao buscar aplicador:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do aplicador.');
      }
    };

    fetchAplicator();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        role: "aplicator",
        full_name: aplicator.full_name,
        birth_date: aplicator.birth_date,
        gender: aplicator.gender,
        nationality: aplicator.nationality,
        address: aplicator.address,
        phone_number: aplicator.phone_number,
        cpf: aplicator.cpf,
        rg: aplicator.rg,
        academic_background: aplicator.academic_background,
        attachments: aplicator.attachments,
        position: aplicator.position,
        department: aplicator.department,
        admission_date: aplicator.admission_date,
        work_scale: aplicator.work_scale,
        observations: aplicator.observations,
        user_id: aplicator.user_id
      };

      console.log('Payload enviado no PUT:', JSON.stringify(payload, null, 2));

      const response = await fetch(`https://iscdeploy.pythonanywhere.com/api/v1/aplicator/${aplicator.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados do aplicador atualizados com sucesso!');
      } else {
        const errorData = await response.json();
        console.error('Erro ao atualizar aplicador:', response.status, errorData);
        Alert.alert('Erro', 'Não foi possível atualizar os dados do aplicador.');
      }
    } catch (error) {
      console.error('Erro ao atualizar aplicador:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar atualizar os dados.');
    }
  };

  const handleApplyPlan = () => {
    const jsonParcial = {
      patient_name: "", // será selecionado depois
      plan_name: "",    // será preenchido depois
      aplication_date: new Date().toISOString().slice(0, 10),
      aplicator_name: aplicator.full_name,
      behaviors: []
    };

    console.log('JSON PARCIAL ATÉ O MOMENTO:', JSON.stringify(jsonParcial, null, 2));

    navigation.navigate('AplicarPlano', { jsonParcial });
  };

  return (
    <MainLayout 
      title="Editar Aplicador" 
      navigation={navigation} 
      showBackButton={true}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={aplicator.full_name || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, full_name: text })}
                placeholder="Nome do Aplicador"
              />
              <TextInput
                style={styles.input}
                value={aplicator.birth_date || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, birth_date: text })}
                placeholder="Data de Nascimento (AAAA-MM-DD)"
              />
              <TextInput
                style={styles.input}
                value={aplicator.gender || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, gender: text })}
                placeholder="Gênero"
              />
              <TextInput
                style={styles.input}
                value={aplicator.cpf || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, cpf: text })}
                placeholder="CPF"
              />
              <TextInput
                style={styles.input}
                value={aplicator.phone_number || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, phone_number: text })}
                placeholder="Telefone"
              />
              <TextInput
                style={styles.input}
                value={aplicator.position || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, position: text })}
                placeholder="Cargo"
              />
              <TextInput
                style={styles.input}
                value={aplicator.department || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, department: text })}
                placeholder="Departamento"
              />
              <TextInput
                style={styles.input}
                value={aplicator.observations || ''}
                onChangeText={(text) => setAplicator({ ...aplicator, observations: text })}
                placeholder="Observações"
                multiline
              />
            </>
          ) : (
            <>
              <Text style={styles.label}><Text style={styles.bold}>Nome:</Text> {aplicator.full_name}</Text>
              <Text style={styles.label}><Text style={styles.bold}>CPF:</Text> {aplicator.cpf}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Telefone:</Text> {aplicator.phone_number}</Text>
              <Text style={styles.label}><Text style={styles.bold}>Cargo:</Text> {aplicator.position}</Text>
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
          onPress={handleApplyPlan}
        >
          <Text style={styles.mainButtonText}>Aplicar Plano</Text>
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
});

export default EditarAplicadorScreen;
