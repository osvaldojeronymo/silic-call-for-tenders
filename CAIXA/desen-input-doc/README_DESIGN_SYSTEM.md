# SILIC 2.0 - Design System Dashboard

## 📋 Sobre o Projeto

Este projeto contém o **Design System completo** extraído e adaptado da página `show-request-service` para o contexto de **dashboards do projeto SILIC 2.0**, garantindo identidade visual moderna, consistente e institucional da CAIXA.

## 🎯 Objetivo

Unificar o visual dos módulos, priorizando o padrão superior da `show-request-service`, e aplicar/adaptar seus componentes e estilos para dashboards técnicos e operacionais.

## 🌐 Links Ativos (GitHub Pages)

### Páginas Principais
- **Dashboard Principal**: https://osvaldojeronymo.github.io/desen-input-doc/
- **Demonstração do Design System**: https://osvaldojeronymo.github.io/desen-input-doc/dashboard-demo.html
- **Index Original**: https://osvaldojeronymo.github.io/desen-input-doc/index.html

### Arquivos CSS
- **Design System Completo**: https://osvaldojeronymo.github.io/desen-input-doc/design-system-dashboard.css
- **Styles Principal**: https://osvaldojeronymo.github.io/desen-input-doc/style.css

## 📁 Estrutura de Arquivos

```
├── index.html                              # Dashboard principal
├── dashboard-demo.html                     # Demonstração do design system
├── design-system-dashboard.css            # Design system completo extraído
├── style.css                              # Estilos principais refatorados
├── logo-caixa.svg                         # Logo institucional CAIXA
├── DESIGN_SYSTEM_DASHBOARD_COMPLETO.md    # Documentação detalhada
└── README_DESIGN_SYSTEM.md               # Este arquivo
```

## 🎨 Componentes Implementados

### CSS Variables (Design Tokens)
- **Cores**: Paleta institucional CAIXA + tons modernos
- **Sombras**: Sistema gradual de elevação (box-shadow)
- **Tipografia**: Hierarquia tipográfica completa
- **Espaçamentos**: Sistema modular de spacing
- **Bordas**: Radius padronizados
- **Transições**: Animações suaves e consistentes

### Componentes
- **Cards**: Diversos tipos com elevação e hover effects
- **Botões**: Estados completos (primary, secondary, success, warning, danger)
- **Formulários**: Inputs, selects, textareas com validação visual
- **Tabelas**: Responsivas com hover e zebra striping
- **Stepper**: Indicador de progresso com estados
- **Notificações**: Sistema de alertas (success, warning, error, info)
- **Modais**: Overlay com animações
- **Navigation**: Sidebar e breadcrumbs

### Utilitários
- **Layout**: Flexbox e Grid helpers
- **Responsividade**: Breakpoints móveis
- **Spacing**: Classes de margin e padding
- **Text**: Alinhamento e decoração
- **Display**: Show/hide responsivo

## 🔧 Como Usar

### 1. Importar o Design System
```html
<link rel="stylesheet" href="design-system-dashboard.css">
```

### 2. Usar as Classes CSS
```html
<!-- Card exemplo -->
<div class="card card-elevated">
    <h3 class="card-title">Título do Card</h3>
    <p class="card-content">Conteúdo do card...</p>
    <div class="card-actions">
        <button class="btn btn-primary">Ação</button>
    </div>
</div>
```

### 3. CSS Variables
```css
.custom-element {
    background-color: var(--color-primary);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-elevated);
}
```

## 🚀 Features Implementadas

✅ **Design System Completo** - CSS Variables + Componentes  
✅ **Responsividade** - Mobile-first approach  
✅ **Identidade CAIXA** - Cores e elementos institucionais  
✅ **Componentes Modernos** - Cards, botões, formulários  
✅ **Documentação** - Guias de uso detalhados  
✅ **GitHub Pages** - Deploy automático  
✅ **Acessibilidade** - Contraste e navegação  

## 📖 Documentação Detalhada

Para informações completas sobre implementação, consulte:
- [DESIGN_SYSTEM_DASHBOARD_COMPLETO.md](DESIGN_SYSTEM_DASHBOARD_COMPLETO.md)

## 🔄 Versionamento

- **v1.0** - Design System base extraído da show-request-service
- **v1.1** - Adaptação para contexto de dashboard
- **v1.2** - Deploy e validação GitHub Pages

## 💻 Desenvolvimento Local

```bash
# Clonar repositório
git clone https://github.com/osvaldojeronymo/desen-input-doc.git

# Servir localmente (exemplo com Python)
python -m http.server 8000

# Acessar: http://localhost:8000
```

## 📝 Próximos Passos

- [ ] Testes de compatibilidade cross-browser
- [ ] Otimização de performance
- [ ] Implementação de temas dark/light
- [ ] Expansão de componentes (datatables, charts)
- [ ] Integração com framework JS (React/Vue)

---

**Desenvolvido para CAIXA - SILIC 2.0**  
Mantendo excelência em identidade visual e experiência do usuário.
