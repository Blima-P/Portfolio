// Testes do verificador da prévia de compartilhamento (node --test; o sharp decodifica as imagens).
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import sharp from 'sharp';

import { SITE_URL } from '../../scripts/check-i18n.mjs';
import { checkSocial, collectImages } from '../../scripts/check-social.mjs';

const IMG = 'assets/img/og.png';
const ALT = 'Cartão com nome e cargo';
const DESC = 'D'.repeat(100);

function tagsFor(overrides = {}) {
  const tags = {
    'og:description': DESC,
    'twitter:description': DESC,
    'og:image': SITE_URL + IMG,
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': ALT,
    'twitter:card': 'summary_large_image',
    'twitter:image': SITE_URL + IMG,
    'twitter:image:alt': ALT,
    ...overrides,
  };
  return Object.entries(tags)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) =>
      key.startsWith('twitter:')
        ? `<meta name="${key}" content="${value}" />`
        : `<meta content="${value}" property="${key}" />`,
    )
    .join('');
}
const page = (file, overrides) => ({ file, html: `<html><head>${tagsFor(overrides)}</head></html>` });
const okImages = () => new Map([[IMG, { bytes: 100 * 1024, size: { width: 1200, height: 630 } }]]);

test('aceita imagem 1200×630 do próprio site com metatags coerentes; a 404 fica de fora', () => {
  const pages = [page('index.html'), page('projetos/caso.html'), { file: '404.html', html: '<html></html>' }];
  assert.deepEqual(checkSocial({ pages, images: okImages() }), []);
});

test('reprova imagem externa, fora do site publicado, fora do tamanho, pesada ou inválida', () => {
  const external = page('index.html', { 'og:image': 'https://example.com/x.png' });
  assert.deepEqual(checkSocial({ pages: [external], images: okImages() }), [
    `index.html: og:image "https://example.com/x.png" não é um PNG de ${SITE_URL} com caminho canônico`,
  ]);

  // Como era antes: a foto retrato na raiz, fora do artefato publicado.
  const old = page('index.html', { 'og:image': `${SITE_URL}Profile.jpg.png` });
  assert.match(
    checkSocial({ pages: [old], images: okImages() })[0],
    /não é um PNG de .* com caminho canônico/,
  );

  // Existe no repositório, mas fora da lista PUBLIC do pack-site.
  const images = new Map([['design/og.png', okImages().get(IMG)]]);
  const unpublished = page('index.html', { 'og:image': `${SITE_URL}design/og.png` });
  assert.deepEqual(checkSocial({ pages: [unpublished], images }), [
    'index.html: og:image aponta para design/og.png, que não existe no site publicado',
  ]);

  const wrong = new Map([[IMG, { bytes: 151 * 1024, size: { width: 896, height: 931 } }]]);
  assert.deepEqual(checkSocial({ pages: [page('index.html')], images: wrong }), [
    `index.html: ${IMG} tem 896×931, não 1200×630`,
    `index.html: ${IMG} tem 151 KB (máximo 150 KB)`,
  ]);

  const invalid = new Map([[IMG, { bytes: 1024, size: null }]]);
  assert.deepEqual(checkSocial({ pages: [page('index.html')], images: invalid }), [
    `index.html: ${IMG} não é um PNG válido`,
  ]);
});

test('reprova URL não canônica que o disco resolveria, mas o navegador não', () => {
  for (const suffix of ['/.', '/', '?v=1', '#x']) {
    const odd = page('index.html', { 'og:image': SITE_URL + IMG + suffix });
    assert.match(checkSocial({ pages: [odd], images: okImages() })[0], /com caminho canônico$/, suffix);
  }
  const dotted = page('index.html', { 'og:image': `${SITE_URL}assets/../assets/img/og.png` });
  assert.match(checkSocial({ pages: [dotted], images: okImages() })[0], /com caminho canônico$/);
});

test('metatags comentadas ou em data-property não contam', () => {
  const commented = { file: 'index.html', html: `<html><head><!-- ${tagsFor()} --></head></html>` };
  assert.deepEqual(checkSocial({ pages: [commented], images: okImages() }), [
    'index.html: og:image "undefined" não é um PNG de https://blima-p.github.io/Portfolio/ com caminho canônico',
  ]);

  const dataAttrs = { file: 'index.html', html: tagsFor().replaceAll('property=', 'data-property=') };
  assert.equal(checkSocial({ pages: [dataAttrs], images: okImages() }).length, 1);
});

test('reprova card pequeno, metatags divergentes ou alt ausente', () => {
  const pages = [
    page('index.html', {
      'twitter:card': 'summary',
      'og:image:height': '631',
      'og:image:alt': undefined,
      'twitter:image:alt': undefined,
    }),
  ];
  assert.deepEqual(checkSocial({ pages, images: okImages() }), [
    'index.html: og:image:alt vazio ou ausente',
    'index.html: og:image:height "631" ≠ "630"',
    'index.html: twitter:card "summary" ≠ "summary_large_image"',
  ]);

  const otherImage = page('index.html', { 'twitter:image': `${SITE_URL}assets/img/outra.png` });
  assert.deepEqual(checkSocial({ pages: [otherImage], images: okImages() }), [
    `index.html: twitter:image "${SITE_URL}assets/img/outra.png" ≠ "${SITE_URL + IMG}"`,
  ]);
});

test('reprova descrição curta (o LinkedIn pede ≥ 100 caracteres), ausente ou divergente no Twitter', () => {
  // 99 caracteres úteis: espaços nas pontas não contam.
  const short = ` ${'D'.repeat(99)} `;
  assert.deepEqual(
    checkSocial({
      pages: [page('index.html', { 'og:description': short, 'twitter:description': short })],
      images: okImages(),
    }),
    ['index.html: og:description tem 99 caracteres (mínimo 100)'],
  );

  const missing = page('index.html', { 'og:description': undefined, 'twitter:description': undefined });
  assert.deepEqual(checkSocial({ pages: [missing], images: okImages() }), [
    'index.html: og:description tem 0 caracteres (mínimo 100)',
  ]);

  const other = page('index.html', { 'twitter:description': 'E'.repeat(100) });
  assert.deepEqual(checkSocial({ pages: [other], images: okImages() }), [
    `index.html: twitter:description "${'E'.repeat(100)}" ≠ "${DESC}"`,
  ]);
});

test('collectImages decodifica o PNG inteiro, recusa truncado, JPEG ou diretório e ignora a 404', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'check-social-'));
  try {
    await mkdir(path.join(root, 'assets', 'img', 'pasta.png'), { recursive: true });
    const png = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#050a18' } })
      .png()
      .toBuffer();
    await writeFile(path.join(root, IMG), png);
    // Cabeçalho íntegro (metadata lê 300×200), mas os dados param no meio: só a decodificação acusa.
    const noisy = await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 3,
        background: '#000',
        noise: { type: 'gaussian', mean: 128, sigma: 30 },
      },
    })
      .png()
      .toBuffer();
    await writeFile(path.join(root, 'assets/img/cortado.png'), noisy.subarray(0, noisy.length / 2));
    await writeFile(path.join(root, 'assets/img/so-404.png'), png);
    const jpeg = await sharp(png).jpeg().toBuffer();
    await writeFile(path.join(root, 'assets/img/foto.png'), jpeg);

    const pages = [
      page('index.html'),
      page('projetos/a.html', { 'og:image': `${SITE_URL}assets/img/cortado.png` }),
      page('projetos/b.html', { 'og:image': `${SITE_URL}assets/img/foto.png` }),
      // A 404 é isenta: a imagem citada só por ela nem é lida.
      page('404.html', { 'og:image': `${SITE_URL}assets/img/so-404.png` }),
    ];
    const images = await collectImages(root, pages);
    assert.deepEqual([...images.keys()], [IMG, 'assets/img/cortado.png', 'assets/img/foto.png']);
    assert.deepEqual(images.get(IMG), { bytes: png.length, size: { width: 1200, height: 630 } });
    assert.equal(images.get('assets/img/cortado.png').size, null);
    assert.equal(images.get('assets/img/foto.png').size, null);

    // Diretório com nome de PNG numa página comum: tratado como ausente, sem EISDIR.
    const dir = [page('index.html', { 'og:image': `${SITE_URL}assets/img/pasta.png` })];
    assert.equal((await collectImages(root, dir)).size, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
