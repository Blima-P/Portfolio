# Plano de Implementação — Portfólio v3 ("fazer brilhar os olhos")

> Documento de planejamento para levar o portfólio `Blima-P/Portfolio` de "site bem-feito por
> dentro" a **peça de candidatura que impressiona por fora e por dentro**. Parte da análise crítica
> v3 (`docs/analise-critica.md` — **arquivo pessoal, fora do Git**; os IDs `R01…R44` citados aqui
> referem-se a ela). Cada **milestone** é implementado em uma **nova sessão de chat**, com o prompt
> da seção 9, e entregue como **vários PRs pequenos** (um por fatia), cada um com issue própria.
>
> Histórico: o plano v2 (M0–M2 concluídos, PRs #5–#10) está arquivado em
> [`docs/historico/plano-v2.md`](historico/plano-v2.md). Este plano **continua a numeração** (M3 em
> diante) e absorve os milestones M3–M7 que estavam pendentes no v2.

---

## 1. Objetivo

1. **Recrutador (6 segundos, celular):** entender *quem é Pedro, para qual vaga serve, o que já
   entregou e onde estão as provas* — sem rolar.
2. **Recrutador técnico (DevTools + repositório):** encontrar um site acessível, rápido, seguro,
   testado, com histórico de PRs, issues, ADRs e releases que contam a história do projeto.
3. **Perfil GitHub:** cada entrega gera PRs reais, pequenos e revisáveis, com coautoria — o que
   alimenta as conquistas **Pair Extraordinaire (ouro)** e **Pull Shark** sem nenhum PR artificial
   (seção 10).

### Metas mensuráveis (baseline medido em 17/11/2026 no site publicado, `cc6002f`)

| Métrica | Baseline | Meta v3 |
|---|:---:|:---:|
| Títulos de seção visíveis | **0 de 7** (R01) | 7 de 7, com teste automatizado — ✅ atingido no M3 |
| Lighthouse mobile — Performance | 74 | **≥ 95** |
| Lighthouse mobile — Acessibilidade / Boas práticas / SEO | 95 / 100 / 100 | **100 / 100 / 100** |
| LCP mobile (4G simulado) | 8,1 s | **< 2,0 s** |
| Peso total da página inicial | 1.254 KiB | **< 400 KiB** |
| Contraste mínimo de texto | ≈ 1,7:1 | **≥ 4,5:1** (AA) nos 2 temas |
| Violações axe-core (2 temas × 2 idiomas) | não medido | **0** |
| Achados críticos/altos abertos (R01–R17) | 17 | **0** |
| PRs mergeados com coautoria (Pair Extraordinaire) | 32 candidatos (medidos; contagem do GitHub não confirmada) | **≥ 48** (ouro) |

### Decisões

| Tema | Decisão | Status |
|---|---|---|
| Stack | HTML + CSS + JS puro, **sem build**. Ferramentas só em `devDependencies`/CI. Herdado do v2. | ✅ Decidido |
| Paleta | **A — "Metrô Noturno"** (âmbar `#F5A524` + ciano `#22D3EE`), tokens na seção M5. Herdado do v2. | ✅ Decidido |
| Efeitos | Só com propósito; tudo desliga com `prefers-reduced-motion`. Herdado do v2. | ✅ Decidido |
| Análise crítica | Fica **local** (`.git/info/exclude`); o plano é público e sem críticas pessoais. | ✅ Decidido |
| Granularidade | **1 milestone = vários PRs pequenos** (uma fatia coesa e revisável por PR, ~50–400 linhas). | ✅ Decidido (17/11/2026) |
| Coautoria | Todo commit leva `Co-authored-by` do par que realmente trabalhou (Copilot e/ou colega). | ✅ Decidido (17/11/2026) |
| Identidade git | Commits como **Blima-P** (`Pedro Braga de Lima <pbl0812@gmail.com>`), configurado só neste repositório. | ✅ Decidido (17/11/2026) |
| Vaga-alvo (estágio × júnior) | Pendente — define hero, CV e JSON-LD (análise §7, item 1). | ⏳ Pendente (bloqueia M6) |
| Multipágina (estudos de caso) | Páginas estáticas em `projetos/*.html`, mesmo CSS/JS. | ✅ Proposto — confirmar no M7 |
| Analytics sem cookie, domínio próprio, Public Sponsor | Opcionais, decisão do Pedro. | ⏳ Pendente (não bloqueia) |

---

## 2. Contexto técnico

### Estado atual (pós-M2)
- `index.html` (página única, PT estático) + `css/styles.css` + `css/animations.css` + 8 ES Modules
  (`main.js` de entrada; `terminal.js` sob demanda). Sem globais (testado).
- Qualidade: ESLint, Stylelint, Prettier, html-validate, `check-i18n`, `stamp-assets` (cache-busting
  por hash), Playwright (smoke, desktop + mobile), lychee e LHCI (**só avisos**) no job `quality`.
- Publicação: GitHub Pages "legacy" a partir de `main` (raiz). **Todo merge vai ao ar.**

### Problemas de raiz que orientam a ordem dos milestones
1. **R01 em produção** (títulos invisíveis) → hotfix antes de qualquer outra coisa (M3).
2. Não há portão entre CI e deploy (R33) nem proteção da `main` (R32) → governança cedo (M4),
   antes das mudanças grandes.
3. Visual (M5) antes de conteúdo (M6): o conteúdo novo já nasce nos tokens novos.
4. Regressão visual (M12) só depois que o design estabiliza — antes disso geraria retrabalho.

### Arquivos-chave
| Arquivo | Papel | Milestones |
|---|---|---|
| `index.html` | Estrutura, metadados, conteúdo | M3, M5–M11 |
| `projetos/*.html` (novo) | Estudos de caso | M7, M9–M11 |
| `css/styles.css`, `css/animations.css` | Tokens, layout, animações (unificados no M10) | M3, M5, M8–M10 |
| `js/ui.js` | Header, menu, scroll-spy, reveal, filtros | M3, M7–M9 |
| `js/translations.js`, `js/i18n.js` | Dicionários e troca de idioma | M6–M9 |
| `js/terminal.js` | Terminal (vira recurso acessível e descobrível) | M8 |
| `js/github.js` | Seção GitHub (removida) | M6 |
| `tests/*.spec.mjs` | Smoke, visibilidade, a11y, visual, fluxo do recrutador | M3, M9, M12 |
| `.github/` | Workflows, templates, Dependabot, CODEOWNERS | M4, M10, M12 |
| `docs/adr/` (novo) | Registros de decisão | M13 |
| `README.md`, `CHANGELOG.md` | Vitrine do repositório | M13, M15 |

### Riscos e mitigação
| Risco | Mitigação |
|---|---|
| Merge quebra produção | M4 publica pelo GitHub Actions **só depois do job `quality` completo** (verify + lychee + LHCI); proteção da `main` exige `quality`, inclusive para administradores. |
| Teste verde com página visualmente quebrada (caso R01) | M3 adiciona teste de visibilidade; M9 axe; M12 regressão visual. |
| Conteúdo inventado para "preencher" | **Matriz de fatos** (análise §7) obrigatória antes do M6. Sem fonte → não entra. |
| Dado confidencial da CAESB | Todo texto sobre a CAESB aprovado pelo Pedro no PR. |
| PRs "inflados" para conquistas (recrutador abre a lista de PRs) | Regras da seção 10.3: cada PR tem objetivo, issue, teste e descrição; nada vazio ou artificial. |
| Coautoria não reconhecida | Trailer no corpo de **cada** commit; squash do GitHub preserva (configuração `COMMIT_MESSAGES`); conferir após o merge (seção 7). |
| ES Modules não funcionam via `file://` | Sempre `npm run serve`. |
| Multipágina quebra i18n/cache-busting | M7 começa por um PR de infraestrutura que estende `check-i18n` e `stamp-assets` a `projetos/*.html`. |

---

## 3. Tabela de Milestones (status)

Legenda: ⬜ Pendente · 🟨 Em andamento · ✅ Concluído · ⛔ Bloqueado

| # | Milestone | PRs | Status | Depende de | Data |
|---|---|:---:|---|---|---|
| M0–M2 | Fundação, integridade e refatoração (plano v2) | 6 | ✅ Concluído (#5–#10) | — | 10/11/2026 |
| M3 | Plano v3 + hotfix dos títulos invisíveis | 3 | ✅ Concluído (#12, #15, #16) | — | 18/11/2026 |
| M4 | Governança do repositório e portão de deploy | 6 (+1 ajuste) | ✅ Concluído (#18–#31) | M3 | 18/11/2026 |
| M5 | Identidade visual "Metrô Noturno" | 6 | ⬜ Pendente | M4 | |
| M6 | Conteúdo orientado a recrutador | 9 | ⛔ Bloqueado (análise §7) | M5 | |
| M7 | Projetos como estudos de caso | 5 | ⬜ Pendente | M6 | |
| M8 | Interações com propósito (terminal, tema, impressão, 404) | 6 | ⬜ Pendente | M7 | |
| M9 | Acessibilidade WCAG 2.2 AA | 5 | ⬜ Pendente | M8 | |
| M10 | Performance (metas rígidas) | 4 | ⬜ Pendente | M9 | |
| M11 | SEO, compartilhamento e segurança | 4 | ⬜ Pendente | M10 | |
| M12 | Testes e CI avançados | 4 | ⬜ Pendente | M11 | |
| M13 | Documentação, ADRs e história do projeto | 6 | ⬜ Pendente | M12 | |
| M14 | Vitrine no GitHub (perfil e outros repositórios) | 6 | ⬜ Pendente | M6 (pode correr em paralelo a M7–M13) | |
| M15 | QA final, release `v3.0.0` e divulgação | 2 | ⬜ Pendente | M3–M14 | |
| | **Total previsto** | **66** | | | |

> Ao concluir **cada PR**, marque-o na tabela do milestone; ao concluir o milestone, atualize esta
> tabela e o placar de conquistas (seção 10.4). O plano é atualizado **no próprio PR** que conclui a fatia.

---

## 4. Milestones detalhados

### DOD comum (vale para todo PR de M3 a M15)

- [ ] Issue criada (template do M4 a partir dele), com label e milestone do GitHub; PR com `Closes #<n>`.
- [ ] Branch a partir de `main` atualizada; **Conventional Commits** em PT-BR com acentuação.
- [ ] **Todo commit** com trailer `Co-authored-by:` de quem realmente pareou (seção 7).
- [ ] `npm run verify` verde localmente e **CI verde** no PR.
- [ ] Testado via `npm run serve` em **390, 820 e 1440 px**, **2 temas**, **2 idiomas**; zero erro de console e zero 404.
- [ ] Nenhum conteúdo inventado; nenhum dado confidencial da CAESB.
- [ ] Descrição do PR: o quê / por quê / como testar / capturas antes × depois (se visual) / IDs `Rxx`.
- [ ] **Revisão rubber-duck com outra IA** sobre o diff; apontamentos tratados e registrados na seção 11.
- [ ] Merge *squash*; conferido que o commit em `main` manteve o trailer; branch apagada.
- [ ] Site publicado conferido após o deploy (https://blima-p.github.io/Portfolio/).
- [ ] Tabela do milestone, tabela da seção 3 e placar da seção 10.4 atualizados.

---

### M3 — Plano v3 + hotfix dos títulos invisíveis

**Objetivo:** registrar o plano e **parar o sangramento**: hoje nenhum título de seção aparece em produção.
**Achados:** `R01`, `R29` (parcial).

| PR | Branch | Título (vira o commit do squash) | Status |
|---|---|---|---|
| 3.1 | `docs/m3-plano-v3` | `docs: M3 — plano de implementação v3` | ✅ #12 |
| 3.2 | `fix/m3-titulos-invisiveis` | `fix(reveal): títulos e subtítulos de seção voltam a aparecer` | ✅ #15 |
| 3.3 | `test/m3-visibilidade` | `test(smoke): falha se conteúdo de seção ficar invisível` | ✅ #16 |

**Tarefas**
1. (3.1) Arquivar o plano v2 em `docs/historico/`, publicar este plano; análise crítica fora do Git.
   **Bootstrap:** criar os milestones do GitHub M3–M15 (`gh api repos/Blima-P/Portfolio/milestones -f title=M<N>`)
   para que o comando de issue da seção 7.2 funcione antes do M4; até o 4.2, usar só as labels padrão
   (`bug`, `enhancement`, `documentation`).
2. **Ordem de merge (o `verify` precisa estar verde em todo merge):** escrever o teste do 3.3 primeiro e
   registrar no PR a evidência de que ele **falha** contra `cc6002f` (saída do Playwright); mergear o 3.2
   (correção); depois rebasear o 3.3 sobre a `main` corrigida e mergear com o teste verde.
3. (3.2) **Causa raiz:** `.text-reveal`/`.subtitle-reveal` começam com `clip-path: inset(0 100% 0 0)`,
   o que zera a área visível do elemento; o `IntersectionObserver` com `threshold: 0.3` mede
   `intersectionRatio = 0` e nunca dispara. Correção: observar a **seção** (ou o `.container`) e
   aplicar a classe nos títulos dela; manter a animação apenas como enfeite (o estado final não
   pode depender dela). Sem JS, títulos visíveis (as classes já são adicionadas por JS — manter).
4. (3.3) Teste Playwright (desktop e mobile): para cada `main section[id]` **com título** (o hero não
   tem `.section__title` e fica de fora), rolar até ela e esperar que `.section__title` e
   `.section__subtitle` tenham `opacity` = 1 e `clip-path` sem recorte — aceitar `none` ou qualquer
   `inset` com todos os valores zero (o Chromium serializa como `inset(0px 0% 0px 0px)`). Teste também
   a navegação por âncora (clicar no menu e conferir o título da seção de destino).

**DOD**
- [x] Plano v3 publicado; `git status` não lista `docs/analise-critica.md`.
- [x] Os 7 títulos e 7 subtítulos visíveis em 390/820/1440 px, nos 2 temas e idiomas, inclusive ao navegar pelo menu (âncora).
- [x] Teste de visibilidade comprovadamente vermelho contra `cc6002f` e verde depois do 3.2 (evidência no PR 3.3).
- [x] Milestones M3–M15 existem no GitHub; issues do M3 vinculadas a `M3`.
- [x] DOD comum atendido, incluindo rubber-duck.

---

### M4 — Governança do repositório e portão de deploy

**Objetivo:** o repositório passa a se comportar como um projeto profissional — e a `main` só vai ao ar com CI verde.
**Achados:** `R31`, `R32`, `R33`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 4.2 | `chore/m4-labels-como-codigo` | `chore(github): labels versionadas e sincronizadas por Action` | ✅ #18 |
| 4.1 | `chore/m4-templates-de-issue` | `chore(github): formulários de issue e template de PR` | ✅ #20 |
| 4.3 | `ci/m4-titulo-do-pr` | `ci: valida o título do PR em Conventional Commits` | ✅ #22 |
| 4.4 | `chore/m4-dependabot` | `chore(deps): atualização semanal do Dependabot para npm e Actions` | ✅ #24 |
| 4.5 | `docs/m4-contribuicao-e-seguranca` | `docs: guia de contribuição, política de segurança e CODEOWNERS` | ✅ #26 |
| 4.2b | `chore/m4-labels-sem-from-name` | `chore(github): remove from_name após a migração das labels` | ✅ #29 |
| 4.6 | `ci/m4-deploy-pelo-ci` | `ci(pages): publica pelo GitHub Actions somente com CI verde` | ✅ #31 |

> Ordem real de merge: 4.2 antes do 4.1 (os formulários referenciam labels que só existem depois da
> sincronização). O 4.2b nasceu do rubber-duck (seção 11).

**Tarefas**
1. (4.1) `.github/ISSUE_TEMPLATE/` em formulários YAML: `bug.yml`, `melhoria.yml`, `conteudo.yml`
   (pede fonte da afirmação — reforça a matriz de fatos) e `config.yml` (`blank_issues_enabled: false`).
2. (4.2) `.github/labels.yml` (tipo: `bug`, `feat`, `docs`, `a11y`, `perf`, `seo`, `test`, `ci`, `conteúdo`;
   área; prioridade) + workflow que sincroniza em push na `main` (ação com versão fixada). Os
   milestones do GitHub já existem desde o 3.1 (bootstrap); aqui só passam a ter descrição e data.
3. (4.3) Workflow `pr-title` com ação de validação semântica (tipos permitidos = Conventional Commits).
4. (4.4) `.github/dependabot.yml`: `npm` e `github-actions`, semanal, **agrupado** (um PR por ecossistema), prefixo `chore(deps)`.
5. (4.5) `CONTRIBUTING.md` (fluxo da seção 7, padrões da seção 8), `SECURITY.md` (como reportar),
   `.github/CODEOWNERS` (`* @Blima-P`).
6. (4.6) Job `deploy` **no mesmo workflow** `quality.yml`, com `needs: quality` — ou seja, só publica
   depois de verify **+ lychee + Lighthouse** — e `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`.
   O próprio job `quality` monta o artefato (`actions/upload-pages-artifact`, **sem** `node_modules`,
   `tests`, `docs`, `scripts`) a partir do SHA testado; `deploy` só roda `actions/deploy-pages`.
   `permissions: { pages: write, id-token: write }` só no `deploy`, `environment: github-pages` (com a URL),
   `concurrency: { group: pages, cancel-in-progress: false }`. Trocar Pages para "GitHub Actions"
   (`gh api -X PUT repos/Blima-P/Portfolio/pages -f build_type=workflow`) **no mesmo dia** do merge.
7. **Configurações (sem PR, registrar na seção 11):** proteção da `main` (seção 7.4) exigindo PR,
   `quality` e `pr-title`, com **0 aprovações** (projeto solo) e **valendo também para administradores**;
   `delete_branch_on_merge=true`; só *squash* habilitado; *auto-merge* habilitado; **Discussions** habilitado (seção 10.2).

**DOD**
- [x] "New issue" mostra só os formulários; labels idênticas ao `labels.yml`.
- [x] PR com título fora do padrão é bloqueado (testar com um título errado e corrigir).
- [x] Primeiro PR do Dependabot aberto e agrupado.
- [x] `gh api repos/Blima-P/Portfolio/pages -q .build_type` = `workflow`; um *push* com CI vermelho **não** publica (simulado em branch de teste ou documentado com o grafo de `needs`).
- [x] `gh api repos/Blima-P/Portfolio/branches/main/protection` lista os checks exigidos e `enforce_admins.enabled = true`; um `git push` direto na `main` é recusado.
- [x] PRs do Dependabot passam no `pr-title` (prefixo `chore(deps)`).
- [x] DOD comum atendido, incluindo rubber-duck.

---

### M5 — Identidade visual "Metrô Noturno"

**Objetivo:** identidade própria, ligada à foto (metrô à noite) e ao posicionamento backend, com contraste AA.
**Achados:** `R04`, `R05` (fontes), `R13`, `R14`, `R21`, `R22`, `R23`, `R24`, `R37`, `R38`, `R42`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 5.1 | `refactor/m5-tokens` | `refactor(css): centraliza cores em tokens semânticos` | ⬜ |
| 5.2 | `feat/m5-paleta` | `feat(theme): aplica a paleta Metrô Noturno nos dois temas` | ⬜ |
| 5.3 | `perf/m5-fontes-locais` | `perf(fonts): hospeda Inter e JetBrains Mono localmente` | ⬜ |
| 5.4 | `fix/m5-header` | `fix(header): agrupa ações, alvos de 44 px e theme-color` | ⬜ |
| 5.5 | `feat/m5-botoes-e-foco` | `feat(ui): botões acessíveis e foco visível` | ⬜ |
| 5.6 | `fix/m5-hero-layout` | `fix(hero): partículas fora do texto e hierarquia de CTAs no mobile` | ⬜ |

**Tarefas**
1. (5.1) Tokens: `--color-accent`, `--color-accent-hover`, `--color-accent-ink`, `--color-accent-rgb`,
   `--color-secondary`, `--color-focus`, `--color-terminal-*`. **Zero cores fixas** fora de `:root`/`[data-theme]`
   (inclusive terminal e gradientes). **Sem mudança visual** (capturas idênticas).
2. (5.2) Paleta (contraste verificado, WCAG 2.2):

   | Token | Escuro | Claro |
   |---|---|---|
   | `--color-bg` / `--color-bg-2` / `--color-bg-card` | `#0B0D12` / `#0F1218` / `#151922` | `#FAFAF7` / `#F2F1EC` / `#FFFFFF` |
   | `--color-border` | `#232936` | `#E4E2DC` |
   | `--color-text` / `--color-text-muted` | `#F4F4F5` / `#A1A1AA` | `#16181D` / `#52525B` |
   | `--color-accent` / `--color-accent-hover` | `#F5A524` / `#FFC24D` | `#B45309` / `#92400E` |
   | `--color-accent-ink` | `#0B0D12` (9,52:1) | `#FFFFFF` (5,02:1) |
   | `--color-secondary` | `#22D3EE` | `#0E7490` |

   Gradiente do nome (escuro): `linear-gradient(90deg, #F4F4F5 0%, #FFC24D 55%, #F5A524 100%)`.
3. (5.3) Inter 400/600/800 + JetBrains Mono 400/600 em `assets/fonts/*.woff2` (subset latin),
   `font-display: swap`, `preload` só das 2 da primeira dobra; remover Google Fonts. Mono em datas,
   tags, logo e terminal.
4. (5.4) Idioma + tema agrupados à direita; alvos ≥ 44 × 44 px; logo legível (ex.: `pedro.braga` em
   mono) em vez de "PBL"; ícone do tema indica a **ação**; `meta theme-color` atualizado por JS;
   `color-scheme` coerente; "Skills" → "Competências" (PT).
5. (5.5) Botões com `--color-accent-ink`; hover com elevação sutil; `:focus-visible` com anel
   `--color-focus` (≥ 3:1) em **todos** os interativos.
6. (5.6) Partículas não passam sob texto/botões (máscara radial no canvas ou fundo sólido nos botões
   *outline*); no mobile, 1 CTA primário + 1 secundário, CV como link; ícones sociais não colidem com a
   seta (R21); *breakpoint* intermediário em 820 px (R24).

**DOD**
- [ ] `grep -nE "#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[0-9]" css/*.css js/*.js` só encontra tokens (exceções justificadas no PR).
- [ ] Contraste ≥ 4,5:1 (texto) e ≥ 3:1 (componentes/foco) nos 2 temas; Lighthouse `color-contrast` aprovado.
- [ ] Nenhuma requisição a `fonts.googleapis.com`/`fonts.gstatic.com`.
- [ ] Capturas antes × depois (390/820/1440 × 2 temas) em cada PR visual.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M6 — Conteúdo orientado a recrutador

**Objetivo:** o site vende o que você **já tem**, com provas verificáveis e posicionamento claro.
**Achados:** `R03`, `R07`, `R08`, `R09`, `R10`, `R11`, `R17`, `R18`, `R19`, `R20`, `R25`, `R40`, `R44`.
**Bloqueio:** respostas da análise §7 (vaga-alvo, CAESB, meses, SocialTech, certificados, CV EN, cidade, foto).
**Regra:** toda afirmação passa antes pela **matriz de fatos** (análise §7) — sem fonte, não entra.

| PR | Branch | Título | Status |
|---|---|---|---|
| 6.1 | `feat/m6-hero` | `feat(hero): cargo, proposta de valor, foto e disponibilidade` | ⬜ |
| 6.2 | `refactor/m6-remove-github-e-contadores` | `refactor: remove seção GitHub e contadores de vaidade` | ⬜ |
| 6.3 | `feat/m6-faixa-de-provas` | `feat(about): faixa de provas e formação com previsão` | ⬜ |
| 6.4 | `feat/m6-experiencia` | `feat(experience): CAESB em destaque com bullets de impacto` | ⬜ |
| 6.5 | `feat/m6-competencias` | `feat(skills): competências agrupadas com evidências` | ⬜ |
| 6.6 | `feat/m6-cursos` | `feat(courses): certificados com link, ano e carga horária` | ⬜ |
| 6.7 | `feat/m6-contato` | `feat(contact): e-mail visível com cópia e CV em PT e EN` | ⬜ |
| 6.8 | `fix/m6-links-canonicos` | `fix: URL canônica do LinkedIn em todos os canais` | ⬜ |
| 6.9 | `refactor/m6-copy` | `refactor(copy): títulos diretos e rodapé "feito à mão"` | ⬜ |

**Tarefas**
1. (6.1) Hero: `h1` nome + cargo **estático** conforme a vaga-alvo (ex.: "Desenvolvedor Backend Java ·
   Estagiário na CAESB"); proposta de valor em 1 frase; CTAs "Ver projetos" (primário) e "Currículo";
   **foto na primeira dobra** (`<picture>` AVIF/WebP/JPG ≤ 80 KB, `width`/`height`, `fetchpriority="high"`,
   em `assets/img/`); **uma prova com link já no hero** (ex.: "SocialTech · 131 PRs em time de 5 → ver
   caso"), para o teste dos 6 segundos não depender da faixa do About; selo "Disponível para
   estágio/júnior · Brasília/remoto" (se aprovado). Typing sai ou vira detalhe decorativo `aria-hidden`
   (R20) — **no mesmo PR**, ajustar o smoke test "animação de digitação" (removê-lo ou trocar a asserção).
2. (6.2) Remover `js/github.js`, HTML/CSS/chaves da seção GitHub e os contadores (R07, R08); atualizar smoke test.
3. (6.3) Faixa de provas com link para a evidência (somente itens aprovados), ex.: "131 PRs no SocialTech
   (time de 5)", "7 ADRs na Carteira API", "testes de concorrência", "CI/CD com Docker". Formação:
   Engenharia de Software — UCB, semestre atual e previsão de conclusão.
4. (6.4) CAESB com 3–4 bullets **ação → como → resultado** (aprovados pelo Pedro); demais experiências
   compactas destacando habilidades transferíveis; datas com mês (`<time datetime>`).
5. (6.5) Grupos Backend · Dados · Front-end · DevOps/Ferramentas, cada item com nível honesto
   ("em produção", "em projeto", "estudando") e link de evidência.
6. (6.6) Cursos com link do certificado, ano e carga; ícones SVG ou nenhum (fim do `｡🇯‌🇸‌`); subtítulo neutro.
7. (6.7) E-mail visível em texto + botão "Copiar" (Clipboard API com *fallback* e anúncio `aria-live`),
   LinkedIn, GitHub, Lattes (secundário), cidade/modelo; CV PT e EN servido conforme o idioma.
8. (6.8) Uma URL de LinkedIn em `index.html`, JSON-LD, README, terminal **e** no perfil do GitHub (configuração).
9. (6.9) Títulos diretos ("Sobre", "Experiência", "Projetos", "Competências", "Cursos", "Contato");
   rodapé `© 2026 Pedro Braga de Lima · feito à mão, sem frameworks · código-fonte · atualizado em <mês/ano>`
   (data carimbada pelo `stamp-assets`, R25) com ícone SVG para o topo.
10. Terminal (`about`, `projects`, `contact`) atualizado no PR que mudar o respectivo conteúdo.

**DOD**
- [ ] Toda afirmação do site está **aprovada** na matriz de fatos, com fonte rastreável.
- [ ] **Teste dos 6 segundos** em 390×844 e 1366×768 (largura × **altura**): sem rolar, a tela mostra nome, cargo, foto, proposta de valor, 1 prova com link e CTA.
- [ ] Nenhuma chamada a `api.github.com`; nenhum contador.
- [ ] E-mail copiável inclusive sem Clipboard API; CV PT/EN conforme o idioma.
- [ ] `check-i18n` verde; textos PT/EN revisados.
- [ ] Nenhum dado confidencial da CAESB (aprovado pelo Pedro no PR).
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M7 — Projetos como estudos de caso

**Objetivo:** cada projeto responde "qual problema, que decisões, que prova" — e o SocialTech, sua maior prova, assume o destaque.
**Achados:** `R02`, `R06`, `R35`, `R36` (parcial).

| PR | Branch | Título | Status |
|---|---|---|---|
| 7.1 | `feat/m7-socialtech-em-destaque` | `feat(projects): grade com destaque e card do SocialTech` | ⬜ |
| 7.2 | `feat/m7-projetos-compactos` | `feat(projects): painel-semanal e InvestStart; remove card do portfólio` | ⬜ |
| 7.3 | `refactor/m7-multipagina` | `refactor: i18n, cache-busting e testes para páginas de estudo de caso` | ⬜ |
| 7.4 | `feat/m7-caso-carteira-api` | `feat(case): estudo de caso da Carteira API` | ⬜ |
| 7.5 | `feat/m7-caso-socialtech` | `feat(case): estudo de caso do SocialTech` | ⬜ |

**Tarefas**
1. (7.1) Grade: 1 card de destaque em largura total (SocialTech ou Carteira API — decidir pela vaga-alvo)
   + grade de 2/3 colunas sem órfãos. SocialTech: site em produção via QR Code, time, seu papel, CI, a11y.
2. (7.2) Cards compactos: painel-semanal (PWA offline, demo), InvestStart, ERP Acadêmico, Campo Minado.
   Remover "Portfólio Pessoal" (o site é a prova). Filtros: remover se < 6 projetos; se mantidos,
   `aria-pressed` e comparação exata de categoria (R35), sem a animação *inline* atribuída no clique
   (classe CSS no lugar). Links "Código"/"Demo" padronizados com ícone + texto.
3. (7.3) Infraestrutura multipágina, **antes** de qualquer página nova:
   - `check-i18n`, `stamp-assets`, lychee e html-validate varrem `index.html`, `projetos/*.html` e
     (a partir do 8.5) `404.html`; o `stamp-assets` resolve `src`/`href` **relativos ao arquivo HTML**
     (ex.: `../css/styles.css`), não só a partir da raiz.
   - `i18n.js` ciente da página: título, descrição, `og:*` e `canonical` vêm de chaves por página
     (`page.<id>.title`…), não mais da home — hoje a troca de idioma sobrescreve o `<title>` de qualquer página.
   - Smoke test parametrizado por página e servido sob o prefixo **`/Portfolio/`** (igual ao Pages),
     para pegar caminhos absolutos que só funcionam em `localhost/`.
4. (7.4) `projetos/carteira-api.html`: contexto → problema → decisões (ACID, idempotência, lock
   pessimista ordenado, paginação por cursor, Spring Modulith) → **diagrama de arquitetura em SVG
   inline acessível** (`<title>`/`<desc>`) → provas (teste de 15 transferências simultâneas,
   `ArquiteturaTest`, JaCoCo, 7 ADRs com link) → stack → o que faria diferente.
5. (7.5) `projetos/socialtech.html`: problema (descarte de orgânicos), solução (QR Code → site mobile-first),
   time e seu papel, processo (131 PRs, CI, revisão), acessibilidade, resultados aprovados na matriz.

**DOD**
- [ ] SocialTech visível na primeira tela de Projetos (390 e 1440 px).
- [ ] Cada estudo de caso: nos 2 idiomas, navegável por teclado, com "voltar" e links de código/demo funcionando.
- [ ] `verify` cobre as páginas novas (provar com um erro proposital de i18n em `projetos/`); trocar o idioma num estudo de caso mantém o título **daquela** página.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M8 — Interações com propósito

**Objetivo:** os detalhes que fazem sorrir quem explora — sem sacrificar acessibilidade ou performance.
**Achados:** `R15` (terminal), `R27` (404), `R30`, `R34`, `R39`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 8.1 | `feat/m8-terminal-acessivel` | `feat(terminal): diálogo acessível com histórico e autocompletar` | ⬜ |
| 8.2 | `feat/m8-terminal-descobrivel` | `feat(terminal): botão visível, atalho compatível com ABNT2 e novos comandos` | ⬜ |
| 8.3 | `feat/m8-transicao-de-tema` | `feat(theme): transição de tema com View Transitions` | ⬜ |
| 8.4 | `feat/m8-impressao` | `feat(print): página impressa vira currículo de 1 a 2 folhas` | ⬜ |
| 8.5 | `feat/m8-pagina-404` | `feat: página 404 no estilo do terminal` | ⬜ |
| 8.6 | `perf/m8-scroll-spy` | `perf(ui): scroll-spy com IntersectionObserver` | ⬜ |

**Tarefas**
1. (8.1) `<dialog>` nativo (`showModal`) com rótulo, foco preso e devolvido ao gatilho; histórico ↑/↓;
   `Tab` autocompleta **só** quando há prefixo com correspondência (senão, Tab/Shift+Tab seguem o foco
   normal do diálogo); saída com `aria-live="polite"`; título traduzível.
2. (8.2) Botão `>_` no header/rodapé (também no mobile) como **acesso principal**; atalhos `Ctrl + \``
   **e** `Ctrl + K` (o \` é tecla morta no ABNT2; o Ctrl+K substitui a busca do navegador, como no GitHub,
   e é ignorado quando o foco está em campo de texto); comandos `cv`, `email` (copia), `theme`, `lang`,
   `open <projeto>`, `whoami`.
3. (8.3) Troca de tema com `document.startViewTransition` (revelação circular a partir do botão);
   *fallback* instantâneo sem suporte e com `prefers-reduced-motion`.
4. (8.4) `@media print`: fundo branco, sem header/partículas/terminal, URLs dos links impressas,
   quebra de página controlada — imprimir/salvar como PDF gera um CV legível.
5. (8.5) `404.html` com o visual do terminal ("comando não encontrado"), links para início e projetos, nos 2 idiomas.
6. (8.6) Scroll-spy por `IntersectionObserver` (sem ler `offsetTop` a cada frame), `aria-current` no link ativo.

**DOD**
- [ ] Terminal operável só por teclado e por leitor de tela; abre no ABNT2 e no celular.
- [ ] Transição de tema sem *flash* e desligada com reduced-motion.
- [ ] Impressão (Chrome, A4) ≤ 2 folhas, legível e sem elementos decorativos.
- [ ] `/Portfolio/qualquer-coisa` mostra a 404 estilizada no site publicado.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M9 — Acessibilidade WCAG 2.2 AA

**Objetivo:** acessibilidade 100 e zero violações automáticas — verificadas no CI.
**Achados:** `R14`, `R15`, `R20`, `R43`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 9.1 | `feat/m9-skip-link-e-landmarks` | `feat(a11y): skip link, landmarks e hierarquia de títulos` | ⬜ |
| 9.2 | `fix/m9-menu-mobile` | `fix(a11y): menu mobile com aria-expanded, Esc e inert` | ⬜ |
| 9.3 | `feat/m9-reduced-motion` | `feat(a11y): respeita prefers-reduced-motion em CSS e JS` | ⬜ |
| 9.4 | `fix/m9-rotulos` | `fix(a11y): rótulos de idioma e tema, rel noopener e alt bilíngue` | ⬜ |
| 9.5 | `test/m9-axe` | `test(a11y): axe-core nos 2 temas e 2 idiomas` | ⬜ |

**Tarefas**
1. (9.1) *Skip link* para `#main`; `main` com `id`; `scroll-margin-top` = altura do header; um `h1`
   por página e títulos sem saltos.
2. (9.2) `aria-expanded`/`aria-controls` no hambúrguer, `inert` no menu fechado, Esc fecha e devolve o foco.
3. (9.3) CSS: `@media (prefers-reduced-motion: reduce)` desliga transições, reveal e rolagem suave.
   JS: `matchMedia` **interrompe o loop das partículas** e os timers do typing (mostra o texto final),
   reagindo à mudança em tempo real.
4. (9.4) `aria-label` do idioma com o destino ("Mudar para inglês"); `rel="noopener noreferrer"` em
   todo `target="_blank"`; `alt` traduzido; `lang="en"` em trechos em inglês na página PT.
5. (9.5) `@axe-core/playwright` (versão fixada) em todas as páginas × 2 temas × 2 idiomas, regras WCAG 2.2 AA,
   falha com qualquer violação — varrendo também os estados **abertos** (menu mobile e terminal), não só o inicial.

**DOD**
- [ ] axe: 0 violações no CI, inclusive com menu e terminal abertos.
- [ ] *Reflow* a 320 px de largura e zoom de 200%/400% sem rolagem horizontal nem conteúdo cortado (WCAG 1.4.10).
- [ ] Navegação completa por teclado com foco sempre visível; menu fechado não recebe foco.
- [ ] NVDA (ou Narrador) lê hero, navegação, botões e terminal com nomes corretos nos 2 idiomas.
- [ ] Com reduced-motion ativo, nada se move e o loop das partículas não roda (painel Performance).
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M10 — Performance (metas rígidas)

**Objetivo:** atingir as metas da seção 1 e **travá-las** no CI.
**Achados:** `R05`, `R29` (LHCI). (`R26` passou para o 11.1 — a imagem ainda é o `og:image`.)

| PR | Branch | Título | Status |
|---|---|---|---|
| 10.1 | `perf/m10-imagens` | `perf(img): imagens responsivas em AVIF/WebP` | ⬜ |
| 10.2 | `perf/m10-css` | `perf(css): une folhas, remove CSS morto e reduz o crítico` | ⬜ |
| 10.3 | `perf/m10-particulas` | `perf(particles): inicia ocioso, respeita DPR e economia de dados` | ⬜ |
| 10.4 | `ci/m10-lighthouse-rigido` | `ci(lighthouse): asserções de desempenho como erro` | ⬜ |

**Tarefas**
1. (10.1) `srcset`/`sizes`; `loading="lazy"` abaixo da dobra; `decoding="async"`. **Não** apagar
   `Profile.jpg.png` aqui: ele ainda é o `og:image`/`twitter:image` — a remoção (R26) acontece no 11.1,
   depois que as metatags apontarem para a imagem nova.
2. (10.2) Unir `animations.css` em `styles.css`; remover seletores mortos (GitHub, contadores, filtros se removidos).
3. (10.3) Partículas agendadas com `requestIdleCallback` **quando existir** (senão `setTimeout`), depois do
   evento `load`; `devicePixelRatio` limitado a 2; desligadas com `navigator.connection?.saveData`
   (API ausente no Firefox/Safari = segue normal). Medir o LCP antes/depois — ocioso não garante "após o LCP".
4. (10.4) `lighthouserc.json` com asserções em **erro**: performance ≥ 0,9 (folga do runner), a11y/BP/SEO = 1,
   LCP ≤ 2.500 ms, CLS ≤ 0,05, `total-byte-weight` ≤ 409.600; versões fixadas.
5. Após o merge: Lighthouse mobile 3× no site publicado; mediana registrada na seção 11.

**DOD**
- [ ] Portão LHCI em erro passando no CI.
- [ ] Medição oficial (mediana de 3, mobile, site publicado): Performance ≥ 95, A11y/BP/SEO = 100, LCP < 2 s, peso < 400 KB.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M11 — SEO, compartilhamento e segurança

**Objetivo:** o link colado no LinkedIn/WhatsApp impressiona antes do clique; o site resiste a uma olhada no DevTools > Security.
**Achados:** `R11`, `R12`, `R26`, `R27`, `R28`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 11.1 | `feat/m11-og-image` | `feat(seo): imagem de compartilhamento 1200×630` | ⬜ |
| 11.2 | `fix/m11-json-ld` | `fix(seo): JSON-LD Person com affiliation e sameAs coerentes` | ⬜ |
| 11.3 | `feat/m11-sitemap` | `feat(seo): sitemap.xml e verificação no Search Console` | ⬜ |
| 11.4 | `feat/m11-csp` | `feat(security): Content-Security-Policy e Referrer-Policy via meta` | ⬜ |

**Tarefas**
1. (11.1) `assets/img/og-image.png` (< 150 KB) com nome, cargo e paleta; `og:image:width/height/alt`;
   `twitter:card=summary_large_image`; uma por estudo de caso (opcional). Validar no LinkedIn Post Inspector.
   Só então **remover `Profile.jpg.png`** (R26) e conferir com lychee que nada mais o referencia.
2. (11.2) `Person` com `affiliation` (UCB, enquanto estudante), `worksFor` (se aprovado), `knowsAbout`,
   `sameAs` com as URLs canônicas; `CreativeWork` nos estudos de caso.
3. (11.3) `sitemap.xml` (index + estudos de caso) e verificação de propriedade no Google Search Console
   (meta tag), com o sitemap enviado por lá. **`robots.txt` não entra:** num site de projeto
   (`/Portfolio/`) os buscadores só leem `https://blima-p.github.io/robots.txt`, que pertence ao
   repositório `Blima-P/blima-p.github.io` — limitação registrada na seção 11.
4. (11.4) `<meta http-equiv="Content-Security-Policy">` com `default-src 'self'`, `script-src 'self' 'sha256-…'`
   (hash do script inline de tema, calculado pelo `stamp-assets` e verificado no CI), `object-src 'none'`,
   `base-uri 'self'`; `<meta name="referrer" content="strict-origin-when-cross-origin">`.

**DOD**
- [ ] Prévia correta no LinkedIn Post Inspector e no WhatsApp (captura no PR).
- [ ] JSON-LD sem erros no **Schema Markup Validator** (validator.schema.org); "nenhum resultado aprimorado" no Rich Results Test não é erro.
- [ ] Nenhuma referência a `Profile.jpg.png` no repositório.
- [ ] Zero violações de CSP no console em todas as páginas; CI falha se o hash do script inline divergir.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M12 — Testes e CI avançados

**Objetivo:** a pirâmide de testes que um avaliador técnico procura — e que teria pegado o R01.
**Achados:** `R29`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 12.1 | `test/m12-unitarios` | `test(unit): node:test para as funções puras` | ⬜ |
| 12.2 | `test/m12-regressao-visual` | `test(visual): regressão visual em 3 larguras e 2 temas` | ⬜ |
| 12.3 | `test/m12-fluxo-recrutador` | `test(e2e): fluxo do recrutador de ponta a ponta` | ⬜ |
| 12.4 | `ci/m12-resumo-do-job` | `ci: resumo do job com métricas e badges no README` | ⬜ |

**Tarefas**
1. (12.1) `node --test`: detecção de idioma, *lookup* do i18n, parser/autocompletar do terminal,
   funções de `check-i18n` e `stamp-assets` (extrair funções puras se necessário). Script `test:unit` no `verify`.
2. (12.2) `toHaveScreenshot` **só no CI**, num ambiente Linux fixado (imagem `mcr.microsoft.com/playwright`
   na mesma versão do `@playwright/test`), projeto `visual` separado e fora do `verify` local (Windows
   gera pixels diferentes). Baselines: job `workflow_dispatch` com `--update-snapshots` publica um
   artefato → baixar, **revisar** e commitar; nunca regenerar automaticamente numa checagem comum.
   390/820/1440 × 2 temas; animações e partículas desligadas no teste.
3. (12.3) Hero → projeto em destaque → estudo de caso → voltar → CV abre (200) → copiar e-mail → troca de
   idioma persiste. Smoke + e2e rodam no CI em **Chromium, Firefox e WebKit** (Safari).
4. (12.4) `GITHUB_STEP_SUMMARY` com resultados (testes, Lighthouse, axe); badges de CI e licença no README.

**DOD**
- [ ] `npm run verify` inclui unit + smoke + a11y + e2e e passa local e no CI; `test:visual` passa no CI (Linux fixado).
- [ ] Smoke + e2e verdes em Chromium, Firefox e WebKit.
- [ ] Provar que a regressão visual reprova uma mudança de cor proposital.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M13 — Documentação, ADRs e história do projeto

**Objetivo:** o repositório conta *por que* cada decisão foi tomada — sinal de maturidade que recrutador técnico valoriza.
**Achados:** `R16`, `R31`, `R41`.

| PR | Branch | Título | Status |
|---|---|---|---|
| 13.1 | `docs/m13-readme` | `docs(readme): reescreve com captura, métricas e arquitetura` | ⬜ |
| 13.2 | `docs/m13-adr-sem-framework` | `docs(adr): 0001 — HTML, CSS e JS puro, sem build` | ⬜ |
| 13.3 | `docs/m13-adr-modulos-e-cache` | `docs(adr): 0002 — ES Modules e cache-busting por hash` | ⬜ |
| 13.4 | `docs/m13-adr-i18n` | `docs(adr): 0003 — i18n com HTML estático e verificador de paridade` | ⬜ |
| 13.5 | `docs/m13-adr-movimento` | `docs(adr): 0004 — animações com propósito e reduced-motion` | ⬜ |
| 13.6 | `docs/m13-changelog` | `docs: CHANGELOG retroativo (v1 → v3)` | ⬜ |

**Tarefas**
1. (13.1) README: captura/GIF atual (claro e escuro), métricas reais (Lighthouse, axe, testes),
   diagrama dos módulos, decisões (link para ADRs), como rodar/testar, fluxo de contribuição. **Remover**
   "Ideias para a Seção Sobre" (R16) e features que não existem mais. Atualizar descrição/topics do repositório (R41).
2. (13.2–13.5) `docs/adr/NNNN-*.md` no formato contexto → decisão → consequências → alternativas, com links para os PRs.
3. (13.6) `CHANGELOG.md` (Keep a Changelog): v1.0.0 (site original), v2.0.0 (M0–M2), v3.0.0 (em aberto);
   `package.json` com a versão correspondente (R31).

**DOD**
- [ ] README sem nenhuma feature inexistente; captura atual; links verificados pelo lychee.
- [ ] 4 ADRs com links para os PRs que os implementaram.
- [ ] DOD comum atendido, incluindo rubber-duck.

---

### M14 — Vitrine no GitHub (perfil e outros repositórios)

**Objetivo:** o recrutador que sai do portfólio para o GitHub encontra o mesmo padrão em todo lugar.
**Achados:** `R11`, `R36`. **Pode rodar em paralelo** a M7–M13 depois do M6 (conteúdo aprovado),
**exceto** 14.2 (depende do 7.4) e 14.3 (depende do 7.5): eles linkam estudos de caso que precisam existir.

| PR | Repositório | Título | Status |
|---|---|---|---|
| 14.1 | `Blima-P/Blima-P` | `docs: perfil com projetos, provas e links canônicos` | ⬜ |
| 14.2 | `Blima-P/carteira-api` | `docs(readme): diagrama, como rodar e link para o estudo de caso` | ⬜ |
| 14.3 | `Blima-P/SocialTech` | `docs(readme): créditos do time, métricas e link para o estudo de caso` | ⬜ |
| 14.4 | `Blima-P/painel-semanal` | `docs(readme): captura, recursos offline e link da demo` | ⬜ |
| 14.5 | `Blima-P/InvestStart` | `docs(readme): status, arquitetura e como rodar` | ⬜ |
| 14.6 | `Blima-P/credit-default-prediction` | `docs(readme): status honesto, dados e próximos passos` | ⬜ |

**Tarefas**
1. Cada PR segue o fluxo da seção 7 **no respectivo repositório** (issue, branch, coautoria, squash).
2. **Configurações (sem PR):** descrição e *topics* profissionais em todos os públicos (ex.: ERP sem
   "Terça-feira - Noturno"); `homepage` onde houver demo; **fixar 6 repositórios** (SocialTech,
   carteira-api, Portfolio, painel-semanal, InvestStart, Campo-minado); arquivar o que não representa
   mais seu nível; URL do LinkedIn do perfil = canônica (R11).
3. Checklist do LinkedIn (manual, registrar na seção 11): título igual ao hero, link do portfólio
   na seção "Destaques", CV atualizado, projetos SocialTech e Carteira API com link.

**DOD**
- [ ] Os 6 repositórios fixados têm README com captura ou diagrama, como rodar e link de volta ao portfólio.
- [ ] Nenhuma descrição informal ou desatualizada nos repositórios públicos.
- [ ] Mesma URL de LinkedIn em site, CV, GitHub e README.
- [ ] DOD comum atendido (adaptado a cada repositório), incluindo rubber-duck.

---

### M15 — QA final, release `v3.0.0` e divulgação

**Objetivo:** fechar o ciclo com evidência — e colocar o resultado na frente de pessoas.

| PR | Branch | Título | Status |
|---|---|---|---|
| 15.1 | `chore/m15-release-v3` | `chore(release): v3.0.0` | ⬜ |
| 15.2 | `docs/m15-resultados` | `docs: resultados finais e fechamento dos achados` | ⬜ |

**Tarefas**
1. Roteiro completo da seção 5; Lighthouse final (mobile e desktop, mediana de 3, site publicado).
2. Atualizar a tabela de metas (seção 1) com os valores finais; marcar cada `Rxx` como resolvido (PR) ou aceito (justificativa).
3. `CHANGELOG` v3.0.0, `package.json` 3.0.0, tag anotada e GitHub Release com capturas (seção 7.3).
4. Divulgação: post no LinkedIn (antes × depois, o que aprendeu, link do repositório); anúncio em
   Discussions do repositório; pedir feedback a 2–3 devs — **estrelas vêm daqui, não de troca** (seção 10.2).

**DOD**
- [ ] Todas as metas da seção 1 atingidas ou com desvio justificado.
- [ ] Release `v3.0.0` publicada com notas e capturas.
- [ ] Placar de conquistas (seção 10.4) atualizado com os números finais.
- [ ] Revisão rubber-duck com outra IA sobre **o conjunto da entrega**; registrada na seção 11.

---

## 5. Roteiro de testes manuais

Executar via `npm run serve` (e no site publicado após o merge). Larguras: 390, 820, 1440 px.

| ID | Teste | Esperado | Milestones |
|---|---|---|---|
| T01 | **6 segundos** em 390×844 e 1366×768: abrir e contar até 6 | Nome, cargo, foto, proposta de valor, 1 prova com link e CTA visíveis sem rolar | M5, M6 |
| T02 | Rolar a página inteira devagar e depressa | Todo título/subtítulo aparece; nada fica invisível | M3 |
| T03 | Clicar em cada item do menu (desktop e mobile) | Rola até a seção, título não fica sob o header, link ativo correto | M3, M8, M9 |
| T04 | Trocar tema e recarregar | Persiste; sem *flash*; contraste ok; `theme-color` acompanha | M5, M8 |
| T05 | Trocar idioma e recarregar; navegador em EN na 1ª visita | Persiste; tudo traduzido, inclusive `aria-label`, `alt`, título da aba e terminal | M6–M9 |
| T06 | JavaScript desabilitado | Página inteira em PT, legível, títulos visíveis | M3, M6 |
| T07 | Só teclado (Tab, Shift+Tab, Enter, Esc) | Skip link, foco sempre visível, menu e terminal operáveis | M8, M9 |
| T08 | NVDA/Narrador | Nomes corretos em hero, menu, botões, terminal; sem leitura do typing parcial | M9 |
| T09 | `prefers-reduced-motion: reduce` (DevTools > Rendering) | Nada se move; loop das partículas parado | M9 |
| T10 | Terminal: `Ctrl+K` no teclado ABNT2, botão `>_` no celular, `help`, `cv`, `email`, ↑/↓, Tab | Funciona; foco volta ao gatilho ao fechar | M8 |
| T11 | Copiar e-mail (com e sem Clipboard API) | Copia e anuncia "copiado" | M6 |
| T12 | Abrir CV PT e EN; links LinkedIn e Lattes no navegador | 200; abre em nova aba; lychee não cobre esses dois | M6 |
| T13 | Estudos de caso: abrir, trocar idioma, voltar | Conteúdo nos 2 idiomas; "voltar" leva à seção Projetos | M7 |
| T14 | Imprimir (Ctrl+P, A4) | ≤ 2 folhas, fundo branco, URLs visíveis | M8 |
| T15 | URL inexistente no site publicado | 404 estilizada com links úteis | M8 |
| T16 | Colar o link no LinkedIn Post Inspector e no WhatsApp | Card grande com nome, cargo e paleta | M11 |
| T17 | DevTools > Console/Network em todas as páginas | 0 erros, 0 404, 0 violações de CSP, nenhuma chamada a terceiros | M5, M6, M11 |
| T18 | Lighthouse mobile 3× no site publicado | Metas da seção 1 | M10, M15 |
| T19 | Firefox, Safari (macOS/iOS, se disponível) e um Android real | Mesmo layout, tema, idioma, terminal e menu funcionando | M5, M8, M15 |
| T20 | Largura 320 px e zoom 200%/400% no desktop | Sem rolagem horizontal; nada cortado ou sobreposto | M5, M9 |

---

## 6. Padrões e cuidados do projeto (lembrar em cada sessão)

- **Idioma:** UI e commits em **PT-BR com acentuação**; identificadores em ASCII; EN com paridade (`check-i18n`).
- **Encoding:** UTF-8, **LF**, 2 espaços (`.editorconfig`, `.gitattributes`).
- **Sem build:** o que está no repositório é o que vai ao ar. Ao mudar CSS/JS: `npm run stamp`.
- **ES Modules:** testar sempre com `npm run serve` (nunca `file://`). Nenhuma variável global.
- **Conteúdo:** toda afirmação com fonte (matriz de fatos). Nada confidencial da CAESB.
- **Acessibilidade e movimento:** nada essencial depende de animação; tudo respeita reduced-motion.
- **Segurança:** dados externos via `textContent`/DOM, nunca interpolados em HTML; `innerHTML` só nas `HTML_KEYS`.
- **Diagnosticar antes de alterar**; não corrigir itens fora do escopo do PR sem registrar na seção 11.

---

## 7. Fluxo Git e PR (vale para todos os PRs)

### 7.1 Uma vez por máquina/repositório

```powershell
git config user.name "Pedro Braga de Lima"     # só neste repositório (sem --global)
git config user.email "pbl0812@gmail.com"      # e-mail vinculado à conta Blima-P
gh auth status                                 # deve mostrar: Logged in to github.com account Blima-P
```

### 7.2 Fluxo por PR (fatia)

```powershell
# 1. Issue da fatia (formulários e labels próprias a partir do M4; antes, labels padrão)
#    (labels em .github/labels.yml; o título do PR também passa no check pr-title: assunto em minúscula)
gh issue create --title "<título da fatia>" --label "<bug|feat|docs|ci|…>" --milestone "M<N>" --body "<contexto e critério de aceite>"

# 2. Branch a partir de main atualizada
git switch main; git pull --ff-only
git switch -c <branch>

# 3. Commits pequenos, TODOS com o trailer de coautoria. Todos os trailers ficam JUNTOS no ÚLTIMO
#    parágrafo (um único -m); um segundo -m criaria outro parágrafo e o Git só leria o último.
git add -A; git status
git commit -m "<tipo>(escopo): descrição no imperativo" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
#    Pareou com um colega? Mesmo -m, trailers em linhas seguidas:
#    -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`nCo-authored-by: Nome <id+login@users.noreply.github.com>"

# 4. Validar localmente
npm run verify

# 5. Publicar e abrir o PR vinculado à issue
git push -u origin <branch>
gh pr create --base main --title "<título do PR>" --body "Closes #<issue>`n`n<descrição no formato do template>"

# 6. CI verde → merge squash (a mensagem padrão do repositório inclui os commits e seus trailers)
gh pr checks --watch
gh pr merge --squash --delete-branch

# 7. Conferir coautoria no commit final (trailers PARSEADOS pelo Git, não só o texto) e o deploy
git switch main; git pull --ff-only
git log -1 --format="%(trailers:key=Co-authored-by)"   # deve listar cada coautor
gh run list --limit 3
```

### 7.3 Release (M15)

```powershell
git switch main; git pull --ff-only
git tag -a v3.0.0 -m "Portfólio v3.0.0"
git push origin v3.0.0
gh release create v3.0.0 --title "Portfólio v3.0.0" --notes-file CHANGELOG.md
```

### 7.4 Proteção da `main` (M4)

```powershell
@'
{
  "required_status_checks": { "strict": true, "contexts": ["quality", "pr-title"] },
  "enforce_admins": true,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null
}
'@ | gh api -X PUT repos/Blima-P/Portfolio/branches/main/protection -H "Accept: application/vnd.github+json" --input -
gh repo edit Blima-P/Portfolio --delete-branch-on-merge --enable-merge-commit=false --enable-rebase-merge=false --enable-auto-merge --enable-discussions
```

> Os nomes dos contextos devem ser iguais aos nomes dos jobs exibidos em `gh pr checks`.
> `enforce_admins: true` vale para você também: nada entra na `main` sem PR e CI verde (0 aprovações
> mantém o fluxo solo viável). Nos outros repositórios (M14), conferir `squash_merge_commit_message`
> = `COMMIT_MESSAGES` antes do primeiro merge, senão os trailers podem sumir no squash.

---

## 8. Como cada sessão trabalha

1. Ler este plano, a análise local (`docs/analise-critica.md`) e o registro da seção 11.
2. Marcar o milestone como 🟨 na seção 3.
3. Para **cada PR** da tabela do milestone, em ordem: issue → branch → implementação → testes →
   rubber-duck → PR → CI verde → merge → conferência do trailer e do deploy → marcar ✅ na tabela.
4. Ao final: DOD do milestone, tabela da seção 3, placar da seção 10.4 e seção 11 atualizados (no último PR do milestone).

---

## 9. Prompts por milestone

> Abra uma **nova sessão** em `C:\Users\Braga\Desktop\Portfolio\Portfolio` e cole o prompt.
> **Revisão obrigatória (DOD):** cada PR passa por revisão **rubber-duck com OUTRA IA** antes do merge;
> apontamentos tratados e registrados na seção 11.

### Prompt — M3 (restante: PRs 3.2 e 3.3)
```
Leia docs/plano-implementacao.md (seções 4-M3, 6, 7 e 8) e docs/analise-critica.md (R01). Execute os
PRs 3.2 e 3.3 do M3: escreva primeiro o teste de visibilidade e registre a evidência de que ele FALHA
contra cc6002f; mergeie a correção do reveal (3.2; causa: clip-path inset(0 100% 0 0) zera a área e o
IntersectionObserver nunca dispara) e só então rebaseie e mergeie o teste (3.3) já verde. Um PR por fatia, cada um com issue, commits com trailer
Co-authored-by, npm run verify verde, revisão rubber-duck com OUTRA IA, merge squash e conferência do
trailer e do site publicado. Atualize DOD, tabelas e seção 11 no último PR.
```

### Prompt — M4
```
Leia docs/plano-implementacao.md (M4, seções 6, 7 e 8). Execute os 6 PRs do M4 (templates de issue,
labels como código + milestones do GitHub, validação do título do PR, Dependabot, CONTRIBUTING/SECURITY/
CODEOWNERS e job de deploy do Pages no quality.yml com needs: quality — verify + lychee + Lighthouse). Depois aplique as
configurações da seção 7.4 e registre-as na seção 11. Fluxo da seção 7.2 para cada PR, rubber-duck com
OUTRA IA antes de cada merge. Atualize DOD, tabelas e placar de conquistas.
```

### Prompt — M5
```
Leia docs/plano-implementacao.md (M5) e docs/analise-critica.md (R04, R05, R13, R14, R21-R24, R37,
R38, R42). Execute os 6 PRs do M5: tokens sem mudança visual (prove com capturas idênticas), paleta
Metrô Noturno nos 2 temas com contraste verificado, fontes self-hosted, header, botões/foco e layout do
hero. Capturas antes x depois em 390/820/1440 x 2 temas em cada PR visual. Fluxo da seção 7.2 e
rubber-duck com OUTRA IA em cada PR. Atualize DOD, tabelas e placar.
```

### Prompt — M6
```
Leia docs/plano-implementacao.md (M6) e docs/analise-critica.md (seções 4 e 7). ANTES de escrever
qualquer texto, preencha comigo a matriz de fatos (análise §7) com as respostas que eu der nesta
sessão — pergunte o que faltar, nunca invente, nada confidencial da CAESB. Depois execute os 9 PRs do
M6 usando apenas afirmações aprovadas, textos PT e EN com paridade, foto otimizada (AVIF/WebP <= 80 KB).
Faça o teste dos 6 segundos em 390 e 1440 px. Fluxo da seção 7.2 e rubber-duck com OUTRA IA em cada PR.
```

### Prompt — M7
```
Leia docs/plano-implementacao.md (M7), os READMEs de Blima-P/carteira-api e Blima-P/SocialTech e a
matriz de fatos local. Execute os 5 PRs do M7: SocialTech em destaque, cards compactos, infraestrutura
multipágina (i18n, stamp, lychee, html-validate e testes cobrindo projetos/*.html) ANTES das páginas, e
os estudos de caso da Carteira API (com diagrama SVG acessível) e do SocialTech. Fluxo da seção 7.2 e
rubber-duck com OUTRA IA em cada PR.
```

### Prompt — M8
```
Leia docs/plano-implementacao.md (M8). Execute os 6 PRs: terminal em <dialog> acessível com histórico e
Tab; botão visível, Ctrl+K (ABNT2) e novos comandos; transição de tema com View Transitions (com
fallback e reduced-motion); folha de impressão que vira CV; 404 estilizada; scroll-spy com
IntersectionObserver. Testes automatizados para cada interação nova. Fluxo da seção 7.2 e rubber-duck
com OUTRA IA em cada PR.
```

### Prompt — M9
```
Leia docs/plano-implementacao.md (M9). Execute os 5 PRs de acessibilidade (skip link/landmarks, menu
mobile com aria-expanded/inert/Esc, reduced-motion em CSS e JS parando o loop das partículas, rótulos e
rel noopener, axe-core no Playwright em 2 temas x 2 idiomas com zero violações). Rode T07-T09 da seção 5.
Fluxo da seção 7.2 e rubber-duck com OUTRA IA em cada PR.
```

### Prompt — M10
```
Leia docs/plano-implementacao.md (M10). Execute os 4 PRs de performance e torne o LHCI rígido. Após o
merge, meça o site publicado (Lighthouse mobile, mediana de 3) e registre na seção 11. Metas:
Performance >= 95, A11y/BP/SEO = 100, LCP < 2 s, peso < 400 KB. Fluxo da seção 7.2 e rubber-duck com
OUTRA IA em cada PR.
```

### Prompt — M11
```
Leia docs/plano-implementacao.md (M11). Execute os 4 PRs: og-image 1200x630 (e só depois remova
Profile.jpg.png), JSON-LD com affiliation e sameAs canônicos, sitemap + Search Console (sem robots.txt
— ver 11.3) e CSP via meta com hash do script inline verificado no CI. Valide no LinkedIn Post
Inspector e no Schema Markup Validator (capturas no PR). Fluxo da seção 7.2 e rubber-duck com
OUTRA IA em cada PR.
```

### Prompt — M12
```
Leia docs/plano-implementacao.md (M12). Execute os 4 PRs: testes unitários com node:test, regressão
visual só no CI em Linux fixado (baselines revisados e commitados), fluxo do recrutador em Chromium,
Firefox e WebKit e resumo do job com badges. Prove que a
regressão visual reprova uma mudança de cor proposital. Fluxo da seção 7.2 e rubber-duck com OUTRA IA
em cada PR.
```

### Prompt — M13
```
Leia docs/plano-implementacao.md (M13) e docs/historico/plano-v2.md (seção 9, decisões). Execute os 6
PRs: README reescrito (sem a lista de ideias, com captura e métricas reais), ADRs 0001-0004 com links
para os PRs, CHANGELOG retroativo e versão no package.json. Fluxo da seção 7.2 e rubber-duck com OUTRA
IA em cada PR.
```

### Prompt — M14
```
Leia docs/plano-implementacao.md (M14) e a matriz de fatos local. Execute os 6 PRs nos outros
repositórios (perfil Blima-P/Blima-P, carteira-api, SocialTech, painel-semanal, InvestStart,
credit-default-prediction), cada um com issue, coautoria e rubber-duck. Depois aplique as configurações
(descrições, topics, homepage, 6 repositórios fixados, URL canônica do LinkedIn) e gere o checklist do
LinkedIn. Registre tudo na seção 11 do plano do Portfolio.
```

### Prompt — M15
```
Leia docs/plano-implementacao.md (M15). Rode o roteiro completo da seção 5 e o Lighthouse final no
site publicado, atualize as metas da seção 1, feche cada achado Rxx (resolvido com PR ou aceito com
justificativa), publique a release v3.0.0 (seção 7.3) e redija o post do LinkedIn. Faça a revisão
rubber-duck com OUTRA IA sobre o conjunto da entrega e registre na seção 11.
```

---

## 10. Trilha de conquistas do GitHub

### 10.1 Situação em 17/11/2026 e alvo

| Conquista | Critério (níveis) | Hoje | Alvo neste plano |
|---|---|---|---|
| **Pair Extraordinaire** | PRs mergeados com commit em coautoria: 1 · 10 · 24 · **48** | Base exibido; **32 candidatos** medidos (não confirmados pelo GitHub — o selo pode estar atrasado ou ter regras que não conhecemos) | **Ouro (48)** — se os 32 contarem, faltam ~16 PRs (≈ **M6**); senão, a conta segue pelo placar real (10.4) |
| **Pull Shark** | PRs mergeados: 2 · 16 · 128 · **1.024** | Prata (171) | +66 neste plano (≈ 237). Ouro é meta de **longo prazo** (ver abaixo) |
| Starstruck | Estrelas em um repositório: 16 · 128 · 512 · 4.096 | Base (SocialTech, 21 ⭐) | Orgânico, via M13–M15 |
| Galaxy Brain | Respostas aceitas em Discussions: 2 · 8 · 16 · 32 | — | **Base (2)** |
| Public Sponsor | Patrocinar alguém pelo GitHub Sponsors | — | Opcional (decisão do Pedro, custo ≥ US$ 1) |
| Quickdraw · YOLO | Nível único | ✅ | — |

> Selos que não podem mais ser obtidos (Arctic Code Vault, Mars 2020) e selos não lançados
> oficialmente não entram no plano.

### 10.2 Como cada conquista é alimentada — sem atalhos artificiais

- **Pair Extraordinaire:** todo PR deste plano tem commits com `Co-authored-by` (seção 7.2). Só conta
  coautor **diferente de você** (7 PRs antigos do SocialTech tinham você como coautor de si mesmo e não
  contam). Recomendado: parear de verdade com colegas do SocialTech em pelo menos alguns PRs (coautor humano).
- **Pull Shark:** 66 PRs neste plano (60 no Portfolio + 6 em outros repositórios). PRs abertos pelo
  **Dependabot** não contam (o autor é o bot). O ouro (1.024) exige ~850 PRs a mais — **não é atingível de forma
  honesta só com o portfólio**. Caminho sustentável: manter a granularidade "1 fatia = 1 PR" em
  **todos** os seus projetos (SocialTech, carteira-api, InvestStart), e contribuir para projetos open
  source que você usa (documentação, testes, *good first issues* de Astro, Spring, Playwright,
  html-validate…). Contribuição externa vale mais para o recrutador do que qualquer selo.
- **Galaxy Brain:** responder dúvidas reais em Discussions de projetos que você domina (ex.: Spring Boot,
  Astro, GitHub Community) até ter 2 respostas **aceitas por quem perguntou**. Discussions habilitado
  no Portfolio (M4) para receber feedback — respostas aceitas pelo próprio autor da pergunta não
  devem ser forjadas.
- **Starstruck:** README de referência (M13), estudos de caso (M7), post de lançamento (M15). **Nunca**
  trocar estrelas.
- **Public Sponsor:** se decidir, patrocinar o mantenedor de uma ferramenta usada no projeto.

### 10.3 Regras anti-"farm" (o recrutador abre a lista de PRs)

1. Cada PR resolve **uma** fatia da tabela do milestone — nada de PR vazio, de *typo* isolado criado
   de propósito, ou de reverter e refazer.
2. Cada PR tem issue, descrição, teste/evidência e CI verde.
3. Coautoria só de quem realmente participou (Copilot nesta sessão de IA; colega quando parear).
4. Não abrir e fechar PRs/issues só para obter Quickdraw/YOLO (já obtidos).

### 10.4 Placar (atualizar a cada milestone)

| Data | Marco | PRs mergeados (total) | PRs com coautoria elegível | Pair Extraordinaire | Pull Shark |
|---|---|:---:|:---:|---|---|
| 17/11/2026 | Baseline | 171 | 32 candidatos | Base exibido | Prata |
| | Após M3 (18/11/2026) | 174 | 35 candidatos | Base exibido | Prata |
| | Após M4 (18/11/2026) | 181 | 42 candidatos | Base exibido | Prata |
| | Após M5 | | | | |
| | Após M6 | | | Ouro possível (se os candidatos contarem) | |

Consulta para atualizar (PowerShell):

```powershell
gh api "search/issues?q=author:Blima-P+type:pr+is:merged&per_page=1" -q .total_count
```

---

## 11. Observações / registro de decisões (atualizar durante a execução)

| Data | Milestone | Registro |
|---|---|---|
| 17/11/2026 | M3 | Análise crítica v3 sobre `cc6002f` (local). Baseline do site publicado: Lighthouse mobile 74/95/100/100, LCP 8,1 s, 1.254 KiB, `color-contrast` reprovado. |
| 17/11/2026 | M3 | **R01 confirmado em produção:** com o título de "Projetos" no centro da tela, `IntersectionObserver.intersectionRatio = 0` (1440 e 390 px) — o `clip-path: inset(0 100% 0 0)` inicial zera a área observada; títulos e subtítulos ficam com `opacity: 0`. O smoke test não cobre visibilidade. |
| 17/11/2026 | M3 | Conquistas medidas via API: 171 PRs mergeados; 39 com mais de um autor no commit final, dos quais **32 com coautor diferente** (Copilot e colegas) — **candidatos** ao Pair Extraordinaire (o GitHub não expõe a contagem oficial). |
| 17/11/2026 | M3 | Plano v2 arquivado em `docs/historico/plano-v2.md`; M3–M7 do v2 absorvidos por M5, M6, M9–M11, M13 e M15 deste plano. Identidade git do repositório fixada em Blima-P (`pbl0812@gmail.com`). |
| 17/11/2026 | M3 | **Rubber-duck do plano (outra IA)** — 3 bloqueantes e 9 ajustes, todos incorporados: (1) teste do R01 não pode ser mergeado vermelho → evidência contra `cc6002f`, merge do 3.2 antes do 3.3; (2) deploy só depois do `quality` completo (lychee + LHCI), no mesmo workflow; (3) `Profile.jpg.png` só sai no 11.1, depois do novo `og:image`; (4) milestones criados no bootstrap do 3.1 e proteção com `enforce_admins`; (5) multipágina com metadados por página, caminhos relativos e teste sob `/Portfolio/`; (6) 14.2/14.3 dependem de 7.4/7.5; (7) regressão visual só em Linux fixado no CI; (8) trailers no mesmo parágrafo e conferência com `%(trailers)`; (9) 32 PRs são **candidatos**, não progresso confirmado; Dependabot não conta; (10) prova com link já no hero e teste dos 6 s com altura; (11) Firefox/WebKit, *feature detection*, axe com menu/terminal abertos e *reflow* 320 px; (12) `robots.txt` de site de projeto é ignorado → só sitemap + Search Console. Também: Ctrl+K secundário ao botão, Tab só autocompleta com prefixo, Schema Markup Validator no lugar do Rich Results, "atualizado em" no rodapé (R25) e fim da animação *inline* dos filtros (R35). Mapa R01–R44 → milestones conferido: nenhum achado descoberto; contagem de 66 PRs confirmada. |
| 18/11/2026 | M3 | **3.2 (#15):** a seção passa a ser observada (`threshold: 0`) e recebe `.section--revealed`; o CSS declara o estado final (`opacity: 1`, `clip-path: inset(0)`) e a animação vira só enfeite (`fill-mode: both`). Rubber-duck: nenhum bloqueante. |
| 18/11/2026 | M3 | **3.3 (#16):** teste vermelho **4/4** (desktop e mobile) sem a correção e suíte verde (25) com ela. Rubber-duck sugeriu alinhar a seção ao topo + `toBeInViewport` (em seções altas o título ficava fora da tela) — aplicado. Ordem de merge seguida: 3.2 antes do 3.3. |
| 18/11/2026 | M3 | **Produção conferida** após o deploy de `3ab7352`: 7 títulos e 7 subtítulos com `opacity: 1` em 390/820/1440 × 2 temas × 2 idiomas (12 combinações). Observação: o passo Lighthouse CI levou ~10 min no PR #15 (vs. ~1 min antes) — acompanhar no M10. |
| 18/11/2026 | M3 | Placar: 174 PRs mergeados (com o #16); Pair Extraordinaire ainda exibido no nível base — os candidatos ainda não refletiram no selo. |
| 18/11/2026 | M4 | **Ordem de merge:** 4.2 (#18) antes do 4.1 (#20), porque os formulários referenciam `feat` e `conteúdo`. Dry-run do #18 conferido antes do merge; depois, `gh label list` idêntico ao arquivo e a issue #17 manteve a label na renomeação `enhancement → feat`. |
| 18/11/2026 | M4 | **Rubber-duck dos 6 diffs (outra IA)** — 1 bloqueante e 4 ajustes, todos tratados: (1) o link de Discussions do `CONTRIBUTING.md` dava 404 e o lychee reprovaria → Discussions e reporte privado habilitados **antes** do 4.5; (2) com `squash_merge_commit_title=COMMIT_OR_PR_TITLE`, PR de um commit usaria o assunto do commit, não o título validado → `PR_TITLE`; (3) `pack-site` aceitava `../README.md` (existe no checkout, 404 no ar) e recusava import com `#fragmento` → contenção no `_site` + testes `node --test` (vermelho comprovado sem a checagem); (4) `from_name` permanente faz o labeler pular a entrada → removido no 4.2b (#29); (5) `workflow_dispatch` em branch de feature aplicaria labels não revisadas → dry-run fora da `main`. Verificado sem achado: inputs das Actions, schemas dos formulários e do Dependabot, nomes dos checks exigidos (`labels` tem filtro de caminho e **não** é exigido). |
| 18/11/2026 | M4 | **Configurações (sem PR):** só *squash* (merge commit e rebase desligados), título do squash = título do PR, mensagem = commits (mantém trailers), *auto-merge*, apagar branch no merge, Discussions e reporte privado de vulnerabilidade. Proteção da `main`: `quality` + `pr-title`, `strict`, `enforce_admins`, 0 aprovações; `git push` direto recusado (`GH006`). Branches atrás da `main` são rebaseadas (não *merge*), para não levar commits sem trailer ao squash. |
| 18/11/2026 | M4 | **4.3 (#22):** check visto vermelho com título sem tipo e com assunto em maiúscula, verde após corrigir (runs no comentário do PR). O próprio #24 foi aberto com assunto em maiúscula e corrigido. **4.4:** o Dependabot abriu o #27 (5 pacotes npm agrupados, `chore(deps-dev)`) e passou no `pr-title`; nenhum PR de Actions (todas já na versão mais nova). |
| 18/11/2026 | M4 | **4.6 (#31):** Pages trocado para `build_type=workflow` imediatamente antes do merge; deploy pelo job `deploy` (`needs: quality`). Desvio do plano: o `if` aceita também `workflow_dispatch` na `main` (republicar sem commit). |
| 18/11/2026 | M4 | Placar: 181 PRs mergeados por Blima-P (#18–#31, sem contar o #27 do Dependabot); 42 candidatos a coautoria; Pair Extraordinaire ainda no nível base. |
