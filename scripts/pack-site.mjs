// Monta em _site/ exatamente o que vai ao ar (lista explícita, sem node_modules, docs ou testes)
// e falha se alguma referência local do HTML ou import entre módulos apontar para um arquivo que
// ficou de fora — o deploy nunca publica um site com 404 interno.
//
// Também grava no rodapé do _site/index.html o ano e o mês/ano do commit publicado, então o
// "atualizado em" nunca mente nem depende de alguém lembrar de editar o HTML.
//
// Uso: node scripts/pack-site.mjs
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Ao criar páginas ou pastas públicas novas (ex.: 404.html, projetos/), inclua aqui.
export const PUBLIC = ['index.html', 'Profile.jpg.png', 'css', 'js', 'assets'];

// href="x" | src="x" locais (sem esquema, âncora ou //host); query e fragmento ficam de fora.
const HTML_REF = /\s(?:href|src)="(?![a-z][a-z0-9+.-]*:|#|\/\/)([^"?#]+)[^"]*"/gi;
const JS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"](\.\.?\/[^'"?#]+)/g;

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
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

/** Lista as referências locais quebradas dentro de `site` ("origem → destino"). */
export async function findMissingRefs(site) {
  const missing = [];
  const rel = (file) => path.relative(site, file).replaceAll('\\', '/');
  const check = async (from, ref) => {
    let target;
    try {
      target = path.resolve(path.dirname(from), decodeURIComponent(ref));
    } catch {
      missing.push(`${rel(from)} → ${ref} (URL inválida)`);
      return;
    }
    const inside = rel(target);
    // Um arquivo do repositório fora do artefato existe localmente, mas dá 404 no ar.
    if (inside.startsWith('..') || path.isAbsolute(inside)) {
      missing.push(`${rel(from)} → ${ref} (fora do site publicado)`);
    } else if (!(await isFile(target))) {
      missing.push(`${rel(from)} → ${inside}`);
    }
  };

  for await (const file of walk(site)) {
    const pattern = file.endsWith('.html') ? HTML_REF : file.endsWith('.js') ? JS_IMPORT : null;
    if (!pattern) continue;
    const text = await readFile(file, 'utf8');
    for (const [, ref] of text.matchAll(pattern)) await check(file, ref);
  }
  return missing;
}

const UPDATED_YEAR = /(<span data-updated-year>)\d{4}(<\/span>)/;
const UPDATED_TIME = /<time datetime="[^"]*" data-updated>[^<]*<\/time>/;

/** Troca o ano e o mês/ano do rodapé pela data `AAAA-MM-DD` informada. */
export function stampUpdated(html, isoDate) {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(isoDate);
  if (!match) throw new Error(`Data inválida: "${isoDate}" (esperado AAAA-MM-DD)`);
  if (!UPDATED_YEAR.test(html) || !UPDATED_TIME.test(html)) {
    throw new Error('Rodapé sem data-updated-year ou <time data-updated> no index.html');
  }
  const [, year, month] = match;
  return html
    .replace(UPDATED_YEAR, `$1${year}$2`)
    .replace(UPDATED_TIME, `<time datetime="${year}-${month}" data-updated>${month}/${year}</time>`);
}

export async function packSite(root, out = path.join(root, '_site'), { updated } = {}) {
  await rm(out, { recursive: true, force: true });
  await mkdir(out);
  for (const item of PUBLIC) {
    await cp(path.join(root, item), path.join(out, item), { recursive: true });
  }
  if (updated) {
    const index = path.join(out, 'index.html');
    await writeFile(index, stampUpdated(await readFile(index, 'utf8'), updated));
  }
  const files = [];
  for await (const file of walk(out)) files.push(file);
  return { count: files.length, missing: await findMissingRefs(out) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const updated = execFileSync('git', ['log', '-1', '--format=%cs'], { cwd: root, encoding: 'utf8' }).trim();
  const { count, missing } = await packSite(root, undefined, { updated });
  if (missing.length) {
    console.error(`✗ Referências quebradas em _site/:\n  ${missing.join('\n  ')}`);
    console.error('  Inclua o arquivo ou a pasta na lista PUBLIC de scripts/pack-site.mjs.');
    process.exit(1);
  }
  console.log(`✓ _site/ montado: ${count} arquivos, referências locais conferidas, rodapé de ${updated}.`);
}
