// Efeito de digitação do hero. As frases completam "Eu sou …" / "I am …".

const typingTextsMap = {
  en: ['a Java backend developer', 'a Software Engineering student', 'an intern at CAESB'],
  'pt-br': ['desenvolvedor backend Java', 'estudante de Engenharia de Software', 'estagiário na CAESB'],
};

const TYPING_SPEED = 80;
const ERASING_SPEED = 40;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_BEFORE_NEXT = 400;

export function initTyping() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return { setLanguage() {} };

  const sizerEl = document.getElementById('typing-sizer');

  // O HTML estático já traz a primeira frase em PT-BR (visível mesmo sem JavaScript).
  let lang = 'pt-br';
  let texts = typingTextsMap[lang];
  let textIndex = 0;
  let charIndex = texts[0].length;
  let timeoutId = null;

  // Medidor invisível com todas as frases do idioma: o título reserva o tamanho da maior
  // e o layout não se desloca durante a digitação.
  function updateSizer() {
    if (!sizerEl) return;
    const iam = document.querySelector('[data-i18n="hero.iam"]')?.textContent ?? '';
    sizerEl.replaceChildren(
      ...texts.map((text) => {
        const line = document.createElement('span');
        line.textContent = `${iam} ${text}|`;
        return line;
      }),
    );
  }

  function typeText() {
    if (charIndex < texts[textIndex].length) {
      typingEl.textContent += texts[textIndex].charAt(charIndex);
      charIndex++;
      timeoutId = setTimeout(typeText, TYPING_SPEED);
    } else {
      timeoutId = setTimeout(eraseText, PAUSE_AFTER_TYPING);
    }
  }

  function eraseText() {
    if (typingEl.textContent.length > 0) {
      typingEl.textContent = typingEl.textContent.slice(0, -1);
      timeoutId = setTimeout(eraseText, ERASING_SPEED);
    } else {
      textIndex = (textIndex + 1) % texts.length;
      charIndex = 0;
      timeoutId = setTimeout(typeText, PAUSE_BEFORE_NEXT);
    }
  }

  // Chamada pelo i18n depois de traduzir a página; só reinicia se o idioma mudou.
  function setLanguage(nextLang) {
    const next = typingTextsMap[nextLang] ? nextLang : 'en';
    if (next === lang) return;

    clearTimeout(timeoutId);
    lang = next;
    texts = typingTextsMap[lang];
    updateSizer();
    textIndex = 0;
    charIndex = 0;
    typingEl.textContent = '';
    timeoutId = setTimeout(typeText, PAUSE_BEFORE_NEXT);
  }

  updateSizer();
  typingEl.textContent = texts[0];
  timeoutId = setTimeout(eraseText, PAUSE_AFTER_TYPING);

  return { setLanguage };
}
