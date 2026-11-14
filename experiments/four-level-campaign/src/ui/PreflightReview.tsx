import { useId } from 'react';
import type { MissionConfig, Scenario } from '../core/contracts.ts';
import { reviewPreflight } from '../lab/preflight.ts';
import type { PreflightStatus } from '../lab/preflight.ts';
import { Icon } from './Icon.tsx';
import { bits, minutes, number, time } from './format.ts';
import './preflight-review.css';

const STATUS_LABELS: Record<PreflightStatus, string> = {
  'within-limit': 'Dentro do limite',
  'limit-exceeded': 'Limite excedido',
  'execution-required': 'Depende da execução',
};

function Condition({ status }: { status: PreflightStatus }) {
  return <span className={`pf-condition pf-condition-${status}`}><Icon name={status === 'limit-exceeded' ? 'warning' : status === 'within-limit' ? 'check' : 'info'} size={14} />{STATUS_LABELS[status]}</span>;
}

export function PreflightReview({ config, scenario }: { config: MissionConfig; scenario: Scenario }) {
  const titleId = useId();
  const { requiredRecords, transmission, memory, peak, energy } = reviewPreflight(config, scenario);
  return <details className="pf-review">
    <summary className="pf-summary"><Icon name="route" size={19} /><span>Conferir plano de operação<small>Contas opcionais antes da execução</small></span><Icon name="chevron" size={17} /></summary>
    <section className="pf-content" aria-labelledby={titleId}>
      <div className="pf-heading"><p className="pf-eyebrow">REVISÃO DO PLANO</p><h3 id={titleId}>Antes de executar, confira as condições.</h3><p>Estas contas usam as escolhas e os horários planejados. A execução ainda precisa verificar energia, fila e entrega.</p></div>
      <div className="pf-grid">
        <article className="pf-card"><div className="pf-card-top"><Icon name="signal" size={20} /><span>01 / TRANSMISSÃO</span></div><h4>Tempo para enviar os dados</h4><Condition status={transmission.status} />
          <dl className="pf-values"><div><dt>Volume dos {requiredRecords} registros</dt><dd>{bits(transmission.requiredBits)}</dd></div><div><dt>Teto ideal dos contatos permitidos</dt><dd>{transmission.ceilingBits === null ? 'A verificar' : bits(transmission.ceilingBits)}</dd></div></dl>
          <p className="pf-explanation">{transmission.allowedContactSeconds === null ? 'A agenda não permite uma comparação simples. Verifique os contatos na execução.' : `${transmission.allowedContactCount} ${transmission.allowedContactCount === 1 ? 'contato permitido' : 'contatos permitidos'}, somando ${minutes(transmission.allowedContactSeconds)}, a ${number(transmission.rateBps / 1_000_000)} Mbit/s úteis.`}</p>
          <p className="pf-assumption">Teto ideal: supõe dados disponíveis e potência para transmitir durante todo esse tempo. Caber nesse teto é necessário, mas não garante entrega.</p>
        </article>
        <article className="pf-card"><div className="pf-card-top"><Icon name="memory" size={20} /><span>02 / MEMÓRIA</span></div><h4>Fila antes do primeiro contato</h4><Condition status={memory.status} />
          <dl className="pf-values"><div><dt>Acúmulo previsto antes da janela</dt><dd>{memory.requiredBeforeFirstContactBits === null ? 'A verificar' : bits(memory.requiredBeforeFirstContactBits)}</dd></div><div><dt>Capacidade da memória</dt><dd>{bits(memory.capacityBits)}</dd></div></dl>
          <p className="pf-explanation">{memory.firstAllowedContactS === null ? 'Sem uma primeira janela permitida e uma agenda clara, confira a ocupação na execução.' : `${memory.completedBeforeFirstContact} ${memory.completedBeforeFirstContact === 1 ? 'lote termina' : 'lotes terminam'} até T+${time(memory.firstAllowedContactS)}, quando começa o primeiro contato permitido.`}</p>
          <p className="pf-assumption">{memory.allJobsBeforeFirstContact ? 'Neste perfil, todos os lotes são produzidos antes de transmitir. A memória precisa acomodar esse acúmulo sem descarte.' : 'Esta conta cobre somente o trecho anterior à primeira janela. Trabalhos posteriores e contatos intercalados exigem conferir a fila na execução.'}</p>
        </article>
        <article className="pf-card"><div className="pf-card-top"><Icon name="battery" size={20} /><span>03 / POTÊNCIA DE PICO</span></div><h4>Potência exigida da bateria</h4><Condition status={peak.status} />
          <dl className="pf-values"><div><dt>Maior demanda nas condições conferidas</dt><dd>{peak.knownRequiredW === null ? 'A verificar' : `${peak.scopeComplete ? '' : 'Ao menos '}${number(peak.knownRequiredW)} W`}</dd></div><div><dt>Limite de descarga da bateria</dt><dd>{number(peak.maxDischargeW)} W</dd></div></dl>
          <ul className="pf-reference-list"><li>{peak.processing ? `Processamento ${peak.processing.illumination === 'sunlit' ? 'iluminado' : 'na sombra'}: ${number(peak.processing.requiredBatteryW)} W na bateria.` : 'Processamento: conferir as condições na execução.'}</li><li>{peak.radio ? `Rádio ${peak.radio.illumination === 'sunlit' ? 'iluminado' : 'na sombra'}: ${number(peak.radio.requiredBatteryW)} W na bateria enquanto transmite.` : 'Rádio: a fila e as mudanças de iluminação exigem conferir a demanda na execução.'}</li></ul>
          <p className="pf-assumption">Desconta a geração solar de cada condição e inclui a perda de descarga. Ter energia guardada em Wh não garante fornecer o pico em W.</p>
        </article>
        <article className="pf-card"><div className="pf-card-top"><Icon name="sun" size={20} /><span>04 / ENERGIA ACUMULADA</span></div><h4>Energia ao longo da missão</h4><Condition status={energy.status} />
          <dl className="pf-values"><div><dt>Energia inicial</dt><dd>{number(energy.initialEnergyWh)} Wh</dd></div><div><dt>Reserva declarada</dt><dd>{number(energy.reserveWh)} Wh</dd></div></dl>
          <p className="pf-explanation">O saldo depende da sequência de luz, sombra, processamento, transmissão e recarga.</p><p className="pf-assumption">O relatório da execução calcula a menor energia e verifica a reserva. Esta revisão não prevê esse saldo.</p>
        </article>
      </div>
      <p className="pf-limitation"><Icon name="info" size={17} /><span><strong>Passar nestas contas não garante 6/6.</strong> São condições parciais do plano. Registre sua previsão e execute para investigar o resultado completo.</span></p>
    </section>
  </details>;
}
