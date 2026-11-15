#!/usr/bin/env node
/** Build the explicitly curated public static site. Never copies the repository root. */
import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decorateLibrasPage, librasAssets, librasGuide, librasScope } from './public-libras.mjs';
import { analyticsAsset, decorateAnalyticsPage, isAnalyticsPage } from './public-analytics.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await import('./build-context-hub.mjs');
await import('./build-research-library.mjs');
const output = resolve(root, 'site');
const stage = resolve(root, '.site-build-r6');
const allowIncomplete = process.argv.includes('--allow-incomplete');
if (process.argv.slice(2).some(arg => arg !== '--allow-incomplete')) throw new Error('Opção desconhecida. Use somente --allow-incomplete para preparação local.');
const now = new Date().toISOString();
const entries = [];
const omissions = [];
const docs = [];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = value => value.split(sep).join('/');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const knownData = ['cmr-mod13q1-granule-2.json', 'cmr-mod13q1-granules.json', 'mod13q1-A-raw.json', 'mod13q1-A-retrieval.json', 'mod13q1-B-raw.json', 'mod13q1-B-retrieval.json', 'mod13q1-C-raw.json', 'mod13q1-C-retrieval.json', 'mod13q1-bands.json', 'mod13q1-research-pack.json'];
const publicMarkdown = [
  { source: 'docs/78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md', target: 'docs/78-AUDITORIA-BRUNO-E-INTEGRACAO-R31.md', title: 'Auditoria completa Bruno · R31', description: 'Versão atual, áreas integradas, assets e limites da incorporação.' },
  { source: 'docs/79-GAME-DESIGN-E-SKILLS-R31.md', target: 'docs/79-GAME-DESIGN-E-SKILLS-R31.md', title: 'Escolhas claras no hangar · R31', description: 'Skills de game design, usabilidade, previsão, componentes e próximo passo.' },
  { source: 'docs/80-HANGAR-KENNEY-E-HANDOFF-R31.md', target: 'docs/80-HANGAR-KENNEY-E-HANDOFF-R31.md', title: 'Hangar Kenney e handoff · R31', description: 'Sete bancadas, referência CC0, marcos de progresso e validação móvel.' },
  { source: 'docs/76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md', target: 'docs/76-COCKPIT-SETE-MISSOES-E-HANDOFF-R30.md', title: 'Cockpit das sete missões · R30', description: 'Hangar, montagem, etapas pendentes, escolhas ligadas ao 3D e continuidade dos dois devs.' },
  { source: 'docs/77-ASSETS-3D-E-OPORTUNIDADES-R30.md', target: 'docs/77-ASSETS-3D-E-OPORTUNIDADES-R30.md', title: 'Assets 3D e oportunidades · R30', description: 'Pesquisa verificada de NASA, Kenney, Poly Haven e geração 3D: licença, peso mobile e prioridades.' },
  { source: 'docs/75-LOBBY-IMERSIVO-E-HANDOFF-R29.md', target: 'docs/75-LOBBY-IMERSIVO-E-HANDOFF-R29.md', title: 'Seleção imersiva e handoff · R29', description: 'Sete destinos, superfícies NASA, movimento acessível, compra em lote e continuidade dos dois devs.' },
  { source: 'docs/74-AUDITORIA-BRUNO-E-IMERSAO-R29.md', target: 'docs/74-AUDITORIA-BRUNO-E-IMERSAO-R29.md', title: 'Missões e assets do Bruno · R29', description: 'Revisão dos repositórios, correspondência das missões e diferenças integradas ao jogo.' },
  { source: 'docs/73-QA-MOVEL-E-HANDOFF-R28.md', target: 'docs/73-QA-MOVEL-E-HANDOFF-R28.md', title: 'QA móvel e handoff · R28', description: 'Primeira tentativa, rota de acesso, verificação das métricas e continuidade dos dois devs.' },
  { source: 'docs/71-INVENTARIO-EUROPA-E-HANDOFF-R27.md', target: 'docs/71-INVENTARIO-EUROPA-E-HANDOFF-R27.md', title: 'Loja, inventário e Europa · handoff R27', description: 'Sete missões, montagem 3D, desgaste, métricas autoritativas e continuidade dos dois devs.' },
  { source: 'docs/72-DOMINIOS-E-ACESSOS-R27.md', target: 'docs/72-DOMINIOS-E-ACESSOS-R27.md', title: 'Links e subdomínios · R27', description: 'Jogo, pitch, painel privado, documentação e LP no domínio da equipe.' },
  { source: 'docs/63-RIVE-E-HANDOFF-R24.md', target: 'docs/63-RIVE-E-HANDOFF-R24.md', title: 'Animação e bancada · handoff R24', description: 'Contrato Rive, escolhas ligadas à nave, acessibilidade e validação para os dois devs.' },
  { source: 'docs/64-DESIGN-ACESSIVEL-R24.md', target: 'docs/64-DESIGN-ACESSIVEL-R24.md', title: 'Design acessível · R24', description: 'Identidade oficial, hierarquia comum, navegação e critérios de revisão das páginas.' },
  { source: 'docs/70-HANDOFF-GAME-R26.md', target: 'docs/70-HANDOFF-GAME-R26.md', title: 'Game e integração · handoff R26', description: 'Retomada, comparação A/B ligada ao 3D, operação, métricas e divisão entre os dois devs.' },
  { source: 'docs/67-AUDITORIA-BRUNO-FASTMODE-R26.md', target: 'docs/67-AUDITORIA-BRUNO-FASTMODE-R26.md', title: 'Bruno e Fastmode · auditoria R26', description: 'Origem, comparação de recursos e escopo da integração do app de Bruno.' },
  { source: 'docs/68-AUDIO-ANIMACAO-E-SKILLS-R26.md', target: 'docs/68-AUDIO-ANIMACAO-E-SKILLS-R26.md', title: 'Áudio e animação · R26', description: 'Earshot, ManimGX, skills de game design e decisões para o navegador.' },
  { source: 'docs/69-RIVE-MISSOES-R26.md', target: 'docs/69-RIVE-MISSOES-R26.md', title: 'Rive e eventos · R26', description: 'Artboard, contrato de estados e animação ligada à execução das missões.' },
  { source: 'docs/65-GAME-E-MISSOES-BRUNO-R25.md', target: 'docs/65-GAME-E-MISSOES-BRUNO-R25.md', title: 'Seis missões · handoff R25', description: 'Start, hangar 3D, simulação, pontuação e métricas das missões de Bruno.' },
  { source: 'docs/66-PIPELINE-ASSETS-3D-R25.md', target: 'docs/66-PIPELINE-ASSETS-3D-R25.md', title: 'Assets NASA e DCC · R25', description: 'Modelos oficiais, origem, licença e limites verificados do pipeline DCC.' },
  { source: 'docs/61-BANCADA-COMPARACAO-E-LIBRAS-R23.md', target: 'docs/61-BANCADA-COMPARACAO-E-LIBRAS-R23.md', title: 'Bancada, comparação e Libras · R23', description: 'Ensaios das três missões, responsabilidades dos dois devs e verificação da experiência.' },
  { source: 'docs/62-DOMINIO-E-CLOUDFLARE-R23.md', target: 'docs/62-DOMINIO-E-CLOUDFLARE-R23.md', title: 'Domínio e Web Analytics · R23', description: 'Configuração verificada do endereço oficial, alcance das métricas públicas e aceite em produção.' },
  { source: 'docs/60-OPORTUNIDADES-ACERVO-ASTRAL.md', target: 'docs/60-OPORTUNIDADES-ACERVO-ASTRAL.md', title: 'Acervo ASTRAL · oportunidades de assets', description: 'O que já está no Git, interfaces aproveitáveis, modelos NASA e próximos passos para os dois devs.' },
  { source: 'docs/59-MARCA-OFICIAL-E-DEPLOY.md', target: 'docs/59-MARCA-OFICIAL-E-DEPLOY.md', title: 'Marca oficial e publicação', description: 'Aplicação dos SVGs, diagnóstico de deploy e continuidade para os dois desenvolvedores.' },
  { source: 'docs/58-CATALOGO-NASA-E-INTEGRACAO-BRUNO-R22.md', target: 'docs/58-CATALOGO-NASA-E-INTEGRACAO-BRUNO-R22.md', title: 'Catálogo NASA · preparação da integração Bruno', description: 'Fontes verificadas para 18 equipamentos e limites da futura expansão para ISS, Lua e Marte.' },
  { source: 'docs/57-KIT-PRE-BANCA-R21.md', target: 'docs/57-KIT-PRE-BANCA-R21.md', title: 'Kit pré-banca · R21', description: 'Checklist, suíte executável, roteiro de demonstração e evidências para a banca.' },
  { source: 'docs/56-ACESSIBILIDADE-E-LIBRAS-R21.md', target: 'docs/56-ACESSIBILIDADE-E-LIBRAS-R21.md', title: 'Acessibilidade e Libras · R21', description: 'Como usar o VLibras, onde a tradução está disponível e como a sessão privada é protegida.' },
  { source: 'docs/53-PITCH-JURADOS-E-FALA-R21.md', target: 'docs/53-PITCH-JURADOS-E-FALA-R21.md', title: 'Pitch para jurados · fala de 3 minutos', description: 'Aprendizado por missão, decisões visíveis e fala de Alexandre Belo.' },
  { source: 'docs/55-PAINEL-E-ACESSOS-R21.md', target: 'docs/55-PAINEL-E-ACESSOS-R21.md', title: 'Central de acessos da equipe · R21', description: 'Jogo, pitch, fala, documentação, fontes e painel privado em um só lugar.' },
  { source: 'docs/54-METRICAS-E-HANDOFF-R21.md', target: 'docs/54-METRICAS-E-HANDOFF-R21.md', title: 'Comece aqui · métricas e handoff R21', description: 'Entrada simples, painel privado, dicionário de métricas, limites e operação para dois devs.' },
  { source: 'docs/51-QA-INICIANTE-E-HANDOFF-R20.md', target: 'docs/51-QA-INICIANTE-E-HANDOFF-R20.md', title: 'Comece aqui · percurso iniciante R20', description: 'Confusões corrigidas, escolhas ligadas ao 3D, aprendizagem nas três missões e continuidade para dois devs.' },
  { source: 'docs/52-PITCH-ALEXANDRE-BELO-R20.md', target: 'docs/52-PITCH-ALEXANDRE-BELO-R20.md', title: 'Pitch interativo · Alexandre Belo', description: 'Roteiro, apresentação imersiva, movimento, créditos e instruções para apresentar.' },
  { source: 'docs/50-LP-E-404-R19.md', target: 'docs/50-LP-E-404-R19.md', title: 'LP imersiva e rota 404 · R19', description: 'Referência visual, recuperação de navegação, movimento acessível e continuidade para dois devs.' },
  { source: 'docs/48-HANDOFF-DOIS-DEVS-R19.md', target: 'docs/48-HANDOFF-DOIS-DEVS-R19.md', title: 'Comece aqui · handoff R19', description: 'Trilha da evidência, comparação explicada, quatro papéis e imersão 3D nas três missões.' },
  { source: 'docs/49-ROTEIRO-APRESENTACAO-MVP-R19.md', target: 'docs/49-ROTEIRO-APRESENTACAO-MVP-R19.md', title: 'Apresente o MVP · roteiro de 6 minutos', description: 'Percurso demonstrável, decisões e aprendizagem em cada caso científico.' },
  { source: 'docs/47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.md', target: 'docs/47-OPORTUNIDADES-NASA-PARA-DOIS-DEVS-R18.md', title: 'Pesquisa NASA · origem das prioridades R19', description: 'Pesquisa Sol 6.1 max: recursos verificados, quatro segmentos e prioridades viáveis para dois devs.' },
  { source: 'docs/45-DADOS-REAIS-BENNU-WEBB-R18.md', target: 'docs/45-DADOS-REAIS-BENNU-WEBB-R18.md', title: 'Bennu e Webb · dados científicos reais', description: 'Fontes, unidades, incertezas e a ligação entre decisões, arquivos e 3D.' },
  { source: 'docs/46-HANDOFF-DOIS-DEVS-R18.md', target: 'docs/46-HANDOFF-DOIS-DEVS-R18.md', title: 'Handoff R18 · dados científicos', description: 'Divisão dos dois devs, contratos e validação dos dados reais.' },
  { source: 'research/motion-opportunities-r18.md', target: 'docs/MOTION-OPORTUNIDADES-R18.md', title: 'Movimento a serviço da evidência', description: 'Análise Cosmic Mapping e aplicação original no jogo.' },
  { source: 'docs/40-IDENTIDADE-MISSAO-IPE-R17.md', target: 'docs/40-IDENTIDADE-MISSAO-IPE-R17.md', title: 'Marca oficial · MISSÃO IPÊ', description: 'SVG transparente, procedência, contraste e aplicação.' },
  { source: 'docs/41-CONSOLIDACAO-REPOSITORIOS-R17.md', target: 'docs/41-CONSOLIDACAO-REPOSITORIOS-R17.md', title: 'Contribuições e repositório oficial', description: 'Origem do trabalho do Bruno, importação revisada e oportunidades.' },
  { source: 'docs/42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.md', target: 'docs/42-PRONTIDAO-E-CRITERIOS-SPACE-APPS-R17.md', title: 'Estamos prontos?', description: 'Evidências, lacunas e critérios documentados do desafio.' },
  { source: 'docs/43-HANDOFF-GERAL-R17.md', target: 'docs/43-HANDOFF-GERAL-R17.md', title: 'Comece aqui · handoff dos dois devs', description: 'Mapa do produto, responsabilidades, publicação e aceite.' },
  { source: 'docs/44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md', target: 'docs/44-HISTORIAS-REAIS-E-LIMITES-DIDATICOS.md', title: 'Três histórias reais NASA', description: 'Fatos, fontes e diferenças entre missões reais e exercícios.' },
  { source: 'docs/39-ATIVOS-DA-PR-E-APLICACOES.md', target: 'docs/39-ATIVOS-DA-PR-E-APLICACOES.md', title: 'Assets da contribuição · aplicações', description: 'Inventário, procedência, custos e aplicação dos recursos visuais nas três missões.' },
  { source: 'docs/35-REVISAO-PRS-E-DIRECAO-R16.md', target: 'docs/35-REVISAO-PRS-E-DIRECAO-R16.md', title: 'Revisão das PRs e direção · R16', description: 'Contribuições revisadas, estado do projeto e prioridades para tornar o aprendizado explícito.' },
  { source: 'docs/36-PORTAL-PLANET-JUMPING.md', target: 'docs/36-PORTAL-PLANET-JUMPING.md', title: 'Planet Jumping · experimento visual', description: 'Portal cinematográfico independente, mídias externas, acessibilidade, recuperação e limites.' },
  { source: 'docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md', target: 'docs/37-PROPOSTA-PEDAGOGICA-E-TECNOLOGIAS-R16.md', title: 'Propósito e descobertas · R16', description: 'O que cada missão ensina, consequências das escolhas e oportunidades tecnológicas avaliadas.' },
  { source: 'docs/38-HANDOFF-R16.md', target: 'docs/38-HANDOFF-R16.md', title: 'Continuidade para dois devs · R16', description: 'Integração, contratos, evidências e próximos passos da experiência educativa.' },
  { source: 'docs/32-GUIA-DIDATICO-MISSOES-3D.md', target: 'docs/32-GUIA-DIDATICO-MISSOES-3D.md', title: 'Aprenda com o MISSÃO IPÊ', description: 'Guia completo: histórias, escolhas, conceitos, experimentos e roteiros de aula para as três missões.' },
  { source: 'docs/33-OPORTUNIDADES-NASA-SCIENCE.md', target: 'docs/33-OPORTUNIDADES-NASA-SCIENCE.md', title: 'Oportunidades NASA Science', description: 'Oito recursos oficiais, aplicações didáticas, limites e sequência recomendada de integração.' },
  { source: 'docs/34-HANDOFF-IMERSAO-3D-R15.md', target: 'docs/34-HANDOFF-IMERSAO-3D-R15.md', title: 'Dois devs · montagem 3D R15', description: 'Estado atual, contratos de apresentação, vínculo com o motor, mapa do código e critérios de continuidade.' },
  { source: 'docs/32-CAMPANHA-QUATRO-NIVEIS.md', target: 'docs/32-CAMPANHA-QUATRO-NIVEIS.md', title: 'Campanha didática · quatro níveis', description: 'Progressão jogável, PRD, PRT, Mermaid, schema, pesquisa, pitch e handoff próprios.' },
  { source: 'docs/31-TRES-MISSOES-CIENTIFICAS-R14.md', target: 'docs/31-TRES-MISSOES-CIENTIFICAS-R14.md', title: 'Três missões científicas · R14', description: 'Jornadas jogáveis, quatro segmentos, replay 3D, contratos e continuidade para dois devs.' },
  { source: 'docs/30-ATIVOS-NASA-IMPLEMENTADOS.md', target: 'docs/30-ATIVOS-NASA-IMPLEMENTADOS.md', title: 'Modelos NASA implementados', description: 'Quatro modelos locais, procedência, otimização, carregamento e limites científicos.' },
  { source: 'docs/29-GAME-DESIGN-3D.md', target: 'docs/29-GAME-DESIGN-3D.md', title: 'Game Design · missão em 3D', description: 'Proposta de experiência, quatro segmentos, revisão causal, cinco cenas e entregas para dois desenvolvedores.' },
  { source: 'docs/28-OPORTUNIDADES-NASA-3D.md', target: 'docs/28-OPORTUNIDADES-NASA-3D.md', title: 'Oportunidades NASA 3D', description: 'Modelos oficiais selecionados, formatos, créditos, peso e limites técnicos de integração.' },
  { source: 'docs/27-ACERVO-VISUAL-NASA.md', target: 'docs/27-ACERVO-VISUAL-NASA.md', title: 'Acervo visual NASA', description: 'Imagens oficiais, créditos, contexto e limites das ilustrações interativas.' },
  { source: 'docs/25-HANDOFF-DOIS-DEVS.md', target: 'docs/25-HANDOFF-DOIS-DEVS.md', title: 'Comece aqui · dois desenvolvedores', description: 'Estado comprovado, mapa do código, responsabilidades, sequência de trabalho e critérios de aceite.' },
  { source: 'docs/24-OPORTUNIDADES-ESTUDOS.md', target: 'docs/24-OPORTUNIDADES-ESTUDOS.md', title: 'Oportunidades dos Estudos', description: 'O que aproveitar de outros jogos educativos e como validar cada proposta no Ipê.' },
  { source: 'docs/23-IDENTIDADE-VISUAL.md', target: 'docs/23-IDENTIDADE-VISUAL.md', title: 'Marca e arquivos SVG', description: 'Origem da identidade, aplicação vetorial, paleta e arquivos editáveis.' },
  { source: 'docs/26-TIPOGRAFIA.md', target: 'docs/26-TIPOGRAFIA.md', title: 'Tipografia e leitura', description: 'Comparação das cinco famílias sugeridas, fontes locais, licenças e critérios de aplicação.' },
  { source: 'docs/21-OPORTUNIDADES-NASA.md', target: 'docs/21-OPORTUNIDADES-NASA.md', title: 'APIs e oportunidades NASA', description: 'Pesquisa oficial, correções, prioridades e limites das futuras integrações.' },
  { source: 'docs/22-PLANO-CONTINUIDADE.md', target: 'docs/22-PLANO-CONTINUIDADE.md', title: 'Etapas da MISSÃO IPÊ', description: 'Estado atual, quatro níveis narrativos, próximos passos e critérios de aceite.' },
  { source: 'web/public-docs/ESTADO-PUBLICO.md', target: 'docs/ESTADO-PUBLICO.md', title: 'Estado público da BETA', description: 'Escopo, cronologia, elegibilidade e limites de uso.' },
  { source: 'web/public-docs/COMO-USAR.md', target: 'docs/COMO-USAR.md', title: 'Como usar', description: 'Jogo, apresentação, arquitetura e alternativa local.' },
  { source: 'web/public-docs/ORIGEM-DOS-DADOS.md', target: 'docs/ORIGEM-DOS-DADOS.md', title: 'Origem dos dados', description: 'MOD13Q1.061, arquivos de 2024 e hipóteses didáticas.' },
  { source: 'web/public-docs/09-VERIFICACAO.md', target: 'docs/09-VERIFICACAO.md', title: 'Verificação pública', description: 'Testes, catálogo, benchmark e alcance das evidências.' },
  { source: 'web/public-docs/AUTORIA-E-IA.md', target: 'docs/AUTORIA-E-IA.md', title: 'Autoria e assistência de IA', description: 'Código, ilustrações, dados observacionais e atribuições.' },
  { source: 'docs/13-ARQUITETURA-ARCHIFY.md', target: 'docs/13-ARQUITETURA-ARCHIFY.md', title: 'Arquitetura e Archify', description: 'Leitura do mapa de componentes e relações implementadas.' },
  { source: 'docs/14-BETA-DEPLOY.md', target: 'docs/14-BETA-DEPLOY.md', title: 'BETA e publicação estática', description: 'Contrato de rotas, montagem e curadoria do site.' },
  { source: 'docs/15-PLANO-RELEASE-20261115-0800.md', target: 'docs/15-PLANO-RELEASE.md', title: 'Plano de release', description: 'Meta de 15/11/2026 às 08h BRT e critérios de aceite.' },
  { source: 'docs/16-OPORTUNIDADES-BETA.md', target: 'docs/16-OPORTUNIDADES-BETA.md', title: 'Oportunidades', description: 'Evoluções priorizadas, sem confundir propostas com implementação.' },
  { source: 'docs/18-CONTEXTO-COMPLETO.md', target: 'docs/18-CONTEXTO-COMPLETO.md', title: 'Contexto completo e escolha do tema', description: 'Trajetória, oito desafios, pesquisa mundial, decisões e razões para o Jogo de Missão.' },
  { source: 'docs/19-REVISAO-EVIDENCIAS-R8.md', target: 'docs/19-REVISAO-EVIDENCIAS-R8.md', title: 'Revisão de evidências · R8', description: 'Fontes oficiais revisitadas e limites das alegações de competição, modelos e tecnologia.' },
  { source: 'docs/20-CENTRAL-CONTEXTO-CRONOGRAMA.md', target: 'docs/20-CENTRAL-CONTEXTO-CRONOGRAMA.md', title: 'Central interativa e cronograma', description: 'Como explorar o contexto, filtrar o plano e manter marcações pessoais locais.' },
];

function safePath(base, name) {
  const target = resolve(base, name);
  if (target === base || !target.startsWith(base + sep)) throw new Error(`Caminho fora do destino permitido: ${name}`);
  return target;
}
async function exists(name) {
  try { const info = await lstat(safePath(root, name)); if (info.isSymbolicLink()) throw new Error(`Link simbólico não permitido na publicação: ${name}`); return info.isFile(); }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
async function emit(target, bytes, metadata) {
  const path = safePath(stage, target);
  if (entries.some(entry => entry.path === target)) throw new Error(`Destino duplicado: ${target}`);
  const scope = librasScope(target);
  if (scope) {
    bytes = decorateLibrasPage(bytes.toString(), target);
    const base = metadata.transformation === 'none; bytes preserved' ? '' : metadata.transformation + '; ';
    metadata = { ...metadata, libras: scope, transformation: `${base}local Libras launcher and frame permissions in the public HTML copy` };
  }
  if (isAnalyticsPage(target)) {
    bytes = decorateAnalyticsPage(bytes.toString(), target);
    const base = metadata.transformation === 'none; bytes preserved' ? '' : metadata.transformation + '; ';
    metadata = { ...metadata, analytics: 'custom-host-only; page performance; no private routes', transformation: `${base}local hostname-gated analytics loader` };
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
  entries.push({ path: target, bytes: Buffer.byteLength(bytes), sha256: digest(bytes), ...metadata });
}
async function copy(source, target = source, category = 'preserved-artifact', required = true) {
  if (!(await exists(source))) {
    if (required && !allowIncomplete) throw new Error(`Entrada obrigatória ausente: ${source}`);
    omissions.push({ path: source, required });
    return false;
  }
  const bytes = await readFile(safePath(root, source));
  await emit(target, bytes, { category, source, sourceSha256: digest(bytes), transformation: 'none; bytes preserved' });
  return true;
}
async function project(source, target, select) {
  const bytes = await readFile(safePath(root, source));
  const original = JSON.parse(bytes);
  const publicObject = {
    publication: { edition: 'R6-public-projection', originalSource: source, originalSha256: digest(bytes), note: 'Selected fields for public inspection. This projection is not the complete internal receipt.' },
    ...select(original),
  };
  await emit(target, JSON.stringify(publicObject, null, 2) + '\n', { category: 'public-evidence-projection', source, sourceSha256: digest(bytes), transformation: 'explicit field allowlist; original source unchanged' });
}
async function tree(directory) {
  const output = [];
  for (const item of await readdir(safePath(root, directory), { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Error(`Link simbólico não permitido: ${directory}/${item.name}`);
    const name = `${directory}/${item.name}`;
    if (item.isDirectory()) output.push(...await tree(name));
    else if (item.isFile()) output.push(name);
  }
  return output.sort();
}
function inline(value) {
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let result = '', cursor = 0, match;
  while ((match = pattern.exec(value))) {
    result += escape(value.slice(cursor, match.index));
    if (match[1]) {
      const href = match[2];
      if (/^(?:https?:\/\/|[./#]|[\w-])/.test(href) && !/^(?:javascript|data|vbscript):/i.test(href)) {
        result += `<a href="${escape(href)}"${/^https?:\/\//.test(href) ? ' target="_blank" rel="noopener"' : ''}>${escape(match[1])}</a>`;
      } else result += escape(match[1]);
    } else if (match[3]) result += `<code>${escape(match[3])}</code>`;
    else result += `<strong>${escape(match[4])}</strong>`;
    cursor = match.index + match[0].length;
  }
  return result + escape(value.slice(cursor));
}
function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const boundary = line => !line.trim() || /^(?:#{1,6}\s|```|[-*]\s|\d+\.\s|>\s|\|)/.test(line);
  const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim(); const code = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      if (i < lines.length) i++;
      out.push(`<pre><code${language ? ` data-language="${escape(language)}"` : ''}>${escape(code.join('\n'))}</code></pre>`); continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { const level = heading[1].length; out.push(`<h${level}>${inline(heading[2])}</h${level}>`); i++; continue; }
    if (line.startsWith('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      const headers = cells(line); i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(cells(lines[i++]));
      out.push(`<div class="table-wrap"><table><thead><tr>${headers.map(cell => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    if (/^[-*]\s|^\d+\.\s/.test(line)) {
      const ordered = /^\d+\./.test(line); const tag = ordered ? 'ol' : 'ul'; const items = [];
      const pattern = ordered ? /^\d+\.\s/ : /^[-*]\s/;
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, ''));
      out.push(`<${tag}>${items.map(item => `<li>${inline(item)}</li>`).join('')}</${tag}>`); continue;
    }
    if (/^>\s/.test(line)) { out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); i++; continue; }
    const paragraph = [line]; i++;
    while (i < lines.length && !boundary(lines[i])) paragraph.push(lines[i++]);
    out.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return out.join('\n');
}
function page(title, content, { source, index = false } = {}) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="author" content="AB / Hackatur–Zer0Slop, com assistência de IA"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; font-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'"><title>${escape(title)} · MISSÃO IPÊ</title><link rel="icon" type="image/svg+xml" href="../brand/missao-ipe-symbol.svg"><link rel="stylesheet" href="../fonts/fonts.css"><link rel="stylesheet" href="../site.css"><link rel="stylesheet" href="../documentation.css"></head><body class="ipe-surface"><a class="ipe-skip" href="#content">Ir ao conteúdo</a><header class="ipe-site-header"><a class="ipe-brand" href="../" aria-label="MISSÃO IPÊ, início"><img src="../brand/missao-ipe-logo-on-light.svg" width="1064" height="499" alt="MISSÃO IPÊ"></a><nav class="ipe-site-nav" aria-label="Navegação principal"><a href="../lab/index.html">Jogar</a><a href="https://missao-ipe-central-ab.alexandrebelo.chatgpt.site/">Pitch</a><a href="../docs/index.html" aria-current="${index ? 'page' : 'true'}">Documentação</a><a href="../equipe/index.html">Equipe</a></nav></header><main id="content" tabindex="-1"${index ? '' : ' class="document"'}>${content}${source ? `<p class="provenance">Documento público. <a href="${escape(source)}">Ler o Markdown desta edição</a>. Estado e curadoria no <a href="../publication-manifest.json">manifesto da publicação</a>.</p>` : ''}</main><footer><span>MISSÃO IPÊ · Protótipo de pesquisa. Evidências históricas conservam seu corte original.</span><div class="links"><a href="../">Voltar ao portal</a><a href="../docs/AUTORIA-E-IA.html">Autoria e IA</a></div></footer></body></html>`;
}
async function addMarkdown(entry, { index = true, category = 'public-document' } = {}) {
  if (!(await copy(entry.source, entry.target, category))) return;
  const raw = await readFile(safePath(root, entry.source), 'utf8');
  const target = entry.target.replace(/\.md$/, '.html');
  const superseded = /docs\/(?:22-|25-|29-|31-|32-|34-|35-|37-|38-|42-|43-|44-)/.test(entry.source);
  const historyNote = superseded ? '<p class="historical"><strong>Registro de uma edição anterior.</strong> A direção atual usa histórias reais NASA e IPÊ somente como nome da equipe. Consulte o <a href="46-HANDOFF-DOIS-DEVS-R18.html">handoff R18</a> e os <a href="45-DADOS-REAIS-BENNU-WEBB-R18.html">dados reais e fontes atuais</a>. Propostas e estados abaixo conservam o corte original.</p>' : '';
  const html = page(entry.title, historyNote + renderMarkdown(raw), { source: entry.target.split('/').pop() });
  await emit(target, html, { category: 'rendered-public-document', source: entry.source, sourceSha256: digest(raw), transformation: 'escaped static HTML rendering of selected Markdown' });
  if (index) docs.push({ ...entry, html: target });
}

// Staging only: a failed build leaves an existing site intact.
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
try {
  await copy('web/index.html', 'index.html', 'public-portal');
  await copy(`web/${analyticsAsset}`, analyticsAsset, 'public-page-analytics');
  for (const name of librasAssets) {
    await copy(`apps/immersive-lp/public/acessibilidade/${name}`, `acessibilidade/${name}`, 'libras-integration');
  }
  for (const extension of ['html', 'css', 'js']) await copy(`web/game-design.${extension}`, `game-design.${extension}`, 'interactive-game-design-study');
  await copy('web/planet-jumping.html', 'planet-jumping.html', 'standalone-remote-media-experiment');
  await copy('research/technology-opportunities-r16.json', 'research/technology-opportunities-r16.json', 'reviewed-technology-opportunities');
  await copy('research/nasa-opportunities-r18.json', 'research/nasa-opportunities-r18.json', 'research-proposals-r18');
  await copy('research/nasa-equipment-r22.json', 'research/nasa-equipment-r22.json', 'research-proposals-r22');
  for (const name of ['bruno-consolidation-r17', 'readiness-r17', 'nasa-mission-stories-r17']) await copy(`research/${name}.json`, `research/${name}.json`, 'reviewed-r17-evidence');
  await copy('research/pr-assets-r16.json', 'research/pr-assets-r16.json', 'reviewed-pr-asset-inventory');
  await copy('research/nasa-science-opportunities.json', 'research/nasa-science-opportunities.json', 'official-nasa-science-opportunities');
  await copy('research/nasa-3d-catalog.json', 'research/nasa-3d-catalog.json', 'official-3d-resource-catalog');
  await copy('apps/immersive-lp/public/site.css', 'site.css', 'shared-site-style');
  await copy('web/documentation.css', 'documentation.css', 'documentation-style');
  for (const name of ['projeto-ipe-symbol.svg', 'projeto-ipe-logo.svg', 'projeto-ipe-logo-on-light.svg', 'projeto-ipe-logo.png', 'missao-ipe-logo.svg', 'missao-ipe-logo-on-light.svg', 'missao-ipe-symbol.svg', 'missao-ipe-symbol-on-light.svg', 'missao-ipe-logo.png', 'brand-provenance-r17.json', 'preview-r17.html', 'missao-ipe-logo-stacked.svg', 'brand-provenance-r22.json', 'preview-r22.html', 'originals/missao-ipe-frame-11-original.svg', 'originals/missao-ipe-logo-original.svg', 'originals/missao-ipe-symbol-original.svg']) {
    await copy(`experiments/mission-design-lab/public/brand/${name}`, `brand/${name}`, 'project-brand');
  }
  await copy('web/mission-visuals.css', 'mission-visuals.css', 'interactive-visual-style');
  const visualSource = await readFile(safePath(root, 'web/mission-visuals.js'), 'utf8');
  const mediaSource = await readFile(safePath(root, 'web/media/manifest.json'), 'utf8');
  const media = JSON.parse(mediaSource);
  if (visualSource.split('__IPE_NASA_MEDIA__').length !== 2 || !Array.isArray(media.images)) throw new Error('Contrato do acervo visual inválido.');
  await emit('mission-visuals.js', visualSource.replace('__IPE_NASA_MEDIA__', JSON.stringify(media)), { category: 'interactive-visual-runtime', source: 'web/mission-visuals.js', sourceSha256: digest(visualSource), dataSource: 'web/media/manifest.json', dataSha256: digest(mediaSource), transformation: 'local image metadata embedded at build time; no remote runtime dependency' });
  for (const source of await tree('web/media')) {
    if (/\.(?:jpg|jpeg|png|webp|json|txt|md)$/.test(source)) await copy(source, source.replace('web/', ''), 'official-visual-source');
  }
  for (const source of await tree('experiments/mission-design-lab/public/fonts')) {
    await copy(source, source.replace('experiments/mission-design-lab/public/', ''), 'local-font-and-license');
  }
  for (const source of await tree('references/estudos')) {
    if (source.endsWith('.md')) await copy(source, source, 'historical-study-reference');
  }
  for (const source of await tree('experiments/mission-design-lab/dist')) {
    const rel = source.slice('experiments/mission-design-lab/dist/'.length);
    if (/\.(?:html|js|css|json|md|txt|png|jpg|jpeg|webp|svg|woff2|glb|wasm|riv|hdr)$/.test(rel) || ['data/science/bennu-table1.csv', 'data/science/webb-firefly-nasa.tbl'].includes(rel)) {
      await copy(source, `lab/${rel}`, 'mission-lab-runtime');
    }
  }
  if (!entries.some(entry => entry.path === 'lab/index.html')) throw new Error('Compile o beta com npm --prefix experiments/mission-design-lab run build.');
  for (const source of await tree('experiments/four-level-campaign/dist')) {
    const rel = source.slice('experiments/four-level-campaign/dist/'.length);
    if (/\.(?:html|js|css|json|md|txt|png|jpg|jpeg|webp|svg|prisma|mmd|pptx)$/.test(rel)) {
      await copy(source, `campanha/${rel}`, 'four-level-campaign-runtime');
    }
  }
  if (!entries.some(entry => entry.path === 'campanha/index.html')) throw new Error('Compile a campanha de quatro níveis antes da distribuição.');
  // Only the current runtime asset classes are admitted. Source maps remain outside the public site.
  for (const source of await tree('dist')) {
    const rel = source.slice('dist/'.length);
    if (rel === 'index.html' || /^assets\/[^/]+\.(?:js|css)$/.test(rel) || (rel.startsWith('data/') && knownData.includes(rel.slice(5)))) {
      await copy(source, `game/${rel}`, 'game-runtime');
    }
  }
  if (!entries.some(entry => entry.path === 'game/index.html')) throw new Error('dist/index.html ausente.');
  if (!entries.some(entry => /game\/assets\/mission\.worker-[^/]+\.js$/.test(entry.path))) throw new Error('Worker compilado ausente.');
  await copy('portable/Missao_Ipe_Local.html', 'portable/Missao_Ipe_Local.html', 'portable-game');
  await copy('presentation/Missao_Ipe_Apresentacao.html', 'presentation/Missao_Ipe_Apresentacao.html', 'presentation-runtime');
  for (const source of await tree('presentation/pitch')) {
    const name = source.split('/').pop();
    if (/\.(?:html|js|css|json|svg|png|jpg|jpeg|webp|woff2)$/.test(name) || /^(?:LICENSE|NOTICE)(?:[-.].*)?$/.test(name)) {
      await copy(source, source, 'interactive-pitch-runtime');
    }
  }
  if (!entries.some(entry => entry.path === 'presentation/pitch/index.html')) throw new Error('Apresentação interativa ausente.');
  await copy('equipe/index.html', 'equipe/index.html', 'team-access-hub');
  for (const source of await tree('dashboard')) {
    if (!['.html', '.css', '.js', '.mjs'].includes(extname(source))) throw new Error(`Arquivo inesperado no painel: ${source}`);
    await copy(source, source, 'private-dashboard-shell');
  }
  for (const name of ['README_APRESENTADOR', 'ROTEIRO_PT_EN', 'PITCH_EN_7_SLIDES']) {
    await addMarkdown({ source: `presentation/${name}.md`, target: `presentation/${name}.md`, title: name === 'README_APRESENTADOR' ? 'Guia do apresentador' : name === 'ROTEIRO_PT_EN' ? 'Roteiro PT/EN' : 'Pitch em inglês, sete quadros' }, { index: false, category: 'presentation-guide' });
  }
  for (const name of ['index.html', 'model.json', 'map.mmd']) await copy(`architecture/${name}`, `architecture/${name}`, 'architecture');
  await copy('context/index.html', 'context/index.html', 'context-runtime');
  await copy('context/compiled-context.json', 'context/project-context.json', 'context-data');
  for (const name of ['research-library.html', 'research-library.md', 'research-library-index.json']) await copy(`context/${name}`, `context/${name}`, 'research-library');
  for (const entry of publicMarkdown) await addMarkdown(entry);
  for (const entry of [
    { source: 'research/01-regras-ciencia.md', target: 'research/01-regras-ciencia.md', title: 'Regras e procedência científica · pesquisa de base' },
    { source: 'research/11-revisao-spaceapps-apresentacao.md', target: 'research/11-revisao-spaceapps-apresentacao.md', title: 'Revisão Space Apps · R5' },
  ]) await addMarkdown(entry, { index: false, category: 'documentary-research' });
  // The selected science report links these three artifacts. Publish a relative-path script
  // and field-projected research receipts, never the original absolute-path receipt.
  await copy('research/evidence/validate-evi3-research.py', undefined, 'research-only-science-script');
  await project('research/evidence/evi3-validation.json', 'research/evidence/evi3-validation.json', x => ({
    status: x.status, calculatedAt: x.calculatedAt, sourceDocument: x.sourceDocument, sourceEquation: x.sourceEquation,
    product: x.product, productDoi: x.productDoi, formula: x.formula, method: x.method,
    inputs: x.inputs.map(input => ({ publicPath: `public/data/${input.path.split(/[\\/]/).pop()}`, bytes: input.bytes, sha256: input.sha256 })),
    records: x.records, count: x.count, maximumAbsoluteDifference: x.maximumAbsoluteDifference,
    sampleComparisonThreshold: x.sampleComparisonThreshold, limits: x.limits,
  }));
  await project('research/evidence/resources-retrieval-20261114.json', 'research/evidence/resources-retrieval-20261114.json', x => ({
    recordedAt: x.recordedAt, officialResourcesListRecovered: x.officialResourcesListRecovered, authorityStatus: x.authorityStatus,
    scope: x.scope, attempts: x.attempts.map(({ url, result, attemptStartedAt }) => ({ url, result, ...(attemptStartedAt ? { attemptStartedAt } : {}) })),
    secondaryMirror: { url: x.secondaryMirror.url, retrieved: x.secondaryMirror.retrieved, listedResourceCount: x.secondaryMirror.listedResourceCount, canCertifyOfficialList: x.secondaryMirror.canCertifyOfficialList },
    primaryScienceRecovered: x.primaryScienceRecovered.map(({ url, pages, edition, note }) => ({ url, ...(pages ? { pages } : {}), ...(edition ? { edition } : {}), ...(note ? { note } : {}) })),
    limits: x.limits,
  }));
  for (const name of knownData) await copy(`public/data/${name}`, `public/data/${name}`, 'scientific-source');
  for (const name of ['01-long-base.json', '02-short-base.json', '03-short-repaired.json']) await copy(`examples/${name}`, `examples/${name}`, 'replay-example');
  // These historical artifacts were explicitly cleared for public copying by coordination in R6.
  await copy('output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf', undefined, 'historical-base-R4-reviewed');
  await copy('output/html/AB_Missao_Ipe_Estudo_Integral.html', undefined, 'historical-base-R4-reviewed');
  await copy('LICENSE', undefined, 'license');
  await copy('NOTICE.md', undefined, 'attribution');
  for (const name of ['React-MIT.txt', 'ReactDOM-MIT.txt', 'Scheduler-MIT.txt', 'Three-MIT.txt']) await copy(`licenses/${name}`, undefined, 'license');
  await project('evidence/chronology.json', 'evidence/chronology.json', x => ({ recordedAtUtc: x.recordedAtUtc, status: x.status, eligibilityNotEstablished: x.eligibilityNotEstablished, priorWorkAlsoNotAutomaticallyPermitted: x.priorWorkAlsoNotAutomaticallyPermitted, officialStartRioVerdeLocal: x.officialStartRioVerdeLocal, officialGuidance: x.officialGuidance, note: x.note }));
  await project('evidence/engine-benchmark.json', 'evidence/engine-benchmark.json', x => ({ measuredAt: x.measuredAt, engineVersion: x.engineVersion, catalogVersion: x.catalogVersion, sciencePackHash: x.sciencePackHash, environment: { node: x.environment.node, cpuModel: x.environment.cpuModel, platform: x.environment.platform, arch: x.environment.arch }, protocol: x.protocol, workloads: x.workloads.map(({ kind, scenarioId, warmup, sampleCount, trace, p50Ms, p95Ms, minMs, maxMs, meanMs, result }) => ({ kind, scenarioId, warmup, sampleCount, trace, p50Ms, p95Ms, minMs, maxMs, meanMs, result })) }));
  await project('evidence/ab-r3a-digest.json', 'evidence/ab-r3a-digest.json', x => ({ generatedAt: x.generatedAt, execution: { startedAt: x.execution.startedAt, elapsedMs: x.execution.elapsedMs, exitCode: x.execution.exitCode, status: x.execution.status }, sourceFiles: x.sourceFiles, statistics: x.statistics, applicationCoverage: { status: x.applicationCoverage.status, truncated: x.applicationCoverage.truncated }, semanticCoverage: { status: x.semanticCoverage.status, truncated: x.semanticCoverage.truncated }, limits: x.limits, fullReportPublished: false }));
  await project('evidence/presentation-qa.json', 'evidence/presentation-qa.json', x => ({ startedAt: x.startedAt, finishedAt: x.finishedAt, status: x.status, checksPassed: x.checksPassed, checksFailed: x.checksFailed, environment: x.environment, engine: x.engine, limitations: x.limitations, artifact: x.observations.artifact, runtimeDependencies: x.observations.runtimeDependencies, slideCounts: x.observations.slideCounts, catalog: x.observations.catalog, checks: x.checks.map(({ name, status }) => ({ name, status })) }));
  await project('evidence/presentation-build.json', 'evidence/presentation-build.json', x => ({ generatedAt: x.generatedAt, output: x.output, bytes: x.bytes, sha256: x.sha256, title: x.title, mode: x.mode, target: x.target, pitchSlides: x.pitchSlides, appendixSlides: x.appendixSlides, totalSlides: x.totalSlides, defaultMode: x.defaultMode, externalRuntimeDependencies: x.externalRuntimeDependencies, networkRequestsRequired: x.networkRequestsRequired, embeddedSourceFiles: x.embeddedSourceFiles, usesProductEngine: x.usesProductEngine, usesProductScienceValidator: x.usesProductScienceValidator, usesProductCatalogSearch: x.usesProductCatalogSearch, limitations: x.limitations }));
  const cards = docs.map(entry => `<article class="doc-card"><h2><a href="${escape(entry.html.slice(5))}">${escape(entry.title)}</a></h2><p>${escape(entry.description)}</p><a href="${escape(entry.target.slice(5))}">Markdown desta edição</a></article>`).join('');
  const docsIndex = `<p class="eyebrow">MISSÃO IPÊ / DOCUMENTAÇÃO PÚBLICA</p><h1>O contexto para<br>continuar construindo.</h1><p class="intro">Dois desenvolvedores, uma base compartilhada. Comece pelo guia de continuidade, consulte as decisões e explore o acervo completo. Cada documento distingue resultados, hipóteses e trabalho pendente.</p><p><a href="../context/index.html">Abrir a central interativa de contexto e cronograma</a> · <a href="../context/research-library.html">Ler a biblioteca integral de documentos</a></p><div class="doc-grid">${cards}</div><h2 class="section-label">DOCUMENTOS HISTÓRICOS DE BASE</h2><div class="historical"><p><strong>R4 · Dossiê de implementação e estudo integral.</strong> Estes arquivos preservam o corte original. Metas e pendências neles descritas não devem ser interpretadas como validações concluídas na BETA.</p><p><a href="../output/pdf/AB_Missao_Ipe_Dossie_Implementacao.pdf">Dossiê de base R4 · PDF</a> · <a href="../output/html/AB_Missao_Ipe_Estudo_Integral.html">Estudo integral de base R4 · HTML</a></p><p><a href="../research/11-revisao-spaceapps-apresentacao.html">Revisão documental Space Apps · R5</a></p></div><h2 class="section-label">APRESENTAÇÃO E RECIBOS</h2><div class="doc-grid"><article class="doc-card"><h2>Roteiros de apresentação</h2><p>Interface em português, notas PT/EN e copy inglesa dos sete quadros. Formato e elegibilidade ainda dependem de confirmação.</p><a href="../presentation/README_APRESENTADOR.html">Guia</a> · <a href="../presentation/ROTEIRO_PT_EN.html">Roteiro PT/EN</a> · <a href="../presentation/PITCH_EN_7_SLIDES.html">Copy inglesa</a></article><article class="doc-card"><h2>Projeções públicas de evidência</h2><p>Campos selecionados de recibos históricos. Cada projeção identifica o hash do original e seu alcance.</p><a href="../evidence/presentation-qa.json">QA da apresentação</a> · <a href="../evidence/engine-benchmark.json">Benchmark</a> · <a href="../evidence/ab-r3a-digest.json">AB-R3A</a> · <a href="../evidence/chronology.json">Cronologia</a></article></div>`;
  await emit('docs/index.html', page('Documentação pública', docsIndex, { index: true }), { category: 'documentation-index', source: 'scripts/build-beta-site.mjs', transformation: 'generated from the explicit document allowlist' });
  const missingRequired = omissions.filter(item => item.required);
  entries.sort((a, b) => a.path.localeCompare(b.path));
  const manifest = {
    schemaVersion: 1, edition: 'R21-judging-pitch-and-private-metrics', version: '0.12.0-beta.1', generatedAt: now, publicationReady: missingRequired.length === 0,
    project: 'PROJETO-IPE', title: 'Missão Ipê — Ciência que chega',
    releaseTarget: { status: 'candidate; validate deployment receipt before claiming publication' },
    scientificEngineModified: false,
    routeEntrypoints: ['/', '/planet-jumping.html', '/campanha/index.html', '/campanha/apresentacao/index.html', '/lab/index.html', '/dashboard/index.html', '/equipe/index.html', '/game/index.html', '/presentation/Missao_Ipe_Apresentacao.html', '/presentation/pitch/index.html', '/architecture/index.html', '/context/index.html', '/context/research-library.html', '/docs/index.html', `/${librasGuide}`],
    curation: 'Explicit allowlist of runtime assets, public documents, historical artifacts reviewed by coordination, scientific sources, licenses and field-projected evidence.',
    excludedClasses: ['raw static-analysis report', 'repository-sources', 'personal attachments and poster references', 'environment and credential files', 'source maps', 'private repository code', 'node_modules', 'git and Vercel local state'],
    eligibility: 'Pre-event specific development preserved; temporal eligibility and official Resources unresolved.',
    fullBrowserValidation: false, requiredRuntimeNetworkServices: 2,
    runtimeNetworkRequirements: {
      missionGames: { requiredServices: 0, routes: ['/game/index.html', '/campanha/index.html'] },
      measuredMissionLab: { requiredServices: 1, routes: ['/lab/index.html', '/dashboard/index.html'], endpoint: '/api/metrics', storage: 'Private Vercel Blob; credentials only in server environment', withoutNetwork: 'New participant registration requires the service; pending events are retained for an established session and retried.' },
      presentations: { requiredServices: 0, routes: ['/presentation/pitch/index.html', '/presentation/Missao_Ipe_Apresentacao.html'] },
      libras: { requiredServices: 0, optionalService: 'VLibras Widget', frame: `/${librasGuide}`, privateSurfaces: ['/lab/index.html', '/dashboard/index.html'], withoutNetwork: 'Public text, links and the original runtimes remain available. Automatic signing needs the official service.' },
      experiments: [{ route: '/planet-jumping.html', requiredServices: 1, mediaOrigin: 'https://d2ol7oe51mr4n9.cloudfront.net', mediaFiles: 6, withoutNetwork: 'Text journey remains available; external audiovisual media are unavailable.' }],
    },
    fileCount: entries.length, files: entries, missingRequired,
    selfHashNote: 'The manifest lists all emitted files except itself to avoid a recursive hash. The local build receipt records its hash.',
  };
  const manifestBytes = JSON.stringify(manifest, null, 2) + '\n';
  await writeFile(join(stage, 'publication-manifest.json'), manifestBytes);
  await rm(output, { recursive: true, force: true });
  await rename(stage, output);
  const receipt = { generatedAt: now, command: `node scripts/build-beta-site.mjs${allowIncomplete ? ' --allow-incomplete' : ''}`, output: 'site/', publicationReady: manifest.publicationReady, fileCount: entries.length + 1, bytes: entries.reduce((sum, file) => sum + file.bytes, 0) + Buffer.byteLength(manifestBytes), manifest: { path: 'site/publication-manifest.json', bytes: Buffer.byteLength(manifestBytes), sha256: digest(manifestBytes) }, entries, omissions, limitations: ['Static build only; does not publish to a remote service', 'No real-browser inspection or restriction bypass', 'Public projections are not complete internal receipts', 'Release target is planned, not a completed qualification'] };
  const preservedRuntimes = [];
  for (const entry of entries.filter(item => ['game-runtime', 'mission-lab-runtime', 'four-level-campaign-runtime', 'portable-game', 'presentation-runtime', 'interactive-pitch-runtime'].includes(item.category))) {
    const original = await readFile(safePath(root, entry.source));
    const originalSha256 = digest(original);
    const publishedSha256 = digest(await readFile(safePath(output, entry.path)));
    let expected = original;
    if (entry.libras) expected = decorateLibrasPage(expected.toString(), entry.path);
    if (entry.analytics) expected = decorateAnalyticsPage(expected.toString(), entry.path);
    if (digest(expected) !== publishedSha256 || publishedSha256 !== entry.sha256) throw new Error(`Runtime alterado fora da composição declarada: ${entry.path}`);
    preservedRuntimes.push({ source: entry.source, output: `site/${entry.path}`, originalSha256, publishedSha256, byteIdentical: originalSha256 === publishedSha256, transformation: entry.transformation });
  }
  await mkdir(resolve(root, 'evidence'), { recursive: true });
  await writeFile(resolve(root, 'evidence/beta-site-build.json'), JSON.stringify(receipt, null, 2) + '\n');
  await writeFile(resolve(root, 'evidence/beta-runtime-preservation.json'), JSON.stringify({ generatedAt: now, status: 'passed', scope: 'Original and emitted runtime bytes reread after static build and checked against the declared HTML integration; no browser execution.', fileCount: preservedRuntimes.length, allByteIdentical: preservedRuntimes.every(file => file.byteIdentical), allMatchDeclaredTransformation: true, files: preservedRuntimes }, null, 2) + '\n');
  process.stdout.write(`BETA estática: ${receipt.fileCount} arquivos, ${receipt.bytes} bytes, publicationReady=${receipt.publicationReady}.\nManifesto SHA-256 ${receipt.manifest.sha256}\n`);
} catch (error) {
  await rm(stage, { recursive: true, force: true });
  throw error;
}
