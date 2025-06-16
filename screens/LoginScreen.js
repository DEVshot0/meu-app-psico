import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Keyboard, TouchableWithoutFeedback, Platform,
  StatusBar, KeyboardAvoidingView, ActivityIndicator, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ISClogo from '../assets/ISC.png';
import { apiService } from '../src/services/apiService';


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Preencha e-mail e senha!');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiService('POST', {
        email: username,
        password: password
      }, 'api/v1/login/');

      const userId = data["user id"];
      const level = data.level;

      await AsyncStorage.setItem('userId', String(userId));
      await AsyncStorage.setItem('userLevel', String(level));

      navigation.navigate('Home');
    } catch (error) {
      alert(`Erro ao fazer login: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <StatusBar backgroundColor="#2f6b5e" barStyle="light-content" />
          <View style={styles.logoContainer}>
            <Image source={ISClogo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.mainContent}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={[styles.inputContainer, { marginTop: 15 }]}>
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
              Esqueceu sua senha?{' '}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                Lembrar-me!
              </Text>
            </Text>

            <View style={styles.buttonWrapper}>
              <View style={styles.buttonShadow} />
              <TouchableOpacity
                style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2f6b5e' },
  innerContainer: { flex: 1, justifyContent: 'flex-end' },
  logoContainer: { position: 'absolute', top: '25%', alignSelf: 'center', width: 250, height: 250, justifyContent: 'center', alignItems: 'center', zIndex: 0 },
  logo: { width: '100%', height: '100%' },
  mainContent: { padding: 20, marginBottom: 5, alignItems: 'center', zIndex: 1 },
  whiteBox: { backgroundColor: 'white', width: '100%', minHeight: '22%', borderTopLeftRadius: 40, borderTopRightRadius: 40, justifyContent: 'center', alignItems: 'center', paddingTop: 25, paddingBottom: 20, zIndex: 1 },
  buttonWrapper: { width: '80%', maxWidth: 300, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderColor: '#fff', borderWidth: 1, borderRadius: 30, paddingHorizontal: 15, marginVertical: 10, width: '80%', maxWidth: 300 },
  icon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', paddingVertical: 10, height: 40, fontSize: 16 },
  loginButton: { backgroundColor: '#2f6b5e', borderRadius: 30, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1, width: '100%' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  buttonShadow: { position: 'absolute', bottom: -6, left: '10%', right: '10%', height: 15, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 25, zIndex: 0, transform: [{ scaleY: 0.5 }] },
  registerText: { color: '#666', marginBottom: 15, textAlign: 'center' },
  registerLink: { color: '#2f6b5e', fontWeight: 'bold', textDecorationLine: 'underline' },
});

export default LoginScreen;
