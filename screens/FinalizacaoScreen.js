import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MainLayout from '../components/MainLayout';
import { apiService } from '../src/services/apiService';

const FinalizacaoScreen = ({ navigation, route }) => {
  const { jsonParcial, behaviors } = route.params;

  const handleEnviar = () => {
    const jsonFinal = {
      ...jsonParcial,
      behaviors: behaviors
    };

    console.log('📤 JSON FINAL A SER ENVIADO:', JSON.stringify(jsonFinal, null, 2));

    alert('✅ Dados do plano finalizados! Confira o console para o JSON gerado.');
  };

  const traduzirResult = (result) => {
    switch (result) {
      case 'fez':
        return 'Fez';
      case 'fez_com_ajuda':
        return 'Fez com ajuda';
      case 'nao_fez':
        return 'Não fez';
      case 'pulado':
        return 'Pulado';
      case null:
      case undefined:
        return 'Não realizado';
      default:
        return result;
    }
  };

  const traduzirReward = (reward) => {
    if (reward === 'Sim') return 'Houve prêmio';
    if (reward === 'Não') return 'Sem prêmio';
    return '-';
  };

  const formatarTempo = (time) => {
    if (!time) return '-';
    return time;
  };

  return (
    <MainLayout title="Finalização do Plano" navigation={navigation} showBackButton={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Resumo da Aplicação</Text>

        <Text style={styles.label}>Paciente: {jsonParcial.patient_name}</Text>
        <Text style={styles.label}>Plano: {jsonParcial.plan_name}</Text>
        <Text style={styles.label}>Aplicador: {jsonParcial.aplicator_name}</Text>
        <Text style={styles.label}>Data da aplicação: {jsonParcial.aplication_date}</Text>

        {behaviors.map((behavior, bIndex) => (
          <View key={bIndex} style={styles.behaviorBlock}>
            <Text style={styles.behaviorTitle}>Comportamento: {behavior.behavior_name}</Text>

            {behavior.activities.map((activity, aIndex) => (
              <View key={aIndex} style={styles.activityBlock}>
                <Text style={styles.activityTitle}>Atividade: {activity.activity_name}</Text>

                {activity.tries.map((tryItem, tIndex) => (
                  <View key={tIndex} style={styles.tryBlock}>
                    <Text style={styles.tryText}>Tentativa {tIndex + 1}:</Text>
                    <Text style={styles.tryDetail}>Resultado: {traduzirResult(tryItem.result)}</Text>
                    <Text style={styles.tryDetail}>Tempo: {formatarTempo(tryItem.time)}</Text>
                    <Text style={styles.tryDetail}>{traduzirReward(tryItem.reward)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.sendButton} onPress={handleEnviar}>
          <Text style={styles.sendButtonText}>Finalizar e Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    marginBottom: 10
  },
  behaviorBlock: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10
  },
  behaviorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  activityBlock: {
    marginBottom: 15,
    paddingLeft: 10
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  tryBlock: {
    marginBottom: 8,
    paddingLeft: 10
  },
  tryText: {
    fontWeight: 'bold'
  },
  tryDetail: {
    fontSize: 14
  },
  sendButton: {
    backgroundColor: '#2f6b5e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default FinalizacaoScreen;
