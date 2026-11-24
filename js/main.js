// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initContact } from './contact.js?v=86da6ebb';
import { initGithub } from './github.js?v=ac5eb7ff';
import { initI18n } from './i18n.js?v=9f14586b';
import { initParticles } from './particles.js?v=7111701c';
import { initTheme } from './theme.js?v=b78a1f3e';
import { initTyping } from './typing.js?v=f1b2c871';
import { initUI } from './ui.js?v=3ce02871';

const particles = initParticles();
initTheme({ onChange: () => particles?.refreshColor() });

initTyping();
initI18n();

initUI();
initContact();
initGithub();

// Terminal (easter egg): o módulo só é baixado na primeira abertura — botão >_ do menu, Ctrl + K
// (como no GitHub) ou Ctrl + ` (tecla morta no ABNT2, por isso o K).
let terminal;
function toggleTerminal() {
  // A mesma promessa atende pressionamentos rápidos: os toggles ficam na ordem certa.
  terminal ??= import('./terminal.js?v=234ee423');
  terminal
    .then((module) => module.toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
}

// Ctrl + K não rouba o atalho de quem digita num campo (exceto no próprio terminal, onde fecha).
function isTextField(el) {
  return Boolean(
    el?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])') &&
    !el.closest('.terminal-dialog'),
  );
}

document.getElementById('terminal-toggle')?.addEventListener('click', toggleTerminal);
document.addEventListener('keydown', (event) => {
  if (event.altKey || event.shiftKey) return;
  const backquote = event.ctrlKey && event.key === '`';
  const k = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
  if (!backquote && !(k && !isTextField(event.target))) return;
  // Segurar a tecla não reabre o terminal, mas também não deixa o navegador levar o atalho (busca na barra).
  event.preventDefault();
  if (!event.repeat) toggleTerminal();
});
