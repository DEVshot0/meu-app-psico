import { useState, useEffect } from 'react';

export const usePacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPacientes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/patient/');
        const data = await response.json();
        setPacientes(data);
      } catch (error) {
        alert(`Erro ao buscar pacientes: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  return { pacientes, isLoading };
};
