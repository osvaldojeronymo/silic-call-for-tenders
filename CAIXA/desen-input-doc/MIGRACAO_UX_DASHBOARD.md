# Guia de Migração UX - Dashboard Técnico SILIC 2.0

## Objetivo
Migrar o visual e experiência do dashboard técnico para o padrão superior do módulo show-request-service, garantindo:
- Layout moderno e responsivo
- Identidade visual institucional CAIXA
- Consistência entre módulos
- Máxima usabilidade e produtividade

## 🎨 Padrões Visuais de Referência

### Header Principal
```css
/* Header moderno com background gradient e sombra */
.header {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    box-shadow: var(--shadow-lg);
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo {
    height: 40px;
    width: auto;
}

.title-section h1 {
    color: white;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0;
    letter-spacing: -0.02em;
}

.subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    margin: 0;
    font-weight: 400;
}
```

### Container Principal
```css
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 120px);
}

.dashboard-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}
```

### Cards Modernos
```css
.card {
    background: var(--white);
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--gray-200);
    transition: all var(--transition-normal);
    overflow: hidden;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.card-header {
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid #f0f0f0;
}

.card-content {
    padding: 2rem;
}

.card-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary);
    margin: 0 0 0.5rem;
    letter-spacing: -0.01em;
}
```

### Grid de Estatísticas
```css
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: var(--white);
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    border-left: 4px solid var(--accent);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-normal);
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 0.5rem;
    line-height: 1;
}

.stat-label {
    color: var(--gray-600);
    font-size: 0.95rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

### Tipografia
```css
/* Hierarquia tipográfica clara */
h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem; font-weight: 600; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }

/* Textos de corpo */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--gray-700);
}
```

### Cores Institucionais
```css
:root {
    /* Cores CAIXA */
    --primary: #003366;
    --primary-light: #0056b3;
    --primary-dark: #002244;
    --accent: #F39200;
    --accent-hover: #E67E22;
    
    /* Escala de cinzas moderna */
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    /* Estados e feedback */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Sombras */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.15);
    
    /* Transições */
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.6s ease;
}
```

## 🚀 Plano de Aplicação

### Etapa 1: Header e Layout Base
1. Substituir header atual pelo novo padrão
2. Aplicar container responsivo
3. Ajustar grid principal

### Etapa 2: Cards e Componentes
1. Modernizar cards de estatísticas
2. Aplicar efeitos hover suaves
3. Melhorar hierarquia visual

### Etapa 3: Tipografia e Cores
1. Aplicar nova escala tipográfica
2. Usar cores institucionais atualizadas
3. Garantir contraste adequado

### Etapa 4: Responsividade
1. Testar em diferentes breakpoints
2. Ajustar grids mobile-first
3. Otimizar para tablets

## 📱 Breakpoints Responsivos
```css
/* Mobile first */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

## ✅ Checklist de Implementação

- [ ] Header moderno aplicado
- [ ] Container responsivo implementado
- [ ] Cards com design atualizado
- [ ] Grid de estatísticas otimizado
- [ ] Tipografia hierárquica aplicada
- [ ] Cores institucionais implementadas
- [ ] Efeitos hover suaves
- [ ] Responsividade testada
- [ ] Acessibilidade verificada
- [ ] Performance otimizada

---

**Resultado esperado:** Dashboard técnico com visual moderno, profissional e alinhado aos padrões de excelência da CAIXA, garantindo experiência superior ao usuário.
