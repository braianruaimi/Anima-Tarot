let deferredPrompt;

const installButton = document.querySelector('.install-button');

function showInstallHint() {
  if (!installButton) {
    return;
  }

  const originalText = installButton.textContent;
  installButton.textContent = 'Usa el menu del navegador para instalar';

  window.setTimeout(() => {
    installButton.textContent = originalText;
  }, 2800);
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      showInstallHint();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;

    if (outcome === 'accepted') {
      installButton.textContent = 'App instalada';
      return;
    }

    installButton.textContent = 'Instalar app';
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}