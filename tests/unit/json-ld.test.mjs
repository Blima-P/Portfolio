// Dados estruturados (JSON-LD) das páginas publicadas, lidos do HTML real (node --test).
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { SITE_URL, pageUrl } from '../../scripts/check-i18n.mjs';
import { listPages } from '../../scripts/pages.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const PERSON_ID = `${SITE_URL}#pedro`;
const GITHUB = 'https://github.com/Blima-P';
const LINKEDIN = 'https://www.linkedin.com/in/pedrobragadelima/';
const LATTES = 'https://lattes.cnpq.br/7355607472728751';

const allFiles = await listPages(ROOT);
const files = allFiles.filter((file) => file !== '404.html');
// Comentários não valem: um bloco ou link comentado não existe para o navegador nem para o Google.
const html = Object.fromEntries(
  await Promise.all(
    allFiles.map(async (file) => [
      file,
      (await readFile(path.join(ROOT, file), 'utf8')).replace(/<!--[\s\S]*?-->/g, ''),
    ]),
  ),
);
const LD_SCRIPT = /<script\b[^>]*\btype=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;
const blocksOf = (source) => [...source.matchAll(LD_SCRIPT)].map(([, json]) => JSON.parse(json));
const anchors = (source) =>
  new Set([...source.matchAll(/<a\b[^>]*?\shref="([^"]+)"/g)].map(([, href]) => href));
const meta = (source, property) => source.match(new RegExp(`property="${property}" content="([^"]*)"`))?.[1];
// Texto visível aproximado: sem scripts (o próprio JSON-LD não pode servir de prova) e sem tags.
const visibleText = (source) =>
  source
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');
// Só aceita URLs do próprio site e devolve o caminho local do arquivo.
const localPath = (url) => {
  assert.ok(url.startsWith(SITE_URL), `${url} não é do site`);
  return path.join(ROOT, url.slice(SITE_URL.length));
};

test('cada página publicada tem um único bloco JSON-LD ativo', () => {
  for (const file of files) assert.equal(blocksOf(html[file]).length, 1, file);
});

test('home: Person estudante (affiliation, não alumniOf), estágio e perfis que o site também linka', () => {
  const [person] = blocksOf(html['index.html']);
  assert.equal(person['@context'], 'https://schema.org');
  assert.equal(person['@type'], 'Person');
  assert.equal(person['@id'], PERSON_ID);
  assert.equal(person.name, 'Pedro Braga de Lima');
  assert.equal(person.alternateName, 'Pedro Braga');
  assert.equal(person.url, SITE_URL);
  assert.equal(person.image, `${SITE_URL}assets/img/profile-700.jpg`);
  assert.deepEqual(person.address, {
    '@type': 'PostalAddress',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    addressCountry: 'BR',
  });
  assert.equal(person.alumniOf, undefined, 'curso em andamento: alumniOf diria ex-aluno');
  assert.deepEqual(person.affiliation, {
    '@type': 'CollegeOrUniversity',
    name: 'Universidade Católica de Brasília',
  });
  assert.deepEqual(person.worksFor, {
    '@type': 'EmployeeRole',
    roleName: 'Estagiário de desenvolvimento',
    startDate: '2025',
    worksFor: { '@type': 'Organization', name: 'CAESB' },
  });

  // sameAs: exatamente os três perfis, todos linkados de verdade na página.
  assert.deepEqual([...person.sameAs].sort(), [GITHUB, LATTES, LINKEDIN].sort());
  const links = anchors(html['index.html']);
  for (const url of person.sameAs) assert.ok(links.has(url), `${url} não aparece como link na home`);

  // knowsAbout: nada que a página não mostre.
  const text = visibleText(html['index.html']);
  assert.ok(person.knowsAbout.length > 0);
  for (const term of person.knowsAbout)
    assert.ok(text.includes(term), `knowsAbout "${term}" não está na página`);
});

test('estudos de caso: CreativeWork da própria página, autor ligado à Person da home', () => {
  const cases = files.filter((f) => f.startsWith('projetos/'));
  assert.ok(cases.length > 0);
  for (const file of cases) {
    const [work] = blocksOf(html[file]);
    assert.equal(work['@context'], 'https://schema.org', file);
    assert.equal(work['@type'], 'CreativeWork', file);
    assert.equal(work.url, pageUrl(file), file);
    assert.equal(work.inLanguage, 'pt-BR', file);
    assert.equal(work.image, meta(html[file], 'og:image'), file);
    assert.equal(work.description, meta(html[file], 'og:description'), file);
    assert.deepEqual(
      work.author,
      { '@type': 'Person', '@id': PERSON_ID, name: 'Pedro Braga de Lima', url: SITE_URL },
      file,
    );
    assert.equal(work.about['@type'], 'SoftwareSourceCode', file);
    assert.ok(
      anchors(html[file]).has(work.about.codeRepository),
      `${file}: repositório não linkado na página`,
    );
  }
});

test('um só endereço do LinkedIn em todo o site (todas as páginas e módulos JS)', async () => {
  const jsDir = path.join(ROOT, 'js');
  const js = await Promise.all(
    (await readdir(jsDir)).filter((f) => f.endsWith('.js')).map((f) => readFile(path.join(jsDir, f), 'utf8')),
  );
  // Pega qualquer forma: https, http, //, sem protocolo, com ou sem subdomínio.
  const variant = /(?:https?:)?(?:\/\/)?(?:[\w-]+\.)*linkedin\.com\/in\/([^"'`\s<)/]*)\/?/gi;
  let count = 0;
  for (const source of [...Object.values(html), ...js]) {
    for (const [url, handle] of source.matchAll(variant)) {
      count++;
      assert.equal(handle, 'pedrobragadelima', `perfil diferente: ${url}`);
      // Texto de exibição sem protocolo é ok; link de verdade só na forma canônica.
      if (url.includes('//')) assert.equal(url, LINKEDIN);
    }
  }
  assert.ok(count > 0);
});

test('imagens citadas no JSON-LD são do site e existem no repositório', async () => {
  for (const file of files) {
    for (const block of blocksOf(html[file])) {
      await assert.doesNotReject(readFile(localPath(block.image)), `${file}: ${block.image}`);
    }
  }
});

test('home mantém a verificação do Google Search Console (sem ela, a propriedade perde o acesso)', () => {
  const tags = [...html['index.html'].matchAll(/<meta\b[^>]*\sname="google-site-verification"[^>]*>/g)];
  assert.equal(tags.length, 1);
  assert.match(tags[0][0], /\scontent="fyLltp4c-h4i7gykqVaSgGO0mHZHAP6G0SKR6MiHir8"/);
});
