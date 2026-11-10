# Plano de Implementação — Portfólio v2 (posicionamento para recrutadores de TI)

> Documento de planejamento para evoluir o portfólio `Blima-P/Portfolio` a partir da análise
> crítica (`docs/analise-critica.md` — **arquivo pessoal, mantido fora do Git**; os IDs `C01`, `A01`…
> citados aqui referem-se a ela). Cada **milestone** foi desenhado para ser implementado
> em uma **nova sessão de chat** independente, usando o prompt indicado na seção
> "Prompts por milestone", e entregue em **uma branch + um Pull Request** próprios.

---

## 1. Objetivo

Transformar o portfólio de um "template dev bonito" em uma **peça de candidatura** para vagas de
**estágio/júnior backend Java**, que em até 6 segundos comunique: *quem é Pedro, o que ele já
entrega e onde estão as provas*. Ao mesmo tempo, elevar o site a um padrão técnico
que resista à inspeção de um recrutador técnico que abra o código-fonte.

### Metas mensuráveis (comparar com o baseline da análise, seção 7)

| Métrica | Baseline (`efc9821`) | Meta v2 |
|---|:---:|:---:|
| Lighthouse mobile — Performance | 71 | **≥ 95** |
| Lighthouse mobile — Acessibilidade / Boas práticas / SEO | 96 / 100 / 100 | **100 / 100 / 100** |
| LCP mobile (Lighthouse, 4G simulado) | 8,8 s | **< 2,0 s** |
| Peso total da página inicial | ~1,26 MB | **< 400 KB** |
| Contraste mínimo de texto | 1,74:1 | **≥ 4,5:1** (AA) |
| Achados críticos/altos abertos (análise) | 15 | **0** |
| Conteúdo inventado/desatualizado no repositório | sim | **não** |

### Decisões já tomadas / pendentes (fonte: solicitante)

| Tema | Decisão | Status |
|---|---|---|
| Stack | Manter **HTML + CSS + JS puro, sem build** (é um diferencial e está bom). Ferramentas de qualidade entram só como `devDependencies`/CI. | ✅ Decidido |
| Fluxo de entrega | **Uma branch + um PR por milestone**, merge *squash* em `main`, Conventional Commits. | ✅ Decidido |
| Publicação | GitHub Pages publica de `main` (raiz). **Todo merge vai ao ar** → `main` sempre publicável. | ✅ Fato |
| Idioma padrão | **PT-BR** com detecção (`navigator.language`) e troca manual persistida. | ✅ Decidido |
| Paleta | **A — "Metrô Noturno"** (âmbar `#F5A524` + ciano `#22D3EE`). | ✅ Decidido (10/11/2026) |
| Efeitos visuais | **Enxuto**: manter **partículas (discretas), reveal e terminal**; remover cursor glow, magnético, parallax, page-transition, preloader e ruído. | ✅ Decidido (10/11/2026) |
| Depoimentos | **Remover** os depoimentos sem fonte verificável; só voltar com recomendações reais do LinkedIn, com link. | ✅ Decidido |
| Seção "GitHub" (API ao vivo) | **Remover** (duplica projetos, limite de API, "⭐ 0"). | ✅ Decidido |
| Docs de planejamento | **Plano** versionado em `docs/` (sem nomes, notas ou críticas pessoais). **Análise crítica fica local**, excluída via `.git/info/exclude` — recrutadores leem o repositório. | ✅ Decidido (10/11/2026) |
| Afirmações sensíveis | Nada sobre "produção na CAESB", modelo de trabalho ou datas entra no site sem aprovação explícita na **matriz de fatos** (M4). | ✅ Decidido |

---

## 2. Contexto técnico (resumo da análise)

### Estado atual
- Página única `index.html` (~527 linhas) + `css/styles.css` (~1.300 linhas) + `css/animations.css`
  + **13 scripts** clássicos carregados no fim do `<body>` (sem `defer`, com variáveis globais).
- Textos duplicados em **duas fontes**: HTML estático (EN) e dicionário `js/i18n.js` (EN + PT), que
  já divergem (`A06`). O i18n aplica `innerHTML`, o que apaga o ícone do botão de CV (`A03`).
- Paleta em tokens CSS (`:root` e `[data-theme="light"]`), **mas** com várias cores fixas fora dos
  tokens e na cor das partículas em JS (`M02`).
- Foto `Profile.jpg.png` de 1,2 MB usada no "Sobre" e como `og:image` (`C05`, `M15`).
- Sem `package.json`, sem lint, sem CI (`M14`).

### Arquivos-chave
| Arquivo | Papel | Milestones |
|---|---|---|
| `index.html` | Estrutura, metadados, conteúdo estático | M1, M3, M4, M5 |
| `css/styles.css` | Tokens, layout, componentes | M1, M3, M4, M5 |
| `css/animations.css` | Keyframes, reveal | M2, M5 |
| `js/i18n.js` | Dicionários e troca de idioma | M1, M2, M4 |
| `js/main.js` | Preloader, header, menu, scroll-spy, contadores, filtros | M1, M2, M5 |
| `js/typing.js` | Frases digitadas do hero | M1, M4 |
| `js/theme.js` + `js/particles.js` | Tema e partículas | M2, M3 |
| `js/github.js` | Seção de repositórios via API | M4 (remoção) |
| `js/testimonials.js`, `js/contact.js` | **Código morto** | M1 (remoção) |
| `js/cursor.js`, `magnetic.js`, `parallax.js`, `page-transitions.js` | Efeitos | M2 |
| `js/terminal.js` | Easter egg | M1, M2 |
| `assets/cv/*.pdf`, `Profile.jpg.png`, `favicon.svg` | Ativos | M1, M3, M4, M5 |
| `README.md` | Vitrine do repositório | M6 |

### Riscos e mitigação
| Risco | Mitigação |
|---|---|
| Merge quebra o site em produção (Pages publica `main`) | CI obrigatório no PR (M0) + teste local via servidor HTTP antes do merge. |
| ES Modules não funcionam via `file://` | Sempre testar com `npx serve .` ou `python -m http.server`. |
| Expor informação confidencial da CAESB | Revisar todo texto sobre a CAESB com o próprio Pedro; nada de nomes internos, dados ou telas. |
| Conteúdo inventado para "preencher" | Regra: **todo fato precisa de fonte** (repo, certificado, confirmação do Pedro). Sem fonte → não entra. |
| Regressão de i18n (chave faltando em um idioma) | Script de paridade de chaves no CI (M2). |
| Refatoração quebra interações (tema, idioma, menu, filtros, terminal) | Smoke test automatizado com Playwright no CI a partir do M2. |
| Lighthouse oscila entre execuções / CI não reflete o GitHub Pages | LHCI local (3 execuções, mediana, versões fixadas) como **portão de regressão**; metas finais medidas **no site publicado** (M5/M7). |

---

## 3. Tabela de Milestones (status)

Legenda: ⬜ Pendente · 🟨 Em andamento · ✅ Concluído · ⛔ Bloqueado

| # | Milestone | Branch | Status | Depende de | Data |
|---|---|---|---|---|---|
| M0 | Fundação: docs, padrões e CI de qualidade | `chore/m0-plano-e-qualidade` | 🟨 Em andamento | — | |
| M1 | Integridade e correções críticas (bugs, textos, conteúdo sem fonte, código morto) | `fix/m1-integridade-e-bugs` | ⬜ Pendente | M0 | |
| M2 | Refatoração do código + auditoria de efeitos | `refactor/m2-codigo-e-efeitos` | ⬜ Pendente | M1 | |
| M3 | Identidade visual: paleta, tipografia, header e grade | `feat/m3-identidade-visual` | ⬜ Pendente | M2 | |
| M4 | Conteúdo orientado a recrutador (hero, experiência, projetos, contato) | `feat/m4-conteudo-recrutador` | ⛔ Bloqueado (informações §8 da análise) | M3 | |
| M5 | Performance, SEO e acessibilidade (metas rígidas) | `perf/m5-performance-seo-a11y` | ⬜ Pendente | M4 | |
| M6 | README e vitrine (GitHub/LinkedIn) | `docs/m6-readme-e-vitrine` | ⬜ Pendente | M5 | |
| M7 | QA final, release `v2.0.0` | `chore/m7-qa-e-release` | ⬜ Pendente | M0–M6 | |

> Ao concluir um milestone, atualize esta tabela (status + data) e marque o DOD correspondente.
> A ordem foi escolhida para **minimizar retrabalho**: primeiro limpar e corrigir (M1), depois
> organizar o código (M2), só então trocar visual (M3) e reescrever conteúdo (M4) sobre uma base
> estável; a otimização fina (M5) vem por último, quando o conteúdo final já existe.

---

## 4. Milestones detalhados

### DOD comum a todos os milestones (vale para M1–M7)

- [ ] Branch criada a partir de `main` atualizada; commits em **Conventional Commits**, em PT-BR com acentuação correta.
- [ ] **CI verde** no PR (html-validate, verificação de links e Lighthouse CI; a partir do M2 também lint, paridade i18n e smoke test Playwright). Localmente: `npm run verify`.
- [ ] Testado localmente via servidor HTTP em **390 px, 820 px e 1440 px**, nos **2 temas** e nos **2 idiomas** (roteiro da seção 5).
- [ ] **Zero erros** no console do navegador e zero requisições 404.
- [ ] Nenhum conteúdo inventado; nenhum dado confidencial da CAESB.
- [ ] Tabela de status (seção 3) e checklist do milestone atualizados **no próprio PR**.
- [ ] PR aberto com descrição (o quê / por quê / como testar / capturas antes × depois quando visual) e IDs dos achados resolvidos.
- [ ] **Revisão final (rubber-duck) com outra IA** sobre o diff do milestone; apontamentos tratados e registrados na seção 9.
- [ ] Após o merge: site publicado conferido em https://blima-p.github.io/Portfolio/ (aguardar o deploy do Pages).

---

### M0 — Fundação: docs, padrões e CI de qualidade

**Objetivo:** criar a rede de segurança antes de qualquer mudança — todo PR seguinte passa por validação automática.
**Achados:** `M14` (parcial).

**Escopo**
- Inclui: documentos de planejamento, padrões de editor, template de PR, workflow de CI com avisos.
- Não inclui: nenhuma mudança visual ou de conteúdo do site.

**Tarefas**
1. Versionar `docs/plano-implementacao.md`. Manter `docs/analise-critica.md` **fora do Git**: adicionar `docs/analise-critica.md` em `.git/info/exclude` (exclusão local, não aparece no `.gitignore` público).
2. Criar `.editorconfig` (UTF-8, LF, 2 espaços, newline final) e ajustar `.gitattributes` com **um padrão por linha**: `* text=auto eol=lf`, `*.png binary`, `*.jpg binary`, `*.webp binary`, `*.avif binary`, `*.pdf binary`, `*.woff2 binary`. Rodar `git add --renormalize .` e conferir que o diff só contém finais de linha.
3. Criar `package.json` (`"private": true`, `"engines": {"node": ">=22.22.0"}` — exigência do html-validate 11) **apenas com `devDependencies`** em versões fixas e scripts `validate:html`, `serve` e `verify` (encadeia todas as verificações com `&&` e falha no primeiro erro). **Versionar o `package-lock.json`**; adicionar `node_modules/` e `.lighthouseci/` ao `.gitignore`. O site continua sem build.
4. Criar `.htmlvalidate.cjs` (formato JS para permitir comentários) com `extends: ["html-validate:recommended"]`. Regras que reprovam o código atual e serão resolvidas adiante ficam desativadas **com comentário apontando o milestone** que as reativa.
5. Criar `.github/workflows/quality.yml` (em `pull_request` e `push` para `main`), com um job chamado **`quality`**, Node 22 e `npm ci`:
   - `npm run validate:html`;
   - links com `lycheeverse/lychee-action` com entradas **explícitas** (`index.html README.md docs/plano-implementacao.md`), `--exclude-path node_modules` e exclusão de `linkedin.com` (responde 999 para robôs) e `lattes.cnpq.br` (falha de TLS só no lychee);
   - Lighthouse CI (`treosh/lighthouse-ci-action`, versão fixada) com `lighthouserc.json`: `staticDistDir: "."`, `url: ["http://localhost/index.html"]` (evita auditar outros HTML), `numberOfRuns: 3`, sem `preset` (o padrão do Lighthouse já é mobile) — **somente avisos** nesta fase.
6. Criar `.github/pull_request_template.md` com: resumo, achados resolvidos (IDs), como testar, capturas, checklist do DOD comum.
7. (Opcional, recomendado) Após o primeiro run, proteger `main` exigindo o check `quality` (seção 7.4).

**DOD (Definition of Done)**
- [ ] `docs/plano-implementacao.md` versionado e renderizando no GitHub; `git status` **não** lista `docs/analise-critica.md`.
- [ ] Plano sem nomes de terceiros, notas pessoais ou dados confidenciais.
- [ ] `npm ci && npm run verify` roda localmente sem erro; `package-lock.json` versionado.
- [ ] Workflow `quality` executa no PR do M0 e fica **verde**; relatório do Lighthouse CI acessível no log/artefato e auditando **apenas** `index.html`.
- [ ] Template de PR aparece ao abrir um novo PR.
- [ ] Nenhuma alteração visual no site publicado (comparar captura antes × depois).
- [ ] **Revisão final (rubber-duck) com outra IA** sobre o plano e a configuração de CI; apontamentos tratados e registrados.

---

### M1 — Integridade e correções críticas

**Objetivo:** remover tudo que pode **custar credibilidade** e corrigir bugs visíveis, sem mudar o design.
**Achados:** `C02`, `A03`, `A04`, `A05`, `A06`, `M11`, `B01`, `B02`, `B03`, `B04` (CV), `B05`, `B10`, `C01` (correção textual mínima).

**Escopo**
- Inclui: remoção de conteúdo sem fonte e código morto, correções de texto/bug, idioma padrão.
- Não inclui: nova paleta (M3), reescrita de conteúdo (M4), otimização de imagem (M4/M5).

**Tarefas**
1. **Depoimentos sem fonte (`C02`)**: remover `js/testimonials.js`, chaves `test.*` (EN/PT), CSS `.testimonials*` e a menção no README.
2. **Código morto (`M11`)**: remover `js/contact.js`, `.contact__form*`, `.contact__info-item*`, `.btn--full`, chaves `contact.form.*` e as tags `<script>` correspondentes. Confirmar com `grep` que nada mais os referencia.
3. **Ícone do CV (`A03`)**: mover `data-i18n="hero.cv"` para um `<span>` dentro do `<a>`, preservando o `<svg>`. Varrer **todos** os `data-i18n` em elementos que contenham filhos (mesmo padrão de bug).
4. **Typing (`A04`)**: frases com sentido e gramática, ex.: EN "a Java backend developer", "a Software Engineering student", "an intern at CAESB"; PT "desenvolvedor backend Java", "estudante de Engenharia de Software", "estagiário na CAESB". Remover a frase de tecnologia isolada.
5. **Carteira API (`C01`, mínimo)**: trocar "Paginated statements are planned" pela descrição correta (extrato paginado por cursor **implementado**). A reescrita completa é do M4.
6. **Ortografia e padrão (`B01`–`B03`)**: Assessoria, Estágio, Vídeo, público; travessão `—` em intervalos de datas; "2024" em vez de "2024 — 2024"; padronizar "full stack".
7. **Idioma padrão (`A05`, `A06`)**: ordem de precedência `localStorage` → `navigator.language` (pt\* → `pt-br`, senão `en`). **HTML estático passa a conter o texto PT** (idêntico ao dicionário PT), com `lang="pt-BR"`. **Todos os metadados lidos por robôs** (que não executam JS) passam para PT: `<title>`, `description`, `og:title`, `og:description`, `twitter:*`, `og:locale` `pt_BR` + `og:locale:alternate` `en_US` e textos do JSON-LD. Atualizar `document.documentElement.lang` e `document.title` na troca.
8. **CV (`B04`, `B05`)**: renomear para `assets/cv/pedro-braga-cv-ptbr.pdf`; usar `target="_blank" rel="noopener"` **sem** `download`; rótulo indica idioma ("Currículo (PDF)").
9. **Terminal (`B10`)**: e-mail em minúsculas e igual ao do contato.
10. **Botões**: adicionar `type="button"` a todos os `<button>` e **reativar** a regra `no-implicit-button-type` em `.htmlvalidate.cjs` (desativada no M0).

**DOD**
- [ ] `grep -riE "testimonial|depoimento|'test\." --exclude-dir=node_modules --exclude-dir=.git .` retorna **zero** ocorrências no código versionado (o plano não cita nomes de terceiros).
- [ ] Ícone de download visível no botão de CV nos 2 idiomas e 3 resoluções.
- [ ] Navegador em PT abre em PT; em EN abre em EN; a escolha manual persiste após recarregar.
- [ ] Com JavaScript desabilitado, a página aparece **inteira em PT** e coerente.
- [ ] Nenhum texto "planned/planejado" sobre funcionalidade já pronta.
- [ ] Link do CV abre o PDF (sem 404) no site publicado.
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M2 — Refatoração do código + auditoria de efeitos

**Objetivo:** deixar o código à altura de quem se candidata a backend (organizado, sem globais, com lint) e reduzir efeitos ao que tem propósito.
**Achados:** `M10`, `M12`, `M14` (lint), `A06` (verificação automática), `C05` (preloader).

**Escopo**
- Inclui: ES Modules, lint/format, checagem de i18n, remoção de efeitos acordados.
- Não inclui: mudanças de paleta ou conteúdo.

**Tarefas**
1. Converter os scripts para **ES Modules**: um `js/main.js` de entrada com `<script type="module" src="js/main.js">` (implícito `defer`), cada funcionalidade exportando uma função `init*()`; nenhuma variável global.
2. **Separar os dicionários** em `js/translations.js` — módulo **puro** (só `export const translations = {…}`), sem acesso a `window`, `document` ou `localStorage`, importado tanto pelo `i18n.js` do navegador quanto pelo verificador em Node.
3. **Auditoria de efeitos (`M10`)** conforme decisão registrada na seção 1:
   - remover **preloader** (e a espera artificial de 1.200 ms), `cursor.js`, `magnetic.js`, `parallax.js`, `page-transitions.js`, overlay de ruído e CSS associado;
   - manter partículas (densidade reduzida, pausadas fora da tela), reveal on scroll e terminal.
4. Remover o **contador animado** apenas se a decisão do M4 já estiver confirmada; caso contrário, manter até o M4.
5. Adicionar ESLint (flat config, `eslint:recommended`), Stylelint (`stylelint-config-standard`) e Prettier; scripts `lint`, `format`; incluir no `verify` e no CI.
6. Criar `scripts/check-i18n.mjs`: importa `js/translations.js` e falha se houver chave presente em um idioma e ausente no outro, ou `data-i18n` no HTML sem chave correspondente. Incluir no `verify` e no CI.
7. Trocar `innerHTML` do i18n por `textContent`, exceto chaves explicitamente marcadas como HTML (ex.: títulos com `<span>`), mantidas numa lista branca.
8. **Smoke test com Playwright** (`tests/smoke.spec.mjs`, Chromium, servidor estático): página carrega sem erros de console; troca de tema e idioma (com persistência); menu mobile abre/fecha; filtros de projeto; terminal abre com `Ctrl + \`` e responde `help`; link do CV responde 200. Incluir no CI.
9. **README (correção mínima)**: substituir a instrução de abrir `index.html` direto pelo uso de servidor HTTP (ES Modules não funcionam via `file://`). A reescrita completa fica no M6.

**DOD**
- [ ] `npm run verify` (lint + html-validate + i18n + smoke) passa localmente e no CI.
- [ ] `node scripts/check-i18n.mjs` executa em Node **sem** erro de `window`/`localStorage` indefinidos.
- [ ] Nenhuma variável global criada pelos scripts do site (verificar `Object.keys(window)` antes × depois).
- [ ] Funcionalidades mantidas: tema, idioma, menu mobile, scroll-spy, filtros, terminal, partículas, reveal (cobertas pelo smoke test onde possível).
- [ ] Primeira pintura sem espera artificial (sem preloader).
- [ ] Número de arquivos JS carregados reduzido e documentado no PR.
- [ ] README não orienta mais a abrir o site via `file://`.
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M3 — Identidade visual: paleta, tipografia, header e grade

**Objetivo:** identidade própria e acessível, ligada à foto e ao posicionamento backend.
**Achados:** `A01`, `A02`, `M01`, `M02`, `M03`, `M04` (layout), parte de `C05` (fontes).
**Paleta escolhida:** A — "Metrô Noturno".

**Escopo**
- Inclui: tokens de cor/tipografia, temas escuro e claro, botões, header, grade de projetos, favicon.
- Não inclui: textos novos (M4).

**Tarefas**
1. **Tokens semânticos**: `--color-accent`, `--color-accent-hover`, `--color-accent-ink` (texto sobre acento), `--color-accent-rgb` (para `rgba()`), `--color-secondary`, `--color-focus`. **Eliminar todas as cores fixas** fora de `:root`/tema (inclusive `#fff` em botões e a cor das partículas em JS, que passa a ler `getComputedStyle`).
2. Aplicar a paleta escolhida nos **dois temas**; gradiente do nome sem azul residual. Tokens da **paleta A — "Metrô Noturno"** (contraste verificado, WCAG 2.2):

   | Token | Escuro | Claro |
   |---|---|---|
   | `--color-bg` / `--color-bg-2` / `--color-bg-card` | `#0B0D12` / `#0F1218` / `#151922` | `#FAFAF7` / `#F2F1EC` / `#FFFFFF` |
   | `--color-border` | `#232936` | `#E4E2DC` |
   | `--color-text` / `--color-text-muted` | `#F4F4F5` / `#A1A1AA` | `#16181D` / `#52525B` |
   | `--color-accent` / `--color-accent-hover` | `#F5A524` / `#FFC24D` | `#B45309` / `#92400E` |
   | `--color-accent-ink` | `#0B0D12` (9,52:1) | `#FFFFFF` (5,02:1) |
   | `--color-secondary` | `#22D3EE` | `#0E7490` |

   Gradiente do nome (escuro): `linear-gradient(90deg, #F4F4F5 0%, #FFC24D 55%, #F5A524 100%)`.
3. **Botões (`A01`, `A02`)**: texto `--color-accent-ink`; hover com `--color-accent-hover` + leve elevação; foco visível com `--color-focus`.
4. **Tipografia**: Inter 400/600/800 + JetBrains Mono 400/600 **self-hosted** (`assets/fonts/*.woff2`, subset latin), `font-display: swap`, `<link rel="preload">` só das 2 fontes da primeira dobra; remover Google Fonts. Mono em datas, tags, logo e terminal.
5. **Header (`M03`)**: agrupar idioma + tema à direita, alinhados ao menu; mesmo tamanho de alvo (≥ 44 × 44 px).
6. **Grade de projetos (`M04`)**: layout com card em destaque (largura total) + grade de 2/3 colunas sem órfãos.
7. `favicon.svg` na nova cor; `<meta name="theme-color">` com a cor do tema padrão, **atualizado por JS** na troca manual de tema; `color-scheme` coerente com o tema ativo.

**DOD**
- [ ] Nenhum literal de cor fora dos blocos de tokens: `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[0-9]" css/*.css js/*.js` só encontra linhas dentro de `:root`/`[data-theme]` (usos como `rgba(var(--color-accent-rgb), .2)` são permitidos; exceções justificadas no PR).
- [ ] Contraste ≥ 4,5:1 para todo texto e ≥ 3:1 para componentes/foco, nos **dois temas** (Lighthouse `color-contrast` aprovado + conferência manual dos pares da tabela acima).
- [ ] Nenhuma requisição a `fonts.googleapis.com`/`fonts.gstatic.com`.
- [ ] Capturas antes × depois (3 resoluções × 2 temas) anexadas ao PR.
- [ ] Sem card órfão em 820 px e 1440 px.
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M4 — Conteúdo orientado a recrutador

**Objetivo:** fazer o site **vender o que você já tem**, com provas verificáveis.
**Achados:** `C01`, `C03`, `C04`, `A04`, `A05` (CV EN), `A07`, `A08`, `A09`, `A10`, `M05`, `M06`, `M13`, `B02` (meses), `B06` (alt bilíngue), `B07`, `B09`.
**Bloqueio:** informações pendentes do Pedro — meses das experiências; o que pode ser dito sobre a CAESB; semestre e previsão de formatura; links dos certificados; CV em inglês; recomendações reais (se houver); cidade e modelo de trabalho. Itens sem informação **não são inventados**: ficam fora e registrados na seção 9.

**Escopo**
- Inclui: textos (PT e EN), estrutura das seções, foto no hero, CVs, remoção da seção GitHub.
- Não inclui: SEO/a11y fino e metas de Lighthouse rígidas (M5).

**Tarefas**
0. **Matriz de fatos (antes de escrever qualquer texto)**: preencher a tabela "Matriz de fatos" do arquivo local `docs/analise-critica.md` (seção 9) com cada afirmação que irá ao site, sua fonte (link do repo/certificado ou "confirmado pelo Pedro em dd/mm") e status (aprovado/reprovado). Afirmações sensíveis — "em produção", resultados na CAESB, modelo de trabalho, datas — só entram com aprovação explícita.
1. **Hero**: título estático com cargo ("Desenvolvedor Backend Java · Estagiário na CAESB"); proposta de valor em 1 frase; CTAs "Ver projetos" e "Currículo"; **foto na primeira dobra** já otimizada (`<picture>` AVIF + WebP + fallback JPG, `width`/`height`, ≤ 80 KB, em `assets/img/`), substituindo `Profile.jpg.png`. O typing sai ou vira detalhe secundário que não carrega informação essencial.
2. **Faixa de provas** no lugar dos contadores (`A08`): ex. "Estágio na CAESB · 7 ADRs · CI/CD com Docker · Testes de concorrência · Mantenedor em projeto com 10 pessoas" — cada item com link para a evidência e **somente itens aprovados na matriz de fatos**.
3. **Formação (`A09`)**: Engenharia de Software — UCB, semestre atual e **previsão de conclusão**.
4. **Experiência (`C04`)**: CAESB em destaque com 3–4 bullets **ação → como → resultado** (somente o que Pedro aprovar); "Outras experiências" compactas destacando habilidades transferíveis; datas com mês.
5. **Projetos como estudos de caso (`C01`, `C03`)**:
   - **Carteira API** (destaque): problema, decisões (ACID, idempotência, lock pessimista ordenado, cursor), provas (15 transferências simultâneas, `ArquiteturaTest`, JaCoCo, CI/CD com aprovação, 7 ADRs), stack, links (código, ADRs, Swagger se houver demo);
   - **SocialTech**: mantenedor, time de 10, site em produção via QR Code, CI, acessibilidade; link para o site e para o repo;
   - **InvestStart** ou **painel-semanal** (escolha do Pedro) + ERP Acadêmico/Campo Minado compactos;
   - remover o card "Personal Portfolio".
6. **Remover a seção GitHub (`A07`, `M13`)**: `js/github.js`, HTML, CSS e chaves; link "ver todos os repositórios" no contato.
7. **Skills**: agrupar em Backend · Dados · Front-end · DevOps/Ferramentas com nível honesto ("em produção", "em projetos", "estudando"), mantendo as evidências.
8. **Cursos (`M06`, `M05`)**: link do certificado, ano e carga horária; ícones SVG ou sem ícone.
9. **Contato (`A10`)**: e-mail visível em texto + botão "Copiar" (Clipboard API com fallback), LinkedIn e GitHub, cidade/modelo de trabalho (se aprovados na matriz), CVs **PT e EN**.
10. **Copy (`B07`)**: remover clichês; títulos de seção diretos. **Footer (`B09`)**: `© 2026 Pedro Braga de Lima`, links e "feito à mão, sem frameworks".
11. Atualizar o terminal (`projects`, `about`) para refletir os mesmos projetos.

**DOD**
- [ ] Toda afirmação do site consta como **aprovada** na matriz de fatos, com fonte rastreável (repo, certificado ou confirmação do Pedro).
- [ ] Teste dos 6 segundos: em 390 px e 1440 px, a primeira dobra mostra **nome, cargo, foto, proposta de valor e CTA**.
- [ ] Carteira API e SocialTech com links funcionando; nenhuma informação desatualizada.
- [ ] E-mail visível e botão copiar funcionando (inclusive em navegador sem Clipboard API).
- [ ] CV em PT e EN, cada um servido conforme o idioma ativo.
- [ ] Seção GitHub e `github.js` removidos; nenhuma chamada a `api.github.com`.
- [ ] Textos PT e EN revisados (ortografia e gramática) e com paridade (`check-i18n` verde).
- [ ] Nenhum dado confidencial da CAESB (revisado e aprovado pelo Pedro no PR).
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M5 — Performance, SEO e acessibilidade (metas rígidas)

**Objetivo:** atingir as metas da seção 1 e travá-las no CI.
**Achados:** `C05`, `M07`, `M08`, `M09`, `M15`, `B04` (foto), `B06`.

**Tarefas**
1. **Performance**: confirmar imagens com `width`/`height` e `loading="lazy"` abaixo da dobra e `fetchpriority="high"` na foto do hero; CSS crítico enxuto (avaliar unir `animations.css` em `styles.css`); remover `content-visibility` se atrapalhar âncoras.
2. **Social card (`M15`)**: `assets/img/og-image.png` 1200 × 630 (< 150 KB) com nome, cargo e paleta; `twitter:card=summary_large_image`; `og:image:width/height/alt`.
3. **SEO**: `link rel="canonical"`; `hreflang` não se aplica (mesma URL) — documentar; `sitemap.xml`, `robots.txt`, `404.html` no estilo do site; JSON-LD `Person` enriquecido (`affiliation` com a UCB enquanto estudante — `alumniOf` só após a formatura; `worksFor`, `knowsAbout`, `sameAs`).
4. **Acessibilidade**: *skip link*; `aria-expanded`/`aria-controls` no menu e `inert` quando fechado; `aria-label` no botão de idioma com o idioma de destino; `alt` traduzido; `:focus-visible` em todos os interativos; `scroll-margin-top` igual à altura do header (`M07`); `rel="noopener noreferrer"` em todos os `target="_blank"` (`B06`).
5. **Movimento (`M08`)**: CSS `@media (prefers-reduced-motion: reduce)` desliga transições, reveal e rolagem suave; em JS, `matchMedia('(prefers-reduced-motion: reduce)')` **interrompe o loop das partículas** (não basta esconder o canvas) e os timers do typing, exibindo o texto final; reagir a mudanças da preferência em tempo real.
6. **LHCI rígido (portão de regressão)**: `lighthouserc.json` com `assert` em **erro** sobre o servidor estático do CI: `categories:performance` ≥ 0,9 (folga para a variação dos runners), `categories:accessibility`, `categories:best-practices` e `categories:seo` = 1, `largest-contentful-paint` ≤ 2.500 ms, `cumulative-layout-shift` ≤ 0,05, `total-byte-weight` ≤ 409.600 (bytes). Versões do Node e do Lighthouse fixadas.
7. **Medição oficial no site publicado**: após o merge, rodar Lighthouse mobile 3× contra https://blima-p.github.io/Portfolio/ (mesma versão e configuração do baseline) e registrar a mediana na seção 9 — é essa medição que valida as metas da seção 1.

**DOD**
- [ ] Portão LHCI do CI (asserções em erro) passando.
- [ ] Medição oficial no site publicado (mediana de 3, mobile): Performance ≥ 95; Acessibilidade, Boas práticas e SEO = 100; LCP < 2 s; peso < 400 KB — registrada na seção 9 (desvio justificado se houver).
- [ ] Navegação completa só por teclado (Tab/Shift+Tab/Enter/Esc) com foco sempre visível; menu fechado não recebe foco.
- [ ] NVDA (ou Narrador) lê hero, navegação e botões com nomes corretos nos 2 idiomas.
- [ ] Com `reduced-motion` ativo, nada se move e o loop das partículas não roda (conferir no painel Performance do DevTools).
- [ ] Prévia do link correta no [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) e no WhatsApp.
- [ ] `/Portfolio/qualquer-coisa` exibe a página 404 personalizada.
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M6 — README e vitrine (GitHub e LinkedIn)

**Objetivo:** coerência em todos os pontos de contato que o recrutador visita.
**Achados:** `B08`, `B11`, `C02` (README).

**Tarefas**
1. **README do Portfolio** reescrito: captura do site (`docs/screenshot.png`), link do site, decisões técnicas (sem framework, ES Modules, tokens, i18n), métricas do Lighthouse com data, estrutura de pastas atual, como rodar localmente, qualidade (CI, lint), licença. Sem a seção "Ideias" e sem funcionalidade inexistente.
2. **Perfil GitHub** (repo `Blima-P/Blima-P`, PR separado lá): mesma proposta de valor; link do portfólio; destaques Carteira API e SocialTech.
3. **Repositórios fixados (6)**: carteira-api, SocialTech, InvestStart, painel-semanal, ERP-Academico, Campo-minado (ajustável). Descrições limpas (ex.: remover "Terça-feira - Noturno").
4. **Higiene do perfil**: arquivar ou tornar privados repositórios de exercício sem descrição; avaliar `WalletBackend01` e `Spike-A-…` (versões anteriores da Carteira API) — arquivar com nota apontando para `carteira-api`.
5. **LinkedIn** (manual, checklist no PR): título, "Sobre" e experiências coerentes com o site; link do portfólio na seção "Destaque".

**DOD**
- [ ] README renderiza corretamente, sem links quebrados (lychee verde) e com captura atual.
- [ ] Perfil GitHub com 6 repositórios fixados e descrições revisadas (captura no PR).
- [ ] Mesma proposta de valor no site, README, perfil GitHub e LinkedIn.
- [ ] DOD comum atendido, incluindo **revisão final (rubber-duck) com outra IA** sobre o diff.

---

### M7 — QA final e release `v2.0.0`

**Objetivo:** validar o conjunto e marcar a versão.

**Tarefas**
1. Executar o **roteiro de testes manuais** (seção 5) completo em Chrome, Edge, Firefox e um iPhone/Safari (ou BrowserStack) e um Android.
2. Rodar Lighthouse final (mobile e desktop) e atualizar a tabela de metas da seção 1 com os valores obtidos.
3. Revisar a análise crítica: marcar cada achado como resolvido (com o PR) ou aceito (com justificativa).
4. Criar `CHANGELOG.md` (v2.0.0) e a release no GitHub com capturas antes × depois.

**DOD**
- [ ] Roteiro de testes 100% executado, sem falhas abertas.
- [ ] Todas as metas da seção 1 atingidas (ou desvio justificado na seção 9).
- [ ] Todos os achados `C`, `A` e `M` resolvidos; `B` resolvidos ou justificados.
- [ ] Tag `v2.0.0` e release publicadas.
- [ ] **Revisão final (rubber-duck) com outra IA** sobre o conjunto da entrega; apontamentos tratados e registrados.

---

## 5. Roteiro de testes manuais

Executar com `npx serve .` (ou `python -m http.server 8000`) e, após o merge, no site publicado.

| # | Cenário | Passos | Resultado esperado |
|---|---|---|---|
| T01 | Primeira dobra | Abrir em 390, 820 e 1440 px | Nome, cargo, foto, proposta de valor e CTA visíveis sem rolar (a partir do M4). |
| T02 | Idioma automático | Navegador em PT, depois em EN, com `localStorage` limpo | Abre no idioma do navegador; `<html lang>` correto. |
| T03 | Troca de idioma | Alternar PT/EN e recarregar | Todo o texto troca (incl. `alt`, `aria-label`, `title`); escolha persiste; ícones preservados. |
| T04 | Tema | Alternar escuro/claro e recarregar | Persistência; contraste ok; partículas na cor do tema. |
| T05 | Navegação | Clicar em cada item do menu | Rola até a seção sem esconder o título; item ativo destacado. |
| T06 | Menu mobile | 390 px: abrir, navegar, fechar com Esc | `aria-expanded` alterna; foco não vai para o menu fechado. |
| T07 | Teclado | Percorrer a página só com Tab | Ordem lógica, foco visível, skip link funciona. |
| T08 | Leitor de tela | NVDA/Narrador no hero, menu, projetos e contato | Nomes e papéis corretos. |
| T09 | Movimento reduzido | Ativar "reduzir movimento" no SO | Sem animações; texto do typing aparece completo. |
| T10 | CV | Clicar em "Currículo" em PT e em EN | Abre o PDF do idioma correspondente em nova aba. |
| T11 | Contato | Clicar em "Copiar e-mail" | E-mail copiado e feedback visível/anunciado. |
| T12 | Links externos | Clicar em todos os links de projetos e redes | Sem 404; abrem em nova aba com `rel` seguro. |
| T13 | Terminal | `Ctrl + \`` → `help`, `projects`, `exit` | Funciona nos 2 idiomas; conteúdo coerente com o site. |
| T14 | Sem JavaScript | Desabilitar JS | Conteúdo PT completo e legível. |
| T15 | Compartilhamento | Colar a URL no LinkedIn/WhatsApp | Card grande com imagem, título e descrição corretos. |
| T16 | 404 | Acessar `/Portfolio/nao-existe` | Página 404 no estilo do site com link de volta. |
| T17 | Console/Rede | DevTools aberto durante T01–T13 | Zero erros, zero 404. |

---

## 6. Padrões e cuidados do projeto (lembrar em cada sessão)

- **Texto em PT-BR com acentuação correta**; arquivos em **UTF-8 sem BOM**, finais de linha **LF**.
- **Conventional Commits** (`feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `chore`, `ci`), escopo opcional, mensagem no imperativo.
- **`main` sempre publicável**: nada vai para `main` sem PR e CI verde.
- **Sem framework e sem etapa de build** para o site; `package.json` é só para ferramentas de qualidade.
- **Nenhum conteúdo inventado**; nenhum dado interno da CAESB (nomes de sistemas internos, telas, dados, código).
- **Tokens de design**: nenhuma cor/tamanho mágico fora de `:root`/tema.
- **i18n**: toda string visível existe nos dois idiomas; o HTML estático é o texto PT.
- **Acessibilidade primeiro**: contraste AA, alvos ≥ 44 px, foco visível, `reduced-motion`.
- Testar sempre por **servidor HTTP** (ES Modules não funcionam via `file://`).
- Imagens otimizadas (AVIF/WebP) com dimensões declaradas; nomes de arquivo em minúsculas e com hífen.

---

## 7. Fluxo Git e PR (comandos por milestone)

Comandos para **PowerShell** na pasta `C:\Users\pedroblima\Desktop\Portifolio`.
Exige `git` e `gh` autenticado (`gh auth status`).

### 7.1 Fluxo padrão (substituir `<branch>`, `<tipo>` e textos)

```powershell
# 1. Partir de main atualizada
git switch main
git pull --ff-only

# 2. Criar a branch do milestone
git switch -c <branch>

# 3. Commits pequenos durante o trabalho (repetir quantas vezes precisar)
git add -A
git status            # conferir o que entra no commit
git commit -m "<tipo>(escopo): descrição no imperativo" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 4. Validar localmente antes de publicar (falha no primeiro erro)
npm run verify
npx serve .                                  # testar em http://localhost:3000

# 5. Publicar a branch e abrir o PR
git push -u origin <branch>
gh pr create --base main --title "<título do PR>" --body-file .github/pull_request_template.md
gh pr view --web                             # completar a descrição e anexar capturas

# 6. Acompanhar o CI e fazer o merge (squash) quando estiver verde
gh pr checks --watch
gh pr merge --squash --delete-branch

# 7. Voltar para main e conferir o deploy
git switch main
git pull --ff-only
gh run list --limit 3                         # "pages build and deployment" concluído
```

### 7.2 Branches, títulos de PR e commits sugeridos

| # | Branch | Título do PR (vira o commit do squash) | Commits sugeridos |
|---|---|---|---|
| M0 | `chore/m0-plano-e-qualidade` | `chore: M0 — plano, padrões e CI de qualidade` | `docs: adiciona análise crítica e plano de implementação` · `chore: adiciona editorconfig e normaliza gitattributes` · `ci: adiciona validação de HTML, links e Lighthouse` · `chore: adiciona template de PR` |
| M1 | `fix/m1-integridade-e-bugs` | `fix: M1 — integridade do conteúdo e correções críticas` | `fix: remove depoimentos sem fonte` · `chore: remove código morto` · `fix(hero): preserva ícone do botão de currículo` · `fix(i18n): corrige ortografia, datas e frases do typing` · `feat(i18n): define PT-BR como padrão com detecção do navegador` · `fix(cv): renomeia arquivo e corrige link` |
| M2 | `refactor/m2-codigo-e-efeitos` | `refactor: M2 — ES Modules, lint e auditoria de efeitos` | `refactor(js): migra scripts para ES Modules` · `refactor: remove efeitos sem propósito e preloader` · `chore: adiciona ESLint, Stylelint e Prettier` · `ci: verifica paridade de chaves do i18n` |
| M3 | `feat/m3-identidade-visual` | `feat: M3 — nova identidade visual acessível` | `refactor(css): centraliza cores em tokens semânticos` · `feat(theme): aplica paleta Metrô Noturno` · `perf(fonts): hospeda fontes localmente` · `fix(header): agrupa ações à direita` · `fix(projects): remove card órfão da grade` |
| M4 | `feat/m4-conteudo-recrutador` | `feat: M4 — conteúdo orientado a recrutadores` | `feat(hero): cargo, proposta de valor e foto otimizada` · `feat(about): faixa de provas e formação` · `feat(experience): bullets de impacto` · `feat(projects): estudos de caso Carteira API e SocialTech` · `refactor: remove seção GitHub` · `feat(contact): e-mail visível com cópia e CV em inglês` |
| M5 | `perf/m5-performance-seo-a11y` | `perf: M5 — performance, SEO e acessibilidade` | `perf: otimiza carregamento e imagens` · `feat(seo): og-image, sitemap, robots e 404` · `fix(a11y): skip link, ARIA do menu e foco visível` · `feat(a11y): respeita prefers-reduced-motion` · `ci: torna limites do Lighthouse obrigatórios` |
| M6 | `docs/m6-readme-e-vitrine` | `docs: M6 — README e vitrine` | `docs: reescreve README com métricas e captura` |
| M7 | `chore/m7-qa-e-release` | `chore: M7 — QA final e release v2.0.0` | `docs: registra resultados finais e changelog` |

### 7.3 Release (ao final do M7)

```powershell
git switch main
git pull --ff-only
git tag -a v2.0.0 -m "Portfólio v2.0.0"
git push origin v2.0.0
gh release create v2.0.0 --title "Portfólio v2.0.0" --notes-file CHANGELOG.md
```

### 7.4 Proteção da `main` (opcional, recomendado no M0 — após o primeiro run do CI)

```powershell
gh api -X PUT repos/Blima-P/Portfolio/branches/main/protection `
  -H "Accept: application/vnd.github+json" `
  -F "required_status_checks[strict]=true" `
  -f "required_status_checks[contexts][]=quality" `
  -F "enforce_admins=false" `
  -F "required_pull_request_reviews=null" `
  -F "restrictions=null"
```

> O nome do contexto (`quality`) deve ser igual ao nome do job exibido em `gh pr checks`.

---

## 8. Prompts por milestone

> **Como usar:** abra uma **nova sessão** na pasta `C:\Users\pedroblima\Desktop\Portifolio` e cole o
> prompt do milestone. Cada sessão deve ler primeiro `docs/plano-implementacao.md` e
> `docs/analise-critica.md`.
>
> **Revisão obrigatória (DOD):** antes de concluir qualquer milestone, submeta o resultado a uma
> **revisão rubber-duck com OUTRA IA** (ex.: subagente `rubber-duck` ou outro modelo). Trate os
> apontamentos relevantes e registre-os na seção 9.

### Prompt — M0
```
Leia docs/plano-implementacao.md e docs/analise-critica.md (este último é local e NUNCA deve ser
versionado). Implemente o milestone M0 (Fundação: docs, padrões e CI de qualidade) exatamente
como descrito nas tarefas, na branch chore/m0-plano-e-qualidade. Não altere o visual nem o
conteúdo do site. Valide localmente (npm ci, npm run verify) e garanta que o workflow fique verde
no PR. Ao final, atualize o DOD e a tabela de status no plano, forneça os comandos git/gh do
fluxo da seção 7 e o texto do PR.
Antes de concluir, faça uma revisão rubber-duck com OUTRA IA sobre o diff, trate os apontamentos e
registre-os na seção 9 (DOD).
```

### Prompt — M1
```
Leia docs/plano-implementacao.md e docs/analise-critica.md. Implemente o milestone M1
(Integridade e correções críticas) na branch fix/m1-integridade-e-bugs, cobrindo os achados
listados (C02, A03, A04, A05, A06, M11, B01-B05, B10 e a correção mínima de C01). Não mude a
paleta nem reescreva conteúdo além do necessário. Teste com servidor HTTP em 390/820/1440 px, nos
2 temas e 2 idiomas, inclusive com JavaScript desabilitado. Atualize o DOD e a tabela de status,
forneça os commits, os comandos git/gh e o texto do PR. Antes de concluir, faça uma revisão
rubber-duck com OUTRA IA sobre o diff, trate os apontamentos e registre-os na seção 9 (DOD).
```

### Prompt — M2
```
Leia docs/plano-implementacao.md (seção 1: decisão sobre efeitos visuais) e implemente o milestone
M2 (ES Modules, lint e auditoria de efeitos) na branch refactor/m2-codigo-e-efeitos. Nenhuma
variável global; preserve tema, idioma, menu, scroll-spy, filtros, terminal, partículas e reveal.
Extraia os dicionários para js/translations.js (módulo puro, sem window/document/localStorage),
crie scripts/check-i18n.mjs e o smoke test Playwright, e inclua lint + i18n + smoke no
npm run verify e no CI. Corrija no README a instrução de abrir via file://.
Valide com npm run verify e servidor HTTP.
Atualize o DOD e a tabela de status, forneça commits, comandos git/gh e texto do PR. Antes de
concluir, faça uma revisão rubber-duck com OUTRA IA sobre o diff, trate os apontamentos e
registre-os na seção 9 (DOD).
```

### Prompt — M3
```
Leia docs/plano-implementacao.md e a seção 6 de docs/analise-critica.md. Aplique a paleta
escolhida (registrada na seção 1 do plano) no milestone M3 na branch feat/m3-identidade-visual:
tokens semânticos sem cores fixas, temas escuro e claro, botões acessíveis, fontes self-hosted,
header agrupado e grade de projetos sem órfãos. Verifique contraste (>= 4,5:1 texto, >= 3:1
componentes) nos dois temas e gere capturas antes x depois em 390/820/1440 px. Atualize o DOD e a
tabela de status, forneça commits, comandos git/gh e texto do PR. Antes de concluir, faça uma
revisão rubber-duck com OUTRA IA sobre o diff, trate os apontamentos e registre-os na seção 9 (DOD).
```

### Prompt — M4
```
Leia docs/plano-implementacao.md, docs/analise-critica.md (seções 4, 5, 8 e 9) e os READMEs de
Blima-P/carteira-api e Blima-P/SocialTech. Implemente o milestone M4 (conteúdo orientado a
recrutador) na branch feat/m4-conteudo-recrutador. Comece preenchendo a matriz de fatos (seção 9
da análise local) com as informações que eu fornecer nesta sessão e use APENAS afirmações
aprovadas nela; pergunte o que faltar em vez de inventar e nunca inclua
dados confidenciais da CAESB. Textos em PT e EN com paridade. Foto do hero otimizada (AVIF/WebP,
<= 80 KB, width/height). Teste o "teste dos 6 segundos" em 390 e 1440 px. Atualize o DOD e a
tabela de status, forneça commits, comandos git/gh e texto do PR. Antes de concluir, faça uma
revisão rubber-duck com OUTRA IA sobre o diff, trate os apontamentos e registre-os na seção 9 (DOD).
```

### Prompt — M5
```
Leia docs/plano-implementacao.md e implemente o milestone M5 (performance, SEO e acessibilidade)
na branch perf/m5-performance-seo-a11y. Configure o portão LHCI da tarefa 6 (asserções em erro)
e, após o merge, meça o site publicado (tarefa 7: mediana de 3, mobile; metas Performance >= 95,
A11y/Boas práticas/SEO = 100, LCP < 2 s, peso < 400 KB). Inclua og-image 1200x630, sitemap, robots, 404, skip link, ARIA do
menu com inert, focus-visible, scroll-margin-top e prefers-reduced-motion (CSS + parada do loop
de partículas em JS). JSON-LD com affiliation (não alumniOf). Execute o roteiro de
testes T05-T09 e T15-T17. Atualize o DOD e a tabela de status, forneça commits, comandos git/gh e
texto do PR. Antes de concluir, faça uma revisão rubber-duck com OUTRA IA sobre o diff, trate os
apontamentos e registre-os na seção 9 (DOD).
```

### Prompt — M6
```
Leia docs/plano-implementacao.md e implemente o milestone M6 (README e vitrine) na branch
docs/m6-readme-e-vitrine: reescreva o README com captura atual, métricas reais do Lighthouse,
decisões técnicas e instruções locais. Depois, gere a lista de ações para o perfil GitHub
(repositórios fixados, descrições, arquivamentos) e o checklist do LinkedIn, e proponha o PR
separado para o repositório Blima-P/Blima-P. Atualize o DOD e a tabela de status, forneça commits,
comandos git/gh e texto do PR. Antes de concluir, faça uma revisão rubber-duck com OUTRA IA, trate
os apontamentos e registre-os na seção 9 (DOD).
```

### Prompt — M7
```
Leia docs/plano-implementacao.md e execute o milestone M7 (QA final e release v2.0.0) na branch
chore/m7-qa-e-release: rode todo o roteiro de testes da seção 5, o Lighthouse final (mobile e
desktop), atualize a tabela de metas da seção 1 e marque cada achado da análise como resolvido
(com PR) ou aceito (com justificativa). Crie o CHANGELOG.md e forneça os comandos de tag e release
da seção 7.3. Antes de concluir, faça uma revisão rubber-duck com OUTRA IA sobre o conjunto da
entrega, trate os apontamentos e registre-os na seção 9 (DOD).
```

---

## 9. Observações / registro de decisões (atualizar durante a execução)

| Data | Milestone | Registro |
|---|---|---|
| 10/11/2026 | — | Análise crítica concluída sobre o commit `efc9821`; baseline do Lighthouse registrado na análise (seção 7). |
| 10/11/2026 | M0 | Decisões do Pedro: paleta **A**, efeitos **enxutos**, análise crítica **privada**. |
| 10/11/2026 | M0 | Lychee: `lattes.cnpq.br` excluído — o servidor do CNPq recusa o handshake TLS do lychee, mas o link responde 302 no navegador/curl. Verificação manual no T12. |
| 10/11/2026 | M0 | html-validate: estilo `void-style: selfclose` adotado (padrão do código); `no-implicit-button-type` desativada até o M1. LHCI local reproduziu o baseline (Performance 74, Acessibilidade 96), auditando só `index.html`. |
| 10/11/2026 | M0 | `cache-insight` (cabeçalho de cache do GitHub Pages) aceito como limitação da hospedagem. |
| 10/11/2026 | M0 | **Revisão rubber-duck do plano** (outra IA). Apontamentos tratados: (1) análise crítica mantida fora do repositório público e plano sem nomes de terceiros; (2) matriz de fatos obrigatória antes do M4 e `affiliation` em vez de `alumniOf`; (3) `.gitattributes` com um padrão por linha, config do html-validate em `.cjs`, `package-lock.json` versionado; (4) LHCI com URL explícita e sem `preset`, lychee com entradas explícitas e sem `node_modules`; (5) dicionários em módulo puro `translations.js` para o verificador em Node; (6) correção mínima do README no M2; (7) script único `npm run verify`; (8) metadados de robôs em PT no M1; (9) checagem de cores do M3 aceita `rgba(var(...))`; (10) portão LHCI no CI separado da medição oficial no site publicado; (11) smoke test Playwright no M2; (12) `reduced-motion` também em JS. |
