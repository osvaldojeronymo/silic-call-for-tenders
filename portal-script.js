// Portal SILIC 2.0 - Funcionalidades JavaScript
// Versão: 2025-07-10

// URLs dos sistemas
const URLS = {
    gestao: 'https://osvaldojeronymo.github.io/show-input-doc/',
    solicitacoes: 'https://osvaldojeronymo.github.io/show-request-service/'
};

// Dados de exemplo para status
const statusData = {
    imoveisAtivos: 100,
    solicitacoesPendentes: 15,
    auditoriasAndamento: 5
};

// Inicialização do portal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portal SILIC 2.0 carregado');
    
    // Animação de entrada dos cards
    animateCards();
    
    // Atualizar dados de status
    updateStatusData();
    
    // Adicionar eventos de teclado para acessibilidade
    setupKeyboardNavigation();
    
    // Analytics de uso (simulado)
    trackPageLoad();
});

// Função principal de navegação
function navegarPara(servico) {
    console.log(`Navegando para: ${servico}`);
    
    // Adicionar feedback visual
    const card = document.querySelector(`[data-service="${servico}"]`);
    if (card) {
        card.classList.add('loading');
        
        // Simular carregamento
        setTimeout(() => {
            // Abrir em nova aba para manter o portal disponível
            window.open(URLS[servico], '_blank');
            
            // Remover estado de loading
            card.classList.remove('loading');
            
            // Analytics
            trackNavigation(servico);
        }, 500);
    }
}

// Ações rápidas
function acao(tipo) {
    console.log(`Ação rápida: ${tipo}`);
    
    switch(tipo) {
        case 'cadastro-rapido':
            // Redirecionar para cadastro direto no sistema de gestão
            window.open(`${URLS.gestao}#cadastro-novo`, '_blank');
            break;
            
        case 'busca-sipge':
            // Redirecionar para busca no SIPGE
            window.open(`${URLS.gestao}#busca-sipge`, '_blank');
            break;
            
        case 'auditoria':
            // Redirecionar para auditoria
            window.open(`${URLS.gestao}#auditoria`, '_blank');
            break;
            
        case 'relatorio':
            // Abrir modal de relatórios ou redirecionar
            abrirModalRelatorios();
            break;
            
        default:
            console.warn(`Ação não reconhecida: ${tipo}`);
    }
    
    // Analytics
    trackQuickAction(tipo);
}

// Animação dos cards na entrada
function animateCards() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Atualizar dados de status
function updateStatusData() {
    const elementos = {
        imoveisAtivos: document.querySelector('.status-item:nth-child(1) .status-number'),
        solicitacoesPendentes: document.querySelector('.status-item:nth-child(2) .status-number'),
        auditoriasAndamento: document.querySelector('.status-item:nth-child(3) .status-number')
    };
    
    // Animação de contagem
    Object.keys(elementos).forEach(key => {
        const elemento = elementos[key];
        if (elemento) {
            animateCounter(elemento, statusData[key]);
        }
    });
}

// Animação de contador
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30; // 30 frames de animação
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 50);
}

// Configurar navegação por teclado
function setupKeyboardNavigation() {
    const cards = document.querySelectorAll('.service-card');
    const quickActions = document.querySelectorAll('.quick-action-btn');
    
    // Adicionar tabindex e eventos de teclado aos cards
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const servico = card.getAttribute('data-service');
                navegarPara(servico);
            }
        });
        
        // Efeito visual no foco
        card.addEventListener('focus', function() {
            card.style.transform = 'translateY(-3px)';
            card.style.boxShadow = '0 8px 25px rgba(0,102,204,0.3)';
        });
        
        card.addEventListener('blur', function() {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
    
    // Navegação por teclado nas ações rápidas
    quickActions.forEach(btn => {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

// Modal de relatórios
function abrirModalRelatorios() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Relatórios Disponíveis</h3>
                <button class="modal-close" onclick="fecharModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="relatorio-opcoes">
                    <button class="relatorio-btn" onclick="gerarRelatorio('imoveis')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor"/>
                        </svg>
                        Relatório de Imóveis
                    </button>
                    <button class="relatorio-btn" onclick="gerarRelatorio('solicitacoes')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Relatório de Solicitações
                    </button>
                    <button class="relatorio-btn" onclick="gerarRelatorio('auditoria')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Relatório de Auditoria
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adicionar estilos do modal
    adicionarEstilosModal();
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

function fecharModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function gerarRelatorio(tipo) {
    console.log(`Gerando relatório: ${tipo}`);
    
    // Simular geração de relatório
    const btn = event.target.closest('.relatorio-btn');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<span>Gerando...</span>';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Simular download ou abertura de relatório
        alert(`Relatório de ${tipo} gerado com sucesso!`);
        fecharModal();
        
        // Analytics
        trackReport(tipo);
    }, 2000);
}

// Adicionar estilos do modal dinamicamente
function adicionarEstilosModal() {
    if (document.querySelector('#modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--color-border);
        }
        
        .modal-header h3 {
            margin: 0;
            color: var(--color-primary);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-text-light);
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close:hover {
            background: var(--color-bg-light);
            color: var(--color-primary);
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .relatorio-opcoes {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .relatorio-btn {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: var(--color-white);
            border: 2px solid var(--color-border);
            border-radius: 8px;
            color: var(--color-primary);
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
        }
        
        .relatorio-btn:hover {
            border-color: var(--color-primary);
            background: var(--color-bg-hover);
        }
        
        .relatorio-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    
    document.head.appendChild(styles);
}

// Analytics e tracking (simulado)
function trackPageLoad() {
    console.log('📊 Analytics: Portal carregado', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        resolution: `${screen.width}x${screen.height}`
    });
}

function trackNavigation(servico) {
    console.log('📊 Analytics: Navegação', {
        servico: servico,
        timestamp: new Date().toISOString()
    });
}

function trackQuickAction(acao) {
    console.log('📊 Analytics: Ação rápida', {
        acao: acao,
        timestamp: new Date().toISOString()
    });
}

function trackReport(tipo) {
    console.log('📊 Analytics: Relatório gerado', {
        tipo: tipo,
        timestamp: new Date().toISOString()
    });
}

// Utilitários
function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

function showNotification(message, type = 'info') {
    // Implementação de notificações toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Verificar conectividade
function checkConnectivity() {
    if (navigator.onLine) {
        console.log('✅ Conectividade: Online');
    } else {
        console.log('❌ Conectividade: Offline');
        showNotification('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
    }
}

// Verificar conectividade ao carregar
window.addEventListener('load', checkConnectivity);
window.addEventListener('online', () => showNotification('Conexão restaurada', 'success'));
window.addEventListener('offline', () => showNotification('Conexão perdida', 'warning'));

// Prevenir comportamentos indesejados
document.addEventListener('dragstart', function(e) {
    e.preventDefault();
});

document.addEventListener('contextmenu', function(e) {
    // Permitir menu de contexto apenas em desenvolvimento
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        e.preventDefault();
    }
});

// Exportar funções para uso global
window.PortalSILIC = {
    navegarPara,
    acao,
    abrirModalRelatorios,
    fecharModal,
    gerarRelatorio
};
