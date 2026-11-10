// Partículas decorativas do hero (canvas). Pausam quando o hero sai da tela.

const MAX_DISTANCE = 120;
const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
const SPEED = 0.3;
const RADIUS = 1.5;
// Densidade: uma partícula a cada ~30.000 px², entre 15 e 35.
const AREA_PER_PARTICLE = 30000;
const MIN_PARTICLES = 15;
const MAX_PARTICLES = 35;
const FALLBACK_RGB = '74, 222, 128';

export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return null;

  let particles = [];
  let color = FALLBACK_RGB;
  let animationId = null;
  let isVisible = true;

  // A cor vem do token CSS --particles-rgb, definido por tema.
  function refreshColor() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--particles-rgb').trim();
    color = value || FALLBACK_RGB;
  }

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    const area = canvas.width * canvas.height;
    const count = Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, Math.round(area / AREA_PER_PARTICLE)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() * 2 - 1) * SPEED,
      vy: (Math.random() * 2 - 1) * SPEED,
    }));
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(${color}, 0.7)`;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < MAX_DISTANCE_SQ) {
          const opacity = 1 - Math.sqrt(distSq) / MAX_DISTANCE;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${opacity * 0.3})`;
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    if (!isVisible) {
      animationId = null;
      return;
    }
    update();
    draw();
    animationId = requestAnimationFrame(frame);
  }

  function start() {
    if (!animationId) animationId = requestAnimationFrame(frame);
  }

  function stop() {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  }

  refreshColor();
  resizeCanvas();
  createParticles();
  start();

  const hero = document.getElementById('home');
  if (hero) {
    new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    }).observe(hero);
  }

  // No mobile, a barra de endereço muda só a altura ao rolar: recria as partículas
  // apenas quando a largura muda, para não "piscar" a animação.
  let lastWidth = canvas.offsetWidth;
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (canvas.width !== lastWidth) {
      lastWidth = canvas.width;
      createParticles();
    }
  });

  return { refreshColor };
}
