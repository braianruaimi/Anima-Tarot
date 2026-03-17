# Anima Tarot

Sitio web estatico, responsive e instalable, pensado para una marca de tarot profesional con foco en conversion, contacto directo y presencia visual premium.

## Vision del proyecto

Anima Tarot busca transmitir tres cosas desde el primer segundo:

- confianza para reservar
- sensibilidad estetica
- claridad para convertir visitas en conversaciones reales

La experiencia esta diseñada para que una persona pueda descubrir los servicios, resolver dudas frecuentes, dejar sus datos o escribir directamente por WhatsApp sin fricciones.

## Stack

- HTML
- CSS
- JavaScript
- Manifest web app
- Service worker para instalacion y cache basico

## Funcionalidades implementadas

- Hero principal con propuesta de valor y CTA directo a WhatsApp
- Seccion de presentacion con beneficios persuasivos
- Seccion de servicios con tarjetas editables
- Formulario de contacto con confirmacion inmediata en el navegador
- Testimonios orientados a prueba social
- CTA final de cierre para impulsar la accion
- Boton flotante de WhatsApp
- Boton flotante de asistente virtual
- Chatbot con preguntas frecuentes tactiles
- Chatbot con memoria basica del ultimo tema consultado
- Soporte PWA para instalacion desde navegador compatible

## Estructura del proyecto

- css/styles.css
- js/app.js
- js/chatbot.js
- js/form.js
- js/pwa.js
- images/hero-tarot.svg
- images/service-reading.svg
- images/service-spread.svg
- images/service-guidance.svg
- images/icon-app.svg
- index.html
- manifest.webmanifest
- service-worker.js

## Identidad visual

La estetica se apoya en:

- negros profundos como base
- dorados suaves para jerarquia y sofisticacion
- lilas y violetas electricos como acento mistico controlado
- superficies translúcidas con brillo tenue
- composicion mobile-first con tono ceremonial y elegante

Los colores principales estan centralizados en [css/styles.css](css/styles.css) dentro del bloque :root.

## Personalizacion rapida

### Textos

Todo el contenido editable principal esta en [index.html](index.html).

### Estilos

Puedes modificar:

- paleta y sombras en [css/styles.css](css/styles.css)
- espaciado y layout en [css/styles.css](css/styles.css)
- apariencias del chatbot, botones y paneles en [css/styles.css](css/styles.css)

### Chatbot

La logica del asistente esta en [js/chatbot.js](js/chatbot.js).

Incluye:

- deteccion basica por temas
- continuidad conversacional usando localStorage
- chips de preguntas frecuentes dentro del chat

### Formulario

La respuesta del formulario esta en [js/form.js](js/form.js).

Hoy muestra un mensaje de confirmacion en frontend. Mas adelante puede conectarse con:

- email
- Google Sheets
- backend propio
- automatizaciones externas

### WhatsApp

El numero configurado actualmente es 2215047962 y esta usado en formato WhatsApp internacional dentro de [index.html](index.html).

## PWA e instalacion

El proyecto incluye:

- [manifest.webmanifest](manifest.webmanifest)
- [service-worker.js](service-worker.js)
- boton de instalacion controlado desde [js/pwa.js](js/pwa.js)

En navegadores compatibles, el boton de instalacion aparece cuando el sistema detecta que la web puede instalarse.

## GitHub Pages

El contenido ya fue subido a la rama main del repositorio.

Para publicarlo en GitHub Pages:

1. Ir a Settings > Pages en el repositorio.
2. En Build and deployment elegir Deploy from a branch.
3. Seleccionar main.
4. Seleccionar /root.
5. Guardar y esperar la publicacion.

La URL esperada es:

- https://braianruaimi.github.io/Anima-Tarot/

Si la URL devuelve 404, normalmente significa que GitHub Pages aun no fue activado o todavia esta procesando el deploy.

## Desarrollo local

No requiere dependencias ni build para funcionar como sitio estatico.

Opciones recomendadas para previsualizar:

1. Abrir index.html directamente en el navegador.
2. Servir la carpeta con una extension de live server.
3. Usar cualquier servidor estatico simple.

## Archivos clave

- [index.html](index.html): estructura y contenido del sitio
- [css/styles.css](css/styles.css): sistema visual, responsive y componentes
- [js/chatbot.js](js/chatbot.js): logica del asistente virtual
- [js/form.js](js/form.js): respuesta del formulario
- [js/pwa.js](js/pwa.js): instalacion PWA y registro del service worker
- [service-worker.js](service-worker.js): cache basico offline

## Siguientes mejoras sugeridas

1. Conectar el formulario a un canal real de recepcion.
2. Persistir el historial del chat entre recargas.
3. Reemplazar testimonios e imagenes por contenido real de la marca.
4. Añadir agenda o reservas reales si el flujo comercial lo necesita.

## Estado actual

Base visual, copy persuasivo, chatbot contextual, WhatsApp real y estructura lista para seguir personalizando sobre Anima Tarot.