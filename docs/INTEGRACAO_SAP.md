# 🗂️ Integração com Dados do SAP

## 📋 Visão Geral

Este protótipo foi integrado com dados reais do **SAP** da Caixa Econômica Federal para gerenciamento de contratos de locação de imóveis.

## 🔄 Fluxo de Dados

### 1. Dados de Origem (SAP)
- **Arquivo**: `public/rel-SAP.xlsx`
- **Formato**: Excel com 22 colunas
- **Conteúdo**: Contratos de locação de imóveis da CAIXA

### 2. Script de Importação
- **Localização**: `scripts/import-sap-data.py`
- **Linguagem**: Python 3
- **Dependências**: pandas, openpyxl

### 3. Dados Convertidos
- **Arquivo**: `public/dados-sap.json`
- **Formato**: JSON compatível com TypeScript
- **Estrutura**: Imóveis + Locadores + Metadados

## 📊 Estrutura dos Dados SAP

### Campos do Excel (rel-SAP.xlsx)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Contrato | Número | Número do contrato |
| Denominação do contrato | Texto | Nome/descrição do contrato |
| Denom.tipo contrato | Texto | Tipo do contrato |
| Início do contrato | Data | Data de início |
| Fim da validade | Data | Data de término |
| Rescisão em | Data | Data de rescisão (se houver) |
| Parceiro de negócios | Número | ID do parceiro |
| Tipo ID Fiscal | Texto | CPF ou CNPJ |
| NºID fiscal | Número | Número do documento |
| Nome/ender. | Texto | Nome e endereço do locador |
| Denom.função PN | Texto | Função do parceiro |
| Rua | Texto | Logradouro |
| Nº | Número | Número do imóvel |
| Bairro | Texto | Bairro |
| Local | Texto | Cidade |
| Região | Texto | Estado (UF) |
| Código postal | Texto | CEP |
| Nº telefone | Número | Telefone fixo |
| Telefone celular | Número | Celular |

### Mapeamento SAP → Protótipo

#### Imóveis
```
SAP → Protótipo
├── Contrato → codigo
├── Denominação do contrato → endereco
├── Bairro → bairro
├── Local → cidade
├── Região → estado
├── Código postal → cep
├── Denom.tipo contrato → tipo (mapeado)
├── Status calculado → status (baseado em datas)
└── Características extras → caracteristicas
```

#### Locadores
```
SAP → Protótipo
├── Nome/ender. → nome (extraído)
├── Tipo ID Fiscal → tipo (fisica/juridica)
├── NºID fiscal → documento
├── Nº telefone → telefone
├── Rua → endereco.logradouro
├── Nº → endereco.numero
├── Bairro → endereco.bairro
├── Local → endereco.cidade
├── Região → endereco.estado
└── Código postal → endereco.cep
```

## 🚀 Como Usar

### Importar Dados do SAP

```bash
# 1. Coloque o arquivo Excel na pasta public/
cp seu-arquivo.xlsx public/rel-SAP.xlsx

# 2. Execute o script de importação
python3 scripts/import-sap-data.py

# 3. Arquivo JSON será gerado automaticamente
# Output: public/dados-sap.json
```

### Estrutura do JSON Gerado

```json
{
  "imoveis": [
    {
      "id": "726cdcaeb7cc",
      "codigo": "10000000",
      "endereco": "CT - AG VIÇOSA DE ALAGOAS, AL",
      "bairro": "BOA VIAGEM",
      "cidade": "VIÇOSA DE ALAGOAS",
      "estado": "AL",
      "cep": "51021-000",
      "tipo": "comercial",
      "status": "ocupado",
      "caracteristicas": {
        "contratoInicio": "1997-05-12T00:00:00",
        "contratoFim": "2027-05-12T00:00:00",
        "tipoContrato": "Contrato de Locação - Imóveis",
        "parceiroNegocio": "900127165"
      },
      "locadorId": "87c4ddf250af"
    }
  ],
  "locadores": [
    {
      "id": "87c4ddf250af",
      "nome": "GERALDINA TOLEDO DE VASCONCELOS VASCONCELOS",
      "tipo": "fisica",
      "documento": "398047472",
      "telefone": "8233773208",
      "endereco": {
        "logradouro": "AVENIDA BOA VIAGEM AP 802",
        "numero": "3962",
        "bairro": "BOA VIAGEM",
        "cidade": "RECIFE",
        "estado": "PE",
        "cep": "51021-000"
      },
      "status": "ativo"
    }
  ],
  "metadados": {
    "dataImportacao": "2025-11-12T13:33:26.838012",
    "fonte": "SAP - rel-SAP.xlsx",
    "totalImoveis": 1,
    "totalLocadores": 1
  }
}
```

## 🎯 Lógica de Carregamento

O protótipo implementa um **sistema inteligente de carregamento**:

1. **Prioridade**: Tenta carregar dados do SAP primeiro
2. **Fallback**: Se não encontrar, usa dados de demonstração
3. **Indicador Visual**: Mostra qual fonte está sendo utilizada
4. **Notificação**: Informa o usuário sobre a fonte de dados

### Código TypeScript

```typescript
// Carrega dados automaticamente
private async carregarDados(): Promise<void> {
  const dadosSAP = await SAPDataLoader.carregarDados();
  
  if (dadosSAP && dadosSAP.imoveis.length > 0) {
    // Usa dados reais do SAP
    this.imoveis = dadosSAP.imoveis;
    this.locadores = dadosSAP.locadores;
    this.usandoDadosSAP = true;
  } else {
    // Usa dados demo
    this.carregarDadosDemo();
    this.usandoDadosSAP = false;
  }
}
```

## 📈 Regras de Negócio

### Determinação do Tipo de Imóvel
```python
def determinar_tipo_imovel(denominacao):
    if 'ag ' in denominacao or 'agência' in denominacao:
        return 'comercial'
    elif 'residencial' in denominacao or 'casa' in denominacao:
        return 'residencial'
    elif 'terreno' in denominacao or 'lote' in denominacao:
        return 'terreno'
    elif 'galpão' in denominacao or 'industrial' in denominacao:
        return 'industrial'
    else:
        return 'comercial'  # Default para agências
```

### Determinação do Status
```python
def determinar_status_contrato(row):
    if tem_data_rescisao:
        return 'vendido'
    elif contrato_vencido:
        return 'manutencao'
    elif contrato_vigente:
        return 'ocupado'
    else:
        return 'disponivel'
```

## 🎨 Interface do Usuário

### Indicador de Fonte de Dados
- **Verde** (🗂️ Dados do SAP): Usando dados reais
- **Laranja** (📋 Dados Demo): Usando dados de demonstração

### Notificações
- Aparece no canto superior direito
- Desaparece automaticamente após 5 segundos
- Animação suave de entrada/saída

## 🔧 Configuração do Ambiente

### Dependências Python
```bash
pip install pandas openpyxl
```

### Arquivos Necessários
```
public/
├── rel-SAP.xlsx        # Arquivo Excel do SAP (entrada)
└── dados-sap.json      # Arquivo JSON gerado (saída)

scripts/
└── import-sap-data.py  # Script de conversão
```

## 📝 Exemplo Completo

### 1. Preparar Dados
```bash
# Copiar arquivo do SAP
cp /caminho/para/arquivo-sap.xlsx public/rel-SAP.xlsx
```

### 2. Executar Importação
```bash
python3 scripts/import-sap-data.py
```

### 3. Executar Protótipo
```bash
npm run dev
```

### 4. Resultado
O protótipo automaticamente:
- ✅ Detecta o arquivo `dados-sap.json`
- ✅ Carrega os dados reais
- ✅ Mostra indicador "🗂️ Dados do SAP"
- ✅ Exibe notificação de sucesso

## 🎯 Benefícios

1. **Dados Reais**: Trabalha com contratos reais da CAIXA
2. **Automático**: Detecção e carregamento automático
3. **Flexível**: Fallback para dados demo se necessário
4. **Rastreável**: Metadados de importação incluídos
5. **Validado**: TypeScript garante tipagem correta

## 🔍 Troubleshooting

### Dados não carregam
- Verificar se `public/dados-sap.json` existe
- Verificar console do navegador para erros
- Verificar se o caminho está correto no `SAPDataLoader`

### Script de importação falha
- Verificar se pandas e openpyxl estão instalados
- Verificar se o arquivo Excel existe em `public/rel-SAP.xlsx`
- Verificar permissões de escrita na pasta `public/`

### Tipos de dados incompatíveis
- Verificar se a estrutura do Excel mudou
- Atualizar mapeamento no script Python se necessário
- Verificar interfaces TypeScript em `src/types/index.ts`

## 📚 Documentação Adicional

- [README Principal](../README.md)
- [Documentação TypeScript](../README-TS.md)
- [Tipos TypeScript](../src/types/index.ts)
- [Loader de Dados](../src/utils/sapDataLoader.ts)

---

**Última atualização**: 12 de novembro de 2025
**Versão**: 1.0.0
**Autor**: Sistema SILIC 2.0
