import { posix } from 'node:path';

export const librasGuide = 'acessibilidade/guia.html';
export const librasAssets = ['libras.css', 'libras.js', 'guia.html', 'guia.js'];

export function librasScope(path) {
  if (path === librasGuide || !path.endsWith('.html')) return null;
  if (path.startsWith('dashboard/')) return 'dashboard';
  if (path === 'lab/index.html') return 'lab';
  return 'public';
}

function allowLocalAssets(policy) {
  const directives = new Map(policy.split(';').map(part => part.trim().split(/\s+/))
    .filter(([name]) => name).map(([name, ...sources]) => [name, sources]));
  for (const name of ['style-src', 'script-src', 'frame-src']) {
    const sources = directives.get(name) ?? directives.get('default-src') ?? [];
    if (!sources.includes("'self'")) {
      directives.set(name, [...sources.filter(source => source !== "'none'"), "'self'"]);
    }
  }
  return [...directives].map(([name, sources]) => [name, ...sources].join(' ')).join('; ');
}

export function decorateLibrasPage(original, path) {
  const scope = librasScope(path);
  if (!scope) return original;
  const folder = posix.relative(posix.dirname(path), 'acessibilidade');
  const assets = `<link rel="stylesheet" href="${folder}/libras.css"><script src="${folder}/libras.js" defer></script>`;
  const label = 'Libras';
  const link = `<nav aria-label="Acessibilidade"><a class="ipe-libras-link vlibras-ignore" data-ipe-libras="${scope}" href="${folder}/guia.html">${label}</a></nav>`;
  const html = original.replace(/(<meta\b[^>]*\bhttp-equiv="Content-Security-Policy"[^>]*\bcontent=")([^"]*)"/gi,
    (_, start, policy) => `${start}${allowLocalAssets(policy)}"`);
  const hasHead = /<\/head\s*>/i.test(html);
  const bodyEnd = /<\/body\s*>(?=\s*<\/html\s*>\s*$)/i.test(html) ? /<\/body\s*>(?=\s*<\/html\s*>\s*$)/i : /<\/html\s*>\s*$/i;
  if (!bodyEnd.test(html)) throw new Error(`HTML público sem fechamento para o acesso em Libras. ${path}`);
  return (hasHead ? html.replace(/<\/head\s*>/i, match => assets + match) : html)
    .replace(bodyEnd, match => (hasHead ? '' : assets) + link + match);
}
