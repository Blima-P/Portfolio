// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=fb6c1213';
import { initTheme } from './theme.js?v=84eeef3c';
import { initHeader } from './ui.js?v=bec50259';

initTheme();
initI18n();
initHeader();
