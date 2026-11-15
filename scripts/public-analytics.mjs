export const analyticsAsset = 'assets/analytics.js';
export const analyticsPrivateRoutes = '(?:equipe|dashboard|acessibilidade|api)(?:/|$)';

export function isAnalyticsPage(path) {
  return path.endsWith('.html') && !new RegExp(`^${analyticsPrivateRoutes}`).test(path);
}

export function allowPublicAnalytics(policy) {
  const directives = new Map(policy.split(';').map(part => part.trim().split(/\s+/))
    .filter(([name]) => name).map(([name, ...sources]) => [name, sources]));
  const add = (name, origin) => {
    const sources = directives.get(name) ?? directives.get('default-src') ?? ["'self'"];
    directives.set(name, [...new Set([...sources.filter(source => source !== "'none'"), ...(name.startsWith('script-src') ? ["'self'"] : []), origin])]);
  };
  add('script-src', 'https://static.cloudflareinsights.com');
  if (directives.has('script-src-elem')) add('script-src-elem', 'https://static.cloudflareinsights.com');
  add('connect-src', 'https://cloudflareinsights.com');
  return [...directives].map(([name, sources]) => [name, ...sources].join(' ')).join('; ');
}

export function decorateAnalyticsPage(original, path) {
  if (!isAnalyticsPage(path)) return original;
  const html = original.replace(/(<meta\b[^>]*\bhttp-equiv="Content-Security-Policy"[^>]*\bcontent=")([^"]*)"/gi,
    (_, start, policy) => `${start}${allowPublicAnalytics(policy)}"`);
  const end = /<\/body\s*>(?=\s*<\/html\s*>\s*$)/i.test(html) ? /<\/body\s*>(?=\s*<\/html\s*>\s*$)/i : /<\/html\s*>\s*$/i;
  if (!end.test(html)) throw new Error(`HTML público sem fechamento para métricas: ${path}`);
  return html.replace(end, match => `<script src="/${analyticsAsset}" defer></script>${match}`);
}
