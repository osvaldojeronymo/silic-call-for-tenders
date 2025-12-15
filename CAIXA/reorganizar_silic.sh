#!/bin/bash
# Script para reorganizar e sincronizar todos os repositórios SILIC 2.0

echo "🚀 SILIC 2.0 - Organização e Mobilidade"
echo "========================================"

# Diretório base
BASE_DIR="/home/osvaldo/Área de Trabalho/Prototipos/CAIXA"
NEW_BASE_DIR="/home/osvaldo/Projetos/SILIC"

# Criar nova estrutura
echo "📁 Criando nova estrutura organizada..."
mkdir -p "$NEW_BASE_DIR"

# Mapeamento de diretórios
declare -A REPOS=(
    ["desen-input-doc"]="silic-gestao-imoveis"
    ["desen-request-service"]="silic-solicitacoes"
    ["silic-hands-on"]="silic-dashboard-tecnico"
    ["silic-portal"]="silic-portal"
    ["silic-demos"]="silic-demos"
)

echo "🔄 Reorganizando repositórios..."

for OLD_NAME in "${!REPOS[@]}"; do
    NEW_NAME="${REPOS[$OLD_NAME]}"
    OLD_PATH="$BASE_DIR/$OLD_NAME"
    NEW_PATH="$NEW_BASE_DIR/$NEW_NAME"
    
    if [ -d "$OLD_PATH" ]; then
        echo "  📦 $OLD_NAME → $NEW_NAME"
        
        # Copiar (não mover) para manter backup
        cp -r "$OLD_PATH" "$NEW_PATH"
        
        # Atualizar remote URL se necessário
        cd "$NEW_PATH"
        
        # Verificar se é um repo git
        if [ -d ".git" ]; then
            echo "    🔗 Atualizando remote para GitHub..."
            git remote set-url origin "https://github.com/osvaldojeronymo/$NEW_NAME.git"
        fi
        
        cd - > /dev/null
    else
        echo "  ⚠️  $OLD_NAME não encontrado"
    fi
done

echo ""
echo "✅ Reorganização concluída!"
echo ""
echo "📍 Nova estrutura em: $NEW_BASE_DIR"
echo "📂 Estrutura criada:"
ls -la "$NEW_BASE_DIR" 2>/dev/null || echo "   (Diretório será criado conforme repositórios forem encontrados)"

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "1. Verificar repositórios reorganizados"
echo "2. Fazer push das mudanças"
echo "3. Renomear repositórios no GitHub"
echo "4. Configurar GitHub Pages"
echo "5. Testar URLs atualizadas"

echo ""
echo "💡 Para continuar:"
echo "   cd $NEW_BASE_DIR"
echo "   ls -la"
