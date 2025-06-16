// hooks/useDiagnoses.js
import { useState } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../src/services/apiService';

export const useDiagnoses = () => {
  const [diagnoses, setDiagnoses] = useState([]);

  const fetchDiagnoses = async () => {
    try {
      const data = await apiService('GET', null, 'api/v1/diagnosis/');
      setDiagnoses(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os diagnósticos');
    }
  };

  return { diagnoses, fetchDiagnoses };
};
