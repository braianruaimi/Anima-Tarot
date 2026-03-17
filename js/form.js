const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Ahora las solicitudes se envian desde el modal de reserva de cada servicio o desde el boton para recibir orientacion.';
    formMessage.classList.add('is-success');
  });
}