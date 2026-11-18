// Monta em _site/ exatamente o que vai ao ar (lista explícita, sem node_modules, docs ou testes)
// e falha se alguma referência local do index.html ou import entre módulos apontar para um arquivo
// que ficou de fora — o deploy nunca publica um site com 404 interno.
//
// Uso: node scripts/pack-site.mjs
import { cp, mkdir, readdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = path.join(root, '_site');

// Ao criar páginas ou pastas públicas novas (ex.: 404.html, projetos/), inclua aqui.
const PUBLIC = ['index.html', 'Profile.jpg.png', 'css', 'js', 'assets'];

// href="x" | src="x" locais (sem esquema, âncora, mailto ou tel).
const HTML_REF = /\s(?:href|src)="(?![a-z][a-z0-9+.-]*:|#|\/\/)([^"?#]+)[^"]*"/gi;
const JS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"](\.\.?\/[^'"?]+)/g;

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const item of PUBLIC) {
  await cp(path.join(root, item), path.join(out, item), { recursive: true });
}

const missing = [];
const rel = (file) => path.relative(out, file).replaceAll('\\', '/');
const check = async (from, target) => {
  if (!(await exists(target))) missing.push(`${rel(from)} → ${rel(target)}`);
};

const htmlFiles = [];
const jsFiles = [];
let count = 0;
for await (const file of walk(out)) {
  count++;
  if (file.endsWith('.html')) htmlFiles.push(file);
  if (file.endsWith('.js')) jsFiles.push(file);
}

for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  for (const [, ref] of text.matchAll(HTML_REF)) {
    await check(file, path.resolve(path.dirname(file), decodeURIComponent(ref)));
  }
}
for (const file of jsFiles) {
  const text = await readFile(file, 'utf8');
  for (const [, ref] of text.matchAll(JS_IMPORT)) {
    await check(file, path.resolve(path.dirname(file), ref));
  }
}

if (missing.length) {
  console.error(`✗ Referências sem arquivo em _site/:\n  ${missing.join('\n  ')}`);
  console.error('  Inclua o arquivo ou a pasta na lista PUBLIC de scripts/pack-site.mjs.');
  process.exit(1);
}
console.log(`✓ _site/ montado: ${count} arquivos, referências locais conferidas.`);
