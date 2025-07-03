# 🚀 Sentinel Copilot React Native App

Aplicativo móvel React Native para o sistema Sentinel Copilot de gestão de frotas.

## 📱 Funcionalidades

- **SplashScreen** com animação Sentinela
- **LoginScreen** com Firebase Authentication
- **DashboardScreen** com métricas em tempo real
- **TripsScreen** com viagens ativas e histórico
- **InspectionScreen** com formulários inteligentes
- **CopilotScreen** com chatbot ADA e vídeo
- **Navegação completa** com ícones personalizados
- **Temas dark/light** funcionais

## 🔥 Firebase Integration

- **Database ID**: `sentinel-ai-nam5`
- **Enterprise ID**: `sA9EmrE3ymtnBqJKcYn7` (para testes)
- **Coleções**: MonitoringRegistration, Trips, Vehicles, Users
- **Autenticação**: Firebase Auth com múltiplas credenciais

## 🔐 Credenciais de Login

- **CPF**: `123.456.789-00` + **Senha**: `123456`
- **Código**: `MOT001` + **Senha**: `123456`
- **Admin**: `admin` + **Senha**: `123456`

## 🚀 Build Automático

O projeto usa **GitHub Actions** com **EAS Build** para gerar APKs automaticamente:

### 📦 Download do APK
1. Acesse [Releases](https://github.com/mobilityedgeai/sentinel-copilot-app-rn/releases)
2. Baixe o APK mais recente
3. Instale no Android (habilite "Fontes desconhecidas")

### 🔧 Build Local

```bash
# Clone o repositório
git clone https://github.com/mobilityedgeai/sentinel-copilot-app-rn.git
cd sentinel-copilot-app-rn

# Instale dependências
npm install

# Execute o build local
./build-local.sh
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Setup
```bash
npm install
npx expo prebuild
npm start
```

### Build APK
```bash
# Via EAS (recomendado)
eas build --platform android --profile preview

# Via Gradle local
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

## 📊 Tecnologias

- **React Native** + **Expo** + **TypeScript**
- **Firebase Auth** + **Firestore**
- **React Navigation** (Stack + Bottom Tabs)
- **Expo AV** para vídeo da ADA
- **Linear Gradient** para efeitos visuais

## 🎯 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── screens/            # Telas do aplicativo
├── services/           # Serviços (Firebase, API)
├── types/              # Tipos TypeScript
└── navigation/         # Configuração de navegação
```

## 🔧 Configuração Firebase

O projeto está configurado para usar o Firebase com as seguintes configurações:

- **Project ID**: `sentinel-ai-769c5`
- **Database**: `sentinel-ai-nam5`
- **Service Account**: Configurado via GitHub Secrets

## 📱 Instalação

1. Baixe o APK da seção [Releases](https://github.com/mobilityedgeai/sentinel-copilot-app-rn/releases)
2. No Android, vá em **Configurações** > **Segurança** > **Fontes desconhecidas** (habilite)
3. Instale o APK baixado
4. Abra o app e faça login com as credenciais fornecidas

## 🤖 Chatbot ADA

O aplicativo inclui um chatbot inteligente (ADA) que:
- Responde perguntas sobre o veículo
- Fornece informações de viagens
- Acessa dados em tempo real do Firestore
- Exibe vídeo animado durante conversas

## 🎨 Design

- **Cores principais**: Azul escuro (#0066cc)
- **Ícones**: Minimalistas e modernos
- **Layout**: Mobile-first responsivo
- **Animações**: Suaves e funcionais

## 📄 Licença

Este projeto é propriedade da Mobility Edge AI.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre o aplicativo, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ pela equipe Mobility Edge AI**

