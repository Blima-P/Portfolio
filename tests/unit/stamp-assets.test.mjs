// Testes do cache-busting com páginas em subpastas (node --test, sem navegador).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';

import { fileURLToPath } from 'node:url';

import { listPages } from '../../scripts/pages.mjs';
import { inlineScriptHashes, stampCsp, stampSite } from '../../scripts/stamp-assets.mjs';

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

// Vetor do MDN (CSP script-src): <script>var inline = 1;</script>.
const MDN = "'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='";
const EMPTY = "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='";
const csp = (scriptSrc) =>
  `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; ${scriptSrc}; object-src 'none'" />`;

test('CSP: hash só dos scripts inline executáveis, iguais aos do navegador', () => {
  assert.deepEqual(
    inlineScriptHashes(
      [
        '<script>var inline = 1;</script>',
        '<script type="module"></script>',
        '<script>var inline = 1;</script>', // repetido: um hash só
        '<script type="application/ld+json">{"a":1}</script>',
        '<script type="module" src="js/m.js"></script>',
        '<!-- <script>comentado()</script> -->',
      ].join('\n'),
    ),
    [MDN, EMPTY],
  );
  // CRLF do checkout no Windows vira LF, como no arquivo publicado.
  assert.deepEqual(
    inlineScriptHashes('<script>var inline = 1;\r\n</script>'),
    inlineScriptHashes('<script>var inline = 1;\n</script>'),
  );
});

test('CSP: script lido como o navegador lê (texto cru, atributos de verdade, CR sozinho)', () => {
  const sha = (text) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`;
  // "<!--" dentro de uma string JS é texto do script, não comentário HTML.
  assert.deepEqual(inlineScriptHashes('<script>window.r = "<!-- n -->";</script>'), [
    sha('window.r = "<!-- n -->";'),
  ]);
  // src= e type= dentro do valor de outro atributo não mudam nada.
  assert.deepEqual(inlineScriptHashes('<script data-note=" src=x">var inline = 1;</script>'), [MDN]);
  assert.deepEqual(
    inlineScriptHashes(`<script data-note='type="application/ld+json"'>var inline = 1;</script>`),
    [MDN],
  );
  assert.deepEqual(inlineScriptHashes('<SCRIPT TYPE="Module">var inline = 1;</SCRIPT>'), [MDN]);
  // O parser HTML transforma CR sozinho em LF antes de o navegador calcular o hash.
  assert.deepEqual(inlineScriptHashes('<script>var inline = 1;\r</script>'), [sha('var inline = 1;\n')]);
});

test('CSP: só vale a meta ativa, única, com aspas duplas e script-src sem repetição', () => {
  const script = '<script>var inline = 1;</script>';
  assert.throws(() => stampCsp(`<!-- ${csp("script-src 'self'")} -->${script}`), /sem <meta http-equiv/);
  assert.throws(
    () =>
      stampCsp(
        `${csp("script-src 'self'")}<meta http-equiv='content-security-policy' content="default-src 'none'">`,
      ),
    /mais de uma/,
  );
  assert.throws(() => stampCsp(`${csp("script-src 'none'; script-src 'self'")}${script}`), /repetida/);
  assert.throws(
    () =>
      stampCsp(`<meta http-equiv="Content-Security-Policy" content='script-src &apos;self&apos;'>${script}`),
    /aspas duplas/,
  );
  // Caixa e espaçamento diferentes: reconhece e grava no lugar certo, sem mexer no resto da tag.
  assert.equal(
    stampCsp(
      `<META data-x="content=&quot;x&quot;" HTTP-EQUIV="content-security-policy" CONTENT = "Script-Src 'self'">${script}`,
    ),
    `<META data-x="content=&quot;x&quot;" HTTP-EQUIV="content-security-policy" content="script-src 'self' ${MDN}">${script}`,
  );
});

test('CSP: stampCsp troca os hashes velhos do script-src e preserva o resto da política', () => {
  const page = (scriptSrc) => `${csp(scriptSrc)}<script>var inline = 1;</script>`;
  assert.equal(stampCsp(page("script-src 'self'")), page(`script-src 'self' ${MDN}`));
  assert.equal(stampCsp(page(`script-src 'self' ${EMPTY} ${MDN}`)), page(`script-src 'self' ${MDN}`));
  assert.equal(stampCsp(csp("script-src 'self' " + MDN)), csp("script-src 'self'"));
  assert.equal(stampCsp('<p>sem CSP nem script</p>'), '<p>sem CSP nem script</p>');
});

test('CSP: falha em vez de publicar política que bloquearia o script ou não protegeria nada', () => {
  assert.throws(() => stampCsp('<script>var inline = 1;</script>'), /sem <meta http-equiv/);
  assert.throws(
    () => stampCsp(`${csp("script-src 'self' 'unsafe-inline'")}<script></script>`),
    /script-src 'self'/,
  );
  assert.throws(() => stampCsp(`${csp("script-src 'self'")}${csp("script-src 'self'")}`), /mais de uma/);
});

test('CSP: página com hash desatualizado reprova no --check, com o nome da página', async () => {
  await write('projetos/caso.html', `${csp(`script-src 'self' ${EMPTY}`)}<script>var inline = 1;</script>`);
  assert.ok((await stampSite(root, { check: true })).stale.includes('projetos/caso.html'));
  await stampSite(root);
  assert.match(
    await read('projetos/caso.html'),
    new RegExp(`script-src 'self' ${MDN.replace(/[+/]/g, '\\$&')};`),
  );

  await write('projetos/caso.html', '<script>var inline = 1;</script>');
  await assert.rejects(stampSite(root, { check: true }), /projetos\/caso\.html: script inline sem/);
});

test('CSP e Referrer-Policy reais: a mesma política em todas as páginas publicadas', async () => {
  const repo = fileURLToPath(new URL('../..', import.meta.url));
  for (const page of await listPages(repo)) {
    const html = await readFile(path.join(repo, page), 'utf8');
    const policy = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/)?.[1];
    assert.equal(
      policy?.replace(/ 'sha256-[^']+'/g, ''),
      "default-src 'self'; script-src 'self'; connect-src 'self' https://api.github.com; object-src 'none'; base-uri 'self'",
      page,
    );
    assert.equal(policy.match(/'sha256-/g)?.length, inlineScriptHashes(html).length, page);
    // A CSP por meta só vale para o que vem depois dela: tem de abrir o <head>, antes de <base> e scripts.
    const at = html.indexOf('http-equiv="Content-Security-Policy"');
    for (const tag of ['<base', '<script', '<link']) {
      const next = html.indexOf(tag);
      if (next !== -1) assert.ok(at < next, `${page}: CSP depois de ${tag}`);
    }
    assert.match(html, /<meta name="referrer" content="strict-origin-when-cross-origin" \/>/, page);
  }
});
