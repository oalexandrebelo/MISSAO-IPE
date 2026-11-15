import {MISSIONS,summarize,attemptsCsv} from './metrics.mjs';
const $=id=>document.getElementById(id);
const profiles=new Map(),events=new Map();
let cursor=null,hasMore=false,busy=false,pages=0,loadFailed=false,loginPending=false,detailTrigger=null,accessEpoch=0;
const status=text=>{$('status').textContent=text;};
const textNode=(tag,text,className)=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;};
const percentage=(n,d)=>d?`${Math.round(n/d*100)}%`:'—';
const when=value=>new Date(value).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
function clearPrivate() {
  accessEpoch++;
  const moveFocus=$('workspace').contains(document.activeElement)||document.activeElement===$('logout');
  profiles.clear();events.clear();cursor=null;pages=0;hasMore=false;detailTrigger=null;$('workspace').hidden=true;$('logout').hidden=true;$('login').hidden=false;$('attempt-rows').replaceChildren();$('detail-content').replaceChildren();$('participant').replaceChildren(new Option('Todas as participações','all'));$('mission').value='all';$('show-email').checked=false;$('detail').hidden=true;
  for(const id of ['mission-cards','causes','answers','coverage','success-caption','accuracy-caption','inventory-summary','inventory-rows'])$(id).replaceChildren();
  for(const id of ['sessions','attempts'])$(id).textContent='0';
  for(const id of ['success','accuracy'])$(id).textContent='—';
  if(moveFocus)$('access').focus();
}
async function api(body,query='') {
  const response=await fetch(`/api/metrics${query}`,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});
  if(response.status===401){clearPrivate();status('Entre com a chave da equipe para consultar os registros.');throw new Error('Entre com a chave da equipe para consultar os registros.');}
  if(!response.ok) throw new Error(response.status===503?'O armazenamento está indisponível. Nenhum resultado foi inventado; tente atualizar em instantes.':response.status===429?'Muitas solicitações. Aguarde um minuto antes de tentar novamente.':'Não foi possível concluir a consulta. Tente novamente.');
  return response.json();
}
function setBusy(value){busy=value;for(const id of ['refresh','more','export'])$(id).setAttribute('aria-disabled',String(value));}
async function loadPage(reset=false) {
  if(busy)return;const requestEpoch=accessEpoch;setBusy(true);loadFailed=false;status('Consultando registros privados…');
  try {
    const data=await api(null,`?action=admin${!reset&&cursor?`&cursor=${encodeURIComponent(cursor)}`:''}`);
    if(requestEpoch!==accessEpoch)return;
    if(!Array.isArray(data.profiles)||!Array.isArray(data.events))throw new Error('Resposta de métricas inválida.');
    if(reset){profiles.clear();events.clear();pages=0;}
    for(const p of data.profiles)profiles.set(p.sessionId,p);
    for(const e of data.events)events.set(`${e.schemaVersion??1}:${e.sessionId}:${e.kind}:${e.id}`,e);
    const moveFocus=$('login').contains(document.activeElement);
    cursor=data.cursor;hasMore=data.hasMore;pages++;$('login').hidden=true;$('workspace').hidden=false;$('logout').hidden=false;
    const selected=$('participant').value;
    $('participant').replaceChildren(new Option('Todas as participações','all'),...[...profiles.values()].sort((a,b)=>a.name.localeCompare(b.name)).map(p=>new Option(`${p.name} · ${p.sessionId.slice(-6)}`,p.sessionId)));
    if(profiles.has(selected))$('participant').value=selected;
    render();if(moveFocus)$('mission').focus();status(`Consulta atualizada às ${new Date().toLocaleTimeString('pt-BR')}.`);
  }catch(error){if(requestEpoch===accessEpoch){loadFailed=true;render();status(error.message);}}finally{setBusy(false);}
}
function filtered(){const mission=$('mission').value,participant=$('participant').value;return [...events.values()].filter(e=>(mission==='all'||e.mission===mission)&&(participant==='all'||e.sessionId===participant));}
function addPair(dl,label,value){dl.append(textNode('dt',label),textNode('dd',String(value)));}
function render(){
  const selected=filtered(),s=summarize(selected),participant=$('participant').value,mission=$('mission').value;
  const focusTable=$('attempt-rows').contains(document.activeElement)||$('detail').contains(document.activeElement);
  const sessionIds=new Set(mission==='all'?[...profiles.keys()].filter(id=>participant==='all'||id===participant):selected.map(e=>e.sessionId));
  $('sessions').textContent=sessionIds.size;$('attempts').textContent=s.calculated.length;$('success').textContent=percentage(s.success,s.calculated.length);$('success-caption').textContent=`${s.success} de ${s.calculated.length} cumpriram os requisitos; ${s.invalid} projetos incompatíveis.`;
  $('accuracy').textContent=percentage(s.firstCorrect,s.answered);$('accuracy-caption').textContent=`${s.firstCorrect} de ${s.answered} perguntas na primeira resposta recebida.`;
  $('coverage').textContent=`${profiles.size} participações e ${events.size} eventos carregados em ${pages} página(s). ${hasMore?'Visão parcial: há mais registros. Carregue todas as páginas antes de comparar totais.':'Todas as páginas desta consulta foram carregadas.'}${loadFailed?' A última atualização falhou; os dados exibidos podem estar desatualizados.':''}`;
  const focusMore=!hasMore&&document.activeElement===$('more');
  $('more').hidden=!hasMore;
  if(focusMore)$('coverage').focus();
  $('mission-cards').replaceChildren();
  for(const [id,info] of Object.entries(MISSIONS)){
    if(mission!=='all'&&id!==mission)continue;const m=summarize(selected.filter(e=>e.mission===id));
    const card=textNode('article','','mission-card');card.append(textNode('h2',info.name),textNode('p',info.lesson));const dl=document.createElement('dl');
    addPair(dl,'Tentativas próprias',m.calculated.length);addPair(dl,'Missões cumpridas',`${m.success} / ${m.calculated.length}`);addPair(dl,'Primeiras respostas corretas',`${m.firstCorrect} / ${m.answered}`);addPair(dl,'Inspeções da evidência/3D',m.inspections);card.append(dl);$('mission-cards').append(card);
  }
  $('causes').replaceChildren();if(!s.causes.length)$('causes').append(textNode('p',s.calculated.length?'Nenhuma restrição de erro nos registros carregados.':'Execute uma missão para observar suas restrições.','empty'));
  for(const c of s.causes){const row=textNode('div','','cause'),description=document.createElement('div');description.append(textNode('strong',c.code),textNode('p',c.message));row.append(description,textNode('strong',c.count,'count'));$('causes').append(row);}
  const dl=textNode('dl','','answers');addPair(dl,'Primeiras respostas corretas',`${s.firstCorrect} / ${s.answered}`);addPair(dl,'Últimas respostas corretas',`${s.latestCorrect} / ${s.answered}`);addPair(dl,'Respostas revisadas',s.revisions);addPair(dl,'De incorreta para correta',s.corrected);addPair(dl,'Escolhas de projeto registradas',s.decisions);addPair(dl,'Inspeções de evidência / 3D',s.inspections);addPair(dl,'Registros de revisão dos papéis',s.roleReviews);addPair(dl,'Cancelamentos / falhas técnicas',`${s.cancelled} / ${s.technicalErrors}`);$('answers').replaceChildren(dl);
  const wallet=textNode('dl','','answers');
  for(const [label,key] of [['Operações de compra','purchases'],['Devoluções','refunds'],['Reservas de carga','equips'],['Créditos gastos em instrumentos','spent'],['Créditos devolvidos','returned'],['Taxas de partidas','fees'],['Recompensas concedidas','rewards'],['Ciclos de uso consumidos','wear'],['Reinícios da carteira','resets']])addPair(wallet,label,s.inventory[key]);
  $('inventory-summary').replaceChildren(wallet);$('inventory-rows').replaceChildren();$('inventory-empty').hidden=s.inventory.events.length>0;
  const operationNames={buy:'Compra',return:'Devolução',purchase:'Compra',refund:'Devolução',equip:'Reserva de carga',launch:'Partida',complete:'Conclusão',cancel:'Cancelamento',reset:'Reinício da carteira'};
  for(const e of s.inventory.events.slice(-100).reverse()){
    const row=document.createElement('tr'),p=e.payload;
    for(const value of [profiles.get(e.sessionId)?.name??e.sessionId.slice(-6),operationNames[p.operation]??p.operation,MISSIONS[e.mission]?.name??'Carteira geral',`${p.balanceBefore} → ${p.balanceAfter}`,(p.wear??[]).reduce((n,w)=>n+Math.max(0,w.before-w.after),0),when(e.receivedAt)])row.append(textNode('td',String(value)));
    $('inventory-rows').append(row);
  }
  $('attempt-rows').replaceChildren();$('empty').hidden=s.attempts.length>0;
  for(const e of [...s.attempts].reverse()){
    const tr=document.createElement('tr'),person=profiles.get(e.sessionId),cell=textNode('th','','attempt-person');cell.scope='row';cell.append(textNode('strong',person?.name??'Perfil ainda não carregado'),textNode('small',e.sessionId.slice(-6)));if($('show-email').checked&&person)cell.append(textNode('small',person.email));tr.append(cell);
    tr.append(textNode('td',MISSIONS[e.mission]?.name??e.mission));const outcome=e.result?.outcome??e.payload.status,labels={success:'Cumpriu a missão',failure:'Rever projeto',invalid:'Incompatível',cancelled:'Cancelada',error:'Erro técnico'},resultCell=document.createElement('td');resultCell.append(textNode('span',labels[outcome]??outcome,`tag ${outcome}`));tr.append(resultCell,textNode('td',e.result?.score?`${e.result.score.total} / 100`:'—'));
    tr.append(textNode('td',e.result?`${e.result.validRecords} / ${e.result.requiredRecords}`:'—'),textNode('td',e.result?.diagnostics?.find(d=>d.severity==='error'&&d.code!=='MISSION_END')?.message??(e.result?.outcome==='success'?'Requisitos atendidos.':'Sem diagnóstico de engenharia.')),textNode('td',when(e.receivedAt)));
    const action=document.createElement('td'),button=textNode('button','Inspecionar');
    button.type='button';
    button.setAttribute('aria-label',`Inspecionar tentativa · ${MISSIONS[e.mission]?.name??e.mission} · ${person?.name??e.sessionId.slice(-6)} · ${when(e.receivedAt)}`);
    button.addEventListener('click',()=>inspect(e,button));action.append(button);tr.append(action);$('attempt-rows').append(tr);
  }
  $('detail').hidden=true;
  detailTrigger=null;
  if(focusTable&&!$('workspace').hidden)$('attempt-rows').closest('.table-scroll').focus();
  return s.attempts.length;
}
function inspect(e,trigger){const area=$('detail-content');area.replaceChildren(textNode('p',`${MISSIONS[e.mission]?.name} · tentativa ${e.payload.attemptId} · recebida em ${when(e.receivedAt)}`),textNode('h3','Configuração que o servidor avaliou'),textNode('pre',JSON.stringify(e.payload.config??{},null,2)));if(e.legacyInventory||e.result?.engineVersion==='ipe-bruno-r25-v1')area.append(textNode('p','Modelo anterior à loja: esta tentativa não altera saldo, estoque ou desgaste R27.','small'));if(e.result?.score){const score=e.result.score;area.append(textNode('h3',`Pontuação: ${score.total} / 100`),textNode('p',`Ciência válida: ${score.science}/60 · compatibilidade: ${score.engineering}/30 · folga de recursos: ${score.efficiency}/10. Regra ${score.rubricVersion}. Pontos do jogo não medem aprendizagem.`));}if(e.result){const dl=document.createElement('dl');dl.className='answers';for(const [label,key,unit] of [['Registros completos','deliveredRecords',''],['Registros válidos','validRecords',''],['Massa','massKg','kg'],['Orçamento usado','credits','créditos'],['Energia mínima','minEnergyWh','Wh'],['Dados transmitidos','downlinkedBits','bits'],['Fim simulado','completedAtS','s']])addPair(dl,label,`${e.result[key]??'—'} ${unit}`);area.append(dl,textNode('p',`Versão do modelo: ${e.result.engineVersion??'não informada'}. Capacidades e tempos são didáticos.`));const list=document.createElement('ol');for(const d of e.result.diagnostics??[])list.append(textNode('li',`T+${d.timeS}s · ${d.code}: ${d.message}`));area.append(list);}const link=textNode('a','Abrir o laboratório para investigar no 3D ↗');link.href='../lab/index.html';area.append(link,textNode('p','O link abre o jogo; não importa nem atribui esta tentativa a outro jogador.','small'));detailTrigger=trigger;$('detail').hidden=false;$('detail-title').focus();}
$('close-detail').addEventListener('click',()=>{$('detail').hidden=true;detailTrigger?.focus();detailTrigger=null;});
$('login-form').addEventListener('submit',async event=>{
  event.preventDefault();if(loginPending||busy)return;
  const button=$('login-form').querySelector('[type="submit"]');
  loginPending=true;button.setAttribute('aria-disabled','true');status('Verificando a chave de acesso…');
  try{await api({action:'admin-login',secret:$('access').value});$('access').value='';await loadPage(true);}
  catch(error){status(error.message);}
  finally{loginPending=false;button.removeAttribute('aria-disabled');}
});
$('logout').addEventListener('click',async()=>{try{await api({action:'admin-logout'});clearPrivate();status('Painel encerrado. Os dados privados foram removidos desta página.');}catch(error){status(error.message);}});
for(const id of ['mission','participant'])$(id).addEventListener('change',()=>{const count=render();status(`Filtro atualizado. ${count} ${count===1?'tentativa exibida':'tentativas exibidas'}.`);});
$('show-email').addEventListener('change',()=>{render();status($('show-email').checked?'E-mails exibidos na tabela.':'E-mails ocultos na tabela.');});
$('refresh').addEventListener('click',()=>loadPage(true));$('more').addEventListener('click',()=>loadPage());
$('export').addEventListener('click',()=>{if(busy)return;const csv=attemptsCsv(filtered(),[...profiles.values()],{includeEmail:$('show-email').checked});const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='missao-ipe-tentativas.csv';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status(`Exportadas apenas as tentativas carregadas e filtradas.${hasMore?' A consulta ainda está parcial.':''}`);});
void loadPage(true);
