// Entrada das páginas de estudo de caso (projetos/*.html): só tema, idioma e header.
// Partículas, repositórios do GitHub, digitação e terminal são exclusivos da home (main.js).

import { initI18n } from './i18n.js?v=c19252bf';
import { initTheme } from './theme.js?v=cb75a91e';
import { initHeader } from './ui.js?v=bec50259';

initTheme();
initI18n();
initHeader();
