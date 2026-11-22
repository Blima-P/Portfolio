// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initContact } from './contact.js?v=96cf6228';
import { initGithub } from './github.js?v=d9d01520';
import { initI18n } from './i18n.js?v=8693bad5';
import { initParticles } from './particles.js?v=56945b69';
import { initTheme } from './theme.js?v=cc71755f';
import { initTyping } from './typing.js?v=182c0b34';
import { initUI } from './ui.js?v=d0ef7114';

const particles = initParticles();
initTheme({ onChange: () => particles?.refreshColor() });

initTyping();
initI18n();

initUI();
initContact();
initGithub();

// Terminal (easter egg): o módulo só é baixado no primeiro Ctrl + `.
let terminal;
document.addEventListener('keydown', (event) => {
  if (!event.ctrlKey || event.key !== '`' || event.repeat) return;
  event.preventDefault();
  // A mesma promessa atende pressionamentos rápidos: os toggles ficam na ordem certa.
  terminal ??= import('./terminal.js?v=c81ac952');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
