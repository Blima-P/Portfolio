// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initGithub } from './github.js?v=1e709518';
import { initI18n } from './i18n.js?v=37279b5a';
import { initParticles } from './particles.js?v=67e63a84';
import { initTheme } from './theme.js?v=b5315470';
import { initTyping } from './typing.js?v=182c0b34';
import { initUI } from './ui.js?v=af319ae6';

const particles = initParticles();
initTheme({ onChange: () => particles?.refreshColor() });

initTyping();
initI18n();

initUI();
initGithub();

// Terminal (easter egg): o módulo só é baixado no primeiro Ctrl + `.
let terminal;
document.addEventListener('keydown', (event) => {
  if (!event.ctrlKey || event.key !== '`' || event.repeat) return;
  event.preventDefault();
  // A mesma promessa atende pressionamentos rápidos: os toggles ficam na ordem certa.
  terminal ??= import('./terminal.js?v=be628530');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
