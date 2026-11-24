// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=9f14586b';
import { initTheme } from './theme.js?v=b78a1f3e';
import { initHeader } from './ui.js?v=3ce02871';

initTheme();
initI18n();
initHeader();
