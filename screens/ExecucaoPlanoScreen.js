// ExecucaoPlanoScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const ExecucaoPlanoScreen = ({ navigation, route }) => {
  const { patientId, planoId, jsonParcial, behaviors } = route.params;

  const [behaviorQueue, setBehaviorQueue] = useState(behaviors);
  const [currentBehaviorIndex, setCurrentBehaviorIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentTryIndex, setCurrentTryIndex] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);

  const [planType, setPlanType] = useState('');

  useEffect(() => {
    const routes = navigation.getState().routes;
    const previousRoute = routes[routes.length - 2];
    const previousName = previousRoute?.name;

    let detectedPlanType = '';
    if (previousName === 'PlanoIntervencaoAtividades') {
      detectedPlanType = 'intervencao';
    } else if (previousName === 'PlanoAvaliacaoAtividades') {
      detectedPlanType = 'avaliacao';
    } else {
      detectedPlanType = 'desconhecido';
    }

    const paramPlanType = route.params?.plan_type;
    const finalPlanType = paramPlanType ? paramPlanType : detectedPlanType;
    setPlanType(finalPlanType);

    console.log('ExecucaoPlanoScreen - planType:', finalPlanType);
  }, [navigation, route.params]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    stopTimer();
    const currentTry = getCurrentTry();
    const sleepSeconds = parseSleepTime(currentTry?.sleep_time);

    console.log(`Aguardando sleep_time: ${sleepSeconds}s antes da tentativa`);

    const timeout = setTimeout(() => {
      setElapsedTime(0);
      startTimer();
    }, sleepSeconds * 1000);

    return () => clearTimeout(timeout);
  }, [currentBehaviorIndex, currentActivityIndex, currentTryIndex]);

  useFocusEffect(
    useCallback(() => {
      console.log('✅ ExecucaoPlanoScreen voltou (useFocusEffect)');
      console.log('✅ JSON PARCIAL ATUALIZADO (VOLTOU PARA FOCO):', JSON.stringify({
        ...jsonParcial,
        behaviors: behaviorQueue
      }, null, 2));

      const currentTry = getCurrentTry();
      if (currentTry && currentTry.result !== null && currentTry.result !== undefined) {
        console.log(`👉 Detectado tentativa já concluída (result = ${currentTry.result}), avançando...`);
        advanceToNextTryOrActivity();
      } else {
        console.log(`🟢 Foco na tela, tentativa em andamento...`);
      }
    }, [behaviorQueue, currentBehaviorIndex, currentActivityIndex, currentTryIndex])
  );

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const parseSleepTime = (sleepTimeString) => {
    if (!sleepTimeString) return 0;
    if (sleepTimeString.endsWith('s')) {
      return parseInt(sleepTimeString.replace('s', ''));
    } else if (sleepTimeString.endsWith('m')) {
      return parseInt(sleepTimeString.replace('m', '')) * 60;
    } else {
      return 0;
    }
  };

  const getCurrentTry = () => {
    const currentBehavior = behaviorQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];
    return currentActivity.tries[currentTryIndex];
  };

  const advanceToNextTryOrActivity = () => {
    const isLastTry = currentTryIndex + 1 >= behaviorQueue[currentBehaviorIndex].activities[currentActivityIndex].tries.length;
    const isLastActivity = currentActivityIndex + 1 >= behaviorQueue[currentBehaviorIndex].activities.length;
    const isLastBehavior = currentBehaviorIndex + 1 >= behaviorQueue.length;

    if (!isLastTry) {
      setCurrentTryIndex((prev) => prev + 1);
    } else if (!isLastActivity) {
      setCurrentActivityIndex((prev) => prev + 1);
      setCurrentTryIndex(0);
    } else if (!isLastBehavior) {
      setCurrentBehaviorIndex((prev) => prev + 1);
      setCurrentActivityIndex(0);
      setCurrentTryIndex(0);
    } else {
      alert('Plano Finalizado!');
      navigation.navigate('FinalizacaoScreen', {
        jsonParcial,
        behaviors: behaviorQueue
      });
    }

    setElapsedTime(0);
  };

  const handleStartActivity = () => {
    stopTimer();

    // Atualiza o sleep_time da tentativa (exemplo: 5 segundos)
    const updatedQueue = [...behaviorQueue];
    const currentBehavior = updatedQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];
    const currentTry = currentActivity.tries[currentTryIndex];

    // Atualização dinâmica do sleep_time
    currentTry.sleep_time = '5s'; // aqui você pode colocar lógica para definir dinamicamente

    setBehaviorQueue(updatedQueue);

    console.log(`🟢 Iniciando ATIVIDADE "${currentActivity.activity_name}" | Tentativa ${currentTryIndex + 1} de ${currentActivity.tries.length}`);
    console.log(`✅ sleep_time atual da tentativa ${currentTryIndex + 1}: ${currentTry.sleep_time}`);

    console.log('✅ JSON PARCIAL ATUALIZADO (INICIAR TENTATIVA):', JSON.stringify({
      ...jsonParcial,
      behaviors: updatedQueue
    }, null, 2));

    navigation.navigate('AtividadeExecucao', {
      activity: currentActivity,
      tryData: currentTry,
      plan_type: planType,
      jsonParcial,
      behaviorQueue: updatedQueue
    });
  };

  const handleSkipAttempts = () => {
    console.log('🚫 Pulando tentativas restantes!');

    const updatedQueue = [...behaviorQueue];
    const currentBehavior = updatedQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];

    for (let i = currentTryIndex; i < currentActivity.tries.length; i++) {
      currentActivity.tries[i].result = 'pulado';
      currentActivity.tries[i].time = null;
      currentActivity.tries[i].reward = null;
    }

    console.log(`✅ Tentativa ${currentTryIndex + 1} até ${currentActivity.tries.length} puladas na atividade "${currentActivity.activity_name}"`);

    console.log('✅ JSON PARCIAL ATUALIZADO (PULAR TENTATIVAS):', JSON.stringify({
      ...jsonParcial,
      behaviors: updatedQueue
    }, null, 2));

    setBehaviorQueue(updatedQueue);

    const isLastActivity = currentActivityIndex + 1 >= currentBehavior.activities.length;
    const isLastBehavior = currentBehaviorIndex + 1 >= behaviorQueue.length;

    if (!isLastActivity) {
      setCurrentActivityIndex((prev) => prev + 1);
      setCurrentTryIndex(0);
    } else if (!isLastBehavior) {
      setCurrentBehaviorIndex((prev) => prev + 1);
      setCurrentActivityIndex(0);
      setCurrentTryIndex(0);
    } else {
      alert('Plano Finalizado!');
      navigation.navigate('FinalizacaoScreen', {
        jsonParcial,
        behaviors: updatedQueue
      });
    }

    setElapsedTime(0);
  };

  const formatElapsedTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  };

  const currentBehavior = behaviorQueue[currentBehaviorIndex];
  const currentActivity = currentBehavior?.activities[currentActivityIndex];
  const currentTry = currentActivity?.tries[currentTryIndex];

  return (
    <MainLayout title="Execução do Plano" navigation={navigation} showBackButton={true}>
      <View style={styles.container}>
        {currentBehavior && currentActivity && currentTry ? (
          <>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipAttempts}>
              <Text style={styles.skipButtonText}>Pular Tentativas</Text>
            </TouchableOpacity>

            <View style={styles.centerContent}>
              <Text style={styles.activityTitle}>{currentActivity.activity_name}</Text>
              <Text style={styles.triesText}>
                Tentativa {currentTryIndex + 1} de {currentActivity.tries.length}
              </Text>

              <TouchableOpacity style={styles.startButton} onPress={handleStartActivity}>
                <Text style={styles.startButtonText}>Iniciar Tentativa</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.finishedText}>Plano Finalizado!</Text>
        )}

        {currentBehavior && currentActivity && currentTry && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Tempo: {formatElapsedTime(elapsedTime)}</Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: '#9E9E9E',
    padding: 10,
    borderRadius: 8
  },
  skipButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activityTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  triesText: {
    fontSize: 18,
    marginBottom: 10
  },
  startButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  finishedText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green'
  },
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center'
  },
  timerText: {
    fontSize: 18,
    color: '#333'
  }
});

export default ExecucaoPlanoScreen;
