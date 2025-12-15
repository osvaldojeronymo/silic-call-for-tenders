// Init bootstrap for SILIC 2.0 without inline scripts
// Exposes helper functions on window and starts the system

// Import styles
import './styles/style.css';

// Type helper for global window
declare global {
  interface Window {
    sistema: any;
    voltarAoPortal: () => void;
    fecharModalDetalhes: () => void;
  }
}

// Attach global helpers
window.voltarAoPortal = () => {
  import('./main').then((module) => {
    if (typeof module.voltarAoPortal === 'function') {
      module.voltarAoPortal();
    }
  });
};

window.fecharModalDetalhes = () => {
  const modal = document.getElementById('modalDetalhes');
  if (modal) modal.style.display = 'none';
};

// Start application
window.addEventListener('DOMContentLoaded', () => {
  import('./main').then((module) => {
    try {
      window.sistema = new (module as any).SistemaSILIC();
    } catch (e) {
      console.error('Falha ao iniciar SistemaSILIC', e);
    }
  });
});
