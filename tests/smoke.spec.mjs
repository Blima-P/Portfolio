// Smoke test: garante que o site carrega sem erros e que as interações principais funcionam.
import { expect, test } from '@playwright/test';

const SELECTED = ['carteira-api', 'ERP-Academico', 'Campo-minado', 'Portfolio'];
const GITHUB_API = 'https://api.github.com/**';

// Resposta fixa da API do GitHub: evita depender de rede e do limite de requisições no CI.
const mockRepos = SELECTED.map((name, i) => ({
  name,
  html_url: `https://github.com/Blima-P/${name}`,
  description: i === 0 ? '' : `Descrição de ${name}`,
  language: 'Java',
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
  await page.goto('/');
  await expect(page.locator('.github-card')).toHaveCount(SELECTED.length);
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
  await page.goto('/');
  const target = await page.evaluate(() => {
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    return el?.tagName;
  });
  expect(target).not.toBe('CANVAS');
});

test('tema alterna e persiste após recarregar', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await page.locator('#theme-toggle').click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('botão de tema descreve a ação, nos dois idiomas, e atualiza o theme-color', async ({ page }) => {
  await page.goto('/');
  const button = page.locator('#theme-toggle');
  const themeColor = page.locator('meta[name="theme-color"]');
  await expect(button).toHaveAttribute('aria-label', 'Ativar o tema claro');
  await expect(themeColor).toHaveAttribute('content', '#0b0d12');

  await button.click();
  await expect(button).toHaveAttribute('aria-label', 'Ativar o tema escuro');
  await expect(themeColor).toHaveAttribute('content', '#fafaf7');

  // Trocar o idioma traduz o rótulo da ação atual, não o da ação inicial.
  await page.locator('#lang-toggle').click();
  await expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
});

test('tema claro salvo já pinta o theme-color certo antes dos módulos carregarem', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme', 'light'));
  await page.route('**/js/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fafaf7');
});

test('header cabe em 320 px nos dois idiomas, com alvos de 44 px inteiros na tela', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
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

test('idioma alterna, traduz a página e persiste', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const iam = page.locator('[data-i18n="hero.iam"]');
  await expect(html).toHaveAttribute('lang', 'pt-BR');
  await expect(iam).toHaveText('Eu sou');

  await page.locator('#lang-toggle').click();
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(iam).toHaveText('I am');
  await expect(page).toHaveTitle('Pedro Braga | Portfolio');
  await expect(page.locator('#lang-toggle')).toHaveText('PT-BR');

  await page.reload();
  await expect(html).toHaveAttribute('lang', 'en');
  await expect(iam).toHaveText('I am');
});

test.describe('navegador em inglês', () => {
  test.use({ locale: 'en-US' });

  test('detecta o idioma do navegador na primeira visita', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-i18n="hero.iam"]')).toHaveText('I am');
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
    await page.goto('/');
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
    await page.goto('/');
    if (isMobile) await page.locator('#nav-toggle').click();
    await page.locator('.nav__link[href="#projects"]').click();
    const title = page.locator('#projects .section__title');
    await expect(title).toBeInViewport();
    await expect.poll(() => revealState(title)).toEqual(VISIBLE);
  });
});

test('animação de digitação escreve e muda o texto', async ({ page }) => {
  await page.goto('/');
  const typing = page.locator('#typing-text');
  const first = await typing.textContent();
  await expect(typing).not.toHaveText(first ?? '', { timeout: 5000 });
});

test('filtro de projetos esconde e mostra cards', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.project-card');
  const total = await cards.count();

  await page.locator('.projects__filter[data-filter="backend"]').click();
  const hidden = await page.locator('.project-card.hidden').count();
  expect(hidden).toBeGreaterThan(0);
  expect(hidden).toBeLessThan(total);

  // Os filtros que deixam um card só não podem deixar meia grade vazia.
  const gridWidth = (await page.locator('.projects__grid').boundingBox()).width;
  for (const filter of ['backend', 'systems']) {
    await page.locator(`.projects__filter[data-filter="${filter}"]`).click();
    const visible = page.locator('.project-card:not(.hidden)');
    await expect(visible).toHaveCount(1);
    expect(Math.round((await visible.boundingBox()).width)).toBe(Math.round(gridWidth));
  }

  await page.locator('.projects__filter[data-filter="all"]').click();
  await expect(page.locator('.project-card.hidden')).toHaveCount(0);
});

test('SocialTech abre a grade em destaque, com código, site no ar e prova linkada', async ({ page }) => {
  await page.goto('/');
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
  await expect(featured.locator('.project-card__badge')).toHaveText('Live');
});

test('terminal abre com Ctrl+`, executa help e fecha com Esc', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await page.keyboard.press('Control+Backquote');
  const overlay = page.locator('.terminal-overlay');
  await expect(overlay).toHaveClass(/terminal-overlay--open/);

  const input = page.locator('.terminal__input');
  await expect(input).toBeFocused();
  await input.fill('help');
  await input.press('Enter');
  await expect(page.locator('.terminal__line--response').first()).toContainText('Comandos disponíveis');

  await page.keyboard.press('Escape');
  await expect(overlay).not.toHaveClass(/terminal-overlay--open/);
  expect(errors).toEqual([]);
});

test('falha na API do GitHub mostra mensagem traduzível', async ({ page }) => {
  await page.unroute(GITHUB_API);
  await page.route(GITHUB_API, (route) => route.fulfill({ status: 403, body: '{}' }));
  await page.goto('/');
  const fallback = page.locator('.github__fallback');
  await expect(fallback).toContainText('Não foi possível carregar');
  await page.locator('#lang-toggle').click();
  await expect(fallback).toContainText('Could not load repositories');
});

test('currículo em PDF está disponível', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('a[href$=".pdf"]').first().getAttribute('href');
  const res = await request.get(`/${href}`);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('application/pdf');
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'Menu hambúrguer só existe no mobile');

  test('menu abre e fecha ao escolher uma seção', async ({ page }) => {
    await page.goto('/');
    const list = page.locator('#nav-list');
    await page.locator('#nav-toggle').click();
    await expect(list).toHaveClass(/open/);
    await list.locator('.nav__link[href^="#"]').first().click();
    await expect(list).not.toHaveClass(/open/);
  });
});
