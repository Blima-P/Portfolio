// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initGithub } from './github.js?v=ab8497e1';
import { initI18n } from './i18n.js?v=18179e22';
import { initParticles } from './particles.js?v=7aa9d7c9';
import { initTheme } from './theme.js?v=fa570304';
import { initTyping } from './typing.js?v=ddc8d48b';
import { initUI } from './ui.js?v=2f4fafba';

const particles = initParticles();
initTheme({ onChange: () => particles?.refreshColor() });

// O typing precisa existir antes do i18n, que o avisa quando o idioma muda.
const typing = initTyping();
initI18n({ onChange: (lang) => typing.setLanguage(lang) });

initUI();
initGithub();

// Terminal (easter egg): o módulo só é baixado no primeiro Ctrl + `.
let terminal;
document.addEventListener('keydown', (event) => {
  if (!event.ctrlKey || event.key !== '`' || event.repeat) return;
  event.preventDefault();
  // A mesma promessa atende pressionamentos rápidos: os toggles ficam na ordem certa.
  terminal ??= import('./terminal.js?v=9c3579ee');
  terminal
    .then(({ toggleTerminal }) => toggleTerminal())
    .catch((err) => {
      terminal = undefined; // permite tentar de novo (ex.: rede instável)
      console.warn('Não foi possível abrir o terminal:', err);
    });
});
