# 📊 Conversão de Planilha Excel para JSON

## Visão Geral

Este diretório contém scripts para converter a planilha `rel-SAP.xlsx` em um arquivo JSON estruturado (`dados-sap.json`) que pode ser usado pela aplicação.

## 🎯 Objetivo

Facilitar o desenvolvimento do protótipo sem necessidade de conexão com banco de dados, permitindo:
- ✅ Edição fácil dos dados via Excel
- ✅ Versionamento adequado no Git (JSON)
- ✅ Simulação realista de carregamento assíncrono
- ✅ Preparação para integração futura com API SAP

## 📁 Arquivos

- **`converter-excel-para-json.py`**: Script Python principal que faz a conversão
- **`excel-para-json.sh`**: Script bash para facilitar a execução
- **`../public/rel-SAP.xlsx`**: Planilha Excel com dados do SAP
- **`../public/dados-sap.json`**: JSON gerado (usado pela aplicação)

## 🚀 Como Usar

### Opção 1: Script Bash (Recomendado)

```bash
./scripts/excel-para-json.sh
```

### Opção 2: Python Direto

```bash
source .venv/bin/activate
python scripts/converter-excel-para-json.py
```

### Opção 3: Integração com NPM

Adicione ao `package.json`:

```json
{
  "scripts": {
    "convert:excel": "python scripts/converter-excel-para-json.py"
  }
}
```

Execute:
```bash
npm run convert:excel
```

## 📋 Estrutura da Planilha Excel

A planilha deve conter as seguintes colunas:

### Dados do Contrato
- **Contrato**: Código do contrato (ex: 10000000)
- **Denominação do contrato**: Nome do contrato (ex: CT - AG VIÇOSA DE ALAGOAS, AL)
- **Denom.tipo contrato**: Tipo do contrato (ex: Contrato de Locação - Imóveis)
- **Início do contrato**: Data de início (formato: DD/MM/YYYY ou ISO)
- **Fim da validade**: Data fim da validade (formato: DD/MM/YYYY ou ISO)
- **Rescisão em**: Data de rescisão (opcional)

### Dados do Locador
- **Parceiro de negócios**: Código do parceiro
- **Tipo ID Fiscal**: Tipo (CPF, CNPJ, etc.)
- **NºID fiscal**: Número do documento
- **Nome/ender.**: Nome completo do locador
- **Denom.função PN**: Função do parceiro (ex: Proponente Credor)
- **Início da relação**: Data início da relação
- **Fim da relação**: Data fim da relação

### Endereço
- **Rua**: Logradouro
- **Nº**: Número
- **Bairro**: Bairro
- **Local**: Cidade
- **Região**: UF/Estado
- **Código postal**: CEP

### Contato
- **Endereço de e-mail**: Email do locador
- **Nº telefone**: Telefone fixo
- **Telefone celular**: Celular

## 📊 Estrutura do JSON Gerado

```json
{
  "imoveis": [
    {
      "id": "imovel_000001",
      "codigo": "10000000",
      "denominacao": "CT - AG VIÇOSA DE ALAGOAS, AL",
      "tipoContrato": "Contrato de Locação - Imóveis",
      "local": "VIÇOSA DE ALAGOAS",
      "cidade": "VIÇOSA DE ALAGOAS",
      "estado": "AL",
      "endereco": "...",
      "status": "Ativo",
      "inicioValidade": "1997-05-12T00:00:00",
      "objetoValidoAte": "2027-05-12T00:00:00",
      "locadorId": "locador_000001",
      ...
    }
  ],
  "locadores": [
    {
      "id": "locador_000001",
      "nome": "...",
      "tipo": "fisica",
      "documento": "...",
      "telefone": "...",
      ...
    }
  ],
  "metadados": {
    "dataImportacao": "2025-11-17T13:45:59.350077",
    "fonte": "rel-SAP.xlsx",
    "totalRegistros": 1
  }
}
```

## 🔄 Workflow Recomendado

1. **Editar Dados**: Abra `public/rel-SAP.xlsx` no Excel
2. **Adicionar/Modificar**: Adicione ou edite linhas conforme necessário
3. **Salvar**: Salve o arquivo Excel
4. **Converter**: Execute `./scripts/excel-para-json.sh`
5. **Verificar**: Abra a aplicação e veja os dados atualizados

## ⚙️ Configuração do Ambiente

### Primeira vez (já configurado):

```bash
# Criar ambiente virtual
python3 -m venv .venv

# Ativar ambiente
source .venv/bin/activate

# Instalar dependências
pip install pandas openpyxl
```

## 🎨 Personalizações

### Adicionar Novos Campos

Edite `converter-excel-para-json.py`:

```python
imovel = {
    # ... campos existentes ...
    "novoCompo": limpar_valor(row.get('Nome Coluna Excel', '')),
}
```

### Regras de Negócio

Para aplicar regras específicas (ex: determinar status baseado em datas):

```python
# Exemplo: definir status baseado na data de validade
status = "Ativo"
if objetoValidoAte:
    data_validade = datetime.fromisoformat(objetoValidoAte)
    if data_validade < datetime.now():
        status = "Desativado"

imovel["status"] = status
```

## 🐛 Solução de Problemas

### Erro: "ModuleNotFoundError: No module named 'pandas'"
```bash
source .venv/bin/activate
pip install pandas openpyxl
```

### Erro: "FileNotFoundError: rel-SAP.xlsx"
Certifique-se de que o arquivo está em `public/rel-SAP.xlsx`

### Dados não aparecem na aplicação
1. Verifique se `dados-sap.json` foi gerado
2. Abra o navegador com DevTools (F12)
3. Verifique se há erros no console
4. Certifique-se de que a aplicação está carregando do JSON

## 📚 Próximos Passos

Após gerar o JSON, você pode:

1. **Integrar na aplicação**: Modificar `script.js` para carregar do JSON
2. **Expandir dados**: Adicionar mais linhas no Excel
3. **Validar**: Criar testes para garantir integridade dos dados
4. **Preparar API**: Usar a estrutura JSON como referência para a API real

## 🤝 Contribuindo

Ao adicionar novos campos:
1. Documente a coluna no Excel
2. Atualize o script de conversão
3. Atualize este README
4. Teste a conversão

---

**Última atualização**: 17/11/2025
**Autor**: Equipe de Desenvolvimento SILIC
