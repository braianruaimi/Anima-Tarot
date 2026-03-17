const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modalButtons = document.querySelectorAll('.open-booking-modal');
const bookingModal = document.getElementById('booking-modal');
const bookingModalForm = document.getElementById('booking-modal-form');
const bookingModalService = document.getElementById('booking-modal-service');
const selectedService = document.getElementById('selected-service');
const selectedSummary = document.getElementById('selected-summary');
const modalMessage = document.getElementById('booking-modal-message');
const whatsappNumber = '5492215047962';

// IDs/names de los campos a persistir
const bookingFields = [
  { name: 'nombre', selector: 'input[name="nombre"]' },
  { name: 'apellido', selector: 'input[name="apellido"]' },
  { name: 'fechaNacimiento', selector: 'input[name="fechaNacimiento"]' },
  { name: 'email', selector: 'input[name="email"]' },
  { name: 'notas', selector: 'textarea[name="notas"]' },
];

function saveBookingFieldsToLocalStorage() {
  bookingFields.forEach(({ name, selector }) => {
    const el = bookingModalForm?.querySelector(selector);
    if (el) {
      localStorage.setItem('booking_' + name, el.value);
    }
  });
}

function loadBookingFieldsFromLocalStorage() {
  bookingFields.forEach(({ name, selector }) => {
    const el = bookingModalForm?.querySelector(selector);
    if (el && localStorage.getItem('booking_' + name)) {
      el.value = localStorage.getItem('booking_' + name);
    }
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    });
  });
}

function toggleBookingModal(forceOpen) {
  if (!bookingModal) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !bookingModal.classList.contains('is-open');
  bookingModal.classList.toggle('is-open', shouldOpen);
  bookingModal.setAttribute('aria-hidden', String(!shouldOpen));

  if (shouldOpen && bookingModalForm instanceof HTMLFormElement) {
    // Al abrir, cargar datos guardados
    loadBookingFieldsFromLocalStorage();
  }

  if (!shouldOpen && bookingModalForm instanceof HTMLFormElement) {
    bookingModalForm.reset();
    if (modalMessage) {
      modalMessage.textContent = '';
    }
  }
}

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const service = button.getAttribute('data-service') || 'Consulta general';
    const summary = button.getAttribute('data-summary') || '';

    if (bookingModalService) {
      bookingModalService.textContent = `${service} · ${summary}`;
    }

    if (selectedService) {
      selectedService.value = service;
    }

    if (selectedSummary) {
      selectedSummary.value = summary;
    }

    toggleBookingModal(true);
  });
});

if (bookingModal) {
  bookingModal.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.closeModal === 'true') {
      toggleBookingModal(false);
    }
  });
}

if (bookingModalForm instanceof HTMLFormElement) {
  bookingModalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Guardar datos en localStorage
    saveBookingFieldsToLocalStorage();

    const formData = new FormData(bookingModalForm);
    const service = String(formData.get('servicio') || 'Consulta general');
    const summary = String(formData.get('resumen') || '');
    const name = String(formData.get('nombre') || '');
    const lastName = String(formData.get('apellido') || '');
    const birthDate = String(formData.get('fechaNacimiento') || '');
    const email = String(formData.get('email') || '');
    const notes = String(formData.get('notas') || '');

    const message = [
      'Hola, quiero solicitar una lectura en Anima Tarot.',
      '',
      `Servicio: ${service}`,
      summary ? `Detalle: ${summary}` : '',
      `Nombre: ${name}`,
      `Apellido: ${lastName}`,
      `Fecha de nacimiento: ${birthDate}`,
      `Email: ${email}`,
      notes ? `Notas: ${notes}` : 'Notas: Sin notas adicionales.',
    ]
      .filter(Boolean)
      .join('\n');

    if (modalMessage) {
      modalMessage.textContent = 'Abriendo WhatsApp con tu solicitud cargada...';
      modalMessage.classList.add('is-success');
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');

    window.setTimeout(() => {
      toggleBookingModal(false);
    }, 400);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && bookingModal?.classList.contains('is-open')) {
    toggleBookingModal(false);
  }
});