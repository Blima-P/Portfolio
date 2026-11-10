// Dicionários de tradução — módulo puro (sem window, document ou localStorage),
// importado pelo navegador (i18n.js) e pelo verificador em Node (scripts/check-i18n.mjs).
// O HTML estático contém o texto em PT-BR: o dicionário 'pt-br' deve ser idêntico a ele.

export const translations = {
  en: {
    // Meta
    'meta.title': 'Pedro Braga | Portfolio',
    'meta.description': 'Pedro Braga — Java backend developer, Spring and PostgreSQL. Software Engineering student at UCB and development intern at CAESB.',

    // Navegação
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certifications': 'Courses',
    'nav.contact': 'Contact',
    'nav.theme.label': 'Toggle theme',
    'nav.menu.label': 'Open menu',

    // Hero
    'hero.greeting': 'Hello, I\'m',
    'hero.iam': 'I am',
    'hero.description': 'Software Engineering student at UCB and development intern at CAESB. Focused on Java backend development with Spring and PostgreSQL, looking for junior software development opportunities.',
    'hero.btn.projects': 'View Projects',
    'hero.btn.contact': 'Get in touch',
    'hero.btn.cv': 'Resume (PDF, in Portuguese)',
    'hero.scroll.label': 'Scroll down',

    // Sobre
    'about.title': 'About <span>Me</span>',
    'about.subtitle': 'Who am I',
    'about.img.alt': 'Photo of Pedro Braga',
    'about.description': 'Software Engineering student at Universidade Católica de Brasília, with hands-on experience in developing and maintaining web systems. Currently a development intern at CAESB, working on improving applications with Java, JavaScript, React, XHTML, and Azure services. My main focus is Java backend development with Spring and PostgreSQL, complemented by web development and data analysis projects.',
    'about.location.title': 'Location',
    'about.location.desc': 'Brasília, DF',
    'about.internship.title': 'Internship',
    'about.internship.desc': 'CAESB — IT',
    'about.degree.title': 'Degree',
    'about.degree.desc': 'Software Eng. — UCB',
    'about.availability.title': 'Availability',
    'about.availability.desc': 'Open to opportunities',
    'about.btn.contact': 'Get in touch',
    'counter.projects': 'Featured Projects',
    'counter.technologies': 'Skill Areas',
    'counter.years': 'Years Coding',

    // Linha do tempo
    'timeline.title': 'My <span>Journey</span>',
    'timeline.subtitle': 'Where I\'ve been',
    'timeline.item1.date': '2025 — Present',
    'timeline.item1.title': 'IT Intern — CAESB',
    'timeline.item1.desc': 'Development and maintenance of full-stack applications using Java, JavaScript, React, XHTML, and Azure services.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Video Editor — Freelancer',
    'timeline.item2.desc': 'Responsible for editing audiovisual content and directly interfacing with clients to align requirements and ensure the quality of the final product.',
    'timeline.item3.date': '2024',
    'timeline.item3.title': 'Intern — CredSolaris',
    'timeline.item3.desc': 'Optimizing workflows through process automation. Technical support and specialized customer service.',
    'timeline.item4.date': '2024',
    'timeline.item4.title': 'Young Apprentice — Solução Assessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Administrative assistant, customer service, and Excel spreadsheets.',

    // Projetos
    'projects.title': 'My <span>Projects</span>',
    'projects.subtitle': 'What I\'ve built',
    'project1.title': 'Carteira API',
    'project1.description': 'Personal Java backend project for a digital wallet: registration, JWT login, balance, deposits, transfers and cursor-paginated statements. ACID transactions, idempotent retries, modular architecture and concurrency tests.',
    'project1.code.label': 'View Carteira API source code',
    'project2.title': 'Personal Portfolio',
    'project2.description': 'Responsive landing page with dark mode, Canvas animations, typing effect, and scroll-spy. Built from scratch with HTML, CSS, and vanilla JavaScript.',
    'project2.code.label': 'View portfolio source code',
    'project2.demo.label': 'View live demo',
    'project3.title': 'Academic ERP',
    'project3.description': 'Team university project for managing students, courses and enrollments. Contributions include course selection in enrollment and authentication updates with React and Firebase.',
    'project4.title': 'Multiplayer Minesweeper',
    'project4.description': 'Team Operating Systems project: a terminal game written in C. Participation in a multiplayer implementation using POSIX threads and semaphores for concurrent execution.',
    'project.source': 'Code',
    'filter.all': 'All',
    'filter.web': 'Web',
    'filter.backend': 'Backend',
    'filter.systems': 'Systems',

    // Habilidades
    'skills.title': 'My <span>Skills</span>',
    'skills.subtitle': 'Practical examples from my projects',
    'skill1.evidence': 'REST API with JWT authentication, deposits and atomic transfers.',
    'skill2.evidence': 'Versioned migrations, financial constraints and pessimistic locking.',
    'skill3.evidence': 'Academic ERP with authentication and student, course and enrollment screens.',
    'skill4.evidence': 'Responsive bilingual portfolio with themes and GitHub API integration.',
    'skill5.evidence': 'Data analysis projects and initial exploration of credit default data.',
    'skill6.evidence': 'Pull requests, automated builds, architecture checks and integration tests.',

    // Certificações
    'certs.title': 'Courses &amp; <span>Learning</span>',
    'certs.subtitle': 'Complementary training, separate from professional certifications',
    'cert1.name': 'Java Programming',
    'cert1.issuer': 'Udemy',
    'cert3.name': 'TypeScript and JavaScript',
    'cert3.issuer': 'Udemy',
    'cert4.name': 'React Development',
    'cert4.issuer': 'Udemy',

    // GitHub
    'github.title': 'Selected <span>Repositories</span>',
    'github.subtitle': 'Public projects with repository details from GitHub',
    'github.loading': 'Loading repositories…',
    'github.viewprofile': 'View Full Profile',
    'github.error': 'Could not load repositories. Visit my GitHub profile.',

    // Contato
    'contact.title': 'Get in <span>Touch</span>',
    'contact.subtitle': 'Let\'s talk',
    'contact.email': 'Email',

    // Rodapé
    'footer.text': 'Built by <span>Pedro Braga</span> with HTML, CSS, and vanilla JavaScript.',
    'footer.top.label': 'Back to top',
  },

  'pt-br': {
    // Meta
    'meta.title': 'Pedro Braga | Portfólio',
    'meta.description': 'Pedro Braga — Desenvolvedor backend Java, Spring e PostgreSQL. Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB.',

    // Navegação
    'nav.about': 'Sobre',
    'nav.experience': 'Experiência',
    'nav.projects': 'Projetos',
    'nav.skills': 'Skills',
    'nav.certifications': 'Cursos',
    'nav.contact': 'Contato',
    'nav.theme.label': 'Alternar tema',
    'nav.menu.label': 'Abrir menu',

    // Hero
    'hero.greeting': 'Olá, me chamo',
    'hero.iam': 'Eu sou',
    'hero.description': 'Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL, buscando oportunidades como desenvolvedor de software júnior.',
    'hero.btn.projects': 'Ver Projetos',
    'hero.btn.contact': 'Entrar em contato',
    'hero.btn.cv': 'Currículo (PDF)',
    'hero.scroll.label': 'Rolar para baixo',

    // Sobre
    'about.title': 'Sobre <span>Mim</span>',
    'about.subtitle': 'Quem sou eu',
    'about.img.alt': 'Foto de Pedro Braga',
    'about.description': 'Estudante de Engenharia de Software na Universidade Católica de Brasília, com experiência prática em desenvolvimento e manutenção de sistemas web. Atualmente estagiário de desenvolvimento na CAESB, atuando na melhoria de aplicações com Java, JavaScript, React, XHTML e serviços na Azure. Meu foco principal é backend Java com Spring e PostgreSQL, complementado por projetos web e de análise de dados.',
    'about.location.title': 'Localização',
    'about.location.desc': 'Brasília, DF',
    'about.internship.title': 'Estágio',
    'about.internship.desc': 'CAESB — TI',
    'about.degree.title': 'Graduação',
    'about.degree.desc': 'Eng. de Software — UCB',
    'about.availability.title': 'Disponibilidade',
    'about.availability.desc': 'Aberto a oportunidades',
    'about.btn.contact': 'Entre em contato',
    'counter.projects': 'Projetos em destaque',
    'counter.technologies': 'Áreas de prática',
    'counter.years': 'Anos programando',

    // Linha do tempo
    'timeline.title': 'Minha <span>Jornada</span>',
    'timeline.subtitle': 'Por onde passei',
    'timeline.item1.date': '2025 — Presente',
    'timeline.item1.title': 'Estagiário de TI — CAESB',
    'timeline.item1.desc': 'Desenvolvimento e manutenção de aplicações full stack com Java, JavaScript, React, XHTML e serviços Azure.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Editor de Vídeo — Freelancer',
    'timeline.item2.desc': 'Responsável pela edição de conteúdo audiovisual e interface direta com clientes para alinhamento de requisitos e garantia de qualidade do produto final.',
    'timeline.item3.date': '2024',
    'timeline.item3.title': 'Estagiário — CredSolaris',
    'timeline.item3.desc': 'Otimização de fluxos de trabalho através da automação de processos. Suporte técnico e atendimento especializado ao cliente.',
    'timeline.item4.date': '2024',
    'timeline.item4.title': 'Jovem Aprendiz — Solução Assessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Assistente administrativo, atendimento ao público e planilhas Excel.',

    // Projetos
    'projects.title': 'Meus <span>Projetos</span>',
    'projects.subtitle': 'O que já construí',
    'project1.title': 'Carteira API',
    'project1.description': 'Projeto pessoal de backend Java para carteira digital: cadastro, login JWT, saldo, depósitos, transferências e extrato paginado por cursor. Transações ACID, reenvio idempotente, arquitetura modular e testes de concorrência.',
    'project1.code.label': 'Ver código da Carteira API',
    'project2.title': 'Portfólio Pessoal',
    'project2.description': 'Landing page responsiva com dark mode, animações em Canvas, efeito typing e scroll-spy. Desenvolvido do zero com HTML, CSS e JavaScript puro.',
    'project2.code.label': 'Ver código do portfólio',
    'project2.demo.label': 'Ver demo ao vivo',
    'project3.title': 'ERP Acadêmico',
    'project3.description': 'Projeto universitário em equipe para gestão de alunos, cursos e matrículas. Contribuições incluem seleção de curso na matrícula e ajustes de autenticação com React e Firebase.',
    'project4.title': 'Campo Minado Multiplayer',
    'project4.description': 'Projeto em equipe de Sistemas Operacionais: jogo no terminal em C. Participação na implementação multiplayer com threads e semáforos POSIX para execução concorrente.',
    'project.source': 'Código',
    'filter.all': 'Todos',
    'filter.web': 'Web',
    'filter.backend': 'Backend',
    'filter.systems': 'Sistemas',

    // Habilidades
    'skills.title': 'Minhas <span>Skills</span>',
    'skills.subtitle': 'Exemplos práticos dos meus projetos',
    'skill1.evidence': 'API REST com autenticação JWT, depósitos e transferências atômicas.',
    'skill2.evidence': 'Migrations versionadas, constraints financeiras e bloqueio pessimista.',
    'skill3.evidence': 'ERP acadêmico com autenticação e telas de alunos, cursos e matrículas.',
    'skill4.evidence': 'Portfólio responsivo e bilíngue com temas e integração com a API do GitHub.',
    'skill5.evidence': 'Projetos de análise de dados e exploração inicial de dados de inadimplência.',
    'skill6.evidence': 'Pull requests, builds automatizados, verificações de arquitetura e testes de integração.',

    // Certificações
    'certs.title': 'Cursos e <span>Aprendizado</span>',
    'certs.subtitle': 'Formação complementar, separada de certificações profissionais',
    'cert1.name': 'Programação Java',
    'cert1.issuer': 'Udemy',
    'cert3.name': 'TypeScript e JavaScript',
    'cert3.issuer': 'Udemy',
    'cert4.name': 'Desenvolvimento React',
    'cert4.issuer': 'Udemy',

    // GitHub
    'github.title': 'Repositórios em <span>Destaque</span>',
    'github.subtitle': 'Projetos públicos com informações atualizadas pelo GitHub',
    'github.loading': 'Carregando repositórios…',
    'github.viewprofile': 'Ver Perfil Completo',
    'github.error': 'Não foi possível carregar repositórios. Visite meu perfil no GitHub.',

    // Contato
    'contact.title': 'Entre em <span>Contato</span>',
    'contact.subtitle': 'Vamos conversar',
    'contact.email': 'E-mail',

    // Rodapé
    'footer.text': 'Desenvolvido por <span>Pedro Braga</span> com HTML, CSS e JavaScript puro.',
    'footer.top.label': 'Voltar ao topo',
  },
};

// Únicas chaves cujo valor contém marcação HTML (aplicadas com innerHTML).
// As demais são aplicadas com textContent e não podem conter "<" nem entidades "&".
export const HTML_KEYS = Object.freeze([
  'about.title',
  'timeline.title',
  'projects.title',
  'skills.title',
  'certs.title',
  'github.title',
  'contact.title',
  'footer.text',
]);
