// Monta em _site/ exatamente o que vai ao ar (lista explícita, sem node_modules, docs ou testes)
// e falha se alguma referência local do HTML ou import entre módulos apontar para um arquivo que
// ficou de fora — o deploy nunca publica um site com 404 interno.
//
// Também grava no rodapé das páginas o ano e o mês/ano do commit publicado, então o
// "atualizado em" nunca mente nem depende de alguém lembrar de editar o HTML.
//
// E gera o sitemap.xml a partir da mesma lista de páginas: página nova entra sozinha, e a URL é a
// canônica (a mesma que o check-i18n exige no <link rel="canonical">).
//
// Uso: node scripts/pack-site.mjs
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { pageUrl } from './check-i18n.mjs';
import { listPages } from './pages.mjs';

// Arquivos e pastas públicos além das páginas HTML, que entram sozinhas (scripts/pages.mjs).
export const PUBLIC = ['css', 'js', 'assets'];

/** Tudo o que vai ao ar, relativo a `root`: as páginas e a lista PUBLIC. */
export async function publicEntries(root) {
  return [...(await listPages(root)), ...PUBLIC];
}

// href="x" | src="x" locais (sem esquema, âncora ou //host); query e fragmento ficam de fora.
const HTML_REF = /\s(?:href|src)="(?![a-z][a-z0-9+.-]*:|#|\/\/)([^"?#]+)[^"]*"/gi;
// srcset="a.avif 350w, b.avif 700w": a URL vai até o espaço (pode ter vírgula, como em data:), e o
// candidato termina na vírgula seguinte (fora de parênteses) ou em vírgulas coladas à URL.
const HTML_SRCSET = /\ssrcset="([^"]*)"/gi;
const LOCAL = /^(?![a-z][a-z0-9+.-]*:|#|\/\/)([^?#]+)/i;

/** URLs dos candidatos de um srcset, pelas regras de análise do HTML. */
function srcsetUrls(value) {
  const urls = [];
  let i = 0;
  while (i < value.length) {
    while (i < value.length && /[\s,]/.test(value[i])) i += 1;
    if (i >= value.length) break;
    const start = i;
    while (i < value.length && !/\s/.test(value[i])) i += 1;
    let url = value.slice(start, i);
    if (url.endsWith(',')) {
      url = url.replace(/,+$/, '');
    } else {
      for (let depth = 0; i < value.length && (value[i] !== ',' || depth); i += 1) {
        if (value[i] === '(') depth += 1;
        else if (value[i] === ')') depth = Math.max(0, depth - 1);
      }
    }
    urls.push(url);
  }
  return urls;
}
const JS_IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"](\.\.?\/[^'"?#]+)/g;
// <base href="/Repo/"> (a 404.html, servida em qualquer profundidade) aponta para a raiz publicada:
// não é um arquivo, e as referências da página passam a ser resolvidas a partir da raiz do site.
const BASE_TAG = /<base\b[^>]*>/i;

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
  const check = async (from, ref, dir) => {
    let target;
    try {
      target = path.resolve(dir, decodeURIComponent(ref));
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
    let text = await readFile(file, 'utf8');
    let dir = path.dirname(file);
    if (pattern === HTML_REF && BASE_TAG.test(text)) {
      text = text.replace(BASE_TAG, '');
      dir = site;
    }
    for (const [, ref] of text.matchAll(pattern)) await check(file, ref, dir);
    if (pattern !== HTML_REF) continue;
    for (const [, srcset] of text.matchAll(HTML_SRCSET)) {
      for (const url of srcsetUrls(srcset)) {
        const local = LOCAL.exec(url);
        if (local) await check(file, local[1], dir);
      }
    }
  }
  return missing;
}

// Marcadores em qualquer ordem e com outros atributos; (?![\w-]) separa data-updated de data-updated-year.
const UPDATED_YEAR = /(<span\b[^>]*\sdata-updated-year(?![\w-])[^>]*>)\d{4}(<\/span>)/;
const UPDATED_TIME = /<time\b([^>]*\sdata-updated(?![\w-])[^>]*)>[^<]*<\/time>/;
const UPDATED_MARKER = /\sdata-updated(?:-year)?(?![\w-])/;

/** Troca o ano e o mês/ano do rodapé pela data `AAAA-MM-DD` informada. */
export function stampUpdated(html, isoDate) {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(isoDate);
  if (!match) throw new Error(`Data inválida: "${isoDate}" (esperado AAAA-MM-DD)`);
  if (!UPDATED_YEAR.test(html) || !UPDATED_TIME.test(html)) {
    throw new Error('Rodapé sem data-updated-year ou <time data-updated>');
  }
  const [, year, month] = match;
  return html.replace(UPDATED_YEAR, `$1${year}$2`).replace(UPDATED_TIME, (_, attrs) => {
    const rest = attrs.replace(/\s+datetime\s*=\s*"[^"]*"/i, '');
    return `<time datetime="${year}-${month}"${rest}>${month}/${year}</time>`;
  });
}

const META_TAG = /<meta\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const ATTR = /([^\s"'=<>/`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

/** A página pede para não ser indexada? (meta robots/googlebot com noindex ou none, fora de comentários) */
export function isNoindex(html) {
  for (const [, attrs] of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(META_TAG)) {
    const map = new Map();
    for (const [, name, dq, sq, bare] of attrs.matchAll(ATTR)) {
      const key = name.toLowerCase();
      if (!map.has(key)) map.set(key, dq ?? sq ?? bare ?? '');
    }
    if (!['robots', 'googlebot'].includes(map.get('name')?.trim().toLowerCase())) continue;
    const directives = (map.get('content') ?? '')
      .toLowerCase()
      .split(',')
      .map((d) => d.trim());
    if (directives.includes('noindex') || directives.includes('none')) return true;
  }
  return false;
}

// Só nomes que viram URL sem codificação (um "#" ou espaço no arquivo publicaria uma URL errada).
const SAFE_PAGE = /^(?:[\w-]+\/)*[\w-]+\.html$/;

/** Conteúdo do sitemap.xml: a URL canônica de cada página, na ordem recebida. */
export function buildSitemap(pages) {
  const urls = pages.map((page) => {
    if (!SAFE_PAGE.test(page)) throw new Error(`Nome de página fora do padrão [\\w-]: "${page}"`);
    return `  <url>\n    <loc>${pageUrl(page)}</loc>\n  </url>\n`;
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('')}</urlset>\n`
  );
}

export async function packSite(root, out = path.join(root, '_site'), { updated } = {}) {
  await rm(out, { recursive: true, force: true });
  await mkdir(out);
  const pages = await listPages(root);
  for (const item of [...pages, ...PUBLIC]) {
    await cp(path.join(root, item), path.join(out, item), { recursive: true });
  }
  if (updated) {
    // A home precisa ter o rodapé com data; as outras páginas, só se tiverem algum marcador — e,
    // tendo, precisam dos dois (stampUpdated falha em vez de publicar uma data velha).
    for (const page of pages) {
      const file = path.join(out, page);
      const html = await readFile(file, 'utf8');
      if (page === 'index.html' || UPDATED_MARKER.test(html)) {
        try {
          await writeFile(file, stampUpdated(html, updated));
        } catch (err) {
          throw new Error(`${page}: ${err.message}`, { cause: err });
        }
      }
    }
  }
  // Sem lastmod: uma data igual para todas as páginas (a do commit publicado) seria falsa.
  const indexable = [];
  for (const page of pages) {
    if (!isNoindex(await readFile(path.join(out, page), 'utf8'))) indexable.push(page);
  }
  await writeFile(path.join(out, 'sitemap.xml'), buildSitemap(indexable));
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
  console.log(
    `✓ _site/ montado: ${count} arquivos, referências locais conferidas, sitemap.xml gerado, rodapé de ${updated}.`,
  );
}
