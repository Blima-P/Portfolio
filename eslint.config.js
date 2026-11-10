// ESLint (flat config): JS do site como ES Modules no navegador; scripts e testes em Node.
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '.lighthouseci/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: { sourceType: 'module', globals: globals.browser },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', '*.config.js', '*.config.mjs'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
];
