// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=9a888827';
import { initTheme } from './theme.js?v=9f960f60';
import { initHeader } from './ui.js?v=0af5611f';

initTheme();
initI18n();
initHeader();
