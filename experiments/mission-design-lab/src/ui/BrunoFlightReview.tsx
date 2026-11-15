import { useState } from 'react';
import { describeBrunoComparison } from '../lab/bruno-flight-plan.ts';
import { BRUNO_MISSIONS } from '../lab/bruno-missions.ts';
import type { BrunoResult } from '../lab/bruno-missions.ts';

export function BrunoFlightReview({ a, b, viewingA, onView, onSave }: {
  a: BrunoResult; b: BrunoResult; viewingA: boolean; onView: (a: boolean) => void; onSave: () => void;
}) {
  const comparison = describeBrunoComparison(a, b);
  return <section className="bruno-panel bruno-comparison" aria-label="Revisão de voo A/B">
    <div className="bruno-comparison-heading"><div><p>Antes de lançar</p><h2>Qual plano responde à pergunta?</h2></div>
      <button type="button" className="bruno-action bruno-secondary" onClick={onSave}>Fixar montagem atual como A</button></div>
    <p>O plano A fica guardado. Suas alterações formam B. Esta previsão usa o mesmo motor da tentativa e não soma pontos.</p>
    <div className="bruno-craft-controls" role="group" aria-label="Plano mostrado no 3D">
      <button type="button" className="bruno-action bruno-secondary" aria-pressed={viewingA} onClick={() => onView(true)}>Ver A no 3D</button>
      <button type="button" className="bruno-action bruno-secondary" aria-pressed={!viewingA} onClick={() => onView(false)}>Ver B no 3D</button>
    </div>
    <div className="bruno-comparison-table"><table><caption>Previsão dos recursos e da entrega</caption><thead><tr><th scope="col">Recurso</th><th scope="col">A</th><th scope="col">B</th><th scope="col">Diferença B − A</th></tr></thead>
      <tbody>{comparison.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.a} {row.unit}</td><td>{row.b} {row.unit}</td><td>{row.b - row.a > 0 ? '+' : ''}{row.b - row.a} {row.unit === 'de 6' ? 'registros' : row.unit}</td></tr>)}</tbody></table></div>
    <p>{comparison.explanation}</p>
    {comparison.changes.length ? <ul>{comparison.changes.map(change => <li key={change.key}><strong>{change.label}:</strong> {change.from} → {change.to}</li>)}</ul> : null}
    <p><strong>O limite de B:</strong> {b.diagnostics[0]?.message ?? 'O projeto prevê seis registros válidos dentro dos limites do exercício.'}</p>
  </section>;
}

export type BrunoRole = 'launch' | 'space' | 'ground' | 'user';
export function BrunoRoleReview({ result, onReview }: { result: BrunoResult; onReview?: (roles: BrunoRole[]) => void }) {
  const [reviewed, setReviewed] = useState<BrunoRole[]>([]);
  const mission = BRUNO_MISSIONS[result.missionId];
  const roles: { id: BrunoRole; title: string; text: string; lesson: string }[] = [
    { id: 'launch', title: 'Lançamento', text: `${result.massKg} / ${result.maxMassKg} kg; ${result.credits} / ${result.budget} créditos; chegada prevista em ${result.travelDays} dias.`, lesson: 'Um instrumento mais pesado pode exigir outro lançador e consumir o orçamento.' },
    { id: 'space', title: 'Segmento espacial', text: `${result.generatedRecords} registros produzidos. ${result.acquisitionEnergyWh} Wh previstos para coleta.`, lesson: 'Instrumento, energia e proteção precisam sustentar a medição pedida.' },
    { id: 'ground', title: 'Segmento terrestre', text: `${result.receivedRecords} registros recebidos; janela de ${result.linkCapacityMb} MB.`, lesson: 'Dados armazenados a bordo só chegam à equipe se couberem no contato.' },
    { id: 'user', title: 'Equipe científica', text: `${result.deliveredRecords} de ${result.requiredRecords} registros válidos. ${result.outcome === 'success' ? mission.evidence : 'A pergunta científica ainda não foi atendida pelo conjunto completo.'}`, lesson: 'Receber um arquivo não garante a grandeza correta nem uma medida calibrada.' },
  ];
  return <section className="bruno-panel bruno-role-review" aria-labelledby="bruno-roles-title">
    <h2 id="bruno-roles-title">Quatro equipes, uma missão</h2><p>Jogue sozinho ou divida a leitura no mesmo dispositivo. Explique a consequência de cada segmento antes de redesenhar.</p>
    <div>{roles.map(role => <article key={role.id}><h3>{role.title}</h3><p>{role.text}</p><p>{role.lesson}</p>
      <button type="button" className="bruno-action bruno-secondary" aria-pressed={reviewed.includes(role.id)} onClick={() => {
        const next = reviewed.includes(role.id) ? reviewed.filter(id => id !== role.id) : [...reviewed, role.id];
        setReviewed(next); onReview?.(next);
      }}>{reviewed.includes(role.id) ? 'Revisado' : 'Marcar como revisado'}<span className="sr-only">: {role.title}</span></button>
    </article>)}</div><p>{reviewed.length} de 4 segmentos revisados. Este registro de leitura não é uma prova de aprendizagem.</p>
  </section>;
}
