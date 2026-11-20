// Interações gerais da página: header, menu mobile, scroll-spy, revelação ao rolar
// e filtro de projetos.

function initHeader() {
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');

  // Destaca o link da seção que ocupa o terço superior da tela.
  function updateScrollSpy() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    for (const section of sections) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollMid >= top && scrollMid < bottom) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
        });
      }
    }
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const { scrollY } = window;
        header?.classList.toggle('scrolled', scrollY > 50);

        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProgress && docHeight > 0) {
          scrollProgress.style.transform = `scaleX(${scrollY / docHeight})`;
        }

        updateScrollSpy();
        ticking = false;
      });
    },
    { passive: true },
  );

  updateScrollSpy();
}

function initMobileMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (!navToggle || !navList) return;

  const close = () => {
    navList.classList.remove('open');
    navToggle.classList.remove('open');
  };

  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  document.querySelectorAll('.nav__link').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav')) close();
  });
}

// Revela elementos ao entrarem na tela (uma única vez).
function revealOnScroll(elements, visibleClass, threshold) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold },
  );
  elements.forEach((el) => observer.observe(el));
}

function initReveal() {
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('animate', `animate--delay-${i + 1}`);
  });
  document.querySelectorAll('.skill-group').forEach((group, i) => {
    group.classList.add('animate', `animate--delay-${(i % 2) + 1}`);
  });
  revealOnScroll(document.querySelectorAll('.animate'), 'animate--visible', 0.15);

  // Observa a seção, não o título: o clip-path inicial zera a área visível do título e o
  // IntersectionObserver nunca o veria entrar na tela.
  const sections = new Set();
  document.querySelectorAll('.section__title').forEach((el) => {
    el.classList.add('text-reveal');
    sections.add(el.closest('section'));
  });
  document.querySelectorAll('.section__subtitle').forEach((el) => {
    el.classList.add('subtitle-reveal');
    sections.add(el.closest('section'));
  });
  sections.delete(null);
  revealOnScroll(sections, 'section--revealed', 0);
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.projects__filter');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.toggle('active', b === btn));

      const { filter } = btn.dataset;
      projectCards.forEach((card) => {
        const visible = filter === 'all' || card.dataset.category.includes(filter);
        card.classList.toggle('hidden', !visible);
        if (visible) card.style.animation = 'fade-in-up 0.4s ease forwards';
      });
    });
  });

  // Link interno para um card escondido pelo filtro (ex.: prova do hero): volta para "Todos" antes de
  // o navegador rolar até ele, senão o salto não acontece.
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (target?.matches('.project-card.hidden')) {
      document.querySelector('.projects__filter[data-filter="all"]')?.click();
    }
  });
}

export function initUI() {
  initHeader();
  initMobileMenu();
  initReveal();
  initProjectFilters();
}
