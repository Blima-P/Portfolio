// Terminal (easter egg): Ctrl + ` abre/fecha. Carregado sob demanda pelo main.js.
// <dialog> modal nativo: foco preso e devolvido a quem abriu, Esc fecha, saída anunciada (aria-live).

import { getLanguage } from './i18n.js?v=6cc5a7b2';

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
    title: 'Portfolio terminal',
    input: 'Command',
    output: 'Terminal output',
    intro: 'Type "help" for available commands. ↑/↓ browse history, Tab completes.',
    notFound: (cmd) => `Command not found: "${cmd}". Type "help" for available commands.`,
    close: 'Close terminal',
  },
  'pt-br': {
    title: 'Terminal do portfólio',
    input: 'Comando',
    output: 'Saída do terminal',
    intro: 'Digite "help" para ver os comandos disponíveis. ↑/↓ navegam no histórico, Tab completa.',
    notFound: (cmd) => `Comando não encontrado: "${cmd}". Digite "help" para ver os comandos disponíveis.`,
    close: 'Fechar terminal',
  },
};

let dialog = null;
let title = null;
let input = null;
let output = null;
let closeBtn = null;
let opener = null;

const history = [];
let historyIndex = 0; // history.length = linha nova (o rascunho)
let draft = '';

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

function commonPrefix(words) {
  return words.reduce((acc, word) => {
    let i = 0;
    while (i < acc.length && acc[i] === word[i]) i += 1;
    return acc.slice(0, i);
  });
}

/**
 * Autocompletar do Tab: devolve true só quando agiu (completou ou listou opções). Sem prefixo, sem
 * correspondência ou com o comando já completo, o Tab segue o foco normal do diálogo.
 */
function complete() {
  const prefix = input.value.toLowerCase();
  if (!prefix || /\s/.test(prefix)) return false;
  const names = Object.keys(commands[getLang()]).filter((name) => name.startsWith(prefix));
  if (!names.length) return false;
  const common = commonPrefix(names);
  if (common.length > prefix.length) {
    input.value = common;
    return true;
  }
  if (names.length === 1) return false;
  const options = names.join('  ');
  if (output.lastElementChild?.textContent !== options) addLine(options, 'system');
  return true;
}

function browseHistory(step) {
  const next = historyIndex + step;
  if (next < 0 || next > history.length) return;
  if (historyIndex === history.length) draft = input.value;
  historyIndex = next;
  input.value = next === history.length ? draft : history[next];
  input.setSelectionRange(input.value.length, input.value.length);
}

function onInputKeydown(event) {
  if (event.isComposing) return;
  if (event.key === 'Enter') {
    // Sem isso, o "exit" devolve o foco ao gatilho e o mesmo Enter o aciona.
    event.preventDefault();
    const cmd = input.value.trim();
    if (cmd && history.at(-1) !== cmd) history.push(cmd);
    historyIndex = history.length;
    draft = '';
    input.value = '';
    if (cmd) processCommand(cmd.toLowerCase());
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
    browseHistory(event.key === 'ArrowUp' ? -1 : 1);
  } else if (
    event.key === 'Tab' &&
    !event.shiftKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.metaKey &&
    complete()
  ) {
    event.preventDefault();
  }
}

function createTerminal() {
  dialog = el('dialog', 'terminal terminal-dialog');
  dialog.setAttribute('aria-labelledby', 'terminal-title');

  const header = el('div', 'terminal__header');
  const dots = el('span', 'terminal__dots');
  dots.setAttribute('aria-hidden', 'true');
  for (const color of ['red', 'yellow', 'green']) {
    dots.append(el('span', `terminal__dot terminal__dot--${color}`));
  }
  title = el('h2', 'terminal__title');
  title.id = 'terminal-title';
  closeBtn = el('button', 'terminal__close', '✕');
  closeBtn.type = 'button';
  header.append(dots, title, closeBtn);

  output = el('div', 'terminal__body');
  output.setAttribute('role', 'log');
  output.setAttribute('aria-live', 'polite');
  output.append(el('p', 'terminal__line terminal__line--system', messages[getLang()].intro));

  const inputLine = el('div', 'terminal__input-line');
  input = el('input', 'terminal__input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'none');
  input.setAttribute('enterkeyhint', 'send');
  const prompt = el('span', 'terminal__prompt', '→');
  prompt.setAttribute('aria-hidden', 'true');
  inputLine.append(prompt, input);

  dialog.append(header, output, inputLine);
  document.body.append(dialog);

  input.addEventListener('keydown', onInputKeydown);
  closeBtn.addEventListener('click', closeTerminal);
  // O diálogo não tem preenchimento: clique no próprio <dialog> é clique no fundo (::backdrop). O gesto
  // precisa começar fora também — arrastar uma seleção do texto para fora não fecha o terminal.
  let pressedOnBackdrop = false;
  dialog.addEventListener('pointerdown', (event) => {
    pressedOnBackdrop = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (pressedOnBackdrop && event.target === dialog) closeTerminal();
    pressedOnBackdrop = false;
  });
  dialog.addEventListener('close', () => {
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  });
}

function openTerminal() {
  if (!dialog) createTerminal();
  const text = messages[getLang()];
  title.textContent = text.title;
  input.setAttribute('aria-label', text.input);
  output.setAttribute('aria-label', text.output);
  closeBtn.setAttribute('aria-label', text.close);
  opener = document.activeElement === document.body ? null : document.activeElement;
  dialog.showModal();
  input.focus();
}

function closeTerminal() {
  if (dialog?.open) dialog.close();
}

export function toggleTerminal() {
  if (dialog?.open) closeTerminal();
  else openTerminal();
}
