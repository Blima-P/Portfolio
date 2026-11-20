// Partículas decorativas do hero (canvas). Pausam quando o hero sai da tela.

const MAX_DISTANCE = 120;
const MAX_DISTANCE_SQ = MAX_DISTANCE * MAX_DISTANCE;
const SPEED = 0.3;
const RADIUS = 1.5;
// Densidade: uma partícula a cada ~30.000 px², entre 15 e 35.
const AREA_PER_PARTICLE = 30000;
const MIN_PARTICLES = 15;
const MAX_PARTICLES = 35;
const FALLBACK_RGB = '245, 165, 36';
// Área livre de partículas em volta do texto e dos botões: um miolo sólido com folga e, depois
// dele, uma borda esmaecida.
const MASK_CORE_PADDING = 16;
const MASK_PADDING = 32;
const MASK_FEATHER = 48;

export function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return null;

  const content = document.querySelector('.hero__content');
  const mask = document.createElement('canvas');
  const maskCtx = mask.getContext('2d');

  let particles = [];
  let color = FALLBACK_RGB;
  let animationId = null;
  let isVisible = true;
  let hasMask = false;

  // A cor vem do token CSS --particles-rgb, definido por tema.
  function refreshColor() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--particles-rgb').trim();
    color = value || FALLBACK_RGB;
  }

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    buildMask();
  }

  // A máscara é desenhada uma vez por mudança de layout e "apaga" (destination-out) a região do
  // conteúdo a cada quadro. A borda suave vem de shadowBlur, que funciona também no Safari antigo
  // (ctx.filter não).
  function buildMask() {
    hasMask = false;
    if (!content || !maskCtx) return;
    mask.width = canvas.width;
    mask.height = canvas.height;
    maskCtx.clearRect(0, 0, mask.width, mask.height);

    const box = content.getBoundingClientRect();
    const origin = canvas.getBoundingClientRect();
    const left = box.left - origin.left;
    const top = box.top - origin.top;
    if (box.width <= 0 || box.height <= 0) return;

    // Borda esmaecida: o retângulo fica fora da tela e só a sombra borrada cai sobre o conteúdo.
    const offset = mask.width + MASK_FEATHER * 4;
    // Na máscara só o alfa importa (destination-out): '#000' não é cor visível nem vira token.
    maskCtx.fillStyle = '#000';
    maskCtx.shadowColor = '#000';
    maskCtx.shadowBlur = MASK_FEATHER;
    maskCtx.shadowOffsetX = offset;
    maskCtx.fillRect(
      left - MASK_PADDING - offset,
      top - MASK_PADDING,
      box.width + MASK_PADDING * 2,
      box.height + MASK_PADDING * 2,
    );
    // O blur deixa a sombra semitransparente perto da borda: o miolo sólido garante que nada
    // atravesse o texto.
    maskCtx.shadowColor = 'transparent';
    maskCtx.fillRect(
      Math.floor(left - MASK_CORE_PADDING),
      Math.floor(top - MASK_CORE_PADDING),
      Math.ceil(box.width + MASK_CORE_PADDING * 2) + 1,
      Math.ceil(box.height + MASK_CORE_PADDING * 2) + 1,
    );
    hasMask = true;
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
      // Quique pela direção (não só inverter): se o canvas encolher, a partícula volta para dentro
      // em vez de ficar oscilando do lado de fora.
      if (p.x < 0) p.vx = Math.abs(p.vx);
      else if (p.x > canvas.width) p.vx = -Math.abs(p.vx);
      if (p.y < 0) p.vy = Math.abs(p.vy);
      else if (p.y > canvas.height) p.vy = -Math.abs(p.vy);
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

    if (hasMask) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
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

  // Troca de idioma muda a altura do conteúdo (e às vezes a do hero) sem redimensionar a janela.
  if (content && 'ResizeObserver' in window) {
    new ResizeObserver(resizeCanvas).observe(content);
  }

  return { refreshColor };
}
