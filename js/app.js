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
const chatbotPanel = document.querySelector('.chatbot');
const ceoAccessButton = document.getElementById('ceo-access-button');
const ceoPanel = document.getElementById('ceo-panel');
const ceoLoginForm = document.getElementById('ceo-login-form');
const ceoPasswordInput = document.getElementById('ceo-password');
const ceoLoginMessage = document.getElementById('ceo-login-message');
const ceoDashboard = document.getElementById('ceo-dashboard');
const ceoChannelList = document.getElementById('ceo-channel-list');
const ceoServiceList = document.getElementById('ceo-service-list');
const ceoDailyList = document.getElementById('ceo-daily-list');
const whatsappNumber = '5492215047962';
const ceoMetricsStorageKey = 'anima_ceo_metrics_v1';
const ceoSessionUnlockKey = 'anima_ceo_unlocked';
const ceoViewSessionKey = 'anima_ceo_view_recorded';
const ceoPassword = '1234';
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

function createEmptyMetricsDay() {
  return {
    views: 0,
    instagramClicks: 0,
    whatsappClicks: 0,
    bookingOpens: 0,
    formSubmissions: 0,
    serviceBreakdown: {},
  };
}

function createEmptyMetricsStore() {
  return {
    totals: {
      views: 0,
      instagramClicks: 0,
      whatsappClicks: 0,
      bookingOpens: 0,
      formSubmissions: 0,
      serviceBreakdown: {},
    },
    daily: {},
  };
}

function normalizeServiceBreakdown(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((accumulator, [service, count]) => {
    const normalizedCount = Number(count) || 0;

    if (normalizedCount > 0) {
      accumulator[service] = normalizedCount;
    }

    return accumulator;
  }, {});
}

function normalizeMetricsStore(rawValue) {
  const metrics = createEmptyMetricsStore();

  if (!rawValue || typeof rawValue !== 'object') {
    return metrics;
  }

  const rawTotals = rawValue.totals || {};
  metrics.totals.views = Number(rawTotals.views) || 0;
  metrics.totals.instagramClicks = Number(rawTotals.instagramClicks) || 0;
  metrics.totals.whatsappClicks = Number(rawTotals.whatsappClicks) || 0;
  metrics.totals.bookingOpens = Number(rawTotals.bookingOpens) || 0;
  metrics.totals.formSubmissions = Number(rawTotals.formSubmissions) || 0;
  metrics.totals.serviceBreakdown = normalizeServiceBreakdown(rawTotals.serviceBreakdown);

  const rawDaily = rawValue.daily || {};
  Object.entries(rawDaily).forEach(([dateKey, dayValue]) => {
    const day = createEmptyMetricsDay();

    if (dayValue && typeof dayValue === 'object') {
      day.views = Number(dayValue.views) || 0;
      day.instagramClicks = Number(dayValue.instagramClicks) || 0;
      day.whatsappClicks = Number(dayValue.whatsappClicks) || 0;
      day.bookingOpens = Number(dayValue.bookingOpens) || 0;
      day.formSubmissions = Number(dayValue.formSubmissions) || 0;
      day.serviceBreakdown = normalizeServiceBreakdown(dayValue.serviceBreakdown);
    }

    metrics.daily[dateKey] = day;
  });

  return metrics;
}

function readMetricsStore() {
  try {
    const rawValue = window.localStorage.getItem(ceoMetricsStorageKey);

    if (!rawValue) {
      return createEmptyMetricsStore();
    }

    return normalizeMetricsStore(JSON.parse(rawValue));
  } catch {
    return createEmptyMetricsStore();
  }
}

function writeMetricsStore(metrics) {
  window.localStorage.setItem(ceoMetricsStorageKey, JSON.stringify(metrics));
}

function pushDataLayerEvent(eventName, payload = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });
}

window.pushDataLayerEvent = pushDataLayerEvent;

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getRelativeDateKey(daysAgo) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return getDateKey(date);
}

function getMetricsDay(metrics, dateKey) {
  if (!metrics.daily[dateKey]) {
    metrics.daily[dateKey] = createEmptyMetricsDay();
  }

  return metrics.daily[dateKey];
}

function updateMetricsStore(mutator) {
  const metrics = readMetricsStore();
  mutator(metrics);
  writeMetricsStore(metrics);
  renderCeoDashboard(metrics);
}

function incrementMetric(metricName) {
  updateMetricsStore((metrics) => {
    const todayKey = getRelativeDateKey(0);
    const today = getMetricsDay(metrics, todayKey);

    metrics.totals[metricName] = (Number(metrics.totals[metricName]) || 0) + 1;
    today[metricName] = (Number(today[metricName]) || 0) + 1;
  });
}

function recordFormSubmission(service) {
  updateMetricsStore((metrics) => {
    const todayKey = getRelativeDateKey(0);
    const today = getMetricsDay(metrics, todayKey);
    const serviceName = service || 'Consulta general';

    metrics.totals.formSubmissions += 1;
    today.formSubmissions += 1;
    metrics.totals.serviceBreakdown[serviceName] = (metrics.totals.serviceBreakdown[serviceName] || 0) + 1;
    today.serviceBreakdown[serviceName] = (today.serviceBreakdown[serviceName] || 0) + 1;
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat('es-AR').format(Number(value) || 0);
}

function formatPercent(value) {
  const normalizedValue = Number.isFinite(value) ? value : 0;
  return `${normalizedValue.toFixed(Math.abs(normalizedValue) >= 10 ? 0 : 1)}%`;
}

function formatGrowth(value) {
  const normalizedValue = Number.isFinite(value) ? value : 0;
  const prefix = normalizedValue > 0 ? '+' : '';
  return `${prefix}${formatPercent(normalizedValue)}`;
}

function calculateRate(base, total) {
  if (!base || !total) {
    return 0;
  }

  return (base / total) * 100;
}

function calculateGrowth(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function getPeriodTotals(metrics, startDaysAgo, endDaysAgo) {
  const totals = createEmptyMetricsDay();

  for (let dayIndex = startDaysAgo; dayIndex >= endDaysAgo; dayIndex -= 1) {
    const day = metrics.daily[getRelativeDateKey(dayIndex)] || createEmptyMetricsDay();
    totals.views += day.views;
    totals.instagramClicks += day.instagramClicks;
    totals.whatsappClicks += day.whatsappClicks;
    totals.bookingOpens += day.bookingOpens;
    totals.formSubmissions += day.formSubmissions;
  }

  return totals;
}

function renderChannelList(metrics, totalViews) {
  if (!ceoChannelList) {
    return;
  }

  const channels = [
    {
      label: 'Instagram',
      total: metrics.totals.instagramClicks,
      detail: `${formatPercent(calculateRate(metrics.totals.instagramClicks, totalViews))} de las views`,
    },
    {
      label: 'WhatsApp',
      total: metrics.totals.whatsappClicks,
      detail: `${formatPercent(calculateRate(metrics.totals.whatsappClicks, totalViews))} de las views`,
    },
    {
      label: 'Aperturas de formulario',
      total: metrics.totals.bookingOpens,
      detail: `${formatPercent(calculateRate(metrics.totals.bookingOpens, totalViews))} de las views`,
    },
    {
      label: 'Formularios enviados',
      total: metrics.totals.formSubmissions,
      detail: `${formatPercent(calculateRate(metrics.totals.formSubmissions, totalViews))} de las views`,
    },
  ];

  ceoChannelList.innerHTML = channels
    .map(
      (channel) => `
        <article class="ceo-channel-row">
          <div>
            <span>${channel.label}</span>
            <small>${channel.detail}</small>
          </div>
          <strong>${formatNumber(channel.total)}</strong>
        </article>
      `,
    )
    .join('');
}

function renderServiceList(metrics) {
  if (!ceoServiceList) {
    return;
  }

  const services = Object.entries(metrics.totals.serviceBreakdown)
    .sort((leftService, rightService) => rightService[1] - leftService[1])
    .slice(0, 6);

  if (services.length === 0) {
    ceoServiceList.innerHTML = '<article class="ceo-service-row"><div><span>Sin formularios enviados todavía</span><small>Las solicitudes enviadas aparecerán aquí.</small></div><strong>0</strong></article>';
    return;
  }

  const maxCount = services[0][1] || 1;

  ceoServiceList.innerHTML = services
    .map(
      ([service, count]) => `
        <article class="ceo-service-row">
          <div>
            <span>${service}</span>
            <small>${formatPercent((count / maxCount) * 100)} del servicio líder</small>
          </div>
          <strong>${formatNumber(count)}</strong>
        </article>
      `,
    )
    .join('');
}

function renderDailyList(metrics) {
  if (!ceoDailyList) {
    return;
  }

  const days = Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const dateKey = getRelativeDateKey(daysAgo);
    const [, month, day] = dateKey.split('-');
    const dayMetrics = metrics.daily[dateKey] || createEmptyMetricsDay();

    return {
      label: `${day}/${month}`,
      views: dayMetrics.views,
      forms: dayMetrics.formSubmissions,
    };
  });

  const maxViews = Math.max(...days.map((day) => day.views), 1);

  ceoDailyList.innerHTML = days
    .map(
      (day) => `
        <article class="ceo-daily-row">
          <span>${day.label}</span>
          <div class="ceo-daily-row__bar" aria-hidden="true"><span style="width: ${(day.views / maxViews) * 100}%"></span></div>
          <strong>${formatNumber(day.views)} views</strong>
          <small>Formularios: ${formatNumber(day.forms)}</small>
        </article>
      `,
    )
    .join('');
}

function setMetricText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function renderCeoDashboard(existingMetrics) {
  if (!ceoDashboard) {
    return;
  }

  const metrics = existingMetrics || readMetricsStore();
  const totalViews = metrics.totals.views;
  const totalTrackedClicks = metrics.totals.instagramClicks + metrics.totals.whatsappClicks + metrics.totals.bookingOpens;
  const currentWeek = getPeriodTotals(metrics, 6, 0);
  const previousWeek = getPeriodTotals(metrics, 13, 7);

  setMetricText('ceo-views-total', formatNumber(totalViews));
  setMetricText('ceo-clicks-total', formatNumber(totalTrackedClicks));
  setMetricText('ceo-forms-total', formatNumber(metrics.totals.formSubmissions));
  setMetricText('ceo-growth-views', formatGrowth(calculateGrowth(currentWeek.views, previousWeek.views)));

  setMetricText('ceo-click-rate', formatPercent(calculateRate(totalTrackedClicks, totalViews)));
  setMetricText('ceo-form-view-rate', formatPercent(calculateRate(metrics.totals.formSubmissions, totalViews)));
  setMetricText('ceo-form-open-rate', formatPercent(calculateRate(metrics.totals.formSubmissions, metrics.totals.bookingOpens)));

  setMetricText('ceo-growth-whatsapp', formatGrowth(calculateGrowth(currentWeek.whatsappClicks, previousWeek.whatsappClicks)));
  setMetricText('ceo-growth-forms', formatGrowth(calculateGrowth(currentWeek.formSubmissions, previousWeek.formSubmissions)));
  setMetricText('ceo-growth-bookings', formatGrowth(calculateGrowth(currentWeek.bookingOpens, previousWeek.bookingOpens)));

  renderChannelList(metrics, totalViews);
  renderServiceList(metrics);
  renderDailyList(metrics);
}

function setCeoPanelUnlocked(isUnlocked, message) {
  if (ceoLoginForm) {
    ceoLoginForm.hidden = isUnlocked;
  }

  if (ceoDashboard) {
    ceoDashboard.hidden = !isUnlocked;
  }

  if (ceoLoginMessage) {
    ceoLoginMessage.textContent = message || '';
    ceoLoginMessage.classList.toggle('is-success', Boolean(isUnlocked));
  }

  if (isUnlocked) {
    renderCeoDashboard();
  }
}

function toggleCeoPanel(forceOpen) {
  if (!ceoPanel) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !ceoPanel.classList.contains('is-open');
  ceoPanel.classList.toggle('is-open', shouldOpen);
  ceoPanel.setAttribute('aria-hidden', String(!shouldOpen));

  if (!shouldOpen) {
    return;
  }

  pushDataLayerEvent('ceo_panel_open');

  const isUnlocked = window.sessionStorage.getItem(ceoSessionUnlockKey) === 'true';
  setCeoPanelUnlocked(isUnlocked, isUnlocked ? 'Panel desbloqueado para esta sesión.' : '');

  if (isUnlocked) {
    return;
  }

  if (ceoPasswordInput) {
    ceoPasswordInput.value = '';
    ceoPasswordInput.focus();
  }
}

function recordPageView() {
  if (window.sessionStorage.getItem(ceoViewSessionKey) === 'true') {
    return;
  }

  window.sessionStorage.setItem(ceoViewSessionKey, 'true');
  incrementMetric('views');
  pushDataLayerEvent('anima_page_view', {
    page_type: 'landing',
    page_title: document.title,
  });
}

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

  incrementMetric('bookingOpens');
  pushDataLayerEvent('booking_open', {
    service,
    summary,
    trigger_label: trigger instanceof HTMLElement ? trigger.textContent?.trim() || '' : '',
  });

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

if (ceoAccessButton) {
  ceoAccessButton.addEventListener('click', () => {
    toggleCeoPanel(true);
  });
}

if (ceoPanel) {
  ceoPanel.addEventListener('click', (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.closeCeoPanel === 'true') {
      toggleCeoPanel(false);
    }
  });
}

if (ceoLoginForm instanceof HTMLFormElement) {
  ceoLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredPassword = ceoPasswordInput instanceof HTMLInputElement ? ceoPasswordInput.value.trim() : '';

    if (enteredPassword !== ceoPassword) {
      pushDataLayerEvent('ceo_login_failed');
      setCeoPanelUnlocked(false, 'Contraseña incorrecta.');
      return;
    }

    window.sessionStorage.setItem(ceoSessionUnlockKey, 'true');
    pushDataLayerEvent('ceo_login_success');
    setCeoPanelUnlocked(true, 'Acceso concedido.');
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
    const cardTitle = button.getAttribute('data-title') || 'Carta elegida';
    const cardService = button.getAttribute('data-service') || 'Reserva de lectura';

    if (button.classList.contains('is-selected')) {
      if (clickedReserve) {
        pushDataLayerEvent('intuitive_card_click', {
          card_title: cardTitle,
          service: cardService,
          action: 'reserve',
        });
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

    pushDataLayerEvent('intuitive_card_click', {
      card_title: cardTitle,
      service: cardService,
      action: 'select',
    });

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

    recordFormSubmission(service);
    pushDataLayerEvent('booking_form_submit', {
      service,
      summary,
      horoscope,
      has_notes: notes.trim().length > 0,
      contact_method: 'whatsapp',
    });

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

  if (event.key === 'Escape' && ceoPanel?.classList.contains('is-open')) {
    toggleCeoPanel(false);
  }
});

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const anchor = target.closest('a');

  if (!(anchor instanceof HTMLAnchorElement)) {
    return;
  }

  const href = anchor.getAttribute('href') || '';
  const linkText = anchor.textContent?.trim() || '';

  if (href.includes('instagram.com')) {
    incrementMetric('instagramClicks');
    pushDataLayerEvent('instagram_click', {
      link_text: linkText,
      link_url: href,
      link_location: anchor.closest('.footer') ? 'footer' : 'page',
    });
  }

  if (href.includes('wa.me')) {
    incrementMetric('whatsappClicks');
    pushDataLayerEvent('whatsapp_click', {
      link_text: linkText,
      link_url: href,
      link_location:
        anchor.classList.contains('floating-button--whatsapp')
        ? 'floating_button'
        : anchor.closest('.footer')
          ? 'footer'
          : anchor.closest('.cta-final')
            ? 'cta_final'
            : 'page',
    });
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
  recordPageView();
  document.body.classList.add('is-ready');
  setupRevealAnimations();
  updateRiderShowcase(riderShowcaseCards[0]);
  startRiderShowcaseRotation();
  renderCeoDashboard();
});

setCardReadingDrawerState('hidden');

window.setTimeout(() => {
  const shouldSkipPromo =
    bookingModal?.classList.contains('is-open') ||
    cardReadingModal?.classList.contains('is-open') ||
    promoModal?.classList.contains('is-open') ||
    chatbotPanel?.classList.contains('is-open');

  if (!shouldSkipPromo && promoModal && !window.sessionStorage.getItem('anima-one-to-one-shown')) {
    togglePromoModal(true);
    window.sessionStorage.setItem('anima-one-to-one-shown', 'true');
  }
}, 22000);