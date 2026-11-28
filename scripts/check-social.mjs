// Verifica a prévia de compartilhamento (Open Graph / Twitter) de cada página publicada, menos a
// 404: og:image é um PNG do próprio site, publicado, decodificável, com 1200×630 e no máximo 150 KB,
// e as metatags que o descrevem (tipo, largura, altura, alt e as do Twitter) batem com ele;
// og:description tem pelo menos 100 caracteres e twitter:description é igual a ela.
// Uso: node scripts/check-social.mjs
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { SITE_URL } from './check-i18n.mjs';
import { PUBLIC } from './pack-site.mjs';
import { listPages } from './pages.mjs';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_MAX_BYTES = 150 * 1024;
// Abaixo disso o LinkedIn Post Inspector avisa "A descrição deve ter pelo menos 100 caracteres".
export const OG_MIN_DESCRIPTION = 100;

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Só a forma canônica: sem query, fragmento, "." / ".." ou barra final, que o navegador resolveria
// para outro endereço (ex.: "og.png/." vira o diretório "og.png/") mesmo achando o arquivo no disco.
const OG_IMAGE_URL = new RegExp(`^${escapeRegExp(SITE_URL)}((?:[\\w-]+/)*[\\w-]+\\.png)$`);

const skip = (file) => file === '404.html';
const isPublished = (local) => PUBLIC.some((entry) => local.startsWith(`${entry}/`));

/** Valor de <meta property|name="key" content="…"> fora de comentários, atributos em qualquer ordem. */
function meta(html, key) {
  for (const [, attrs] of html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<meta\b([^>]*)>/gi)) {
    const get = (name) => attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1];
    if (get('property') === key || get('name') === key) return get('content');
  }
  return undefined;
}

/** Caminho local (relativo à raiz, com "/") do og:image, ou null se não for um PNG canônico do site. */
const ogImagePath = (html) => meta(html, 'og:image')?.match(OG_IMAGE_URL)?.[1] ?? null;

/** Tamanho em bytes e dimensões de uma imagem decodificada por inteiro (null se não for PNG válido). */
export async function readImage(file) {
  const info = await stat(file).catch((err) => (err.code === 'ENOENT' ? null : Promise.reject(err)));
  if (!info?.isFile()) return null;
  try {
    const { format } = await sharp(file).metadata();
    const decoded = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    if (format !== 'png') return { bytes: info.size, size: null };
    return { bytes: info.size, size: { width: decoded.info.width, height: decoded.info.height } };
  } catch {
    return { bytes: info.size, size: null };
  }
}

/** Lê os og:image publicados citados pelas páginas (a 404 fica de fora, como no checkSocial). */
export async function collectImages(root, pages) {
  const images = new Map();
  for (const { file, html } of pages) {
    const local = ogImagePath(html);
    if (skip(file) || !local || images.has(local) || !isPublished(local)) continue;
    const image = await readImage(path.join(root, ...local.split('/')));
    if (image) images.set(local, image);
  }
  return images;
}

/**
 * @param {{ pages: { file: string, html: string }[],
 *   images: Map<string, { bytes: number, size: { width: number, height: number } | null }> }} input
 *   `images`: arquivos publicados (caminho relativo com "/") citados em og:image (collectImages).
 * @returns {string[]} problemas encontrados
 */
export function checkSocial({ pages, images }) {
  const problems = [];
  for (const { file, html } of pages) {
    if (skip(file)) continue;
    const where = (msg) => problems.push(`${file}: ${msg}`);
    const image = meta(html, 'og:image');
    const local = ogImagePath(html);

    if (!local) {
      where(`og:image "${image}" não é um PNG de ${SITE_URL} com caminho canônico`);
      continue;
    }
    const found = isPublished(local) && images.get(local);
    if (!found) {
      where(`og:image aponta para ${local}, que não existe no site publicado`);
      continue;
    }
    if (!found.size) where(`${local} não é um PNG válido`);
    else if (found.size.width !== OG_SIZE.width || found.size.height !== OG_SIZE.height)
      where(`${local} tem ${found.size.width}×${found.size.height}, não ${OG_SIZE.width}×${OG_SIZE.height}`);
    if (found.bytes > OG_MAX_BYTES)
      where(`${local} tem ${Math.ceil(found.bytes / 1024)} KB (máximo ${OG_MAX_BYTES / 1024} KB)`);

    const alt = meta(html, 'og:image:alt');
    if (!alt?.trim()) where('og:image:alt vazio ou ausente');
    const expected = {
      'og:image:type': 'image/png',
      'og:image:width': String(OG_SIZE.width),
      'og:image:height': String(OG_SIZE.height),
      'twitter:card': 'summary_large_image',
      'twitter:image': image,
      'twitter:image:alt': alt,
    };
    for (const [key, value] of Object.entries(expected)) {
      const actual = meta(html, key);
      if (actual !== value) where(`${key} "${actual}" ≠ "${value}"`);
    }

    const description = meta(html, 'og:description');
    const length = [...(description?.trim() ?? '')].length;
    if (length < OG_MIN_DESCRIPTION)
      where(`og:description tem ${length} caracteres (mínimo ${OG_MIN_DESCRIPTION})`);
    else if (meta(html, 'twitter:description') !== description)
      where(`twitter:description "${meta(html, 'twitter:description')}" ≠ "${description}"`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const files = await listPages(root);
  const pages = await Promise.all(
    files.map(async (file) => ({ file, html: await readFile(path.join(root, file), 'utf8') })),
  );
  const images = await collectImages(root, pages);

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
