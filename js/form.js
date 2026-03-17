const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nombre = formData.get('nombre');

    formMessage.textContent = `Gracias ${nombre}, tu consulta fue enviada con exito. Te responderemos pronto.`;
    formMessage.classList.add('is-success');
    contactForm.reset();

    window.setTimeout(() => {
      formMessage.textContent = '';
      formMessage.classList.remove('is-success');
    }, 4000);
  });
}