#!/bin/bash
# Script auxiliar para converter Excel para JSON

echo "🔄 Convertendo rel-SAP.xlsx para dados-sap.json..."
echo ""

# Ativar ambiente virtual e executar conversão
source .venv/bin/activate
python scripts/converter-excel-para-json.py

echo ""
echo "✨ Pronto! O arquivo dados-sap.json foi atualizado."
echo ""
echo "Para visualizar o JSON gerado:"
echo "  cat public/dados-sap.json | python -m json.tool | head -50"
