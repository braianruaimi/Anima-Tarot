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
      'Puedes mostrar productos destacados con imagen, descripcion y boton. La estructura actual ya permite presentar piezas principales con una narrativa mas premium.',
      'Si sigues hablando de productos, conviene separar estrella, colecciones y piezas personalizadas para que la decision sea mas rapida.',
      'Tambien puedes usar el boton de cada tarjeta para llevar a WhatsApp, catalogo o ficha detallada del producto.',
    ],
  },
  servicios: {
    keywords: ['servicio', 'servicios', 'sesion', 'sesiones', 'lectura', 'lecturas'],
    answers: [
      'La plantilla permite presentar servicios principales, beneficios y llamadas a la accion para reservar o consultar por WhatsApp.',
      'Si tu consulta sigue sobre servicios, una buena mejora es diferenciar lectura general, tiradas tematicas y acompanamiento breve.',
      'Tambien puedes sumar duracion, modalidad y valor orientativo dentro de cada bloque de servicio.',
    ],
  },
  pedidos: {
    keywords: ['pedido', 'pedidos', 'orden', 'ordenes', 'reserva', 'reservas', 'turno', 'turnos'],
    answers: [
      'El formulario sirve para recibir pedidos o consultas. Luego puedes conectarlo con email, backend o automatizaciones si quieres escalarlo.',
      'Si sigues preguntando por pedidos o reservas, la mejor experiencia es combinar formulario breve con cierre inmediato por WhatsApp.',
      'Tambien es viable guardar consultas en localStorage o conectar una agenda real cuando quieras pasar a una version operativa.',
    ],
  },
  precios: {
    keywords: ['precio', 'precios', 'valor', 'valores', 'costo', 'costos', 'tarifa', 'tarifas'],
    answers: [
      'Puedes indicar precios en las tarjetas o responder por WhatsApp si prefieres una venta mas personalizada.',
      'Si quieres mantener una estetica mas exclusiva, puedes mostrar valores desde y dejar los detalles finos para la conversacion directa.',
      'Otra opcion es destacar rangos, promociones o sesiones especiales sin saturar la interfaz principal.',
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

  return 'Puedo ayudarte con dudas sobre productos, servicios, pedidos o precios. Si tocas una pregunta frecuente o escribes sobre uno de esos temas, te respondo con mas contexto.';
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