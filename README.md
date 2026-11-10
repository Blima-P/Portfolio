<div align="center">

# `< Pedro Braga />`

### Desenvolvedor Backend Java · Spring · PostgreSQL · Estagiário de desenvolvimento @ CAESB

[![Demo ao Vivo](https://img.shields.io/badge/▶_Demo_ao_Vivo-4ADE80?style=for-the-badge&logoColor=white)](https://blima-p.github.io/Portfolio/)
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
| 🎨 | **Tema Claro / Escuro** | Alternância com persistência via localStorage |
| 🌐 | **Bilíngue (PT-BR / EN)** | PT-BR por padrão, detecção pelo idioma do navegador e troca dinâmica de conteúdo |
| ⌨️ | **Efeito de Digitação** | Texto animado no hero com frases rotativas por idioma |
| 🔮 | **Sistema de Partículas** | Canvas com linhas de conexão, densidade proporcional à tela e pausa fora da viewport |
| 📜 | **Scroll-Spy** | Destaque automático do link ativo no menu |
| 🎭 | **Animações de Scroll** | Efeitos de revelação com Intersection Observer |
| 📊 | **Habilidades com Evidências** | Exemplos concretos de uso das tecnologias, sem porcentagens arbitrárias |
| 🔢 | **Contadores Animados** | Números contam ao entrar na viewport |
| 🗂️ | **Filtro de Projetos** | Filtragem por categoria (Todos, Web, Backend, Sistemas) |
| 📅 | **Linha do Tempo** | Timeline visual da jornada profissional |
| 🏅 | **Cursos e Aprendizado** | Formação complementar, sem apresentar cursos como certificações profissionais |
| 🐙 | **Integração GitHub** | Seleção explícita de projetos com dados atualizados via GitHub REST API |
| ✉️ | **Links de Contato** | Cards diretos para Email, GitHub, LinkedIn, Lattes |
| 💻 | **Terminal (Easter Egg)** | Terminal oculto (Ctrl + \`), carregado só quando aberto |
| 📱 | **Totalmente Responsivo** | Menu hambúrguer para mobile + layouts adaptativos |

<br>

## 🛠️ Tecnologias

```
Frontend        HTML5 (semântico) · CSS3 (Grid, Flexbox, Variáveis) · JS Vanilla (ES Modules)
Gráficos        Canvas API (sistema de partículas)
APIs            GitHub REST API
Otimização      Intersection Observer · requestAnimationFrame · content-visibility
Design          CSS Custom Properties · Responsivo mobile-first · Tema Claro/Escuro
Qualidade       ESLint · Stylelint · Prettier · html-validate · Playwright · Lighthouse CI · lychee
```

<br>

## 📁 Estrutura do Projeto

```
Portfolio/
├── index.html                  # HTML principal — aplicação de página única
├── css/
│   ├── styles.css              # Estilos principais, layout, componentes, responsivo
│   └── animations.css          # Keyframes e classes utilitárias de animação
├── js/                         # ES Modules, sem variáveis globais
│   ├── main.js                 # Ponto de entrada: inicializa os módulos
│   ├── translations.js         # Textos PT-BR / EN (dados puros)
│   ├── i18n.js                 # Detecção, troca e persistência do idioma
│   ├── typing.js               # Efeito de digitação no hero, sem deslocar o layout
│   ├── theme.js                # Alternador de tema claro/escuro com persistência
│   ├── particles.js            # Sistema de partículas em Canvas
│   ├── ui.js                   # Header, menu mobile, scroll-spy, revelação, contadores, filtros
│   ├── github.js               # API do GitHub — busca e renderiza repositórios
│   └── terminal.js             # Terminal easter egg (Ctrl + `), carregado sob demanda
├── scripts/
│   ├── check-i18n.mjs          # Verifica paridade e uso das chaves de tradução
│   └── stamp-assets.mjs        # Cache-busting: ?v=<hash> nos CSS/JS
├── tests/
│   └── smoke.spec.mjs          # Smoke test (Playwright, desktop e mobile)
├── docs/
│   └── plano-implementacao.md  # Plano de melhorias com milestones
└── assets/
    ├── favicon.svg             # Favicon do site
    └── cv/                     # Currículo (PDF)
```

<br>

## 🚀 Como Rodar

```bash
# Clone o repositório
git clone https://github.com/Blima-P/Portfolio.git
cd Portfolio

# Sirva por HTTP (os ES Modules não carregam via file://)
npx serve .
# ou
python -m http.server 8000
```

Não há etapa de build: o que está no repositório é o que vai para o GitHub Pages.

### Verificações de qualidade

Requer Node.js 22+.

```bash
npm ci
npx playwright install chromium   # uma vez, para o smoke test

npm run verify    # lint, formatação, HTML, i18n, versões dos assets e smoke test
npm run format    # formata com Prettier e atualiza o ?v=<hash> dos assets
```

Ao editar qualquer CSS ou JS, rode `npm run stamp` (ou `npm run format`) antes do commit: o CI
falha se o `?v=<hash>` estiver desatualizado, o que evita misturar HTML novo com CSS/JS antigos do
cache do navegador após um deploy.

<br>

## 🎯 Seções

| Seção | Descrição |
|---|---|
| **Hero** | Nome, efeito de digitação, partículas de fundo, botões de ação |
| **Sobre** | Foto, bio, dados de localização/graduação/disponibilidade, contadores animados |
| **Experiência** | Linha do tempo da jornada profissional |
| **Projetos** | Carteira API, ERP Acadêmico, Campo-minado e Portfolio, com contexto e participação |
| **Skills** | Tecnologias acompanhadas de exemplos práticos |
| **Cursos** | Formação complementar, distinta de certificações profissionais |
| **GitHub** | Cards dos quatro projetos selecionados, com dados atualizados via API do GitHub |
| **Contato** | Links diretos para Email, GitHub, LinkedIn, Lattes |

<br>

## 💡 Ideias para a Seção Sobre

Sugestões para tornar a seção "Sobre Mim" ainda mais impactante:

- **Stats Dinâmicos do GitHub** — Substituir contadores fixos por dados reais da API do GitHub (total de repos, commits, contribuições)
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
