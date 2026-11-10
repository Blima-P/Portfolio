// Terminal (easter egg): Ctrl + ` abre/fecha. Carregado sob demanda pelo main.js.

import { getLanguage } from './i18n.js?v=d5b16599';

const CLEAR = Symbol('clear');
const EXIT = Symbol('exit');

const commands = {
  en: {
    help: 'Available commands: about, skills, projects, contact, github, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Software Engineering student at UCB, development intern at CAESB. Focused on Java backend with Spring and PostgreSQL.',
    skills: 'Java • Spring • PostgreSQL • React • HTML/CSS • Python • pandas • Git • GitHub Actions',
    projects:
      '1. Carteira API — Java/Spring digital wallet\n2. Academic ERP — React/Firebase team project\n3. Multiplayer Minesweeper — C/POSIX\n4. Personal Portfolio — HTML/CSS/JavaScript',
    contact: 'Email: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
    github: 'Check out my repos → https://github.com/Blima-P',
    secret: "🎮 Konami Code? Nah, you found the terminal! You're a real dev. 🚀",
    clear: CLEAR,
    exit: EXIT,
  },
  'pt-br': {
    help: 'Comandos disponíveis: about, skills, projects, contact, github, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Estudante de Eng. de Software na UCB, estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL.',
    skills: 'Java • Spring • PostgreSQL • React • HTML/CSS • Python • pandas • Git • GitHub Actions',
    projects:
      '1. Carteira API — Carteira digital Java/Spring\n2. ERP Acadêmico — Projeto em equipe React/Firebase\n3. Campo Minado Multiplayer — C/POSIX\n4. Portfólio Pessoal — HTML/CSS/JavaScript',
    contact: 'E-mail: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
    github: 'Confira meus repos → https://github.com/Blima-P',
    secret: '🎮 Konami Code? Não, você achou o terminal! Você é um dev de verdade. 🚀',
    clear: CLEAR,
    exit: EXIT,
  },
};

const messages = {
  en: {
    intro: 'Type "help" for available commands.',
    notFound: (cmd) => `Command not found: "${cmd}". Type "help" for available commands.`,
    close: 'Close terminal',
  },
  'pt-br': {
    intro: 'Digite "help" para ver os comandos disponíveis.',
    notFound: (cmd) => `Comando não encontrado: "${cmd}". Digite "help" para ver os comandos disponíveis.`,
    close: 'Fechar terminal',
  },
};

let overlay = null;
let input = null;
let output = null;
let closeBtn = null;
let isOpen = false;

function getLang() {
  const lang = getLanguage();
  return Object.hasOwn(commands, lang) ? lang : 'en';
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function addLine(text, type) {
  output.append(el('p', `terminal__line terminal__line--${type}`, text));
  output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
  const lang = getLang();
  const dict = commands[lang];

  addLine(`→ ${cmd}`, 'command');

  // hasOwn evita que "constructor" ou "__proto__" sejam tratados como comandos.
  if (!Object.hasOwn(dict, cmd)) {
    addLine(messages[lang].notFound(cmd), 'error');
    return;
  }

  const response = dict[cmd];
  if (response === CLEAR) {
    output.replaceChildren();
  } else if (response === EXIT) {
    closeTerminal();
  } else {
    response.split('\n').forEach((line) => addLine(line, 'response'));
  }
}

function createTerminal() {
  overlay = el('div', 'terminal-overlay');
  const terminal = el('div', 'terminal');

  const header = el('div', 'terminal__header');
  for (const color of ['red', 'yellow', 'green']) {
    header.append(el('span', `terminal__dot terminal__dot--${color}`));
  }
  header.append(el('span', 'terminal__title', 'pbl@portfolio:~$'));
  closeBtn = el('button', 'terminal__close', '✕');
  closeBtn.type = 'button';
  header.append(closeBtn);

  output = el('div', 'terminal__body');
  output.append(el('p', 'terminal__line terminal__line--system', messages[getLang()].intro));

  const inputLine = el('div', 'terminal__input-line');
  input = el('input', 'terminal__input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'Terminal');
  inputLine.append(el('span', 'terminal__prompt', '→'), input);

  terminal.append(header, output, inputLine);
  overlay.append(terminal);
  document.body.append(overlay);

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    if (cmd) processCommand(cmd);
    input.value = '';
  });

  closeBtn.addEventListener('click', closeTerminal);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeTerminal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) closeTerminal();
  });
}

function openTerminal() {
  if (!overlay) createTerminal();
  closeBtn.setAttribute('aria-label', messages[getLang()].close);
  overlay.classList.add('terminal-overlay--open');
  isOpen = true;
  setTimeout(() => input.focus(), 100);
}

function closeTerminal() {
  overlay?.classList.remove('terminal-overlay--open');
  isOpen = false;
}

export function toggleTerminal() {
  if (isOpen) closeTerminal();
  else openTerminal();
}
