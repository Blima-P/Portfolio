// Testes do cache-busting com páginas em subpastas (node --test, sem navegador).
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { stampSite } from '../../scripts/stamp-assets.mjs';

let root;

async function write(file, text) {
  await mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await writeFile(path.join(root, file), text);
}
const read = (file) => readFile(path.join(root, file), 'utf8');
const versionOf = (text, ref) => text.match(new RegExp(`${ref}\\?v=([0-9a-f]{8})`))?.[1];

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'stamp-'));
  await write('css/a.css', 'body {}');
  await write('js/n.js', 'export const n = 1;');
  await write('js/m.js', "import { n } from './n.js';\nconsole.log(n);");
  await write(
    'index.html',
    '<link rel="stylesheet" href="css/a.css" /><script type="module" src="js/m.js"></script>',
  );
  await write(
    'projetos/caso.html',
    '<link rel="stylesheet" href="../css/a.css?v=0badc0de" /><script type="module" src="../js/m.js"></script>',
  );
});

after(() => rm(root, { recursive: true, force: true }));

test('página em projetos/ recebe, pelo caminho relativo, a mesma versão que a home', async () => {
  const { pages, modules, stale } = await stampSite(root);
  assert.deepEqual(pages, ['index.html', 'projetos/caso.html']);
  assert.deepEqual(modules.sort(), ['js/m.js', 'js/n.js']);
  assert.deepEqual(stale.sort(), ['index.html', 'js/m.js', 'projetos/caso.html']);

  const [index, caso, m] = await Promise.all([
    read('index.html'),
    read('projetos/caso.html'),
    read('js/m.js'),
  ]);
  assert.ok(versionOf(index, 'css/a\\.css'));
  assert.equal(versionOf(caso, '\\.\\./css/a\\.css'), versionOf(index, 'css/a\\.css'));
  assert.equal(versionOf(caso, '\\.\\./js/m\\.js'), versionOf(index, 'js/m\\.js'));
  assert.ok(versionOf(m, '\\./n\\.js'));

  assert.deepEqual((await stampSite(root, { check: true })).stale, []);
});

test('mudar um módulo importado deixa as duas páginas desatualizadas', async () => {
  await write('js/n.js', 'export const n = 2;');
  assert.deepEqual((await stampSite(root, { check: true })).stale.sort(), [
    'index.html',
    'js/m.js',
    'projetos/caso.html',
  ]);
});

test('caminho escrito a partir da raiz numa subpasta falha com mensagem clara', async () => {
  await write('projetos/caso.html', '<link rel="stylesheet" href="css/a.css" />');
  await assert.rejects(
    stampSite(root, { check: true }),
    /projetos\/caso\.html referencia projetos\/css\/a\.css, que não existe/,
  );
});
