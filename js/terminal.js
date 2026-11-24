// Terminal (easter egg): botão >_ do menu, Ctrl + K ou Ctrl + `. Carregado sob demanda pelo main.js.
// <dialog> modal nativo: foco preso e devolvido a quem abriu, Esc fecha, saída anunciada (aria-live).

import { copyText } from './contact.js?v=55594664';
import { changeLanguage, getLanguage, t } from './i18n.js?v=fb6c1213';
import { setTheme } from './theme.js?v=84eeef3c';

const CLEAR = Symbol('clear');
const EXIT = Symbol('exit');

const EMAIL = 'pbl0812@gmail.com';

// Destinos do "open": os estudos de caso abrem nesta aba; o resto (GitHub, sites no ar), em outra.
// Exportado para o teste conferir que cada destino também está nos cards da página.
export const PROJECTS = {
  socialtech: 'projetos/socialtech.html',
  'carteira-api': 'projetos/carteira-api.html',
  'erp-academico': 'https://github.com/Blima-P/ERP-Academico',
  'campo-minado': 'https://github.com/Blima-P/Campo-minado',
  'painel-semanal': 'https://blima-p.github.io/painel-semanal/',
};

// Argumentos que o Tab completa.
const ARGS = {
  open: Object.keys(PROJECTS),
  theme: ['dark', 'light'],
  lang: ['en', 'pt'],
};

const LANGS = { pt: 'pt-br', 'pt-br': 'pt-br', en: 'en' };

const actions = {
  open(arg, text) {
    if (!Object.hasOwn(PROJECTS, arg)) {
      addLine(text.openUsage(ARGS.open), arg ? 'error' : 'system');
      return;
    }
    const url = PROJECTS[arg];
    const external = /^https?:/.test(url);
    addLink(text.opening(arg), url, external);
    if (external) window.open(url, '_blank', 'noopener,noreferrer');
    else window.location.assign(url);
  },
  cv(arg, text) {
    const url = t('cv.href');
    addLink(text.cv, url, true);
    window.open(url, '_blank', 'noopener,noreferrer');
  },
  async email(arg, text) {
    const ok = await copyText(EMAIL, dialog);
    addLine(ok ? text.emailCopied(EMAIL) : text.emailManual(EMAIL), ok ? 'response' : 'error');
  },
  theme(arg, text) {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    const wanted = arg || (current === 'dark' ? 'light' : 'dark');
    if (!ARGS.theme.includes(wanted)) {
      addLine(text.themeUsage, 'error');
      return;
    }
    setTheme(wanted);
    addLine(text.themeDone[wanted], 'response');
  },
  lang(arg, text) {
    const wanted = arg ? Object.hasOwn(LANGS, arg) && LANGS[arg] : getLang() === 'en' ? 'pt-br' : 'en';
    if (!wanted) {
      addLine(text.langUsage, 'error');
      return;
    }
    changeLanguage(wanted);
    updateLabels();
    addLine(messages[getLang()].langDone, 'response');
  },
};

const commands = {
  en: {
    help: 'Available commands: about, whoami, skills, projects, open <project>, contact, email, cv, github, theme, lang, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Software Engineering student at UCB, development intern at CAESB. Focused on Java backend with Spring and PostgreSQL. Expected graduation: late 2027. Open to junior roles in Brasília (hybrid) or remote.',
    whoami: 'guest — you are browsing as a visitor. The owner is Pedro Braga de Lima (type "about").',
    skills:
      'Backend: Java 21 • Spring Boot • PostgreSQL • Flyway • JUnit | Front-end: Astro • TypeScript • HTML/CSS/JS • React | Data & more: Python • pandas • C | DevOps: Docker • GitHub Actions • Git',
    projects:
      '1. SocialTech — Astro/TypeScript site, live on the UCB campus (maintainer)\n2. Carteira API — Java/Spring digital wallet\n3. Academic ERP — React/Firebase team project\n4. Multiplayer Minesweeper — C/POSIX\n5. Weekly Dashboard — offline PWA in vanilla JavaScript\nType "open <project>", e.g. "open socialtech".',
    open: actions.open,
    contact:
      'Email: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: linkedin.com/in/pedrobragadelima',
    email: actions.email,
    cv: actions.cv,
    github: 'Check out my repos → https://github.com/Blima-P',
    theme: actions.theme,
    lang: actions.lang,
    secret: "🎮 Konami Code? Nah, you found the terminal! You're a real dev. 🚀",
    clear: CLEAR,
    exit: EXIT,
  },
  'pt-br': {
    help: 'Comandos disponíveis: about, whoami, skills, projects, open <projeto>, contact, email, cv, github, theme, lang, secret, clear, exit',
    about:
      'Pedro Braga de Lima — Estudante de Eng. de Software na UCB, estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL. Conclusão prevista: 2º sem. de 2027. Aberto a vagas júnior em Brasília (híbrido) ou remoto.',
    whoami: 'visitante — você está navegando como convidado. O dono é Pedro Braga de Lima (digite "about").',
    skills:
      'Backend: Java 21 • Spring Boot • PostgreSQL • Flyway • JUnit | Front-end: Astro • TypeScript • HTML/CSS/JS • React | Dados e mais: Python • pandas • C | DevOps: Docker • GitHub Actions • Git',
    projects:
      '1. SocialTech — Site Astro/TypeScript no ar no campus da UCB (mantenedor)\n2. Carteira API — Carteira digital Java/Spring\n3. ERP Acadêmico — Projeto em equipe React/Firebase\n4. Campo Minado Multiplayer — C/POSIX\n5. Painel Semanal — PWA offline em JavaScript puro\nDigite "open <projeto>", por exemplo "open socialtech".',
    open: actions.open,
    contact:
      'E-mail: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: linkedin.com/in/pedrobragadelima',
    email: actions.email,
    cv: actions.cv,
    github: 'Confira meus repos → https://github.com/Blima-P',
    theme: actions.theme,
    lang: actions.lang,
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
    opening: (name) => `Opening ${name}…`,
    openUsage: (names) => `Usage: open <project>. Projects: ${names.join(', ')}`,
    cv: 'Opening the resume (PDF)…',
    emailCopied: (email) => `Email copied: ${email}`,
    emailManual: (email) => `Could not copy. Email: ${email}`,
    themeDone: { light: 'Light theme on.', dark: 'Dark theme on.' },
    themeUsage: 'Usage: theme [light|dark]',
    langDone: 'Language: English.',
    langUsage: 'Usage: lang [pt|en]',
  },
  'pt-br': {
    title: 'Terminal do portfólio',
    input: 'Comando',
    output: 'Saída do terminal',
    intro: 'Digite "help" para ver os comandos disponíveis. ↑/↓ navegam no histórico, Tab completa.',
    notFound: (cmd) => `Comando não encontrado: "${cmd}". Digite "help" para ver os comandos disponíveis.`,
    close: 'Fechar terminal',
    opening: (name) => `Abrindo ${name}…`,
    openUsage: (names) => `Uso: open <projeto>. Projetos: ${names.join(', ')}`,
    cv: 'Abrindo o currículo (PDF)…',
    emailCopied: (email) => `E-mail copiado: ${email}`,
    emailManual: (email) => `Não foi possível copiar. E-mail: ${email}`,
    themeDone: { light: 'Tema claro ativado.', dark: 'Tema escuro ativado.' },
    themeUsage: 'Uso: theme [light|dark]',
    langDone: 'Idioma: português.',
    langUsage: 'Uso: lang [pt|en]',
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

// Linha com link: se o navegador barrar a nova aba, o destino continua a um clique.
function addLink(text, href, newTab) {
  const link = el('a', 'terminal__link', text);
  link.href = href;
  if (newTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  const line = el('p', 'terminal__line terminal__line--response');
  line.append(link);
  output.append(line);
  output.scrollTop = output.scrollHeight;
}

function processCommand(cmd) {
  const lang = getLang();
  const dict = commands[lang];
  const [name, ...rest] = cmd.split(/\s+/);

  addLine(`→ ${cmd}`, 'command');

  // hasOwn evita que "constructor" ou "__proto__" sejam tratados como comandos.
  if (!Object.hasOwn(dict, name)) {
    addLine(messages[lang].notFound(name), 'error');
    return;
  }

  const response = dict[name];
  if (response === CLEAR) {
    output.replaceChildren();
  } else if (response === EXIT) {
    closeTerminal();
  } else if (typeof response === 'function') {
    response(rest.join(' '), messages[lang]);
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
 * Autocompletar do Tab (comando ou argumento de open/theme/lang): devolve true só quando agiu
 * (completou ou listou opções). Sem prefixo, sem correspondência ou já completo, o Tab segue o foco.
 */
function complete() {
  const value = input.value.toLowerCase();
  let base = '';
  let prefix = value;
  let options = Object.keys(commands[getLang()]);
  const withArg = /^(\S+) (\S*)$/.exec(value);
  if (withArg) {
    if (!Object.hasOwn(ARGS, withArg[1])) return false;
    base = `${withArg[1]} `;
    [, , prefix] = withArg;
    options = ARGS[withArg[1]];
  } else if (!value || /\s/.test(value)) {
    return false;
  }

  const names = options.filter((name) => name.startsWith(prefix));
  if (!names.length) return false;
  if (names.length === 1) {
    // Comando que pede argumento ganha o espaço, como no bash: o próximo Tab lista as opções.
    const done = base + names[0] + (!base && Object.hasOwn(ARGS, names[0]) ? ' ' : '');
    if (done === value) return false;
    input.value = done;
    return true;
  }
  const common = commonPrefix(names);
  if (common.length > prefix.length) {
    input.value = base + common;
    return true;
  }
  const list = names.join('  ');
  if (output.lastElementChild?.textContent !== list) addLine(list, 'system');
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

function updateLabels() {
  const text = messages[getLang()];
  title.textContent = text.title;
  input.setAttribute('aria-label', text.input);
  output.setAttribute('aria-label', text.output);
  closeBtn.setAttribute('aria-label', text.close);
}

function openTerminal() {
  if (!dialog) createTerminal();
  updateLabels();
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
