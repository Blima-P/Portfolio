'use strict';

// Efeito de digitação animado na seção hero.

const typingTextsMap = {
  en: [
    'Java Backend Developer',
    'Spring & PostgreSQL',
    'Software Eng. Student',
    'Intern at CAESB',
    'Passionate about tech',
  ],
  'pt-br': [
    'Desenvolvedor Backend Java',
    'Spring e PostgreSQL',
    'Estudante de Eng. de Software',
    'Estagiário na CAESB',
    'Apaixonado por tecnologia 🚀',
  ],
};

let typingTexts = typingTextsMap[localStorage.getItem('lang') || 'en'];

const TYPING_SPEED         = 80;
const ERASING_SPEED        = 40;
const PAUSE_AFTER_TYPING   = 2000;
const PAUSE_BEFORE_NEXT    = 400;

let textIndex = 0;
let charIndex = 0;
let typingTimeout = null;

const typingEl = document.getElementById('typing-text');

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

// A função updateTypingLanguage só é chamada quando o idioma é alterado.
function updateTypingLanguage(lang) {
  clearTimeout(typingTimeout);
  typingTexts = typingTextsMap[lang] || typingTextsMap['en'];
  textIndex = 0;
  charIndex = 0;
  typingEl.textContent = '';
  typingTimeout = setTimeout(typeText, PAUSE_BEFORE_NEXT);
}

typingTimeout = setTimeout(typeText, 500);
