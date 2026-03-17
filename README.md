# Anima Tarot

Sitio web estatico de Anima Tarot orientado a conversion directa por WhatsApp, con estetica oscura ceremonial, acentos electricos, PWA instalable y flujos interactivos para aumentar reservas.

Sitio publicado:

- https://braianruaimi.github.io/Anima-Tarot/

Repositorio:

- https://github.com/braianruaimi/Anima-Tarot

## Estado actual

La version actual incluye:

- hero principal con propuesta de valor y CTA directo
- tres servicios comerciales cerrados
- seccion de reservas con acceso directo al formulario flotante
- modal de reserva con envio a WhatsApp
- persistencia local de datos del usuario en el formulario
- autocompletado de horoscopo a partir de la fecha de nacimiento
- chatbot flotante con FAQ y memoria basica
- solapa interactiva de cartas encima del chat
- carrusel automatico de testimonios
- modal promocional para espacio 1 a 1
- barra superior para instalar la app o actualizarla cuando haya nueva version
- PWA con service worker y actualizacion manual controlada por el usuario

## Capturas

Vista de escritorio:

![Vista desktop de Anima Tarot](images/readme/anima-tarot-desktop.png)

Vista mobile:

![Vista mobile de Anima Tarot](images/readme/anima-tarot-mobile.png)

## Stack

- HTML
- CSS
- JavaScript
- manifest web app
- service worker

## Estructura principal

- [index.html](index.html): estructura del sitio, servicios, reservas, modales, chatbot y CTA
- [css/styles.css](css/styles.css): sistema visual, responsive, fondos, componentes, carrusel y modales
- [js/app.js](js/app.js): modal de reserva, solapa de cartas, testimonios, CTA 1 a 1 y envio a WhatsApp
- [js/chatbot.js](js/chatbot.js): chatbot con FAQ y memoria de contexto
- [js/form.js](js/form.js): mensaje del formulario legacy
- [js/pwa.js](js/pwa.js): instalacion de la app, deteccion de updates y recarga controlada
- [service-worker.js](service-worker.js): cache offline, activacion y flujo de actualizacion manual
- [manifest.webmanifest](manifest.webmanifest): configuracion de instalacion de la app

## Flujo principal de reserva

1. La persona entra al sitio y recorre la propuesta de valor.
2. Puede reservar desde un servicio o desde la seccion principal de reservas.
3. Se abre el formulario flotante con el servicio ya cargado.
4. Completa nombre, apellido, fecha de nacimiento, horoscopo, email y notas.
5. El sitio recuerda esos datos en localStorage para futuras reservas.
6. Al enviar, se abre WhatsApp con el mensaje ya estructurado.

## Interacciones de conversion

### Modal de reserva

Vive en [index.html](index.html) y se maneja desde [js/app.js](js/app.js).

Incluye:

- carga automatica del servicio seleccionado
- boton para volver o cerrar
- cierre por fondo o tecla Escape
- persistencia local de datos
- mensaje listo para WhatsApp

### Solapa de cartas

La lectura breve de cartas funciona como una solapa compacta encima del chat.

Comportamiento:

- aparece luego de unos segundos en estado minimizado
- si se toca, se despliega
- si no se usa, queda asomada
- permite elegir una carta y ver una lectura breve
- tiene boton volver y boton para reservar desde esa lectura

### Carrusel de testimonios

La seccion de testimonios ahora funciona como carrusel automatico.

Incluye:

- ocho testimonios visibles de a uno
- rotacion automatica cada dos segundos
- indicadores de posicion

### CTA 1 a 1

Luego de unos segundos puede aparecer un modal promocional con invitacion a un espacio 1 a 1.

Incluye:

- texto persuasivo breve
- salida directa a WhatsApp con mensaje precargado
- cierre por cruz o tocando fuera

## WhatsApp

El numero usado actualmente se configura en [js/app.js](js/app.js).

El mensaje de reserva incluye:

- servicio
- resumen
- nombre
- apellido
- fecha de nacimiento
- horoscopo
- email
- notas

## Chatbot

El asistente vive en [js/chatbot.js](js/chatbot.js).

Incluye:

- chips tactiles de preguntas frecuentes
- deteccion de temas por palabras clave
- continuidad cuando hay preguntas de seguimiento
- memoria local simple con localStorage

## PWA e instalacion

La app instalable usa:

- [manifest.webmanifest](manifest.webmanifest)
- [js/pwa.js](js/pwa.js)
- [service-worker.js](service-worker.js)

La barra superior puede mostrar dos estados:

- Instalar app: cuando el navegador permite la instalacion
- Actualiza app: cuando ya existe una nueva version esperando activacion

Al tocar Actualiza app:

- el service worker nuevo recibe la orden de activarse
- toma control de la app
- la pagina se recarga sola con la version nueva

## Personalizacion rapida

Para cambiar textos, estructura o CTA:

- editar [index.html](index.html)

Para cambiar colores, fondos, bordes o responsive:

- editar [css/styles.css](css/styles.css)

Para cambiar reservas, cartas, testimonios o promo 1 a 1:

- editar [js/app.js](js/app.js)

Para cambiar la logica de instalacion o actualizacion PWA:

- editar [js/pwa.js](js/pwa.js)
- editar [service-worker.js](service-worker.js)

Para ajustar respuestas del asistente:

- editar [js/chatbot.js](js/chatbot.js)

## Desarrollo local

No requiere dependencias ni build.

Puedes probarlo con cualquiera de estas opciones:

1. Abrir [index.html](index.html) en el navegador.
2. Usar un servidor estatico simple.
3. Levantar la carpeta con una extension de live server.

## Notas de mantenimiento

- Si cambias archivos del frontend, normalmente debes subir la version del cache en [service-worker.js](service-worker.js).
- Si una persona ya tiene la app instalada, el boton Actualiza app aparecera cuando haya una version nueva esperando activacion.
- El formulario legacy ya no es el flujo principal de conversion.
- El flujo comercial real vive en el modal de reserva, la solapa de cartas, el chatbot y el CTA 1 a 1.

## Resumen

Anima Tarot queda documentado como una web estatica comercial, con foco fuerte en conversion, reserva asistida por WhatsApp, experiencia visual oscura con bordes electricos y una PWA instalable y actualizable de forma controlada.