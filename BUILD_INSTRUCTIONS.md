# 🚀 Sentinel Copilot - Instruções de Build

## 📱 **Build Local do APK (Recomendado)**

### **🔧 Pré-requisitos**
- **Node.js 18+** instalado
- **Java 17+** instalado
- **Android SDK** (opcional, será baixado automaticamente)

### **⚡ Build Automático**
```bash
# Clone o repositório
git clone https://github.com/mobilityedgeai/sentinel-copilot-app-rn.git
cd sentinel-copilot-app-rn

# Execute o script de build
./build-local.sh
```

O script irá:
1. ✅ Verificar dependências
2. ✅ Instalar pacotes npm
3. ✅ Criar assets básicos
4. ✅ Fazer prebuild do Expo
5. ✅ Compilar APK com Gradle
6. ✅ Gerar APK final em `build-output/`

### **📱 Resultado**
- **APK gerado**: `build-output/sentinel-copilot-[tipo]-[timestamp].apk`
- **Tamanho**: ~50-100MB
- **Pronto para instalação** no Android

## 🔥 **Build Manual (Avançado)**

### **1. Setup Inicial**
```bash
# Instalar dependências
npm install

# Instalar Expo CLI
npm install -g @expo/cli
```

### **2. Configurar Firebase**
Crie o arquivo `firebase-service-account.json`:
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

### **3. Prebuild**
```bash
# Corrigir dependências
npx expo install --fix

# Gerar projeto Android nativo
npx expo prebuild --platform android
```

### **4. Build APK**
```bash
# Entrar no diretório Android
cd android

# Dar permissão ao Gradle
chmod +x ./gradlew

# Compilar APK (release)
./gradlew assembleRelease

# OU compilar APK (debug)
./gradlew assembleDebug
```

### **5. Localizar APK**
```bash
# APK estará em:
find android/app/build/outputs/apk -name "*.apk"
```

## 🎯 **Solução de Problemas**

### **❌ Erro: Node.js não encontrado**
```bash
# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### **❌ Erro: Java não encontrado**
```bash
# Instalar Java 17
sudo apt update
sudo apt install openjdk-17-jdk
```

### **❌ Erro: Android SDK**
O Expo baixa automaticamente o Android SDK necessário durante o prebuild.

### **❌ Erro: Gradle build falha**
```bash
# Limpar cache e tentar novamente
cd android
./gradlew clean
./gradlew assembleDebug
```

## 📱 **Instalação no Android**

### **1. Transferir APK**
- Copie o APK para seu dispositivo Android
- Via USB, email, ou cloud storage

### **2. Habilitar Instalação**
- Vá em **Configurações** → **Segurança**
- Habilite **Fontes desconhecidas** ou **Instalar apps desconhecidos**

### **3. Instalar**
- Toque no arquivo APK
- Confirme a instalação
- Aguarde a conclusão

## 🔐 **Credenciais de Login**

### **Usuários de Teste**
- **CPF**: `123.456.789-00` | **Senha**: `123456`
- **Código**: `MOT001` | **Senha**: `123456`
- **Admin**: `admin` | **Senha**: `123456`

## 🚀 **Funcionalidades do App**

### **✨ Telas Implementadas**
1. **SplashScreen** - Animação Sentinela
2. **LoginScreen** - Autenticação Firebase
3. **DashboardScreen** - Métricas do veículo
4. **TripsScreen** - Viagens ativas e histórico
5. **InspectionScreen** - Formulários inteligentes
6. **CopilotScreen** - Chatbot ADA com vídeo

### **🔥 Integração Firebase**
- **Database**: `sentinel-ai-nam5`
- **Enterprise ID**: `sA9EmrE3ymtnBqJKcYn7`
- **Coleções**: MonitoringRegistration, Trips, Vehicles, Users

## 📞 **Suporte**

### **🐛 Problemas**
- Abra uma issue no GitHub
- Inclua logs de erro completos
- Especifique sistema operacional e versões

### **📚 Documentação**
- README.md principal
- Código fonte comentado
- Exemplos de uso

---

**Desenvolvido com ❤️ para gestão inteligente de frotas**

