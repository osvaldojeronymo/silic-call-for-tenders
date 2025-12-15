#!/bin/bash

# Script para inicializar o projeto SILIC Input Doc TypeScript

echo "🏠 Iniciando SILIC Input Doc - TypeScript + Vite"
echo "=============================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""

# Verificar TypeScript
echo "🔍 Verificando tipos TypeScript..."
npm run typecheck

if [ $? -eq 0 ]; then
    echo "✅ Verificação de tipos bem-sucedida!"
else
    echo "❌ Erro na verificação de tipos"
    exit 1
fi

echo ""

# Fazer build de teste
echo "🔨 Testando build para produção..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build de produção bem-sucedido!"
else
    echo "❌ Erro no build de produção"
    exit 1
fi

echo ""
echo "🎉 Projeto inicializado com sucesso!"
echo ""
echo "📋 Comandos disponíveis:"
echo "  npm run dev      - Servidor de desenvolvimento"
echo "  npm run build    - Build para produção"
echo "  npm run preview  - Preview do build"
echo "  npm run deploy   - Deploy para GitHub Pages"
echo ""
echo "🌐 URLs:"
echo "  Desenvolvimento: http://localhost:3000/show-input-doc/"
echo "  Produção:       https://osvaldojeronymo.github.io/show-input-doc/"
echo ""
echo "💡 Para começar a desenvolver, execute: npm run dev"
