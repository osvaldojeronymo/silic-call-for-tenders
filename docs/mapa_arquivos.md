# Mapa de Arquivos e Conexões

Este relatório resume as conexões entre páginas HTML, scripts e estilos principais do repositório, para facilitar entendimento e limpeza.

## Entradas HTML e seus vínculos

- `index.html`
  - CSS: `/src/styles/style.css`, `/src/styles/modal-fix.css`, `/src/styles/final-fix.css`
  - Script (module): `/src/init.ts`

- `form-renderer.html`
  - Script (module): `/src/form-renderer/main.tsx` (React + RJSF)

- `portal.html`
  - CSS: `portal-style.css`
  - JS: `portal-script.js`

- `portal-simples.html`, `portal-melhorado.html`, `portal-inline.html`
  - Variações do portal (verificar dependências internas caso necessário)

- Páginas de teste/diagnóstico: `teste_*`, `debug_*`, `diagnostico_*`, `demonstracao_final.html`
  - Em geral usam: `style.css` e `script.js` (com query string `?v=20250709` em várias)

- Pasta `CAIXA/`
  - `CAIXA/index.html` e `CAIXA/silic-catalog-reasons/index.html`
    - CSS: `style.css`
    - JS: `main.js`
  - `desen-input-doc/*.html` (ex.: `dashboard-demo.html`, `index.html`)
    - CSS: `style.css` (e `design-system-dashboard.css` em demo)
    - JS: `script.js`

## Scripts e estilos centrais

- Raiz
  - `script.js`: usado por diversas páginas de teste e diagnóstico
  - `style.css`: usado por diversas páginas de teste e diagnóstico
  - `portal-script.js` + `portal-style.css`: usados em `portal.html`

- App Vite/TypeScript (`src/`)
  - `src/init.ts` (entrada de `index.html`)
    - importa `./styles/style.css`
  - `src/main.ts`
    - importa `./styles/style.css`, `./utils/index.js`, `./utils/sapDataLoader.js`, `./types/index.js`
  - `src/form-renderer/main.tsx` (entrada de `form-renderer.html`)
    - usa React, RJSF, Quill; importa `./FormRendererApp`

- Estilos do app
  - `src/styles/style.css` (+ `modal-fix.css`, `final-fix.css`)

## Observações de possível limpeza

- Muitos HTMLs de teste/diagnóstico (`teste_*.html`, `debug_*.html`, `diagnostico_*.html`) apontam para `script.js`/`style.css` na raiz. Se não forem mais usados em produção, podem ser movidos para `docs/` ou `examples/`.
- `portal-*.html` formam uma família separada que usa `portal-script.js`/`portal-style.css`. Se a versão oficial for apenas uma, considerar consolidar e arquivar variações.
- A pasta `CAIXA/` contém demos e materiais auxiliares (incluindo `desen-input-doc/`). Se não fizer parte do build principal, manter como submódulo de demos ou mover para `examples/`.

## Próximos passos sugeridos

1. Confirmar quais páginas são entradas “oficiais” (provável: `index.html`, `form-renderer.html`, `portal.html`).
2. Marcar HTMLs de teste/demonstração como exemplos e mover para `docs/` ou `examples/`.
3. Consolidar `portal` (escolher entre `portal.html`, `portal-simples.html`, `portal-melhorado.html`, `portal-inline.html`).
4. Criar script de verificação de órfãos (grep/AST) e CI opcional.

> Este arquivo pode ser atualizado conforme validarmos o que é produção vs. exemplo/demonstração.
