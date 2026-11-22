// Lista única das páginas do site, usada por check-i18n, stamp-assets, pack-site, pelo servidor
// local e pelo smoke test. Uma página nova em projetos/ entra em todas as verificações sozinha.
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const PAGE_DIRS = ['projetos'];
const ROOT_PAGES = ['index.html', '404.html'];

async function filesIn(dir) {
  try {
    return await readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

/** Páginas HTML públicas, relativas a `root`, com "/" (ex.: "projetos/carteira-api.html"). */
export async function listPages(root) {
  const rootFiles = await filesIn(root);
  const pages = ROOT_PAGES.filter((file) => rootFiles.includes(file));
  for (const dir of PAGE_DIRS) {
    const files = (await filesIn(path.join(root, dir))).filter((f) => f.endsWith('.html')).sort();
    pages.push(...files.map((f) => `${dir}/${f}`));
  }
  return pages;
}

/** Identificador da página declarado em <html data-page="…"> (chaves page.<id>.* do i18n). */
export function pageIdOf(html) {
  return html.match(/<html\b[^>]*\sdata-page="([^"]+)"/)?.[1];
}
