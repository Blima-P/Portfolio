// Linha de terminal decorativa do hero: digita e apaga comandos do dia a dia de um dev backend.
// É aria-hidden e não depende do idioma; com movimento reduzido, fica parada no primeiro comando.

const COMMANDS = [
  'mvn spring-boot:run',
  'docker compose up -d',
  'psql -d socialtech',
  'git push origin main',
];

const TYPING_SPEED = 70;
const ERASING_SPEED = 35;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_BEFORE_NEXT = 400;

export function initTyping() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // O HTML estático já traz o primeiro comando (visível mesmo sem JavaScript).
  let index = 0;
  let chars = COMMANDS[0].length;

  function typeText() {
    if (chars < COMMANDS[index].length) {
      typingEl.textContent = COMMANDS[index].slice(0, ++chars);
      setTimeout(typeText, TYPING_SPEED);
    } else {
      setTimeout(eraseText, PAUSE_AFTER_TYPING);
    }
  }

  function eraseText() {
    if (chars > 0) {
      typingEl.textContent = COMMANDS[index].slice(0, --chars);
      setTimeout(eraseText, ERASING_SPEED);
    } else {
      index = (index + 1) % COMMANDS.length;
      setTimeout(typeText, PAUSE_BEFORE_NEXT);
    }
  }

  setTimeout(eraseText, PAUSE_AFTER_TYPING);
}
