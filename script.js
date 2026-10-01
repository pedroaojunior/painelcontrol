/**
 * Painel de Controle de Automação Residencial (n8n Webhook)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Chave do localStorage para override via interface
  const STORAGE_KEY_WEBHOOK = 'n8n_webhook_url';
  
  // Elementos do DOM
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const settingsForm = document.getElementById('settingsForm');
  const webhookUrlInput = document.getElementById('webhookUrlInput');
  const toastContainer = document.getElementById('toastContainer');
  const actionButtons = document.querySelectorAll('.card-actions button');

  // 1. Tenta carregar a URL do localStorage (override da UI)
  // 2. Se não houver override, tenta carregar do config.js (window.N8N_CONFIG.WEBHOOK_URL)
  let webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK) || window.N8N_CONFIG?.WEBHOOK_URL || '';

  // Função para buscar o config.json caso a URL ainda seja o valor de exemplo ou vazia
  async function loadConfigFromFile() {
    if (!webhookUrl || webhookUrl.includes('seu-n8n.com')) {
      try {
        const res = await fetch('config.json');
        if (res.ok) {
          const data = await res.json();
          if (data.WEBHOOK_URL && !data.WEBHOOK_URL.includes('seu-n8n.com')) {
            webhookUrl = data.WEBHOOK_URL;
          }
        }
      } catch (err) {
        // Arquivo config.json não encontrado ou sem acesso, segue o fluxo normal
      }
    }
  }

  function isUrlValid(url) {
    return url && !url.includes('seu-n8n.com') && (url.startsWith('http://') || url.startsWith('https://'));
  }

  function updateStatusIndicator() {
    if (!isUrlValid(webhookUrl)) {
      statusBadge.className = 'status-badge unconfigured';
      statusText.textContent = 'Configurar Webhook';
    } else {
      statusBadge.className = 'status-badge connected';
      statusText.textContent = 'Pronto';
    }
  }

  // Inicializa a leitura da configuração do arquivo
  await loadConfigFromFile();
  updateStatusIndicator();

  // Abrir modal de configurações
  openSettingsBtn.addEventListener('click', () => {
    webhookUrlInput.value = webhookUrl;
    settingsModal.showModal();
  });

  // Fechar modal
  function closeModal() {
    settingsModal.close();
  }

  closeSettingsBtn.addEventListener('click', closeModal);
  cancelSettingsBtn.addEventListener('click', closeModal);

  // Salvar formulário de configurações
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUrl = webhookUrlInput.value.trim();
    if (newUrl) {
      webhookUrl = newUrl;
      localStorage.setItem(STORAGE_KEY_WEBHOOK, webhookUrl);
      updateStatusIndicator();
      showToast('URL do Webhook salva com sucesso!', 'success');
      closeModal();
    }
  });

  // Resposta tátil (Vibração) em celulares
  function triggerHaptic() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch (e) {
        // Ignora caso restrito pelas políticas do navegador
      }
    }
  }

  // Notificações em Toast
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px) scale(0.95)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Dispara o comando para o Webhook do n8n
  async function sendN8nCommand(button, payload) {
    if (!isUrlValid(webhookUrl)) {
      showToast('Defina a URL do seu webhook no arquivo config.js ou no ícone ⚙️', 'error');
      settingsModal.showModal();
      return;
    }

    triggerHaptic();

    button.classList.add('loading');
    actionButtons.forEach(btn => btn.disabled = true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast('Comando enviado com sucesso!', 'success');
      } else {
        showToast(`n8n respondeu com erro (${response.status})`, 'error');
      }
    } catch (error) {
      console.error('Erro de conexão com o n8n:', error);
      showToast('Falha na comunicação com o n8n. Verifique sua conexão ou a URL.', 'error');
    } finally {
      button.classList.remove('loading');
      actionButtons.forEach(btn => btn.disabled = false);
    }
  }

  // Associa os cliques aos botões de ação
  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const device = button.getAttribute('data-device');
      const action = button.getAttribute('data-action');

      let payload = {};

      if (device) {
        payload = {
          dispositivo: device,
          action: action
        };
      } else {
        payload = {
          action: action
        };
      }

      sendN8nCommand(button, payload);
    });
  });
});
