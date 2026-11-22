// Terminal (easter egg): Ctrl + ` abre/fecha. Carregado sob demanda pelo main.js.

import { getLanguage } from './i18n.js?v=645bbf2a';

const CLEAR = Symbol('clear');
const EXIT = Symbol('exit');

const commands = {
  en: {
    help: 'Available commands: about, skills, projects, contact, github, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Software Engineering student at UCB, development intern at CAESB. Focused on Java backend with Spring and PostgreSQL. Expected graduation: late 2027. Open to junior roles in Brasília (hybrid) or remote.',
    skills:
      'Backend: Java 21 • Spring Boot • PostgreSQL • Flyway • JUnit | Front-end: Astro • TypeScript • HTML/CSS/JS • React | Data & more: Python • pandas • C | DevOps: Docker • GitHub Actions • Git',
    projects:
      '1. SocialTech — Astro/TypeScript site, live on the UCB campus (maintainer)\n2. Carteira API — Java/Spring digital wallet\n3. Academic ERP — React/Firebase team project\n4. Multiplayer Minesweeper — C/POSIX\n5. Weekly Dashboard — offline PWA in vanilla JavaScript',
    contact:
      'Email: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: linkedin.com/in/pedrobragadelima',
    github: 'Check out my repos → https://github.com/Blima-P',
    secret: "🎮 Konami Code? Nah, you found the terminal! You're a real dev. 🚀",
    clear: CLEAR,
    exit: EXIT,
  },
  'pt-br': {
    help: 'Comandos disponíveis: about, skills, projects, contact, github, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Estudante de Eng. de Software na UCB, estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL. Conclusão prevista: 2º sem. de 2027. Aberto a vagas júnior em Brasília (híbrido) ou remoto.',
    skills:
      'Backend: Java 21 • Spring Boot • PostgreSQL • Flyway • JUnit | Front-end: Astro • TypeScript • HTML/CSS/JS • React | Dados e mais: Python • pandas • C | DevOps: Docker • GitHub Actions • Git',
    projects:
      '1. SocialTech — Site Astro/TypeScript no ar no campus da UCB (mantenedor)\n2. Carteira API — Carteira digital Java/Spring\n3. ERP Acadêmico — Projeto em equipe React/Firebase\n4. Campo Minado Multiplayer — C/POSIX\n5. Painel Semanal — PWA offline em JavaScript puro',
    contact:
      'E-mail: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: linkedin.com/in/pedrobragadelima',
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
