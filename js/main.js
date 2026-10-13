'use strict';

/* ---- Preloader ---- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 1200);
  }
});

/* ---- Header: adiciona fundo ao rolar ---- */
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      
      // Fundo do header.
      header.classList.toggle('scrolled', scrollY > 50);

      // Barra de progresso da rolagem.
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        scrollProgress.style.transform = `scaleX(${scrollY / docHeight})`;
      }

      // Scroll-spy.
      updateScrollSpy();

      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

/* ---- Menu mobile ---- */
const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementById('nav-list');

navToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
  navToggle.classList.toggle('open');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav')) {
    navList.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

/* ---- Scroll-spy: destaca o link da seção visível ---- */
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
const sections = document.querySelectorAll('main section[id]');

function updateScrollSpy() {
  const scrollMid = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav__link[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

updateScrollSpy();

/* ---- Intersection Observer: anima elementos ao entrar na viewport ---- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate--visible');
      observer.unobserve(entry.target);
    }
  });
}, { root: null, threshold: 0.15 });

document.querySelectorAll('.animate').forEach(el => observer.observe(el));

/* ---- Animação de revelação de texto nos títulos das seções ---- */
document.querySelectorAll('.section__title').forEach(el => {
  el.classList.add('text-reveal');
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('text-reveal--visible');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  titleObserver.observe(el);
});

document.querySelectorAll('.section__subtitle').forEach(el => {
  el.classList.add('subtitle-reveal');
  const subObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('subtitle-reveal--visible');
        subObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  subObserver.observe(el);
});

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.classList.add('animate', `animate--delay-${i + 1}`);
  observer.observe(card);
});

document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.classList.add('animate', `animate--delay-${(i % 3) + 1}`);
  observer.observe(card);
});

document.querySelectorAll('.contact__info-item').forEach((item, i) => {
  item.classList.add('animate', 'animate--left', `animate--delay-${i + 1}`);
  observer.observe(item);
});

const form = document.querySelector('.contact__form');
if (form) {
  form.classList.add('animate', 'animate--right');
  observer.observe(form);
}

/* ---- Contadores animados ---- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter__number');
      counters.forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 1500;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        };
        update();
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const countersSection = document.querySelector('.counters');
if (countersSection) counterObserver.observe(countersSection);

/* ---- Filtro de projetos por abas ---- */
const filterBtns = document.querySelectorAll('.projects__filter');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
