// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initContact } from './contact.js?v=24c265e9';
import { initGithub } from './github.js?v=9dd44aa6';
import { initI18n } from './i18n.js?v=6cc5a7b2';
import { initParticles } from './particles.js?v=56945b69';
import { initTheme } from './theme.js?v=f813f550';
import { initTyping } from './typing.js?v=182c0b34';
import { initUI } from './ui.js?v=0af5611f';

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
  terminal ??= import('./terminal.js?v=73c9acdf');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
