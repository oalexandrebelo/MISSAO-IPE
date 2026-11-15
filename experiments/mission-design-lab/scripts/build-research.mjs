#!/usr/bin/env node
// Rebuild with: node scripts/build-research.mjs
// Marked 17.0.5 is vendored under its MIT license. The delivered page loads no libraries.
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Marked } from './vendor/marked/marked.esm.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'public/research');
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const slug = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const documents = [
  { id:'refinamento', label:'Refinamento NASA', tag:'Decisões da rodada 10', path:'docs/REFINAMENTO-NASA-R10.md' },
  { id:'conops', label:'Conceito de operações', tag:'Pesquisa de refinamento', path:'research/round10/refinamento-conops.md' },
  { id:'requisitos', label:'Requisitos e versões', tag:'Auditoria documental', path:'research/round10/refinamento-requisitos.md' },
  { id:'risco', label:'Risco e oportunidades', tag:'Pesquisa de refinamento', path:'research/round10/refinamento-risco-ux.md' },
  { id:'decisoes', label:'Pesquisa e decisões', tag:'Síntese da rodada', path:'docs/PESQUISA-E-DECISOES-R9.md' },
  { id:'desafio', label:'Desafio e referências', tag:'Parecer A1', path:'research/round9/a1-desafio.md' },
  { id:'fisica', label:'Física e dados', tag:'Parecer A2', path:'research/round9/a2-fisica.md' },
  { id:'ux-tecnologia', label:'UX e tecnologia', tag:'Parecer A3', path:'research/round9/a3-ux-tecnologia.md' },
  { id:'guia', label:'Guia didático', tag:'Roteiro de investigação', path:'docs/GUIA-DIDATICO-R9.md' },
  { id:'qa', label:'Registro de QA', tag:'Evidência de verificação', path:'docs/QA-R9.md' },
  { id:'qa-navegador', label:'QA no navegador', tag:'Fluxos e responsividade', path:'docs/QA-NAVEGADOR-R9.md' },
];

// A small, deliberately strict TeX-to-MathML typesetter for the notation in the
// source documents. It performs no scientific calculations. Unknown commands
// fail the build; the original TeX remains available beside every equation.
function mathML(tex) {
  let pos = 0;
  const symbol = { mu:'μ', pi:'π', eta:'η', beta:'β', epsilon:'ϵ', lambda:'λ', rho:'ρ', Delta:'Δ', odot:'⊙', infty:'∞', cdot:'·' };
  const functions = new Set(['sin','cos','arccos','arcsin','ln','exp','max','log']);
  const whitespace = () => { while (/\s/.test(tex[pos] || '') && pos < tex.length) pos++; };
  const groupText = () => {
    whitespace();
    if (tex[pos] !== '{') throw new Error('Expected a braced text group in equation');
    pos++;
    const start = pos;
    let depth = 1;
    while (pos < tex.length && depth) {
      if (tex[pos] === '{') depth++;
      if (tex[pos] === '}') depth--;
      if (depth) pos++;
    }
    if (depth) throw new Error('Unclosed equation group');
    const result = tex.slice(start, pos);
    pos++;
    return result;
  };
  const atom = () => {
    whitespace();
    const char = tex[pos++];
    if (char === undefined) throw new Error('Unexpected end of equation');
    if (char === '{') return row('}');
    if (char === '\\') {
      const command = tex.slice(pos).match(/^[A-Za-z]+/)?.[0];
      if (!command) {
        const literal = tex[pos++];
        if (literal === ',' || literal === ' ') return '<mspace width="0.2em"/>';
        if ('%{}[]'.includes(literal)) return `<mo>${escape(literal)}</mo>`;
        throw new Error(`Unsupported TeX escape: ${literal}`);
      }
      pos += command.length;
      if (command === 'frac') return `<mfrac>${atom()}${atom()}</mfrac>`;
      if (command === 'sqrt') return `<msqrt>${atom()}</msqrt>`;
      if (command === 'mathrm' || command === 'text') return `<mtext>${escape(groupText())}</mtext>`;
      if (command === 'hat') return `<mover accent="true">${atom()}<mo>^</mo></mover>`;
      if (command === 'left' || command === 'right') return atom();
      if (command === 'quad' || command === 'qquad') return `<mspace width="${command === 'quad' ? 1 : 2}em"/>`;
      if (symbol[command]) return `<${command === 'cdot' ? 'mo' : 'mi'}>${symbol[command]}</${command === 'cdot' ? 'mo' : 'mi'}>`;
      if (functions.has(command)) return `<mi mathvariant="normal">${command}</mi>`;
      throw new Error(`Unsupported TeX command: ${command}`);
    }
    if (/[0-9]/.test(char)) {
      const rest = tex.slice(pos).match(/^[0-9]*(?:\.[0-9]+)?/)?.[0] || '';
      pos += rest.length;
      return `<mn>${char}${rest}</mn>`;
    }
    if (/[\p{L}]/u.test(char)) return `<mi>${escape(char)}</mi>`;
    return `<mo>${escape(char === '-' ? '−' : char)}</mo>`;
  };
  const row = (end) => {
    const atoms = [];
    while (pos < tex.length) {
      whitespace();
      if (end && tex[pos] === end) { pos++; return `<mrow>${atoms.join('')}</mrow>`; }
      if (pos >= tex.length) break;
      let base = atom(), sub, sup;
      whitespace();
      while (tex[pos] === '_' || tex[pos] === '^') {
        const script = tex[pos++];
        if (script === '_') sub = atom(); else sup = atom();
        whitespace();
      }
      if (sub && sup) base = `<msubsup>${base}${sub}${sup}</msubsup>`;
      else if (sub) base = `<msub>${base}${sub}</msub>`;
      else if (sup) base = `<msup>${base}${sup}</msup>`;
      atoms.push(base);
    }
    if (end) throw new Error('Unclosed equation');
    return `<mrow>${atoms.join('')}</mrow>`;
  };
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics>${row()}<annotation encoding="application/x-tex">${escape(tex)}</annotation></semantics></math>`;
}

const markdown = new Marked({ gfm:true, breaks:false });
let mathCount = 0;
markdown.use({ extensions:[{
  name:'displayMath', level:'block',
  start(source) { return source.indexOf('$$'); },
  tokenizer(source) {
    const match = /^\$\$([\s\S]*?)\$\$(?:\n|$)/.exec(source);
    if (match) return { type:'displayMath', raw:match[0], text:match[1].trim() };
  },
  renderer(token) {
    mathCount++;
    return `<figure class="equation"><div class="equation-scroll">${mathML(token.text)}</div><details><summary>Ver notação original</summary><pre><code>${escape(token.text)}</code></pre></details></figure>`;
  }
}] });

await mkdir(join(output, 'originals'), { recursive:true });
const externalLinks = new Set();
for (const [index, doc] of documents.entries()) {
  const bytes = await readFile(join(root, doc.path));
  const source = bytes.toString('utf8');
  doc.file = doc.path.split('/').at(-1);
  doc.number = String(index + 1).padStart(2, '0');
  doc.words = source.split(/\s+/).filter(Boolean).length;
  doc.sha256 = createHash('sha256').update(bytes).digest('hex');
  doc.headings = [];
  const seen = new Map();
  doc.html = markdown.parse(source).replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_match, level, content) => {
    const base = `${doc.id}-${slug(content)}`;
    const count = (seen.get(base) || 0) + 1;
    seen.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    const depth = Math.min(Number(level) + 1, 6);
    if (Number(level) === 2) doc.headings.push({ id, content });
    return `<h${depth} id="${id}">${content}</h${depth}>`;
  }).replace(/<table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela com rolagem horizontal"><table>').replace(/<\/table>/g, '</table></div>');
  doc.html = doc.html.replace(/<a href="([^"]+)"([^>]*)>/g, (tag, href, rest) => {
    const decoded = href.replace(/&amp;/g, '&');
    if (decoded === 'QA-R9.md' || decoded === './QA-R9.md') return `<a href="#qa"${rest}>`;
    if (decoded === '../evidence/ui') return `<a href="./galeria.html"${rest}>`;
    if (/^https?:\/\//.test(decoded)) {
      const url = new URL(decoded);
      if (!url.hostname) throw new Error(`Invalid external link: ${decoded}`);
      externalLinks.add(url.href);
      return `<a href="${escape(url.href)}"${rest} target="_blank" rel="noopener noreferrer" class="external-link">`;
    }
    if (!/^(#|\.\/|\.\.\/|mailto:)/.test(decoded)) throw new Error(`Review unexpected link in ${doc.path}: ${decoded}`);
    return tag;
  });
  doc.html = doc.html.replace(/<td>([SF]\d{2})<\/td>/g, (_m, id) => `<td id="${doc.id}-source-${id.toLowerCase()}">${id}</td>`);
  doc.html = doc.html.replace(/\[([SF]\d{2})(?:[–-]([SF]\d{2}))?\]/g, (match, first) => {
    if (!doc.html.includes(`id="${doc.id}-source-${first.toLowerCase()}"`)) return match;
    return `<a class="source-reference" href="#${doc.id}-source-${first.toLowerCase()}">${match}</a>`;
  });
  await copyFile(join(root, doc.path), join(output, 'originals', doc.file));
}

const decision = 'Critério de sucesso preservado: 6/6 registros válidos entregues e nenhuma restrição de missão violada.';
const css = `
:root{color-scheme:dark;--bg:#0a0e14;--surface:#101620;--soft:#141c27;--line:#28323c;--text:#e7eceb;--muted:#a5b0b7;--accent:#d5f894;--link:#d5f894;--mono:ui-monospace,SFMono-Regular,Consolas,monospace}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:100px}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.75;font-size:16px}::selection{background:var(--accent);color:var(--bg)}a{color:var(--link);text-decoration-thickness:1px;text-underline-offset:4px}a:hover{color:#fff}button,a,summary{touch-action:manipulation}a:focus-visible,button:focus-visible,summary:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--accent);outline-offset:5px}button{font:inherit}.skip{position:absolute;left:20px;top:-100px;z-index:100;background:var(--accent);color:var(--bg);padding:12px 20px}.skip:focus{top:12px}.topbar{position:sticky;top:0;z-index:10;background:rgba(10,14,20,.97);border-bottom:1px solid var(--line)}.topbar-inner{max-width:1440px;margin:auto;padding:14px 36px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{color:var(--text);text-decoration:none;font-weight:750;letter-spacing:-.03em;font-size:20px;display:flex;align-items:center;gap:12px}.brand-logo{display:block;width:145px;height:68px;object-fit:contain}.top-actions{display:flex;gap:20px;align-items:center}.top-actions a,.print-button{font-size:13px;white-space:nowrap}.print-button{border:0;background:none;color:var(--muted);padding:8px 0;cursor:pointer}.reading-progress{position:absolute;bottom:-1px;left:0;height:2px;background:var(--accent);width:0;transition:width .15s linear}.shell{max-width:1440px;margin:auto;padding:0 36px}.hero{padding:72px 0 46px;border-bottom:1px solid var(--line)}.eyebrow{font-family:var(--mono);text-transform:uppercase;letter-spacing:.15em;font-size:11px;color:var(--accent);margin:0 0 24px;display:flex;align-items:center;gap:12px}.eyebrow::before{content:"";display:block;width:28px;height:1px;background:var(--accent)}h1{font-size:clamp(38px,5.2vw,72px);font-weight:650;line-height:1.06;letter-spacing:-.055em;margin:0 0 24px;max-width:900px}.hero-lead{font-size:19px;line-height:1.6;color:var(--muted);max-width:750px;margin:0}.hero-meta{display:flex;gap:26px;flex-wrap:wrap;margin-top:30px;font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.hero-meta strong{color:var(--text);font-weight:500}.layout{display:grid;grid-template-columns:244px minmax(0,1fr);gap:64px;padding:48px 0 100px}.sidebar{align-self:start;position:sticky;top:100px;max-height:calc(100vh - 125px);overflow-y:auto;padding:0 14px 10px 0}.nav-label{font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:var(--muted);text-transform:uppercase;margin:0 0 17px}.chapter-nav{list-style:none;padding:0;margin:0}.chapter-nav li{border-top:1px solid var(--line)}.chapter-nav li:last-child{border-bottom:1px solid var(--line)}.chapter-nav a{display:grid;grid-template-columns:22px 1fr;gap:12px;text-decoration:none;color:var(--muted);padding:15px 8px;line-height:1.4;border-left:2px solid transparent}.chapter-nav a:hover,.chapter-nav a[aria-current="location"]{color:var(--accent);border-left-color:var(--accent);background:linear-gradient(90deg,rgba(213,248,148,.06),transparent)}.chapter-nav .number{font-family:var(--mono);font-size:10px;padding-top:3px}.nav-title{font-size:13px;font-weight:650}.nav-subtitle{display:block;font-size:10px;font-weight:400;color:var(--muted);margin-top:5px}.sidebar-note{font-size:12px;line-height:1.65;color:var(--muted);margin:26px 8px 0}.sidebar-note a{display:block;margin-top:12px}.content{min-width:0}.decision-note{padding:22px 24px;background:rgba(213,248,148,.045);border:1px solid #3d4a32;border-left:3px solid var(--accent);border-radius:0 8px 8px 0;margin:0 0 52px}.decision-note .note-label{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:9px}.decision-note p{font-size:14px;line-height:1.65;margin:0}.decision-note p+p{margin-top:10px;color:var(--muted);font-size:12px}.document{scroll-margin-top:98px;padding-bottom:58px;margin-bottom:58px;border-bottom:1px solid var(--line)}.document:last-child{margin-bottom:0}.document-meta{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:18px;font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.document-meta .doc-number{font-size:12px;color:var(--accent);padding:5px 9px;border:1px solid var(--line);border-radius:4px}.download{margin-left:auto;text-transform:none;letter-spacing:0;font-size:11px}.source-path{font-family:var(--mono);font-size:10px;line-height:1.6;color:var(--muted);overflow-wrap:anywhere;margin:12px 0 24px}.document-outline{border:1px solid var(--line);border-radius:7px;margin:22px 0 32px;background:var(--surface)}.document-outline summary{cursor:pointer;padding:13px 17px;color:var(--muted);font-size:12px}.document-outline ul{columns:2;column-gap:36px;margin:0;padding:2px 26px 18px 37px}.document-outline li{break-inside:avoid;font-size:12px;line-height:1.6;margin-bottom:9px}.document-outline a{text-decoration:none;color:var(--muted)}.document-outline a:hover{color:var(--accent)}.research-notice{font-size:12px;line-height:1.65;padding:14px 18px;border:1px solid #534b31;background:#201e16;color:#d7cfb9;margin:0 0 28px;border-radius:6px}.prose>h2{font-size:clamp(28px,3vw,40px);font-weight:650;line-height:1.22;letter-spacing:-.035em;margin:0 0 24px;color:var(--text)}.prose h3{font-size:24px;letter-spacing:-.025em;line-height:1.35;font-weight:620;margin:48px 0 18px;padding-top:20px;border-top:1px solid var(--line);scroll-margin-top:95px}.prose h4{font-size:18px;line-height:1.45;font-weight:650;margin:28px 0 12px;scroll-margin-top:95px}.prose p{margin:16px 0;color:#cbd3d8;max-width:82ch}.prose strong{color:#edf2ef;font-weight:660}.prose em{color:var(--text)}.prose ul,.prose ol{padding-left:24px;color:#cbd3d8}.prose li{margin:9px 0;padding-left:4px}.prose li::marker{color:var(--accent)}.prose blockquote{margin:24px 0;padding:4px 22px;border-left:2px solid var(--accent);background:var(--surface)}.prose hr{border:0;border-top:1px solid var(--line);margin:32px 0}.prose a{overflow-wrap:anywhere}.external-link::after{content:" ↗";font-size:.75em;opacity:.65;white-space:nowrap}.prose :not(pre)>code{font-family:var(--mono);font-size:.82em;background:#1c2530;border:1px solid #2b3644;border-radius:4px;padding:2px 5px;color:#dce2d3;overflow-wrap:anywhere}.prose pre{font-family:var(--mono);font-size:12px;line-height:1.75;overflow:auto;padding:22px;background:#060a10;border:1px solid var(--line);border-radius:8px;color:#d7e4cd}.table-scroll{overflow-x:auto;max-width:100%;margin:26px 0 30px;border:1px solid var(--line);border-radius:7px;scroll-margin-top:95px}table{border-collapse:collapse;font-size:12px;line-height:1.65;width:100%;min-width:580px}th{font-weight:650;color:#e8f3df;background:#182128;text-align:left;padding:14px 16px;border-bottom:1px solid #39444b;vertical-align:top}td{padding:13px 16px;border-bottom:1px solid #25303a;vertical-align:top;color:#bdc8ce}tr:last-child td{border-bottom:0}tr:nth-child(even) td{background:rgba(255,255,255,.018)}td p,td ul{margin:0}td a{overflow-wrap:anywhere}td[id]{scroll-margin-top:100px}.source-reference{font-family:var(--mono);font-size:.82em;white-space:nowrap;text-decoration:none}.equation{margin:26px 0;padding:22px;background:var(--surface);border:1px solid var(--line);border-radius:7px}.equation-scroll{overflow-x:auto;padding:8px 0 14px}.equation math{font-size:1.2em;min-width:max-content;margin:auto;color:var(--text)}.equation details{border-top:1px solid var(--line);padding-top:10px}.equation summary{font-family:var(--mono);font-size:10px;color:var(--muted);cursor:pointer}.equation pre{font-size:11px;white-space:pre-wrap}.footer{border-top:1px solid var(--line);padding:26px 0 38px;display:flex;justify-content:space-between;gap:20px;font-size:12px;color:var(--muted)}.footer p{margin:0}.footer a{white-space:nowrap}noscript p{font-size:12px;color:var(--muted)}
@media(min-width:1400px){.layout{gap:86px}}
@media(max-width:1000px){.shell{padding:0 26px}.topbar-inner{padding:12px 26px}.layout{grid-template-columns:205px minmax(0,1fr);gap:34px}.hero{padding-top:56px}.document-outline ul{columns:1}}
@media(max-width:760px){.shell{padding:0 20px}.topbar-inner{padding:12px 20px}.brand{font-size:17px}.brand-logo{width:128px;height:60px}.top-actions{gap:14px}.top-actions a,.print-button{font-size:11px}.hero{padding:42px 0 32px}.hero-lead{font-size:16px}.hero-meta{gap:12px 20px;margin-top:22px;font-size:10px}.eyebrow{font-size:9px;letter-spacing:.12em;margin-bottom:22px}.layout{display:block;padding-top:30px}.sidebar{position:static;max-height:none;overflow:visible;padding:0 0 24px;margin-bottom:16px}.chapter-nav{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}.chapter-nav li:last-child{border-bottom:0}.chapter-nav a{padding:12px 4px;gap:7px}.nav-title{font-size:12px}.nav-subtitle{font-size:9px}.sidebar-note{display:none}.decision-note{padding:18px;margin:10px 0 42px}.decision-note p{font-size:13px}.document{padding-bottom:40px;margin-bottom:40px}.prose{font-size:15px}.prose>h2{font-size:29px}.prose h3{font-size:21px;margin-top:36px}.prose h4{font-size:17px}.document-meta{gap:10px}.download{font-size:10px}.source-path{font-size:9px}.equation{padding:14px}.equation math{font-size:1.05em}.footer{flex-direction:column}.print-button{display:none}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.reading-progress{transition:none}}
@media print{*{color:#142018!important;background:#fff!important;box-shadow:none!important}body{font-size:10pt}.topbar,.sidebar,.decision-note,.document-outline,.download,.skip,.footer,.equation details,.hero-meta{display:none}.shell{max-width:none;padding:0}.hero{padding:0 0 18px}.hero h1{font-size:27pt}.hero-lead{font-size:11pt}.layout{display:block;padding:20px 0}.document{break-before:page;margin:0;padding:0;border:0}.document:first-of-type{break-before:auto}.prose h2{font-size:22pt}.prose h3{font-size:16pt;break-after:avoid}.prose h4{break-after:avoid}a{text-decoration:underline}.external-link::after{content:""}.table-scroll{overflow:visible;border:1px solid #ccc}table{min-width:0;font-size:8pt}thead{display:table-header-group}tr{break-inside:avoid}.equation-scroll{overflow:visible}.prose pre{white-space:pre-wrap}th,td{padding:7px}.document-meta{margin-top:20px}}
`;

const toc = documents.map(doc => `<li><a href="#${doc.id}" data-chapter="${doc.id}"><span class="number">${doc.number}</span><span class="nav-title">${doc.label}<span class="nav-subtitle">${doc.tag}</span></span></a></li>`).join('');
const sections = documents.map(doc => `<section class="document" id="${doc.id}" aria-label="${escape(doc.label)}">
<div class="document-meta"><span class="doc-number">${doc.number}</span><span>${doc.tag}</span><a class="download" href="./originals/${doc.file}" download>Baixar original .md ↓</a></div>
<p class="source-path">${escape(doc.path)}</p>
<details class="document-outline"><summary>Sumário deste documento · ${doc.headings.length} seções</summary><ul>${doc.headings.map(h => `<li><a href="#${h.id}">${h.content}</a></li>`).join('')}</ul></details>
${doc.id === 'desafio' ? `<aside class="research-notice"><strong>Registro da pesquisa original.</strong> A hipótese de aceitar 4/6 mencionada neste parecer não foi adotada. O critério vigente é 6/6 registros válidos entregues e nenhuma restrição violada, conforme <a href="#decisoes">Pesquisa e decisões</a>.</aside>` : ''}
<div class="prose">${doc.html}</div></section>`).join('\n');
const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0a0e14"><meta name="description" content="Pesquisa, decisões, fontes científicas, roteiro didático e registro de QA da Missão Ipê, rodadas 9 e 10."><link rel="icon" type="image/svg+xml" href="../brand/missao-ipe-symbol.svg"><title>Pesquisa e decisões · Missão Ipê</title><style>${css}</style></head>
<body id="inicio"><a class="skip" href="#conteudo">Ir para o conteúdo</a>
<header class="topbar"><div class="topbar-inner"><a class="brand" href="../" aria-label="Missão Ipê — voltar ao jogo"><img class="brand-logo" src="../brand/missao-ipe-logo.svg" width="1064" height="499" alt="MISSÃO IPÊ"></a><div class="top-actions"><button class="print-button" type="button" id="print">Imprimir / salvar PDF</button><a href="../">Voltar à missão ↗</a></div></div><div class="reading-progress" aria-hidden="true"></div></header>
<div class="shell"><div class="hero"><p class="eyebrow">Caderno de pesquisa · Rodadas 09–10</p><h1>As decisões por trás<br>da missão.</h1><p class="hero-lead">Fontes, modelos e escolhas de projeto. A pesquisa completa que orienta o jogo, acompanhada do roteiro didático e das evidências de verificação.</p><div class="hero-meta"><span><strong>${String(documents.length).padStart(2, '0')}</strong> documentos integrais</span><span><strong>${externalLinks.size}</strong> referências externas</span><span>14 novembro 2026</span><span>Português · Brasil</span></div></div>
<div class="layout"><aside class="sidebar"><nav aria-label="Documentos da pesquisa"><p class="nav-label">Explorar o caderno</p><ol class="chapter-nav">${toc}</ol></nav><p class="sidebar-note">Os pareceres preservam o texto original. As decisões consolidadas distinguem propostas de comportamento entregue.<a href="#inicio">Voltar ao início ↑</a></p></aside>
<main class="content" id="conteudo"><aside class="decision-note"><span class="note-label">Decisão vigente da campanha</span><p><strong>${decision}</strong></p><p>A proposta exploratória de aceitar 4/6, presente no parecer A1, não foi adotada. Os documentos abaixo mantêm sua redação original e seus limites de evidência.</p></aside>${sections}<noscript><p>A leitura, os links e os sumários funcionam sem JavaScript. Para imprimir, use a função de impressão do navegador.</p></noscript></main></div>
<footer class="footer"><p>Missão Ipê · Ciência que chega<br>Pesquisa documental, decisões de produto e evidências com seus limites.</p><a href="../">Voltar ao jogo →</a></footer></div>
<script>
document.getElementById('print').addEventListener('click',()=>window.print());
const progress=document.querySelector('.reading-progress');
let scheduled=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,scrollY/max*100):0)+'%';scheduled=false}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress)}},{passive:true});
addEventListener('resize',updateProgress);updateProgress();
const chapters=[...document.querySelectorAll('.document')],links=[...document.querySelectorAll('[data-chapter]')];
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){links.forEach(link=>{if(link.dataset.chapter===entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}}},{rootMargin:'-12% 0px -70% 0px'});chapters.forEach(chapter=>observer.observe(chapter))}
</script></body></html>`;

await writeFile(join(output, 'index.html'), html);
await writeFile(join(output, 'manifest.json'), JSON.stringify({ version:1, sourceDate:'2026-11-14', generator:'scripts/build-research.mjs', documents:documents.map(({id,path,file,words,sha256})=>({id,source:path,original:`originals/${file}`,words,sha256})), externalLinks:[...externalLinks].sort(), equations:mathCount }, null, 2) + '\n');
console.log(`Research page: ${Buffer.byteLength(html)} bytes; ${documents.length} documents; ${externalLinks.size} external URLs; ${mathCount} equations.`);

await mkdir(join(output, 'assets'), { recursive:true });
const captures = [{name:'briefing-desktop.jpg', title:'Abertura em desktop · equivalente 2D'}, {name:'briefing-mobile.jpg', title:'Viewport de 390 × 844 px em iframe'}, {name:'laboratorio.jpg', title:'Bancadas de órbita e energia'}, {name:'retorno-cientifico.jpg', title:'Retorno científico · três pares entregues'}, {name:'retorno-mobile.jpg', title:'Tabela científica em viewport estreito · foco de teclado'}];
for (const capture of captures) await copyFile(join(root,'evidence/ui',capture.name),join(output,'assets',capture.name));
await writeFile(join(output,'galeria.html'), `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evidências visuais · Missão Ipê</title><style>${css}img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin:20px 0 50px}.gallery{max-width:1100px;margin:auto;padding:40px 24px}</style><main class="gallery"><a href="./index.html#qa-navegador">← Verificação no navegador</a><h1>Evidências visuais.</h1><p>Capturas da prévia em 14/11/2026. O modo observado foi o equivalente 2D. A vista estreita usa um iframe; não representa um aparelho físico.</p>${captures.map(c=>`<section><h2>${escape(c.title)}</h2><img src="./assets/${c.name}" alt="${escape(c.title)}" loading="lazy"></section>`).join('')}</main></html>`);
