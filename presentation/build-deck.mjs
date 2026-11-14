// PROJETO-IPÊ editable pitch. Run from a private build directory with the
// bundled @oai/artifact-tool available through node_modules.
// Example: IPE_REPO=/path/to/repo IPE_DECK_WORK=/private/build node build-deck.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const repo = process.env.IPE_REPO;
const work = process.env.IPE_DECK_WORK;
if (!repo || !work || !path.isAbsolute(repo) || !path.isAbsolute(work)) throw new Error('IPE_REPO and IPE_DECK_WORK must name absolute paths. Use a private build directory.');
const runtimeRoot = process.env.CODEX_PRIMARY_RUNTIME_ROOT;
const runtimePython = process.env.CODEX_PRIMARY_RUNTIME_PYTHON;
const skillRoot = process.env.IPE_PRESENTATION_SKILL ?? '/home/agent/.codex/skills/builtins/presentations';
if (!runtimeRoot || !runtimePython) throw new Error('The primary runtime is required.');
process.env.RUNTIME_NODE_MODULES = process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
process.env.RUNTIME_PYTHON = runtimePython;
process.env.RUNTIME_BIN_DIR = path.join(runtimeRoot, 'dependencies/bin/override');
const { finalizePresentation } = await import(pathToFileURL(path.join(skillRoot, 'container_tools/artifact_tool_utils.mjs')).href);

const C = { bg:'#0B141D', text:'#E8EEE6', muted:'#B0BEC6', lime:'#D5F894', line:'#3A4B51', panel:'#14222B' };
const FONT = 'DejaVu Sans';
const SERIF = 'DejaVu Serif';
const p = Presentation.create({ slideSize:{ width:1280, height:720 } });
const notesSources = {
  conops:'https://www.nasa.gov/reference/appendix-s-concept-of-operations-annotated-outline/',
  cer:'https://mynasadata.larc.nasa.gov/lesson-plans/introduction-building-claims-evidence',
  nng:'https://www.nngroup.com/articles/ten-usability-heuristics/',
  modis:'https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf',
  wcag:'https://www.w3.org/TR/WCAG22/',
  repo:'https://github.com/oalexandrebelo/PROJETO-IPE',
};

function text(slide, name, value, x, y, w, h, size=26, color=C.text, opts={}) {
  const s = slide.shapes.add({name, geometry:'textbox', position:{left:x,top:y,width:w,height:h},fill:'none',line:{style:'solid',fill:'none',width:0}});
  s.text=value;
  s.text.style={typeface:opts.serif?SERIF:FONT,fontSize:size,color,bold:opts.bold??false,italic:opts.italic??false,verticalAlignment:'top',autoFit:'none',wrap:'square',insets:0,alignment:opts.align??'left'};
  if(opts.link) {
    s.text.get(value).link={uri:opts.link,isExternal:true};
    s.text.get(value).color=C.lime;
  }
  return s;
}
function slide(title, number, note) {
  const s=p.slides.add(); s.background.fill=C.bg;
  if(title) text(s,'title',title,64,55,1152,104,48,C.text,{serif:true});
  text(s,'footer',`PROJETO-IPÊ   /   beta 0.5   /   ${String(number).padStart(2,'0')}`,64,676,1050,21,12,C.muted);
  s.speakerNotes.text=note;
  return s;
}
async function image(slide, file, x,y,w,h,alt){
  const bytes=await fs.readFile(path.join(repo,'public/research/assets',file));
  return slide.images.add({blob:bytes,contentType:'image/jpeg',alt,fit:'contain',position:{left:x,top:y,width:w,height:h}});
}
function table(slide,name,values,x,y,w,h,widths){
  const tb=slide.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});
  tb.borders.assign({style:'solid',fill:C.line,width:1});
  tb.cells.block({row:0,column:0,rowCount:values.length,columnCount:values[0].length}).assign({fill:C.bg,textStyle:{typeface:FONT,fontSize:23,color:C.text},margins:{left:16,right:16,top:14,bottom:14},anchor:'center'});
  for(let c=0;c<values[0].length;c++){
    tb.getCell(0,c).fill=C.panel;
    tb.getCell(0,c).text.style={typeface:FONT,fontSize:21,bold:true,color:C.lime};
  }
  return tb;
}

{
  const s=slide('',1,`Abertura. O PROJETO-IPÊ permite projetar uma missão fictícia e explicar, com evidências, por que a ciência chegou ao solo. Dados históricos Terra/MODIS e operação didática possuem papéis diferentes. Direção: AB / Alexandre Belo. Construção com assistência de IA. Projeto independente, sem endosso NASA ou NN/g. A captura mostra a base R9/R10 anterior aos quatro níveis. Fonte da captura: public/research/assets/briefing-desktop.jpg. Contexto: docs/PRD.md e docs/PITCH.md. Código: ${notesSources.repo}`);
  text(s,'brand','PROJETO-IPÊ',64,78,650,45,27,C.lime,{bold:true});
  text(s,'cover-title','Ciência\nque chega',64,170,610,230,78,C.text,{serif:true});
  text(s,'cover-description','Um jogo educativo de projeto\nde missão espacial',64,450,610,100,28,C.muted);
  await image(s,'briefing-desktop.jpg',708,147,520,370,'Briefing da base R9/R10, com nave conceitual e meta de seis registros.');
  text(s,'capture-context','Registro visual da base R9/R10',708,530,500,36,15,C.muted);
  text(s,'authorship','AB / Alexandre Belo\nConstrução com assistência de IA',64,589,600,60,16,C.muted);
}
{
  const s=slide('Escolha e consequência',2,'Hipótese de produto, ainda sem entrevistas ou estudo próprio com participantes. Queremos investigar se observar os recursos e a entrega ajuda iniciantes a explicar relações de sistema. O ciclo começa pela previsão antes do resultado. A conclusão de uma missão não equivale a aprendizagem. Fonte: docs/PRD.md, hipóteses H-01 a H-05. Roteiro: docs/PITCH.md, slide 2.');
  text(s,'problem','Escolher uma peça exige\nentender o que ela muda\nno sistema.',64,205,590,190,40,C.lime,{serif:true});
  text(s,'hypothesis','A necessidade é uma hipótese\na investigar com iniciantes\ne educadores.',64,470,555,120,24,C.muted);
  const items=[['01','Prever','Registrar uma hipótese.'],['02','Executar','Observar o resultado do modelo.'],['03','Investigar','Localizar a evidência da causa.'],['04','Redesenhar','Testar uma nova decisão.']];
  items.forEach((r,i)=>{const y=200+i*103;text(s,`step-${i}`,r[0],738,y,60,44,22,C.lime);text(s,`step-title-${i}`,r[1],815,y-2,385,40,28,C.text);text(s,`step-body-${i}`,r[2],815,y+42,385,53,22,C.muted);});
}
{
  const s=slide('Bases de pesquisa',3,`As fontes orientam hipóteses e decisões autorais. Não constituem validação específica ou endosso do projeto. NASA ConOps: necessidade, usuários e operação. My NASA Data: afirmação, evidência e raciocínio. NN/g: princípios gerais para visibilidade de estado, linguagem, controle e recuperação. Fontes consultadas em 14/11/2026: ${notesSources.conops}\n${notesSources.cer}\n${notesSources.nng}\nVer docs/PITCH.md e docs/INSIGHTS-E-OPORTUNIDADES.md.`);
  const rows=[['NASA / ConOps','Necessidade e operação','O briefing declara o pedido e o critério.'],['My NASA Data','Afirmação e evidência','A reflexão pede um evento ou valor observado.'],['NN/g / Heurísticas','Estado e recuperação','O feedback explica o ocorrido e o próximo passo.']];
  rows.forEach((r,i)=>{const y=198+i*132;text(s,`source-${i}`,r[0],64,y,290,60,23,C.lime,{bold:true});text(s,`source-title-${i}`,r[1],400,y-3,800,50,29,C.text);text(s,`application-${i}`,r[2],400,y+53,800,64,24,C.muted);});
  text(s,'source-boundary','Referências externas orientam o desenho. A eficácia do jogo precisa de pesquisa própria.',64,609,1152,45,21,C.muted);
}
{
  const s=slide('Quatro pedidos de missão',4,'Todos os níveis exigem resultado operacional success, 6/6 registros válidos e completos e nenhuma violação. As condições adicionais pertencem à campanha e não alteram o motor. A execução própria fica vinculada ao nível, cenário e configuração. Personagens e incidentes são fictícios. No N4 a dificuldade não é necessariamente maior em número de trocas: o preset já entrega 6/6 a 84 créditos e o pedido exige até 78. Fonte: docs/STORYTELLING-4-NIVEIS.md e src/campaign/levels.ts.');
  table(s,'campaign-levels',[
    ['Nível','Contato','Condição de conclusão'],
    ['1  Primeiro sinal','2 × 10 min','Sucesso operacional 6/6'],
    ['2  Memória em disputa','2 × 10 min','6/6 com memória de 512 Mbit'],
    ['3  Janela estreita','2 × 4 min','6/6 preservando as bandas'],
    ['4  Ciência que chega','2 × 4 min','6/6 com custo ≤ 78 créditos'],
  ],64,195,1152,352,[370,220,562]);
  text(s,'campaign-note','Mesma ciência e mesmo catálogo. O pedido de engenharia muda.',64,584,1152,55,26,C.lime);
}
{
  const s=slide('2/6, causas diferentes',5,'Valores dos presets, calculados pelo motor 0.1.1-rd e catálogo ipe-64-v1. N2: longo, memória compacta, bandas, bateria pequena e demais opções DEFAULT_CONFIG. Entrega 2/6 e perde 720 Mbit, com primeira perda em 1.860 s. N3: curto e DEFAULT_CONFIG. Entrega 2/6, não perde por memória e termina com 619,2 Mbit na fila. O placar isolado não explica a causa. N2 pode processar índice, mas N3 exige bandas. Fontes: docs/STORYTELLING-4-NIVEIS.md, docs/INSIGHTS-E-OPORTUNIDADES.md e tests/campaign.test.mts.');
  text(s,'n2','N2 / MEMÓRIA EM DISPUTA',64,190,530,50,22,C.muted,{bold:true});
  text(s,'loss','720',64,255,530,120,84,C.lime);
  text(s,'loss-unit','Mbit perdidos',64,382,530,50,30,C.text);
  text(s,'loss-cause','Lotes novos não cabem\nantes do primeiro contato.',64,455,530,100,27,C.muted);
  text(s,'n3','N3 / JANELA ESTREITA',720,190,510,50,22,C.muted,{bold:true});
  text(s,'queue','619,2',720,255,510,120,84,C.lime);
  text(s,'queue-unit','Mbit ainda na fila',720,382,510,50,30,C.text);
  text(s,'queue-cause','As janelas terminam\ncom dados a bordo.',720,455,510,100,27,C.muted);
  text(s,'compare-takeaway','A próxima escolha precisa responder à causa observada.',64,599,1152,53,26,C.text);
}
{
  const s=slide('Motor e ciência',6,`O motor é determinístico por entrada e versão, sem validação de voo implícita. São seis escolhas binárias e 64 configurações. Sucesso exige 6/6 e todas as restrições. Os seis registros são Terra/MODIS MOD13Q1 Collection 061, em três pontos próximos a Rio Verde e dois períodos de 2024. O pacote conserva bandas, escala, QA e datas de observação. O CubeSat não fez essa aquisição. Uma diferença de NDVI não determina causa ambiental. A captura mostra o retorno científico da base R9/R10. Fontes: docs/ARQUITETURA.md, src/core/contracts.ts, public/data e ${notesSources.modis}`);
  text(s,'config-number','64',64,190,220,100,66,C.lime);
  text(s,'config-label','configurações verificáveis',64,286,495,55,25,C.text);
  text(s,'science-quantity','6 registros históricos\n3 pontos e 2 períodos',64,382,510,100,29,C.text);
  text(s,'science-boundary','NDVI descreve os pares recebidos.\nSua causa exige outras evidências.',64,522,510,100,24,C.muted);
  await image(s,'retorno-cientifico.jpg',610,190,618,425,'Retorno científico da base R9/R10, com registros recebidos e valores de NDVI.');
  text(s,'science-caption','Retorno científico da base R9/R10',610,625,618,29,14,C.muted);
}
{
  const s=slide('Arquitetura do beta',7,'O beta é um frontend estático. React 19.3.1 e TypeScript 7.0.2 compõem a interface. Three.js/R3F/Drei apresentam a cena, com alternativa 2D. O motor puro não depende de UI, rede ou LLM. Snapshot e token de tentativa própria conservam a ligação entre previsão e execução. Replay é validado e recalculado, sem conceder avanço. Persistência: IndexedDB e localStorage. O schema Prisma 7.10.1 com 12 modelos é proposta de PostgreSQL, sem banco, autenticação ou sincronização de produção. Fontes: docs/ARQUITETURA.md, prisma/README.md e docs/HANDOFF.md.');
  const layers=[['Interação','React, TypeScript e 3D com alternativa 2D'],['Coordenação','Snapshot, Worker e tentativa própria'],['Domínio','Motor determinístico e critérios da campanha'],['Persistência','IndexedDB, localStorage e replay recalculado']];
  layers.forEach((r,i)=>{const y=192+i*86;text(s,`layer-${i}`,r[0],64,y,320,44,27,C.lime);text(s,`layer-description-${i}`,r[1],420,y,800,65,26,C.text);});
  text(s,'cloud-future','Proposta futura: Prisma + PostgreSQL',64,573,1152,45,24,C.muted,{bold:true});
  text(s,'cloud-boundary','12 modelos documentados. Sem banco, conta ou sincronização ativos.',64,620,1152,40,21,C.muted);
}
{
  const s=slide('Estado da evidência',8,'Recibo integrado do beta 0.5: 120 testes de domínio e 14 testes UI aprovados, sem falhas. Os 120 já incluem 19 testes de campanha. Node 24.22.1. UI em jsdom e fake-indexeddb com motor real. A inspeção local de navegador desta rodada foi bloqueada pela política de URL do ambiente. Capturas R9/R10 são históricas. Testes DOM não medem GPU, leitor de tela, Worker real ou durabilidade de armazenamento. Não houve pesquisa com participantes, teste de transferência ou validação de voo. Fonte: docs/QA-BETA-0.5.md e evidence/domain-test.tap, evidence/ui-dom-test.tap. Verificar commit do README antes de usar os números.');
  table(s,'evidence',[
    ['Camada','Evidência do beta','Alcance'],
    ['Software','120 testes de domínio\n14 testes de jornada DOM','Contratos e casos cobertos'],
    ['Interação','Jornadas DOM em jsdom\nAuditoria assistiva pendente','Não comprova GPU\nou leitor de tela'],
    ['Aprendizagem','Estudo com participantes\nainda pendente','Sem efeito educacional\ndemonstrado'],
  ],64,190,1152,345,[245,450,457]);
  text(s,'evidence-claim','Concluir a campanha demonstra atendimento às regras do jogo.',64,582,1152,70,26,C.lime);
}
{
  const s=slide('Próximo ciclo de pesquisa',9,`Proposta formativa, sem participantes recrutados ou agenda confirmada. Observar iniciantes e educadores, distinguir incidentes de interface de dúvidas conceituais e registrar o apoio recebido. Investigar se reconhecem causa, justificam redesign com evidência e transferem raciocínio para situação distinta. Revisar linguagem, teclado, leitor de tela, zoom, movimento reduzido e aparelhos de menor capacidade. Não usar cliques, tempo ou tentativas como medida isolada de aprendizagem. Fontes: docs/PRD.md, docs/INSIGHTS-E-OPORTUNIDADES.md e ${notesSources.wcag}`);
  text(s,'question-1','A pessoa reconhece a causa?',64,195,1152,75,39,C.lime,{serif:true});
  text(s,'question-2','Que evidência sustenta a mudança?',64,310,1152,75,39,C.text,{serif:true});
  text(s,'question-3','O raciocínio funciona em um novo pedido?',64,425,1152,90,39,C.text,{serif:true});
  text(s,'research-action','Sessões observadas, guia de mediação e tarefa de transferência.\nPúblico, contexto e protocolo ainda serão definidos.',64,571,1152,80,24,C.muted);
}
{
  const s=slide('Convite à pilotagem',10,`Encerrar pedindo uma ação concreta: experimentar N1, revisar a atividade com educadores ou combinar a preparação de uma pilotagem. Não há adoção, parceria ou ganho de aprendizagem confirmado. O repositório contém a URL da publicação e o mapa em /apresentacao/. Pitch completo, perguntas difíceis e handoff estão em docs/PITCH.md e docs/HANDOFF.md. Direção de produto: AB / Alexandre Belo. Código e fontes: ${notesSources.repo}`);
  text(s,'closing','Vamos observar\ncomo as pessoas\nexplicam suas decisões.',64,195,1152,270,58,C.lime,{serif:true});
  text(s,'call-to-action','Experimente o primeiro nível. Revise a mediação.\nAjude a preparar uma investigação com pessoas.',64,495,1152,88,27,C.text);
  text(s,'repo-link','github.com/oalexandrebelo/PROJETO-IPE',64,615,1152,38,22,C.muted,{link:notesSources.repo});
}

await fs.mkdir(path.join(work,'previews'),{recursive:true});
await fs.mkdir(path.join(work,'out'),{recursive:true});
const candidate=path.join(work,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidate);
for(const [index,s] of p.slides.items.entries()){
  const stem=`slide-${String(index+1).padStart(2,'0')}`;
  const png=await p.export({slide:s,format:'png',scale:1});
  await fs.writeFile(path.join(work,'previews',`${stem}.png`),new Uint8Array(await png.arrayBuffer()));
  const layout=await s.export({format:'layout'});
  await fs.writeFile(path.join(work,'previews',`${stem}.json`),await layout.text());
}
const finalPath=path.join(work,'out','PROJETO-IPE-Pitch.pptx');
const receipt=await finalizePresentation({
  explicitTotalSlideCount:10,
  requiredNativeTableOwnerSlides:[4,8],
  requiredNativeChartOwnerSlides:[],
  workspaceDir:work,candidatePath:candidate,finalPath,
  pythonExecutable:runtimePython,
  integrityValidatorPath:path.join(skillRoot,'container_tools/inspect_presentation_package_integrity.py'),
  layoutValidatorPath:path.join(skillRoot,'container_tools/inspect_presentation_layout_geometry.py'),
  layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','4','--require-native-table-slide','8'],
  fontPolicy:{basis:'design',families:[FONT,SERIF]},
  verifyArtifactToolImport:true,
  receiptPath:path.join(work,'validation.json'),
});
console.log(JSON.stringify({finalPath,slides:p.slides.items.length,receipt},null,2));
