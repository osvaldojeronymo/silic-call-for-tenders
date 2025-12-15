# 📚 Índice da Documentação - SILIC 2.0

## 📖 Documentos Disponíveis

### 🚀 Início Rápido
- **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** - Guia rápido de uso em 3 passos
  - Como importar dados do SAP
  - Troubleshooting comum
  - Comandos úteis

### 🗂️ Integração SAP
- **[INTEGRACAO_SAP.md](INTEGRACAO_SAP.md)** - Documentação técnica completa
  - Estrutura dos dados
  - Mapeamento de campos
  - Regras de negócio
  - Exemplos de código

- **[RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md)** - Resumo executivo
  - O que foi implementado
  - Checklist de entrega
  - Aprendizados técnicos

### 📋 README Principal
- **[../README.md](../README.md)** - Visão geral do projeto
  - Tecnologias utilizadas
  - Estrutura do projeto
  - Comandos disponíveis

## 🎯 Por Onde Começar?

### Você quer...

#### 📥 Importar dados do SAP rapidamente?
👉 Comece pelo **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)**

#### 🔧 Entender como funciona a integração?
👉 Leia **[INTEGRACAO_SAP.md](INTEGRACAO_SAP.md)**

#### 📊 Ver resumo do que foi implementado?
👉 Acesse **[RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md)**

#### 💻 Conhecer o projeto como um todo?
👉 Consulte **[../README.md](../README.md)**

## 📂 Estrutura de Arquivos

```
docs/
├── README.md                   # Este arquivo (índice)
├── GUIA_RAPIDO.md             # ⚡ Guia rápido - 3 passos
├── INTEGRACAO_SAP.md          # 🗂️ Documentação técnica completa
└── RESUMO_INTEGRACAO.md       # 📊 Resumo executivo

../
├── README.md                   # 📋 README principal do projeto
├── import-sap.sh              # 🔧 Script de importação
├── scripts/
│   └── import-sap-data.py     # 🐍 Script Python de conversão
├── src/
│   ├── main.ts                # 💻 Sistema principal
│   └── utils/
│       └── sapDataLoader.ts   # 📦 Carregador de dados SAP
└── public/
    ├── rel-SAP.xlsx           # 📥 Dados do SAP (entrada)
    └── dados-sap.json         # 📤 Dados convertidos (saída)
```

## 🔍 Busca Rápida

### Precisa de...

| O que precisa | Onde encontrar |
|--------------|----------------|
| Importar dados | [GUIA_RAPIDO.md](GUIA_RAPIDO.md#-passo-a-passo-detalhado) |
| Estrutura do Excel | [INTEGRACAO_SAP.md](INTEGRACAO_SAP.md#-estrutura-dos-dados-sap) |
| Mapeamento de campos | [INTEGRACAO_SAP.md](INTEGRACAO_SAP.md#mapeamento-sap--protótipo) |
| Resolver erros | [GUIA_RAPIDO.md](GUIA_RAPIDO.md#-troubleshooting) |
| Ver código TypeScript | [INTEGRACAO_SAP.md](INTEGRACAO_SAP.md#-lógica-de-carregamento) |
| Comandos npm | [README.md](../README.md#-comandos-disponíveis) |
| Tecnologias usadas | [README.md](../README.md#-tecnologias) |
| Checklist implementação | [RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md#-checklist-de-entrega) |

## 📝 Fluxo de Leitura Sugerido

### Para Desenvolvedores
1. Leia [README.md](../README.md) - Visão geral
2. Siga [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Setup inicial
3. Estude [INTEGRACAO_SAP.md](INTEGRACAO_SAP.md) - Detalhes técnicos
4. Consulte [RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md) - Referência rápida

### Para Gestores
1. Leia [README.md](../README.md) - O que é o projeto
2. Veja [RESUMO_INTEGRACAO.md](RESUMO_INTEGRACAO.md) - O que foi entregue
3. Consulte [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Como usar

### Para Usuários Finais
1. Siga [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Passo a passo simples
2. Use [GUIA_RAPIDO.md](GUIA_RAPIDO.md#-troubleshooting) - Se tiver problemas

## 🎓 Glossário

- **SAP**: Sistema de gestão empresarial da CAIXA
- **Excel**: Arquivo `.xlsx` com dados do SAP
- **JSON**: Arquivo convertido para uso no protótipo
- **TypeScript**: Linguagem de programação usada
- **Vite**: Ferramenta de build do projeto
- **Locador**: Pessoa física ou jurídica que aluga imóvel
- **Imóvel**: Propriedade cadastrada no sistema

## 🆘 Ajuda Rápida

**Algo não funciona?**
1. Consulte [GUIA_RAPIDO.md - Troubleshooting](GUIA_RAPIDO.md#-troubleshooting)
2. Verifique console do navegador (F12)
3. Revise logs do terminal

**Precisa de exemplo?**
- Veja [INTEGRACAO_SAP.md - Exemplo Completo](INTEGRACAO_SAP.md#-exemplo-completo)

**Quer entender o código?**
- Leia [INTEGRACAO_SAP.md - Lógica de Carregamento](INTEGRACAO_SAP.md#-lógica-de-carregamento)

---

**Última atualização**: 12/11/2025  
**Versão**: 1.0.0  
**Projeto**: SILIC 2.0 - Sistema de Gestão de Imóveis
