const chatbotButton = document.querySelector('.floating-button--chat');
const chatbot = document.querySelector('.chatbot');
const chatbotClose = document.querySelector('.chatbot__close');
const chatMessages = document.getElementById('chat-messages');
const faqButtons = document.querySelectorAll('.chatbot__faq-chip');

const topicAnswers = {
  precios:
    'Hoy las lecturas disponibles son: Lectura general inicial por $6.000, Lectura general expandida por $8.000 y Lectura profunda completa por $10.000. Si no sabes cual elegir, la mejor decision es tomar la que se ajuste a la profundidad que hoy necesitas.',
  modalidad:
    'Las lecturas se trabajan de forma online y el contacto se coordina por WhatsApp para que el proceso sea claro, directo y comodo. Si necesitas resolver una duda puntual antes de reservar, puedes hacerlo desde el formulario o por mensaje.',
  incluye:
    'La lectura inicial incluye una mirada general y tres preguntas concretas. La expandida suma cuatro preguntas, mas desarrollo de un caso puntual y consejo final. La profunda completa abre una hora de lectura, hasta seis preguntas y una resolucion mas amplia del proceso.',
  amor:
    'En temas de amor, la lectura busca darte claridad sobre lo que sientes, lo que la otra persona moviliza en ti y que dinamica conviene mirar con mas honestidad. No se trabaja desde promesas absolutas, sino desde orientacion consciente y precisa.',
  parejas:
    'En parejas, la lectura ayuda a observar vinculo, comunicacion, desgaste, expectativas y posibilidades reales de orden. La idea no es decidir por ti, sino darte una mirada clara para que puedas posicionarte mejor.',
  guia:
    'Si sientes confusion o estas atravesando una etapa de cambio, una lectura de guia puede ayudarte a ordenar lo que hoy esta disperso. Suele ser una buena opcion cuando necesitas entender proceso, prioridad y proximo paso con mas claridad.',
  confidencialidad:
    'Lo que compartes en una lectura se sostiene con respeto, cuidado y discrecion. La idea es que puedas hablar con confianza, sin sentirte expuesta ni forzada a contar mas de lo que deseas.',
  trabajo:
    'En trabajo y decisiones, la lectura puede ayudarte a ver bloqueos, oportunidades, desgaste, tiempos y direccion posible. No reemplaza tu criterio personal, pero si puede darte mas claridad para decidir con menos ruido interno.',
  salud:
    'En temas de salud, la lectura puede acompanar desde lo emocional y simbolico, pero no reemplaza criterio medico, psicologico ni terapeutico. Si hay una preocupacion importante, lo responsable es apoyarte tambien en profesionales de salud.',
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

function getBotReply(topic) {
  return topicAnswers[topic] || 'Puedes elegir una consulta frecuente y te respondo con una orientacion breve antes de reservar.';
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
    appendMessage(question, 'user');

    window.setTimeout(() => {
      appendMessage(getBotReply(topic), 'bot');
    }, 260);
  });
});