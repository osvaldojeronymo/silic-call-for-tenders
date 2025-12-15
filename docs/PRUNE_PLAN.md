# Plano de Limpeza (escopo: implementação do schema JSON)

Este plano mantém apenas o necessário para a implementação baseada no arquivo `src/data/schema_formulario_gerador_edital_caixa_v1.json` e o form-renderer em React.

## Manter
- `form-renderer.html`
- `src/data/schema_formulario_gerador_edital_caixa_v1.json`
- `src/form-renderer/**` (React + RJSF + CSS do form)
- `package.json`, `vite.config.ts`, `tsconfig.json`
- `docs/**` (documentação)
- `scripts/prune_unrelated_files.sh`
- `README*.md`, `.gitignore`

## Candidatos a remover/arquivar
- Páginas e scripts não relacionados: `index.html`, `portal*.html`, `portal-*.css/js`, `script.js`, `style.css`, `debug_*.html`, `diagnostico_*.html`, `teste_*.html`, `demonstracao_final.html`
- Diretórios auxiliares/demos: `CAIXA/**`
- Código não usado pelo form-renderer: `src/init.ts`, `src/main.ts`, `src/styles/**`, `src/utils/**`, `src/types/**` (fora de `src/form-renderer/types.ts`)
- Qualquer outro arquivo fora da lista de "Manter"

## Execução segura
Use o script com dry-run primeiro:

```bash
bash scripts/prune_unrelated_files.sh --dry-run
```

Para arquivar (mover para `_archive/<timestamp>/`):

```bash
bash scripts/prune_unrelated_files.sh --archive
```

Para remover com `git rm` (permanente no repo):

```bash
bash scripts/prune_unrelated_files.sh --delete
```

Revise com `git status` e `git diff` antes de fazer commit.

> Ajuste os padrões de "Manter" no script se algo essencial estiver faltando.
