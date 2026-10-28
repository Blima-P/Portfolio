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
| 🌐 | **Bilíngue (EN / PT-BR)** | Sistema i18n completo com troca dinâmica de conteúdo |
| ⌨️ | **Efeito de Digitação** | Texto animado no hero com frases rotativas por idioma |
| 🔮 | **Sistema de Partículas** | Partículas interativas em Canvas com linhas de conexão |
| 📜 | **Scroll-Spy** | Destaque automático do link ativo no menu |
| 🎭 | **Animações de Scroll** | Efeitos de revelação com Intersection Observer |
| 📊 | **Habilidades com Evidências** | Exemplos concretos de uso das tecnologias, sem porcentagens arbitrárias |
| 🔢 | **Contadores Animados** | Números contam ao entrar na viewport |
| 🗂️ | **Filtro de Projetos** | Filtragem por categoria (Todos, Web, Backend, Sistemas) |
| 📅 | **Linha do Tempo** | Timeline visual da jornada profissional |
| 🏅 | **Cursos e Aprendizado** | Formação complementar, sem apresentar cursos como certificações profissionais |
| 🐙 | **Integração GitHub** | Seleção explícita de projetos com dados atualizados via GitHub REST API |
| ✉️ | **Links de Contato** | Cards diretos para Email, GitHub, LinkedIn, Lattes |
| 🖱️ | **Cursor Personalizado** | Brilho que segue o mouse com expansão no hover (desktop) |
| 🧲 | **Botões Magnéticos** | Botões seguem sutilmente o cursor ao passar o mouse |
| 🌊 | **Formas Parallax** | Formas decorativas desfocadas que se movem no scroll |
| 🎬 | **Transições de Página** | Efeitos de fade suaves nos cliques do menu |
| 💻 | **Terminal (Easter Egg)** | Terminal oculto (Ctrl + \`) com comandos personalizados |
| 📱 | **Totalmente Responsivo** | Menu hambúrguer para mobile + layouts adaptativos |
| ⚡ | **Preloader** | Tela de carregamento com barra de progresso |
| 🎞️ | **Overlay de Ruído** | Textura de grão sutil para dar profundidade |

<br>

## 🛠️ Tecnologias

```
Frontend        HTML5 (semântico) · CSS3 (Grid, Flexbox, Variáveis) · JS Vanilla (ES6+)
Gráficos        Canvas API (sistema de partículas)
APIs            GitHub REST API
Otimização      Intersection Observer · requestAnimationFrame · content-visibility
Design          CSS Custom Properties · Responsivo mobile-first · Tema Claro/Escuro
```

<br>

## 📁 Estrutura do Projeto

```
Portfolio/
├── index.html                  # HTML principal — aplicação de página única
├── css/
│   ├── styles.css              # Estilos principais, layout, componentes, responsivo
│   └── animations.css          # Keyframes e classes utilitárias de animação
├── js/
│   ├── main.js                 # Scroll, observers, contadores, filtros
│   ├── i18n.js                 # Internacionalização (traduções EN / PT-BR)
│   ├── typing.js               # Efeito de digitação no hero com suporte a idiomas
│   ├── theme.js                # Alternador de tema claro/escuro com persistência
│   ├── particles.js            # Sistema de partículas em Canvas com conexões
│   ├── github.js               # API do GitHub — busca e renderiza repositórios
│   ├── contact.js              # Seção de contato (cards com links diretos)
│   ├── terminal.js             # Terminal easter egg (Ctrl + `)
│   ├── cursor.js               # Efeito de brilho no cursor personalizado
│   ├── magnetic.js             # Efeito magnético nos botões ao hover
│   ├── parallax.js             # Formas decorativas com parallax no scroll
│   ├── page-transitions.js     # Transições suaves na navegação
│   └── testimonials.js         # Carrossel de depoimentos com autoplay
└── assets/
    ├── favicon.svg             # Favicon do site
    └── cv/                     # Currículo para download (PDF)
```

<br>

## 🚀 Como Rodar

```bash
# Clone o repositório
git clone https://github.com/Blima-P/Portfolio.git

# Entre na pasta do projeto
cd Portfolio

# Abra no navegador (não precisa de build!)
# Opção 1: Abrir diretamente
start index.html

# Opção 2: Usar um servidor local (recomendado para chamadas de API)
npx serve .
# ou
python -m http.server 8000
```

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
