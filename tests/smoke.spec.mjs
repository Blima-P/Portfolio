// Smoke test: garante que o site carrega sem erros e que as interações principais funcionam.
// O servidor (scripts/serve-site.mjs) imita o GitHub Pages: o site fica sob /Portfolio/, então as
// navegações usam caminhos relativos ao baseURL ('./', não '/').
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

import { translations } from '../js/translations.js';
import { listPages } from '../scripts/pages.mjs';

const PAGES = await listPages(fileURLToPath(new URL('..', import.meta.url)));

const SELECTED = ['SocialTech', 'carteira-api', 'ERP-Academico', 'Campo-minado', 'Portfolio'];
const GITHUB_API = 'https://api.github.com/**';

// Resposta fixa da API do GitHub: evita depender de rede e do limite de requisições no CI.
const mockRepos = SELECTED.map((name, i) => ({
  name,
  html_url: `https://github.com/Blima-P/${name}`,
  description: i === 0 ? '' : `Descrição de ${name}`,
  language: name === 'SocialTech' ? 'Astro' : 'Java',
  stargazers_count: i,
  fork: false,
  archived: false,
}));

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.route(GITHUB_API, (route) => route.fulfill({ json: mockRepos }));
});

test('carrega sem erros, sem globais novas e com os repositórios', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('./');
  await expect(page.locator('.github-card')).toHaveCount(SELECTED.length);
  // SocialTech abre a lista, com a cor oficial do Astro (não o cinza de fallback).
  await expect(page.locator('.github-card__name')).toHaveText(SELECTED);
  await expect(page.locator('.github-card').first().locator('.github-card__lang-dot')).toHaveCSS(
    'background-color',
    'rgb(255, 90, 3)',
  );
  // Card sem descrição não deve renderizar parágrafo vazio.
  await expect(page.locator('.github-card').first().locator('.github-card__desc')).toHaveCount(0);

  const newGlobals = await page.evaluate(async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const builtins = new Set(Object.keys(frame.contentWindow));
    frame.remove();
    return Object.keys(window).filter((key) => !builtins.has(key));
  });
  expect(newGlobals).toEqual([]);
  expect(errors).toEqual([]);
});

test('canvas de partículas não intercepta cliques nem o menu de contexto', async ({ page }) => {
  await page.goto('./');
  const target = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return el?.tagName;
  });
  expect(target).not.toBe('CANVAS');
});

test('partículas: ~60 desenhos/s em qualquer taxa de atualização, com a mesma velocidade', async ({
  page,
}) => {
  // Relógio de quadros manual: o teste decide a taxa de atualização e conta os desenhos do canvas.
  await page.addInitScript(() => {
    const pending = new Map();
    let id = 0;
    let clock = 1000;
    let now = clock;
    window.requestAnimationFrame = (cb) => {
      pending.set(++id, cb);
      return id;
    };
    window.cancelAnimationFrame = (handle) => pending.delete(handle);
    // jitter: timestamps alternam ± esse valor em volta do quadro ideal (clock), como num navegador real.
    window.__runFrames = (count, interval, jitter = 0) => {
      for (let i = 1; i <= count; i++) {
        clock += interval;
        now = clock + (i % 2 ? jitter : -jitter);
        const callbacks = [...pending.values()];
        pending.clear();
        callbacks.forEach((cb) => cb(now));
      }
    };
    window.__draws = [];
    const { clearRect, arc } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.id === 'particles-canvas') window.__draws.push({ time: now });
      return clearRect.apply(this, args);
    };
    // Posição da primeira partícula em cada desenho.
    CanvasRenderingContext2D.prototype.arc = function (x, y, ...rest) {
      const last = window.__draws.at(-1);
      if (this.canvas.id === 'particles-canvas' && last && last.x === undefined)
        Object.assign(last, { x, y });
      return arc.call(this, x, y, ...rest);
    };
  });
  await page.goto('./');

  // Um segundo de quadros na taxa pedida (depois de um segundo de aquecimento).
  const measure = (hz, jitter = 0) =>
    page.evaluate(
      ([rate, jit]) => {
        window.__runFrames(rate, 1000 / rate, jit);
        window.__draws = [];
        window.__runFrames(rate, 1000 / rate, jit);
        const [a, b] = window.__draws;
        return { draws: window.__draws.length, speed: Math.hypot(b.x - a.x, b.y - a.y) / (b.time - a.time) };
      },
      [hz, jitter],
    );

  const at60 = await measure(60);
  expect(at60.draws, 'em 60 Hz desenha todo quadro').toBe(60);
  expect((await measure(60, 1)).draws, '60 Hz com timestamps imprecisos').toBe(60);
  for (const [hz, jitter] of [[75], [90], [120], [144], [144, 0.5]]) {
    const result = await measure(hz, jitter);
    expect(result.draws, `${hz} Hz`).toBeGreaterThanOrEqual(58);
    expect(result.draws, `${hz} Hz`).toBeLessThanOrEqual(62);
    if (!jitter) expect(result.speed, `velocidade em ${hz} Hz`).toBeCloseTo(at60.speed, 4);
  }
});

test('rolagem não anima propriedades de layout (scroll-spy e revelação)', async ({ page }) => {
  await page.goto('./');
  // Começa com o header já compacto: a transição dele acontece uma vez, ao sair do topo.
  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForTimeout(500);
  const { props, hidden } = await page.evaluate(async () => {
    const props = new Set();
    let sampling = true;
    const sample = () => {
      for (const animation of document.getAnimations()) {
        if (animation.transitionProperty) {
          props.add(animation.transitionProperty.replace(/-([a-z])/g, (_, c) => c.toUpperCase()));
        } else {
          for (const frame of animation.effect.getKeyframes()) {
            for (const key of Object.keys(frame)) {
              if (!['offset', 'computedOffset', 'easing', 'composite'].includes(key)) props.add(key);
            }
          }
        }
      }
      if (sampling) requestAnimationFrame(sample);
    };
    sample();
    // Rolagem instantânea (sem o scroll-behavior: smooth do html): cada passo chega mesmo ao destino.
    const step = innerHeight / 3;
    for (let y = 200; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 120));
    }
    await new Promise((r) => setTimeout(r, 300));
    sampling = false;
    const hidden = [...document.querySelectorAll('.text-reveal')]
      .filter((el) => !el.closest('.section--revealed'))
      .map((el) => el.closest('section').id);
    return { props: [...props], hidden };
  });
  expect(hidden, 'a rolagem passou por todas as seções').toEqual([]);
  const animated = props;
  // Garante que a amostragem pegou as animações de rolagem (revelação de títulos e cards).
  expect(animated).toEqual(expect.arrayContaining(['opacity', 'clipPath']));
  const layout =
    /^(width|height|(min|max)[A-Z]|letterSpacing|wordSpacing|padding|margin|top|left|right|bottom|inset|fontSize|lineHeight|gap|border\w*Width)/;
  expect(animated.filter((prop) => layout.test(prop))).toEqual([]);
});

test('partículas não passam sob o texto nem os botões do hero', async ({ page }) => {
  // Semente fixa: com posições aleatórias, às vezes todas as partículas caíam dentro da máscara e o
  // canvas ficava legitimamente vazio. Com esta semente há partículas dentro e fora do conteúdo.
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.goto('./');
  // Várias amostras: as partículas se movem e a máscara precisa valer em todo quadro.
  for (let i = 0; i < 6; i++) {
    const { inside, total } = await page.evaluate(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      const origin = canvas.getBoundingClientRect();
      const box = document.querySelector('.hero__content').getBoundingClientRect();
      const alpha = (x, y, w, h) => {
        const data = ctx.getImageData(Math.round(x), Math.round(y), Math.round(w), Math.round(h)).data;
        let sum = 0;
        for (let p = 3; p < data.length; p += 4) sum += data[p];
        return sum;
      };
      return {
        inside: alpha(box.left - origin.left, box.top - origin.top, box.width, box.height),
        total: alpha(0, 0, canvas.width, canvas.height),
      };
    });
    expect(total, 'o canvas desenha partículas').toBeGreaterThan(0);
    expect(inside, `amostra ${i}`).toBe(0);
    await page.waitForTimeout(150);
  }
});

test('hero no celular: dois CTAs, currículo como link e ícones longe da seta, nos dois idiomas', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const buttons = await page.locator('.hero__buttons').boundingBox();
  for (const lang of ['pt-br', 'en']) {
    if (lang === 'en') await page.locator('#lang-toggle').click();
    // Mede a posição final, não o meio da animação de entrada.
    await page.locator('.hero__content').evaluate((el) =>
      Promise.all(
        el
          .getAnimations({ subtree: true })
          .filter((a) => a.effect.getTiming().iterations !== Infinity)
          .map((a) => a.finished),
      ),
    );
    for (const selector of ['.hero__buttons .btn--primary', '.hero__buttons a[href="#contact"]']) {
      expect(Math.round((await page.locator(selector).boundingBox()).width), `${lang} ${selector}`).toBe(
        Math.round(buttons.width),
      );
    }
    const cv = page.locator('.hero__cv');
    expect((await cv.boundingBox()).width, `${lang} CV`).toBeLessThan(buttons.width - 40);
    expect((await cv.boundingBox()).height, `${lang} CV`).toBeGreaterThanOrEqual(44);
    expect(await cv.evaluate((el) => getComputedStyle(el).borderTopColor)).toBe('rgba(0, 0, 0, 0)');

    const arrow = await page.locator('.hero__scroll-down').boundingBox();
    for (const link of await page.locator('.hero__social .social__link').all()) {
      const box = await link.boundingBox();
      expect(box.width, `${lang} social`).toBeGreaterThanOrEqual(44);
      expect(box.y + box.height, `${lang} social × seta`).toBeLessThanOrEqual(arrow.y - 16);
    }
  }
});

test('tablet (820 px): Sobre em 2 colunas, contato em 2 × 2 e nada vaza na horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('./');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(820);

  const [photo, info] = await Promise.all([
    page.locator('.about__img-wrapper').boundingBox(),
    page.locator('.about__info').boundingBox(),
  ]);
  expect(photo.x + photo.width).toBeLessThanOrEqual(info.x);

  const cards = await page.locator('.contact__card').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    }),
  );
  expect(new Set(cards.map((c) => c.y)).size).toBe(2);
  expect(new Set(cards.map((c) => c.x)).size).toBe(2);
});

test('tema alterna e persiste após recarregar', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-toggle').click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

// Registra as View Transitions e as animações de pseudo-elemento que a troca de tema dispara.
async function spyThemeTransition(page) {
  await page.addInitScript(() => {
    window.__vt = { transitions: 0, animations: [] };
    const start = document.startViewTransition?.bind(document);
    if (start) {
      document.startViewTransition = (cb) => {
        window.__vt.transitions += 1;
        return start(cb);
      };
    }
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      if (options?.pseudoElement) window.__vt.animations.push({ pseudo: options.pseudoElement, keyframes });
      return animate.call(this, keyframes, options);
    };
  });
}

test('troca de tema revela o tema novo em círculo a partir do botão (View Transitions)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await spyThemeTransition(page);
  await page.goto('./');
  const html = page.locator('html');
  const button = page.locator('#theme-toggle');
  const box = await button.boundingBox();
  await button.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect.poll(() => page.evaluate(() => window.__vt.animations.length)).toBe(1);
  const vt = await page.evaluate(() => window.__vt);
  expect(vt.transitions).toBe(1);
  expect(vt.animations[0].pseudo).toBe('::view-transition-new(root)');
  const [x, y] = vt.animations[0].keyframes.clipPath[0]
    .match(/at ([\d.]+)px ([\d.]+)px/)
    .slice(1)
    .map(Number);
  expect(x).toBeCloseTo(box.x + box.width / 2, 0);
  expect(y).toBeCloseTo(box.y + box.height / 2, 0);
  // Ao terminar, as transições de cor voltam a valer.
  await expect(html).not.toHaveClass(/theme-switching/);
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f3f9ff');
});

test('com movimento reduzido, a troca de tema é instantânea (sem View Transition)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await spyThemeTransition(page);
  await page.goto('./');
  // Clique e contagem na mesma tarefa: nenhuma transição de cor do CSS chega a começar.
  const cssTransitions = await page.evaluate(() => {
    document.getElementById('theme-toggle').click();
    return document.getAnimations().filter((a) => a instanceof CSSTransition).length;
  });
  expect(cssTransitions).toBe(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).not.toHaveClass(/theme-switching/);
  expect(await page.evaluate(() => window.__vt)).toEqual({ transitions: 0, animations: [] });
});

test('cliques rápidos durante a View Transition alternam o tema sem se atropelar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const themes = await page.evaluate(async () => {
    const button = document.getElementById('theme-toggle');
    const frame = () => new Promise(requestAnimationFrame);
    const seen = [];
    for (let i = 0; i < 5; i += 1) {
      button.click();
      await frame();
      seen.push(localStorage.getItem('theme'));
    }
    return seen;
  });
  expect(themes).toEqual(['light', 'dark', 'light', 'dark', 'light']);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).not.toHaveClass(/theme-switching/);
});
test('botão de tema descreve a ação, nos dois idiomas, e atualiza o theme-color', async ({ page }) => {
  await page.goto('./');
  const button = page.locator('#theme-toggle');
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(button).toHaveAttribute('aria-label', 'Ativar o tema claro');
  await expect(themeColor).toHaveAttribute('content', '#050a18');

  await button.click();
  await expect(button).toHaveAttribute('aria-label', 'Ativar o tema escuro');
  await expect(themeColor).toHaveAttribute('content', '#f3f9ff');

  // Trocar o idioma traduz o rótulo da ação atual, não o da ação inicial.
  await page.locator('#lang-toggle').click();
  await expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
});

test('tema claro salvo já pinta o theme-color certo antes dos módulos carregarem', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.route('**/js/**', (route) => route.abort());
  await page.goto('./');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f3f9ff');
});

test('header cabe em 320 px nos dois idiomas, com alvos de 44 px inteiros na tela', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  // Nenhuma seção pode alargar a página: no celular isso aumenta a viewport de layout e empurra o header.
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  for (const lang of ['pt-br', 'en']) {
    if (lang === 'en') await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
    for (const selector of ['.nav__logo', '#lang-toggle', '#theme-toggle', '#nav-toggle']) {
      const box = await page.locator(selector).boundingBox();
      expect(box.x, `${lang} ${selector}`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${lang} ${selector}`).toBeLessThanOrEqual(320);
      expect(box.height, `${lang} ${selector}`).toBeGreaterThanOrEqual(44);
    }
  }
});

test('todo elemento alcançado pelo Tab mostra o anel de foco, inteiro na tela, nos dois temas', async ({
  page,
}) => {
  // Cor do token resolvida pelo navegador, para comparar com a cor computada do contorno.
  const focusColor = (scope) =>
    page.evaluate((selector) => {
      const probe = document.createElement('span');
      probe.style.color = getComputedStyle(document.querySelector(selector)).getPropertyValue(
        '--color-focus',
      );
      document.body.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, scope);

  const visited = {};
  for (const theme of ['dark', 'light']) {
    await page.addInitScript((t) => localStorage.setItem('theme', t), theme);
    // Sob carga (4 workers), a cadeia de rolagens suaves do Tab passava dos 5 s do poll. Aqui importa onde o
    // foco para, não a animação.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await expect(page.locator('.github-card')).toHaveCount(SELECTED.length);
    const ring = await focusColor('html');
    const seen = new Set();
    for (let i = 0; i < 80; i += 1) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return {
          id: el.outerHTML.slice(0, 80),
          outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
        };
      });
      if (!info || seen.has(info.id)) break;
      seen.add(info.id);
      expect(info.outline, `${theme}: ${info.id}`).toBe(`solid 2px ${ring}`);
      // O foco rola o elemento até a tela: espera ele chegar inteiro, com o anel (1 px de folga: o Chrome
      // rola em pixels inteiros e pode sobrar uma fração, como 720,03 numa janela de 720).
      await expect
        .poll(
          () =>
            page.evaluate(() => {
              const el = document.activeElement;
              const box = el.getBoundingClientRect();
              const s = getComputedStyle(el);
              const ring = Math.max(0, parseFloat(s.outlineWidth) + parseFloat(s.outlineOffset));
              return (
                box.width > 0 &&
                box.left - ring >= -1 &&
                box.right + ring <= innerWidth + 1 &&
                box.top - ring >= -1 &&
                box.bottom + ring <= innerHeight + 1
              );
            }),
          { message: `${theme}: fora da tela: ${info.id}` },
        )
        .toBe(true);
    }
    visited[theme] = seen.size;
  }
  expect(visited.dark).toBeGreaterThan(10);
  expect(visited.light).toBe(visited.dark);

  // Terminal: sempre escuro, com o anel do próprio token na linha de comando.
  await page.keyboard.press('Control+Backquote');
  const input = page.locator('.terminal__input');
  await expect(input).toBeFocused();
  const terminalRing = await focusColor('.terminal');
  await expect(page.locator('.terminal__input-line')).toHaveCSS(
    'box-shadow',
    `${terminalRing} 0px 0px 0px 2px inset`,
  );

  // Com a saída rolável, o Chrome põe o corpo do terminal no Tab. O .terminal corta o que passa da
  // borda, então o anel precisa ficar para dentro.
  const body = page.locator('.terminal__body');
  for (let i = 0; i < 8; i += 1) await input.press('Enter');
  for (let i = 0; i < 6; i += 1) {
    await input.fill('help');
    await input.press('Enter');
  }
  expect(await body.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  await page.keyboard.press('Shift+Tab');
  await expect(body).toBeFocused();
  const bodyRing = await body.evaluate((el) => {
    const s = getComputedStyle(el);
    return { offset: parseFloat(s.outlineOffset), width: parseFloat(s.outlineWidth), style: s.outlineStyle };
  });
  expect(bodyRing.style).toBe('solid');
  expect(bodyRing.offset).toBeLessThanOrEqual(-bodyRing.width);
});
test('idioma alterna, traduz a página e persiste', async ({ page }) => {
  await page.goto('./');
  const html = page.locator('html');
  const role = page.locator('[data-i18n="hero.role"]');
  await expect(html).toHaveAttribute('lang', 'pt-BR');
  await expect(role).toHaveText('Desenvolvedor Backend Java');

  await page.locator('#lang-toggle').click();
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(role).toHaveText('Java Backend Developer');
  await expect(page).toHaveTitle('Pedro Braga | Portfolio');
  await expect(page.locator('#lang-toggle')).toHaveText('PT-BR');

  await page.reload();
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(role).toHaveText('Java Backend Developer');
});

test.describe('todas as páginas, servidas sob /Portfolio/ como no GitHub Pages', () => {
  for (const file of PAGES) {
    test(`${file}: sem erro nem 404, com título e descrição próprios nos dois idiomas`, async ({ page }) => {
      const errors = trackErrors(page);
      const broken = [];
      page.on('response', (res) => {
        if (res.status() >= 400) broken.push(`${res.status()} ${res.url()}`);
      });
      page.on('requestfailed', (req) => broken.push(`falhou ${req.url()}`));

      await page.goto(file === 'index.html' ? './' : file);
      const html = page.locator('html');
      const id = await html.getAttribute('data-page');
      expect(id, '<html data-page> ausente').toBeTruthy();
      const description = page.locator('meta[name="description"]');
      const expectMeta = async (lang, htmlLang) => {
        await expect(html).toHaveAttribute('lang', htmlLang);
        await expect(page).toHaveTitle(translations[lang][`page.${id}.title`]);
        await expect(description).toHaveAttribute('content', translations[lang][`page.${id}.description`]);
      };

      await expectMeta('pt-br', 'pt-BR');
      await page.locator('#lang-toggle').click();
      await expectMeta('en', 'en');
      await page.locator('#lang-toggle').click();
      await expectMeta('pt-br', 'pt-BR');

      await page.waitForLoadState('networkidle');
      expect(broken).toEqual([]);
      expect(errors).toEqual([]);
    });

    test(`${file}: skip link é o primeiro foco, aparece só com foco e leva ao conteúdo`, async ({ page }) => {
      // A 404 é servida em qualquer caminho (e tem <base>): o pulo não pode sair da página.
      await page.goto(file === '404.html' ? 'nao/existe' : file === 'index.html' ? './' : file);
      const path = new URL(page.url()).pathname;
      const skip = page.locator('.skip-link');
      const offscreen = async () => {
        const box = await skip.boundingBox();
        return box.y + box.height <= 0;
      };
      expect(await offscreen(), 'escondido sem foco').toBe(true);

      await page.keyboard.press('Tab');
      await expect(skip).toBeFocused();
      await expect(skip).toHaveText('Pular para o conteúdo');
      expect(await offscreen(), 'visível com foco').toBe(false);
      await expect(skip).toBeInViewport({ ratio: 1 });

      await page.keyboard.press('Enter');
      await expect(page.locator('main#main')).toBeFocused();
      expect(new URL(page.url()).pathname).toBe(path);
      // O próximo Tab já está dentro do conteúdo, sem passar de novo pelo menu.
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => Boolean(document.activeElement.closest('main')))).toBe(true);

      await page.locator('#lang-toggle').click();
      await expect(skip).toHaveText('Skip to content');
    });

    test(`${file}: nova aba sem opener nem referrer; botão de idioma diz o destino e contém o texto visível`, async ({
      page,
    }) => {
      await page.goto(file === 'index.html' ? './' : file);
      if (file === 'index.html') await expect(page.locator('.github-card')).toHaveCount(SELECTED.length);
      const unsafe = await page
        .locator('a[target="_blank"]')
        .evaluateAll((links) =>
          links
            .filter((a) => !a.relList.contains('noopener') || !a.relList.contains('noreferrer'))
            .map((a) => a.outerHTML.slice(0, 120)),
        );
      expect(unsafe).toEqual([]);

      // WCAG 2.5.3 (rótulo no nome): quem usa comando de voz fala o que vê ("EN", "Terminal"), então o nome contém.
      const toggle = page.locator('#lang-toggle');
      for (const [lang, visible] of [
        ['pt-br', 'EN'],
        ['en', 'PT-BR'],
      ]) {
        await expect(toggle).toHaveText(visible);
        await expect(toggle).toHaveAccessibleName(translations[lang]['nav.lang.label']);
        expect(translations[lang]['nav.lang.label'].startsWith(`${visible}:`)).toBe(true);
        const terminal = page.locator('#terminal-toggle');
        if (await terminal.count()) {
          const word = (await terminal.locator('.nav__terminal-text').textContent()).trim().toLowerCase();
          await expect(terminal).toHaveAttribute('aria-label', translations[lang]['nav.terminal.label']);
          expect(translations[lang]['nav.terminal.label'].toLowerCase()).toContain(word);
        }
        await toggle.click();
      }
      // Texto de terceiros em português (descrições dos repositórios) não herda o lang="en" da página.
      if (file === 'index.html') {
        await toggle.click();
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        const descriptions = page.locator('.github-card__desc');
        await expect(descriptions).toHaveCount(SELECTED.length - 1);
        for (const desc of await descriptions.all()) {
          await expect(desc).toHaveAttribute('lang', 'pt-BR');
        }
      }
    });
  }
});

test('endereço inexistente mostra a 404 do site em qualquer profundidade, com caminho de volta', async ({
  page,
}) => {
  const errors = trackErrors(page);
  const broken = [];
  page.on('response', (res) => {
    if (res.status() >= 400 && res.request().resourceType() !== 'document') broken.push(res.url());
  });

  const res = await page.goto('projetos/nao-existe/de-verdade');
  expect(res.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Página não encontrada');
  await expect(page.locator('[data-missing-path]').first()).toHaveText(
    '/Portfolio/projetos/nao-existe/de-verdade',
  );
  // Estilos e módulos carregados apesar do caminho profundo (o <base> resolve a partir de /Portfolio/).
  expect(await page.locator('.not-found__terminal').evaluate((el) => getComputedStyle(el).borderRadius)).toBe(
    '12px',
  );

  await page.locator('#lang-toggle').click();
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page).toHaveTitle(translations.en['page.404.title']);

  await page.locator('.not-found__link[href="index.html#projects"]').click();
  await expect(page).toHaveURL(/\/Portfolio\/index\.html#projects$/);
  await expect(page.locator('#projects .section__title')).toBeVisible();

  expect(broken).toEqual([]);
  expect(errors.filter((e) => !e.includes('404'))).toEqual([]);
});

test.describe('navegador em inglês', () => {
  test.use({ locale: 'en-US' });

  test('detecta o idioma do navegador na primeira visita', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-i18n="hero.role"]')).toHaveText('Java Backend Developer');
  });
});

// Estado visual final de um elemento: opaco e sem recorte (clip-path ausente ou inset todo zerado).
function revealState(locator) {
  return locator.evaluate((el) => {
    const style = getComputedStyle(el);
    const clip = style.clipPath;
    const insetZero = /^inset\(/.test(clip) && (clip.match(/-?[\d.]+/g) ?? []).every((n) => Number(n) === 0);
    return { opacity: style.opacity, clipped: clip !== 'none' && !insetZero };
  });
}

const VISIBLE = { opacity: '1', clipped: false };

test.describe('visibilidade das seções', () => {
  test('título e subtítulo de cada seção aparecem ao rolar', async ({ page }) => {
    await page.goto('./');
    const ids = await page
      .locator('main section[id]:has(.section__title)')
      .evaluateAll((sections) => sections.map((s) => s.id));
    expect(ids.length).toBeGreaterThan(0);

    for (const id of ids) {
      const section = page.locator(`section#${id}`);
      // Alinha o início da seção ao topo: em seções altas, centralizar deixaria o título fora da tela.
      await section.evaluate((s) => s.scrollIntoView({ block: 'start' }));
      for (const selector of ['.section__title', '.section__subtitle']) {
        const el = section.locator(selector).first();
        if ((await el.count()) === 0) continue;
        await expect(el, `${id} ${selector}`).toBeInViewport();
        await expect.poll(() => revealState(el), { message: `${id} ${selector}` }).toEqual(VISIBLE);
      }
    }
  });

  test('título da seção aparece ao navegar pelo menu', async ({ page, isMobile }) => {
    await page.goto('./');
    const hrefs = await page
      .locator('.nav__link')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.length).toBeGreaterThan(4);
    // Página nova a cada link: o salto parte do topo, com nenhuma seção ainda renderizada — o caso em que
    // uma altura estimada errada faz o scroll suave parar no lugar errado.
    for (const href of hrefs) {
      await page.goto('./');
      if (isMobile) await page.locator('#nav-toggle').click();
      await page.locator(`.nav__link[href="${href}"]`).click();
      const title = page.locator(`${href} .section__title`);
      // Inteiro na tela e abaixo do header fixo (toBeInViewport não enxerga o header cobrindo o título).
      await expect
        .poll(
          () =>
            title.evaluate((el) => {
              const t = el.getBoundingClientRect();
              const header = document.querySelector('.header').getBoundingClientRect();
              return t.top >= header.bottom && t.bottom <= window.innerHeight;
            }),
          { message: href },
        )
        .toBe(true);
      await expect.poll(() => revealState(title)).toEqual(VISIBLE);
    }
  });
});

test('menu marca só a seção atual, mesmo com o mouse parado sobre outro link', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no celular o menu fica fechado durante a rolagem');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const current = page.locator('.nav__link[aria-current="location"]');
  // O sublinhado cresce com transform: scaleX (0 = oculto).
  const underlined = () =>
    page
      .locator('.nav__link')
      .evaluateAll((links) =>
        links.filter((a) => new DOMMatrix(getComputedStyle(a, '::after').transform).a > 0).map((a) => a.hash),
      );

  await page.locator('.nav__link[href="#projects"]').click();
  await expect(current).toHaveAttribute('href', '#projects');
  await expect(current).toHaveCount(1);

  await page.locator('.nav__link[href="#experience"]').hover();
  await page.locator('#skills').evaluate((el) => el.scrollIntoView());
  await expect(current).toHaveAttribute('href', '#skills');
  await expect.poll(underlined).toEqual(['#skills']);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(current).toHaveCount(0);
});

test('animação de digitação escreve e muda o texto', async ({ page }) => {
  await page.goto('./');
  const typing = page.locator('#typing-text');
  const first = await typing.textContent();
  await expect(typing).not.toHaveText(first ?? '', { timeout: 5000 });
});

test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });
  const COMMANDS = [
    'mvn spring-boot:run',
    'docker compose up -d',
    'psql -d socialtech',
    'git push origin main',
  ];

  test('a linha de terminal do hero fica parada, e para na hora se a preferência mudar', async ({ page }) => {
    await page.goto('./');
    const typing = page.locator('#typing-text');
    await page.waitForTimeout(3000);
    await expect(typing).toHaveText('mvn spring-boot:run');
    await expect(page.locator('.hero__terminal .cursor')).toHaveCSS('animation-name', 'none');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(typing).not.toHaveText('mvn spring-boot:run', { timeout: 5000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // O change do matchMedia é assíncrono: espera o comando ficar inteiro antes de capturar.
    await expect.poll(() => typing.textContent()).toMatch(new RegExp(`^(${COMMANDS.join('|')})$`));
    const stopped = await typing.textContent();
    await page.waitForTimeout(1000);
    await expect(typing).toHaveText(stopped);
  });

  test('partículas: um quadro parado, sem loop; o loop volta e para junto com a preferência', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.__draws = 0;
      window.__dots = 0;
      const clear = CanvasRenderingContext2D.prototype.clearRect;
      CanvasRenderingContext2D.prototype.clearRect = function (...args) {
        if (this.canvas.id === 'particles-canvas') window.__draws += 1;
        return clear.apply(this, args);
      };
      const arc = CanvasRenderingContext2D.prototype.arc;
      CanvasRenderingContext2D.prototype.arc = function (...args) {
        if (this.canvas.id === 'particles-canvas') window.__dots += 1;
        return arc.apply(this, args);
      };
    });
    await page.goto('./');
    const draws = () => page.evaluate(() => window.__draws);
    await page.waitForTimeout(500);
    const still = await draws();
    expect(still).toBeGreaterThanOrEqual(1);
    // Conta as partículas desenhadas, não os pixels: no celular o texto cobre quase todo o hero e a
    // máscara pode esconder, por sorteio, todas as partículas do quadro parado.
    expect(await page.evaluate(() => window.__dots), 'o quadro parado tem partículas').toBeGreaterThan(0);
    await page.waitForTimeout(500);
    expect(await draws()).toBe(still);

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect.poll(draws).toBeGreaterThan(still + 10);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    );
    const stopped = await draws();
    await page.waitForTimeout(500);
    expect(await draws()).toBe(stopped);
  });

  test('rolagem instantânea e nada animando: seções aparecem já no estado final', async ({ page }) => {
    await page.goto('./');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    const running = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === 'running')
          .map((a) => `${a.animationName ?? a.transitionProperty} em ${a.effect.target?.className}`),
      );
    expect(await running()).toEqual([]);
    for (const arrow of await page.locator('.hero__scroll-down span').all()) {
      await expect(arrow, 'a seta do hero não pode sumir sem a animação').toHaveCSS('opacity', '1');
    }

    const jumped = await page.evaluate(() => {
      document.querySelector('.nav__link[href="#contact"]').click();
      return window.scrollY;
    });
    expect(jumped, 'o link do menu salta direto, sem rolagem suave').toBeGreaterThan(500);
    const frames = () =>
      page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
      );
    await page.evaluate(() => window.scrollTo(0, 0));
    for (let i = 0; i < 60; i += 1) {
      const atEnd = await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight / 2);
        return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      });
      await frames();
      expect(await running(), `rolagem em ${await page.evaluate(() => window.scrollY)}`).toEqual([]);
      if (atEnd) break;
    }
    await expect(page.locator('.animate:not(.animate--visible)')).toHaveCount(0);
    await expect(page.locator('section:has(.section__title):not(.section--revealed)')).toHaveCount(0);

    await page.locator('.project-card').first().hover();
    expect(await running()).toEqual([]);
  });
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
]) {
  test(`primeira dobra (${viewport.width}×${viewport.height}): quem, cargo, proposta, prova e CTA sem rolar`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('./');
    await page.locator('.hero__content').evaluate((el) =>
      Promise.all(
        el
          .getAnimations({ subtree: true })
          .filter((a) => a.effect.getTiming().iterations !== Infinity)
          .map((a) => a.finished),
      ),
    );
    for (const selector of [
      '.hero__status',
      '.hero__name',
      '.hero__role',
      '.hero__description',
      '.hero__proof',
      '.hero__buttons .btn--primary',
    ]) {
      const box = await page.locator(selector).boundingBox();
      expect(box.y + box.height, selector).toBeLessThanOrEqual(viewport.height);
    }
  });
}

test('prova do hero leva ao card do SocialTech', async ({ page }) => {
  await page.goto('./');
  await page.locator('.hero__proof').click();
  await expect(page).toHaveURL(/#socialtech$/);
  await expect(page.locator('#socialtech .project-card__title')).toBeInViewport();
});

test('cards de projeto: sem filtros, links com ícone + texto e nome acessível que contém o texto', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.projects__filters')).toHaveCount(0);
  const titles = await page
    .locator('.project-card__title')
    .evaluateAll((els) => els.map((el) => el.firstChild.textContent.trim()));
  expect(titles).toEqual([
    'SocialTech',
    'Carteira API',
    'ERP Acadêmico',
    'Campo Minado Multiplayer',
    'Painel Semanal',
  ]);

  const check = async (lang) => {
    const links = await page.locator('.project-card__links a').evaluateAll((els) =>
      els.map((a) => ({
        href: a.href,
        cls: a.className,
        svg: !!a.querySelector('svg[aria-hidden="true"]'),
        text: a.querySelector('span')?.textContent.trim() ?? '',
        label: a.getAttribute('aria-label') ?? '',
      })),
    );
    expect(links.length, lang).toBe(7);
    for (const link of links) {
      expect(link.cls, link.href).toBe('project-card__link');
      expect(link.svg, link.href).toBe(true);
      expect(link.text, link.href).not.toBe('');
      // WCAG 2.5.3: o nome acessível começa pelo texto visível.
      expect(link.label.toLowerCase().startsWith(link.text.toLowerCase()), `${lang} ${link.label}`).toBe(
        true,
      );
    }
  };
  await check('pt');

  const painel = page.locator('.project-card').last();
  const hrefs = await painel.locator('a').evaluateAll((links) => links.map((a) => a.href));
  expect(hrefs).toEqual([
    'https://github.com/Blima-P/painel-semanal',
    'https://blima-p.github.io/painel-semanal/',
  ]);

  await page.locator('#lang-toggle').click();
  await expect(painel.locator('.project-card__title')).toHaveText('Weekly Dashboard');
  await check('en');
});
test('SocialTech abre a grade em destaque, com código, site no ar e prova linkada', async ({ page }) => {
  await page.goto('./');
  const featured = page.locator('.project-card').first();
  await expect(featured).toHaveClass(/project-card--featured/);
  await expect(featured.locator('.project-card__title')).toContainText('SocialTech');
  const hrefs = await featured.locator('a').evaluateAll((links) => links.map((a) => a.href));
  expect(hrefs).toEqual(
    expect.arrayContaining([
      'https://github.com/Blima-P/SocialTech',
      'https://blima-p.github.io/SocialTech/',
      expect.stringContaining('/SocialTech/pulls?q=is%3Apr+is%3Amerged+author%3ABlima-P'),
    ]),
  );
  // Ocupa a linha inteira da grade.
  const [card, grid] = await Promise.all([
    featured.boundingBox(),
    page.locator('.projects__grid').boundingBox(),
  ]);
  expect(Math.round(card.width)).toBe(Math.round(grid.width));

  await page.locator('#lang-toggle').click();
  await expect(featured.locator('.project-card__badge')).toHaveText('Completed · live');
});

const CASE_STUDIES = [
  {
    title: 'Carteira API',
    file: 'carteira-api.html',
    link: 'Ver estudo de caso da Carteira API',
    diagram: ['Arquitetura da Carteira API', 'Carteira API architecture'],
    links: /^https:\/\/github\.com\/Blima-P\/carteira-api(\/|#|$)/,
  },
  {
    title: 'SocialTech',
    file: 'socialtech.html',
    link: 'Ver estudo de caso do SocialTech',
    diagram: ['Fluxo de entrega do SocialTech', 'SocialTech delivery flow'],
    links: /^https:\/\/(github\.com\/Blima-P\/SocialTech|blima-p\.github\.io\/SocialTech)(\/|#|\?|$)/,
  },
];

for (const study of CASE_STUDIES) {
  test(`estudo de caso ${study.title}: card leva à página, diagrama acessível e volta aos projetos`, async ({
    page,
  }) => {
    await page.goto('./');
    const card = page.locator('.project-card', { hasText: study.title });
    await card.getByRole('link', { name: study.link }).click();
    await expect(page).toHaveURL(new RegExp(`/Portfolio/projetos/${study.file.replace('.', '\\.')}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(study.title);
    await expect(page.getByRole('img', { name: study.diagram[0] })).toBeVisible();

    // Toda evidência aponta para o próprio projeto, em nova aba segura.
    const external = await page
      .locator('main a[href^="http"]')
      .evaluateAll((links) => links.map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
    expect(external.length).toBeGreaterThan(10);
    for (const link of external) {
      expect(link.href).toMatch(study.links);
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    }

    // Nada vaza na horizontal, em nenhum dos viewports testados.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    await page.locator('#lang-toggle').click();
    await expect(page.getByRole('img', { name: study.diagram[1] })).toBeVisible();
    await page.locator('#lang-toggle').click();

    await page.locator('.case__back').first().click();
    await expect(page).toHaveURL(/\/Portfolio\/(index\.html)?#projects$/);
  });
}

test('faixa de provas do Sobre: 4 links seguros para evidências no GitHub, sem vazar no celular', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('./');
  const links = page.locator('.about__proofs a');
  await expect(links).toHaveCount(4);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/Blima-P\//);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);

  await page.locator('#lang-toggle').click();
  await expect(page.locator('.about__proofs-title')).toHaveText('Proof in the code');
  await expect(links.nth(2).locator('strong')).toHaveText('Concurrency');
});

test('competências: 4 grupos, cada item com nível e link de evidência, nos dois idiomas', async ({
  page,
}) => {
  await page.goto('./');
  await expect(page.locator('.skill-group')).toHaveCount(4);
  const skills = page.locator('.skill');
  const total = await skills.count();
  expect(total).toBeGreaterThanOrEqual(8);
  for (const skill of await skills.all()) {
    await expect(skill.locator('.skill__level')).toHaveText(/^(no ar|em projeto|estudando)$/);
    await expect(skill.locator('a.skill__evidence')).toHaveAttribute(
      'href',
      /^https:\/\/(github\.com|blima-p\.github\.io)\//,
    );
    await expect(skill.locator('a.skill__evidence')).toHaveAttribute('rel', /noopener/);
  }

  await page.locator('#lang-toggle').click();
  await expect(page.locator('.skill__level').first()).toHaveText(/^(live|in a project|learning)$/);
  await expect(page.locator('.skill-group__title').nth(3)).toHaveText('DevOps and tools');
});

test('terminal abre com Ctrl+`, executa help, fecha com Esc e devolve o foco', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('./');
  const trigger = page.locator('#lang-toggle');
  await trigger.focus();
  await page.keyboard.press('Control+Backquote');
  const dialog = page.getByRole('dialog', { name: 'Terminal do portfólio' });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
  await expect(dialog.getByRole('log')).toHaveAttribute('aria-live', 'polite');

  const input = dialog.getByRole('textbox', { name: 'Comando' });
  await expect(input).toBeFocused();
  await input.fill('help');
  await input.press('Enter');
  await expect(page.locator('.terminal__line--response').first()).toContainText('Comandos disponíveis');

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  // Reaberto em inglês, o título e os rótulos acompanham o idioma.
  await trigger.click();
  await page.keyboard.press('Control+Backquote');
  await expect(page.getByRole('dialog', { name: 'Portfolio terminal' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close terminal' })).toBeVisible();
  await page.getByRole('button', { name: 'Close terminal' }).click();
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test('terminal: histórico com ↑/↓, Tab completa só com correspondência e clique fora fecha', async ({
  page,
}) => {
  await page.goto('./');
  await page.keyboard.press('Control+Backquote');
  const dialog = page.getByRole('dialog');
  const input = dialog.getByRole('textbox');
  const log = dialog.getByRole('log');

  await input.fill('he');
  await input.press('Tab');
  await expect(input).toHaveValue('help');
  await input.press('Enter');
  await input.fill('pro');
  await input.press('Tab');
  await expect(input).toHaveValue('projects');
  await input.press('Enter');

  // Prefixo com várias opções: lista as opções e o foco fica no campo.
  await input.fill('c');
  await input.press('Tab');
  await expect(input).toBeFocused();
  await expect(log.locator('.terminal__line--system').last()).toHaveText('contact  cv  clear');

  await input.fill('rascunho');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('projects');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('help');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('help');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('projects');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('rascunho');

  // Sem correspondência (ou vazio), Tab e Shift+Tab seguem o foco do diálogo — nada de armadilha.
  await input.press('Tab');
  await expect(input).not.toBeFocused();
  await input.fill('');
  await input.press('Shift+Tab');
  await expect(input).not.toBeFocused();
  await expect(dialog).toBeVisible();

  // Arrastar uma seleção do texto para fora não fecha; clique no fundo fecha.
  const line = await log.locator('.terminal__line--response').first().boundingBox();
  await page.mouse.move(line.x + 5, line.y + 5);
  await page.mouse.down();
  await page.mouse.move(5, 5, { steps: 5 });
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test('terminal: "exit" fecha e devolve o foco sem acionar o gatilho', async ({ page }) => {
  await page.goto('./');
  const trigger = page.locator('#lang-toggle');
  await trigger.focus();
  await page.keyboard.press('Control+Backquote');
  const input = page.getByRole('dialog').getByRole('textbox');
  await input.fill('exit');
  await input.press('Enter');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
});

test('impressão vira currículo de até 2 folhas A4, sem o que é interativo ou decorativo', async ({
  page,
}) => {
  const sheets = async () => {
    const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true });
    return pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g).length;
  };
  await page.goto('./');
  await page.emulateMedia({ media: 'print' });
  for (const selector of ['#header', '#particles-canvas', '.hero__buttons', '#github', '#copy-email']) {
    await expect(page.locator(selector), selector).toBeHidden();
  }
  // O que só aparece ao rolar (títulos e cards) sai inteiro, e o nome não depende de fundo impresso.
  await expect(page.locator('#contact .section__title')).toHaveCSS('opacity', '1');
  await expect(page.locator('.project-card').last()).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero__name-gradient')).toHaveCSS('-webkit-text-fill-color', 'rgb(17, 24, 39)');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const linkedin = page.locator('.contact__card[href*="linkedin"]');
  expect(await linkedin.evaluate((el) => getComputedStyle(el, '::after').content)).toContain(
    'https://www.linkedin.com/in/pedrobragadelima/',
  );
  // Selo verde "no ar" com contraste no branco (o verde do tema escuro tinha 1,7:1).
  await expect(page.locator('.skill__level--live').first()).toHaveCSS('color', 'rgb(21, 128, 61)');
  expect(await sheets()).toBeLessThanOrEqual(2);

  await page.emulateMedia({ media: 'screen' });
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  // O tema troca dentro da View Transition: espera ela terminar antes de imprimir.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).not.toHaveClass(/theme-switching/);
  await page.emulateMedia({ media: 'print' }); // o page.pdf respeita a mídia emulada
  expect(await sheets()).toBeLessThanOrEqual(2);
});
test('terminal abre pelo botão >_ (no menu do celular, inclusive em 320 px) e devolve o foco a ele', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('./');
  await page.locator('#nav-toggle').click();
  const button = page.getByRole('button', { name: 'Abrir o terminal' });
  await expect(button).toHaveText('>_Terminal');
  // O painel desliza da direita: espera ele parar antes de medir.
  await expect
    .poll(async () => {
      const b = await button.boundingBox();
      return b.x + b.width;
    })
    .toBeLessThanOrEqual(320);
  expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Terminal do portfólio' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox').fill('whoami');
  await dialog.getByRole('textbox').press('Enter');
  await expect(dialog.getByRole('log')).toContainText('visitante');
  // Clicar dentro do terminal não fecha o menu por trás, então o foco tem para onde voltar.
  await dialog.getByRole('log').click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload();
  await expect(page.locator('#terminal-toggle')).toBeVisible();
  await expect(page.locator('#terminal-toggle .nav__terminal-text')).toBeHidden();
});

test('menu do celular em tela baixa (320×568): nenhum item fica atrás do header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('./');
  await page.locator('#nav-toggle').click();
  const items = page.locator('.nav__list > li > :is(a, button)');
  await expect(items).toHaveCount(7);
  await expect
    .poll(async () => (await page.locator('.nav__list').boundingBox()).x)
    .toBeLessThanOrEqual(320 - 213);
  for (const item of await items.all()) {
    await item.scrollIntoViewIfNeeded();
    const hit = await item.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    });
    expect(hit, await item.textContent()).toBe(true);
  }
});
test('Ctrl+K abre e fecha o terminal, mas não rouba o atalho de um campo de texto da página', async ({
  page,
}) => {
  await page.goto('./');
  const dialog = page.getByRole('dialog');
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox')).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeHidden();

  await page.evaluate(() => {
    const field = document.createElement('input');
    field.id = 'campo-teste';
    document.body.prepend(field);
  });
  await page.locator('#campo-teste').focus();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeHidden();
});

test('terminal: whoami, theme, lang, email, cv e open com Tab nos argumentos', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog');
  const input = dialog.getByRole('textbox');
  const log = dialog.getByRole('log');
  const run = async (cmd) => {
    await input.fill(cmd);
    await input.press('Enter');
  };

  await run('theme');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(log).toContainText('Tema claro ativado.');
  await run('theme dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await run('theme azul');
  await expect(log.locator('.terminal__line--error').last()).toHaveText('Uso: theme [light|dark]');

  await run('email');
  await expect(log).toContainText('E-mail copiado: pbl0812@gmail.com');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pbl0812@gmail.com');

  await run('lang en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('dialog', { name: 'Portfolio terminal' })).toBeVisible();
  await expect(log).toContainText('Language: English.');
  // No Chromium headless o PDF vira download e a URL do popup não muda; vale a requisição feita por ele.
  const popup = page.waitForEvent('popup');
  const pdfRequest = context.waitForEvent('request', (req) =>
    req.url().endsWith('/assets/cv/pedro-braga-cv-en.pdf'),
  );
  await run('cv');
  await pdfRequest;
  await (await popup).close();
  await expect(log.getByRole('link', { name: 'Opening the resume (PDF)…' })).toHaveAttribute(
    'href',
    'assets/cv/pedro-braga-cv-en.pdf',
  );
  await run('lang');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');

  await run('open');
  await expect(log.locator('.terminal__line--system').last()).toContainText('socialtech, carteira-api');
  await input.fill('op');
  await input.press('Tab');
  await expect(input).toHaveValue('open ');
  await input.type('car');
  await input.press('Tab');
  await expect(input).toHaveValue('open carteira-api');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/projetos\/carteira-api\.html$/);
});

test('cada destino do "open" do terminal também está nos cards de projeto', async ({ page }) => {
  await page.goto('./');
  const targets = await page.evaluate(async () => Object.values((await import('./js/terminal.js')).PROJECTS));
  expect(targets.length).toBe(5);
  for (const url of targets) await expect(page.locator(`#projects a[href="${url}"]`).first()).toBeAttached();
});
test('terminal lista todos os projetos da página e o LinkedIn canônico', async ({ page }) => {
  await page.goto('./');
  const titles = await page
    .locator('.project-card__title')
    .evaluateAll((els) => els.map((el) => el.firstChild.textContent.trim()));
  expect(titles.length).toBeGreaterThan(0);

  await page.keyboard.press('Control+Backquote');
  const input = page.locator('.terminal__input');
  const responses = page.locator('.terminal__body');
  await input.fill('projects');
  await input.press('Enter');
  for (const title of titles) await expect(responses).toContainText(title);

  await input.fill('contact');
  await input.press('Enter');
  await expect(responses).toContainText('linkedin.com/in/pedrobragadelima');
});

test('títulos das seções são diretos e iguais ao menu, nos dois idiomas', async ({ page }) => {
  await page.goto('./');
  const pairs = () =>
    page
      .locator('.nav__link')
      .evaluateAll((links) =>
        links.map((a) => [
          a.textContent.trim(),
          document.querySelector(`${a.hash} .section__title`).textContent.trim(),
        ]),
      );
  for (const [nav, title] of await pairs()) expect(title).toBe(nav);
  await page.locator('#lang-toggle').click();
  await expect(page.locator('#about .section__title')).toHaveText('About');
  for (const [nav, title] of await pairs()) expect(title).toBe(nav);
});

test('rodapé: autoria, código-fonte, data de atualização e voltar ao topo', async ({ page }) => {
  await page.goto('./');
  const footer = page.locator('.footer');
  await expect(footer.locator('.footer__meta li')).toHaveText([
    /^© \d{4} Pedro Braga de Lima$/,
    'feito à mão, sem frameworks',
    'código-fonte',
    /^atualizado em \d{2}\/\d{4}$/,
  ]);
  const source = footer.getByRole('link', { name: 'código-fonte' });
  await expect(source).toHaveAttribute('href', 'https://github.com/Blima-P/Portfolio');
  await expect(source).toHaveAttribute('rel', 'noopener noreferrer');
  // O <time> legível por máquina bate com o texto exibido.
  const time = footer.locator('time[data-updated]');
  const [year, month] = (await time.getAttribute('datetime')).split('-');
  await expect(time).toHaveText(`${month}/${year}`);

  await footer.getByRole('link', { name: 'Voltar ao topo' }).click();
  await expect(page).toHaveURL(/#home$/);
  await page.locator('#lang-toggle').click();
  await expect(footer.getByRole('link', { name: 'Back to top' })).toBeVisible();
  await expect(footer.locator('.footer__meta')).toContainText('handmade, no frameworks');
});

test('falha na API do GitHub mostra mensagem traduzível', async ({ page }) => {
  await page.unroute(GITHUB_API);
  await page.route(GITHUB_API, (route) => route.fulfill({ status: 403, body: '{}' }));
  await page.goto('./');
  const fallback = page.locator('.github__fallback');
  await expect(fallback).toContainText('Não foi possível carregar');
  await page.locator('#lang-toggle').click();
  await expect(fallback).toContainText('Could not load repositories');
});

test('currículo em PDF acompanha o idioma e está disponível', async ({ page, request }) => {
  await page.goto('./');
  const cvLinks = page.locator('a[data-i18n="cv.href"]');
  await expect(cvLinks).toHaveCount(2);

  for (const [lang, file] of [
    ['pt-BR', 'pedro-braga-cv-ptbr.pdf'],
    ['en', 'pedro-braga-cv-en.pdf'],
  ]) {
    if (lang === 'en') await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    const hrefs = await cvLinks.evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs, lang).toEqual([`assets/cv/${file}`, `assets/cv/${file}`]);
    for (const href of new Set(hrefs)) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
      expect(res.headers()['content-type']).toContain('application/pdf');
    }
  }
});

test('e-mail visível copia para a área de transferência e anuncia o resultado', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./');
  await expect(page.locator('#contact-email')).toHaveText('pbl0812@gmail.com');
  await page.locator('#copy-email').click();
  await expect(page.locator('#copy-email-status')).toHaveText('E-mail copiado para a área de transferência.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pbl0812@gmail.com');

  await page.locator('#lang-toggle').click();
  await expect(page.locator('#copy-email')).toHaveText('Copy email');
});

test('sem Clipboard API nem execCommand, o e-mail fica selecionado com instrução', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined });
    document.execCommand = () => false;
  });
  await page.goto('./');
  await page.locator('#copy-email').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#copy-email-status')).toContainText('Ctrl+C');
  expect(await page.evaluate(() => window.getSelection().toString())).toBe('pbl0812@gmail.com');
  await expect(page.locator('#copy-email')).toBeFocused();
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'Menu hambúrguer só existe no mobile');

  test('menu abre e fecha ao escolher uma seção', async ({ page }) => {
    await page.goto('./');
    const list = page.locator('#nav-list');
    await page.locator('#nav-toggle').click();
    await expect(list).toHaveClass(/open/);
    await list.locator('.nav__link[href^="#"]').first().click();
    await expect(list).not.toHaveClass(/open/);
  });
});

test('menu hambúrguer pelo teclado: aria-expanded, fechado fora do Tab, Esc devolve o foco', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('./');
  const toggle = page.getByRole('button', { name: 'Menu' });
  const list = page.locator('#nav-list');
  const firstLink = list.getByRole('link', { name: 'Sobre' });
  await expect(toggle).toHaveAttribute('aria-controls', 'nav-list');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(list).toHaveJSProperty('inert', true);

  // Fechado: do logo o Tab vai direto às ações do header, sem passar pelos links escondidos.
  await page.locator('.nav__logo').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#lang-toggle')).toBeFocused();

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(list).toHaveJSProperty('inert', false);
  await expect(firstLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(list.getByRole('link', { name: 'Experiência' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(list).not.toHaveClass(/open/);
  await expect(toggle).toBeFocused();

  // Sair do header com o Tab também fecha: o painel não fica cobrindo o conteúdo focado.
  await page.keyboard.press('Enter');
  await expect(firstLink).toBeFocused();
  await toggle.focus();
  await page.keyboard.press('Tab');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(list).toHaveJSProperty('inert', true);

  await page.locator('#lang-toggle').click();
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();

  // Terminal aberto pelo menu, tela redimensionada através do ponto de quebra: o foco ainda volta ao >_.
  await toggle.click();
  const terminalButton = page.locator('#terminal-toggle');
  await terminalButton.click();
  // O terminal é carregado sob demanda: sem esperar, o Esc podia chegar antes do diálogo abrir.
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(list).toHaveJSProperty('inert', false);
  await expect(list.getByRole('link', { name: 'About' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 800 });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(terminalButton).toBeFocused();
});
