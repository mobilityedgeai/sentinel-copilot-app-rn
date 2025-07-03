# 🚀 Sentinel Copilot Mobile App

Aplicativo React Native para gestão inteligente de frotas com IA ADA integrada.

## 📱 Funcionalidades

### ✨ **Principais Features**
- **Dashboard em Tempo Real**: Métricas do veículo, bateria, temperatura e autonomia
- **Sistema de Viagens**: Monitoramento de rotas ativas e histórico completo
- **Inspeções Inteligentes**: Formulários com sugestões de IA e detecção de duplicatas
- **Chatbot ADA**: Assistente IA com vídeo interativo e respostas contextuais
- **Temas Dark/Light**: Interface adaptável com transições suaves
- **Firebase Integration**: Autenticação e Firestore para dados em tempo real

### 🎯 **Telas Implementadas**
1. **SplashScreen**: Animação Sentinela com elementos de vigilância
2. **LoginScreen**: Autenticação Firebase com múltiplas credenciais
3. **DashboardScreen**: Métricas, alertas e estatísticas do veículo
4. **TripsScreen**: Viagens ativas, histórico e estatísticas diárias
5. **InspectionScreen**: Central de inspeção com IA e formulários inteligentes
6. **CopilotScreen**: Chat com ADA, vídeo animado e sugestões rápidas

## 🔧 Tecnologias

- **React Native** + **Expo** + **TypeScript**
- **Firebase Authentication** + **Firestore**
- **React Navigation** (Stack + Bottom Tabs)
- **Expo AV** (reprodução de vídeo)
- **Linear Gradient** (efeitos visuais)
- **GitHub Actions** (CI/CD automático)

## 🚀 Instalação e Desenvolvimento

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (para emulador)

### **Setup Local**
```bash
# Clone o repositório
git clone https://github.com/mobilityedgeai/sentinel-copilot-app-rn.git
cd sentinel-copilot-app-rn

# Instale as dependências
npm install

# Configure o Firebase (veja seção abaixo)
# Crie o arquivo firebase-service-account.json

# Inicie o desenvolvimento
npm start
```

### **Executar no Android**
```bash
# Emulador Android
npm run android

# Dispositivo físico (via Expo Go)
npm start
# Escaneie o QR code com o Expo Go
```

## 🔥 Configuração Firebase

### **1. Arquivo de Service Account**
Crie o arquivo `firebase-service-account.json` na raiz do projeto:

```json
{
  "type": "service_account",
  "project_id": "sentinel-ai-769c5",
  "private_key_id": "SEU_PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "SEU_CLIENT_EMAIL",
  "client_id": "SEU_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "SUA_CLIENT_CERT_URL"
}
```

### **2. Database Configuration**
- **Database ID**: `sentinel-ai-nam5`
- **Enterprise ID**: `sA9EmrE3ymtnBqJKcYn7`
- **Coleções principais**: `MonitoringRegistration`, `Trips`, `Vehicles`, `Users`

## 🔐 Credenciais de Login

### **Credenciais de Teste**
- **CPF**: `123.456.789-00` | **Senha**: `123456`
- **CPF**: `12345678900` | **Senha**: `123456`
- **Código**: `MOT001` | **Senha**: `123456`
- **Login**: `motorista01` | **Senha**: `123456`
- **Admin**: `admin` | **Senha**: `123456`

## 🤖 GitHub Actions - Build Automático

### **Configuração de Secrets**
Configure os seguintes secrets no GitHub (Settings → Secrets and variables → Actions):

```
FIREBASE_PRIVATE_KEY_ID=seu_private_key_id
FIREBASE_PRIVATE_KEY=sua_private_key_completa
FIREBASE_CLIENT_EMAIL=seu_client_email
FIREBASE_CLIENT_ID=seu_client_id
FIREBASE_CLIENT_CERT_URL=sua_client_cert_url
EXPO_TOKEN=seu_expo_token (opcional)
```

### **Como Obter os Secrets**
1. **Firebase Secrets**: Extrair do arquivo `firebase-service-account.json`
2. **Expo Token**: 
   ```bash
   expo login
   expo whoami --json
   # Use o token retornado
   ```

### **Workflow Automático**
- **Trigger**: Push para `main` ou `develop`
- **Outputs**: APK compilado + Release automático
- **Artifacts**: APK disponível por 30 dias
- **Release**: Criado automaticamente na branch `main`

## 📦 Build Manual

### **Build Local (Android)**
```bash
# Preparar projeto para build nativo
expo prebuild --platform android

# Compilar APK
cd android
./gradlew assembleRelease

# APK estará em: android/app/build/outputs/apk/release/
```

### **Build com EAS (Recomendado)**
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build APK
eas build --platform android --profile preview
```

## 🎨 Personalização

### **Temas**
- Edite `darkTheme` e `lightTheme` em cada tela
- Cores principais: `#0066cc` (azul), `#00ff41` (verde), `#ffb800` (amarelo)

### **Ícones de Navegação**
- Personalize em `src/components/TabBarIcon.tsx`
- Ícones SVG minimalistas seguindo padrão moderno

### **Animações**
- SplashScreen: Animação Sentinela customizável
- Transições: Configuráveis via React Navigation

## 🔍 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── TabBarIcon.tsx   # Ícones da navegação
├── screens/             # Telas do aplicativo
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── TripsScreen.tsx
│   ├── InspectionScreen.tsx
│   └── CopilotScreen.tsx
├── services/            # Serviços e APIs
│   ├── firebase.ts      # Configuração Firebase
│   └── firestoreService.ts # Serviços Firestore
└── types/               # Tipos TypeScript
    └── navigation.ts    # Tipos de navegação
```

## 🧪 Testes

### **Credenciais de Teste**
Use as credenciais listadas acima para testar o login.

### **Dados Mock**
Quando não há conexão com Firestore, o app usa dados mock para demonstração.

### **Funcionalidades Testáveis**
- ✅ Login com Firebase
- ✅ Navegação entre telas
- ✅ Temas dark/light
- ✅ Chat com ADA
- ✅ Métricas do dashboard
- ✅ Sistema de viagens
- ✅ Formulários de inspeção

## 📱 Download do APK

### **Releases Automáticos**
- Acesse: [Releases](https://github.com/mobilityedgeai/sentinel-copilot-app-rn/releases)
- Baixe o APK mais recente
- Instale no Android (habilite "Fontes desconhecidas")

### **Build Actions**
- Cada push gera um novo build
- APKs disponíveis na aba "Actions" → "Artifacts"

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/mobilityedgeai/sentinel-copilot-app-rn/issues)
- **Documentação**: Este README
- **Firebase**: Configuração em `src/services/firebase.ts`

---

**Desenvolvido com ❤️ para gestão inteligente de frotas**

