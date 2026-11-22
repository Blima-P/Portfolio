// Servidor local que imita o GitHub Pages deste projeto: o site fica sob /Portfolio/ e só o que vai
// ao ar (páginas + lista PUBLIC do pack-site) é servido. Um caminho absoluto ("/css/x.css") ou um
// arquivo que ficaria fora do artefato dá 404 aqui, como daria no ar. Usado pelo smoke test e pelo
// `npm run serve`.
//
// Uso: node scripts/serve-site.mjs [--port 3000] [--root <pasta do site>]
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { publicEntries } from './pack-site.mjs';

export const BASE = '/Portfolio/';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

/**
 * Converte o caminho da URL no arquivo publicado (relativo a `root`, com "/"), ou `null` se ele não
 * estiver no site: fora de /Portfolio/, fora da lista pública ou tentando sair da pasta.
 */
export function resolvePublicPath(pathname, entries) {
  if (!pathname.startsWith(BASE)) return null;
  let rel = pathname.slice(BASE.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  if (rel.includes('\\') || rel.includes('\0')) return null;
  const normalized = path.posix.normalize(rel);
  if (normalized !== rel || normalized.startsWith('../') || path.posix.isAbsolute(normalized)) return null;
  return entries.some((entry) => normalized === entry || normalized.startsWith(`${entry}/`))
    ? normalized
    : null;
}

export function createSiteServer(root) {
  return createServer(async (req, res) => {
    const send = (status, body, headers = {}) => {
      res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(405, 'Método não permitido');

      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      } catch {
        return send(400, 'URL inválida');
      }
      if (pathname === BASE.slice(0, -1)) return send(301, '', { Location: BASE });

      const rel = resolvePublicPath(pathname, await publicEntries(root));
      const file = rel && path.join(root, rel);
      if (!file || !(await isFile(file))) {
        // Como no Pages: dentro do projeto, a 404.html do próprio site (quando existir, a partir do 8.5).
        const page404 = path.join(root, '404.html');
        if (pathname.startsWith(BASE) && (await isFile(page404))) {
          return send(404, await readFile(page404), { 'Content-Type': TYPES['.html'] });
        }
        return send(404, `404: ${pathname} não está no site publicado`);
      }

      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      if (req.method === 'HEAD') return res.end();
      createReadStream(file).pipe(res);
    } catch (err) {
      console.error(err);
      if (!res.headersSent) send(500, 'Erro interno');
      else res.destroy();
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { port: { type: 'string', default: '3000' }, root: { type: 'string' } },
  });
  const root = path.resolve(values.root ?? fileURLToPath(new URL('..', import.meta.url)));
  const port = Number(values.port);
  createSiteServer(root).listen(port, 'localhost', () => {
    console.log(`Servindo ${root} em http://localhost:${port}${BASE}`);
  });
}
