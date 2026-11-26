// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=33ce3547';
import { initTheme } from './theme.js?v=5bdcb7c6';
import { initHeader } from './ui.js?v=3ce02871';

initTheme();
initI18n();
initHeader();
