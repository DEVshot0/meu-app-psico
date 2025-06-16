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
import AplicarPlanoScreen from '../screens/AplicarPlanoScreen'
import PlanoAvaliacaoScreen from '../screens/PlanoAvaliacaoScreen';
import ExecucaoPlanoScreen from '../screens/ExecucaoPlanoScreen';
import PlanoAvaliacaoAtividadesScreen from '../screens/PlanoAvaliacaoAtividadesScreen';
import AtividadeExecucaoScreen from '../screens/AtividadeExecucaoScreen';
import PlanoIntervencaoScreen from '../screens/PlanoIntervencaoScreen';
import PlanoIntervencaoAtividadesScreen from '../screens/PlanoIntervencaoAtividadesScreen';
import FinalizacaoScreen from '../screens/FinalizacaoScreen';
import EditarPacienteScreen from '../screens/EditarPacienteScreen';
import GerenciarProfissionaisScreen from '../screens/GerenciarProfissionaisScreen';
import GerenciarAplicadoresScreen from '../screens/GerenciarAplicadoresScreen';
import EditarAplicadorScreen from '../screens/EditarAplicadorScreen';
import EditarProfissionalScreen from '../screens/EditarProfissionalScreen';
import CriarPlanoScreen from '../screens/CriarPlanoScreen';



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
        <Stack.Screen name="Aplicar" component={AplicarPlanoScreen} />
        <Stack.Screen name="PlanoAvaliacao" component={PlanoAvaliacaoScreen} />
        <Stack.Screen name="PlanoIntervencao" component={PlanoIntervencaoScreen} />
        <Stack.Screen name="ExecucaoPlano" component={ExecucaoPlanoScreen} />
        <Stack.Screen name="PlanoAvaliacaoAtividades" component={PlanoAvaliacaoAtividadesScreen} />
        <Stack.Screen name="PlanoIntervencaoAtividades" component={PlanoIntervencaoAtividadesScreen} />
        <Stack.Screen name="AtividadeExecucao" component={AtividadeExecucaoScreen} />
        <Stack.Screen name="FinalizacaoScreen" component={FinalizacaoScreen} />
        <Stack.Screen name="EditarPacienteScreen" component={EditarPacienteScreen} />
        <Stack.Screen name="GerenciarProfissionais" component={GerenciarProfissionaisScreen} />
        <Stack.Screen name="GerenciarAplicadores" component={GerenciarAplicadoresScreen} />
        <Stack.Screen name="EditarAplicador" component={EditarAplicadorScreen} />
        <Stack.Screen name="EditarProfissional" component={EditarProfissionalScreen} />
        <Stack.Screen name="CriarPlano" component={CriarPlanoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;