<div align="center">

# `< Pedro Braga />`

### Desenvolvedor Backend Java · Spring · PostgreSQL · Estagiário de desenvolvimento @ CAESB

[![Demo ao Vivo](https://img.shields.io/badge/▶_Demo_ao_Vivo-38BDF8?style=for-the-badge&labelColor=050A18)](https://blima-p.github.io/Portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Blima-P)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pedrobragadelima/)

---

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas_API-FF6F00?style=flat-square&logo=html5&logoColor=white)

</div>

<br>

> Portfólio pessoal desenvolvido do zero com **HTML5, CSS3 e JavaScript puro** — sem frameworks e sem etapa de build.
> Design dark-mode-first com estética tech, animações suaves e totalmente responsivo.

<br>

## ✨ Funcionalidades

| | Funcionalidade | Detalhes |
|:---:|---|---|
| 🎨 | **Tema Claro / Escuro** | Alternância com persistência via localStorage; o tema novo é revelado em círculo a partir do botão (View Transitions), instantâneo com movimento reduzido |
| 🌐 | **Bilíngue (PT-BR / EN)** | PT-BR por padrão, detecção pelo idioma do navegador e troca dinâmica de conteúdo |
| ⌨️ | **Linha de Terminal** | Comandos digitados no hero, decorativos (`aria-hidden`) e parados com movimento reduzido |
| 🔮 | **Sistema de Partículas** | Canvas com linhas de conexão, densidade proporcional à tela e pausa fora da viewport |
| 📜 | **Scroll-Spy** | Destaque automático do link ativo no menu |
| 🎭 | **Animações de Scroll** | Efeitos de revelação com Intersection Observer |
| 📊 | **Habilidades com Evidências** | Exemplos concretos de uso das tecnologias, sem porcentagens arbitrárias |
| 🗂️ | **Projetos enxutos** | 5 cards com links padronizados (ícone + texto) para código e site no ar |
| 📅 | **Linha do Tempo** | Timeline visual da jornada profissional |
| 🏅 | **Cursos e Aprendizado** | Formação complementar, sem apresentar cursos como certificações profissionais |
| 🐙 | **Integração GitHub** | Seleção explícita de projetos com dados atualizados via GitHub REST API |
| ✉️ | **Contato** | E-mail visível com botão "Copiar" (Clipboard API com fallback e anúncio para leitor de tela) e cards para GitHub, LinkedIn, currículo (PT ou EN, conforme o idioma) e Lattes |
| 💻 | **Terminal** | Botão `>_` no menu, Ctrl + K ou Ctrl + \` (funciona no ABNT2); diálogo acessível com foco preso e devolvido, histórico (↑/↓) e Tab que completa comandos e argumentos. Comandos `open <projeto>`, `cv`, `email`, `theme`, `lang`, `whoami`; carregado só quando aberto |
| 📱 | **Totalmente Responsivo** | Menu hambúrguer para mobile + layouts adaptativos |
| 🖨️ | **Versão impressa** | Imprimir ou salvar como PDF (A4) gera um currículo de até 2 folhas: fundo branco, sem header, partículas, botões nem terminal, com as URLs dos projetos e contatos |

<br>

## 🛠️ Tecnologias

```
Frontend        HTML5 (semântico) · CSS3 (Grid, Flexbox, Variáveis) · JS Vanilla (ES Modules)
Gráficos        Canvas API (sistema de partículas)
APIs            GitHub REST API
Otimização      Intersection Observer · requestAnimationFrame · content-visibility
Design          CSS Custom Properties · Responsivo mobile-first · Tema Claro/Escuro
Tipografia      Inter + JetBrains Mono hospedadas localmente (sem Google Fonts)
Qualidade       ESLint · Stylelint · Prettier · html-validate · Playwright · Lighthouse CI · lychee
```

<br>

## 📁 Estrutura do Projeto

```
Portfolio/
├── index.html                  # Página principal (home)
├── 404.html                    # Página não encontrada no estilo do terminal (<base href="/Portfolio/">)
├── projetos/
│   ├── carteira-api.html       # Estudo de caso da Carteira API (decisões, diagrama, provas)
│   └── socialtech.html         # Estudo de caso do SocialTech (papel, decisões, fluxo de entrega)
├── css/
│   ├── styles.css              # Estilos principais, layout, componentes, responsivo
│   ├── case.css                # Estilos dos estudos de caso (projetos/*.html)
│   ├── not-found.css           # Estilos da 404.html
│   └── animations.css          # Keyframes e classes utilitárias de animação
├── js/                         # ES Modules, sem variáveis globais
│   ├── main.js                 # Ponto de entrada da home: inicializa os módulos
│   ├── case.js                 # Ponto de entrada dos estudos de caso: tema, idioma e header
│   ├── not-found.js            # Ponto de entrada da 404: case.js + caminho pedido no terminal
│   ├── translations.js         # Textos PT-BR / EN (dados puros)
│   ├── i18n.js                 # Detecção, troca e persistência do idioma
│   ├── typing.js               # Linha de terminal decorativa do hero (comandos digitados)
│   ├── theme.js                # Tema claro/escuro: persistência e troca com View Transitions
│   ├── particles.js            # Sistema de partículas em Canvas
│   ├── ui.js                   # Header, menu mobile, scroll-spy e revelação
│   ├── contact.js              # Copiar e-mail (Clipboard API + fallback, aria-live)
│   ├── github.js               # API do GitHub — busca e renderiza repositórios
│   └── terminal.js             # Terminal (botão >_, Ctrl + K), carregado sob demanda
├── scripts/
│   ├── pages.mjs               # Lista única das páginas (index.html, projetos/*.html, 404.html)
│   ├── check-i18n.mjs          # Paridade e uso das chaves; textos e metadados de cada página
│   ├── stamp-assets.mjs        # Cache-busting: ?v=<hash> nos CSS/JS de todas as páginas
│   ├── pack-site.mjs           # Monta _site/ (só o que vai ao ar) e confere referências locais
│   └── serve-site.mjs          # Servidor local sob /Portfolio/, igual ao GitHub Pages
├── tests/
│   ├── smoke.spec.mjs          # Smoke test (Playwright, desktop e mobile, sob /Portfolio/)
│   └── unit/                   # Testes dos scripts (node --test)
└── assets/
    ├── favicon.svg             # Favicon do site
    ├── fonts/                  # Inter e JetBrains Mono (woff2, latin, OFL)
    └── cv/                     # Currículo em PDF (PT e EN, conforme o idioma do site)
```

<br>

## 🚀 Como Rodar

```bash
# Clone o repositório
git clone https://github.com/Blima-P/Portfolio.git
cd Portfolio

# Sirva por HTTP (os ES Modules não carregam via file://)
npm ci
npm run serve    # http://localhost:3000/Portfolio/
```

O `npm run serve` imita o GitHub Pages: o site fica sob `/Portfolio/` e só os arquivos publicados
são servidos, então um caminho absoluto (`/css/…`) ou um arquivo fora do artefato dá 404 já na
máquina local. Páginas novas em `projetos/` entram sozinhas em todas as verificações
(`scripts/pages.mjs`) e declaram `<html data-page="id">`, com título e descrição traduzidos nas
chaves `page.<id>.title` e `page.<id>.description`.

Não há etapa de build: o que está no repositório é o que vai para o GitHub Pages. O deploy é feito
pelo GitHub Actions **sob demanda**: o push na `main` só roda as verificações; a publicação acontece
quando o workflow é disparado à mão, e **somente depois** de todas as verificações passarem, com um
artefato que contém apenas os arquivos públicos (`npm run pack:site`). Nesse passo, o ano e o
"atualizado em" do rodapé recebem a data do commit publicado.

```bash
gh workflow run quality.yml --ref main   # verifica e publica o estado atual da main
```

### Verificações de qualidade

Requer Node.js 22+.

```bash
npm ci
npx playwright install chromium   # uma vez, para o smoke test

npm run verify    # lint, formatação, HTML, i18n, versões dos assets, testes de scripts e smoke test
npm run format    # formata com Prettier e atualiza o ?v=<hash> dos assets
```

Ao editar qualquer CSS ou JS, rode `npm run stamp` (ou `npm run format`) antes do commit: o CI
falha se o `?v=<hash>` estiver desatualizado, o que evita misturar HTML novo com CSS/JS antigos do
cache do navegador após um deploy.

<br>

## 🎯 Seções

| Seção | Descrição |
|---|---|
| **Hero** | Selo de disponibilidade, nome, cargo, proposta de valor, prova com link (SocialTech), linha de terminal, partículas de fundo, botões de ação |
| **Sobre** | Foto, bio, dados de localização/graduação/disponibilidade |
| **Experiência** | Linha do tempo da jornada profissional |
| **Projetos** | SocialTech em destaque (projeto concluído e no ar: papel, números com link para a prova e estudo de caso), Carteira API (com estudo de caso em página própria), ERP Acadêmico, Campo-minado e Painel Semanal (PWA offline), com contexto e participação |
| **Competências** | Agrupadas por área (Backend, Front-end, Dados, DevOps), com nível honesto ("no ar", "em projeto", "estudando") e link para a evidência |
| **Cursos** | Formação complementar, distinta de certificações profissionais |
| **GitHub** | Cards dos cinco repositórios selecionados (SocialTech primeiro), com dados atualizados via API do GitHub |
| **Contato** | E-mail copiável, GitHub, LinkedIn, currículo (PDF) e Lattes |
| **Rodapé** | Autoria, "feito à mão, sem frameworks", link do código-fonte e data da última atualização |

<br>

## 💡 Ideias para a Seção Sobre

Sugestões para tornar a seção "Sobre" ainda mais impactante:

- **Credenciais Verificáveis** — Adicionar links públicos dos certificados de conclusão dos cursos
- **"Estudando Atualmente"** — Badge ou chip destacando o que você está aprendendo no momento
- **Lema Pessoal** — Uma frase de impacto curta que defina sua filosofia como dev
- **Foto Interativa** — Ao passar o mouse, trocar para uma foto mais casual/divertida com CSS
- **Cards de Curiosidades** — Pequenos cards como "☕ Cafés por dia: 3" ou "🎮 Gamer nas horas vagas"
- **Mini-Timeline** — Linha do tempo compacta dentro do Sobre mostrando formação + experiência

<br>

## 📬 Contato

<div align="center">

[![Email](https://img.shields.io/badge/Email-pbl0812@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:pbl0812@gmail.com)
[![GitHub](https://img.shields.io/badge/@Blima--P-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Blima-P)
[![LinkedIn](https://img.shields.io/badge/Pedro_Braga_de_Lima-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pedrobragadelima/)
[![Lattes](https://img.shields.io/badge/Currículo_Lattes-005A9C?style=for-the-badge)](https://lattes.cnpq.br/7355607472728751)

</div>

<br>

---

<div align="center">
  <sub>Feito com ❤️ por <strong>Pedro Braga</strong> — HTML, CSS e JavaScript puro. Sem frameworks.</sub>
</div>
