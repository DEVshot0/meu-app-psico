// AtividadeExecucaoScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MainLayout from '../components/MainLayout';

const AtividadesScreen = ({ navigation, route }) => {
  const { activity, tryData, plan_type, jsonParcial, behaviorQueue } = route.params;

  const [timer, setTimer] = useState(600);
  const [showPremioModal, setShowPremioModal] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResult = (result) => {
    const executionTime = `${600 - timer}s`;

    if (plan_type === 'intervencao' && (result === 'fez' || result === 'fez_com_ajuda')) {
      setPendingResult({ result, executionTime });
      setShowPremioModal(true);
    } else {
      tryData.result = result;
      tryData.time = executionTime;
      tryData.reward = null;

      console.log('✅ JSON PARCIAL ATUALIZADO (ATIVIDADE RESULTADO):', JSON.stringify({
        ...jsonParcial,
        behaviors: behaviorQueue
      }, null, 2));

      navigation.goBack();
    }
  };

  const handlePremioResponse = (houvePremio) => {
    console.log(`Premio: ${houvePremio ? 'Sim' : 'Não'}`);
    setShowPremioModal(false);

    tryData.result = pendingResult.result;
    tryData.time = pendingResult.executionTime;
    tryData.reward = houvePremio ? 'Sim' : 'Não';

    console.log('✅ JSON PARCIAL ATUALIZADO (ATIVIDADE RESULTADO + PREMIO):', JSON.stringify({
      ...jsonParcial,
      behaviors: behaviorQueue
    }, null, 2));

    navigation.goBack();
  };

  const handleSkipActivity = () => {
    console.log('Atividade pulada!');

    tryData.result = 'pulado';
    tryData.time = null;
    tryData.reward = null;

    console.log('✅ JSON PARCIAL ATUALIZADO (ATIVIDADE PULADA):', JSON.stringify({
      ...jsonParcial,
      behaviors: behaviorQueue
    }, null, 2));

    navigation.goBack();
  };

  return (
    <MainLayout title="Execução da Atividade" navigation={navigation} showBackButton={false}>
      <View style={styles.container}>
        <Text style={styles.activityName}>{activity.activity_name}</Text>
        <Text style={styles.timer}>{formatTime(timer)}</Text>

        <TouchableOpacity
          style={[styles.resultButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleResult('fez')}
        >
          <Text style={styles.resultButtonText}>Fez</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resultButton, { backgroundColor: '#FFC107' }]}
          onPress={() => handleResult('fez_com_ajuda')}
        >
          <Text style={styles.resultButtonText}>Fez com ajuda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.resultButton, { backgroundColor: '#F44336' }]}
          onPress={() => handleResult('nao_fez')}
        >
          <Text style={styles.resultButtonText}>Não fez</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkipActivity}
        >
          <Text style={styles.skipButtonText}>Pular Atividade</Text>
        </TouchableOpacity>

        <Modal
          visible={showPremioModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPremioModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Houve prêmio?</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handlePremioResponse(true)}
                >
                  <Text style={styles.modalButtonText}>Sim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handlePremioResponse(false)}
                >
                  <Text style={styles.modalButtonText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  activityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30
  },
  resultButton: {
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15
  },
  resultButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  skipButton: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    padding: 15,
    backgroundColor: '#9E9E9E',
    borderRadius: 10,
    alignItems: 'center'
  },
  skipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default AtividadesScreen;
