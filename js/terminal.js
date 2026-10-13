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
      contact: 'Email: Pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
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
      contact: 'Email: Pbl0812@gmail.com\nGitHub: github.com/Blima-P\nLinkedIn: Pedro Braga de Lima',
      github: 'Confira meus repos → https://github.com/Blima-P',
      secret: '🎮 Konami Code? Não, você achou o terminal! Você é um dev de verdade. 🚀',
      clear: '__CLEAR__',
      exit: '__EXIT__',
    }
  };

  function createTerminal() {
    overlay = document.createElement('div');
    overlay.className = 'terminal-overlay';
    overlay.innerHTML = `
      <div class="terminal">
        <div class="terminal__header">
          <span class="terminal__dot terminal__dot--red"></span>
          <span class="terminal__dot terminal__dot--yellow"></span>
          <span class="terminal__dot terminal__dot--green"></span>
          <span class="terminal__title">pbl@portfolio:~$</span>
          <button class="terminal__close" aria-label="Close">✕</button>
        </div>
        <div class="terminal__body" id="terminal-output">
          <p class="terminal__line terminal__line--system">Type "help" for available commands.</p>
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
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    const dict = commands[lang] || commands.en;

    addLine(`→ ${cmd}`, 'command');

    const response = dict[cmd];
    if (!response) {
      addLine(`Command not found: "${cmd}". Type "help" for available commands.`, 'error');
      return;
    }

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
