// ExecucaoPlanoScreen.jsx
import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import { useFocusEffect } from '@react-navigation/native';
import { usePlanoExecucao } from '../hooks/usePlanoExecucao';
import { apiService } from '../src/services/apiService';

const ExecucaoPlanoScreen = ({ navigation, route }) => {
  const { patientId, planoId, jsonParcial, behaviors, plan_type: paramPlanType } = route.params;

  const {
    behaviorQueue,
    setBehaviorQueue,
    currentBehaviorIndex,
    currentActivityIndex,
    currentTryIndex,
    setCurrentBehaviorIndex,
    setCurrentActivityIndex,
    setCurrentTryIndex,
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
    getCurrent,
  } = usePlanoExecucao(behaviors);

  const [planType, setPlanType] = React.useState('');

  useEffect(() => {
    const routes = navigation.getState().routes;
    const previousRoute = routes[routes.length - 2];
    const previousName = previousRoute?.name;

    let detectedPlanType = '';
    if (previousName === 'PlanoIntervencaoAtividades') detectedPlanType = 'intervencao';
    else if (previousName === 'PlanoAvaliacaoAtividades') detectedPlanType = 'avaliacao';
    else detectedPlanType = 'desconhecido';

    setPlanType(paramPlanType || detectedPlanType);
  }, [navigation, paramPlanType]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  useEffect(() => {
    stopTimer();
    const { tryData } = getCurrent();
    const sleepTime = parseSleepTime(tryData?.sleep_time);

    const timeout = setTimeout(() => {
      resetTimer();
      startTimer();
    }, sleepTime * 1000);

    return () => clearTimeout(timeout);
  }, [currentBehaviorIndex, currentActivityIndex, currentTryIndex]);

  useFocusEffect(
    useCallback(() => {
      const { tryData } = getCurrent();

      if (tryData?.result !== null && tryData?.result !== undefined) {
        advanceToNextTryOrActivity();
      }
    }, [behaviorQueue, currentBehaviorIndex, currentActivityIndex, currentTryIndex])
  );

  const parseSleepTime = (sleepTime) => {
    if (!sleepTime) return 0;
    if (sleepTime.endsWith('s')) return parseInt(sleepTime.replace('s', ''));
    if (sleepTime.endsWith('m')) return parseInt(sleepTime.replace('m', '')) * 60;
    return 0;
  };

  const advanceToNextTryOrActivity = () => {
    const currentBehavior = behaviorQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];
    const isLastTry = currentTryIndex + 1 >= currentActivity.tries.length;
    const isLastActivity = currentActivityIndex + 1 >= currentBehavior.activities.length;
    const isLastBehavior = currentBehaviorIndex + 1 >= behaviorQueue.length;

    if (!isLastTry) setCurrentTryIndex((prev) => prev + 1);
    else if (!isLastActivity) {
      setCurrentActivityIndex((prev) => prev + 1);
      setCurrentTryIndex(0);
    } else if (!isLastBehavior) {
      setCurrentBehaviorIndex((prev) => prev + 1);
      setCurrentActivityIndex(0);
      setCurrentTryIndex(0);
    } else {
      alert('Plano Finalizado!');
      navigation.navigate('FinalizacaoScreen', { jsonParcial, behaviors: behaviorQueue });
    }
    resetTimer();
  };

  const handleStartActivity = () => {
    stopTimer();
    const updatedQueue = [...behaviorQueue];
    const currentBehavior = updatedQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];
    const currentTry = currentActivity.tries[currentTryIndex];

    currentTry.sleep_time = '5s';
    setBehaviorQueue(updatedQueue);

    navigation.navigate('AtividadeExecucao', {
      activity: currentActivity,
      tryData: currentTry,
      plan_type: planType,
      jsonParcial,
      behaviorQueue: updatedQueue
    });
  };

  const handleSkipAttempts = () => {
    const updatedQueue = [...behaviorQueue];
    const currentBehavior = updatedQueue[currentBehaviorIndex];
    const currentActivity = currentBehavior.activities[currentActivityIndex];

    for (let i = currentTryIndex; i < currentActivity.tries.length; i++) {
      currentActivity.tries[i].result = 'pulado';
      currentActivity.tries[i].time = null;
      currentActivity.tries[i].reward = null;
    }

    setBehaviorQueue(updatedQueue);
    advanceToNextTryOrActivity();
  };

  const formatElapsedTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const { behavior, activity, tryData } = getCurrent();

  return (
    <MainLayout title="Execução do Plano" navigation={navigation} showBackButton={true}>
      <View style={styles.container}>
        {behavior && activity && tryData ? (
          <>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipAttempts}>
              <Text style={styles.skipButtonText}>Pular Tentativas</Text>
            </TouchableOpacity>

            <View style={styles.centerContent}>
              <Text style={styles.activityTitle}>{activity.activity_name}</Text>
              <Text style={styles.triesText}>
                Tentativa {currentTryIndex + 1} de {activity.tries.length}
              </Text>

              <TouchableOpacity style={styles.startButton} onPress={handleStartActivity}>
                <Text style={styles.startButtonText}>Iniciar Tentativa</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.finishedText}>Plano Finalizado!</Text>
        )}

        {behavior && activity && tryData && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Tempo: {formatElapsedTime(elapsedTime)}</Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
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