// Interações gerais da página: header, menu mobile, scroll-spy, revelação ao rolar
// e filtro de projetos.

// Também usado pelas páginas de estudo de caso (case.js), que não têm links de seção no menu.
export function initHeader() {
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scroll-progress');
  initScrollSpy();

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

        ticking = false;
      });
    },
    { passive: true },
  );
}

// Marca com aria-current o link da seção que cruza a linha a 1/3 da altura da tela. Seções sem
// link no menu (início, GitHub) não marcam nenhum.
function initScrollSpy() {
  const links = new Map(
    [...document.querySelectorAll('.nav__link[href^="#"]')].map((link) => [link.hash.slice(1), link]),
  );
  const sections = [...document.querySelectorAll('main section[id]')];
  if (!links.size || !sections.length) return;

  const crossing = new Set();
  const update = () => {
    const current = sections.findLast((section) => crossing.has(section));
    if (!current) return;
    for (const [id, link] of links) {
      if (id === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) crossing.add(target);
        else crossing.delete(target);
      }
      update();
    },
    { rootMargin: '-33% 0px -66% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
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

export function initUI() {
  initHeader();
  initMobileMenu();
  initReveal();
}
