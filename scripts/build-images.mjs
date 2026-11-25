// Gera as versões responsivas da foto do Sobre a partir do original (Profile.jpg.png, 896×931,
// ~1,2 MB): AVIF e WebP em 3 larguras e um JPEG de reserva. A foto aparece com no máximo 350 px de
// CSS, então 350/700/896 cobrem telas de densidade 1, 2 e acima (896 é o original: nunca amplia).
// Os arquivos gerados vão para o repositório; rode de novo só quando a foto mudar.
//
// Uso: npm run images
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = path.join(ROOT, 'Profile.jpg.png');
const OUT = path.join(ROOT, 'assets', 'img');
export const WIDTHS = [350, 700, 896];
export const FALLBACK_WIDTH = 700;

const FORMATS = {
  avif: (img) => img.avif({ quality: 55, effort: 9 }),
  webp: (img) => img.webp({ quality: 78, effort: 6 }),
  jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true }),
};

await mkdir(OUT, { recursive: true });
for (const [ext, encode] of Object.entries(FORMATS)) {
  for (const width of ext === 'jpg' ? [FALLBACK_WIDTH] : WIDTHS) {
    const file = path.join(OUT, `profile-${width}.${ext}`);
    const { size, height } = await encode(sharp(SOURCE).resize({ width, withoutEnlargement: true })).toFile(
      file,
    );
    console.log(`${path.relative(ROOT, file)}  ${width}×${height}  ${Math.round(size / 1024)} KB`);
  }
}
