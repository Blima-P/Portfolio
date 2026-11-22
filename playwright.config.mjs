import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
// Mesmo prefixo do GitHub Pages: um caminho absoluto ("/css/x.css") dá 404 aqui, como daria no ar.
const BASE_URL = `http://localhost:${PORT}/Portfolio/`;

export default defineConfig({
  testDir: 'tests',
  // Testes de scripts rodam no node --test (npm run test:unit), sem navegador.
  testIgnore: 'unit/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: BASE_URL,
    // Idioma principal do site; o teste de detecção troca o locale explicitamente.
    locale: 'pt-BR',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node scripts/serve-site.mjs --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
