// Project-authored inspection, not an upstream Archify scanner.
// Reads source syntax and file metadata; never evaluates product files or copies their contents.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as ts from 'typescript/unstable/ast';
import { API } from 'typescript/unstable/sync';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseCommit = '3d6e8e9bd8dcb1618e00c6fc7ace181141cb4aaf';
const upstreamCommit = 'e37848822238e3a61b12739185cdadd49843a620';
const ignored = new Set(['node_modules', '.git', '.vercel', 'site', 'dist', 'portable', 'output', 'vendor', 'architecture', 'recovery']);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const exists = rel => fs.existsSync(path.join(root, rel));
function walk(dir = '') {
  return fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || ignored.has(entry.name)) return [];
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    if (!entry.isFile() || /\.(zip|pdf|png|jpe?g|webp|mp4|woff2?)$/i.test(rel)) return [];
    if (rel === 'vercel.json' || rel === 'PUBLICADO.md' || /^evidence\/(?:archify-r[68]|architecture-checks-r[68]|beta-site-build|beta-site-qa|beta-runtime-preservation|deployment-r[68]|vercel-static-r[68]|context-qa-r8|context-browser-r8|research-library-r8|git-[^/]+)\.json$/.test(rel)) return [];
    if (/^context\/(?:index\.html|compiled-context\.json|research-library(?:-index\.json|\.html|\.md))$/.test(rel)) return [];
    if (rel === 'presentation/Missao_Ipe_Apresentacao.html' || /\.(tap|log)$/.test(rel)) return [];
    return [rel];
  }).sort();
}
function category(p) {
  if (p.startsWith('src/core/')) return 'núcleo';
  if (p.startsWith('src/workers/')) return 'Worker';
  if (p.startsWith('src/persistence/')) return 'persistência';
  if (p.startsWith('src/data/') || p.startsWith('public/data/')) return 'ciência';
  if (p.startsWith('src/')) return 'jogo';
  if (p.startsWith('presentation/')) return 'apresentação';
  if (p.startsWith('context/')) return 'contexto e cronograma';
  if (p.startsWith('web/')) return 'portal';
  if (p.startsWith('scripts/') || p === 'vite.config.ts' || p === 'vercel.json') return 'build e publicação';
  if (p.startsWith('tests/')) return 'testes';
  if (p.startsWith('prisma/')) return 'contrato futuro';
  if (p.startsWith('research/') || p.startsWith('evidence/')) return 'pesquisa e evidências';
  return 'documentação e configuração';
}
const baseFiles = new Map(execFileSync('git', ['ls-tree', '-r', baseCommit], { cwd: root, encoding: 'utf8' }).trim().split('\n').map(line => { const [meta, name] = line.split('\t'); return [name, meta.split(' ')[2]]; }));
const inventory = walk().map(p => {
  const bytes = fs.readFileSync(path.join(root, p));
  let provenance = 'R8: arquivo local identificado por hash; commit final registrado separadamente';
  if (baseFiles.has(p)) {
    const blobHash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    provenance = baseFiles.get(p) === blobHash ? 'base R5: Git blob igual ao commit fixado' : 'R8: modificado em relação à base R5';
  }
  return { id: p, path: p, category: category(p), bytes: bytes.length, sha256: hash(bytes), lines: bytes.toString('utf8').split('\n').length, provenance };
});
const codeFiles = inventory.filter(f => /\.(?:ts|tsx|mts|mjs|js|jsx)$/.test(f.path));
const edges = [];
const parseErrors = [];
const unresolved = [];
function resolveSpecifier(from, specifier) {
  if (!specifier.startsWith('.')) return { target: specifier.startsWith('node:') ? specifier : `npm:${specifier.split('/').slice(0, specifier.startsWith('@') ? 2 : 1).join('/')}`, resolution: specifier.startsWith('node:') ? 'node-built-in' : 'package' };
  const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
  for (const candidate of [normalized, ...['.ts', '.tsx', '.mts', '.mjs', '.js', '/index.ts', '/index.tsx', '/index.js'].map(s => normalized + s)]) {
    if (exists(candidate) && fs.statSync(path.join(root, candidate)).isFile()) return { target: candidate, resolution: 'local' };
  }
  return { target: normalized, resolution: 'unresolved' };
}
const api = new API({ cwd: root });
const snapshot = api.updateSnapshot({ openFiles: codeFiles.map(file => path.join(root, file.path)) });
const isStringLiteralLike = node => node && (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral);
try { for (const file of codeFiles) {
  const filename = path.join(root, file.path);
  const program = snapshot.getDefaultProjectForFile(filename)?.program;
  const source = program?.getSourceFile(filename);
  if (!source) throw new Error(`AST unavailable for ${file.path}`);
  for (const error of program.getSyntacticDiagnostics(filename)) parseErrors.push({ path: file.path, message: String(error.messageText) });
  function add(node, specifier, kind, typeOnly = false) {
    const resolved = resolveSpecifier(file.path, specifier);
    const edge = { id: `import-${edges.length + 1}`, from: file.path, to: resolved.target, specifier, kind, typeOnly, resolution: resolved.resolution, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 };
    edges.push(edge);
    if (resolved.resolution === 'unresolved') unresolved.push(edge);
  }
  function visit(node) {
    if (ts.isImportDeclaration(node) && isStringLiteralLike(node.moduleSpecifier)) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      const allNamedType = !clause?.name && bindings && ts.isNamedImports(bindings) && bindings.elements.length > 0 && bindings.elements.every(x => x.isTypeOnly);
      add(node, node.moduleSpecifier.text, 'import', Boolean(clause?.isTypeOnly || allNamedType));
    }
    if (ts.isExportDeclaration(node) && node.moduleSpecifier && isStringLiteralLike(node.moduleSpecifier)) add(node, node.moduleSpecifier.text, 're-export', node.isTypeOnly);
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && isStringLiteralLike(node.arguments[0])) add(node, node.arguments[0].text, 'dynamic-import');
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require' && node.arguments[0] && isStringLiteralLike(node.arguments[0])) add(node, node.arguments[0].text, 'require');
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'Worker') {
      const arg = node.arguments?.[0];
      if (arg && ts.isNewExpression(arg) && ts.isIdentifier(arg.expression) && arg.expression.text === 'URL' && arg.arguments?.[0] && isStringLiteralLike(arg.arguments[0])) add(node, arg.arguments[0].text, 'worker-entry');
    }
    node.forEachChild(visit);
  }
  visit(source);
} } finally { snapshot.dispose(); api.close(); }
if (parseErrors.length || unresolved.length) throw new Error(JSON.stringify({ parseErrors, unresolved }));

// Calls below are corroborated by inspected source text. These are not import edges.
const behaviors = [
  ['b-app-worker', 'src/App.tsx', 'src/workers/client.ts', 'invocação', 'simulateAsync / searchAsync', 'await simulateAsync'],
  ['b-worker-runtime', 'src/workers/client.ts', 'src/workers/mission.worker.ts', 'mensagem', 'Worker de módulo; um trabalho por instância; encerra ao terminar', 'new Worker('],
  ['b-worker-engine', 'src/workers/mission.worker.ts', 'src/core/engine.ts', 'invocação', 'Mensagem simulate executa o motor', 'simulateMission(config'],
  ['b-worker-search', 'src/workers/mission.worker.ts', 'src/core/search.ts', 'invocação', 'Mensagem search enumera o catálogo', 'searchCatalog(config'],
  ['b-main-fallback', 'src/workers/client.ts', 'src/core/engine.ts', 'fallback', 'Modo portátil / file: / ausência de Worker executa no thread principal', "await import('../core/engine.ts')"],
  ['b-search-engine', 'src/core/search.ts', 'src/core/engine.ts', 'invocação', 'Busca exaustiva chama o mesmo motor', 'enumerateConfigurations(), simulateMission'],
  ['b-engine-science', 'src/core/engine.ts', 'src/data/science-data.ts', 'leitura em memória', 'Seis registros congelados; não consulta API durante a missão', 'getScenario(scenarioId), SCIENCE_RECORDS'],
  ['b-pitch-engine', 'presentation/src/main.ts', 'src/core/engine.ts', 'invocação', 'Demonstrador da apresentação reutiliza simulateMission', 'simulateMission('],
  ['b-pitch-search', 'presentation/src/main.ts', 'src/core/search.ts', 'invocação', 'Apresentação reutiliza searchCatalog', 'searchCatalog('],
  ['b-app-store', 'src/App.tsx', 'src/persistence/store.ts', 'persistência', 'Salva execuções e rascunhos pelo adaptador local', 'await saveRun('],
  ['b-store-indexeddb', 'src/persistence/store.ts', 'browser:IndexedDB', 'API do navegador', 'runs e drafts; conclusão após commit de transação', 'factory.open('],
  ['b-app-journal', 'src/App.tsx', 'browser:localStorage', 'API do navegador', 'Diário de aprendizagem local', 'localStorage.setItem('],
  ['b-replay-engine', 'src/persistence/replay.ts', 'src/core/engine.ts', 'verificação', 'Replay importado é reexecutado e o hash é comparado', 'simulateMission('],
  ['b-webgl', 'src/ui/OrbitalScene.tsx', 'browser:WebGL', 'API do navegador', 'Cena Three.js decorativa; retorno 2D quando indisponível', 'new THREE.WebGLRenderer'],
  ['b-pitch-build', 'scripts/build-presentation.mjs', 'presentation/Missao_Ipe_Apresentacao.html', 'build', 'esbuild incorpora JS, CSS e arquivos de ciência selecionados', "entryPoints: ['presentation/src/main.ts']"],
  ['b-portable-build', 'scripts/build-portable.mjs', 'portable/Missao_Ipe_Local.html', 'build', 'HTML portátil incorpora jogo e define o fallback principal', '__IPE_PORTABLE__'],
  ['b-portal-build', 'scripts/build-beta-site.mjs', 'site/index.html', 'cópia de publicação', 'Portal copiado sem transformação', "await copy('web/index.html'"],
  ['b-game-build', 'scripts/build-beta-site.mjs', 'site/game/', 'cópia de publicação', 'Allowlist copia dist preservando bytes; source maps excluídos', 'await copy(source, `game/'],
  ['b-map-build', 'scripts/build-beta-site.mjs', 'site/architecture/', 'cópia de publicação', 'Somente index.html, model.json e map.mmd', "['index.html', 'model.json', 'map.mmd']"],
  ['b-docs-build', 'scripts/build-beta-site.mjs', 'site/docs/', 'transformação de publicação', 'Markdown público selecionado é renderizado como HTML escapado', 'for (const entry of publicMarkdown)'],
  ['b-evidence-build', 'scripts/build-beta-site.mjs', 'site/evidence/', 'projeção de publicação', 'Recibos públicos usam campos selecionados', "await project('evidence/chronology.json'"],
  ['b-manifest-build', 'scripts/build-beta-site.mjs', 'site/publication-manifest.json', 'build', 'Manifesto relaciona caminho, hash, fonte e transformação', "writeFile(join(stage, 'publication-manifest.json')"],
  ['b-preservation-receipt', 'scripts/build-beta-site.mjs', 'evidence/beta-runtime-preservation.json', 'recibo gerado', 'Releitura compara bytes originais e publicados; timestamp muda no build. Saída fora do inventário de hashes.', "writeFile(resolve(root, 'evidence/beta-runtime-preservation.json')"],
  ['b-csp-config', 'scripts/prepare-vercel-static.mjs', 'vercel.json', 'configuração gerada', 'CSP usa hashes dos scripts HTML finais. Saída fora do inventário para evitar autorreferência com o mapa.', "writeFile(resolve(root, 'vercel.json')"],
  ['b-context-build', 'scripts/build-beta-site.mjs', 'context/index.html', 'geração de contexto', 'Central combina conteúdo editorial e cronograma; não modifica o motor.', "import('./build-context-hub.mjs')"],
  ['b-library-build', 'scripts/build-beta-site.mjs', 'context/research-library.html', 'geração documental', 'Biblioteca integral preserva cortes históricos e registra ajustes da projeção pública.', "import('./build-research-library.mjs')"],
  ['b-context-copy', 'scripts/build-beta-site.mjs', 'site/context/', 'cópia de publicação', 'HTML autocontido e JSON combinado copiados para o site.', "copy('context/compiled-context.json'"],
];
const relations = behaviors.map(([id, from, to, kind, description, needle]) => {
  const lines = fs.readFileSync(path.join(root, from), 'utf8').split('\n');
  const line = lines.findIndex(x => x.includes(needle)) + 1;
  if (!line) throw new Error(`Missing inspected call ${id}: ${needle}`);
  return { id, from, to, kind, description, evidence: { path: from, line, match: needle } };
});

const runtime = {
  schema_version: 1, diagram_type: 'architecture',
  meta: {
    title: 'Missão Ipê · execução local', output: 'architecture/runtime.html', locale: 'en', quality_profile: 'showcase', visual_preset: 'editorial', animation: 'none',
    subtitle: 'R8 BETA · fluxo principal agrupado · contexto e publicação no inventário abaixo',
    views: [
      { id: 'missao', label: 'Executar uma missão', focus: ['app', 'client', 'worker', 'core', 'science'], note: 'Interface → Worker → motor determinístico; os resultados retornam à interface.' },
      { id: 'armazenar', label: 'Guardar no navegador', focus: ['app', 'persistence'], note: 'Execuções e rascunhos usam IndexedDB; o diário usa localStorage.' },
      { id: 'apresentar', label: 'Demonstrar no pitch', focus: ['presentation', 'core', 'science'], note: 'A apresentação usa o mesmo núcleo no thread principal.' },
    ],
    legend: { entries: { backend: { label: 'Lógica no navegador' }, database: { label: 'Dados locais' }, messagebus: { label: 'Worker local' }, frontend: { label: 'Interface' } } },
  },
  components: [
    { id: 'app', type: 'frontend', label: 'Jogo React', sublabel: 'src/App.tsx + UI', tag: 'INTERFACE', pos: [40, 80], size: [230, 82] },
    { id: 'client', type: 'backend', label: 'Cliente do Worker', sublabel: 'workers/client.ts', tag: 'VALIDAÇÃO + TIMEOUT', pos: [420, 80], size: [230, 82] },
    { id: 'worker', type: 'messagebus', label: 'Worker de missão', sublabel: 'mission.worker.ts', tag: 'POSTMESSAGE', pos: [800, 80], size: [230, 82] },
    { id: 'persistence', type: 'database', label: 'Persistência local', sublabel: 'IndexedDB + replay', tag: 'HASH + REEXECUÇÃO', pos: [40, 350], size: [230, 82] },
    { id: 'core', type: 'backend', label: 'Motor + busca', sublabel: 'core/engine + search', tag: 'CATÁLOGO: 64', pos: [800, 350], size: [230, 82] },
    { id: 'presentation', type: 'frontend', label: 'Apresentação HTML', sublabel: 'presentation/src/main.ts', tag: 'MESMO NÚCLEO', pos: [420, 620], size: [230, 82] },
    { id: 'science', type: 'database', label: 'Ciência congelada', sublabel: 'data/science-data.ts', tag: 'MOD13 · DIDÁTICO', pos: [800, 620], size: [230, 82] },
  ],
  connections: [
    { id: 'app-client', from: 'app', to: 'client', label: 'simular / buscar', variant: 'emphasis' },
    { id: 'client-worker', from: 'client', to: 'worker', label: 'mensagem', variant: 'emphasis' },
    { id: 'worker-core', from: 'worker', to: 'core', label: 'executar', variant: 'emphasis' },
    { id: 'app-persistence', from: 'app', to: 'persistence', label: 'salvar / importar' },
    { id: 'presentation-core', from: 'presentation', to: 'core', label: 'demonstrar' },
    { id: 'core-science', from: 'core', to: 'science', label: 'validar registros' },
  ],
  cards: [
    { dot: 'emerald', title: 'Implementado', items: ['Motor determinístico, busca exaustiva e validação científica', 'Worker isolado; fallback principal no modo portátil', 'Persistência local e replay verificado'] },
    { dot: 'amber', title: 'Fronteiras', items: ['Backend significa lógica local neste desenho; não há API de produto', 'A visão agrupa arquivos; o inspetor abaixo enumera cada import', 'Apresentação, jogo, portal e mapa se conectam por navegação'] },
    { dot: 'rose', title: 'Ainda proposto', items: ['Prisma: contrato, sem serviço implantado', 'Marte, Fastino e IA remota: sem integração no motor', 'Elegibilidade e Resources oficiais continuam pendentes'] },
  ],
};
const opportunities = [
  { id: 'op-real-browser', priority: 'P0', status: 'pendente', title: 'Verificar a experiência em navegador real', why: 'Conferir WebGL, teclado, foco, celular, CSP, exportação do mapa e persistência no domínio publicado.', evidence: ['src/ui/Scene.tsx', 'src/ui/OrbitalScene.tsx', 'src/persistence/store.ts'] },
  { id: 'op-resource', priority: 'P0', status: 'pendente', title: 'Confirmar Resources e orientação sobre elegibilidade', why: 'Usar uma fonte NASA da lista do desafio e obter orientação oficial sobre a cronologia. A publicação não resolve essas condições.', evidence: ['research/11-revisao-spaceapps-apresentacao.md', 'evidence/chronology.json'] },
  { id: 'op-learning', priority: 'P1', status: 'proposto', title: 'Observar aprendizagem com participantes', why: 'Avaliar previsão, interpretação da falha e escolha de mudança; o diário implementado não demonstra eficácia por si só.', evidence: ['src/ui/learning.ts', 'src/App.tsx'] },
  { id: 'op-science', priority: 'P1', status: 'proposto', title: 'Versionar novos pacotes científicos', why: 'Preservar proveniência, critérios de qualidade e hashes; distinguir NDVI observado de massa, potência e enlace didáticos.', evidence: ['src/core/science.ts', 'src/data/science-data.ts', 'scripts/verify-science-data.mjs'] },
  { id: 'op-arch', priority: 'P1', status: 'proposto', title: 'Manter o mapa como evidência regenerável', why: 'Executar o inspetor após mudanças, verificar o build publicado e atualizar a análise de chamadas. Imports estáticos não provam execução.', evidence: ['architecture/build-model.mjs', 'architecture/build-page.mjs', 'architecture/model.json'] },
  { id: 'op-backend', priority: 'P2', status: 'proposto', title: 'Decidir se sincronização remota é necessária', why: 'Prisma é um contrato futuro. Autenticação, serviço e migração exigem uma decisão de produto antes da implementação.', evidence: ['prisma/schema.prisma', 'docs/07-SCHEMA-PRISMA.md'] },
  { id: 'op-mars', priority: 'P2', status: 'proposto', title: 'Projetar Marte como outro cenário', why: 'O mapa visual existente não altera física, dados ou regras da missão atual; uma expansão precisa de modelo e validação próprios.', evidence: ['research/03-oportunidades-spec.md', 'src/core/catalog.ts'] },
];
const model = {
  schemaVersion: 1, title: 'AB-NASA-TEAM-IPE — arquitetura verificável', generatedAt: new Date().toISOString(),
  language: 'pt-BR', projectStatus: 'BETA de P&D; release planejado para 15/11/2026 08:00 America/Sao_Paulo',
  provenance: { codeBaseCommit: baseCommit, codeBaseRemote: null, publicationRepository: 'https://github.com/oalexandrebelo/AB-NASA-TEAM-IPE', localProvenance: 'Git blob dos arquivos locais comparado à base fixada R5; SHA-256 adicional por arquivo. O histórico local é preservado em bundle; commits criados pela API têm metadados próprios. Não há promessa de identidade com um commit futuro.', archify: { repository: 'https://github.com/tt-a1i/archify', commit: upstreamCommit, version: '3.2.0', workflow: 'skill de autoria de IR + renderer nativo; não scanner' } },
  scope: { inventory: 'Arquivos textuais do projeto inspecionado; metadados e hashes, sem conteúdo de dados ou arquivos de ambiente.', imports: 'AST TypeScript de todos os .ts/.tsx/.mts/.mjs/.js/.jsx no inventário; includes import, re-export, import() literal, require() literal e entrada de Worker(new URL literal).', exclusions: ['node_modules', 'vendor Archify (manifesto separado)', 'artefatos gerados site/dist/portable/output', 'binários e mídia', 'arquivos ocultos e de ambiente', 'próprios artefatos architecture (evita ciclo de hashes)', 'vercel.json: CSP gerada com hash do próprio mapa', 'evidence/beta-runtime-preservation.json: recibo regenerado após o build', 'recibos posteriores de build, QA, arquitetura e deployment'], limits: ['Chamadas calculadas em tempo de execução não são inferidas.', 'Aresta import identifica dependência sintática, não chamada ou fluxo de dados.', 'Import type é marcado e não existe no JavaScript emitido.', 'Conteúdo scientific data não é copiado para este modelo.', 'Nenhuma inspeção visual em navegador real foi possível nesta rodada.'] },
  statistics: { inventoryFiles: inventory.length, parsedCodeFiles: codeFiles.length, edges: edges.length, localEdges: edges.filter(e => e.resolution === 'local').length, typeOnlyEdges: edges.filter(e => e.typeOnly).length, dynamicImports: edges.filter(e => e.kind === 'dynamic-import').length, workerEntries: edges.filter(e => e.kind === 'worker-entry').length, unresolvedImports: unresolved.length, parseErrors: parseErrors.length },
  files: inventory, imports: edges, behaviors: relations, runtimeDiagram: runtime, opportunities,
  generatedOutputs: [
    { path: 'vercel.json', source: 'scripts/prepare-vercel-static.mjs', hashInventoried: false, reason: 'Configuração e CSP geradas a partir dos scripts HTML finais; incluir seu hash no mapa criaria ciclo.' },
    { path: 'evidence/beta-runtime-preservation.json', source: 'scripts/build-beta-site.mjs', hashInventoried: false, reason: 'Recibo posterior à montagem; registra hashes de runtime e timestamp do build. Não é fonte do mapa.' },
    { path: 'context/index.html', source: 'scripts/build-context-hub.mjs', hashInventoried: false, reason: 'HTML gerado a partir de template e JSON; as fontes editoriais estão inventariadas.' },
    { path: 'context/compiled-context.json', source: 'scripts/build-context-hub.mjs', hashInventoried: false, reason: 'Combinação gerada de conteúdo e cronograma.' },
    { path: 'context/research-library.html', source: 'scripts/build-research-library.mjs', hashInventoried: false, reason: 'Compilação de documentos históricos e atuais, com índice próprio.' },
  ],
  boundaries: [
    { title: 'Jogo e apresentação', status: 'implementado', detail: 'Compartilham imports do núcleo. A apresentação executa o núcleo diretamente; o jogo usa Worker quando disponível.' },
    { title: 'Armazenamento', status: 'implementado', detail: 'IndexedDB guarda runs/drafts; localStorage guarda o diário. Não há sincronização remota.' },
    { title: 'Ciência', status: 'implementado', detail: 'O núcleo lê registros congelados. NDVI é dado observado MOD13; o cenário orbital e o catálogo são didáticos.' },
    { title: 'Portal / mapa / docs', status: 'implementado', detail: 'Páginas estáticas conectadas por links. Não há estado de aplicação compartilhado entre elas.' },
    { title: 'Contexto e cronograma', status: 'implementado', detail: 'Central estática com dados incorporados; checklist pessoal no localStorage não altera o estado oficial ou o jogo.' },
    { title: 'Publicação GitHub / Vercel', status: 'base R6 publicada; atualização R8 identificada por recibos próprios', detail: 'Repositório privado criado na R8. A confirmação final do conteúdo remoto, commit e deployment fica nos recibos posteriores.' },
    { title: 'Prisma / Fastino / Marte', status: 'proposto', detail: 'Contrato e pesquisa, sem integração de backend, IA remota ou cenário marciano ao motor.' },
  ],
};
fs.writeFileSync(path.join(root, 'architecture/model.json'), JSON.stringify(model, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'architecture/runtime.architecture.json'), JSON.stringify(runtime, null, 2) + '\n');
process.stdout.write(JSON.stringify(model.statistics) + '\n');
