import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trip } from '../types/navigation';
import { tripService } from '../services/firestoreService';

export default function TripsScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [tripHistory, setTripHistory] = useState<Trip[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const [active, history] = await Promise.all([
        tripService.getActiveTrips(),
        tripService.getTripHistory(10)
      ]);
      
      // Se não há dados do Firestore, usar dados mock
      if (active.length === 0) {
        setActiveTrips(mockActiveTrips);
      } else {
        setActiveTrips(active);
      }
      
      if (history.length === 0) {
        setTripHistory(mockTripHistory);
      } else {
        setTripHistory(history);
      }
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      // Usar dados mock em caso de erro
      setActiveTrips(mockActiveTrips);
      setTripHistory(mockTripHistory);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff41';
      case 'completed': return '#0066cc';
      case 'paused': return '#ffb800';
      default: return '#cccccc';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'completed': return 'Concluída';
      case 'paused': return 'Pausada';
      default: return 'Desconhecido';
    }
  };

  const formatTime = (timeString: string) => {
    // Se for timestamp, converter para formato legível
    if (timeString.includes('h')) {
      return timeString;
    }
    return timeString;
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
              Viagens
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Monitoramento de Rotas
            </Text>
          </View>
          
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={styles.themeIcon}>
              {isDarkTheme ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Viagens Ativas */}
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Viagens Ativas
              </Text>
              <View style={[styles.badge, { backgroundColor: '#00ff41' }]}>
                <Text style={styles.badgeText}>{activeTrips.length}</Text>
              </View>
            </View>

            {activeTrips.length > 0 ? (
              activeTrips.map((trip) => (
                <View key={trip.id} style={styles.tripCard}>
                  <View style={styles.tripHeader}>
                    <View style={styles.routeInfo}>
                      <Text style={[styles.routeText, { color: theme.text }]}>
                        {trip.origin} → {trip.destination}
                      </Text>
                      <Text style={[styles.routeSubtext, { color: theme.textSecondary }]}>
                        {trip.route}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(trip.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(trip.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.tripMetrics}>
                    <View style={styles.metric}>
                      <Text style={[styles.metricIcon, { color: theme.accent }]}>🚛</Text>
                      <Text style={[styles.metricValue, { color: theme.text }]}>
                        {trip.currentSpeed} km/h
                      </Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                        Velocidade
                      </Text>
                    </View>

                    <View style={styles.metric}>
                      <Text style={[styles.metricIcon, { color: theme.accent }]}>📍</Text>
                      <Text style={[styles.metricValue, { color: theme.text }]}>
                        {trip.remainingDistance} km
                      </Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                        Restante
                      </Text>
                    </View>

                    <View style={styles.metric}>
                      <Text style={[styles.metricIcon, { color: theme.accent }]}>⏱️</Text>
                      <Text style={[styles.metricValue, { color: theme.text }]}>
                        {formatTime(trip.estimatedTime)}
                      </Text>
                      <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                        Tempo Est.
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Nenhuma viagem ativa no momento
                </Text>
              </View>
            )}
          </View>

          {/* Histórico de Viagens */}
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Histórico Recente
              </Text>
              <TouchableOpacity>
                <Text style={[styles.viewAllText, { color: theme.accent }]}>
                  Ver Todas
                </Text>
              </TouchableOpacity>
            </View>

            {tripHistory.map((trip) => (
              <View key={trip.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyRoute}>
                    <Text style={[styles.historyRouteText, { color: theme.text }]}>
                      {trip.origin} → {trip.destination}
                    </Text>
                    <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                      {/* Aqui seria formatada a data real */}
                      Hoje, 14:30
                    </Text>
                  </View>
                  <View style={[
                    styles.historyStatus,
                    { backgroundColor: getStatusColor(trip.status) }
                  ]}>
                    <Text style={styles.historyStatusText}>
                      {getStatusText(trip.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.historyStats}>
                  <Text style={[styles.historyStat, { color: theme.textSecondary }]}>
                    Distância: {trip.remainingDistance || 0}km
                  </Text>
                  <Text style={[styles.historyStat, { color: theme.textSecondary }]}>
                    Duração: {formatTime(trip.estimatedTime)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Estatísticas do Dia */}
          <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Estatísticas de Hoje
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: theme.accent }]}>3</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Viagens
                </Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: theme.accent }]}>487km</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Distância
                </Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: theme.accent }]}>7h 45m</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Tempo Total
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

// Dados mock para demonstração
const mockActiveTrips: Trip[] = [
  {
    id: '1',
    origin: 'São Paulo',
    destination: 'Campinas',
    route: 'Rota Anhanguera',
    currentSpeed: 65,
    remainingDistance: 42,
    estimatedTime: '1h 15m',
    status: 'active'
  }
];

const mockTripHistory: Trip[] = [
  {
    id: '2',
    origin: 'Campinas',
    destination: 'Ribeirão Preto',
    route: 'Rota Anhanguera',
    currentSpeed: 0,
    remainingDistance: 0,
    estimatedTime: '2h 30m',
    status: 'completed'
  },
  {
    id: '3',
    origin: 'São Paulo',
    destination: 'Santos',
    route: 'Rodovia Imigrantes',
    currentSpeed: 0,
    remainingDistance: 0,
    estimatedTime: '1h 45m',
    status: 'completed'
  }
];

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
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tripCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeSubtext: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tripMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  historyCard: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyRoute: {
    flex: 1,
  },
  historyRouteText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyStatusText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyStats: {
    flexDirection: 'row',
    gap: 15,
  },
  historyStat: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
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

