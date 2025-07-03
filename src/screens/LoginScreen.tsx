import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [cpfOrCode, setCpfOrCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleLogin = async () => {
    if (!cpfOrCode.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      // Validar credenciais localmente primeiro
      const validCredentials = [
        { cpf: '123.456.789-00', password: '123456' },
        { cpf: '12345678900', password: '123456' },
        { cpf: 'MOT001', password: '123456' },
        { cpf: 'motorista01', password: '123456' },
        { cpf: 'admin', password: '123456' },
      ];

      const isValid = validCredentials.some(
        cred => cred.cpf === cpfOrCode && cred.password === password
      );

      if (isValid) {
        // Simular login com Firebase usando email fictício
        const email = `${cpfOrCode.replace(/[^a-zA-Z0-9]/g, '')}@sentinel.local`;
        
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            // Criar usuário se não existir
            await createUserWithEmailAndPassword(auth, email, password);
          } else {
            throw error;
          }
        }

        setTimeout(() => {
          setLoading(false);
          onLogin();
        }, 1500);
      } else {
        setLoading(false);
        Alert.alert('Erro', 'CPF/Código ou senha inválidos');
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert('Erro', 'Falha na autenticação: ' + error.message);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar 
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.statusBar} 
      />
      <LinearGradient
        colors={theme.gradient}
        style={styles.gradient}
      >
        <View style={styles.loginContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>SENTINEL</Text>
            <Text style={[styles.subtitle, { color: theme.accent }]}>COPILOT</Text>
            
            <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
              <Text style={[styles.themeText, { color: theme.text }]}>
                {isDarkTheme ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              CPF ou Código do Motorista
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBg, 
                borderColor: theme.border,
                color: theme.text 
              }]}
              value={cpfOrCode}
              onChangeText={setCpfOrCode}
              placeholder="Digite seu CPF ou código"
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: theme.text }]}>Senha</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBg, 
                borderColor: theme.border,
                color: theme.text 
              }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              placeholderTextColor={theme.placeholder}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.accent }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Credenciais de teste */}
            <View style={styles.testCredentials}>
              <Text style={[styles.testTitle, { color: theme.textSecondary }]}>
                Credenciais de Teste:
              </Text>
              <Text style={[styles.testText, { color: theme.textSecondary }]}>
                CPF: 123.456.789-00
              </Text>
              <Text style={[styles.testText, { color: theme.textSecondary }]}>
                Senha: 123456
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const darkTheme = {
  gradient: ['#001122', '#003366', '#0066cc'],
  statusBar: '#001122',
  text: '#ffffff',
  textSecondary: '#cccccc',
  accent: '#0066cc',
  inputBg: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)',
  placeholder: '#999999',
};

const lightTheme = {
  gradient: ['#f0f8ff', '#e6f3ff', '#cce7ff'],
  statusBar: '#f0f8ff',
  text: '#333333',
  textSecondary: '#666666',
  accent: '#0066cc',
  inputBg: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(0, 0, 0, 0.2)',
  placeholder: '#999999',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 2,
  },
  themeToggle: {
    position: 'absolute',
    top: -20,
    right: 0,
    padding: 10,
  },
  themeText: {
    fontSize: 24,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testCredentials: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  testTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  testText: {
    fontSize: 12,
  },
});

