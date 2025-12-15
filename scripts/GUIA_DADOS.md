# 📝 Guia: Como Adicionar Mais Dados à Planilha

## Passo a Passo

### 1. Abrir a Planilha
```bash
# No terminal Linux
libreoffice public/rel-SAP.xlsx

# Ou use Excel no Windows/Mac
```

### 2. Adicionar Nova Linha de Dados

Copie a linha existente e modifique os valores. Exemplo:

| Contrato | Denominação do contrato | Denom.tipo contrato | ... |
|----------|------------------------|---------------------|-----|
| 10000000 | CT - AG VIÇOSA DE ALAGOAS, AL | Contrato de Locação - Imóveis | ... |
| 10000001 | CT - AG MACEIÓ, AL | Contrato de Locação - Imóveis | ... |
| 10000002 | CT - AG ARAPIRACA, AL | Contrato de Locação - Imóveis | ... |

### 3. Padrões a Seguir

#### Código do Contrato
- Formato: 8 dígitos numéricos
- Exemplo: `10000000`, `10000001`, `10000002`
- Sempre incremental e único

#### Denominação do Contrato
- Formato: `CT - AG [CIDADE], [UF]`
- Exemplos:
  - `CT - AG VIÇOSA DE ALAGOAS, AL`
  - `CT - AG MACEIÓ, AL`
  - `CT - AG SÃO PAULO, SP`

#### Datas
- Formato aceito: `DD/MM/YYYY` ou `YYYY-MM-DD`
- Início do contrato: data passada
- Fim da validade: data futura
- Rescisão: deixar em branco se ativo

#### Status (derivado automaticamente)
- Se data fim > hoje → **Ativo**
- Se data fim < hoje → **Desativado**
- Se tem data rescisão → **Em Desmobilização**

#### Tipo ID Fiscal
- `CPF` → Pessoa Física (11 dígitos)
- `BR2` → CNPJ Pessoa Jurídica (14 dígitos)

### 4. Exemplo de Dados Completos

```
Contrato: 10000003
Denominação: CT - AG RECIFE, PE
Tipo Contrato: Contrato de Locação - Imóveis
Início: 01/01/2020
Fim Validade: 31/12/2030
Parceiro: 900127166
Tipo ID: CPF
Nº ID: 12345678901
Nome: JOÃO SILVA SANTOS
Função: Proponente Credor
Rua: RUA DAS FLORES
Nº: 123
Bairro: CENTRO
Local: RECIFE
Região: PE
CEP: 50000-000
Email: joao.silva@email.com
Telefone: 5581987654321
```

### 5. Converter para JSON

Após adicionar/editar:

```bash
# Opção 1: NPM
npm run convert:excel

# Opção 2: Script direto
./scripts/excel-para-json.sh

# Opção 3: Python
source .venv/bin/activate
python scripts/converter-excel-para-json.py
```

### 6. Verificar Resultado

```bash
# Ver quantos imóveis foram importados
cat public/dados-sap.json | grep -c '"id": "imovel_'

# Ver resumo
cat public/dados-sap.json | python -m json.tool | grep -A 3 "metadados"

# Ver primeiro imóvel
cat public/dados-sap.json | python -m json.tool | head -50
```

## 🎯 Dicas para Massa de Dados

### Gerar Múltiplos Contratos Rapidamente

1. **Use Fórmulas do Excel**:
```excel
# Célula A2 (Contrato)
=A1+1

# Célula B2 (Denominação)
="CT - AG CIDADE" & ROW() & ", UF"

# Arraste para baixo para gerar múltiplas linhas
```

2. **Varie os Dados**:
- Estados diferentes: AL, PE, SP, RJ, MG, BA, etc.
- Cidades variadas
- Datas distribuídas ao longo dos anos
- Mix de CPF e CNPJ

3. **Mantenha Consistência**:
- Locador pode ter múltiplos contratos
- Use mesmo CPF/CNPJ para contratos do mesmo locador
- Endereços devem ser completos

## ⚠️ Validações Automáticas

O script faz as seguintes validações:

- ✅ Remove valores vazios (NaN)
- ✅ Formata datas automaticamente
- ✅ Identifica tipo de pessoa por documento
- ✅ Cria relacionamento imóvel ↔ locador
- ✅ Evita locadores duplicados
- ✅ Extrai cidade/UF da denominação

## 📊 Exemplo de Dataset Completo

Para ter um protótipo realista, recomendo:

- **Mínimo**: 10-20 contratos
- **Ideal**: 50-100 contratos
- **Teste de Performance**: 500+ contratos

### Template de Variação

```
Estados: AL, PE, BA, SE, RN, PB, CE, PI, MA
Cidades por Estado: 3-5 principais
Locadores: 30-40 únicos (alguns com múltiplos contratos)
Datas: Distribuir entre 2015-2030
Status: 70% Ativo, 20% Em Desmobilização, 10% Desativado
```

## 🔄 Automação Futura

Para gerar dados de teste automaticamente:

```python
# Futuro: gerar-dados-teste.py
import pandas as pd
import random
from faker import Faker

fake = Faker('pt_BR')

dados = []
for i in range(100):
    dados.append({
        'Contrato': 10000000 + i,
        'Denominação do contrato': f"CT - AG {fake.city()}, {fake.state_abbr()}",
        'Nome/ender.': fake.name(),
        'NºID fiscal': fake.cpf(),
        # ... mais campos
    })

df = pd.DataFrame(dados)
df.to_excel('public/rel-SAP.xlsx', index=False)
```

---

**Dúvidas?** Consulte `scripts/README.md` ou abra uma issue no repositório.
