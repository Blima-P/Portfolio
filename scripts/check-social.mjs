// Verifica a prévia de compartilhamento (Open Graph / Twitter) de cada página publicada, menos a
// 404: og:image é uma imagem do próprio site, existe, tem 1200×630 e no máximo 150 KB, e as
// metatags que a descrevem (tipo, largura, altura, alt e as do Twitter) batem com ela.
// Uso: node scripts/check-social.mjs
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE_URL } from './check-i18n.mjs';
import { PUBLIC } from './pack-site.mjs';
import { listPages } from './pages.mjs';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_MAX_BYTES = 150 * 1024;

/** Largura e altura de um PNG (cabeçalho IHDR), ou null se não for PNG. */
export function pngSize(buffer) {
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) return null;
  if (buffer.subarray(12, 16).toString('latin1') !== 'IHDR') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** Valor de <meta property|name="key" content="…">, com atributos em qualquer ordem. */
function meta(html, key) {
  for (const [, attrs] of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const get = (name) => attrs.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1];
    if (get('property') === key || get('name') === key) return get('content');
  }
  return undefined;
}

/**
 * @param {{ pages: { file: string, html: string }[],
 *   images: Map<string, { bytes: number, size: { width: number, height: number } | null }> }} input
 *   `images`: arquivos publicados (caminho relativo com "/", ver PUBLIC no pack-site) citados em og:image.
 * @returns {string[]} problemas encontrados
 */
export function checkSocial({ pages, images }) {
  const problems = [];
  for (const { file, html } of pages) {
    if (file === '404.html') continue;
    const where = (msg) => problems.push(`${file}: ${msg}`);
    const image = meta(html, 'og:image');

    if (!image?.startsWith(SITE_URL)) {
      where(`og:image "${image}" não é uma imagem de ${SITE_URL}`);
      continue;
    }
    const local = image.slice(SITE_URL.length);
    const found = images.get(local);
    if (!found) {
      where(`og:image aponta para ${local}, que não existe no site publicado`);
      continue;
    }
    if (!found.size) where(`${local} não é PNG`);
    else if (found.size.width !== OG_SIZE.width || found.size.height !== OG_SIZE.height)
      where(`${local} tem ${found.size.width}×${found.size.height}, não ${OG_SIZE.width}×${OG_SIZE.height}`);
    if (found.bytes > OG_MAX_BYTES)
      where(`${local} tem ${Math.ceil(found.bytes / 1024)} KB (máximo ${OG_MAX_BYTES / 1024} KB)`);

    const expected = {
      'og:image:type': 'image/png',
      'og:image:width': String(OG_SIZE.width),
      'og:image:height': String(OG_SIZE.height),
      'twitter:card': 'summary_large_image',
      'twitter:image': image,
      'twitter:image:alt': meta(html, 'og:image:alt'),
    };
    if (!meta(html, 'og:image:alt')?.trim()) where('og:image:alt vazio ou ausente');
    for (const [key, value] of Object.entries(expected)) {
      const actual = meta(html, key);
      if (actual !== value) where(`${key} "${actual}" ≠ "${value}"`);
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = await listPages(root);
  const pages = await Promise.all(
    files.map(async (file) => ({ file, html: await readFile(path.join(root, file), 'utf8') })),
  );

  const images = new Map();
  for (const { html } of pages) {
    const local = meta(html, 'og:image')?.replace(SITE_URL, '');
    const published = PUBLIC.some((entry) => local?.startsWith(`${entry}/`));
    if (!local || images.has(local) || !published || local.split('/').includes('..')) continue;
    const full = path.join(root, ...local.split('/'));
    try {
      images.set(local, { bytes: (await stat(full)).size, size: pngSize(await readFile(full)) });
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  const problems = checkSocial({ pages, images });
  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join('\n'));
    console.error(`\n${problems.length} problema(s) na prévia de compartilhamento.`);
    process.exit(1);
  }
  console.log(
    `✓ Prévia de compartilhamento OK: ${images.size} imagem(ns) ${OG_SIZE.width}×${OG_SIZE.height}.`,
  );
}
