#!/bin/bash

echo "🚀 Sentinel Copilot - Build Local do APK"
echo "========================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar se Java está instalado
if ! command -v java &> /dev/null; then
    echo "❌ Java não encontrado. Instale Java 17+ primeiro."
    exit 1
fi

echo "✅ Verificações iniciais concluídas"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se o arquivo Firebase existe
if [ ! -f "firebase-service-account.json" ]; then
    echo "⚠️  Arquivo firebase-service-account.json não encontrado"
    echo "📋 Criando arquivo de exemplo..."
    cat > firebase-service-account.json << 'EOF'
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
EOF
    echo "📝 Configure o arquivo firebase-service-account.json com suas credenciais"
fi

# Criar assets básicos se não existirem
echo "🎨 Criando assets básicos..."
mkdir -p assets

# Criar um PNG básico usando printf
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x04\x00\x00\x00\x04\x00\x08\x02\x00\x00\x00\x26\x93\x09\x29\x00\x00\x00\x12IDATx\x9cc\xf8\x0f\x00\x01\x01\x01\x00\x18\xdd\x8d\xb4\x1c\x00\x00\x00\x00IEND\xaeB\x60\x82' > assets/icon.png
cp assets/icon.png assets/splash.png
cp assets/icon.png assets/adaptive-icon.png
cp assets/icon.png assets/favicon.png

echo "✅ Assets criados"

# Instalar Expo CLI se não estiver instalado
if ! command -v expo &> /dev/null; then
    echo "📱 Instalando Expo CLI..."
    npm install -g @expo/cli
fi

# Fazer prebuild
echo "🔧 Executando prebuild para Android..."
npx expo install --fix
npx expo prebuild --platform android

# Verificar se o diretório android foi criado
if [ ! -d "android" ]; then
    echo "❌ Prebuild falhou - diretório android não foi criado"
    exit 1
fi

echo "✅ Prebuild concluído com sucesso"

# Entrar no diretório android e fazer build
echo "🔨 Compilando APK..."
cd android

# Dar permissão de execução ao gradlew
chmod +x ./gradlew

# Tentar build release primeiro, se falhar, tentar debug
echo "📱 Tentando build release..."
if ./gradlew assembleRelease --no-daemon --stacktrace; then
    echo "✅ Build release concluído!"
    BUILD_TYPE="release"
else
    echo "⚠️  Build release falhou, tentando debug..."
    if ./gradlew assembleDebug --no-daemon --stacktrace; then
        echo "✅ Build debug concluído!"
        BUILD_TYPE="debug"
    else
        echo "❌ Ambos os builds falharam"
        exit 1
    fi
fi

# Encontrar o APK gerado
echo "🔍 Procurando APK gerado..."
APK_PATH=$(find app/build/outputs/apk -name "*.apk" | head -1)

if [ -n "$APK_PATH" ]; then
    # Criar diretório de output
    mkdir -p ../build-output
    
    # Copiar APK com nome descritivo
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    OUTPUT_NAME="sentinel-copilot-${BUILD_TYPE}-${TIMESTAMP}.apk"
    cp "$APK_PATH" "../build-output/$OUTPUT_NAME"
    
    echo ""
    echo "🎉 =================================="
    echo "🎉 APK GERADO COM SUCESSO!"
    echo "🎉 =================================="
    echo ""
    echo "📱 Arquivo: build-output/$OUTPUT_NAME"
    echo "📏 Tamanho: $(du -h "../build-output/$OUTPUT_NAME" | cut -f1)"
    echo ""
    echo "📋 Para instalar no Android:"
    echo "1. Transfira o APK para seu dispositivo Android"
    echo "2. Habilite 'Fontes desconhecidas' nas configurações"
    echo "3. Toque no arquivo APK para instalar"
    echo ""
    echo "🔐 Credenciais de login:"
    echo "- CPF: 123.456.789-00 | Senha: 123456"
    echo "- Código: MOT001 | Senha: 123456"
    echo "- Admin: admin | Senha: 123456"
    echo ""
    
    # Listar todos os APKs no diretório de output
    echo "📦 APKs disponíveis:"
    ls -la ../build-output/
    
else
    echo "❌ Nenhum APK encontrado"
    echo "🔍 Arquivos encontrados:"
    find app/build/outputs -name "*.apk" -o -name "*.aab" | head -10
    exit 1
fi

echo ""
echo "✅ Build local concluído com sucesso!"

