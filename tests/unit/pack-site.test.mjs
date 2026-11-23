// Testes do empacotamento do site (node --test, sem navegador).
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { PUBLIC, findMissingRefs, packSite, stampUpdated } from '../../scripts/pack-site.mjs';

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

test('<base> da 404 não conta como arquivo e as referências da página partem da raiz do site', async () => {
  await write('index.html', '');
  await write(
    'erro/404.html',
    '<base href="/Repo/" /><link href="css/a.css?v=1"><a href="index.html#x"></a><img src="assets/x.png">',
  );
  assert.deepEqual(await findMissingRefs(site), ['erro/404.html → assets/x.png']);
  await rm(path.join(site, 'erro'), { recursive: true });
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

test('rodapé: marcadores com outros atributos e em outra ordem também recebem a data', () => {
  const html =
    '<span class="ano" data-updated-year>2025</span>' +
    '<time class="data" data-updated datetime="2025-01">01/2025</time>';
  assert.equal(
    stampUpdated(html, '2027-03-09'),
    '<span class="ano" data-updated-year>2027</span>' +
      '<time datetime="2027-03" class="data" data-updated>03/2027</time>',
  );
});

test('rodapé: falha com data inválida ou sem as marcações, em vez de publicar data velha', () => {
  assert.throws(() => stampUpdated(FOOTER, '09/03/2027'), /Data inválida/);
  assert.throws(() => stampUpdated('<footer></footer>', '2027-03-09'), /Rodapé sem/);
});

test('páginas de projetos/ entram no artefato sozinhas e também recebem a data do rodapé', async () => {
  const root = path.join(base, 'repo');
  const put = async (file, text = '') => {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), text);
  };
  for (const item of PUBLIC) await put(item.includes('.') ? item : `${item}/.keep`);
  await put('index.html', `<a href="projetos/caso.html"></a>${FOOTER}`);
  await put('projetos/caso.html', `<a href="../index.html"></a>${FOOTER}`);
  await put('projetos/sem-rodape.html', '<a href="caso.html"></a>');
  await put('docs/plano.md', 'local');

  const out = path.join(base, 'repo-site');
  const { missing } = await packSite(root, out, { updated: '2027-03-09' });
  assert.deepEqual(missing, []);
  assert.match(await readFile(path.join(out, 'projetos/caso.html'), 'utf8'), /datetime="2027-03"/);
  assert.equal(
    await readFile(path.join(out, 'projetos/sem-rodape.html'), 'utf8'),
    '<a href="caso.html"></a>',
  );
  await assert.rejects(readFile(path.join(out, 'docs/plano.md')), { code: 'ENOENT' });

  // Página com só um dos marcadores: falha nomeando a página, em vez de publicar data velha.
  await put('projetos/meio-rodape.html', '<time data-updated datetime="2025-01">01/2025</time>');
  await assert.rejects(
    packSite(root, out, { updated: '2027-03-09' }),
    /projetos\/meio-rodape\.html: Rodapé sem/,
  );
});
