// Contato: botão "Copiar" do e-mail, com fallback para navegadores sem Clipboard API
// (ou sem permissão) e anúncio do resultado para leitores de tela via aria-live.

import { t } from './i18n.js?v=6cc5a7b2';

const RESET_MS = 4000;

// Fallback síncrono: copia por um textarea temporário (execCommand ainda funciona onde a
// Clipboard API não existe, como páginas sem HTTPS).
function copyWithTextarea(text) {
  const previousFocus = document.activeElement;
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  let ok;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  area.remove();
  // Devolve o foco ao botão para quem navega por teclado não "cair" no topo da página.
  previousFocus?.focus?.({ preventScroll: true });
  return ok;
}

// Último recurso: deixa o e-mail selecionado para o usuário copiar com o teclado.
function selectText(el) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

async function copy(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permissão negada ou contexto inseguro: tenta o fallback abaixo.
  }
  return copyWithTextarea(text);
}

export function initContact() {
  const button = document.getElementById('copy-email');
  const address = document.getElementById('contact-email');
  const status = document.getElementById('copy-email-status');
  if (!button || !address || !status) return;

  let timer;
  button.addEventListener('click', async () => {
    const ok = await copy(address.textContent.trim());
    if (!ok) selectText(address);
    status.textContent = t(ok ? 'contact.copy.done' : 'contact.copy.manual');
    button.classList.toggle('is-copied', ok);
    clearTimeout(timer);
    timer = setTimeout(() => {
      status.textContent = '';
      button.classList.remove('is-copied');
    }, RESET_MS);
  });
}
