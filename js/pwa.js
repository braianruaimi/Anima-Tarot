let deferredPrompt;
let waitingWorker;
let isRefreshing = false;

const installButton = document.querySelector('.install-button');
const installBanner = document.getElementById('install-banner');

function showInstallBanner() {
  if (!installBanner) {
    return;
  }

  installBanner.classList.remove('is-hidden');
}

function hideInstallBanner() {
  if (!installBanner) {
    return;
  }

  installBanner.classList.add('is-hidden');
}

function showInstallHint() {
  if (!installButton) {
    return;
  }

  showInstallBanner();

  const originalText = installButton.textContent;
  installButton.textContent = 'Usa el menu del navegador para instalar';

  window.setTimeout(() => {
    installButton.textContent = originalText;
    hideInstallBanner();
  }, 2800);
}

function showUpdateButton(registration) {
  if (!installButton) {
    return;
  }

  waitingWorker = registration.waiting || null;

  if (!waitingWorker) {
    return;
  }

  installButton.textContent = 'Actualiza app';
  installButton.dataset.mode = 'update';
  showInstallBanner();
}

function watchForWaitingWorker(registration) {
  if (registration.waiting) {
    showUpdateButton(registration);
    return;
  }

  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;

    if (!newWorker) {
      return;
    }

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        showUpdateButton(registration);
      }
    });
  });
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installButton?.dataset.mode !== 'update') {
    installButton.textContent = 'Instalar app';
    installButton.dataset.mode = 'install';
    showInstallBanner();
  }
});

if (installButton) {
  installButton.addEventListener('click', async () => {
    if (installButton.dataset.mode === 'update' && waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      installButton.textContent = 'Actualizando app...';
      return;
    }

    if (!deferredPrompt) {
      showInstallHint();
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;

    if (outcome === 'accepted') {
      installButton.textContent = 'App instalada';
      window.setTimeout(() => {
        hideInstallBanner();
      }, 1200);
      return;
    }

    installButton.textContent = 'Instalar app';
    hideInstallBanner();
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      watchForWaitingWorker(registration);

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (isRefreshing) {
          return;
        }

        isRefreshing = true;
        window.location.reload();
      });
    });
  });
}