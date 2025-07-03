import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de rotação contínua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Transição automática após 3 segundos
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#001122" />
      <LinearGradient
        colors={['#001122', '#003366', '#0066cc']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animação Sentinela */}
          <View style={styles.sentinelContainer}>
            {/* Globo central */}
            <View style={styles.centralGlobe} />
            
            {/* Anéis de vigilância */}
            <Animated.View
              style={[
                styles.vigilanceRing,
                styles.ring1,
                { transform: [{ rotate: rotateInterpolate }] },
              ]}
            />
            <Animated.View
              style={[
                styles.vigilanceRing,
                styles.ring2,
                { transform: [{ rotate: rotateInterpolate }] },
              ]}
            />
            
            {/* Pontos de radar */}
            <View style={[styles.radarPoint, styles.point1]} />
            <View style={[styles.radarPoint, styles.point2]} />
            <View style={[styles.radarPoint, styles.point3]} />
            <View style={[styles.radarPoint, styles.point4]} />
          </View>

          <Text style={styles.title}>SENTINEL</Text>
          <Text style={styles.subtitle}>COPILOT</Text>
          <Text style={styles.tagline}>Gestão Inteligente de Frotas</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  sentinelContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  centralGlobe: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00ff41',
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  vigilanceRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#0066cc',
    borderRadius: 60,
  },
  ring1: {
    width: 80,
    height: 80,
    borderStyle: 'dashed',
  },
  ring2: {
    width: 120,
    height: 120,
    borderStyle: 'dotted',
  },
  radarPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffb800',
  },
  point1: {
    top: 10,
    left: 56,
  },
  point2: {
    top: 56,
    right: 10,
  },
  point3: {
    bottom: 10,
    left: 56,
  },
  point4: {
    top: 56,
    left: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 3,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066cc',
    letterSpacing: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
});

