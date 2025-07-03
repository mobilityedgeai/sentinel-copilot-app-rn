import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase para o projeto Sentinel AI
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Será configurado via environment
  authDomain: "sentinel-ai-769c5.firebaseapp.com",
  databaseURL: "https://sentinel-ai-769c5-default-rtdb.firebaseio.com",
  projectId: "sentinel-ai-769c5",
  storageBucket: "sentinel-ai-769c5.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:android:abcdef1234567890abcdef"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializar Firestore com Database ID específico
const db = getFirestore(app, 'sentinel-ai-nam5');

// Enterprise ID para testes com dados reais
export const ENTERPRISE_ID = "sA9EmrE3ymtnBqJKcYn7";

export { auth, db };
export default app;

