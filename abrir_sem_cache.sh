#!/bin/bash

# Script MELHORADO para abrir a página sem cache e interferência
echo "🚀 Abrindo SILIC 2.0 - Gestão de Imóveis (Versão Isolada)..."
echo "📍 Diretório: $(pwd)"

# Fechar instâncias problemáticas do Firefox
echo "🧹 Fechando abas conflitantes..."
pkill -f "silic\|SILIC\|hands-on" 2>/dev/null || true

# Aguardar
sleep 2

# Abrir em modo totalmente isolado
echo "🌐 Abrindo em modo privado isolado..."
if command -v firefox &> /dev/null; then
    firefox --private-window --new-instance --no-remote "file://$(pwd)/index.html" &
elif command -v google-chrome &> /dev/null; then
    google-chrome --incognito --new-window "file://$(pwd)/index.html" &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser --incognito --new-window "file://$(pwd)/index.html" &
else
    echo "❌ Nenhum navegador encontrado!"
    echo "📂 Abra manualmente: $(pwd)/index.html"
    exit 1
fi

echo "✅ Página aberta em modo isolado!"
echo ""
echo "🎯 VERIFICAÇÕES:"
echo "   ✓ Header azul deve ir até as bordas"
echo "   ✓ Não deve haver texto 'João Silva' no topo"
echo "   ✓ Layout centralizado e responsivo"
echo ""
echo "💡 Se ainda houver problemas, use Ctrl+Shift+R para hard refresh!"
