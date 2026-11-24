// Entrada da 404.html: o mesmo de um estudo de caso (tema, idioma e header) e o caminho pedido
// no "terminal". textContent, nunca innerHTML: o caminho vem da URL.
import './case.js?v=de533f2c';

const path = decodeURIComponentSafe(window.location.pathname);
document.querySelectorAll('[data-missing-path]').forEach((el) => {
  el.textContent = path;
});

// Com <base href="/Portfolio/">, "#main" apontaria para a home: o skip link precisa do endereço atual.
document.querySelectorAll('a.skip-link[href^="#"]').forEach((link) => {
  link.href = `${window.location.pathname}${window.location.search}${link.getAttribute('href')}`;
});

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
