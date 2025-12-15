# 🚀 Guia Rápido - Integração SAP

## ⚡ TL;DR - 3 Passos

```bash
# 1. Copiar arquivo Excel do SAP
cp seu-arquivo.xlsx public/rel-SAP.xlsx

# 2. Importar dados
./import-sap.sh

# 3. Executar protótipo
npm run dev
```

Pronto! Acesse http://localhost:3000/show-input-doc/

---

## 📝 Passo a Passo Detalhado

### 1️⃣ Preparar Arquivo Excel

**Origem**: Sistema SAP da CAIXA  
**Nome esperado**: `rel-SAP.xlsx`  
**Local**: Pasta `public/`

```bash
# Copiar arquivo
cp /caminho/para/relatorio-sap.xlsx public/rel-SAP.xlsx
```

### 2️⃣ Instalar Dependências (primeira vez)

```bash
# Instalar dependências Node.js
npm install

# Dependências Python são instaladas automaticamente pelo script
```

### 3️⃣ Importar Dados

**Opção A - Script Automático** (Recomendado):
```bash
./import-sap.sh
```

**Opção B - Manual**:
```bash
# Ativar ambiente virtual (se necessário)
python3 -m venv .venv
source .venv/bin/activate

# Instalar dependências Python
pip install pandas openpyxl

# Executar importação
python3 scripts/import-sap-data.py
```

### 4️⃣ Executar Protótipo

```bash
npm run dev
```

Acesse: http://localhost:3000/show-input-doc/

---

## ✅ Verificações

### Arquivo Excel Importado?
```bash
ls -lh public/rel-SAP.xlsx
# Deve mostrar o arquivo
```

### JSON Gerado?
```bash
ls -lh public/dados-sap.json
# Deve mostrar o arquivo JSON
```

### Ver Conteúdo do JSON
```bash
cat public/dados-sap.json | jq .metadados
# Mostra metadados da importação
```

### Ver Estatísticas
```bash
python3 -c "
import json
with open('public/dados-sap.json') as f:
    dados = json.load(f)
    print(f'Imóveis: {len(dados[\"imoveis\"])}')
    print(f'Locadores: {len(dados[\"locadores\"])}')
"
```

---

## 🔍 Troubleshooting

### ❌ Erro: "Arquivo rel-SAP.xlsx não encontrado"
**Solução**: Copie o arquivo Excel para a pasta `public/`

### ❌ Erro: "ModuleNotFoundError: No module named 'pandas'"
**Solução**: Execute `./import-sap.sh` que instala automaticamente

### ❌ Dados não aparecem no protótipo
**Solução**: 
1. Verifique se `public/dados-sap.json` existe
2. Abra o console do navegador (F12)
3. Procure por mensagens de erro
4. Verifique se o caminho no código está correto

### ❌ Indicador mostra "Dados Demo" ao invés de "Dados SAP"
**Solução**:
1. Confirme que `public/dados-sap.json` existe
2. Limpe o cache do navegador (Ctrl+Shift+R)
3. Verifique console do navegador para erros

---

## 📊 O Que Esperar

### Console Python (Importação)
```
================================================================================
🏢 IMPORTADOR DE DADOS SAP → SILIC 2.0
================================================================================

📂 Lendo arquivo Excel do SAP...
✅ 1 registros encontrados

🔄 Processando registro 1/1: CT - AG VIÇOSA DE ALAGOAS, AL
  👤 Locador criado: GERALDINA TOLEDO... (398047472)
  🏢 Imóvel criado: CT - AG VIÇOSA DE ALAGOAS, AL (Código: 10000000)

💾 Salvando dados convertidos...
✅ Arquivo salvo: public/dados-sap.json

================================================================================
📊 RESUMO DA IMPORTAÇÃO
================================================================================
✅ Imóveis importados: 1
✅ Locadores importados: 1
```

### Console Navegador
```
🔄 Carregando dados do SAP...
✅ Dados do SAP carregados com sucesso!
   📊 1 imóveis
   👥 1 locadores
   📅 Importação: 12/11/2025 13:33:26
```

### Interface
- **Header**: Badge verde "🗂️ Dados do SAP"
- **Notificação**: "✅ Dados do SAP carregados com sucesso!"
- **Dashboard**: Estatísticas atualizadas com dados reais

---

## 🎓 Comandos Úteis

```bash
# Ver logs da última importação
python3 scripts/import-sap-data.py

# Build para produção
npm run build

# Testar build
npm run preview

# Verificar tipos TypeScript
npm run typecheck

# Limpar dados importados
rm public/dados-sap.json

# Reimportar do zero
rm public/dados-sap.json && ./import-sap.sh
```

---

## 📚 Documentação Completa

- **Integração Técnica**: [docs/INTEGRACAO_SAP.md](INTEGRACAO_SAP.md)
- **Resumo Executivo**: [docs/RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md)
- **README Principal**: [README.md](../README.md)

---

## 💡 Dicas

1. **Backup**: Sempre faça backup do arquivo Excel original
2. **Versão**: Mantenha controle de versão dos dados importados
3. **Cache**: Limpe cache do navegador após reimportar
4. **Logs**: Sempre verifique o console para erros
5. **Teste**: Teste com arquivo de exemplo primeiro

---

## 🆘 Suporte Rápido

**Problema**: Script não executa  
**Solução**: `chmod +x import-sap.sh`

**Problema**: Permissão negada Python  
**Solução**: `chmod +x scripts/import-sap-data.py`

**Problema**: JSON inválido  
**Solução**: Verifique se o Excel tem a estrutura correta

**Problema**: Dados não carregam  
**Solução**: Verifique path no `sapDataLoader.ts` (linha 13)

---

**Versão**: 1.0.0  
**Última atualização**: 12/11/2025
