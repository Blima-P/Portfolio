# Política de segurança

## Versão suportada

Só a versão publicada em <https://blima-p.github.io/Portfolio/> (branch `main`) recebe correções.

## Como reportar

**Não abra issue pública.** Use o
[reporte privado de vulnerabilidade](https://github.com/Blima-P/Portfolio/security/advisories/new)
do GitHub e inclua:

- o que encontrou e o impacto possível;
- passos ou URL para reproduzir;
- navegador e versão, se fizer diferença.

Respondo em até **7 dias**. Confirmado o problema, a correção sai em um PR que credita quem reportou
(se você quiser).

## Escopo

É um site estático, sem backend nem coleta de dados. Interessam especialmente: XSS ou injeção de
HTML (traduções, terminal interativo), links que levem a destinos inesperados, vazamento de
informação e dependências do pipeline de CI comprometidas.
