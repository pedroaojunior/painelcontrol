/**
 * Painel de Controle de Automação Residencial (n8n Webhook)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Key storage for n8n Webhook URL
  const STORAGE_KEY_WEBHOOK = 'n8n_webhook_url';
  
  // Element References
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

  // Load saved Webhook URL or set initial default
  let webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK) || '';

  function updateStatusIndicator() {
    if (!webhookUrl) {
      statusBadge.className = 'status-badge unconfigured';
      statusText.textContent = 'Configurar Webhook';
    } else {
      statusBadge.className = 'status-badge connected';
      statusText.textContent = 'Pronto';
    }
  }

  // Initial status check
  updateStatusIndicator();

  // Show Modal Settings
  openSettingsBtn.addEventListener('click', () => {
    webhookUrlInput.value = webhookUrl;
    settingsModal.showModal();
  });

  // Close Modal
  function closeModal() {
    settingsModal.close();
  }

  closeSettingsBtn.addEventListener('click', closeModal);
  cancelSettingsBtn.addEventListener('click', closeModal);

  // Save Settings Form
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

  // Haptic Feedback for Mobile Devices
  function triggerHaptic() {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch (e) {
        // Ignore if restricted by policy
      }
    }
  }

  // Toast Notification System
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

  // Send Command to n8n Webhook
  async function sendN8nCommand(button, payload) {
    if (!webhookUrl) {
      showToast('Por favor, configure a URL do seu n8n no ícone de engrenagem.', 'error');
      settingsModal.showModal();
      return;
    }

    triggerHaptic();

    // Disable all action buttons to avoid concurrent spam
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

  // Bind click handlers to action buttons
  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const device = button.getAttribute('data-device');
      const action = button.getAttribute('data-action');

      let payload = {};

      if (device) {
        // Dispositivo: "portao" ou "quarto"
        payload = {
          dispositivo: device,
          action: action
        };
      } else {
        // Ações diretas do Ar: "ar_ligar" ou "ar_desligar"
        payload = {
          action: action
        };
      }

      sendN8nCommand(button, payload);
    });
  });
});
