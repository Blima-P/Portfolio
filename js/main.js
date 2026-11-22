// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initContact } from './contact.js?v=d8019907';
import { initGithub } from './github.js?v=5b48bac0';
import { initI18n } from './i18n.js?v=b0df2daf';
import { initParticles } from './particles.js?v=56945b69';
import { initTheme } from './theme.js?v=0b621bfa';
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
  terminal ??= import('./terminal.js?v=3b52de56');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
