// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=8693bad5';
import { initTheme } from './theme.js?v=cc71755f';
import { initHeader } from './ui.js?v=d0ef7114';

initTheme();
initI18n();
initHeader();
