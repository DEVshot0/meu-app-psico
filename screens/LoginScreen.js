import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Função para obter e armazenar o token CSRF
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/get-csrf-token/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao obter token CSRF');
      }

      const data = await response.json();
      const token = data.csrfToken;
      
      setCsrfToken(token);
      await AsyncStorage.setItem('csrfToken', token);
      
      return token;
    } catch (error) {
      console.error('Erro ao obter token CSRF:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeCsrfToken = async () => {
      await fetchCsrfToken();
    };
    
    initializeCsrfToken();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Preencha e-mail e senha!');
      return;
    }

    if (!csrfToken) {
      alert('Aguarde, estamos verificando a segurança...');
      return;
    }
  
    try {
      const response = await fetch('https://iscdeploy.pythonanywhere.com/api/v1/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://iscdeploy.pythonanywhere.com/',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
  
      const contentType = response.headers.get('content-type');
  
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Resposta inesperada da API:\n${text}`);
      }
  
      const data = await response.json();
  
      if (response.ok) {
        const userId = data["user id"];
        // MODIFICAÇÃO AQUI - sempre salva level 4 para teste
        const level = 3; // Mock para teste, substitui data.level
        
        await AsyncStorage.setItem('userId', String(userId));
        await AsyncStorage.setItem('userLevel', String(level));
  
        alert(`Login realizado com sucesso!\nID: ${userId}\nNível: ${level} (mockado para testes)`);
        navigation.navigate('Home');
      } else {
        alert(`Erro ao fazer login: ${data?.detail || 'Verifique seus dados'}`);
      }
  
    } catch (error) {
      alert(`Erro de conexão: ${error.message}`);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <StatusBar backgroundColor="#2f6b5e" barStyle="light-content" />
          
          <View style={styles.circle} />
          
          <View style={styles.mainContent}>
            <Text style={styles.title}>Aplicativo</Text>
            <Text style={styles.subtitle}>ISC</Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
              <TextInput 
                placeholder="Usuário"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
            </View>
            
            <View style={[styles.inputContainer, {marginTop: 15}]}>
              <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
              <TextInput 
                placeholder="Senha"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>
          
          <View style={styles.whiteBox}>
            <Text style={styles.registerText}>
              Ainda não é usuário?{' '}
              <Text 
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                Cadastre-se!
              </Text>
            </Text>
            
            <View style={styles.buttonWrapper}>
              <View style={styles.buttonShadow} />
              <TouchableOpacity 
                style={styles.loginButton} 
                activeOpacity={0.8}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f6b5e',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  circle: {
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#5c9486',
    zIndex: 0,
  },
  mainContent: {
    padding: 20,
    marginBottom: 5,
    alignItems: 'center',
    zIndex: 1,
  },
  whiteBox: {
    backgroundColor: 'white',
    width: '100%',
    minHeight: '22%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20,
    zIndex: 1,
  },
  buttonWrapper: {
    width: '80%',
    maxWidth: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: '#fbb040',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '80%',
    maxWidth: 300,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    height: 40,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2f6b5e',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonShadow: {
    position: 'absolute',
    bottom: -6,
    left: '10%',
    right: '10%',
    height: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 25,
    zIndex: 0,
    transform: [{ scaleY: 0.5 }],
  },
  registerText: {
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  registerLink: {
    color: '#2f6b5e',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;