#!/bin/bash
set -e

# Script para executar o Monetra Backend

echo "🚀 Iniciando Monetra Backend..."
cd "$(dirname "$0")"

if [ -f ".env" ]; then
    echo "🔐 Carregando variáveis de ambiente de backend/.env"
    set -a
    . ./.env
    set +a
fi

if [ ! -f "target/monetra-backend-1.0.0.jar" ]; then
    echo "📦 Compilando o projeto..."
    mvn clean package -q -DskipTests
fi

echo "✅ Iniciando aplicação..."
java -jar target/monetra-backend-1.0.0.jar

echo "🌐 Acesse http://localhost:8080/swagger-ui.html"
