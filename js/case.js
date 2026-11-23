// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=6cc5a7b2';
import { initTheme } from './theme.js?v=f813f550';
import { initHeader } from './ui.js?v=0af5611f';

initTheme();
initI18n();
initHeader();
