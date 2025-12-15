# SILIC Input Doc - TypeScript + Vite

Este é o projeto SILIC Input Doc migrado para TypeScript e Vite, baseado no repositório original em JavaScript.

## 🚀 Tecnologias Utilizadas

- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Vite** - Build tool moderna e rápida
- **CSS3** - Estilização seguindo padrões da CAIXA
- **HTML5** - Estrutura semântica

## 📁 Estrutura do Projeto

```
silic-input-doc/
├── src/
│   ├── components/          # Componentes reutilizáveis (futuro)
│   ├── styles/              # Arquivos CSS
│   │   └── style.css
│   ├── types/               # Definições TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilitários
│   │   └── index.ts
│   └── main.ts              # Arquivo principal da aplicação
├── public/
│   └── logo-caixa.svg       # Assets estáticos
├── index-new.html           # Arquivo HTML principal (migrado)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Instalação e Uso

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```
   
3. **Fazer build para produção:**
   ```bash
   npm run build
   ```

4. **Verificar tipos TypeScript:**
   ```bash
   npm run typecheck
   ```

## 📋 Funcionalidades

### ✅ Implementadas
- ✅ Configuração TypeScript + Vite
- ✅ Estrutura modular de arquivos
- ✅ Tipos TypeScript definidos
- ✅ Geração de dados de demonstração
- ✅ Sistema de dashboard com estatísticas
- ✅ Classe principal SistemaSILIC

### 🔄 Em Desenvolvimento
- 🔄 Interface de gestão de imóveis
- 🔄 Sistema de filtros e busca
- 🔄 Paginação
- 🔄 Modais de detalhes
- 🔄 Gestão de locadores

### 📝 Tipos Principais

```typescript
interface Imovel {
  id: string;
  codigo: string;
  endereco: string;
  cidade: string;
  tipo: 'residencial' | 'comercial' | 'terreno' | 'industrial';
  status: 'disponivel' | 'ocupado' | 'manutencao' | 'vendido';
  valor?: number;
  // ... outros campos
}

interface Locador {
  id: string;
  nome: string;
  tipo: 'fisica' | 'juridica';
  documento: string;
  status: 'ativo' | 'inativo';
  // ... outros campos
}
```

## 🎯 Diferenças da Versão Original

1. **TypeScript:** Adiciona tipagem estática e melhor intellisense
2. **Vite:** Build mais rápido e desenvolvimento otimizado
3. **Estrutura Modular:** Código organizado em módulos
4. **Utilitários:** Funções helper tipadas para formatação e validação

## 🔧 Configurações

### Vite (vite.config.ts)
- Porta: 3000
- Aliases para imports relativos
- Build otimizado

### TypeScript (tsconfig.json)
- Target: ES2020
- Strict mode habilitado
- Path mapping configurado

## 📞 Suporte

Para dúvidas sobre a migração ou funcionalidades, consulte:
- Documentação original no repositório
- Arquivos de demonstração na pasta raiz
- Código TypeScript comentado em `src/`

## 🚀 Próximos Passos

1. Completar migração das funcionalidades restantes
2. Implementar testes unitários
3. Configurar CI/CD
4. Adicionar documentação de componentes
5. Otimizar performance