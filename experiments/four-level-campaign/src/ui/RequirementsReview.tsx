import { useId } from 'react';
import type { MissionEvent, MissionResult } from '../core/contracts.ts';
import { reviewRequirements } from '../lab/requirements-review.ts';
import type { RequirementGroup, RequirementRow, RequirementState } from '../lab/requirements-review.ts';
import { Icon } from './Icon.tsx';
import './requirements-review.css';

const number = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 3 });
const STATE_LABEL: Readonly<Record<RequirementState, string>> = {
  met: 'Atendido', unmet: 'Não atendido', incomplete: 'Não concluído',
};
const OUTCOME_LABEL: Readonly<Record<MissionResult['outcome'], string>> = {
  success: 'Missão cumprida', failure: 'Missão não cumprida', invalid: 'Projeto inválido',
};

function quantity(value: number, unit: string): string {
  if (value > 0 && value < 0.001) return `< 0,001 ${unit}`;
  return `${number.format(value)} ${unit}`;
}

function marginText(row: RequirementRow): string {
  if (row.margin === null) return 'Folga numérica não exposta';
  const amount = quantity(Math.abs(row.margin), row.unit);
  if (row.marginKind === 'loss') return row.margin < 0 ? `Perda acima do permitido: ${amount}` : 'Nenhuma perda registrada';
  if (row.marginKind === 'target') return row.margin < 0 ? `Faltam ${amount}` : row.margin === 0 ? 'Meta numérica atingida' : `Acima da meta: ${amount}`;
  if (row.margin < 0) return row.id === 'energy' ? `Déficit de ${amount}` : `Excesso de ${amount}`;
  return row.margin === 0 ? 'No limite, sem folga' : `Folga: ${amount}`;
}

function State({ state }: { state: RequirementState }) {
  return <span className={`rq-state rq-state-${state}`}><Icon name={state === 'met' ? 'check' : state === 'unmet' ? 'warning' : 'history'} size={14} />{STATE_LABEL[state]}</span>;
}

function Evidence({ row, onInspect }: { row: RequirementRow; onInspect: (event: MissionEvent) => void }) {
  const event = row.evidence;
  if (!event) return <span className="rq-static-evidence"><Icon name="book" size={15} />{row.evidenceFallback}</span>;
  return <button type="button" className="rq-evidence-button" onClick={() => onInspect(event)} aria-label={`Ver evidência de ${row.title}: ${row.evidenceLabel}`}>
    <span><strong>{row.evidenceLabel}</strong><small>T+{number.format(event.timeS / 60)} min</small></span><Icon name="arrow" size={16} />
  </button>;
}

export function RequirementsReview({ result, onInspect }: {
  result: MissionResult; onInspect: (event: MissionEvent) => void;
}) {
  const id = useId();
  const review = reviewRequirements(result);
  const groupTitles: Record<RequirementGroup, string> = {
    design: 'Limites de projeto', operation: `Operação até ${number.format(review.horizonS / 60)} min`, science: 'Entrega científica',
  };
  return <section className="rq-review" aria-labelledby={`${id}-title`}>
    <header className="rq-heading"><div><p className="rq-eyebrow">VERIFICAÇÃO DA EXECUÇÃO</p><h2 id={`${id}-title`}>Requisitos desta missão</h2></div><p>Uma entrega completa, uma operação dentro dos limites e um projeto viável são verificações distintas.</p></header>
    <div className="rq-groups" aria-label="Três grupos de requisitos">
      {review.groups.map(group => <div key={group.id} className={`rq-group rq-group-${group.state}`}>
        <h3>{groupTitles[group.id]}</h3><State state={group.state} />
        <p>{group.id === 'science' ? `${result.deliveredRecords}/${result.requiredRecords} registros válidos recebidos`
          : group.id === 'operation' ? `${number.format(review.completedAtS / 60)} de ${number.format(review.horizonS / 60)} min executados`
          : `${number.format(result.massKg)} kg · ${number.format(result.credits)} créditos`}</p>
        <span>{group.unmet ? `${group.unmet} não atendido(s)` : `${group.met} atendido(s)`}{group.incomplete ? ` · ${group.incomplete} não concluído(s)` : ''}</span>
      </div>)}
    </div>
    <p className={`rq-engine-outcome rq-engine-${review.outcome}`}>Resultado global do motor: <strong>{OUTCOME_LABEL[review.outcome]}.</strong>{review.outcome === 'invalid' ? ' Entregar todos os registros não compensa limites de projeto excedidos.' : review.outcome === 'failure' ? ' Uma meta atendida não substitui os outros requisitos.' : ' Os grupos acima detalham esse resultado.'}</p>
    <details className="rq-details">
      <summary><span><Icon name="layers" size={18} /> Ver requisitos e evidências</span><span className="rq-summary-count">{review.rows.length} verificações <Icon name="chevron" size={16} /></span></summary>
      <div className="rq-details-content">
        <p className="rq-scope" id={`${id}-scope`}>{review.horizonCompleted
          ? `A operação alcançou o horizonte de ${number.format(review.horizonS / 60)} min. Os estados abaixo usam as regras, os números e as violações desta execução.`
          : `A operação terminou em ${number.format(review.completedAtS / 60)} de ${number.format(review.horizonS / 60)} min. Falhas já registradas continuam falhas; ausência de violação antes do encerramento não aprova a operação restante.`}</p>
        <div className="rq-table-wrap" role="region" aria-label="Matriz de requisitos, medições, limites e evidências" aria-describedby={`${id}-scope`} tabIndex={0}>
          <table className="rq-table">
            <caption>Requisito → medido → limite e folga → evidência</caption>
            <colgroup><col className="rq-col-requirement" /><col className="rq-col-measurement" /><col className="rq-col-limit" /><col className="rq-col-evidence" /></colgroup>
            <thead><tr><th scope="col">Requisito</th><th scope="col">Medido nesta execução</th><th scope="col">Limite e folga</th><th scope="col">Evidência</th></tr></thead>
            <tbody>{review.rows.map(row => <tr key={row.id} className={`rq-row-${row.state}`}>
              <th scope="row"><div className="rq-row-title"><span>{row.code}</span><strong>{row.title}</strong></div><State state={row.state} /><p className="rq-rule">{row.rule}</p></th>
              <td><strong className="rq-number">{row.measured === null ? 'Não exposto' : quantity(row.measured, row.unit)}</strong><span className="rq-value-label">{row.measurementLabel}</span><p className="rq-measurement-note">{row.note}</p></td>
              <td><span className="rq-value-label">{row.limitLabel}</span><strong className="rq-number">{quantity(row.limit, row.unit)}</strong><p className={`rq-margin${row.margin !== null && row.margin < 0 ? ' rq-margin-negative' : ''}`}>{marginText(row)}</p>{row.group === 'operation' && !review.horizonCompleted ? <span className="rq-partial-note">Folga refere-se apenas ao trecho conhecido.</span> : null}</td>
              <td><Evidence row={row} onInspect={onInspect} /></td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="rq-reading-note">Os números exibidos têm até três casas decimais. Os estados são definidos antes da formatação; uma folga pequena não é convertida em aprovação nem em probabilidade de falha.</p>
      </div>
    </details>
    <p className="rq-method">Esta matriz verifica requisitos da simulação. Validar a finalidade da missão e demonstrar aprendizagem exige outras evidências, incluindo pesquisa com jogadores. <a href="https://nodis3.gsfc.nasa.gov/displayDir.cfm?Internal_ID=N_PR_7123_001D_&page_name=AppendixA" target="_blank" rel="noreferrer">Referência de método: NASA NPR 7123.1D, Apêndice A<span className="rq-sr-only"> (abre em nova aba)</span><Icon name="arrow" size={12} /></a></p>
  </section>;
}
