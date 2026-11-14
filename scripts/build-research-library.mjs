import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sha = value => createHash('sha256').update(value).digest('hex');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const idFor = source => 'doc-' + source.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const sources = [];
for (const folder of ['docs', 'research', 'research/history', 'research/initial', 'presentation']) {
  for (const entry of await readdir(resolve(root, folder), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.md')) sources.push(`${folder}/${entry.name}`);
  }
}
sources.push('research/anexo-original.txt');
sources.sort();
const sourceSet = new Set(sources);
const documents = [];
for (const source of sources) {
  const bytes = await readFile(resolve(root, source));
  let text = bytes.toString('utf8');
  let redactions = 0;
  const redact = (pattern, replacement) => { text = text.replace(pattern, (...args) => { redactions++; return typeof replacement === 'function' ? replacement(...args) : replacement; }); };
  // Explicit public projection: retain the study, remove machine-specific paths/endpoints.
  redact(/\/workspace\/scratch\/[^/\s`"']+\/(?:AB-NASA-TEAM-IPE|ab-mission-ipe)\//g, '');
  redact(/(?:\/workspace\/|\/Users\/|\/home\/)[^\s`"'<>)]*/g, '[caminho local de desenvolvimento]');
  redact(/https?:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d+)?[^\s`"'<>)]*/g, '[endpoint privado omitido]');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}/.test(text)) throw new Error(`Possível segredo em ${source}; revisar antes de publicar.`);
  const title = source.endsWith('.txt') ? 'Anexo fornecido — catálogo de tecnologias e blueprints' : (text.match(/^#\s+(.+)$/m)?.[1] || source);
  const category = source.startsWith('research/initial') ? 'Pesquisa inicial' : source.startsWith('research/history') ? 'Rodadas históricas' : source.startsWith('research/') ? 'Pesquisa técnica' : source.startsWith('presentation/') ? 'Apresentação' : 'Documentação do produto';
  documents.push({ source, id: idFor(source), title, category, text, originalBytes: bytes.length, originalSha256: sha(bytes), projectedSha256: sha(text), redactions });
}

function inline(value, source) {
  let cursor = 0, html = '';
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  for (const match of value.matchAll(pattern)) {
    html += escape(value.slice(cursor, match.index));
    if (match[1]) {
      const href = match[2];
      const relative = posix.normalize(posix.join(posix.dirname(source), href.split('#')[0]));
      if (/^https?:\/\//i.test(href)) html += `<a href="${escape(href)}" target="_blank" rel="noopener noreferrer">${escape(match[1])}</a>`;
      else if (sourceSet.has(relative)) html += `<a href="#${idFor(relative)}">${escape(match[1])}</a>`;
      else html += `${escape(match[1])} <code>${escape(href)}</code>`;
    } else if (match[3]) html += `<code>${escape(match[3])}</code>`;
    else html += `<strong>${escape(match[4])}</strong>`;
    cursor = match.index + match[0].length;
  }
  return html + escape(value.slice(cursor));
}
function markdown(value, source) {
  const lines = value.replace(/\r\n/g, '\n').split('\n'), output = [];
  let i = 0;
  const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (/^```/.test(line)) {
      const code = [], language = line.slice(3).trim(); i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      if (i < lines.length) i++;
      output.push(`<pre><code data-language="${escape(language)}">${escape(code.join('\n'))}</code></pre>`); continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { const level = Math.min(6, heading[1].length + 1); output.push(`<h${level}>${inline(heading[2], source)}</h${level}>`); i++; continue; }
    if (line.startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      const header = cells(line), rows = []; i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      output.push(`<div class="table"><table><thead><tr>${header.map(x=>`<th>${inline(x,source)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${inline(x,source)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    if (/^[-*]\s|^\d+\.\s/.test(line)) {
      const ordered = /^\d+\./.test(line), tag = ordered ? 'ol' : 'ul', pattern = ordered ? /^\d+\.\s/ : /^[-*]\s/, items = [];
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, ''));
      output.push(`<${tag}>${items.map(x=>`<li>${inline(x,source)}</li>`).join('')}</${tag}>`); continue;
    }
    if (/^>\s/.test(line)) { output.push(`<blockquote>${inline(line.slice(2),source)}</blockquote>`); i++; continue; }
    if (/^\s*[-*_]{3,}\s*$/.test(line)) { output.push('<hr>'); i++; continue; }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(?:#{1,6}\s|```|[-*]\s|\d+\.\s|>\s|\|)/.test(lines[i])) paragraph.push(lines[i++]);
    output.push(`<p>${inline(paragraph.join(' '),source)}</p>`);
  }
  return output.join('\n');
}
const generatedAt = new Date().toISOString();
const intro = 'Base documental integral da Missão Ipê. Esta edição reúne os documentos disponíveis no projeto e as pesquisas iniciais preservadas. Cada documento mantém seu corte histórico: propostas, medições e limitações antigas não são atualizadas por sua republicação. A consolidação de contexto é uma reconstrução documental, não uma transcrição literal de mensagens não disponíveis. Caminhos de máquina e endpoints privados foram removidos da projeção pública; a fonte completa permanece no pacote e no repositório preparado.';
const combined = '# AB-NASA-TEAM-IPE — Biblioteca documental integral\n\n'+intro+'\n\n'+documents.map(d=>`---\n\n# ${d.title}\n\nFonte: \`${d.source}\` · SHA-256 original: \`${d.originalSha256}\` · Ajustes de caminhos privados: ${d.redactions}\n\n${d.text}`).join('\n\n');
const css = `:root{color-scheme:light;--ink:#122b38;--paper:#f5f3eb;--line:#c7cfc8;--accent:#e8b842;font:16px/1.7 system-ui,-apple-system,Segoe UI,sans-serif;color:var(--ink);background:var(--paper)}*{box-sizing:border-box}body{margin:0}a{color:inherit;text-underline-offset:4px}button,input{font:inherit}button{cursor:pointer}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #9d6019;outline-offset:4px}.skip{position:absolute;top:-100px}.skip:focus{top:4px;background:white;padding:12px;z-index:5}header{padding:26px 5vw;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}header nav{display:flex;gap:20px}header strong{letter-spacing:.06em;font-size:14px}.hero{padding:50px 5vw 38px;max-width:1400px;margin:auto}.eyebrow{font:600 11px/1.4 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.hero h1{font-size:clamp(36px,5vw,68px);line-height:1.05;letter-spacing:-.05em;max-width:900px;margin:16px 0 24px}.hero p{max-width:1000px;color:#4b626b}.tools{display:flex;gap:18px;flex-wrap:wrap;align-items:center}.tools button{padding:8px 14px;border:1px solid var(--ink);background:transparent}.layout{display:grid;grid-template-columns:300px minmax(0,1fr);max-width:1400px;margin:auto;padding:0 5vw 60px;gap:42px}aside{position:sticky;top:15px;align-self:start;max-height:90vh;overflow:auto;border-top:3px solid var(--ink);padding-top:14px}aside input{width:100%;padding:10px;border:1px solid var(--line);background:white}#source-count{font-size:12px}#source-list{display:grid;gap:0}#source-list a{font-size:12px;padding:12px 0;border-top:1px solid var(--line);text-decoration:none}#source-list a[aria-current=true]{font-weight:750;color:#8e4f04}#source-list small{display:block;font-size:10px;color:#53676b}.doc{min-width:0;border-top:3px solid var(--accent);padding-top:20px}.doc>h2{font-size:32px;letter-spacing:-.03em;line-height:1.2}.doc h3{font-size:27px;line-height:1.2;margin-top:35px}.doc h4{font-size:23px;line-height:1.3;margin-top:30px}.doc h5{font-size:19px}.doc p,.doc li{overflow-wrap:anywhere}.source-meta{font-size:11px;border:1px solid var(--line);padding:14px;background:#e9ece3;overflow-wrap:anywhere}.source-meta p{margin:3px 0}.notice{border-left:4px solid var(--accent);padding:14px 18px;background:#ece6d5;font-size:13px}.table{overflow:auto;max-width:100%}table{border-collapse:collapse;width:100%;font-size:13px;line-height:1.5}td,th{border-bottom:1px solid var(--line);padding:12px;text-align:left;vertical-align:top}th{background:#e4e9e0}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#e5eae2;padding:18px;font:12px/1.6 ui-monospace,monospace;max-width:100%}code{font-size:.88em;overflow-wrap:anywhere}blockquote{border-left:3px solid var(--ink);padding-left:20px;color:#4b626b}hr{border:0;border-top:1px solid var(--line);margin:32px 0}footer{padding:25px 5vw;border-top:1px solid var(--line);font-size:12px}[hidden]{display:none!important}@media(max-width:850px){.layout{display:block}aside{position:static;max-height:330px;margin-bottom:28px}.hero{padding-top:30px}.doc>h2{font-size:28px}header{font-size:12px}}@media print{header,aside,.tools,.skip,footer{display:none!important}.layout{display:block;padding:0}.hero{padding:0}.hero h1{font-size:32px}.doc{display:block!important;break-before:page;border:0}.doc h2{font-size:24px}body{background:white;font-size:11px}table{font-size:10px}pre{font-size:9px}.hero p{font-size:11px}}`;
const script = `(()=>{'use strict';const articles=[...document.querySelectorAll('.doc')],links=[...document.querySelectorAll('#source-list a')],search=document.getElementById('source-search'),count=document.getElementById('source-count');function select(){let id=location.hash.slice(1);if(!articles.some(x=>x.id===id))id=articles[0]?.id;for(const a of articles)a.hidden=a.id!==id;for(const l of links)l.setAttribute('aria-current',String(l.hash.slice(1)===id));}function filter(){const q=search.value.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();let n=0;for(const l of links){const a=document.getElementById(l.hash.slice(1));const match=(l.textContent+' '+a.textContent).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().includes(q);l.hidden=!match;if(match)n++;}count.textContent=n+' de '+links.length+' documentos encontrados';}search.addEventListener('input',filter);window.addEventListener('hashchange',select);document.getElementById('print-library').addEventListener('click',()=>window.print());select();filter();})();`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="author" content="AB / Hackatur–Zer0Slop, com assistência de IA"><title>Biblioteca integral · Missão Ipê</title><style>${css}</style></head><body><a class="skip" href="#library-main">Ir ao documento</a><header><strong>IPÊ / ACERVO DE PROJETO</strong><nav><a href="./index.html">Contexto e cronograma</a><a href="../index.html">Portal</a><a href="../game/index.html">Jogo</a></nav></header><section class="hero"><p class="eyebrow">${documents.length} documentos · fontes e cortes preservados</p><h1>A pesquisa por inteiro.<br>A decisão com evidência.</h1><p>${escape(intro)}</p><div class="tools"><a href="./research-library.md" download>Baixar biblioteca em Markdown</a><a href="./research-library-index.json">Consultar índice e hashes</a><button type="button" id="print-library">Imprimir todos os documentos</button></div></section><div class="layout"><aside aria-label="Índice da biblioteca"><label for="source-search">Buscar no acervo</label><input id="source-search" type="search" placeholder="NDVI, Brasil, Prisma, Fastino…"><p id="source-count" role="status" aria-live="polite"></p><nav id="source-list">${documents.map(d=>`<a href="#${d.id}">${escape(d.title)}<small>${escape(d.category)} · ${escape(d.source)}</small></a>`).join('')}</nav></aside><main id="library-main">${documents.map(d=>`<article class="doc" id="${d.id}"><p class="eyebrow">${escape(d.category)}</p><h2>${escape(d.title)}</h2><div class="source-meta"><p>Fonte no projeto: <code>${escape(d.source)}</code></p><p>SHA-256 original: <code>${d.originalSha256}</code></p><p>Ajustes de caminhos privados nesta projeção: ${d.redactions}. Conteúdo interpretado segundo sua edição original.</p></div>${d.source.includes('anexo-original')?'<p class="notice">Texto fornecido no briefing. Alegações do anexo não são resultados verificados; a revisão crítica está nos documentos Fastino/anexos e auditoria de repositórios.</p>':''}${markdown(d.text,d.source)}</article>`).join('')}</main></div><footer>AB-NASA-TEAM-IPE · P&D BETA · Publicação documental não comprova elegibilidade, aprendizagem ou qualificação operacional.</footer><script>${script}</script></body></html>`;
await mkdir(resolve(root,'context'),{recursive:true});
await writeFile(resolve(root,'context/research-library.html'),html);
await writeFile(resolve(root,'context/research-library.md'),combined);
const index={schemaVersion:1,generatedAt,description:intro,documentCount:documents.length,documents:documents.map(({text,...d})=>d),artifacts:[{path:'context/research-library.html',bytes:Buffer.byteLength(html),sha256:sha(html)},{path:'context/research-library.md',bytes:Buffer.byteLength(combined),sha256:sha(combined)}]};
await writeFile(resolve(root,'context/research-library-index.json'),JSON.stringify(index,null,2)+'\n');
await writeFile(resolve(root,'evidence/research-library-r8.json'),JSON.stringify(index,null,2)+'\n');
console.log(JSON.stringify({documents:documents.length,htmlBytes:Buffer.byteLength(html),markdownBytes:Buffer.byteLength(combined),pathRedactions:documents.reduce((n,d)=>n+d.redactions,0)}));
