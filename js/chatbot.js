const chatbotButton = document.querySelector('.floating-button--chat');
const chatbot = document.querySelector('.chatbot');
const chatbotClose = chatbot?.querySelector('.chatbot__close') || null;
const chatMessages = chatbot?.querySelector('#chat-messages') || null;
const faqButtons = chatbot?.querySelectorAll('.chatbot__faq-chip') || [];
const initialBotMessage = chatMessages?.querySelector('.chatbot__message--bot')?.textContent || '';

const topicAnswers = {
  precios:
    'Hoy las lecturas disponibles son: Lectura general inicial por $6.000, Lectura general expandida por $8.000 y Lectura profunda completa por $10.000. Si no sabes cuál elegir, la mejor decisión es tomar la que se ajuste a la profundidad que hoy necesitas.',
  modalidad:
    'Las lecturas se trabajan de forma online y el contacto se coordina por WhatsApp para que el proceso sea claro, directo y cómodo. Si necesitas resolver una duda puntual antes de reservar, puedes hacerlo desde el formulario o por mensaje.',
  incluye:
    'La lectura inicial incluye una mirada general y tres preguntas concretas. La expandida suma cuatro preguntas, más desarrollo de un caso puntual y consejo final. La profunda completa abre una hora de lectura, hasta seis preguntas y una resolución más amplia del proceso.',
  amor:
    'En temas de amor, la lectura busca darte claridad sobre lo que sientes, lo que la otra persona moviliza en ti y qué dinámica conviene mirar con más honestidad. No se trabaja desde promesas absolutas, sino desde orientación consciente y precisa.',
  parejas:
    'En parejas, la lectura ayuda a observar vínculo, comunicación, desgaste, expectativas y posibilidades reales de orden. La idea no es decidir por ti, sino darte una mirada clara para que puedas posicionarte mejor.',
  guia:
    'Si sientes confusión o estás atravesando una etapa de cambio, una lectura de guía puede ayudarte a ordenar lo que hoy está disperso. Suele ser una buena opción cuando necesitas entender proceso, prioridad y próximo paso con más claridad.',
  confidencialidad:
    'Lo que compartes en una lectura se sostiene con respeto, cuidado y discreción. La idea es que puedas hablar con confianza, sin sentirte expuesta ni forzada a contar más de lo que deseas.',
  trabajo:
    'En trabajo y decisiones, la lectura puede ayudarte a ver bloqueos, oportunidades, desgaste, tiempos y dirección posible. No reemplaza tu criterio personal, pero sí puede darte más claridad para decidir con menos ruido interno.',
  salud:
    'En temas de salud, la lectura puede acompañar desde lo emocional y simbólico, pero no reemplaza criterio médico, psicológico ni terapéutico. Si hay una preocupación importante, lo responsable es apoyarte también en profesionales de salud.',
};

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

function resetChatMessages() {
  if (!chatMessages) {
    return;
  }

  chatMessages.innerHTML = '';

  if (initialBotMessage) {
    appendMessage(initialBotMessage, 'bot');
  }
}

function getBotReply(topic) {
  return topicAnswers[topic] || 'Puedes elegir una consulta frecuente y te respondo con una orientación breve antes de reservar.';
}

function toggleChatbot(forceOpen) {
  if (!chatbot) {
    return;
  }

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !chatbot.classList.contains('is-open');
  chatbot.classList.toggle('is-open', shouldOpen);
  chatbot.setAttribute('aria-hidden', String(!shouldOpen));
}

if (chatbotButton) {
  chatbotButton.addEventListener('click', () => toggleChatbot());
}

if (chatbotClose) {
  chatbotClose.addEventListener('click', () => toggleChatbot(false));
}

faqButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.question;
    const topic = button.dataset.topic;

    if (!question || !topic) {
      return;
    }

    toggleChatbot(true);
    resetChatMessages();
    appendMessage(question, 'user');

    window.setTimeout(() => {
      appendMessage(getBotReply(topic), 'bot');
    }, 260);
  });
});