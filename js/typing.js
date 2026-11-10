'use strict';

// Efeito de digitação animado na seção hero.
// As frases completam "Eu sou …" / "I am …".

const typingTextsMap = {
  en: [
    'a Java backend developer',
    'a Software Engineering student',
    'an intern at CAESB',
  ],
  'pt-br': [
    'desenvolvedor backend Java',
    'estudante de Engenharia de Software',
    'estagiário na CAESB',
  ],
};

const TYPING_SPEED         = 80;
const ERASING_SPEED        = 40;
const PAUSE_AFTER_TYPING   = 2000;
const PAUSE_BEFORE_NEXT    = 400;

// O HTML estático já traz a primeira frase em PT-BR (visível mesmo sem JavaScript).
let typingLang = 'pt-br';
let typingTexts = typingTextsMap[typingLang];
let textIndex = 0;
let charIndex = 0;
let typingTimeout = null;

const typingEl = document.getElementById('typing-text');
const sizerEl = document.getElementById('typing-sizer');

// Preenche o medidor invisível com todas as frases do idioma atual.
function updateTypingSizer() {
  if (!sizerEl) return;
  const iamEl = document.querySelector('[data-i18n="hero.iam"]');
  const iam = iamEl ? iamEl.textContent : '';
  sizerEl.replaceChildren(...typingTexts.map(text => {
    const line = document.createElement('span');
    line.textContent = `${iam} ${text}|`;
    return line;
  }));
}

function typeText() {
  if (charIndex < typingTexts[textIndex].length) {
    typingEl.textContent += typingTexts[textIndex].charAt(charIndex);
    charIndex++;
    typingTimeout = setTimeout(typeText, TYPING_SPEED);
  } else {
    typingTimeout = setTimeout(eraseText, PAUSE_AFTER_TYPING);
  }
}

function eraseText() {
  if (typingEl.textContent.length > 0) {
    typingEl.textContent = typingEl.textContent.slice(0, -1);
    typingTimeout = setTimeout(eraseText, ERASING_SPEED);
  } else {
    textIndex = (textIndex + 1) % typingTexts.length;
    charIndex = 0;
    typingTimeout = setTimeout(typeText, PAUSE_BEFORE_NEXT);
  }
}

// Chamada pelo i18n.js; só reinicia a animação se o idioma realmente mudou.
function updateTypingLanguage(lang) {
  const nextLang = typingTextsMap[lang] ? lang : 'en';
  if (!typingEl || nextLang === typingLang) return;

  clearTimeout(typingTimeout);
  typingLang = nextLang;
  typingTexts = typingTextsMap[typingLang];
  updateTypingSizer();
  textIndex = 0;
  charIndex = 0;
  typingEl.textContent = '';
  typingTimeout = setTimeout(typeText, PAUSE_BEFORE_NEXT);
}

if (typingEl) {
  updateTypingSizer();
  typingEl.textContent = typingTexts[0];
  charIndex = typingTexts[0].length;
  typingTimeout = setTimeout(eraseText, PAUSE_AFTER_TYPING);
}
