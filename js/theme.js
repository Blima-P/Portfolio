// Alternador de tema (claro/escuro). O tema salvo já é aplicado por um script
// inline no <head>, antes da primeira pintura; aqui ficam o botão, a persistência e a cor da
// barra do navegador (meta theme-color), lida do token --color-bg para não duplicar a paleta.

import { translateElement } from './i18n.js?v=bb540b3b';

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

export function initTheme({ onChange } = {}) {
  let current = readTheme();
  const button = document.getElementById('theme-toggle');

  function apply(theme) {
    current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    updateButton(button, theme);
    updateThemeColor();
    onChange?.(theme);
  }

  button?.addEventListener('click', () => {
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    apply(next);
  });

  apply(current);
}
