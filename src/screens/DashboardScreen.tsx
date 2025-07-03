import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Vehicle } from '../types/navigation';

export default function DashboardScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle>({
    id: 'ABC-1234',
    model: 'Semi Truck',
    plate: 'ABC-1234',
    batteryLevel: 87,
    temperature: 23,
    autonomy: 412,
    status: 'connected',
  });

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return '#00ff41';
      case 'maintenance': return '#ffb800';
      case 'disconnected': return '#ff4444';
      default: return '#cccccc';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'maintenance': return 'Manutenção';
      case 'disconnected': return 'Desconectado';
      default: return 'Desconhecido';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.statusBar} 
      />
      <LinearGradient
        colors={theme.gradient}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Dashboard
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Monitoramento em Tempo Real
            </Text>
          </View>
          
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={styles.themeIcon}>
              {isDarkTheme ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status do Veículo */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Status do Veículo
              </Text>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(vehicle.status) }
              ]} />
            </View>
            
            <View style={styles.vehicleInfo}>
              <Text style={[styles.vehicleModel, { color: theme.text }]}>
                {vehicle.model}
              </Text>
              <Text style={[styles.vehiclePlate, { color: theme.textSecondary }]}>
                Placa: {vehicle.plate}
              </Text>
              <Text style={[styles.vehicleStatus, { color: getStatusColor(vehicle.status) }]}>
                {getStatusText(vehicle.status)}
              </Text>
            </View>
          </View>

          {/* Métricas */}
          <View style={styles.metricsGrid}>
            {/* Bateria */}
            <View style={[styles.metricCard, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.metricIcon, { color: theme.accent }]}>🔋</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {vehicle.batteryLevel}%
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Bateria
              </Text>
              <View style={styles.batteryBar}>
                <View 
                  style={[
                    styles.batteryFill,
                    { 
                      width: `${vehicle.batteryLevel}%`,
                      backgroundColor: vehicle.batteryLevel > 20 ? '#00ff41' : '#ff4444'
                    }
                  ]} 
                />
              </View>
            </View>

            {/* Temperatura */}
            <View style={[styles.metricCard, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.metricIcon, { color: theme.accent }]}>🌡️</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {vehicle.temperature}°C
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Temperatura
              </Text>
            </View>

            {/* Autonomia */}
            <View style={[styles.metricCard, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.metricIcon, { color: theme.accent }]}>⚡</Text>
              <Text style={[styles.metricValue, { color: theme.text }]}>
                {vehicle.autonomy}km
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                Autonomia
              </Text>
            </View>
          </View>

          {/* Alertas */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Alertas e Notificações
            </Text>
            
            <View style={styles.alertsList}>
              <View style={styles.alertItem}>
                <View style={[styles.alertIcon, { backgroundColor: '#ffb800' }]}>
                  <Text style={styles.alertIconText}>⚠️</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.text }]}>
                    Manutenção Preventiva
                  </Text>
                  <Text style={[styles.alertDescription, { color: theme.textSecondary }]}>
                    Agendada para próxima semana
                  </Text>
                </View>
              </View>

              <View style={styles.alertItem}>
                <View style={[styles.alertIcon, { backgroundColor: '#0066cc' }]}>
                  <Text style={styles.alertIconText}>📱</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.text }]}>
                    Atualização de Software
                  </Text>
                  <Text style={[styles.alertDescription, { color: theme.textSecondary }]}>
                    Versão 2.1.4 disponível
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Estatísticas Rápidas */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Estatísticas Hoje
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.accent }]}>245km</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Distância
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.accent }]}>4h 32m</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Tempo Ativo
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.accent }]}>65km/h</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Vel. Média
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const darkTheme = {
  gradient: ['#001122', '#003366'],
  statusBar: '#001122',
  text: '#ffffff',
  textSecondary: '#cccccc',
  accent: '#0066cc',
  cardBg: 'rgba(255, 255, 255, 0.1)',
};

const lightTheme = {
  gradient: ['#f0f8ff', '#e6f3ff'],
  statusBar: '#f0f8ff',
  text: '#333333',
  textSecondary: '#666666',
  accent: '#0066cc',
  cardBg: 'rgba(255, 255, 255, 0.8)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  themeToggle: {
    padding: 10,
  },
  themeIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vehicleInfo: {
    gap: 5,
  },
  vehicleModel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  vehiclePlate: {
    fontSize: 14,
  },
  vehicleStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  batteryBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 2,
  },
  alertsList: {
    gap: 15,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertIconText: {
    fontSize: 18,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

