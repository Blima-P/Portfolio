/* ---- Terminal (Easter Egg) ---- */
(function () {
  let isOpen = false;
  let overlay, input, output;

  const commands = {
    en: {
      help: 'Available commands: about, skills, projects, contact, github, secret, clear, exit',
      about: 'Pedro Braga de Lima — Software Engineering student at UCB, development intern at CAESB. Focused on Java backend with Spring and PostgreSQL.',
      skills: 'Java • Spring • PostgreSQL • React • HTML/CSS • Python • pandas • Git • GitHub Actions',
      projects: '1. Carteira API — Java/Spring digital wallet\n2. Academic ERP — React/Firebase team project\n3. Multiplayer Minesweeper — C/POSIX\n4. Personal Portfolio — HTML/CSS/JavaScript',
      contact: 'Email: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
      github: 'Check out my repos → https://github.com/Blima-P',
      secret: '🎮 Konami Code? Nah, you found the terminal! You\'re a real dev. 🚀',
      clear: '__CLEAR__',
      exit: '__EXIT__',
    },
    'pt-br': {
      help: 'Comandos disponíveis: about, skills, projects, contact, github, secret, clear, exit',
      about: 'Pedro Braga de Lima — Estudante de Eng. de Software na UCB, estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL.',
      skills: 'Java • Spring • PostgreSQL • React • HTML/CSS • Python • pandas • Git • GitHub Actions',
      projects: '1. Carteira API — Carteira digital Java/Spring\n2. ERP Acadêmico — Projeto em equipe React/Firebase\n3. Campo Minado Multiplayer — C/POSIX\n4. Portfólio Pessoal — HTML/CSS/JavaScript',
      contact: 'E-mail: pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
      github: 'Confira meus repos → https://github.com/Blima-P',
      secret: '🎮 Konami Code? Não, você achou o terminal! Você é um dev de verdade. 🚀',
      clear: '__CLEAR__',
      exit: '__EXIT__',
    }
  };

  const messages = {
    en: {
      intro: 'Type "help" for available commands.',
      notFound: cmd => `Command not found: "${cmd}". Type "help" for available commands.`,
      close: 'Close terminal',
    },
    'pt-br': {
      intro: 'Digite "help" para ver os comandos disponíveis.',
      notFound: cmd => `Comando não encontrado: "${cmd}". Digite "help" para ver os comandos disponíveis.`,
      close: 'Fechar terminal',
    },
  };

  function getLang() {
    return (typeof currentLang !== 'undefined' && commands[currentLang]) ? currentLang : 'en';
  }

  function createTerminal() {
    const msg = messages[getLang()];
    overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    overlay.innerHTML = `
      <div class="terminal">
        <div class="terminal__header">
          <span class="terminal__dot terminal__dot--red"></span>
          <span class="terminal__dot terminal__dot--yellow"></span>
          <span class="terminal__dot terminal__dot--green"></span>
          <span class="terminal__title">pbl@portfolio:~$</span>
          <button type="button" class="terminal__close" aria-label="${msg.close}">✕</button>
        </div>
        <div class="terminal__body" id="terminal-output">
          <p class="terminal__line terminal__line--system">${msg.intro}</p>
        </div>
        <div class="terminal__input-line">
          <span class="terminal__prompt">→</span>
          <input type="text" class="terminal__input" id="terminal-input" autocomplete="off" spellcheck="false" />
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    output = overlay.querySelector('#terminal-output');
    input = overlay.querySelector('#terminal-input');

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (cmd) processCommand(cmd);
        input.value = '';
      }
    });

    overlay.querySelector('.terminal__close').addEventListener('click', closeTerminal);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeTerminal();
    });
  }

  function processCommand(cmd) {
    const lang = getLang();
    const dict = commands[lang];

    addLine(`→ ${cmd}`, 'command');

    // hasOwnProperty evita que "constructor" ou "__proto__" sejam tratados como comandos.
    if (!Object.prototype.hasOwnProperty.call(dict, cmd)) {
      addLine(messages[lang].notFound(cmd), 'error');
      return;
    }
    const response = dict[cmd];

    if (response === '__CLEAR__') {
      output.innerHTML = '';
      return;
    }

    if (response === '__EXIT__') {
      closeTerminal();
      return;
    }

    response.split('\n').forEach(line => addLine(line, 'response'));
  }

  function addLine(text, type) {
    const p = document.createElement('p');
    p.className = `terminal__line terminal__line--${type}`;
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  function openTerminal() {
    if (!overlay) createTerminal();
    overlay.querySelector('.terminal__close').setAttribute('aria-label', messages[getLang()].close);
    overlay.classList.add('terminal-overlay--open');
    isOpen = true;
    setTimeout(() => input.focus(), 100);
  }

  function closeTerminal() {
    if (overlay) overlay.classList.remove('terminal-overlay--open');
    isOpen = false;
  }

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      isOpen ? closeTerminal() : openTerminal();
    }
    if (e.key === 'Escape' && isOpen) closeTerminal();
  });
})();
