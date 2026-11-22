// Verifica o i18n sem navegador, em todas as páginas (scripts/pages.mjs): paridade de chaves entre
// idiomas, chaves usadas no HTML, texto estático igual ao pt-br (idioma padrão), metadados de cada
// página (page.<id>.title/description, canonical e og:url) e uso seguro de HTML nas traduções.
// Uso: node scripts/check-i18n.mjs
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { HTML_KEYS, translations } from '../js/translations.js';
import { listPages, pageIdOf } from './pages.mjs';

export const SITE_URL = 'https://blima-p.github.io/Portfolio/';
// Metadados que o i18n.js troca com o idioma, por página.
const PAGE_META = ['title', 'description'];

const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Atributos de cada <tag …> do HTML, em qualquer ordem (nomes em minúsculas). */
function tagsOf(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(([, attrs]) =>
    Object.fromEntries(
      [...attrs.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, k, dq, sq]) => [
        k.toLowerCase(),
        dq ?? sq,
      ]),
    ),
  );
}
const metaContent = (html, attr, value) => tagsOf(html, 'meta').find((a) => a[attr] === value)?.content;

/** URL publicada de uma página ("index.html" → raiz do site). */
export const pageUrl = (file) => SITE_URL + (file === 'index.html' ? '' : file);

/**
 * @param {{ pages: { file: string, html: string }[], translations: object, htmlKeys?: string[],
 *   jsSource?: string }} input
 * @returns {{ problems: string[], used: Set<string> }}
 */
export function checkI18n({ pages, translations, htmlKeys = [], jsSource = '' }) {
  const pt = translations['pt-br'];
  const en = translations.en;
  const allowHtml = new Set(htmlKeys);
  const problems = [];
  const fail = (msg) => problems.push(msg);

  // 1. Paridade de chaves e valores não vazios.
  for (const [name, dict, other] of [
    ['pt-br', pt, en],
    ['en', en, pt],
  ]) {
    for (const [key, value] of Object.entries(dict)) {
      if (!Object.hasOwn(other, key)) fail(`chave só em ${name}: ${key}`);
      if (typeof value !== 'string' || !value.trim()) fail(`valor vazio em ${name}: ${key}`);
      // Só as chaves de HTML_KEYS vão para innerHTML; nas demais, "<" ou "&" apareceriam literalmente.
      if (!allowHtml.has(key) && /[<&]/.test(value))
        fail(`${name}.${key} contém HTML mas não está em HTML_KEYS`);
    }
  }
  for (const key of allowHtml) if (!Object.hasOwn(pt, key)) fail(`HTML_KEYS cita chave inexistente: ${key}`);

  const used = new Set();
  const pageIds = new Map();
  for (const { file, html } of pages) {
    const where = (msg) => fail(`${file}: ${msg}`);

    // 2. Elementos com data-i18n: chave existe e o texto estático é o pt-br.
    const openTag = /<(\w+)(\s[^>]*?\bdata-i18n=["']([^"']+)["'][^>]*)>/g;
    for (const match of html.matchAll(openTag)) {
      const [whole, tag, attrs, key] = match;
      used.add(key);
      if (!Object.hasOwn(pt, key)) {
        where(`data-i18n sem tradução: ${key}`);
        continue;
      }

      const attr = attrs.match(/\bdata-i18n-attr="([^"]+)"/)?.[1];
      if (attr) {
        const current = attrs.match(new RegExp(`\\s${escapeRegExp(attr)}="([^"]*)"`))?.[1];
        if (current !== pt[key]) where(`${attr} de ${key} difere do pt-br: "${current}" × "${pt[key]}"`);
        continue;
      }

      const start = match.index + whole.length;
      const content = html.slice(start, html.indexOf(`</${tag}>`, start));
      if (content.includes(`<${tag}`)) where(`${key}: <${tag}> aninhado em elemento traduzido`);
      else if (!allowHtml.has(key) && content.includes('<')) {
        where(`${key}: elemento tem filhos, mas a tradução usa textContent e os apagaria`);
      } else if (normalize(content) !== pt[key]) {
        where(`texto de ${key} difere do pt-br:\n    HTML: ${normalize(content)}\n    pt-br: ${pt[key]}`);
      }
    }

    // 3. Metadados da página: <html data-page> único, <title> e description iguais ao pt-br das
    //    chaves page.<id>.*, canonical e og:url apontando para a própria página.
    const id = pageIdOf(html);
    if (!id) {
      where('<html> sem data-page (o i18n.js não saberia o título desta página)');
    } else {
      if (pageIds.has(id)) where(`data-page="${id}" repetido (já usado em ${pageIds.get(id)})`);
      pageIds.set(id, file);

      const statics = {
        title: html.match(/<title>([^<]*)<\/title>/)?.[1],
        description: metaContent(html, 'name', 'description'),
      };
      for (const field of PAGE_META) {
        const key = `page.${id}.${field}`;
        if (!Object.hasOwn(pt, key)) where(`chave ${key} não existe nas traduções`);
        else if (normalize(statics[field] ?? '') !== pt[key])
          where(`${field} estático difere de ${key}: "${statics[field]}" × "${pt[key]}"`);
      }
    }

    if (file !== '404.html') {
      // Atributos em qualquer ordem; ausentes também reprovam (cópia de página sem ajustar a URL).
      const canonical = tagsOf(html, 'link').find((a) => a.rel?.split(/\s+/).includes('canonical'))?.href;
      const ogUrl = metaContent(html, 'property', 'og:url');
      if (canonical !== pageUrl(file)) where(`canonical "${canonical}" ≠ "${pageUrl(file)}"`);
      if (ogUrl !== pageUrl(file)) where(`og:url "${ogUrl}" ≠ "${pageUrl(file)}"`);
    }
  }

  // 4. Chaves sem uso: nem no HTML, nem como literal nos módulos JS (ex.: t('github.error')), nem
  //    como metadado de uma página existente.
  for (const key of Object.keys(pt)) {
    const pageKey = key.match(/^page\.([^.]+)\.([^.]+)$/);
    if (pageKey) {
      if (!pageIds.has(pageKey[1]) || !PAGE_META.includes(pageKey[2]))
        fail(`chave sem uso: ${key} (nenhuma página com data-page="${pageKey[1]}")`);
    } else if (!used.has(key) && !jsSource.includes(`'${key}'`)) {
      fail(`chave sem uso: ${key}`);
    }
  }

  return { problems, used };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = await listPages(root);
  const pages = await Promise.all(
    files.map(async (file) => ({ file, html: await readFile(path.join(root, file), 'utf8') })),
  );
  const jsDir = path.join(root, 'js');
  const jsFiles = (await readdir(jsDir)).filter((f) => f.endsWith('.js') && f !== 'translations.js');
  const jsSource = (await Promise.all(jsFiles.map((f) => readFile(path.join(jsDir, f), 'utf8')))).join('\n');

  const { problems, used } = checkI18n({ pages, translations, htmlKeys: HTML_KEYS, jsSource });
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'));
    console.error(`\n${problems.length} problema(s) no i18n.`);
    process.exit(1);
  }
  const count = Object.keys(translations['pt-br']).length;
  console.log(`✓ i18n OK: ${count} chaves em pt-br e en, ${used.size} usadas em ${files.join(', ')}.`);
}
