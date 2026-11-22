// Testes do servidor local que imita o GitHub Pages (node --test, sem navegador).
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { createSiteServer, resolvePublicPath } from '../../scripts/serve-site.mjs';

const ENTRIES = ['index.html', 'projetos/caso.html', 'css', 'js', 'assets'];

test('só serve o que está sob /Portfolio/ e na lista pública', () => {
  assert.equal(resolvePublicPath('/Portfolio/', ENTRIES), 'index.html');
  assert.equal(resolvePublicPath('/Portfolio/css/styles.css', ENTRIES), 'css/styles.css');
  assert.equal(resolvePublicPath('/Portfolio/projetos/caso.html', ENTRIES), 'projetos/caso.html');
  // Caminho absoluto: funciona em localhost/ mas dá 404 no Pages.
  assert.equal(resolvePublicPath('/css/styles.css', ENTRIES), null);
  // No repositório, mas fora do artefato publicado.
  assert.equal(resolvePublicPath('/Portfolio/package.json', ENTRIES), null);
  assert.equal(resolvePublicPath('/Portfolio/docs/plano.md', ENTRIES), null);
  assert.equal(resolvePublicPath('/Portfolio/projetos/outro.html', ENTRIES), null);
  // Tentativas de sair da pasta ou de enganar a comparação de prefixo.
  assert.equal(resolvePublicPath('/Portfolio/../package.json', ENTRIES), null);
  assert.equal(resolvePublicPath('/Portfolio/css/../package.json', ENTRIES), null);
  assert.equal(resolvePublicPath('/Portfolio/css\\..\\package.json', ENTRIES), null);
  assert.equal(resolvePublicPath('/Portfolio/cssx/a.css', ENTRIES), null);
});

let root;
let server;
let base;

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'serve-'));
  await mkdir(path.join(root, 'css'));
  await writeFile(path.join(root, 'index.html'), '<h1>home</h1>');
  await writeFile(path.join(root, 'css', 'a.css'), 'body {}');
  await writeFile(path.join(root, 'package.json'), '{}');
  server = createSiteServer(root);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await rm(root, { recursive: true, force: true });
});

test('responde como o Pages: prefixo, redirecionamento, tipos e 404', async () => {
  const home = await fetch(`${base}/Portfolio/`);
  assert.equal(home.status, 200);
  assert.match(home.headers.get('content-type'), /^text\/html/);

  const css = await fetch(`${base}/Portfolio/css/a.css?v=123`);
  assert.equal(css.status, 200);
  assert.match(css.headers.get('content-type'), /^text\/css/);

  const bare = await fetch(`${base}/Portfolio`, { redirect: 'manual' });
  assert.equal(bare.status, 301);
  assert.equal(bare.headers.get('location'), '/Portfolio/');

  for (const url of ['/', '/css/a.css', '/Portfolio/package.json', '/Portfolio/%2e%2e/package.json']) {
    assert.equal((await fetch(base + url)).status, 404, url);
  }
});
