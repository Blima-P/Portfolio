// Testes do empacotamento do site (node --test, sem navegador).
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { findMissingRefs, stampUpdated } from '../../scripts/pack-site.mjs';

let base;
let site;

async function write(file, text) {
  await mkdir(path.dirname(path.join(site, file)), { recursive: true });
  await writeFile(path.join(site, file), text);
}

before(async () => {
  base = await mkdtemp(path.join(tmpdir(), 'pack-site-'));
  site = path.join(base, '_site');
  // Existe no repositório, mas não no artefato publicado.
  await writeFile(path.join(base, 'README.md'), '# fora');
  await write('css/a.css', '');
  await write('js/b.js', '');
});

after(() => rm(base, { recursive: true, force: true }));

test('aceita referências locais existentes, com query e fragmento', async () => {
  await write(
    'index.html',
    '<link href="css/a.css?v=1"><script src="js/main.js#x"></script>' +
      '<a href="https://example.com/x.pdf"></a><a href="#topo"></a><a href="mailto:a@b.c"></a>',
  );
  await write('js/main.js', "import './b.js?v=2';\nimport { c } from './b.js#frag';\n");
  assert.deepEqual(await findMissingRefs(site), []);
});

test('aponta arquivo ausente no HTML e em import de módulo', async () => {
  await write('index.html', '<img src="assets/foto.png">');
  await write('js/main.js', "export * from './nao-existe.js';\n");
  assert.deepEqual((await findMissingRefs(site)).sort(), [
    'index.html → assets/foto.png',
    'js/main.js → js/nao-existe.js',
  ]);
});

test('recusa referência que sai do site publicado, mesmo se o arquivo existir', async () => {
  await write('index.html', '<a href="../README.md"></a>');
  await write('js/main.js', '');
  assert.deepEqual(await findMissingRefs(site), ['index.html → ../README.md (fora do site publicado)']);
});

test('recusa pasta no lugar de arquivo', async () => {
  await write('index.html', '<a href="css"></a>');
  assert.deepEqual(await findMissingRefs(site), ['index.html → css']);
});

const FOOTER =
  '<li>© <span data-updated-year>2025</span> Pedro</li>' +
  '<time datetime="2025-01" data-updated>01/2025</time>';

test('rodapé recebe o ano e o mês/ano do commit publicado', () => {
  assert.equal(
    stampUpdated(FOOTER, '2027-03-09'),
    '<li>© <span data-updated-year>2027</span> Pedro</li>' +
      '<time datetime="2027-03" data-updated>03/2027</time>',
  );
});

test('rodapé: falha com data inválida ou sem as marcações, em vez de publicar data velha', () => {
  assert.throws(() => stampUpdated(FOOTER, '09/03/2027'), /Data inválida/);
  assert.throws(() => stampUpdated('<footer></footer>', '2027-03-09'), /Rodapé sem/);
});
