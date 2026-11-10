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

  await page.locator('.projects__filter[data-filter="all"]').click();
  await expect(page.locator('.project-card.hidden')).toHaveCount(0);
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
