import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { ChatMessage } from '../types/navigation';
import { vehicleService, tripService, monitoringService } from '../services/firestoreService';

const { width } = Dimensions.get('window');

export default function CopilotScreen() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAdaSpeaking, setIsAdaSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const videoRef = useRef<Video>(null);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  useEffect(() => {
    // Mensagem de boas-vindas da ADA
    const welcomeMessage: ChatMessage = {
      id: '1',
      text: 'Olá! Eu sou a ADA, sua assistente inteligente do Sentinel Copilot. Como posso ajudá-lo hoje?',
      sender: 'ada',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simular delay de resposta da IA
    setTimeout(async () => {
      const response = await generateAdaResponse(inputText.trim());
      const adaMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ada',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setIsAdaSpeaking(true);
      setMessages(prev => [...prev, adaMessage]);

      // Reproduzir vídeo da ADA
      if (videoRef.current) {
        await videoRef.current.playAsync();
      }

      // Parar vídeo após 3 segundos
      setTimeout(() => {
        setIsAdaSpeaking(false);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      }, 3000);
    }, 1500);
  };

  const generateAdaResponse = async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase();

    // Respostas baseadas em dados reais do Firestore
    if (input.includes('veículo') || input.includes('bateria') || input.includes('status')) {
      try {
        const vehicles = await vehicleService.getVehicles();
        if (vehicles.length > 0) {
          const vehicle = vehicles[0];
          return `Seu veículo ${vehicle.plate} está com ${vehicle.batteryLevel}% de bateria, temperatura de ${vehicle.temperature}°C e autonomia de ${vehicle.autonomy}km. Status: ${vehicle.status === 'connected' ? 'Conectado' : 'Desconectado'}.`;
        }
      } catch (error) {
        console.error('Erro ao buscar dados do veículo:', error);
      }
      return 'Seu veículo ABC-1234 está com 87% de bateria, temperatura de 23°C e autonomia de 412km. Status: Conectado.';
    }

    if (input.includes('viagem') || input.includes('rota') || input.includes('destino')) {
      try {
        const trips = await tripService.getActiveTrips();
        if (trips.length > 0) {
          const trip = trips[0];
          return `Você tem uma viagem ativa de ${trip.origin} para ${trip.destination}. Velocidade atual: ${trip.currentSpeed}km/h, distância restante: ${trip.remainingDistance}km, tempo estimado: ${trip.estimatedTime}.`;
        }
      } catch (error) {
        console.error('Erro ao buscar dados da viagem:', error);
      }
      return 'Você tem uma viagem ativa de São Paulo para Campinas. Velocidade atual: 65km/h, distância restante: 42km, tempo estimado: 1h 15m.';
    }

    if (input.includes('desempenho') || input.includes('performance') || input.includes('score')) {
      try {
        const monitoringData = await monitoringService.getMonitoringData();
        if (monitoringData.length > 0) {
          return 'Baseado nos dados de monitoramento, seu desempenho está excelente! Score de segurança: 95/100. Continue mantendo a velocidade adequada e as práticas de direção defensiva.';
        }
      } catch (error) {
        console.error('Erro ao buscar dados de monitoramento:', error);
      }
      return 'Seu desempenho está excelente! Score de segurança: 95/100. Continue mantendo a velocidade adequada e as práticas de direção defensiva.';
    }

    if (input.includes('economia') || input.includes('combustível') || input.includes('energia')) {
      return 'Para otimizar o consumo de energia: mantenha velocidade constante entre 60-80km/h, evite acelerações bruscas e use o modo eco quando possível. Isso pode aumentar sua autonomia em até 15%.';
    }

    if (input.includes('segurança') || input.includes('alerta') || input.includes('manutenção')) {
      return 'Detectei que sua próxima manutenção preventiva está agendada para a próxima semana. Todos os sistemas de segurança estão funcionando normalmente. Há uma atualização de software disponível (v2.1.4).';
    }

    if (input.includes('clima') || input.includes('tempo') || input.includes('chuva')) {
      return 'As condições climáticas estão favoráveis para sua rota. Temperatura externa: 23°C, sem previsão de chuva. Recomendo manter velocidade reduzida em 10% caso encontre neblina.';
    }

    if (input.includes('ajuda') || input.includes('comandos') || input.includes('funções')) {
      return 'Posso ajudá-lo com: status do veículo, informações de viagem, análise de desempenho, dicas de economia de energia, alertas de segurança e condições climáticas. O que gostaria de saber?';
    }

    // Respostas padrão inteligentes
    const responses = [
      'Entendi sua pergunta. Com base nos dados do Sentinel, posso fornecer informações mais específicas. Poderia detalhar o que precisa?',
      'Estou analisando os dados em tempo real do seu veículo. Em que posso ajudá-lo especificamente?',
      'Como sua assistente IA, tenho acesso a todos os dados de monitoramento. Qual informação seria mais útil agora?',
      'Baseado no histórico de dados, posso oferecer insights personalizados. Sobre qual aspecto gostaria de saber mais?'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickSuggestions = [
    'Como está meu desempenho?',
    'Dicas de economia',
    'Status do veículo',
    'Relatório de segurança'
  ];

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.adaAvatar}>
              <Video
                ref={videoRef}
                source={{ uri: '../assets/videos/ada-avatar.mp4' }}
                style={styles.adaVideo}
                shouldPlay={false}
                isLooping={true}
                isMuted={true}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                ADA
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                Assistente IA
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Text style={styles.themeIcon}>
              {isDarkTheme ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.sender === 'user' ? styles.userMessage : styles.adaMessage
              ]}
            >
              {message.sender === 'ada' && (
                <View style={styles.adaMessageAvatar}>
                  <Video
                    source={{ uri: '../assets/videos/ada-avatar.mp4' }}
                    style={styles.adaMessageVideo}
                    shouldPlay={isAdaSpeaking && messages[messages.length - 1].id === message.id}
                    isLooping={true}
                    isMuted={true}
                    resizeMode="cover"
                  />
                </View>
              )}
              
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' 
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.cardBg }
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: message.sender === 'user' ? '#ffffff' : theme.text }
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    { color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : theme.textSecondary }
                  ]}
                >
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageContainer, styles.adaMessage]}>
              <View style={styles.adaMessageAvatar}>
                <Video
                  source={{ uri: '../assets/videos/ada-avatar.mp4' }}
                  style={styles.adaMessageVideo}
                  shouldPlay={true}
                  isLooping={true}
                  isMuted={true}
                  resizeMode="cover"
                />
              </View>
              <View style={[styles.messageBubble, { backgroundColor: theme.cardBg }]}>
                <View style={styles.typingIndicator}>
                  <View style={[styles.typingDot, { backgroundColor: theme.text }]} />
                  <View style={[styles.typingDot, { backgroundColor: theme.text }]} />
                  <View style={[styles.typingDot, { backgroundColor: theme.text }]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>
              Sugestões rápidas:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.suggestions}>
                {quickSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionButton, { backgroundColor: theme.cardBg }]}
                    onPress={() => {
                      setInputText(suggestion);
                      sendMessage();
                    }}
                  >
                    <Text style={[styles.suggestionText, { color: theme.text }]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: theme.cardBg }]}>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.text 
            }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={theme.placeholder}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.accent }]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Text style={styles.sendButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adaAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  adaVideo: {
    width: '100%',
    height: '100%',
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
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  adaMessage: {
    justifyContent: 'flex-start',
  },
  adaMessageAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  adaMessageVideo: {
    width: '100%',
    height: '100%',
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    textAlign: 'right',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  suggestions: {
    flexDirection: 'row',
    gap: 10,
  },
  suggestionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
  },
});

