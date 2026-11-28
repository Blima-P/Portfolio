// Acessibilidade automática (axe-core, regras WCAG 2.2 A/AA): todas as páginas nos 2 temas e 2 idiomas,
// mais os estados abertos (menu do celular e terminal). Qualquer violação falha o teste. Também o reflow
// (WCAG 1.4.10) de cada página, que o axe não mede.
import { fileURLToPath } from 'node:url';

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { listPages } from '../scripts/pages.mjs';

const PAGES = await listPages(fileURLToPath(new URL('..', import.meta.url)));
const THEMES = ['dark', 'light'];
const LANGS = ['pt-br', 'en'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Sem rede nem limite de requisições: dois repositórios fixos, com e sem descrição.
const REPOS = ['SocialTech', 'carteira-api'].map((name, i) => ({
  name,
  html_url: `https://github.com/Blima-P/${name}`,
  description: i === 0 ? 'Descrição do repositório' : '',
  language: i === 0 ? 'Astro' : 'Java',
  stargazers_count: i,
  fork: false,
  archived: false,
}));

// Movimento reduzido: o contraste é medido no estado final, não no meio de um reveal.
test.use({ reducedMotion: 'reduce' });

test.beforeEach(async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: REPOS }));
});

async function open(page, file, theme, lang) {
  await page.addInitScript(
    ([t, l]) => {
      localStorage.setItem('theme', t);
      localStorage.setItem('portfolio-lang', l);
    },
    [theme, lang],
  );
  await page.goto(file === 'index.html' ? './' : file);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  await expect(page.locator('html')).toHaveAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
  await page.waitForLoadState('networkidle');
  // Os reveals só acontecem ao entrar na tela: percorre a página para o axe ver tudo visível.
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const end = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    while (!end()) {
      window.scrollBy(0, window.innerHeight / 2);
      await frame();
    }
    window.scrollTo(0, 0);
    await frame();
  });
}

async function expectNoViolations(page, include) {
  let builder = new AxeBuilder({ page }).withTags(TAGS);
  if (include) builder = builder.include(include);
  const { violations } = await builder.analyze();
  const report = violations.map(
    ({ id, impact, nodes }) => `${id} (${impact}): ${nodes.map((n) => n.target.join(' ')).join(' | ')}`,
  );
  expect(report).toEqual([]);
}

for (const file of PAGES) {
  // WCAG 1.4.10: zoom de 400% numa janela de 1280×1024 equivale a 320×256 px de CSS; 200%, a 640×512.
  // Mede cada fragmento de texto renderizado (não a caixa do elemento, que pode caber com o texto
  // vazando): nada fora da tela nem cortado por um ancestral com overflow. O site não tem conteúdo que
  // exija layout em 2 dimensões (tabela, código, mapa), então nenhuma área rolável é exceção.
  for (const lang of LANGS) {
    test(`reflow: ${file} a 320 px e 640 px de largura, ${lang}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'a janela é definida aqui; basta um projeto');
      await page.setViewportSize({ width: 320, height: 256 });
      await open(page, file, 'dark', lang);
      for (const [width, height] of [
        [320, 256],
        [640, 512],
      ]) {
        await page.setViewportSize({ width, height });
        const result = await page.evaluate((w) => {
          const found = [];
          let inMain = 0;
          const skip = '[inert], [aria-hidden="true"], dialog:not([open]), .skip-link';
          const fits = (rect, box) => rect.left >= box.left - 1 && rect.right <= box.right + 1;
          const clippers = (el) => {
            const boxes = [];
            for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
              if (getComputedStyle(a).overflowX === 'visible') continue;
              const { left } = a.getBoundingClientRect();
              boxes.push({ left: left + a.clientLeft, right: left + a.clientLeft + a.clientWidth, a });
            }
            return boxes;
          };
          const check = (rect, el, label) => {
            if (!rect.width) return;
            const boxes = [{ left: 0, right: w, a: 'tela' }, ...clippers(el)];
            const box = boxes.find((b) => !fits(rect, b));
            if (box) {
              const where = box.a === 'tela' ? 'tela' : `${box.a.tagName}.${box.a.className}`;
              found.push(`${label} [${Math.round(rect.left)}, ${Math.round(rect.right)}] fora de ${where}`);
            }
          };
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const range = document.createRange();
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const el = node.parentElement;
            if (
              !node.textContent.trim() ||
              el.closest(skip) ||
              !el.checkVisibility({ visibilityProperty: true })
            )
              continue;
            range.selectNodeContents(node);
            const rects = [...range.getClientRects()].filter((r) => r.width);
            if (el.closest('main')) inMain += rects.length;
            for (const rect of rects) check(rect, el, `"${node.textContent.trim().slice(0, 30)}"`);
          }
          for (const media of document.querySelectorAll('body img, body svg, body video, body iframe')) {
            if (media.closest(skip) || media.parentElement.closest('svg')) continue;
            if (!media.checkVisibility({ visibilityProperty: true })) continue;
            check(media.getBoundingClientRect(), media.parentElement, `<${media.tagName.toLowerCase()}>`);
          }
          const hidden = [
            ...document.querySelectorAll(
              '.animate:not(.animate--visible), section:has(.text-reveal, .subtitle-reveal):not(.section--revealed)',
            ),
            ...[...document.querySelectorAll('.animate, .text-reveal, .subtitle-reveal')].filter(
              (el) => getComputedStyle(el).opacity !== '1',
            ),
          ].map((el) => `${el.tagName}.${el.className} não revelado`);
          return { scroll: document.documentElement.scrollWidth, found: [...found, ...hidden], inMain };
        }, width);
        expect(result.inMain, `${width}px: texto do main visível`).toBeGreaterThan(5);
        expect({ scroll: result.scroll, found: result.found }, `${width}px`).toEqual({
          scroll: width,
          found: [],
        });
      }
    });
  }

  for (const theme of THEMES) {
    for (const lang of LANGS) {
      test(`axe: ${file}, tema ${theme}, ${lang}`, async ({ page }) => {
        await open(page, file, theme, lang);
        await expectNoViolations(page);
      });
    }
  }
}

for (const theme of THEMES) {
  // O axe não mede texto sobre pseudo-elemento com fundo (o glow do hero, a linha do tempo), sobre o
  // canvas das partículas nem texto em degradê, e devolve "incompleto". O glow é um degradê radial do
  // fundo até um pico: troca-o pela cor sólida do pico (cada glow e os dois sobrepostos) — se o texto
  // passa nos extremos, passa em todo o degradê. A linha do tempo (2 px, fora do texto) e as partículas
  // (pontos esparsos, decorativos) só são escondidas. O nome em degradê é medido aqui, amostrando o
  // degradê contra o mesmo fundo.
  test(`axe: contraste do hero sob o glow e das datas da linha do tempo, tema ${theme}`, async ({ page }) => {
    await open(page, 'index.html', theme, 'pt-br');
    for (const layers of [[], ['--hero-glow-1'], ['--hero-glow-2'], ['--hero-glow-1', '--hero-glow-2']]) {
      const name = await page.evaluate((tokens) => {
        const rgba = (css) => {
          const probe = document.createElement('i');
          probe.style.color = css;
          document.body.append(probe);
          const [r, g, b, a = 1] = getComputedStyle(probe)
            .color.match(/[\d.]+/g)
            .map(Number);
          probe.remove();
          return { r, g, b, a };
        };
        const over = (top, under) =>
          Object.fromEntries(['r', 'g', 'b'].map((c) => [c, top[c] * top.a + under[c] * (1 - top.a)]));
        // No CSS a primeira camada listada fica por cima: compõe de baixo para cima.
        let base = rgba('var(--color-bg)');
        for (const token of [...tokens].reverse()) base = over(rgba(`var(${token})`), base);
        // Folha construída pelo CSSOM: a CSP da página (style-src 'self') bloqueia <style> injetado.
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`.hero::before, .timeline__line::before, .hero__particles { display: none !important; }
          .hero { background: rgb(${base.r} ${base.g} ${base.b}) !important; }`);
        document.adoptedStyleSheets = [sheet];

        const luminance = (c) =>
          ['r', 'g', 'b']
            .map((k) => c[k] / 255)
            .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
        const el = document.querySelector('.hero__name-gradient');
        const css = getComputedStyle(el);
        const stops = [...css.backgroundImage.matchAll(/rgba?\(([^)]+)\)\s*([\d.]+)%/g)].map(
          ([, rgb, at]) => {
            const [r, g, b, a = 1] = rgb.split(/[\s,/]+/).map(Number);
            return { r, g, b, a, at: Number(at) };
          },
        );
        const bg = luminance(base);
        let min = Infinity;
        // Interpola em alfa pré-multiplicado (como o navegador) e compõe sobre o fundo; inclui as pontas.
        const STEPS = 20;
        for (let i = 1; i < stops.length; i++) {
          for (let step = 0; step <= STEPS; step++) {
            const t = step / STEPS;
            const [from, to] = [stops[i - 1], stops[i]];
            const a = from.a + (to.a - from.a) * t;
            const c = { a };
            for (const k of ['r', 'g', 'b']) {
              c[k] = a ? (from[k] * from.a + (to[k] * to.a - from[k] * from.a) * t) / a : 0;
            }
            const fg = luminance(over(c, base));
            min = Math.min(min, (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05));
          }
        }
        const size = parseFloat(css.fontSize);
        const large = size >= 24 || (size >= 18.66 && Number(css.fontWeight) >= 700);
        return { stops: stops.length, ok: min >= (large ? 3 : 4.5), min: Math.round(min * 100) / 100 };
      }, layers);
      expect(name.stops, 'degradê do nome deveria ter cores').toBeGreaterThanOrEqual(2);
      expect(name.ok, `contraste mínimo do nome ${name.min} com ${layers.join('+') || 'fundo'}`).toBe(true);
      const { violations, incomplete } = await new AxeBuilder({ page })
        .include('.hero')
        .include('.timeline')
        .exclude('.hero__name-gradient')
        .withTags(TAGS)
        .analyze();
      const undecided = incomplete
        .filter(({ id }) => id === 'color-contrast')
        .flatMap(({ nodes }) => nodes)
        .filter((n) => !/non-text characters/.test(n.any[0]?.message))
        .map((n) => `${n.target.join(' ')}: ${n.any[0]?.message}`);
      const report = violations.map(
        ({ id, nodes }) => `${id}: ${nodes.map((n) => n.target.join(' ')).join(' | ')}`,
      );
      expect({ layers, report, undecided }).toEqual({ layers, report: [], undecided: [] });
    }
  });

  test(`axe: menu do celular aberto, tema ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, 'index.html', theme, 'pt-br');
    await page.locator('#nav-toggle').click();
    await expect(page.locator('#nav-list')).toHaveClass(/open/);
    await expectNoViolations(page);
  });

  test(`axe: terminal aberto com saída, tema ${theme}`, async ({ page }) => {
    await open(page, 'index.html', theme, 'en');
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox').fill('help');
    await dialog.getByRole('textbox').press('Enter');
    await dialog.getByRole('textbox').fill('comando-que-nao-existe');
    await dialog.getByRole('textbox').press('Enter');
    await expect(dialog.getByRole('log')).toContainText('comando-que-nao-existe');
    await expectNoViolations(page, '.terminal-dialog');
  });
}
