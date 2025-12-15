#!/bin/bash
# Script para focar no Dashboard Técnico - Preparação para almoço

echo "🎯 SILIC 2.0 - Dashboard Técnico Focus"
echo "======================================"

# Verificar onde estamos
CURRENT_DIR=$(pwd)
echo "📍 Diretório atual: $CURRENT_DIR"

# Localizar o dashboard técnico
DASHBOARD_PATHS=(
    "/home/osvaldo/Área de Trabalho/Prototipos/CAIXA/silic-hands-on"
    "/home/osvaldo/Área de Trabalho/Prototipos/CAIXA/desen-input-doc"
    "/home/osvaldo/Projetos/SILIC/silic-dashboard-tecnico"
)

DASHBOARD_DIR=""

for path in "${DASHBOARD_PATHS[@]}"; do
    if [ -d "$path" ]; then
        DASHBOARD_DIR="$path"
        break
    fi
done

if [ -z "$DASHBOARD_DIR" ]; then
    echo "❌ Dashboard Técnico não encontrado!"
    echo "💡 Diretórios verificados:"
    for path in "${DASHBOARD_PATHS[@]}"; do
        echo "   - $path"
    done
    exit 1
fi

echo "✅ Dashboard encontrado em: $DASHBOARD_DIR"
echo ""

# Navegar para o dashboard
cd "$DASHBOARD_DIR"

echo "🔍 Status atual do repositório:"
git status

echo ""
echo "🌐 Testando o dashboard no navegador..."

# Verificar se tem arquivo principal
if [ -f "index.html" ]; then
    echo "✅ index.html encontrado"
    
    # Abrir no navegador
    echo "🚀 Abrindo dashboard no navegador..."
    if command -v firefox &> /dev/null; then
        firefox --new-window "file://$(pwd)/index.html" &
    elif command -v google-chrome &> /dev/null; then
        google-chrome --new-window "file://$(pwd)/index.html" &
    else
        echo "⚠️  Abra manualmente: file://$(pwd)/index.html"
    fi
    
else
    echo "❌ index.html não encontrado"
    echo "📁 Arquivos disponíveis:"
    ls -la *.html 2>/dev/null || echo "   Nenhum arquivo HTML encontrado"
fi

echo ""
echo "🎯 AÇÕES RÁPIDAS PARA O DASHBOARD:"
echo "1. 📝 Editar layout"
echo "2. 🎨 Ajustar CSS"  
echo "3. ⚡ Testar funcionalidades"
echo "4. 🚀 Deploy no GitHub"

echo ""
echo "💻 Para abrir no VS Code:"
echo "   code ."

echo ""
echo "🌐 Para testar online:"
if [ -d ".git" ]; then
    REMOTE_URL=$(git remote get-url origin 2>/dev/null)
    if [[ "$REMOTE_URL" == *"github.com"* ]]; then
        REPO_NAME=$(basename "$REMOTE_URL" .git)
        echo "   https://osvaldojeronymo.github.io/$REPO_NAME/"
    fi
fi

echo ""
echo "⏰ Pronto para trabalhar no Dashboard Técnico antes do almoço!"
echo "📁 Diretório: $DASHBOARD_DIR"
