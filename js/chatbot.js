const chatbotButton = document.querySelector('.floating-button--chat');
const chatbot = document.querySelector('.chatbot');
const chatbotClose = document.querySelector('.chatbot__close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const faqButtons = document.querySelectorAll('.chatbot__faq-chip');

const memoryKey = 'anima-chatbot-memory';

const topicKnowledge = {
  productos: {
    keywords: ['producto', 'productos', 'tienda', 'articulo', 'articulos'],
    answers: [
      'Si ofreces productos rituales, velas, cursos o sesiones complementarias, pueden mostrarse con imagen, beneficio principal y un llamado claro a escribirte.',
      'Cuando el usuario entiende rapido que recibe y por que le conviene, la decision de contacto ocurre con mucha mas naturalidad.',
      'Tambien puedes llevar cada tarjeta a WhatsApp o a una ficha detallada para convertir interes en conversacion real.',
    ],
  },
  servicios: {
    keywords: ['servicio', 'servicios', 'sesion', 'sesiones', 'lectura', 'lecturas'],
    answers: [
      'Puedes presentar lecturas generales, tiradas especificas y acompanamiento por WhatsApp con un tono claro, sensible y profesional.',
      'Si quieres vender mejor tus servicios, conviene mostrar para quien es cada lectura, que tipo de claridad aporta y como reservarla.',
      'Tambien puedes sumar duracion, modalidad y valor orientativo para reducir dudas antes del contacto.',
    ],
  },
  pedidos: {
    keywords: ['pedido', 'pedidos', 'orden', 'ordenes', 'reserva', 'reservas', 'turno', 'turnos'],
    answers: [
      'La reserva esta pensada para que escribirte sea simple: pocos pasos, mensaje claro y posibilidad de seguir por WhatsApp.',
      'Si la persona ya esta decidida, lo mejor es darle salida inmediata con un boton de contacto visible y un formulario breve como respaldo.',
      'Cuando quieras escalarlo, esta base puede conectarse con agenda, email o automatizaciones sin cambiar la experiencia visual.',
    ],
  },
  precios: {
    keywords: ['precio', 'precios', 'valor', 'valores', 'costo', 'costos', 'tarifa', 'tarifas'],
    answers: [
      'Puedes mostrar valores orientativos o responder por WhatsApp si prefieres una atencion mas personalizada y cercana.',
      'Si quieres cuidar una percepcion premium, funciona muy bien mostrar precios desde y ampliar detalles en la conversacion.',
      'Otra opcion es destacar promociones, sesiones especiales o combos sin recargar la pagina principal.',
    ],
  },
};

const followUpKeywords = [
  'y',
  'tambien',
  'ademas',
  'mas',
  'mas info',
  'contame mas',
  'como',
  'cuanto',
  'cuantos',
  'detalle',
  'detalles',
  'incluye',
  'incluyen',
];

function getMemory() {
  try {
    const savedMemory = window.localStorage.getItem(memoryKey);
    return savedMemory ? JSON.parse(savedMemory) : { lastTopic: null, topicCounts: {} };
  } catch {
    return { lastTopic: null, topicCounts: {} };
  }
}

function setMemory(memory) {
  window.localStorage.setItem(memoryKey, JSON.stringify(memory));
}

const botAnswers = [
  {
    keywords: ['producto', 'productos'],
    answer: 'Puedes mostrar productos destacados con imagen, descripcion y boton. Solo tienes que editar las tarjetas de la seccion de servicios.',
  },
  {
    keywords: ['servicio', 'servicios'],
    answer: 'La plantilla permite presentar servicios principales, beneficios y llamadas a la accion para reservar o consultar por WhatsApp.',
  },
  {
    keywords: ['pedido', 'pedidos', 'orden', 'ordenes'],
    answer: 'El formulario sirve para recibir pedidos o consultas. Luego puedes conectarlo con email, backend o automatizaciones si quieres escalarlo.',
  },
  {
    keywords: ['precio', 'precios', 'valor', 'costos'],
    answer: 'Puedes indicar precios en las tarjetas o responder por WhatsApp si prefieres una venta mas personalizada.',
  },
];

function appendMessage(content, type) {
  if (!chatMessages) {
    return;
  }

  const message = document.createElement('div');
  message.className = `chatbot__message chatbot__message--${type}`;
  message.textContent = content;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function detectTopic(text) {
  const normalizedText = text.toLowerCase();

  return Object.entries(topicKnowledge).find(([, topic]) =>
    topic.keywords.some((keyword) => normalizedText.includes(keyword)),
  )?.[0] ?? null;
}

function isFollowUpQuestion(text) {
  const normalizedText = text.toLowerCase().trim();

  if (normalizedText.split(' ').length <= 3) {
    return true;
  }

  return followUpKeywords.some((keyword) => normalizedText.includes(keyword));
}

function getBotReply(text) {
  const normalizedText = text.toLowerCase();
  const memory = getMemory();
  const detectedTopic = detectTopic(normalizedText);
  const activeTopic = detectedTopic || (isFollowUpQuestion(normalizedText) ? memory.lastTopic : null);

  if (activeTopic) {
    const topicCounts = memory.topicCounts || {};
    const nextCount = (topicCounts[activeTopic] || 0) + 1;
    const topicData = topicKnowledge[activeTopic];
    const answerIndex = Math.min(nextCount - 1, topicData.answers.length - 1);

    setMemory({
      lastTopic: activeTopic,
      topicCounts: {
        ...topicCounts,
        [activeTopic]: nextCount,
      },
    });

    if (!detectedTopic && memory.lastTopic) {
      return `Seguimos sobre ${activeTopic}. ${topicData.answers[answerIndex]}`;
    }

    return topicData.answers[answerIndex];
  }

  setMemory({
    ...memory,
    lastTopic: null,
  });

  return 'Puedo ayudarte con servicios, reservas, precios y dudas frecuentes. Si eliges un tema o me haces una pregunta directa, te respondo con mas contexto.';
}

function toggleChatbot(forceOpen) {
  if (!chatbot) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !chatbot.classList.contains('is-open');
  chatbot.classList.toggle('is-open', shouldOpen);
  chatbot.setAttribute('aria-hidden', String(!shouldOpen));

  if (shouldOpen && chatInput) {
    chatInput.focus();
  }
}

if (chatbotButton) {
  chatbotButton.addEventListener('click', () => toggleChatbot());
}

if (chatbotClose) {
  chatbotClose.addEventListener('click', () => toggleChatbot(false));
}

if (chatForm && chatInput) {
  const submitQuestion = (question) => {
    appendMessage(question, 'user');
    chatInput.value = '';

    window.setTimeout(() => {
      appendMessage(getBotReply(question), 'bot');
    }, 350);
  };

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const question = chatInput.value.trim();

    if (!question) {
      return;
    }

    submitQuestion(question);
  });

  faqButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const question = button.dataset.question;

      if (!question) {
        return;
      }

      toggleChatbot(true);
      submitQuestion(question);
    });
  });
}