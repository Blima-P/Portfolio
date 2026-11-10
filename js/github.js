// Repositórios em destaque, com dados atualizados pela API pública do GitHub.

import { t } from './i18n.js?v=254edcd8';

const GITHUB_USER = 'Blima-P';
const SELECTED_REPOS = ['carteira-api', 'ERP-Academico', 'Campo-minado', 'Portfolio'];
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  TypeScript: '#2b7489',
  Shell: '#89e051',
};
const SVG_NS = 'http://www.w3.org/2000/svg';
const REPO_ICON_PATH =
  'M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9z';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function repoIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', REPO_ICON_PATH);
  svg.append(path);
  return svg;
}

// Monta o card com DOM (textContent), sem interpolar dados da API em HTML.
function renderRepo(repo) {
  const card = el('a', 'github-card');
  card.href = repo.html_url;
  card.target = '_blank';
  card.rel = 'noopener';

  const header = el('div', 'github-card__header');
  header.append(repoIcon(), el('span', 'github-card__name', repo.name));
  card.append(header);

  if (repo.description) card.append(el('p', 'github-card__desc', repo.description));

  const footer = el('div', 'github-card__footer');
  if (repo.language) {
    const lang = el('span', 'github-card__lang');
    const dot = el('span', 'github-card__lang-dot');
    dot.style.background = LANG_COLORS[repo.language] ?? '#8b949e';
    lang.append(dot, repo.language);
    footer.append(lang);
  }
  footer.append(el('span', 'github-card__stars', `⭐ ${repo.stargazers_count}`));
  card.append(footer);

  return card;
}

function renderFallback(container) {
  const message = el('p', 'github__fallback', t('github.error'));
  // Mantém a mensagem traduzível quando o idioma muda.
  message.dataset.i18n = 'github.error';
  container.replaceChildren(message);
}

export async function initGithub() {
  const container = document.getElementById('github-repos');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();
    const selected = SELECTED_REPOS.map((name) =>
      repos.find((repo) => repo.name === name && !repo.fork && !repo.archived),
    );
    if (selected.some((repo) => !repo)) throw new Error('Repositório selecionado indisponível');
    container.replaceChildren(...selected.map(renderRepo));
  } catch (err) {
    // Falha esperada (limite da API, offline): aviso, não erro — a página continua íntegra.
    console.warn('Não foi possível carregar os repositórios do GitHub:', err);
    renderFallback(container);
  }
}
