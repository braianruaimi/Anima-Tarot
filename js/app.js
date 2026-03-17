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
const cardReadingButton = document.getElementById('card-reading-button');
const cardReadingCards = document.querySelectorAll('.card-pick');
const cardReadingKicker = document.getElementById('card-reading-kicker');
const cardReadingArcana = document.getElementById('card-reading-arcana');
const cardReadingTitleLive = document.getElementById('card-reading-title-live');
const cardReadingText = document.getElementById('card-reading-text');
const cardReadingToggle = document.getElementById('card-reading-toggle');
const cardReadingReopenButton = document.getElementById('card-reading-reopen');
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialsDots = document.getElementById('testimonials-dots');
const testimonialSlides = Array.from(document.querySelectorAll('.testimonials-carousel__slide'));
const promoModal = document.getElementById('promo-modal');
const whatsappNumber = '5492215047962';
let lastModalTrigger = null;
let selectedCardService = 'Reserva de lectura';
let selectedCardSummary = 'Solicitud abierta desde el modal de cartas';
let activeTestimonialIndex = 0;
let riderShowcaseIndex = 0;
let riderShowcaseInterval = null;

const riderShowcaseCards = [
  {
    arcana: 'II',
    title: 'La Sacerdotisa',
    kicker: 'Rider especialmente trabajado',
    text: 'Intuición, silencio y lectura fina de lo que todavía no se dijo. Este mazo se trabaja desde la simbología Rider para detectar capas reales del proceso.',
  },
  {
    arcana: 'IX',
    title: 'El Ermitaño',
    kicker: 'Lectura profunda Rider',
    text: 'Tiempo de introspección, retiro consciente y verdad interior. Ideal cuando la consulta pide claridad madura y no una respuesta superficial.',
  },
  {
    arcana: 'XI',
    title: 'La Justicia',
    kicker: 'Precisión simbólica Rider',
    text: 'Equilibrio, decisiones y consecuencias. En Rider esta energía ayuda a ordenar vínculos, límites y elecciones con mucha nitidez.',
  },
  {
    arcana: 'XIX',
    title: 'El Sol',
    kicker: 'Apertura luminosa Rider',
    text: 'Claridad, verdad y expansión. Muestra cuando algo ya está listo para verse sin niebla y transformarse en acción concreta.',
  },
];

function resetCardReadingSelection() {
  cardReadingCards.forEach((cardButton) => cardButton.classList.remove('is-selected'));
}

function updateRiderShowcase({ arcana, title, kicker, text }) {
  if (cardReadingArcana) {
    cardReadingArcana.textContent = arcana;
  }

  if (cardReadingTitleLive) {
    cardReadingTitleLive.textContent = title;
  }

  if (cardReadingKicker) {
    cardReadingKicker.textContent = kicker;
  }

  if (cardReadingText) {
    cardReadingText.textContent = text;
  }
}

function startRiderShowcaseRotation() {
  if (riderShowcaseInterval) {
    window.clearInterval(riderShowcaseInterval);
  }

  riderShowcaseInterval = window.setInterval(() => {
    if (document.hidden || cardReadingModal?.classList.contains('is-open') === false) {
      return;
    }

    riderShowcaseIndex = (riderShowcaseIndex + 1) % riderShowcaseCards.length;
    updateRiderShowcase(riderShowcaseCards[riderShowcaseIndex]);
  }, 3600);
}

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

function setCardReadingDrawerState(state) {
  if (!cardReadingModal) {
    return;
  }

  const isOpen = state === 'open';
  const isHidden = state === 'hidden';

  cardReadingModal.classList.toggle('is-open', isOpen);
  cardReadingModal.setAttribute('aria-hidden', String(isHidden));

  if (cardReadingButton) {
    cardReadingButton.setAttribute('aria-expanded', String(isOpen));
  }

  if (cardReadingReopenButton) {
    cardReadingReopenButton.classList.toggle('is-visible', isHidden);
    cardReadingReopenButton.setAttribute('aria-hidden', String(!isHidden));
  }

  if (cardReadingToggle) {
    cardReadingToggle.setAttribute('aria-expanded', String(isOpen));
    const toggleCopy = cardReadingToggle.querySelector('.card-reading-modal__toggle-copy');

    if (toggleCopy) {
      toggleCopy.textContent = isOpen ? 'Minimizar' : 'Abrir';
    }
  }

  if (!isOpen) {
    resetCardReadingSelection();
  }

  if (isOpen) {
    updateRiderShowcase(riderShowcaseCards[riderShowcaseIndex]);
  } else if (riderShowcaseCards.length > 0) {
    riderShowcaseIndex = 0;
    updateRiderShowcase(riderShowcaseCards[riderShowcaseIndex]);
  }
}

function setupRevealAnimations() {
  const revealTargets = Array.from(
    document.querySelectorAll(
      '.hero__text, .hero__card, .section-heading, .section-heading--split, .about__intro, .benefit-card, .service-card, .booking-form--info, .booking-info, .testimonials-carousel, .cta-final__panel',
    ),
  );

  if (revealTargets.length === 0) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -12% 0px',
    },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
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
      setCardReadingDrawerState('hidden');
    }
  });
}

if (cardReadingToggle) {
  cardReadingToggle.addEventListener('click', () => {
    const nextState = cardReadingModal?.classList.contains('is-open') ? 'hidden' : 'open';
    setCardReadingDrawerState(nextState);
  });
}

if (cardReadingButton) {
  cardReadingButton.addEventListener('click', () => {
    const nextState = cardReadingModal?.classList.contains('is-open') ? 'hidden' : 'open';
    setCardReadingDrawerState(nextState);
  });
}

if (cardReadingReopenButton) {
  cardReadingReopenButton.addEventListener('click', () => {
    setCardReadingDrawerState('hidden');
    openBookingFlow('Reserva de lectura', 'Solicitud directa desde la carta flotante de reserva', cardReadingReopenButton);
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
    if (document.hidden) {
      return;
    }

    activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialSlides.length;
    updateTestimonialsCarousel();
  }, 3500);
}

cardReadingCards.forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = event.target;
    const clickedReserve = target instanceof HTMLElement && target.closest('.card-pick__reserve');

    if (button.classList.contains('is-selected')) {
      if (clickedReserve) {
        setCardReadingDrawerState('hidden');
        openBookingFlow(selectedCardService, selectedCardSummary, button);
      }

      return;
    }

    setCardReadingDrawerState('open');
    cardReadingCards.forEach((cardButton) => cardButton.classList.remove('is-selected'));
    button.classList.add('is-selected');

    selectedCardService = button.getAttribute('data-service') || 'Reserva de lectura';
    selectedCardSummary = button.getAttribute('data-summary') || 'Solicitud abierta desde el modal de cartas';

    updateRiderShowcase({
      arcana: button.querySelector('.card-pick__mark')?.textContent || 'Rider',
      title: button.getAttribute('data-title') || 'Carta elegida',
      kicker: 'Carta Rider seleccionada',
      text: button.getAttribute('data-reading') || '',
    });
  });
});

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
      'Hola, quiero solicitar una lectura en Ánima Tarot.',
      '',
      `Servicio: ${service}`,
      summary ? `Detalle: ${summary}` : '',
      `Nombre: ${name}`,
      `Apellido: ${lastName}`,
      `Fecha de nacimiento: ${birthDate}`,
      `Horóscopo: ${horoscope}`,
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
    setCardReadingDrawerState('hidden');
  }

  if (event.key === 'Escape' && promoModal?.classList.contains('is-open')) {
    togglePromoModal(false);
  }
});

document.addEventListener('click', (event) => {
  if (!cardReadingModal?.classList.contains('is-open')) {
    return;
  }

  const target = event.target;

  if (target instanceof Node && !cardReadingModal.contains(target) && !cardReadingButton?.contains(target)) {
    setCardReadingDrawerState('hidden');
  }
});

window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
  setupRevealAnimations();
  updateRiderShowcase(riderShowcaseCards[0]);
  startRiderShowcaseRotation();
});

setCardReadingDrawerState('hidden');

window.setTimeout(() => {
  const shouldSkipPromo = bookingModal?.classList.contains('is-open') || cardReadingModal?.classList.contains('is-open') || promoModal?.classList.contains('is-open');

  if (!shouldSkipPromo && promoModal && !window.sessionStorage.getItem('anima-one-to-one-shown')) {
    togglePromoModal(true);
    window.sessionStorage.setItem('anima-one-to-one-shown', 'true');
  }
}, 22000);