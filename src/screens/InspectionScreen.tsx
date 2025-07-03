import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Inspection } from '../types/navigation';
import { inspectionService } from '../services/firestoreService';

export default function InspectionScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [newInspection, setNewInspection] = useState({
    vehicleId: 'ABC-1234',
    type: 'Inspeção Pré-Viagem',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      const data = await inspectionService.getInspections();
      if (data.length === 0) {
        // Usar dados mock se não houver dados do Firestore
        setInspections(mockInspections);
      } else {
        setInspections(data);
      }
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
      setInspections(mockInspections);
    }
  };

  const handleCreateInspection = async () => {
    if (!newInspection.type.trim()) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de inspeção');
      return;
    }

    setLoading(true);
    try {
      const inspectionData = {
        ...newInspection,
        status: 'pending' as const,
        date: new Date(),
      };

      const id = await inspectionService.createInspection(inspectionData);
      
      if (id) {
        // Adicionar à lista local
        const newInsp: Inspection = {
          id,
          ...inspectionData,
        };
        setInspections(prev => [newInsp, ...prev]);
        
        setShowNewInspection(false);
        setNewInspection({
          vehicleId: 'ABC-1234',
          type: 'Inspeção Pré-Viagem',
          notes: '',
        });
        
        Alert.alert('Sucesso', 'Inspeção criada com sucesso!');
      } else {
        Alert.alert('Erro', 'Falha ao criar inspeção');
      }
    } catch (error) {
      console.error('Erro ao criar inspeção:', error);
      Alert.alert('Erro', 'Falha ao criar inspeção');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#00ff41';
      case 'pending': return '#ffb800';
      case 'failed': return '#ff4444';
      default: return '#cccccc';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const inspectionTypes = [
    'Inspeção Pré-Viagem',
    'Inspeção Pós-Viagem',
    'Manutenção Preventiva',
    'Verificação de Segurança',
    'Inspeção de Bateria',
    'Verificação de Pneus',
  ];

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
              Inspeções
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Sistema Inteligente de Inspeção
            </Text>
          </View>
          
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={styles.themeIcon}>
              {isDarkTheme ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Central de Inspeção */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Central de Inspeção
              </Text>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.accent }]}
                onPress={() => setShowNewInspection(true)}
              >
                <Text style={styles.addButtonText}>+ Nova</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inspectionStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#00ff41' }]}>12</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Concluídas
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ffb800' }]}>3</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Pendentes
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ff4444' }]}>1</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Falharam
                </Text>
              </View>
            </View>
          </View>

          {/* IA Inteligente */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              🤖 Assistente IA
            </Text>
            
            <View style={styles.aiSuggestions}>
              <View style={styles.aiSuggestion}>
                <Text style={[styles.aiIcon, { color: theme.accent }]}>💡</Text>
                <View style={styles.aiContent}>
                  <Text style={[styles.aiTitle, { color: theme.text }]}>
                    Sugestão Inteligente
                  </Text>
                  <Text style={[styles.aiDescription, { color: theme.textSecondary }]}>
                    Baseado no histórico, recomendamos inspeção de bateria para o veículo ABC-1234
                  </Text>
                </View>
              </View>

              <View style={styles.aiSuggestion}>
                <Text style={[styles.aiIcon, { color: theme.accent }]}>🔍</Text>
                <View style={styles.aiContent}>
                  <Text style={[styles.aiTitle, { color: theme.text }]}>
                    Detecção de Padrões
                  </Text>
                  <Text style={[styles.aiDescription, { color: theme.textSecondary }]}>
                    Identificamos possível duplicata na inspeção de pneus. Verificar necessidade.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Lista de Inspeções */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Inspeções Recentes
            </Text>
            
            {inspections.map((inspection) => (
              <View key={inspection.id} style={styles.inspectionCard}>
                <View style={styles.inspectionHeader}>
                  <View style={styles.inspectionInfo}>
                    <Text style={[styles.inspectionType, { color: theme.text }]}>
                      {inspection.type}
                    </Text>
                    <Text style={[styles.inspectionVehicle, { color: theme.textSecondary }]}>
                      Veículo: {inspection.vehicleId}
                    </Text>
                    <Text style={[styles.inspectionDate, { color: theme.textSecondary }]}>
                      {inspection.date.toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  
                  <View style={[
                    styles.inspectionStatus,
                    { backgroundColor: getStatusColor(inspection.status) }
                  ]}>
                    <Text style={styles.inspectionStatusText}>
                      {getStatusText(inspection.status)}
                    </Text>
                  </View>
                </View>

                {inspection.notes && (
                  <Text style={[styles.inspectionNotes, { color: theme.textSecondary }]}>
                    {inspection.notes}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Formulários Inteligentes */}
          <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Formulários Inteligentes
            </Text>
            
            <View style={styles.formTemplates}>
              <TouchableOpacity style={styles.templateCard}>
                <Text style={[styles.templateIcon, { color: theme.accent }]}>📋</Text>
                <Text style={[styles.templateTitle, { color: theme.text }]}>
                  Pré-Viagem
                </Text>
                <Text style={[styles.templateDescription, { color: theme.textSecondary }]}>
                  Checklist completo antes da viagem
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.templateCard}>
                <Text style={[styles.templateIcon, { color: theme.accent }]}>🔧</Text>
                <Text style={[styles.templateTitle, { color: theme.text }]}>
                  Manutenção
                </Text>
                <Text style={[styles.templateDescription, { color: theme.textSecondary }]}>
                  Verificações de manutenção preventiva
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Modal Nova Inspeção */}
        <Modal
          visible={showNewInspection}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowNewInspection(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.cardBg }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Nova Inspeção
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Veículo</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.border,
                    color: theme.text 
                  }]}
                  value={newInspection.vehicleId}
                  onChangeText={(text) => setNewInspection(prev => ({ ...prev, vehicleId: text }))}
                  placeholder="ID do Veículo"
                  placeholderTextColor={theme.placeholder}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Tipo de Inspeção</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.typeSelector}>
                    {inspectionTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          newInspection.type === type && { backgroundColor: theme.accent }
                        ]}
                        onPress={() => setNewInspection(prev => ({ ...prev, type }))}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          { color: newInspection.type === type ? '#ffffff' : theme.text }
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Observações</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: theme.inputBg, 
                    borderColor: theme.border,
                    color: theme.text 
                  }]}
                  value={newInspection.notes}
                  onChangeText={(text) => setNewInspection(prev => ({ ...prev, notes: text }))}
                  placeholder="Observações adicionais..."
                  placeholderTextColor={theme.placeholder}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowNewInspection(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton, { backgroundColor: theme.accent }]}
                  onPress={handleCreateInspection}
                  disabled={loading}
                >
                  <Text style={styles.createButtonText}>
                    {loading ? 'Criando...' : 'Criar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

// Dados mock para demonstração
const mockInspections: Inspection[] = [
  {
    id: '1',
    vehicleId: 'ABC-1234',
    type: 'Inspeção Pré-Viagem',
    status: 'completed',
    date: new Date(),
    notes: 'Todos os sistemas verificados e funcionando normalmente.'
  },
  {
    id: '2',
    vehicleId: 'ABC-1234',
    type: 'Verificação de Bateria',
    status: 'pending',
    date: new Date(),
    notes: 'Aguardando verificação do nível de carga.'
  },
  {
    id: '3',
    vehicleId: 'XYZ-5678',
    type: 'Manutenção Preventiva',
    status: 'failed',
    date: new Date(Date.now() - 86400000), // Ontem
    notes: 'Detectado problema no sistema de freios. Requer atenção imediata.'
  }
];

const darkTheme = {
  gradient: ['#001122', '#003366'],
  statusBar: '#001122',
  text: '#ffffff',
  textSecondary: '#cccccc',
  accent: '#0066cc',
  cardBg: 'rgba(255, 255, 255, 0.1)',
  inputBg: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)',
  placeholder: '#999999',
};

const lightTheme = {
  gradient: ['#f0f8ff', '#e6f3ff'],
  statusBar: '#f0f8ff',
  text: '#333333',
  textSecondary: '#666666',
  accent: '#0066cc',
  cardBg: 'rgba(255, 255, 255, 0.8)',
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
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inspectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  aiSuggestions: {
    gap: 15,
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiIcon: {
    fontSize: 20,
  },
  aiContent: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  aiDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  inspectionCard: {
    marginBottom: 12,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  inspectionInfo: {
    flex: 1,
  },
  inspectionType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inspectionVehicle: {
    fontSize: 14,
    marginBottom: 2,
  },
  inspectionDate: {
    fontSize: 12,
  },
  inspectionStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inspectionStatusText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inspectionNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  formTemplates: {
    flexDirection: 'row',
    gap: 15,
  },
  templateCard: {
    flex: 1,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
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
  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    // backgroundColor será definido pelo tema
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

