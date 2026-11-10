// Verifica o i18n sem navegador: paridade de chaves entre idiomas, chaves usadas no HTML,
// texto estático do index.html igual ao pt-br (idioma padrão) e uso seguro de HTML nas traduções.
// Uso: node scripts/check-i18n.mjs
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { HTML_KEYS, translations } from '../js/translations.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const html = await readFile(`${root}index.html`, 'utf8');
const pt = translations['pt-br'];
const en = translations.en;
const htmlKeys = new Set(HTML_KEYS);

const problems = [];
const fail = (msg) => problems.push(msg);
const normalize = (text) => text.replace(/\s+/g, ' ').trim();

// 1. Paridade de chaves e valores não vazios.
for (const [name, dict, other] of [
  ['pt-br', pt, en],
  ['en', en, pt],
]) {
  for (const [key, value] of Object.entries(dict)) {
    if (!(key in other)) fail(`chave só em ${name}: ${key}`);
    if (typeof value !== 'string' || !value.trim()) fail(`valor vazio em ${name}: ${key}`);
    // Só as chaves de HTML_KEYS vão para innerHTML; nas demais, "<" ou "&" apareceriam literalmente.
    if (!htmlKeys.has(key) && /[<&]/.test(value))
      fail(`${name}.${key} contém HTML mas não está em HTML_KEYS`);
  }
}
for (const key of htmlKeys) if (!(key in pt)) fail(`HTML_KEYS cita chave inexistente: ${key}`);

// 2. Elementos com data-i18n: chave existe e o texto estático é o pt-br.
const used = new Set();
const openTag = /<(\w+)(\s[^>]*?\bdata-i18n="([^"]+)"[^>]*)>/g;
for (const match of html.matchAll(openTag)) {
  const [whole, tag, attrs, key] = match;
  used.add(key);
  if (!(key in pt)) {
    fail(`data-i18n sem tradução: ${key}`);
    continue;
  }

  const attr = attrs.match(/\bdata-i18n-attr="([^"]+)"/)?.[1];
  if (attr) {
    const current = attrs.match(new RegExp(`\\s${attr}="([^"]*)"`))?.[1];
    if (current !== pt[key]) fail(`${attr} de ${key} difere do pt-br: "${current}" × "${pt[key]}"`);
    continue;
  }

  const start = match.index + whole.length;
  const content = html.slice(start, html.indexOf(`</${tag}>`, start));
  if (content.includes(`<${tag}`)) fail(`${key}: <${tag}> aninhado em elemento traduzido`);
  else if (!htmlKeys.has(key) && content.includes('<')) {
    fail(`${key}: elemento tem filhos, mas a tradução usa textContent e os apagaria`);
  } else if (normalize(content) !== pt[key]) {
    fail(`texto de ${key} difere do pt-br:\n    HTML: ${normalize(content)}\n    pt-br: ${pt[key]}`);
  }
}

// 3. <title> e meta description estáticos também são o pt-br.
const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
if (title !== pt['meta.title']) fail(`<title> difere de meta.title: "${title}"`);
const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
if (normalize(description ?? '') !== pt['meta.description'])
  fail('meta description difere de meta.description');

// 4. Chaves sem uso: nem no HTML nem como literal nos módulos JS (ex.: t('github.error')).
const jsDir = `${root}js/`;
const jsFiles = (await readdir(jsDir)).filter((f) => f.endsWith('.js') && f !== 'translations.js');
const jsSource = (await Promise.all(jsFiles.map((f) => readFile(jsDir + f, 'utf8')))).join('\n');
for (const key of Object.keys(pt)) {
  if (!used.has(key) && !jsSource.includes(`'${key}'`)) fail(`chave sem uso: ${key}`);
}

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join('\n'));
  console.error(`\n${problems.length} problema(s) no i18n.`);
  process.exit(1);
}
console.log(`✓ i18n OK: ${Object.keys(pt).length} chaves em pt-br e en, ${used.size} usadas no HTML.`);
