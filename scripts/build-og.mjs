// Gera as imagens de compartilhamento (og:image, 1200×630) da home e de cada estudo de caso: o
// cartão é montado em HTML com as fontes e a paleta do site e fotografado pelo Chromium do
// Playwright. Os textos repetem os do site (nada novo aqui). Os PNG vão para o repositório; rode de
// novo só quando nome, cargo, foto ou estudos de caso mudarem. O check-social confere o resultado.
//
// Uso: npm run og
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = path.join(ROOT, 'assets', 'img');
const SIZE = { width: 1200, height: 630 };

export const CARDS = [
  {
    file: 'og-image.png',
    eyebrow: 'Portfólio',
    title: 'Pedro Braga',
    lines: ['Desenvolvedor Backend Java', 'Java · Spring · PostgreSQL'],
  },
  {
    file: 'og-carteira-api.png',
    eyebrow: 'Estudo de caso · projeto pessoal',
    title: 'Carteira API',
    lines: ['Transferências ACID, idempotência, lock pessimista ordenado e paginação por cursor'],
  },
  {
    file: 'og-socialtech.png',
    eyebrow: 'Estudo de caso · projeto de extensão',
    title: 'SocialTech',
    lines: ['mantenedor · 111 PRs meus mergeados · time de 10 estudantes'],
  },
];

const dataUrl = async (file, type) =>
  `data:${type};base64,${(await readFile(path.join(ROOT, file))).toString('base64')}`;

const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

async function render(page, card, assets) {
  const [first, ...rest] = card.lines;
  await page.setContent(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><style>
  @font-face { font-family: Inter; font-weight: 600; src: url(${assets.inter600}); }
  @font-face { font-family: Inter; font-weight: 800; src: url(${assets.inter800}); }
  @font-face { font-family: Mono; font-weight: 400; src: url(${assets.mono400}); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: ${SIZE.width}px; height: ${SIZE.height}px; overflow: hidden; position: relative;
    display: flex; align-items: center; gap: 64px; padding: 0 80px;
    font-family: Inter; color: #e6f0ff;
    background:
      radial-gradient(circle at 12% 18%, rgb(56 189 248 / 22%), transparent 45%),
      radial-gradient(circle at 92% 88%, rgb(129 140 248 / 22%), transparent 45%),
      #050a18;
  }
  body::before {
    content: ''; position: absolute; inset: 0; opacity: 0.35;
    background-image: radial-gradient(rgb(56 189 248 / 55%) 1.2px, transparent 1.4px);
    background-size: 36px 36px;
    mask-image: linear-gradient(110deg, #000, transparent 60%);
  }
  main { flex: 1; position: relative; }
  .eyebrow { font-family: Mono; font-size: 26px; color: #38bdf8; margin-bottom: 18px; white-space: nowrap; }
  h1 {
    font-weight: 800; font-size: 104px; line-height: 1.02; letter-spacing: -0.02em;
    background: linear-gradient(90deg, #e0f2fe 0%, #38bdf8 50%, #818cf8 100%);
    -webkit-background-clip: text; color: transparent; padding-bottom: 8px;
  }
  .lead { font-weight: 600; font-size: 40px; line-height: 1.25; margin-top: 18px; }
  .sub { font-family: Mono; font-size: 28px; color: #94a8cc; margin-top: 14px; }
  footer {
    position: absolute; left: 80px; bottom: 44px; font-family: Mono; font-size: 24px; color: #94a8cc;
  }
  footer b { color: #e6f0ff; font-weight: 400; }
  .photo {
    position: relative; flex: none; width: 330px; height: 330px; border-radius: 50%;
    padding: 6px; background: linear-gradient(135deg, #38bdf8, #818cf8);
    box-shadow: 0 0 80px rgb(56 189 248 / 30%);
  }
  .photo img { width: 100%; height: 100%; border-radius: 50%; display: block; }
</style></head><body>
  <main>
    <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
    <h1>${escapeHtml(card.title)}</h1>
    <p class="lead">${escapeHtml(first)}</p>
    ${rest.map((line) => `<p class="sub">${escapeHtml(line)}</p>`).join('')}
  </main>
  <div class="photo"><img src="${assets.photo}" alt=""></div>
  <footer><b>Pedro Braga</b> · blima-p.github.io/Portfolio</footer>
</body></html>`);
  await page.evaluate('document.fonts.ready');
  return page.screenshot({ type: 'png' });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Cabeça e ombros do original (1200×1600) num quadrado, para o círculo.
  const face = await sharp(path.join(ROOT, 'design', 'profile.jpg'))
    .extract({ left: 150, top: 300, width: 900, height: 900 })
    .resize(330 * 2)
    .jpeg({ quality: 85 })
    .toBuffer();
  const assets = {
    inter600: await dataUrl('assets/fonts/inter-latin-600-normal.woff2', 'font/woff2'),
    inter800: await dataUrl('assets/fonts/inter-latin-800-normal.woff2', 'font/woff2'),
    mono400: await dataUrl('assets/fonts/jetbrains-mono-latin-400-normal.woff2', 'font/woff2'),
    photo: `data:image/jpeg;base64,${face.toString('base64')}`,
  };

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 1 });
    for (const card of CARDS) {
      const file = path.join(OUT, card.file);
      const png = await render(page, card, assets);
      // Paleta de 256 cores com dithering: o degradê continua liso e o arquivo fica bem abaixo de 150 KB.
      const { size } = await sharp(png).png({ palette: true, quality: 90, effort: 10 }).toFile(file);
      console.log(
        `${path.relative(ROOT, file)}  ${SIZE.width}×${SIZE.height}  ${Math.round(size / 1024)} KB`,
      );
    }
  } finally {
    await browser.close();
  }
}
