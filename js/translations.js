// Dicionários de tradução — módulo puro (sem window, document ou localStorage),
// importado pelo navegador (i18n.js) e pelo verificador em Node (scripts/check-i18n.mjs).
// O HTML estático contém o texto em PT-BR: o dicionário 'pt-br' deve ser idêntico a ele.

export const translations = {
  en: {
    // Meta
    'meta.title': 'Pedro Braga | Portfolio',
    'meta.description':
      'Pedro Braga — Java backend developer, Spring and PostgreSQL. Software Engineering student at UCB and development intern at CAESB.',

    // Navegação
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certifications': 'Courses',
    'nav.contact': 'Contact',
    'nav.theme.toLight': 'Switch to light theme',
    'nav.theme.toDark': 'Switch to dark theme',
    'nav.lang.label': 'PT-BR: view the site in Portuguese',
    'nav.menu.label': 'Open menu',

    // Hero
    'hero.status': 'Open to junior roles · Brasília, Brazil · hybrid or remote',
    'hero.greeting': "Hello, I'm",
    'hero.role': 'Java Backend Developer',
    'hero.description':
      'I build REST APIs with Java, Spring and PostgreSQL. Development intern at CAESB and Software Engineering student at UCB, expected to graduate in late 2027.',
    'hero.proof': 'maintainer · 111 of my PRs merged · team of 10 students',
    'hero.btn.projects': 'View Projects',
    'hero.btn.contact': 'Get in touch',
    'hero.btn.cv': 'Resume (PDF, in Portuguese)',
    'hero.scroll.label': 'Scroll down',

    // Sobre
    'about.title': 'About',
    'about.subtitle': 'Who am I',
    'about.img.alt': 'Photo of Pedro Braga',
    'about.description':
      'Software Engineering student at Universidade Católica de Brasília, with hands-on experience in developing and maintaining web systems. Currently a development intern at CAESB, working on improving applications with Java, JavaScript, React, XHTML, and Azure services. My main focus is Java backend development with Spring and PostgreSQL, complemented by web development and data analysis projects.',
    'about.location.title': 'Location',
    'about.location.desc': 'Brasília, Brazil · hybrid or remote',
    'about.internship.title': 'Internship',
    'about.internship.desc': 'CAESB — IT',
    'about.degree.title': 'Degree',
    'about.degree.desc': 'Software Eng. — UCB',
    'about.degree.note': 'Expected graduation: late 2027',
    'about.availability.title': 'Availability',
    'about.availability.desc': 'Open to junior roles',
    'about.proofs.title': 'Proof in the code',
    'about.proofs.prs': 'of my PRs merged in SocialTech',
    'about.proofs.adrs': 'ADRs documenting Carteira API',
    'about.proofs.concurrency.value': 'Concurrency',
    'about.proofs.concurrency': 'simultaneous transfers tested, no deadlocks',
    'about.proofs.ci': 'tests and Docker image on every PR',
    'about.btn.contact': 'Get in touch',

    // Linha do tempo
    'timeline.title': 'Experience',
    'timeline.subtitle': "Where I've been",
    'timeline.item1.date': '2025 — Present',
    'timeline.item1.title': 'IT Intern — CAESB',
    'timeline.item1.desc':
      'Development and maintenance of full-stack applications using Java, JavaScript, React, XHTML, and Azure services.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Video Editor — Freelancer',
    'timeline.item2.desc':
      'Responsible for editing audiovisual content and directly interfacing with clients to align requirements and ensure the quality of the final product.',
    'timeline.item3.date': '2024',
    'timeline.item3.title': 'Intern — CredSolaris',
    'timeline.item3.desc':
      'Optimizing workflows through process automation. Technical support and specialized customer service.',
    'timeline.item4.date': '2024',
    'timeline.item4.title': 'Young Apprentice — Solução Assessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Administrative assistant, customer service, and Excel spreadsheets.',

    // Projetos
    'projects.title': 'Projects',
    'projects.subtitle': "What I've built",
    'project1.title': 'Carteira API',
    'project1.description':
      'Personal Java backend project for a digital wallet: registration, JWT login, balance, deposits, transfers and cursor-paginated statements. ACID transactions, idempotent retries, modular architecture and concurrency tests.',
    'project3.title': 'Academic ERP',
    'project3.description':
      'Team university project for managing students, courses and enrollments. Contributions include course selection in enrollment and authentication updates with React and Firebase.',
    'project4.title': 'Multiplayer Minesweeper',
    'project4.description':
      'Team Operating Systems project: a terminal game written in C. Participation in a multiplayer implementation using POSIX threads and semaphores for concurrent execution.',
    'project5.badge': 'Completed · live',
    'project5.description':
      'Mobile-first educational website, reached through a QR Code on the UCB composting bin, that explains how to dispose of organic waste correctly. University outreach project with Enactus, with content editable without coding.',
    'project5.role': 'I was a maintainer — architecture, CI/CD, pull request reviews and accessibility.',
    'project5.metric.prs': 'merged PRs authored by me',
    'project5.metric.team': 'students on the team',
    'project5.metric.qr': 'on campus, site live',
    'project1.code.label': 'Code for Carteira API',
    'project3.code.label': 'Code for Academic ERP',
    'project4.code.label': 'Code for Multiplayer Minesweeper',
    'project5.code.label': 'Code for SocialTech',
    'project5.demo.label': 'Live SocialTech site',
    'project6.title': 'Weekly Dashboard',
    'project6.description':
      'Personal PWA for weekly habits, goals and tasks that I use every day: installs on the phone, works offline and needs no login. Data stays on the device with JSON backup, week-over-week history and an iPhone widget via Scriptable.',
    'project6.code.label': 'Code for Weekly Dashboard',
    'project6.demo.label': 'Live Weekly Dashboard site',
    'project.source': 'Code',
    'project.live': 'Live',
    // Habilidades
    'skills.title': 'Skills',
    'skills.subtitle': 'By area, with an honest level and a link to the proof',
    'skills.level.live': 'live',
    'skills.level.project': 'in a project',
    'skills.level.learning': 'learning',
    'skills.group.backend': 'Backend',
    'skills.group.frontend': 'Front-end',
    'skills.group.data': 'Data and other languages',
    'skills.group.devops': 'DevOps and tools',
    'skill.java.evidence': 'Carteira API: JWT, ACID transactions and idempotent retries',
    'skill.postgres.evidence': 'Versioned migrations, constraints and pessimistic locking',
    'skill.tests.name': 'JUnit · integration tests',
    'skill.tests.evidence': 'Concurrency, atomicity and architecture rules under test',
    'skill.astro.evidence': 'SocialTech: live site, reached via QR code',
    'skill.web.evidence': 'This portfolio: bilingual, accessible, no frameworks',
    'skill.react.evidence': 'Academic ERP with authentication, students and courses',
    'skill.python.evidence': 'Exploratory analysis of credit default, with tests',
    'skill.c.evidence': 'Multiplayer Minesweeper with threads and semaphores',
    'skill.docker.evidence': 'API image with PostgreSQL and a smoke test in CI',
    'skill.actions.evidence': "This site's CI: lint, HTML, i18n, Playwright and Lighthouse",
    'skill.git.evidence': 'Issue → branch → PR flow with review and required CI',
    // Certificações
    'certs.title': 'Courses',
    'certs.subtitle': 'Complementary training, separate from professional certifications',
    'cert1.name': 'Java Programming',
    'cert1.issuer': 'Udemy',
    'cert3.name': 'TypeScript and JavaScript',
    'cert3.issuer': 'Udemy',
    'cert4.name': 'React Development',
    'cert4.issuer': 'Udemy',

    // GitHub
    'github.title': 'Repositories',
    'github.subtitle': 'Public projects with repository details from GitHub',
    'github.loading': 'Loading repositories…',
    'github.viewprofile': 'View Full Profile',
    'github.error': 'Could not load repositories. Visit my GitHub profile.',

    // Contato
    'contact.title': 'Contact',
    'contact.subtitle': "Let's talk",
    'contact.lead': 'Email is the fastest way to reach me.',
    'contact.copy': 'Copy email',
    'contact.copy.done': 'Email copied to the clipboard.',
    'contact.copy.manual': 'Could not copy automatically: the email is selected, press Ctrl+C.',
    'contact.where': 'Brasília, Brazil · hybrid or remote',
    'contact.cv': 'Resume (PDF, PT-BR)',

    // Rodapé
    'footer.made': 'handmade, no frameworks',
    'footer.source': 'source code',
    'footer.updated': 'updated',
    'footer.top.label': 'Back to top',
  },

  'pt-br': {
    // Meta
    'meta.title': 'Pedro Braga | Portfólio',
    'meta.description':
      'Pedro Braga — Desenvolvedor backend Java, Spring e PostgreSQL. Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB.',

    // Navegação
    'nav.about': 'Sobre',
    'nav.experience': 'Experiência',
    'nav.projects': 'Projetos',
    'nav.skills': 'Competências',
    'nav.certifications': 'Cursos',
    'nav.contact': 'Contato',
    'nav.theme.toLight': 'Ativar o tema claro',
    'nav.theme.toDark': 'Ativar o tema escuro',
    'nav.lang.label': 'EN: ver o site em inglês',
    'nav.menu.label': 'Abrir menu',

    // Hero
    'hero.status': 'Disponível para vagas júnior · Brasília · híbrido ou remoto',
    'hero.greeting': 'Olá, me chamo',
    'hero.role': 'Desenvolvedor Backend Java',
    'hero.description':
      'Construo APIs REST com Java, Spring e PostgreSQL. Estagiário de desenvolvimento na CAESB e estudante de Engenharia de Software na UCB, com formatura prevista para 2027/2.',
    'hero.proof': 'mantenedor · 111 PRs meus mergeados · time de 10 estudantes',
    'hero.btn.projects': 'Ver Projetos',
    'hero.btn.contact': 'Entrar em contato',
    'hero.btn.cv': 'Currículo (PDF)',
    'hero.scroll.label': 'Rolar para baixo',

    // Sobre
    'about.title': 'Sobre',
    'about.subtitle': 'Quem sou eu',
    'about.img.alt': 'Foto de Pedro Braga',
    'about.description':
      'Estudante de Engenharia de Software na Universidade Católica de Brasília, com experiência prática em desenvolvimento e manutenção de sistemas web. Atualmente estagiário de desenvolvimento na CAESB, atuando na melhoria de aplicações com Java, JavaScript, React, XHTML e serviços na Azure. Meu foco principal é backend Java com Spring e PostgreSQL, complementado por projetos web e de análise de dados.',
    'about.location.title': 'Localização',
    'about.location.desc': 'Brasília, DF · híbrido ou remoto',
    'about.internship.title': 'Estágio',
    'about.internship.desc': 'CAESB — TI',
    'about.degree.title': 'Graduação',
    'about.degree.desc': 'Eng. de Software — UCB',
    'about.degree.note': 'Conclusão prevista: 2º sem. de 2027',
    'about.availability.title': 'Disponibilidade',
    'about.availability.desc': 'Aberto a vagas júnior',
    'about.proofs.title': 'Provas no código',
    'about.proofs.prs': 'PRs meus mergeados no SocialTech',
    'about.proofs.adrs': 'ADRs documentando a Carteira API',
    'about.proofs.concurrency.value': 'Concorrência',
    'about.proofs.concurrency': 'transferências simultâneas testadas, sem deadlock',
    'about.proofs.ci': 'testes e imagem Docker a cada PR',
    'about.btn.contact': 'Entre em contato',

    // Linha do tempo
    'timeline.title': 'Experiência',
    'timeline.subtitle': 'Por onde passei',
    'timeline.item1.date': '2025 — Presente',
    'timeline.item1.title': 'Estagiário de TI — CAESB',
    'timeline.item1.desc':
      'Desenvolvimento e manutenção de aplicações full stack com Java, JavaScript, React, XHTML e serviços Azure.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Editor de Vídeo — Freelancer',
    'timeline.item2.desc':
      'Responsável pela edição de conteúdo audiovisual e interface direta com clientes para alinhamento de requisitos e garantia de qualidade do produto final.',
    'timeline.item3.date': '2024',
    'timeline.item3.title': 'Estagiário — CredSolaris',
    'timeline.item3.desc':
      'Otimização de fluxos de trabalho através da automação de processos. Suporte técnico e atendimento especializado ao cliente.',
    'timeline.item4.date': '2024',
    'timeline.item4.title': 'Jovem Aprendiz — Solução Assessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Assistente administrativo, atendimento ao público e planilhas Excel.',

    // Projetos
    'projects.title': 'Projetos',
    'projects.subtitle': 'O que já construí',
    'project1.title': 'Carteira API',
    'project1.description':
      'Projeto pessoal de backend Java para carteira digital: cadastro, login JWT, saldo, depósitos, transferências e extrato paginado por cursor. Transações ACID, reenvio idempotente, arquitetura modular e testes de concorrência.',
    'project3.title': 'ERP Acadêmico',
    'project3.description':
      'Projeto universitário em equipe para gestão de alunos, cursos e matrículas. Contribuições incluem seleção de curso na matrícula e ajustes de autenticação com React e Firebase.',
    'project4.title': 'Campo Minado Multiplayer',
    'project4.description':
      'Projeto em equipe de Sistemas Operacionais: jogo no terminal em C. Participação na implementação multiplayer com threads e semáforos POSIX para execução concorrente.',
    'project5.badge': 'Concluído · no ar',
    'project5.description':
      'Site educativo mobile-first, acessado por QR Code na lixeira de compostagem da UCB, que orienta o descarte correto de resíduos orgânicos. Projeto de extensão UCB + Enactus, com conteúdo editável sem programar.',
    'project5.role': 'Fui mantenedor — arquitetura, CI/CD, revisão de PRs e acessibilidade.',
    'project5.metric.prs': 'PRs meus mergeados',
    'project5.metric.team': 'estudantes no time',
    'project5.metric.qr': 'no campus, site no ar',
    'project1.code.label': 'Código da Carteira API',
    'project3.code.label': 'Código do ERP Acadêmico',
    'project4.code.label': 'Código do Campo Minado Multiplayer',
    'project5.code.label': 'Código do SocialTech',
    'project5.demo.label': 'Site do SocialTech no ar',
    'project6.title': 'Painel Semanal',
    'project6.description':
      'PWA pessoal de hábitos, metas e tarefas da semana que uso no dia a dia: instala no celular, funciona offline e não pede login. Dados no próprio aparelho com backup em JSON, histórico entre semanas e widget de iPhone via Scriptable.',
    'project6.code.label': 'Código do Painel Semanal',
    'project6.demo.label': 'Site do Painel Semanal no ar',
    'project.source': 'Código',
    'project.live': 'Site',
    // Habilidades
    'skills.title': 'Competências',
    'skills.subtitle': 'Por área, com nível honesto e link para a prova',
    'skills.level.live': 'no ar',
    'skills.level.project': 'em projeto',
    'skills.level.learning': 'estudando',
    'skills.group.backend': 'Backend',
    'skills.group.frontend': 'Front-end',
    'skills.group.data': 'Dados e outras linguagens',
    'skills.group.devops': 'DevOps e ferramentas',
    'skill.java.evidence': 'Carteira API: JWT, transações ACID e reenvio idempotente',
    'skill.postgres.evidence': 'Migrations versionadas, constraints e bloqueio pessimista',
    'skill.tests.name': 'JUnit · testes de integração',
    'skill.tests.evidence': 'Concorrência, atomicidade e regras de arquitetura sob teste',
    'skill.astro.evidence': 'SocialTech: site no ar, acessado por QR Code',
    'skill.web.evidence': 'Este portfólio: bilíngue, acessível e sem frameworks',
    'skill.react.evidence': 'ERP acadêmico com autenticação e cadastro de alunos e cursos',
    'skill.python.evidence': 'Análise exploratória de inadimplência de crédito, com testes',
    'skill.c.evidence': 'Campo Minado multiplayer com threads e semáforos',
    'skill.docker.evidence': 'Imagem da API com PostgreSQL e teste de fumaça na CI',
    'skill.actions.evidence': 'CI deste site: lint, HTML, i18n, Playwright e Lighthouse',
    'skill.git.evidence': 'Fluxo issue → branch → PR com revisão e CI obrigatória',
    // Certificações
    'certs.title': 'Cursos',
    'certs.subtitle': 'Formação complementar, separada de certificações profissionais',
    'cert1.name': 'Programação Java',
    'cert1.issuer': 'Udemy',
    'cert3.name': 'TypeScript e JavaScript',
    'cert3.issuer': 'Udemy',
    'cert4.name': 'Desenvolvimento React',
    'cert4.issuer': 'Udemy',

    // GitHub
    'github.title': 'Repositórios',
    'github.subtitle': 'Projetos públicos com informações atualizadas pelo GitHub',
    'github.loading': 'Carregando repositórios…',
    'github.viewprofile': 'Ver Perfil Completo',
    'github.error': 'Não foi possível carregar repositórios. Visite meu perfil no GitHub.',

    // Contato
    'contact.title': 'Contato',
    'contact.subtitle': 'Vamos conversar',
    'contact.lead': 'O jeito mais rápido de falar comigo é por e-mail.',
    'contact.copy': 'Copiar e-mail',
    'contact.copy.done': 'E-mail copiado para a área de transferência.',
    'contact.copy.manual': 'Não deu para copiar sozinho: o e-mail está selecionado, use Ctrl+C.',
    'contact.where': 'Brasília, DF · híbrido ou remoto',
    'contact.cv': 'Currículo (PDF)',

    // Rodapé
    'footer.made': 'feito à mão, sem frameworks',
    'footer.source': 'código-fonte',
    'footer.updated': 'atualizado em',
    'footer.top.label': 'Voltar ao topo',
  },
};

// Únicas chaves cujo valor pode conter marcação HTML (aplicadas com innerHTML) — hoje, nenhuma.
// As demais são aplicadas com textContent e não podem conter "<" nem entidades "&".
export const HTML_KEYS = Object.freeze([]);
