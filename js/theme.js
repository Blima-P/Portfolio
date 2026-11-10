// Alternador de tema (claro/escuro). O tema salvo já é aplicado por um script
// inline no <head>, antes da primeira pintura; aqui ficam o botão e a persistência.

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

export function initTheme({ onChange } = {}) {
  let current = readTheme();

  function apply(theme) {
    current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    onChange?.(theme);
  }

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    apply(next);
  });

  apply(current);
}
