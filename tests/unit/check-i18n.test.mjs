// Testes do verificador de i18n com várias páginas (node --test, sem navegador).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { checkI18n, pageUrl } from '../../scripts/check-i18n.mjs';

const translations = {
  'pt-br': {
    'page.home.title': 'Início',
    'page.home.description': 'Página inicial',
    'page.caso.title': 'Estudo de caso',
    'page.caso.description': 'Um projeto',
    'caso.lead': 'Problema e solução',
  },
  en: {
    'page.home.title': 'Home',
    'page.home.description': 'Home page',
    'page.caso.title': 'Case study',
    'page.caso.description': 'A project',
    'caso.lead': 'Problem and solution',
  },
};

function page(file, { id, title, description, canonical = pageUrl(file), body = '' }) {
  const html =
    `<html lang="pt-BR"${id ? ` data-page="${id}"` : ''}><head>` +
    `<meta name="description" content="${description}" /><meta property="og:url" content="${canonical}" />` +
    `<link rel="canonical" href="${canonical}" /><title>${title}</title></head><body>${body}</body></html>`;
  return { file, html };
}

const home = page('index.html', { id: 'home', title: 'Início', description: 'Página inicial' });
const caso = (overrides = {}) =>
  page('projetos/caso.html', {
    id: 'caso',
    title: 'Estudo de caso',
    description: 'Um projeto',
    body: '<p data-i18n="caso.lead">Problema e solução</p>',
    ...overrides,
  });

test('aceita páginas em projetos/ com metadados e textos próprios', () => {
  const { problems, used } = checkI18n({ pages: [home, caso()], translations });
  assert.deepEqual(problems, []);
  assert.ok(used.has('caso.lead'));
});

test('erro proposital em projetos/: título da home copiado e texto diferente do pt-br', () => {
  const broken = caso({
    title: 'Início',
    body: '<p data-i18n="caso.lead">Problema e soluçao</p>',
  });
  const { problems } = checkI18n({ pages: [home, broken], translations });
  assert.equal(problems.length, 2);
  assert.match(problems[0], /^projetos\/caso\.html: texto de caso\.lead difere do pt-br/);
  assert.match(problems[1], /^projetos\/caso\.html: title estático difere de page\.caso\.title/);
});

test('página sem data-page, com canonical da home ou id repetido é reprovada', () => {
  const noId = checkI18n({ pages: [home, caso({ id: '' })], translations }).problems;
  assert.ok(noId.some((p) => /projetos\/caso\.html: <html> sem data-page/.test(p)));
  // Sem página "caso", as chaves page.caso.* ficam sem uso.
  assert.ok(noId.some((p) => /chave sem uso: page\.caso\.title/.test(p)));

  // Cópia da home sem ajustar a URL: canonical e og:url apontam para a página errada.
  const copied = checkI18n({
    pages: [home, caso({ canonical: pageUrl('index.html') })],
    translations,
  }).problems;
  assert.deepEqual(copied, [
    `projetos/caso.html: canonical "${pageUrl('index.html')}" ≠ "${pageUrl('projetos/caso.html')}"`,
    `projetos/caso.html: og:url "${pageUrl('index.html')}" ≠ "${pageUrl('projetos/caso.html')}"`,
  ]);

  const twin = page('projetos/outro.html', {
    id: 'caso',
    title: 'Estudo de caso',
    description: 'Um projeto',
  });
  const repeated = checkI18n({ pages: [home, caso(), twin], translations }).problems;
  assert.deepEqual(repeated, [
    'projetos/outro.html: data-page="caso" repetido (já usado em projetos/caso.html)',
  ]);
});

test('og:url e canonical: atributos em qualquer ordem, e ausência também reprova', () => {
  const ok = caso();
  const reordered = {
    file: ok.file,
    html: ok.html
      .replace(/<meta property="og:url" content="([^"]*)" \/>/, '<meta content="$1" property="og:url" />')
      .replace(/<link rel="canonical" href="([^"]*)" \/>/, '<link href="$1" rel="canonical" />'),
  };
  assert.deepEqual(checkI18n({ pages: [home, reordered], translations }).problems, []);

  const wrongOg = {
    file: ok.file,
    html: reordered.html.replace(
      /content="[^"]*" property="og:url"/,
      `content="${pageUrl('index.html')}" property="og:url"`,
    ),
  };
  assert.deepEqual(checkI18n({ pages: [home, wrongOg], translations }).problems, [
    `projetos/caso.html: og:url "${pageUrl('index.html')}" ≠ "${pageUrl('projetos/caso.html')}"`,
  ]);

  const noOg = { file: ok.file, html: ok.html.replace(/<meta property="og:url"[^>]*>/, '') };
  assert.deepEqual(checkI18n({ pages: [home, noOg], translations }).problems, [
    `projetos/caso.html: og:url "undefined" ≠ "${pageUrl('projetos/caso.html')}"`,
  ]);
});
