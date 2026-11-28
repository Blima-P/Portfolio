// Testes do verificador da prévia de compartilhamento (node --test, sem navegador).
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SITE_URL } from '../../scripts/check-i18n.mjs';
import { checkSocial, pngSize } from '../../scripts/check-social.mjs';

const IMG = 'assets/img/og.png';
const ALT = 'Cartão com nome e cargo';

function page(file, overrides = {}) {
  const tags = {
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
  const head = Object.entries(tags)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) =>
      key.startsWith('twitter:')
        ? `<meta name="${key}" content="${value}" />`
        : `<meta content="${value}" property="${key}" />`,
    )
    .join('');
  return { file, html: `<html><head>${head}</head></html>` };
}

const okImages = () => new Map([[IMG, { bytes: 100 * 1024, size: { width: 1200, height: 630 } }]]);

test('aceita imagem 1200×630 do próprio site com metatags coerentes; a 404 fica de fora', () => {
  const pages = [page('index.html'), page('projetos/caso.html'), { file: '404.html', html: '<html></html>' }];
  assert.deepEqual(checkSocial({ pages, images: okImages() }), []);
});

test('reprova imagem externa, ausente do site publicado, fora do tamanho ou pesada demais', () => {
  const external = page('index.html', { 'og:image': 'https://example.com/x.png' });
  assert.deepEqual(checkSocial({ pages: [external], images: okImages() }), [
    `index.html: og:image "https://example.com/x.png" não é uma imagem de ${SITE_URL}`,
  ]);

  // Como era antes: a foto retrato na raiz, fora do artefato publicado.
  const missing = page('index.html', { 'og:image': `${SITE_URL}Profile.jpg.png` });
  assert.deepEqual(checkSocial({ pages: [missing], images: okImages() }), [
    'index.html: og:image aponta para Profile.jpg.png, que não existe no site publicado',
  ]);

  const images = new Map([[IMG, { bytes: 151 * 1024, size: { width: 896, height: 931 } }]]);
  assert.deepEqual(checkSocial({ pages: [page('index.html')], images }), [
    `index.html: ${IMG} tem 896×931, não 1200×630`,
    `index.html: ${IMG} tem 151 KB (máximo 150 KB)`,
  ]);

  const notPng = new Map([[IMG, { bytes: 1024, size: null }]]);
  assert.deepEqual(checkSocial({ pages: [page('index.html')], images: notPng }), [
    `index.html: ${IMG} não é PNG`,
  ]);
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

test('pngSize lê o IHDR e recusa o que não é PNG', () => {
  const png = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex').copy(png);
  png.writeUInt32BE(1200, 16);
  png.writeUInt32BE(630, 20);
  assert.deepEqual(pngSize(png), { width: 1200, height: 630 });
  assert.equal(pngSize(Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Array(20).fill(0)])), null);
  assert.equal(pngSize(Buffer.alloc(4)), null);
});
