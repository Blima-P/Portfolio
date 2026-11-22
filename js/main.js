// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initContact } from './contact.js?v=6ea0007b';
import { initGithub } from './github.js?v=acf3a9d5';
import { initI18n } from './i18n.js?v=81d09409';
import { initParticles } from './particles.js?v=56945b69';
import { initTheme } from './theme.js?v=8bcd198b';
import { initTyping } from './typing.js?v=182c0b34';
import { initUI } from './ui.js?v=cf59dc8c';

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
  terminal ??= import('./terminal.js?v=18a3f490');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
