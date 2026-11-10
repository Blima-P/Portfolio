// Alternador de idioma (PT-BR padrão / EN).

import { HTML_KEYS, translations } from './translations.js?v=7ba0efb8';

const DEFAULT_LANG = 'pt-br';
// Chave nova: a versão anterior salvava 'lang' = 'en' em toda visita, sem escolha do usuário.
const LANG_KEY = 'portfolio-lang';
const htmlKeys = new Set(HTML_KEYS);

let currentLang = DEFAULT_LANG;
let notifyChange = () => {};

function readSavedLanguage() {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}

function saveLanguage(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // Armazenamento indisponível (ex.: modo privado): a escolha vale só para esta visita.
  }
}

// Precedência: escolha salva → idioma do navegador (pt* → PT-BR, demais → EN).
function detectLanguage() {
  const saved = readSavedLanguage();
  if (saved && Object.hasOwn(translations, saved)) return saved;

  const preferred = navigator.languages?.[0] || navigator.language || '';
  if (!preferred) return DEFAULT_LANG;
  return preferred.toLowerCase().startsWith('pt') ? 'pt-br' : 'en';
}

export function getLanguage() {
  return currentLang;
}

export function t(key) {
  return translations[currentLang][key] ?? translations[DEFAULT_LANG][key] ?? '';
}

// Traduz um elemento com data-i18n (e, opcionalmente, data-i18n-attr).
export function translateElement(el) {
  const key = el.dataset.i18n;
  const value = translations[currentLang][key];
  if (value === undefined) return;

  const attr = el.dataset.i18nAttr;
  if (attr) {
    el.setAttribute(attr, value);
  } else if (htmlKeys.has(key)) {
    el.innerHTML = value;
  } else {
    el.textContent = value;
  }
}

function setLanguage(lang, { persist = false } = {}) {
  const dict = translations[lang];
  if (!dict) return;

  currentLang = lang;
  if (persist) saveLanguage(lang);

  document.querySelectorAll('[data-i18n]').forEach(translateElement);

  document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : 'en';
  document.title = dict['meta.title'];
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict['meta.description']);

  // O botão mostra o idioma para o qual vai trocar.
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) toggleBtn.textContent = lang === 'en' ? 'PT-BR' : 'EN';

  notifyChange(lang);
}

export function initI18n({ onChange } = {}) {
  if (onChange) notifyChange = onChange;

  // A escolha manual é salva e prevalece sobre o idioma do navegador.
  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'pt-br' : 'en', { persist: true });
  });

  setLanguage(detectLanguage());
}
