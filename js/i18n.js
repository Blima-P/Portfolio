'use strict';

/* ---- i18n — Alternador de idioma ---- */

const translations = {
  en: {
    // Navegação
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.certifications': 'Courses',
    'nav.contact': 'Contact',

    // Hero
    'hero.greeting': 'Hello, I\'m',
    'hero.iam': 'I am',
    'hero.description': 'Software Engineering student at UCB and development intern at CAESB. Focused on Java backend development with Spring and PostgreSQL, looking for junior software development opportunities.',
    'hero.btn.projects': 'View Projects',
    'hero.btn.contact': 'Get in touch',
    'hero.btn.cv': 'Download CV',

    // Sobre
    'about.title': 'About <span>Me</span>',
    'about.subtitle': 'Who am I',
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
    'nav.experience': 'Experience',
    'timeline.title': 'My <span>Journey</span>',
    'timeline.subtitle': 'Where I\'ve been',
    'timeline.item1.date': '2025 — Present',
    'timeline.item1.title': 'IT Intern — CAESB',
    'timeline.item1.desc': 'Development and maintenance of full-stack applications using Java, JavaScript, React, XHTML, and Azure services.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Video Editor - Freelancer',
    'timeline.item2.desc': 'Responsible for editing audiovisual content and directly interfacing with clients to align requirements and ensure the quality of the final product.',
    'timeline.item3.date': '2024 — 2024',
    'timeline.item3.title': 'Intern — CredSolaris',
    'timeline.item3.desc': 'Optimizing workflows through process automation. Technical support and specialized customer service.',
    'timeline.item4.date': '2023 - 2024',
    'timeline.item4.title': 'Young Apprentice - Solução Acessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Administrative assistant, customer service, and Excel spreadsheets.',
    

    // Projetos
    'projects.title': 'My <span>Projects</span>',
    'projects.subtitle': 'What I\'ve built',
    'project1.title': 'Carteira API',
    'project1.description': 'Personal Java backend project for a digital wallet: registration, JWT login, balance, deposits and transfers. ACID transactions, idempotent retries, modular architecture and concurrency tests. Paginated statements are planned.',
    'project2.title': 'Personal Portfolio',
    'project2.description': 'Responsive landing page with dark mode, Canvas animations, typing effect, and scroll-spy. Built from scratch with HTML, CSS, and vanilla JavaScript.',
    'project3.title': 'Academic ERP',
    'project3.description': 'Team university project for managing students, courses and enrollments. Contributions include course selection in enrollment and authentication updates with React and Firebase.',
    'project4.title': 'Multiplayer Minesweeper',
    'project4.description': 'Team Operating Systems project: a terminal game written in C. Participation in a multiplayer implementation using POSIX threads and semaphores for concurrent execution.',
    'project.source': 'Code',
    'filter.all': 'All',
    'filter.web': 'Web',
    'filter.backend': 'Backend',
    'filter.systems': 'Systems',

    // Certificações
    'certs.title': 'Courses &amp; <span>Learning</span>',
    'certs.subtitle': 'Complementary training, separate from professional certifications',
    'cert1.name': 'Java Programming',
    'cert1.issuer': 'Udemy',
    'cert3.name': 'TypeScript/JavaScript',
    'cert3.issuer': 'Udemy',
    'cert4.name': 'React Development',
    'cert4.issuer': 'Udemy',

    // GitHub
    'github.title': 'Selected <span>Repositories</span>',
    'github.subtitle': 'Public projects with repository details from GitHub',
    'github.viewprofile': 'View Full Profile',
    'github.error': 'Could not load repositories. Visit my GitHub profile.',

    // Habilidades
    'skills.title': 'My <span>Skills</span>',
    'skills.subtitle': 'Practical examples from my projects',
    'skill1.evidence': 'REST API with JWT authentication, deposits and atomic transfers.',
    'skill2.evidence': 'Versioned migrations, financial constraints and pessimistic locking.',
    'skill3.evidence': 'Academic ERP with authentication and student, course and enrollment screens.',
    'skill4.evidence': 'Responsive bilingual portfolio with themes and GitHub API integration.',
    'skill5.evidence': 'Data analysis projects and initial exploration of credit default data.',
    'skill6.evidence': 'Pull requests, automated builds, architecture checks and integration tests.',

    // Contato
    'contact.title': 'Get in <span>Touch</span>',
    'contact.subtitle': 'Let\'s talk',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Your message...',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.sent': '✓ Message sent!',
    'contact.form.error': '✗ Error, try again',

    // Depoimentos
    'test.title': 'What People <span>Say</span>',
    'test.subtitle': 'Feedback & recommendations',
    'test1.text': '"Pedro is a dedicated developer who always delivers quality work. His passion for learning new technologies is impressive."',
    'test1.name': 'Prof. Carlos Silva',
    'test1.role': 'UCB Professor',
    'test2.text': '"Great team player with strong problem-solving skills. Pedro adapted quickly to our tech stack and contributed meaningfully from day one."',
    'test2.name': 'Ana Martins',
    'test2.role': 'Tech Lead at CAESB',
    'test3.text': '"Working with Pedro on the CAESB Detector project was a great experience. He brings creativity and technical skill to every challenge."',
    'test3.name': 'Lucas Ferreira',
    'test3.role': 'Fellow Developer',

    // Rodapé
    'footer.text': 'Built by <span>Pedro Braga</span> with HTML, CSS, and vanilla JavaScript.',

    // Meta
    'meta.description': 'Pedro Braga — Java backend developer, Spring and PostgreSQL. Software Engineering student at UCB and development intern at CAESB.',
  },

  'pt-br': {
    // Navegação
    'nav.about': 'Sobre',
    'nav.projects': 'Projetos',
    'nav.skills': 'Skills',
    'nav.certifications': 'Cursos',
    'nav.contact': 'Contato',

    // Hero
    'hero.greeting': 'Olá, me chamo',
    'hero.iam': 'Eu sou',
    'hero.description': 'Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB. Foco em backend Java com Spring e PostgreSQL, buscando oportunidades como desenvolvedor de software júnior.',
    'hero.btn.projects': 'Ver Projetos',
    'hero.btn.contact': 'Entrar em contato',
    'hero.btn.cv': 'Baixar Currículo',

    // Sobre
    'about.title': 'Sobre <span>Mim</span>',
    'about.subtitle': 'Quem sou eu',
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
    'counter.years': 'Anos Programando',

    // Linha do tempo
    'nav.experience': 'Experiência',
    'timeline.title': 'Minha <span>Jornada</span>',
    'timeline.subtitle': 'Por onde passei',
    'timeline.item1.date': '2025 — Presente',
    'timeline.item1.title': 'Estagiário de TI — CAESB',
    'timeline.item1.desc': 'Desenvolvimento e manutenção de aplicações Fullstack com Java, JavaScript, React, XHTML e serviços Azure.',
    'timeline.item2.date': '2024 — 2025',
    'timeline.item2.title': 'Editor de Video - Freelancer',
    'timeline.item2.desc': 'Responsável pela edição de conteúdo audiovisual e interface direta com clientes para alinhamento de requisitos e garantia de qualidade do produto final.',
    'timeline.item3.date': '2024 — 2024',
    'timeline.item3.title': 'Estagio — CredSolaris',
    'timeline.item3.desc': 'Otimização de fluxos de trabalho através da automação de processos. Suporte técnico e atendimento especializado ao cliente.',
    'timeline.item4.date': '2023 - 2024',
    'timeline.item4.title': 'Jovem aprendiz - Solução Acessoria Vendas/Cobranças',
    'timeline.item4.desc': 'Assistente administrativo, Atendimento ao publico e Planilhas Excel.',

    // Projetos
    'projects.title': 'Meus <span>Projetos</span>',
    'projects.subtitle': 'O que já construí',
    'project1.title': 'Carteira API',
    'project1.description': 'Projeto pessoal de backend Java para carteira digital: cadastro, login JWT, saldo, depósitos e transferências. Transações ACID, reenvio idempotente, arquitetura modular e testes de concorrência. Extrato paginado está planejado.',
    'project2.title': 'Portfolio Pessoal',
    'project2.description': 'Landing page responsiva com dark mode, animações em Canvas, efeito typing e scroll-spy. Desenvolvido do zero com HTML, CSS e JavaScript puro.',
    'project3.title': 'ERP Acadêmico',
    'project3.description': 'Projeto universitário em equipe para gestão de alunos, cursos e matrículas. Contribuições incluem seleção de curso na matrícula e ajustes de autenticação com React e Firebase.',
    'project4.title': 'Campo Minado Multiplayer',
    'project4.description': 'Projeto em equipe de Sistemas Operacionais: jogo no terminal em C. Participação na implementação multiplayer com threads e semáforos POSIX para execução concorrente.',
    'project.source': 'Código',
    'filter.all': 'Todos',
    'filter.web': 'Web',
    'filter.backend': 'Backend',
    'filter.systems': 'Sistemas',

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
    'github.viewprofile': 'Ver Perfil Completo',
    'github.error': 'Não foi possível carregar repositórios. Visite meu perfil no GitHub.',

    // Habilidades
    'skills.title': 'Minhas <span>Skills</span>',
    'skills.subtitle': 'Exemplos práticos dos meus projetos',
    'skill1.evidence': 'API REST com autenticação JWT, depósitos e transferências atômicas.',
    'skill2.evidence': 'Migrations versionadas, constraints financeiras e bloqueio pessimista.',
    'skill3.evidence': 'ERP acadêmico com autenticação e telas de alunos, cursos e matrículas.',
    'skill4.evidence': 'Portfólio responsivo e bilíngue com temas e integração com a API do GitHub.',
    'skill5.evidence': 'Projetos de análise de dados e exploração inicial de dados de inadimplência.',
    'skill6.evidence': 'Pull requests, builds automatizados, verificações de arquitetura e testes de integração.',

    // Contato
    'contact.title': 'Entre em <span>Contato</span>',
    'contact.subtitle': 'Vamos conversar',
    'contact.form.name': 'Nome',
    'contact.form.name.placeholder': 'Seu nome',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'seu@email.com',
    'contact.form.message': 'Mensagem',
    'contact.form.message.placeholder': 'Sua mensagem...',
    'contact.form.submit': 'Enviar Mensagem',
    'contact.form.sending': 'Enviando...',
    'contact.form.sent': '✓ Mensagem enviada!',
    'contact.form.error': '✗ Erro, tente novamente',

    // Depoimentos
    'test.title': 'O Que Dizem <span>Sobre Mim</span>',
    'test.subtitle': 'Feedback e recomendações',
    'test1.text': '"Pedro é um desenvolvedor dedicado que sempre entrega trabalho de qualidade. Sua paixão por aprender novas tecnologias é impressionante."',
    'test1.name': 'Prof. Carlos Silva',
    'test1.role': 'Professor na UCB',
    'test2.text': '"Ótimo trabalho em equipe e habilidades sólidas de resolução de problemas. Pedro se adaptou rapidamente à nossa stack e contribuiu significativamente desde o primeiro dia."',
    'test2.name': 'Ana Martins',
    'test2.role': 'Tech Lead na CAESB',
    'test3.text': '"Trabalhar com Pedro no projeto Detector CAESB foi uma ótima experiência. Ele traz criatividade e habilidade técnica para cada desafio."',
    'test3.name': 'Lucas Ferreira',
    'test3.role': 'Desenvolvedor Colega',

    // Rodapé
    'footer.text': 'Desenvolvido por <span>Pedro Braga</span> com HTML, CSS e JavaScript puro.',

    // Meta
    'meta.description': 'Pedro Braga — Desenvolvedor backend Java, Spring e PostgreSQL. Estudante de Engenharia de Software na UCB e estagiário de desenvolvimento na CAESB.',
  },
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const dict = translations[lang];
  if (!dict) return;

  // Atualiza todos os elementos com data-i18n.
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!dict[key]) return;

    // Verifica atributos especiais de destino.
    const attr = el.getAttribute('data-i18n-attr');
    if (attr) {
      el.setAttribute(attr, dict[key]);
    } else {
      el.innerHTML = dict[key];
    }
  });

  // Atualiza <html lang>.
  document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : 'en';

  // Atualiza a meta description.
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict['meta.description']) {
    metaDesc.setAttribute('content', dict['meta.description']);
  }

  // Atualiza o rótulo do botão para mostrar o outro idioma.
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = lang === 'en' ? 'PT-BR' : 'EN';
  }

  // Atualiza o efeito de digitação, se disponível.
  if (typeof updateTypingLanguage === 'function') {
    updateTypingLanguage(lang);
  }
}

// Alterna entre os idiomas.
function toggleLanguage() {
  setLanguage(currentLang === 'en' ? 'pt-br' : 'en');
}

// Inicializa quando o DOM estiver pronto.
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('lang-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  }
  setLanguage(currentLang);
});
