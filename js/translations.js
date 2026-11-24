// Dicionários de tradução — módulo puro (sem window, document ou localStorage),
// importado pelo navegador (i18n.js) e pelo verificador em Node (scripts/check-i18n.mjs).
// O HTML estático contém o texto em PT-BR: o dicionário 'pt-br' deve ser idêntico a ele.

export const translations = {
  en: {
    // Metadados por página (<html data-page>): page.<id>.title e page.<id>.description
    'page.home.title': 'Pedro Braga | Portfolio',
    'page.home.description':
      'Pedro Braga — Java backend developer, Spring and PostgreSQL. Software Engineering student at UCB and development intern at CAESB.',
    'page.carteira-api.title': 'Carteira API — case study | Pedro Braga',
    'page.carteira-api.description':
      'Carteira API case study: ACID transfers, idempotency, ordered pessimistic locking, cursor pagination and Spring Modulith, with concurrency tests and 7 ADRs.',
    'page.socialtech.title': 'SocialTech — case study | Pedro Braga',
    'page.socialtech.description':
      'SocialTech case study: a mobile-first site opened by the QR Code on the UCB compost bin. Static Astro site, progressive enhancement, content editable without code, CI with accessibility checks; 111 of my PRs merged.',
    'page.404.title': 'Page not found | Pedro Braga',
    'page.404.description':
      'This address does not exist in this portfolio. Go back to the home page or see the projects.',
    'notfound.eyebrow': 'Error 404',
    'notfound.title': 'Page not found',
    'notfound.lead': 'The address may have changed or been mistyped.',
    'notfound.error': 'No such file or directory',
    'notfound.hint': '# try one of these paths:',
    'notfound.home': 'Back to the home page',
    'notfound.projects': 'See the projects',

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
    'nav.menu.label': 'Menu',
    'nav.terminal.label': 'Open the terminal',
    'skip.main': 'Skip to content',

    // Hero
    'hero.status': 'Open to junior roles · Brasília, Brazil · hybrid or remote',
    'hero.greeting': "Hello, I'm",
    'hero.role': 'Java Backend Developer',
    'hero.description':
      'I build REST APIs with Java, Spring and PostgreSQL. Development intern at CAESB and Software Engineering student at UCB, expected to graduate in late 2027.',
    'hero.proof': 'maintainer · 111 of my PRs merged · team of 10 students',
    'hero.btn.projects': 'View Projects',
    'hero.btn.contact': 'Get in touch',
    'hero.btn.cv': 'Resume (PDF)',
    'cv.href': 'assets/cv/pedro-braga-cv-en.pdf',
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
    'project.case': 'Read the case study',
    'project1.case.label': 'Read the case study: Carteira API',
    'project5.case.label': 'Read the case study: SocialTech',
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
    'contact.cv': 'Resume (PDF)',

    // Rodapé
    'footer.made': 'handmade, no frameworks',
    'footer.source': 'source code',
    'footer.updated': 'updated',
    'footer.top.label': 'Back to top',

    // Estudos de caso (projetos/*.html)
    'case.back': 'Back to projects',
    'case.code': 'View the code',
    'case.section.context': 'Context',
    'case.section.problem': 'Problem',
    'case.section.decisions': 'Decisions',
    'case.section.architecture': 'Architecture',
    'case.section.proofs': 'Proof',
    'case.section.stack': 'Stack',
    'case.section.next': 'Limits and next steps',
    'case.section.role': 'My role',
    'case.section.delivery': 'From commit to QR Code',
    'case.live': 'See the live site',
    'case.carteira.eyebrow': 'Case study · personal project',
    'case.carteira.lead':
      'Digital wallet REST API in Java 21: sign-up and login with JWT, deposits, transfers between users and a statement. The goal is to show, with tests, the essential requirements of financial systems.',
    'case.carteira.adrs': 'Read the 7 ADRs',
    'case.carteira.metric.concurrency': 'simultaneous transfers in the test, balance never negative',
    'case.carteira.metric.idempotency': 'simultaneous retries with the same key, a single deposit',
    'case.carteira.metric.adrs': 'ADRs with context, pros and cons',
    'case.carteira.context':
      'Personal project: an API where users deposit, transfer balance to each other (the recipient is identified by e-mail) and check their balance and statement. The demo is educational and uses a fictitious balance; deployment to staging and production is simulated on GitHub Actions.',
    'case.carteira.problem.intro':
      'The transfer is the most sensitive operation in the system: it takes money out of one wallet and puts it into another. It must guarantee that:',
    'case.carteira.problem.atomic': 'the debit and the credit happen together or not at all;',
    'case.carteira.problem.concurrent': 'simultaneous transfers never spend more than the available balance;',
    'case.carteira.problem.deadlock':
      'crossed transfers at the same time (A→B and B→A) do not lock up the database;',
    'case.carteira.problem.retry':
      'a network failure that makes the client resend the request does not process the transfer twice.',
    'case.carteira.decision.transaction.title': 'A single database transaction',
    'case.carteira.decision.transaction.text':
      'Debit, credit and both ledger entries are written in the same transaction. The wallet operation only runs inside the caller’s transaction (Propagation.MANDATORY): any error rolls everything back.',
    'case.carteira.decision.lock.title': 'Pessimistic lock, always in the same order',
    'case.carteira.decision.lock.text':
      'Both wallets are locked with SELECT … FOR UPDATE, from the lowest to the highest id, whatever the direction of the transfer. Without this order, simultaneous A→B and B→A would block each other. The balance is checked with the wallet already locked.',
    'case.carteira.decision.idempotency.title': 'Idempotency that replays the receipt',
    'case.carteira.decision.idempotency.text':
      'Deposits and transfers require the Idempotency-Key header. The same key with the same data returns the original receipt without moving anything; with different data, 422; with two simultaneous requests, only one moves money; the other gets the receipt or 409.',
    'case.carteira.decision.cursor.title': 'Cursor-paginated statement',
    'case.carteira.decision.cursor.text':
      'Instead of a page number, the cursor says “continue after this entry”: new entries neither repeat nor skip items, and the database does not read and discard the previous pages as it does with OFFSET. The next page is detected by fetching one extra item, without COUNT.',
    'case.carteira.decision.modulith.title': 'Modular monolith with Spring Modulith',
    'case.carteira.decision.modulith.text':
      'Microservices would be overkill for the size of the project and would take the transfer out of a local transaction. Each module exposes only a public API and talks to the others through it or through events; inside it, hexagonal architecture with the domain in plain Java.',
    'case.carteira.decision.database.title': 'Critical rules in the database too',
    'case.carteira.decision.database.text':
      'Never-negative balance, positive amounts, a unique idempotency key and an insert-only ledger are enforced by PostgreSQL constraints and a trigger, not only by the application.',
    'case.carteira.diagram.title': 'Carteira API architecture',
    'case.carteira.diagram.desc':
      'The client calls the REST API with a JWT. Inside the modular monolith, the transacao module uses UsuarioApi to find the recipient and CarteiraApi, the only way to change a balance. The usuario module publishes the UsuarioCadastrado event, which creates the wallet in the same transaction as the sign-up. The compartilhado module handles security and RFC 9457 errors. All of them write to the same PostgreSQL, which enforces the critical rules with constraints and a trigger.',
    'case.carteira.diagram.client': 'Client',
    'case.carteira.diagram.monolith': 'modular monolith · Spring Modulith',
    'case.carteira.diagram.transacao': 'deposits, transfers and statement',
    'case.carteira.diagram.usuario': 'sign-up and login',
    'case.carteira.diagram.carteira': 'balance and ledger',
    'case.carteira.diagram.event': 'UsuarioCadastrado event',
    'case.carteira.diagram.shared': 'compartilhado: security (JWT) and RFC 9457 errors',
    'case.carteira.diagram.db': 'constraints and trigger',
    'case.carteira.diagram.caption':
      'Modules and dependencies. ArquiteturaTest fails the build if a module reaches into another, if there is a cycle between modules or if the domain depends on a framework.',
    'case.carteira.proofs.intro':
      'Each guarantee points to the code or test that proves it. Integration tests run against a real embedded PostgreSQL.',
    'case.carteira.proof.transfer':
      '15 transfers of R$ 10 at the same time with a balance of R$ 100: exactly 5 are refused and the balance never goes negative. Simultaneous crossed transfers prove there is no deadlock.',
    'case.carteira.proof.atomic':
      'Forces a failure on the recipient’s credit and proves the debit is rolled back too.',
    'case.carteira.proof.deposit':
      '8 simultaneous requests with the same Idempotency-Key: the deposit happens only once.',
    'case.carteira.proof.architecture':
      'The build fails if a module reaches into another, if there is a cycle between modules or if the domain depends on a framework.',
    'case.carteira.proof.coverage':
      'Coverage report generated on every build, with no badge showing a fixed number or an assumed percentage.',
    'case.carteira.proof.delivery':
      'The Docker image is built once, published to GHCR and promoted from staging to production with manual approval (deployment simulated on GitHub Actions).',
    'case.carteira.adrs.title': 'The 7 ADRs',
    'case.carteira.adr1': 'Modular monolith with hexagonal architecture',
    'case.carteira.adr2': 'Stateless authentication with JWT',
    'case.carteira.adr3': 'Balance changes: money, ledger and concurrency',
    'case.carteira.adr4': 'Transfers between wallets',
    'case.carteira.adr5': 'Idempotency that replays the original response',
    'case.carteira.adr6': 'Cursor-paginated statement',
    'case.carteira.adr7': 'Container delivery and simulated deployment',
    'case.carteira.next.intro': 'What was left out, recorded in the ADRs and in the repository roadmap:',
    'case.carteira.next.enumeration':
      'Looking up the recipient by e-mail reveals whether an e-mail is registered. In production, attempts would need to be rate limited or a transfer key, like Brazil’s Pix key, would be needed.',
    'case.carteira.next.session':
      'The JWT is valid for 1 hour and there is no refresh token or session revocation yet.',
    'case.carteira.next.keys': 'Idempotency keys are kept for auditing; they still need an expiry.',
    'case.carteira.next.observability':
      'Observability: metrics with Micrometer and Prometheus and logs with a correlation id.',
    'case.carteira.next.outbox': 'Notify the recipient of a transfer through a Spring Modulith event outbox.',
    'case.carteira.next.deploy':
      'Real cloud deployment: today it is simulated, and only the deployment step would change.',
    'case.socialtech.eyebrow': 'Case study · extension project (UCB + Enactus)',
    'case.socialtech.lead':
      'Mobile-first educational site, opened by the QR Code on the UCB compost bin, that shows what can and cannot be thrown away there. I was one of the two maintainers of a team of 10 students.',
    'case.socialtech.metric.prs': 'of my PRs merged, out of 131 in the repository',
    'case.socialtech.metric.team': 'students on the team, 2 of them maintainers',
    'case.socialtech.metric.a11y': 'in Lighthouse Accessibility, mobile mode, on the published site',
    'case.socialtech.context':
      'Extension project of the Catholic University of Brasília (Taguatinga campus) with Enactus UCB, in the second half of 2026. Organic waste thrown in the wrong place contaminates recyclables and adds to overcrowded landfills in the Federal District. The idea: whoever is standing at the bin scans the QR Code and finds out, on their phone, what can go in it.',
    'case.socialtech.problem.intro': 'The quality goals, in priority order, were:',
    'case.socialtech.problem.speed':
      'whoever scans the QR decides “yes or no” within 10 seconds, on a phone with 4G;',
    'case.socialtech.problem.a11y': 'accessible (WCAG 2.1 AA) and usable with one hand at 360 px;',
    'case.socialtech.problem.privacy': 'no personal data collected;',
    'case.socialtech.problem.editing':
      'the coordinating professor edits the content alone, without programming and without breaking the site;',
    'case.socialtech.problem.review': 'code simple enough for students to review AI-generated code.',
    'case.socialtech.role.intro':
      'Of the 10 students, 4 had access to GitHub. I was one of the two maintainers and took care of:',
    'case.socialtech.role.architecture':
      'architecture and its decision records (ADRs), following Spec-Driven Development;',
    'case.socialtech.role.ci': 'CI/CD: checks on every PR and deploy to GitHub Pages on every push to main;',
    'case.socialtech.role.review':
      'PR review as code owner: every PR to develop needs a maintainer’s approval, and whoever pushed last cannot approve;',
    'case.socialtech.role.a11y':
      'accessibility: WCAG 2.1 AA as a goal, accessibility rules in ESLint and browser tests.',
    'case.socialtech.decision.static.title': 'Astro and TypeScript, 100% static',
    'case.socialtech.decision.static.text':
      'HTML and CSS generated at build time and published on GitHub Pages: no server, database or API. Astro ships zero JavaScript by default, and strict TypeScript helps review AI-generated code.',
    'case.socialtech.decision.progressive.title': 'Progressive enhancement',
    'case.socialtech.decision.progressive.text':
      'The HTML carries all the content; component scripts only add search, the step-by-step cycle and the quiz. Without JavaScript, the guide still shows in full. Scripts never use innerHTML.',
    'case.socialtech.decision.single.title': 'A single page',
    'case.socialtech.decision.single.text':
      'Each extra page would be another load on 4G, right when the person is standing at the bin. All sections live on one page, reached by anchors.',
    'case.socialtech.decision.cms.title': 'Content editable without code',
    'case.socialtech.decision.cms.text':
      'The professor edits through Pages CMS, and each “Save” becomes a commit. The content lives in JSON validated by a zod schema: invalid data fails the build and the previous site stays live.',
    'case.socialtech.decision.privacy.title': 'Visit counting without cookies',
    'case.socialtech.decision.privacy.text':
      'GoatCounter, only in the production build, with no personal data. The QR address carries the campaign=lixeira parameter, which separates visits coming from the bin.',
    'case.socialtech.decision.font.title': 'No third parties beyond counting',
    'case.socialtech.decision.font.text':
      'Self-hosted Roboto (about 44 KB, Latin only) instead of Google Fonts. The Content-Security-Policy allows only the site itself and GoatCounter, without unsafe-inline.',
    'case.socialtech.diagram.title': 'SocialTech delivery flow',
    'case.socialtech.diagram.desc':
      'Students open PRs from feature branches. Every PR goes through CI (formatting, lint with accessibility rules, types, build, generated-site checks, browser tests and links) and needs a maintainer’s approval before reaching develop. A release takes develop to main with a merge commit. The professor edits the content in Pages CMS, which commits straight to main. Every push to main builds and publishes the site on GitHub Pages. The QR Code on the bin opens the site, and GoatCounter counts the visit without cookies.',
    'case.socialtech.diagram.team': 'team',
    'case.socialtech.diagram.cms': 'professor edits content',
    'case.socialtech.diagram.ci': 'CI + review',
    'case.socialtech.diagram.checks': 'lint, types, build, tests',
    'case.socialtech.diagram.approval': 'maintainer approval',
    'case.socialtech.diagram.direct': 'direct commit',
    'case.socialtech.diagram.site': 'live site',
    'case.socialtech.diagram.bin': 'on the compost bin',
    'case.socialtech.diagram.visits': 'visits, no cookies',
    'case.socialtech.diagram.caption':
      'Branches and publishing, as recorded in the architecture document. Only PRs from develop or fix/* can reach main.',
    'case.socialtech.proofs.intro': 'Each claim points to the file or record that proves it.',
    'case.socialtech.proof.prs': '111 of the 131 PRs merged in the repository are mine.',
    'case.socialtech.proof.ci':
      'On every PR: Prettier, ESLint with accessibility rules, astro check, build, generated-site checks, Playwright tests and broken links.',
    'case.socialtech.proof.checker':
      'Checks the generated site: home page under 350 KB, a single h1, alt on every image, internal paths under /SocialTech/ and GoatCounter as the only external script.',
    'case.socialtech.proof.e2e':
      'Playwright at 360 and 1366 px: search, cycle, quiz, theme, reduced motion, no JavaScript and the 404 page; the test fails if any interaction breaks the CSP.',
    'case.socialtech.proof.lighthouse':
      'Three Lighthouse runs, mobile mode, on the published site: Performance 99 to 100; Accessibility, Best Practices and SEO 100; LCP 1.5 to 1.9 s; 279 KiB transferred.',
    'case.socialtech.proof.sdd':
      'Constitution, specification, clarifications, task plan and review, consolidated after the MVP.',
    'case.socialtech.next.intro':
      'What is still open, as recorded in the architecture document and the homologation log:',
    'case.socialtech.next.goals':
      'Usage goals (visits through the QR, form answers) do not yet have consolidated evidence in the homologation log.',
    'case.socialtech.next.manual': 'Screen reader and real-phone tests are still manual.',
    'case.socialtech.next.lighthouse':
      'Lighthouse does not run in CI; in its place, CI enforces the 350 KB budget and checks h1 and alt.',
    'case.socialtech.next.cms':
      'CMS edits go straight to main without review, so develop has to receive them before each release.',
    'case.socialtech.next.qr':
      'The QR Code is static: renaming the repository or changing the domain means reprinting the sticker.',
    'case.socialtech.next.adblock': 'Ad blockers can stop GoatCounter, so the visit count is a minimum.',
  },

  'pt-br': {
    // Metadados por página (<html data-page>): page.<id>.title e page.<id>.description
    'page.home.title': 'Pedro Braga | Portfólio',
    'page.home.description':
      'Pedro Braga — Desenvolvedor backend Java, Spring e PostgreSQL. Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB.',
    'page.carteira-api.title': 'Carteira API — estudo de caso | Pedro Braga',
    'page.carteira-api.description':
      'Estudo de caso da Carteira API: transferências ACID, idempotência, lock pessimista ordenado, paginação por cursor e Spring Modulith, com testes de concorrência e 7 ADRs.',
    'page.socialtech.title': 'SocialTech — estudo de caso | Pedro Braga',
    'page.socialtech.description':
      'Estudo de caso do SocialTech: site mobile-first aberto pelo QR Code da lixeira de compostagem da UCB. Astro estático, aprimoramento progressivo, conteúdo editável sem programar e CI com acessibilidade; 111 PRs meus mergeados.',
    'page.404.title': 'Página não encontrada | Pedro Braga',
    'page.404.description': 'O endereço não existe neste portfólio. Volte ao início ou veja os projetos.',
    'notfound.eyebrow': 'Erro 404',
    'notfound.title': 'Página não encontrada',
    'notfound.lead': 'O endereço pode ter mudado ou ter sido digitado errado.',
    'notfound.error': 'arquivo ou diretório não encontrado',
    'notfound.hint': '# tente um destes caminhos:',
    'notfound.home': 'Voltar ao início',
    'notfound.projects': 'Ver os projetos',

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
    'nav.menu.label': 'Menu',
    'nav.terminal.label': 'Abrir o terminal',
    'skip.main': 'Pular para o conteúdo',

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
    'cv.href': 'assets/cv/pedro-braga-cv-ptbr.pdf',
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
    'project.case': 'Ver estudo de caso',
    'project1.case.label': 'Ver estudo de caso da Carteira API',
    'project5.case.label': 'Ver estudo de caso do SocialTech',
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

    // Estudos de caso (projetos/*.html)
    'case.back': 'Voltar aos projetos',
    'case.code': 'Ver o código',
    'case.section.context': 'Contexto',
    'case.section.problem': 'Problema',
    'case.section.decisions': 'Decisões',
    'case.section.architecture': 'Arquitetura',
    'case.section.proofs': 'Provas',
    'case.section.stack': 'Stack',
    'case.section.next': 'Limites e próximos passos',
    'case.section.role': 'Meu papel',
    'case.section.delivery': 'Do commit ao QR Code',
    'case.live': 'Ver o site no ar',
    'case.carteira.eyebrow': 'Estudo de caso · projeto pessoal',
    'case.carteira.lead':
      'API REST de carteira digital em Java 21: cadastro e login com JWT, depósitos, transferências entre usuários e extrato. O foco é demonstrar, com testes, os requisitos essenciais de sistemas financeiros.',
    'case.carteira.adrs': 'Ler os 7 ADRs',
    'case.carteira.metric.concurrency': 'transferências simultâneas no teste, saldo nunca negativo',
    'case.carteira.metric.idempotency': 'reenvios simultâneos da mesma chave, um único depósito',
    'case.carteira.metric.adrs': 'ADRs com contexto, prós e contras',
    'case.carteira.context':
      'Projeto pessoal: uma API em que usuários depositam, transferem saldo entre si (o destinatário é identificado pelo e-mail) e consultam saldo e extrato. A demonstração é educacional e usa saldo fictício; o deploy em homologação e produção é simulado no GitHub Actions.',
    'case.carteira.problem.intro':
      'A transferência é a operação mais sensível do sistema: tira dinheiro de uma carteira e coloca em outra. Ela precisa garantir que:',
    'case.carteira.problem.atomic': 'o débito e o crédito aconteçam juntos ou não aconteçam;',
    'case.carteira.problem.concurrent':
      'transferências simultâneas não gastem mais do que o saldo disponível;',
    'case.carteira.problem.deadlock':
      'transferências cruzadas ao mesmo tempo (A→B e B→A) não travem o banco;',
    'case.carteira.problem.retry':
      'uma falha de rede que faça o cliente reenviar o pedido não processe a transferência duas vezes.',
    'case.carteira.decision.transaction.title': 'Uma única transação de banco',
    'case.carteira.decision.transaction.text':
      'Débito, crédito e os dois lançamentos no livro-razão são gravados na mesma transação. A operação da carteira só roda dentro da transação de quem chama (Propagation.MANDATORY): qualquer erro desfaz tudo.',
    'case.carteira.decision.lock.title': 'Lock pessimista, sempre na mesma ordem',
    'case.carteira.decision.lock.text':
      'As duas carteiras são bloqueadas com SELECT … FOR UPDATE, da menor para a maior pelo id, qualquer que seja o sentido da transferência. Sem essa ordem, A→B e B→A simultâneas travariam uma à outra. O saldo é conferido com a carteira já bloqueada.',
    'case.carteira.decision.idempotency.title': 'Idempotência com reenvio do comprovante',
    'case.carteira.decision.idempotency.text':
      'Depósitos e transferências exigem o cabeçalho Idempotency-Key. A mesma chave com os mesmos dados devolve o comprovante original sem movimentar nada; com dados diferentes, 422; com duas requisições simultâneas, só uma movimenta; a outra recebe o comprovante ou 409.',
    'case.carteira.decision.cursor.title': 'Extrato paginado por cursor',
    'case.carteira.decision.cursor.text':
      'Em vez de número de página, o cursor diz “continue depois deste lançamento”: lançamentos novos não repetem nem pulam itens, e o banco não lê e descarta as páginas anteriores, como faz com OFFSET. A próxima página é detectada buscando um item a mais, sem COUNT.',
    'case.carteira.decision.modulith.title': 'Monólito modular com Spring Modulith',
    'case.carteira.decision.modulith.text':
      'Microsserviços seriam exagero para o tamanho do projeto e tirariam a transferência de uma transação local. Cada módulo expõe só uma API pública e conversa com os outros por ela ou por eventos; dentro dele, arquitetura hexagonal com o domínio em Java puro.',
    'case.carteira.decision.database.title': 'Regras críticas também no banco',
    'case.carteira.decision.database.text':
      'Saldo nunca negativo, valor positivo, chave de idempotência única e livro-razão somente-inserção são garantidos por constraints e trigger do PostgreSQL, não apenas pela aplicação.',
    'case.carteira.diagram.title': 'Arquitetura da Carteira API',
    'case.carteira.diagram.desc':
      'O cliente chama a API REST com um token JWT. Dentro do monólito modular, o módulo transacao usa a UsuarioApi para encontrar o destinatário e a CarteiraApi, única forma de alterar um saldo. O módulo usuario publica o evento UsuarioCadastrado, que cria a carteira na mesma transação do cadastro. O módulo compartilhado cuida da segurança e dos erros no padrão RFC 9457. Todos gravam no mesmo PostgreSQL, que garante as regras críticas com constraints e trigger.',
    'case.carteira.diagram.client': 'Cliente',
    'case.carteira.diagram.monolith': 'monólito modular · Spring Modulith',
    'case.carteira.diagram.transacao': 'depósitos, transferências e extrato',
    'case.carteira.diagram.usuario': 'cadastro e login',
    'case.carteira.diagram.carteira': 'saldo e livro-razão',
    'case.carteira.diagram.event': 'evento UsuarioCadastrado',
    'case.carteira.diagram.shared': 'compartilhado: segurança (JWT) e erros RFC 9457',
    'case.carteira.diagram.db': 'constraints e trigger',
    'case.carteira.diagram.caption':
      'Módulos e dependências. O ArquiteturaTest reprova o build se um módulo acessar o interior de outro, se houver ciclo entre módulos ou se o domínio depender de framework.',
    'case.carteira.proofs.intro':
      'Cada garantia aponta para o código ou o teste que a prova. Os testes de integração rodam contra um PostgreSQL real embarcado.',
    'case.carteira.proof.transfer':
      '15 transferências de R$ 10 ao mesmo tempo, com saldo de R$ 100: exatamente 5 são recusadas e o saldo nunca fica negativo. Transferências cruzadas simultâneas provam que não há deadlock.',
    'case.carteira.proof.atomic':
      'Força uma falha no crédito do destinatário e prova que o débito também é desfeito.',
    'case.carteira.proof.deposit':
      '8 requisições simultâneas com a mesma Idempotency-Key: o depósito acontece uma única vez.',
    'case.carteira.proof.architecture':
      'O build falha se um módulo acessar o interior de outro, se houver ciclo entre módulos ou se o domínio depender de framework.',
    'case.carteira.proof.coverage':
      'Relatório de cobertura gerado a cada build, sem badge com número fixo nem porcentagem presumida.',
    'case.carteira.proof.delivery':
      'A imagem Docker é construída uma vez, publicada no GHCR e promovida de homologação para produção com aprovação manual (deploy simulado no GitHub Actions).',
    'case.carteira.adrs.title': 'Os 7 ADRs',
    'case.carteira.adr1': 'Monólito modular com arquitetura hexagonal',
    'case.carteira.adr2': 'Autenticação stateless com JWT',
    'case.carteira.adr3': 'Movimentação de saldo: dinheiro, livro-razão e concorrência',
    'case.carteira.adr4': 'Transferência entre carteiras',
    'case.carteira.adr5': 'Idempotência com reenvio da resposta original',
    'case.carteira.adr6': 'Extrato paginado por cursor',
    'case.carteira.adr7': 'Entrega com contêiner e deploy simulado',
    'case.carteira.next.intro': 'O que ficou de fora, registrado nos ADRs e no roadmap do repositório:',
    'case.carteira.next.enumeration':
      'Buscar o destinatário pelo e-mail revela se um e-mail está cadastrado. Em produção, seria preciso limitar as tentativas ou usar uma chave de transferência, como a do Pix.',
    'case.carteira.next.session':
      'O token JWT vale 1 hora e ainda não há refresh token nem revogação de sessões.',
    'case.carteira.next.keys':
      'As chaves de idempotência ficam guardadas para auditoria; falta um prazo de validade.',
    'case.carteira.next.observability':
      'Observabilidade: métricas com Micrometer e Prometheus e logs com id de correlação.',
    'case.carteira.next.outbox':
      'Avisar quem recebeu uma transferência com um outbox de eventos do Spring Modulith.',
    'case.carteira.next.deploy':
      'Deploy real em nuvem: hoje ele é simulado, e só o passo de implantação mudaria.',
    'case.socialtech.eyebrow': 'Estudo de caso · projeto de extensão (UCB + Enactus)',
    'case.socialtech.lead':
      'Site educativo mobile-first, aberto pelo QR Code da lixeira de compostagem da UCB, que mostra o que pode e o que não pode ser descartado ali. Fui um dos dois mantenedores de um time de 10 estudantes.',
    'case.socialtech.metric.prs': 'PRs meus mergeados, de 131 no repositório',
    'case.socialtech.metric.team': 'estudantes no time, 2 deles mantenedores',
    'case.socialtech.metric.a11y': 'em Acessibilidade no Lighthouse, modo celular, no site publicado',
    'case.socialtech.context':
      'Projeto de extensão da Universidade Católica de Brasília (Campus Taguatinga) com o Enactus UCB, no segundo semestre de 2026. O descarte errado de resíduos orgânicos contamina recicláveis e contribui para a superlotação dos aterros do Distrito Federal. A ideia: quem está na frente da lixeira escaneia o QR Code e descobre, pelo celular, o que pode ser descartado ali.',
    'case.socialtech.problem.intro': 'Os objetivos de qualidade, em ordem de prioridade, eram:',
    'case.socialtech.problem.speed':
      'quem escaneia o QR decide “pode ou não pode” em até 10 segundos, num celular com 4G;',
    'case.socialtech.problem.a11y': 'acessível (WCAG 2.1 AA) e usável com uma mão em 360 px;',
    'case.socialtech.problem.privacy': 'nenhum dado pessoal coletado;',
    'case.socialtech.problem.editing':
      'o professor coordenador edita o conteúdo sozinho, sem programar e sem quebrar o site;',
    'case.socialtech.problem.review':
      'código simples o bastante para estudantes revisarem código gerado por IA.',
    'case.socialtech.role.intro':
      'Dos 10 estudantes, 4 tinham acesso ao GitHub. Fui um dos dois mantenedores e cuidei de:',
    'case.socialtech.role.architecture':
      'arquitetura e registros de decisão (ADRs), seguindo Spec-Driven Development;',
    'case.socialtech.role.ci': 'CI/CD: verificações em todo PR e deploy no GitHub Pages a cada push na main;',
    'case.socialtech.role.review':
      'revisão de PRs como code owner: todo PR para a develop precisa da aprovação de um mantenedor, e quem fez o último push não pode aprovar;',
    'case.socialtech.role.a11y':
      'acessibilidade: WCAG 2.1 AA como meta, regras de acessibilidade no ESLint e testes no navegador.',
    'case.socialtech.decision.static.title': 'Astro e TypeScript, 100% estático',
    'case.socialtech.decision.static.text':
      'HTML e CSS gerados no build e publicados no GitHub Pages: sem servidor, banco de dados nem API. O Astro não envia JavaScript por padrão, e o TypeScript strict ajuda a revisar código gerado por IA.',
    'case.socialtech.decision.progressive.title': 'Aprimoramento progressivo',
    'case.socialtech.decision.progressive.text':
      'O HTML traz todo o conteúdo; os scripts dos componentes só acrescentam a busca, o ciclo passo a passo e o quiz. Sem JavaScript, o guia aparece completo. Os scripts nunca usam innerHTML.',
    'case.socialtech.decision.single.title': 'Página única',
    'case.socialtech.decision.single.text':
      'Cada página a mais seria outro carregamento no 4G, justo quando a pessoa está na frente da lixeira. Todas as seções ficam numa página só, com acesso por âncoras.',
    'case.socialtech.decision.cms.title': 'Conteúdo editável sem programar',
    'case.socialtech.decision.cms.text':
      'O professor edita pelo Pages CMS, e cada “Salvar” vira um commit. O conteúdo fica em JSON validado por schema zod: dado inválido faz o build falhar e o site anterior continua no ar.',
    'case.socialtech.decision.privacy.title': 'Contagem de acessos sem cookies',
    'case.socialtech.decision.privacy.text':
      'GoatCounter, só no build de produção, sem dado pessoal. O endereço do QR leva o parâmetro campaign=lixeira, que separa as visitas vindas da lixeira.',
    'case.socialtech.decision.font.title': 'Nada de terceiros além da contagem',
    'case.socialtech.decision.font.text':
      'Roboto auto-hospedada (cerca de 44 KB, só caracteres latinos) no lugar do Google Fonts. A Content-Security-Policy libera só o próprio site e o GoatCounter, sem unsafe-inline.',
    'case.socialtech.diagram.title': 'Fluxo de entrega do SocialTech',
    'case.socialtech.diagram.desc':
      'Os estudantes abrem PRs a partir de branches feature. Todo PR passa pelo CI (formatação, lint com regras de acessibilidade, tipos, build, verificação do site gerado, testes no navegador e links) e precisa da aprovação de um mantenedor antes de entrar na develop. A release leva a develop para a main com merge commit. O professor edita o conteúdo no Pages CMS, que grava direto na main. Cada push na main gera e publica o site no GitHub Pages. O QR Code da lixeira abre o site, e o GoatCounter conta a visita sem cookies.',
    'case.socialtech.diagram.team': 'equipe',
    'case.socialtech.diagram.cms': 'professor edita o conteúdo',
    'case.socialtech.diagram.ci': 'CI + revisão',
    'case.socialtech.diagram.checks': 'lint, tipos, build, testes',
    'case.socialtech.diagram.approval': 'aprovação de mantenedor',
    'case.socialtech.diagram.direct': 'commit direto',
    'case.socialtech.diagram.site': 'site no ar',
    'case.socialtech.diagram.bin': 'na lixeira de compostagem',
    'case.socialtech.diagram.visits': 'visitas sem cookies',
    'case.socialtech.diagram.caption':
      'Branches e publicação, como registrado no documento de arquitetura. A main só aceita PR vindo da develop ou de fix/*.',
    'case.socialtech.proofs.intro': 'Cada afirmação aponta para o arquivo ou registro que a prova.',
    'case.socialtech.proof.prs': '111 dos 131 PRs mergeados no repositório são meus.',
    'case.socialtech.proof.ci':
      'Em todo PR: Prettier, ESLint com regras de acessibilidade, astro check, build, verificação do site gerado, testes com Playwright e links quebrados.',
    'case.socialtech.proof.checker':
      'Confere o site gerado: página inicial abaixo de 350 KB, um único h1, alt em toda imagem, caminhos internos com /SocialTech/ e o GoatCounter como único script externo.',
    'case.socialtech.proof.e2e':
      'Playwright em 360 e 1366 px: busca, ciclo, quiz, tema, movimento reduzido, sem JavaScript e a página 404; o teste falha se alguma interação violar a CSP.',
    'case.socialtech.proof.lighthouse':
      'Três execuções do Lighthouse, modo celular, no site publicado: Desempenho de 99 a 100; Acessibilidade, Boas práticas e SEO 100; LCP de 1,5 a 1,9 s; 279 KiB transferidos.',
    'case.socialtech.proof.sdd':
      'Constituição, especificação, clarificações, plano de tarefas e revisão, consolidados depois do MVP.',
    'case.socialtech.next.intro':
      'O que ainda está em aberto, registrado no documento de arquitetura e no registro de homologação:',
    'case.socialtech.next.goals':
      'As metas de uso (acessos pelo QR, respostas ao formulário) ainda não têm evidência consolidada no registro de homologação.',
    'case.socialtech.next.manual': 'Os testes com leitor de tela e em celulares reais continuam manuais.',
    'case.socialtech.next.lighthouse':
      'O Lighthouse não roda no CI; no lugar, o CI cobra o orçamento de 350 KB e confere h1 e alt.',
    'case.socialtech.next.cms':
      'As edições do painel vão direto para a main, sem revisão; por isso a develop precisa recebê-las antes de cada release.',
    'case.socialtech.next.qr':
      'O QR Code é estático: renomear o repositório ou trocar de domínio exige reimprimir o adesivo.',
    'case.socialtech.next.adblock':
      'Bloqueadores de anúncio podem impedir o GoatCounter, então a contagem de acessos é um mínimo.',
  },
};

// Únicas chaves cujo valor pode conter marcação HTML (aplicadas com innerHTML) — hoje, nenhuma.
// As demais são aplicadas com textContent e não podem conter "<" nem entidades "&".
export const HTML_KEYS = Object.freeze([]);
