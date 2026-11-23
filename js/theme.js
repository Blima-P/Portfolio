// Alternador de tema (claro/escuro). O tema salvo já é aplicado por um script
// inline no <head>, antes da primeira pintura; aqui ficam o botão, a persistência, a cor da
// barra do navegador (meta theme-color), lida do token --color-bg para não duplicar a paleta, e a
// troca animada (View Transitions; instantânea sem suporte ou com movimento reduzido).

import { translateElement } from './i18n.js?v=c19252bf';

const THEME_KEY = 'theme';

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  } catch {
    return 'dark';
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Armazenamento indisponível: o tema vale só para esta visita.
  }
}

// O rótulo descreve a ação do botão (o tema que será ativado), como o ícone.
function updateButton(button, theme) {
  if (!button) return;
  button.dataset.i18n = theme === 'dark' ? 'nav.theme.toLight' : 'nav.theme.toDark';
  translateElement(button);
}

function updateThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  const color = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  if (meta && color) meta.setAttribute('content', color);
}

// Revelação circular do tema novo a partir do centro do botão (ou da tela, se ele não tiver caixa),
// com raio até o canto mais distante.
function revealFrom(button) {
  const rect = button?.getBoundingClientRect();
  const x = rect?.width ? rect.left + rect.width / 2 : innerWidth / 2;
  const y = rect?.height ? rect.top + rect.height / 2 : innerHeight / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  return [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
}

// Definida pelo initTheme, que conhece o botão e o onChange.
let setThemeImpl = () => {};

export function initTheme({ onChange } = {}) {
  let current = readTheme();
  const button = document.getElementById('theme-toggle');

  const root = document.documentElement;

  // Só pinta. O "current" muda apenas no setThemeImpl, síncrono: o callback de uma View Transition
  // pulada pode rodar depois de outra troca e não pode desfazê-la.
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    updateButton(button, theme);
    updateThemeColor();
    onChange?.(theme);
  }

  let running = null;
  setThemeImpl = (theme) => {
    if (theme === current) return;
    current = theme;
    saveTheme(theme);
    // Transições de cor desligadas: o tema novo entra pronto, na revelação ou de uma vez.
    root.classList.add('theme-switching');
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply(theme);
      void root.offsetWidth; // calcula os estilos novos antes de religar as transições
      if (!running) root.classList.remove('theme-switching');
      return;
    }
    const clipPath = revealFrom(button);
    const transition = document.startViewTransition(() => apply(theme));
    running = transition;
    transition.ready
      .then(() =>
        root.animate(
          { clipPath },
          { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        ),
      )
      .catch(() => {}); // transição pulada (aba oculta, outra troca por cima): o tema já foi aplicado
    transition.finished
      .finally(() => {
        if (running !== transition) return;
        running = null;
        root.classList.remove('theme-switching');
      })
      .catch(() => {});
  };
  button?.addEventListener('click', () => setThemeImpl(current === 'dark' ? 'light' : 'dark'));

  apply(current);
}

/** Troca e salva o tema, como o botão (usado pelo terminal, que deixa o botão inerte). */
export function setTheme(theme) {
  if (theme === 'light' || theme === 'dark') setThemeImpl(theme);
}
