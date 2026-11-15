export const MISSIONS = {
  cerrado: { name: 'Cerrado · ler a Terra', lesson: 'Distinguir potência de energia; entregar os dois períodos antes de comparar o NDVI. Ausência de dados não é ausência de vegetação.' },
  bennu: { name: 'Bennu · ler uma superfície', lesson: 'Produzir não basta: os dados precisam chegar ao solo. O serviço de contatos muda agenda e custo, mantendo a taxa do rádio.' },
  telescope: { name: 'Webb · ler a luz', lesson: 'Escolher o instrumento pela pergunta e ler as incertezas do espectro. Seis bins não reproduzem a descoberta molecular completa.' },
};
export function summarize(events) {
  const unique = [...new Map(events.map(e => [`${e.sessionId}:${e.id}`, e])).values()].sort((a,b) => a.receivedAt.localeCompare(b.receivedAt) || (a.batchId && a.batchId === b.batchId ? a.receivedOrder-b.receivedOrder : a.id.localeCompare(b.id)));
  const attempts = [...new Map(unique.filter(e => e.kind === 'attempt').map(e => [`${e.sessionId}:${e.payload.attemptId}`,e])).values()];
  const calculated = attempts.filter(e => e.payload.status === 'completed' && e.result);
  const questions = new Map();
  for (const e of unique.filter(e => e.kind === 'assessment' && typeof e.result?.correct === 'boolean')) {
    const key = `${e.sessionId}:${e.mission}:${e.payload.question}:${e.payload.questionVersion}`;
    const prior = questions.get(key);
    if (prior) { prior.last = e; prior.responses++; }
    else questions.set(key,{ first:e,last:e,responses:1 });
  }
  const causes = new Map();
  for(const a of calculated) for(const d of new Map((a.result.diagnostics??[]).filter(d=>d.severity==='error'&&d.code!=='MISSION_END').map(d=>[d.code,d])).values()) {
    const previous=causes.get(d.code); causes.set(d.code,{...d,count:(previous?.count??0)+1});
  }
  const answers=[...questions.values()];
  return { attempts,calculated,success:calculated.filter(e=>e.result.outcome==='success').length,invalid:calculated.filter(e=>e.result.outcome==='invalid').length,
    cancelled:attempts.filter(e=>e.payload.status==='cancelled').length,technicalErrors:attempts.filter(e=>e.payload.status==='error').length,
    firstCorrect:answers.filter(e=>e.first.result.correct).length,answered:answers.length,latestCorrect:answers.filter(e=>e.last.result.correct).length,
    revisions:answers.reduce((n,e)=>n+e.responses-1,0),corrected:answers.filter(e=>!e.first.result.correct&&e.last.result.correct).length,
    decisions:unique.filter(e=>e.kind==='decision').length,inspections:unique.filter(e=>e.kind==='inspection').length,
    roleReviews:unique.filter(e=>e.kind==='role_review').length,causes:[...causes.values()].sort((a,b)=>b.count-a.count||a.code.localeCompare(b.code)) };
}
export function csvCell(value) {
  let text=String(value??'');
  if (/^[\s]*[=+@-]|^[\t\r\n]/.test(text)) text="'"+text;
  return '"'+text.replaceAll('"','""')+'"';
}
export function attemptsCsv(events,profiles,{includeEmail=false}={}) {
  const people=new Map(profiles.map(p=>[p.sessionId,p]));
  const rows=[['participacao_id','nome',...(includeEmail?['email']:[]),'missao','tentativa_id','recebida_em','estado','resultado','pontuacao','pontos_ciencia','pontos_compatibilidade','pontos_recursos','regra_pontuacao','registros_validos','registros_recebidos','registros_exigidos','causa']];
  for(const e of summarize(events).attempts) rows.push([e.sessionId,people.get(e.sessionId)?.name??'',...(includeEmail?[people.get(e.sessionId)?.email??'']:[]),e.mission,e.payload.attemptId,e.receivedAt,e.payload.status,e.result?.outcome??'',e.result?.score?.total??'',e.result?.score?.science??'',e.result?.score?.engineering??'',e.result?.score?.efficiency??'',e.result?.score?.rubricVersion??'',e.result?.validRecords??'',e.result?.deliveredRecords??'',e.result?.requiredRecords??'',e.result?.diagnostics?.find(d=>d.severity==='error'&&d.code!=='MISSION_END')?.code??'']);
  return '\ufeff'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n');
}
