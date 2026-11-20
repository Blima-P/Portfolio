# Contribuindo

Obrigado pelo interesse! Este é um portfólio pessoal, mas correções, sugestões e revisões são
bem-vindas. Dúvidas e ideias soltas vão para as
[Discussions](https://github.com/Blima-P/Portfolio/discussions); trabalho concreto começa por uma
[issue](https://github.com/Blima-P/Portfolio/issues/new/choose).

## Rodando localmente

Requisitos: Node.js 22.22 ou superior.

```bash
git clone https://github.com/Blima-P/Portfolio.git
cd Portfolio
npm ci
npx playwright install chromium   # só na primeira vez, para os testes
npm run serve                     # http://localhost:3000
```

O site é HTML, CSS e JavaScript puro, **sem etapa de build**: o que está no repositório é o que vai
ao ar. Abra sempre por HTTP — os ES Modules não carregam via `file://`.

## Antes de abrir o PR

```bash
npm run stamp    # se mudou algum CSS ou JS (atualiza o ?v= que invalida o cache)
npm run verify   # ESLint, Stylelint, Prettier, html-validate, i18n, stamp, testes de scripts e Playwright
```

O CI (`quality`) roda o mesmo `verify`, checa links e mede Lighthouse; nada entra na `main` com ele
vermelho.

## Padrões

- **Idioma:** textos da interface, commits e PRs em PT-BR com acentuação; identificadores em ASCII.
  Todo texto novo precisa da versão em inglês (`npm run check:i18n` confere a paridade).
- **Formato:** UTF-8, LF e 2 espaços (`.editorconfig`); o Prettier decide o resto.
- **Segurança:** dados externos entram no DOM por `textContent`, nunca interpolados em HTML.
- **Acessibilidade:** nada essencial depende de animação; tudo respeita `prefers-reduced-motion`.
- **Conteúdo:** toda afirmação sobre experiência ou projeto precisa de fonte verificável.

## Fluxo de um PR

1. Issue pelo formulário adequado (bug, melhoria ou conteúdo).
2. Branch a partir da `main` atualizada: `tipo/escopo-curto` (ex.: `fix/menu-mobile`).
3. Commits pequenos em [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
   `tipo(escopo): descrição no imperativo`. Tipos: `feat`, `fix`, `docs`, `style`, `refactor`,
   `perf`, `test`, `build`, `ci`, `chore`, `revert`. Pareou com alguém? Credite com o trailer
   `Co-authored-by: Nome <email>` no último parágrafo da mensagem.
4. PR seguindo o template, com `Closes #<issue>`. O **título** também segue Conventional Commits
   (o check `pr-title` valida), porque vira o assunto do commit no squash merge.
5. Merge somente por squash, com `quality` e `pr-title` verdes.

O andamento público fica nas [issues](https://github.com/Blima-P/Portfolio/issues) e nos
[milestones](https://github.com/Blima-P/Portfolio/milestones), com critérios de pronto em cada um.
