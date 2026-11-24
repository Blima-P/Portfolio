// Linha de terminal decorativa do hero: digita e apaga comandos do dia a dia de um dev backend.
// É aria-hidden e não depende do idioma; com movimento reduzido (inclusive ativado com a página aberta),
// fica parada mostrando o comando inteiro.

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
  if (!typingEl) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // O HTML estático já traz o primeiro comando (visível mesmo sem JavaScript).
  let index = 0;
  let chars = COMMANDS[0].length;
  let timer = null;
  const schedule = (fn, delay) => {
    timer = setTimeout(fn, delay);
  };

  function typeText() {
    if (chars < COMMANDS[index].length) {
      typingEl.textContent = COMMANDS[index].slice(0, ++chars);
      schedule(typeText, TYPING_SPEED);
    } else {
      schedule(eraseText, PAUSE_AFTER_TYPING);
    }
  }

  function eraseText() {
    if (chars > 0) {
      typingEl.textContent = COMMANDS[index].slice(0, --chars);
      schedule(eraseText, ERASING_SPEED);
    } else {
      index = (index + 1) % COMMANDS.length;
      schedule(typeText, PAUSE_BEFORE_NEXT);
    }
  }

  function start() {
    schedule(eraseText, PAUSE_AFTER_TYPING);
  }

  function stop() {
    clearTimeout(timer);
    chars = COMMANDS[index].length;
    typingEl.textContent = COMMANDS[index];
  }

  reduce.addEventListener('change', () => (reduce.matches ? stop() : start()));
  if (!reduce.matches) start();
}
