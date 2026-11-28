// Cache-busting sem etapa de build: adiciona ?v=<hash do conteúdo> às referências de CSS/JS em
// todas as páginas (scripts/pages.mjs) e aos imports entre módulos. Assim, após um deploy, o
// navegador nunca mistura HTML novo com CSS/JS antigos do cache (o GitHub Pages usa
// Cache-Control: max-age=600).
//
// O hash de um módulo inclui os hashes dos módulos que ele importa: se translations.js muda,
// i18n.js e main.js também ganham URL nova. Cada arquivo tem uma única URL em todo o site (o hash
// depende só do conteúdo), então nunca é instanciado duas vezes, nem quando páginas em pastas
// diferentes o referenciam por caminhos relativos diferentes ("css/x.css" e "../css/x.css").
//
// Também mantém a Content-Security-Policy de cada página: o script-src recebe o hash SHA-256 de
// cada <script> inline executável (o tema aplicado antes da primeira pintura). Editar o script sem
// rodar o stamp deixa o hash velho, e o --check (no CI) reprova, em vez de o navegador bloquear o
// script em silêncio.
//
// Uso: node scripts/stamp-assets.mjs           grava as referências atualizadas
//      node scripts/stamp-assets.mjs --check   falha se alguma referência estiver desatualizada
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { elements } from './html.mjs';
import { listPages } from './pages.mjs';

// from './x.js' | import './x.js' | import('./x.js'), com ou sem ?v= anterior.
const JS_IMPORT = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"?]+\.js)(?:\?v=[0-9a-f]*)?\2/g;
// href="css/x.css" | src="../js/x.js" (somente arquivos locais, relativos ao HTML).
const HTML_ASSET = /(\s(?:href|src)=")((?:\.\.?\/)*(?:css|js)\/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]*)?"/g;

// type de script que executa: ausente/vazio, "module" ou MIME de JavaScript (JSON-LD não executa).
const JS_TYPE = /^(?:|module|(?:text|application)\/(?:x-)?(?:java|ecma)script)$/i;
const HASH_SOURCE = /^'sha256-[A-Za-z0-9+/]+={0,2}'$/;

/** Fontes CSP ('sha256-…') dos scripts inline executáveis do HTML, na ordem em que aparecem. */
export function inlineScriptHashes(html) {
  const hashes = [];
  for (const { tag, attrs, body } of elements(html)) {
    if (tag !== 'script' || attrs.has('src')) continue;
    if (!JS_TYPE.test((attrs.get('type')?.value ?? '').trim())) continue;
    // O navegador calcula sobre o texto já normalizado pelo parser HTML (CRLF e CR sozinho → LF).
    const digest = createHash('sha256').update(body.replace(/\r\n?/g, '\n'), 'utf8').digest('base64');
    hashes.push(`'sha256-${digest}'`);
  }
  return [...new Set(hashes)];
}

const isCspMeta = ({ tag, attrs }) =>
  tag === 'meta' && attrs.get('http-equiv')?.value.trim().toLowerCase() === 'content-security-policy';

/** Grava no script-src da CSP (meta) os hashes dos scripts inline; falha se a CSP não comportar. */
export function stampCsp(html) {
  const metas = [...elements(html)].filter(isCspMeta);
  const hashes = inlineScriptHashes(html);
  if (metas.length === 0) {
    if (hashes.length) throw new Error('script inline sem <meta http-equiv="Content-Security-Policy">');
    return html;
  }
  if (metas.length > 1) throw new Error('mais de uma <meta http-equiv="Content-Security-Policy">');
  const [meta] = metas;
  const content = meta.attrs.get('content');
  if (content?.quote !== '"') throw new Error('CSP precisa de content="…" (aspas duplas)');

  const directives = content.value
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean);
  const names = directives.map((d) => d.split(/\s+/)[0].toLowerCase());
  const repeated = names.find((name, i) => names.indexOf(name) !== i);
  // O navegador usa só a primeira ocorrência: a segunda não valeria nada.
  if (repeated) throw new Error(`CSP com a diretiva ${repeated} repetida`);
  const at = names.indexOf('script-src');
  const sources = at === -1 ? [] : directives[at].split(/\s+/).slice(1);
  if (sources[0] !== "'self'" || !sources.slice(1).every((s) => HASH_SOURCE.test(s))) {
    throw new Error(`CSP sem "script-src 'self'" (só com hashes) para receber os hashes: ${content.value}`);
  }
  directives[at] = ['script-src', "'self'", ...hashes].join(' ');
  const from = meta.attrStart + content.index;
  return `${html.slice(0, from)}content="${directives.join('; ')}"${html.slice(from + content.raw.length)}`;
}

/**
 * Calcula (e, sem `check`, grava) as versões de todas as páginas de `root` e dos módulos que elas
 * alcançam. Devolve as páginas, os módulos e os arquivos desatualizados (caminhos relativos a root).
 */
export async function stampSite(root, { check = false } = {}) {
  const sources = new Map();
  const hashes = new Map();
  const rel = (file) => path.relative(root, file).replaceAll('\\', '/');

  async function source(file, from) {
    if (!sources.has(file)) {
      try {
        sources.set(file, await readFile(file, 'utf8'));
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        throw new Error(`${from ? rel(from) : '?'} referencia ${rel(file)}, que não existe`, { cause: err });
      }
    }
    return sources.get(file);
  }

  const depsOf = (file, text) =>
    file.endsWith('.js')
      ? [...text.matchAll(JS_IMPORT)].map((m) => path.resolve(path.dirname(file), m[3]))
      : [];

  async function hashOf(file, from, stack = []) {
    if (hashes.has(file)) return hashes.get(file);
    if (stack.includes(file)) throw new Error(`Import circular: ${[...stack, file].map(rel).join(' → ')}`);

    const text = await source(file, from);
    // CRLF → LF: o hash precisa ser o mesmo no Windows (autocrlf) e no checkout do CI.
    const normalized = text.replace(/\r\n/g, '\n').replace(JS_IMPORT, '$1$2$3$2');
    const hash = createHash('sha256').update(normalized);
    for (const dep of depsOf(file, text)) hash.update(await hashOf(dep, file, [...stack, file]));

    const digest = hash.digest('hex').slice(0, 8);
    hashes.set(file, digest);
    return digest;
  }

  // Caminhos sempre relativos ao arquivo que os contém (HTML em subpasta usa "../css/…").
  async function stamp(file, pattern, specifierGroup) {
    const text = await source(file);
    const refs = [...text.matchAll(pattern)];
    const versions = await Promise.all(
      refs.map((m) => hashOf(path.resolve(path.dirname(file), m[specifierGroup]), file)),
    );

    let i = 0;
    let updated = text.replace(pattern, (...m) => {
      const version = versions[i++];
      return file.endsWith('.html')
        ? `${m[1]}${m[2]}?v=${version}"`
        : `${m[1]}${m[2]}${m[3]}?v=${version}${m[2]}`;
    });
    if (file.endsWith('.html')) {
      try {
        updated = stampCsp(updated);
      } catch (err) {
        throw new Error(`${rel(file)}: ${err.message}`, { cause: err });
      }
    }
    return { file, text, updated };
  }

  // Percorre o grafo a partir de cada página para alcançar todos os módulos.
  const pages = (await listPages(root)).map((page) => path.join(root, page));
  const queue = [];
  for (const page of pages) {
    for (const m of (await source(page)).matchAll(HTML_ASSET)) {
      const file = path.resolve(path.dirname(page), m[2]);
      if (file.endsWith('.js')) queue.push([file, page]);
    }
  }
  const modules = new Set();
  while (queue.length) {
    const [file, from] = queue.shift();
    if (modules.has(file)) continue;
    modules.add(file);
    queue.push(...depsOf(file, await source(file, from)).map((dep) => [dep, file]));
  }

  const results = await Promise.all([
    ...pages.map((page) => stamp(page, HTML_ASSET, 2)),
    ...[...modules].map((file) => stamp(file, JS_IMPORT, 3)),
  ]);
  const stale = results.filter((r) => r.updated !== r.text);
  if (!check) await Promise.all(stale.map((r) => writeFile(r.file, r.updated)));

  return { pages: pages.map(rel), modules: [...modules].map(rel), stale: stale.map((r) => rel(r.file)) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const check = process.argv.includes('--check');
  const { pages, modules, stale } = await stampSite(root, { check }).catch((err) => {
    console.error(`✗ ${err.message}`);
    process.exit(1);
  });

  if (check) {
    if (stale.length) {
      console.error(`✗ Versões de assets ou hashes da CSP desatualizados em: ${stale.join(', ')}`);
      console.error('  Rode "npm run stamp" e faça commit do resultado.');
      process.exit(1);
    }
    console.log(`✓ Assets versionados: ${pages.join(', ')} e ${modules.length} módulos.`);
  } else {
    console.log(stale.length ? `Atualizados: ${stale.join(', ')}` : 'Nada a atualizar.');
  }
}
