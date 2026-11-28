// Leitura mínima de HTML para os scripts do repositório (sem dependência): percorre comentários,
// <script> (texto cru, onde "<!--" ou "src=" dentro de uma string não contam) e <meta>, na ordem do
// documento e como o navegador os separa, e lê atributos com qualquer aspa, caixa e espaçamento.

const ATTR = /([^\s"'=<>/`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const ATTRS = `((?:[^>"']|"[^"]*"|'[^']*')*)`;
const TOKEN = new RegExp(
  `<!--[\\s\\S]*?(?:-->|$)|<script\\b${ATTRS}>([\\s\\S]*?)</script\\s*>|<meta\\b${ATTRS}>`,
  'gi',
);

/**
 * Atributos de uma tag: Map nome (minúsculo) → { value, quote, index } (o primeiro repetido vale,
 * como no navegador). `index` é a posição do atributo dentro de `attrText`.
 */
export function parseAttributes(attrText) {
  const attrs = new Map();
  for (const match of attrText.matchAll(ATTR)) {
    const [raw, name, dq, sq, bare] = match;
    const key = name.toLowerCase();
    if (attrs.has(key)) continue;
    const quote = dq !== undefined ? '"' : sq !== undefined ? "'" : '';
    attrs.set(key, { value: dq ?? sq ?? bare ?? '', quote, index: match.index, raw });
  }
  return attrs;
}

/**
 * Tags <script> e <meta> ativas (fora de comentários), em ordem:
 * { tag: 'script' | 'meta', attrs, attrText, body (só script), start, end, attrStart }.
 */
export function* elements(html) {
  for (const match of html.matchAll(TOKEN)) {
    const [whole, scriptAttrs, body, metaAttrs] = match;
    if (scriptAttrs === undefined && metaAttrs === undefined) continue; // comentário
    const tag = scriptAttrs !== undefined ? 'script' : 'meta';
    const attrText = scriptAttrs ?? metaAttrs;
    yield {
      tag,
      attrs: parseAttributes(attrText),
      attrText,
      body,
      start: match.index,
      end: match.index + whole.length,
      attrStart: match.index + 1 + tag.length,
    };
  }
}
