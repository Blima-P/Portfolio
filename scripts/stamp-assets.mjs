// Cache-busting sem etapa de build: adiciona ?v=<hash do conteúdo> às referências de CSS/JS no
// index.html e aos imports entre módulos. Assim, após um deploy, o navegador nunca mistura HTML
// novo com CSS/JS antigos do cache (o GitHub Pages usa Cache-Control: max-age=600).
//
// O hash de um módulo inclui os hashes dos módulos que ele importa: se translations.js muda,
// i18n.js e main.js também ganham URL nova. Cada módulo tem uma única URL em todo o site,
// então nunca é instanciado duas vezes.
//
// Uso: node scripts/stamp-assets.mjs           grava as referências atualizadas
//      node scripts/stamp-assets.mjs --check   falha se alguma referência estiver desatualizada
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const check = process.argv.includes('--check');

// from './x.js' | import './x.js' | import('./x.js'), com ou sem ?v= anterior.
const JS_IMPORT = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"?]+\.js)(?:\?v=[0-9a-f]*)?\2/g;
// href="css/x.css" | src="js/x.js" (somente arquivos locais).
const HTML_ASSET = /(\s(?:href|src)=")((?:css|js)\/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]*)?"/g;

const sources = new Map();
const hashes = new Map();

async function source(file) {
  if (!sources.has(file)) sources.set(file, await readFile(file, 'utf8'));
  return sources.get(file);
}

const depsOf = (file, text) =>
  file.endsWith('.js')
    ? [...text.matchAll(JS_IMPORT)].map((m) => path.resolve(path.dirname(file), m[3]))
    : [];

async function hashOf(file, stack = []) {
  if (hashes.has(file)) return hashes.get(file);
  if (stack.includes(file)) throw new Error(`Import circular: ${[...stack, file].join(' → ')}`);

  const text = await source(file);
  // CRLF → LF: o hash precisa ser o mesmo no Windows (autocrlf) e no checkout do CI.
  const normalized = text.replace(/\r\n/g, '\n').replace(JS_IMPORT, '$1$2$3$2');
  const hash = createHash('sha256').update(normalized);
  for (const dep of depsOf(file, text)) hash.update(await hashOf(dep, [...stack, file]));

  const digest = hash.digest('hex').slice(0, 8);
  hashes.set(file, digest);
  return digest;
}

async function stamp(file, pattern, specifierGroup) {
  const text = await source(file);
  const refs = [...text.matchAll(pattern)];
  const base = file.endsWith('.html') ? root : path.dirname(file);
  const versions = await Promise.all(refs.map((m) => hashOf(path.resolve(base, m[specifierGroup]))));

  let i = 0;
  const updated = text.replace(pattern, (...m) => {
    const version = versions[i++];
    return file.endsWith('.html') ? `${m[1]}${m[2]}?v=${version}"` : `${m[1]}${m[2]}${m[3]}?v=${version}${m[2]}`;
  });
  return { file, text, updated };
}

// Percorre o grafo a partir do index.html para alcançar todos os módulos.
const indexHtml = path.join(root, 'index.html');
const html = await source(indexHtml);
const queue = [...html.matchAll(HTML_ASSET)].map((m) => path.resolve(root, m[2])).filter((f) => f.endsWith('.js'));
const modules = new Set();
while (queue.length) {
  const file = queue.shift();
  if (modules.has(file)) continue;
  modules.add(file);
  queue.push(...depsOf(file, await source(file)));
}

const results = [
  await stamp(indexHtml, HTML_ASSET, 2),
  ...(await Promise.all([...modules].map((file) => stamp(file, JS_IMPORT, 3)))),
];
const stale = results.filter((r) => r.updated !== r.text);
const rel = (file) => path.relative(root, file).replaceAll('\\', '/');

if (check) {
  if (stale.length) {
    console.error(`✗ Versões de assets desatualizadas em: ${stale.map((r) => rel(r.file)).join(', ')}`);
    console.error('  Rode "npm run stamp" e faça commit do resultado.');
    process.exit(1);
  }
  console.log(`✓ Assets versionados: index.html e ${modules.size} módulos.`);
} else {
  await Promise.all(stale.map((r) => writeFile(r.file, r.updated)));
  console.log(stale.length ? `Atualizados: ${stale.map((r) => rel(r.file)).join(', ')}` : 'Nada a atualizar.');
}
