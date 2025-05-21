// src/navigation/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AtividadesScreen from '../screens/AtividadesScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import PacienteScreen from '../screens/PacienteScreen';
import PlanosScreen from '../screens/PlanosScreen';
import ProfissionalScreen from '../screens/ProfissionalScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true, // Habilita gestos de voltar
          cardStyle: { backgroundColor: '#fff' } // Fundo branco para todas as telas
        }}
      >
        {/* Fluxo de Autenticação */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Tela Principal */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Menu e Sub-telas */}
        <Stack.Screen name="Atividades" component={AtividadesScreen} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
        <Stack.Screen name="Historico" component={HistoricoScreen} />
        <Stack.Screen name="Paciente" component={PacienteScreen} />
        <Stack.Screen name="Planos" component={PlanosScreen} />
        <Stack.Screen name="Profissional" component={ProfissionalScreen} />
        <Stack.Screen name="Relatorios" component={RelatoriosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;