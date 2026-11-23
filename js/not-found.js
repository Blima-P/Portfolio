// Entrada da 404.html: o mesmo de um estudo de caso (tema, idioma e header) e o caminho pedido
// no "terminal". textContent, nunca innerHTML: o caminho vem da URL.
import './case.js?v=57df2993';

const path = decodeURIComponentSafe(window.location.pathname);
document.querySelectorAll('[data-missing-path]').forEach((el) => {
  el.textContent = path;
});

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
