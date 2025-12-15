#!/bin/bash

# Script para importar dados do SAP no SILIC 2.0
# Autor: Sistema SILIC
# Data: 2025-11-12

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🏢 SILIC 2.0 - Importador de Dados SAP             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo

# Diretório do projeto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo -e "${YELLOW}📁 Diretório do projeto: ${PROJECT_DIR}${NC}"
echo

# Verificar se o arquivo Excel existe
if [ ! -f "public/rel-SAP.xlsx" ]; then
    echo -e "${RED}❌ Erro: Arquivo 'public/rel-SAP.xlsx' não encontrado!${NC}"
    echo
    echo -e "${YELLOW}📝 Instruções:${NC}"
    echo "  1. Coloque o arquivo Excel do SAP na pasta 'public/'"
    echo "  2. Renomeie para 'rel-SAP.xlsx'"
    echo "  3. Execute este script novamente"
    echo
    exit 1
fi

echo -e "${GREEN}✅ Arquivo Excel encontrado: public/rel-SAP.xlsx${NC}"
echo

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python 3 encontrado: $(python3 --version)${NC}"
echo

# Verificar/criar ambiente virtual
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}🔧 Criando ambiente virtual Python...${NC}"
    python3 -m venv .venv
    echo -e "${GREEN}✅ Ambiente virtual criado${NC}"
    echo
fi

# Ativar ambiente virtual
source .venv/bin/activate

# Instalar dependências Python
echo -e "${YELLOW}📦 Instalando dependências Python...${NC}"
pip install -q pandas openpyxl
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo

# Executar script de importação
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🚀 Iniciando importação...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo

python3 scripts/import-sap-data.py

# Verificar se o JSON foi gerado
if [ -f "public/dados-sap.json" ]; then
    echo
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo
    
    # Mostrar informações do arquivo gerado
    FILE_SIZE=$(du -h "public/dados-sap.json" | cut -f1)
    echo -e "${GREEN}✅ Arquivo gerado: public/dados-sap.json${NC}"
    echo -e "${GREEN}📊 Tamanho: ${FILE_SIZE}${NC}"
    echo
    
    # Contar registros
    IMOVEIS=$(grep -o '"id":' public/dados-sap.json | wc -l)
    echo -e "${GREEN}🏢 Registros processados:${NC}"
    echo -e "   • Imóveis importados: $((IMOVEIS / 2))"
    echo
    
    echo -e "${YELLOW}📋 Próximos passos:${NC}"
    echo "  1. Execute: ${BLUE}npm run dev${NC}"
    echo "  2. Acesse: ${BLUE}http://localhost:3000/show-input-doc/${NC}"
    echo "  3. Verifique o indicador '🗂️ Dados do SAP' no topo da página"
    echo
    
    # Perguntar se deseja iniciar o servidor
    read -p "Deseja iniciar o servidor de desenvolvimento agora? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${BLUE}🚀 Iniciando servidor...${NC}"
        echo
        npm run dev
    fi
else
    echo -e "${RED}❌ Erro: Arquivo JSON não foi gerado!${NC}"
    exit 1
fi
