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
// Uso: node scripts/stamp-assets.mjs           grava as referências atualizadas
//      node scripts/stamp-assets.mjs --check   falha se alguma referência estiver desatualizada
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { listPages } from './pages.mjs';

// from './x.js' | import './x.js' | import('./x.js'), com ou sem ?v= anterior.
const JS_IMPORT = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"?]+\.js)(?:\?v=[0-9a-f]*)?\2/g;
// href="css/x.css" | src="../js/x.js" (somente arquivos locais, relativos ao HTML).
const HTML_ASSET = /(\s(?:href|src)=")((?:\.\.?\/)*(?:css|js)\/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]*)?"/g;

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
    const updated = text.replace(pattern, (...m) => {
      const version = versions[i++];
      return file.endsWith('.html')
        ? `${m[1]}${m[2]}?v=${version}"`
        : `${m[1]}${m[2]}${m[3]}?v=${version}${m[2]}`;
    });
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
      console.error(`✗ Versões de assets desatualizadas em: ${stale.join(', ')}`);
      console.error('  Rode "npm run stamp" e faça commit do resultado.');
      process.exit(1);
    }
    console.log(`✓ Assets versionados: ${pages.join(', ')} e ${modules.length} módulos.`);
  } else {
    console.log(stale.length ? `Atualizados: ${stale.join(', ')}` : 'Nada a atualizar.');
  }
}
