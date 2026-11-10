// Ponto de entrada (ES Module). Nenhuma variável global: cada funcionalidade expõe init*().

import { initGithub } from './github.js?v=3785dea8';
import { initI18n } from './i18n.js?v=254edcd8';
import { initParticles } from './particles.js?v=4c50c19a';
import { initTheme } from './theme.js?v=9162fbf3';
import { initTyping } from './typing.js?v=ddc8d48b';
import { initUI } from './ui.js?v=8eadebdc';

const particles = initParticles();
initTheme({ onChange: () => particles?.refreshColor() });

// O typing precisa existir antes do i18n, que o avisa quando o idioma muda.
const typing = initTyping();
initI18n({ onChange: (lang) => typing.setLanguage(lang) });

initUI();
initGithub();

// Terminal (easter egg): o módulo só é baixado no primeiro Ctrl + `.
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === '`') {
    event.preventDefault();
    import('./terminal.js?v=f60b3ab6').then(({ toggleTerminal }) => toggleTerminal());
  }
});
