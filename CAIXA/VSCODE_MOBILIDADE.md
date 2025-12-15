# 💻 VS Code - Configuração para Mobilidade Total

## 🎯 **Objetivo: Trabalhar Seamlessly entre Ubuntu e Windows**

---

## 🔧 **1. EXTENSÕES ESSENCIAIS**

### **Sincronização e Mobilidade:**
```json
{
    "recommendations": [
        "ms-vscode.vscode-settings-sync",
        "ms-vscode-remote.remote-ssh",
        "ms-vscode.remote-explorer",
        "ms-vscode.live-share",
        "ritwickdey.liveserver",
        "eamodio.gitlens",
        "ms-vscode.vscode-github-pullrequest",
        "github.vscode-pull-request-github"
    ]
}
```

### **Desenvolvimento Web (SILIC):**
```json
{
    "recommendations": [
        "bradlc.vscode-tailwindcss",
        "formulahendry.auto-rename-tag",
        "ms-vscode.vscode-css-peek",
        "ms-vscode.vscode-html-css-support",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint"
    ]
}
```

---

## ⚙️ **2. CONFIGURAÇÕES SINCRONIZADAS**

### **settings.json (Multiplataforma):**
```json
{
    // Git e GitHub
    "git.autofetch": true,
    "git.confirmSync": false,
    "git.enableSmartCommit": true,
    "github.gitProtocol": "https",
    
    // Editor
    "editor.formatOnSave": true,
    "editor.tabSize": 2,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": true,
    
    // Files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.trimTrailingWhitespace": true,
    
    // Terminal (adapta automaticamente ao SO)
    "terminal.integrated.defaultProfile.linux": "bash",
    "terminal.integrated.defaultProfile.windows": "PowerShell",
    
    // Live Server
    "liveServer.settings.donotShowInfoMsg": true,
    "liveServer.settings.donotVerifyTags": true,
    
    // Workspace
    "workbench.startupEditor": "welcomePage",
    "workbench.colorTheme": "Dark+ (default dark)",
    
    // SILIC Specific
    "emmet.includeLanguages": {
        "javascript": "javascriptreact"
    }
}
```

---

## 🌐 **3. SETUP GITHUB.DEV**

### **Acesso Rápido aos Repositórios:**
```
# Dashboard Técnico
https://github.dev/osvaldojeronymo/silic-dashboard-tecnico

# Portal Principal  
https://github.dev/osvaldojeronymo/silic-portal

# Gestão de Imóveis
https://github.dev/osvaldojeronymo/silic-gestao-imoveis

# Solicitações
https://github.dev/osvaldojeronymo/silic-solicitacoes
```

### **Bookmarks Recomendados:**
- 📁 SILIC Portal (github.dev)
- 🏠 SILIC Dashboard (github.dev)  
- 📋 SILIC Gestão (github.dev)
- 📝 SILIC Solicitações (github.dev)
- 📊 GitHub Actions (builds)
- 🌐 GitHub Pages (demos)

---

## 🔄 **4. SINCRONIZAÇÃO AUTOMÁTICA**

### **Git Aliases Úteis:**
```bash
# Adicionar ao ~/.gitconfig (Ubuntu) e ~/.gitconfig (Windows)
[alias]
    sync = !git pull && git push
    save = !git add . && git commit -m "Auto-save: $(date)" && git push
    quick = !git add . && git commit -m
    deploy = !git add . && git commit -m "Deploy: $(date)" && git push
    backup = !git add . && git commit -m "Backup: $(date)" && git push
```

### **Uso dos Aliases:**
```bash
# Salvar trabalho rapidamente
git save

# Commit com mensagem
git quick "feat: nova funcionalidade"

# Deploy rápido
git deploy
```

---

## 📱 **5. WORKFLOW MOBILE**

### **Cenário 1: Ubuntu Desktop → Windows Notebook**
```bash
# Ubuntu (antes de sair)
cd ~/Projetos/SILIC/silic-dashboard-tecnico
git add .
git commit -m "WIP: continuando no notebook"
git push

# Windows (ao chegar)
cd C:\Users\[usuario]\Projetos\SILIC\silic-dashboard-tecnico
git pull
code .
```

### **Cenário 2: Qualquer Lugar (GitHub.dev)**
```
1. Acesse github.dev/osvaldojeronymo/silic-dashboard-tecnico
2. Faça as edições necessárias
3. Commit & Push direto no navegador
4. Continue no desktop/notebook com git pull
```

### **Cenário 3: Emergência (Mobile)**
```
1. GitHub Mobile App
2. Editar arquivos direto no navegador
3. Quick fixes via GitHub.dev no celular
```

---

## 🚀 **6. PRODUTIVIDADE MÁXIMA**

### **Keybindings Personalizados:**
```json
[
    {
        "key": "ctrl+shift+s",
        "command": "git.stage"
    },
    {
        "key": "ctrl+shift+c", 
        "command": "git.commit"
    },
    {
        "key": "ctrl+shift+p",
        "command": "git.push"
    },
    {
        "key": "ctrl+shift+l",
        "command": "liveServer.goOnline"
    }
]
```

### **Snippets SILIC:**
```json
{
    "SILIC Header": {
        "scope": "html",
        "prefix": "silic-header",
        "body": [
            "<header>",
            "    <div class=\"header-content\">",
            "        <div class=\"title-section\">",
            "            <h1>SILIC 2.0</h1>",
            "            <p class=\"subtitle\">$1</p>",
            "        </div>",
            "    </div>",
            "</header>"
        ]
    }
}
```

---

## 📋 **7. CHECKLIST DE SETUP**

### **Primeira Configuração:**
- [ ] Instalar VS Code (Ubuntu + Windows)
- [ ] Configurar Settings Sync
- [ ] Instalar extensões essenciais
- [ ] Configurar Git aliases
- [ ] Testar GitHub.dev
- [ ] Criar bookmarks dos repositórios
- [ ] Configurar keybindings

### **Workflow Diário:**
- [ ] git pull (ao iniciar)
- [ ] Trabalhar com auto-save
- [ ] git save (intervalos regulares)
- [ ] git deploy (ao finalizar)
- [ ] Testar em GitHub Pages

---

## 🎯 **RESULTADO ESPERADO**

✅ **Mobilidade Total:** Trabalhar de qualquer lugar  
✅ **Sincronização Automática:** Sem perda de dados  
✅ **Produtividade Alta:** Workflow otimizado  
✅ **Backup Contínuo:** Tudo na nuvem  
✅ **Colaboração Fácil:** Share e review online  

---

**💡 Com essa configuração, você terá máxima flexibilidade para desenvolver o SILIC 2.0 de qualquer lugar, usando apenas o que tem em mãos!**
