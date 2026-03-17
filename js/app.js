const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modalButtons = document.querySelectorAll('.open-booking-modal');
const bookingModal = document.getElementById('booking-modal');
const bookingModalForm = document.getElementById('booking-modal-form');
const bookingModalService = document.getElementById('booking-modal-service');
const selectedService = document.getElementById('selected-service');
const selectedSummary = document.getElementById('selected-summary');
const modalMessage = document.getElementById('booking-modal-message');
const cardReadingModal = document.getElementById('card-reading-modal');
const cardReadingCards = document.querySelectorAll('.card-pick');
const cardReadingResult = document.getElementById('card-reading-result');
const cardReadingKicker = document.getElementById('card-reading-kicker');
const cardReadingText = document.getElementById('card-reading-text');
const cardReadingBookButton = document.getElementById('card-reading-book');
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialsDots = document.getElementById('testimonials-dots');
const testimonialSlides = Array.from(document.querySelectorAll('.testimonials-carousel__slide'));
const promoModal = document.getElementById('promo-modal');
const whatsappNumber = '5492215047962';
let lastModalTrigger = null;
let selectedCardService = 'Reserva de lectura';
let selectedCardSummary = 'Solicitud abierta desde el modal de cartas';
let activeTestimonialIndex = 0;

// IDs/names de los campos a persistir
const bookingFields = [
  { name: 'nombre', selector: 'input[name="nombre"]' },
  { name: 'apellido', selector: 'input[name="apellido"]' },
  { name: 'fechaNacimiento', selector: 'input[name="fechaNacimiento"]' },
  { name: 'horoscopo', selector: 'select[name="horoscopo"]' },
  { name: 'email', selector: 'input[name="email"]' },
  { name: 'notas', selector: 'textarea[name="notas"]' },
];

function getHoroscopeFromBirthDate(dateString) {
  if (!dateString) {
    return '';
  }

  const parts = dateString.split('-').map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return '';
  }

  const [, month, day] = parts;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Tauro';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Geminis';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitario';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricornio';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Acuario';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Piscis';

  return '';
}

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

    if (lastModalTrigger instanceof HTMLElement) {
      lastModalTrigger.focus();
    }
  }
}

function toggleCardReadingModal(forceOpen) {
  if (!cardReadingModal) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !cardReadingModal.classList.contains('is-open');
  cardReadingModal.classList.toggle('is-open', shouldOpen);
  cardReadingModal.setAttribute('aria-hidden', String(!shouldOpen));
}

function togglePromoModal(forceOpen) {
  if (!promoModal) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !promoModal.classList.contains('is-open');
  promoModal.classList.toggle('is-open', shouldOpen);
  promoModal.setAttribute('aria-hidden', String(!shouldOpen));
}

function openBookingFlow(service, summary, trigger) {
  lastModalTrigger = trigger instanceof HTMLElement ? trigger : lastModalTrigger;

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
}

modalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const service = button.getAttribute('data-service') || 'Consulta general';
    const summary = button.getAttribute('data-summary') || '';

    openBookingFlow(service, summary, button);
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

if (cardReadingModal) {
  cardReadingModal.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.closeCardsModal === 'true') {
      toggleCardReadingModal(false);
    }
  });
}

if (promoModal) {
  promoModal.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.closePromoModal === 'true') {
      togglePromoModal(false);
    }
  });
}

function renderTestimonialDots() {
  if (!testimonialsDots || testimonialSlides.length === 0) {
    return;
  }

  testimonialsDots.innerHTML = '';

  testimonialSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonials-carousel__dot';
    dot.setAttribute('aria-label', `Ver testimonio ${index + 1}`);

    if (index === activeTestimonialIndex) {
      dot.classList.add('is-active');
    }

    dot.addEventListener('click', () => {
      activeTestimonialIndex = index;
      updateTestimonialsCarousel();
    });

    testimonialsDots.appendChild(dot);
  });
}

function updateTestimonialsCarousel() {
  if (!testimonialsTrack || testimonialSlides.length === 0) {
    return;
  }

  testimonialsTrack.style.transform = `translateX(-${activeTestimonialIndex * 100}%)`;

  if (testimonialsDots) {
    Array.from(testimonialsDots.children).forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeTestimonialIndex);
    });
  }
}

if (testimonialsTrack && testimonialSlides.length > 0) {
  renderTestimonialDots();
  updateTestimonialsCarousel();

  window.setInterval(() => {
    activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialSlides.length;
    updateTestimonialsCarousel();
  }, 2000);
}

cardReadingCards.forEach((button) => {
  button.addEventListener('click', () => {
    cardReadingCards.forEach((cardButton) => cardButton.classList.remove('is-selected'));
    button.classList.add('is-selected');

    selectedCardService = button.getAttribute('data-service') || 'Reserva de lectura';
    selectedCardSummary = button.getAttribute('data-summary') || 'Solicitud abierta desde el modal de cartas';

    if (cardReadingKicker) {
      cardReadingKicker.textContent = button.getAttribute('data-title') || 'Carta elegida';
    }

    if (cardReadingText) {
      cardReadingText.textContent = button.getAttribute('data-reading') || '';
    }

    if (cardReadingResult) {
      cardReadingResult.hidden = false;
    }
  });
});

if (cardReadingBookButton) {
  cardReadingBookButton.addEventListener('click', () => {
    toggleCardReadingModal(false);
    openBookingFlow(selectedCardService, selectedCardSummary, cardReadingBookButton);
  });
}

if (bookingModalForm instanceof HTMLFormElement) {
  const birthDateField = bookingModalForm.querySelector('input[name="fechaNacimiento"]');
  const horoscopeField = bookingModalForm.querySelector('select[name="horoscopo"]');

  if (birthDateField instanceof HTMLInputElement && horoscopeField instanceof HTMLSelectElement) {
    birthDateField.addEventListener('change', () => {
      const detectedHoroscope = getHoroscopeFromBirthDate(birthDateField.value);

      if (detectedHoroscope) {
        horoscopeField.value = detectedHoroscope;
      }
    });
  }

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
    const horoscope = String(formData.get('horoscopo') || '');
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
      `Horoscopo: ${horoscope}`,
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

  if (event.key === 'Escape' && cardReadingModal?.classList.contains('is-open')) {
    toggleCardReadingModal(false);
  }

  if (event.key === 'Escape' && promoModal?.classList.contains('is-open')) {
    togglePromoModal(false);
  }
});

window.setTimeout(() => {
  const shouldSkipOpening = bookingModal?.classList.contains('is-open') || cardReadingModal?.classList.contains('is-open');

  if (!shouldSkipOpening && cardReadingModal && !window.sessionStorage.getItem('anima-card-reading-shown')) {
    toggleCardReadingModal(true);
    window.sessionStorage.setItem('anima-card-reading-shown', 'true');
  }
}, 5000);

window.setTimeout(() => {
  const shouldSkipPromo = bookingModal?.classList.contains('is-open') || cardReadingModal?.classList.contains('is-open') || promoModal?.classList.contains('is-open');

  if (!shouldSkipPromo && promoModal && !window.sessionStorage.getItem('anima-one-to-one-shown')) {
    togglePromoModal(true);
    window.sessionStorage.setItem('anima-one-to-one-shown', 'true');
  }
}, 15000);