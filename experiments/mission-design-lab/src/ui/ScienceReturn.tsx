import { useId } from 'react';
import type { MissionResult } from '../core/contracts.ts';
import { buildScienceReturn } from '../lab/science-return.ts';
import type { ReturnedScienceSample, ScienceReturnStatus } from '../lab/science-return.ts';
import { Icon } from './Icon.tsx';
import './mission-concept.css';

const NDVI = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
const DIFFERENCE = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4, signDisplay: 'exceptZero' });
const COORDINATE = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
const SAMPLE_STATUS: Record<Exclude<ScienceReturnStatus, 'ready'>, string> = {
  missing: 'Não recebido', unavailable: 'Valor indisponível', partial: 'Recepção parcial',
  queued: 'Em memória', lost: 'Registro perdido', 'not-produced': 'Não produzido', invalid: 'Ciência inválida',
};
function displayDate(iso: string): string { return iso.split('-').reverse().join('/'); }
function coordinate(value: number, latitude: boolean): string {
  return `${COORDINATE.format(Math.abs(value))}° ${latitude ? value < 0 ? 'S' : 'N' : value < 0 ? 'O' : 'L'}`;
}
function ReturnedValue({ sample }: { sample: ReturnedScienceSample }) {
  return sample.ndvi !== null ? <><span className="srn-value">{NDVI.format(sample.ndvi)}</span><span className="srn-value-note">Recebido e válido</span></> : <><span className="srn-empty" aria-hidden="true">—</span><span className="srn-value-note srn-not-ready">{sample.status === 'ready' ? 'Valor indisponível' : SAMPLE_STATUS[sample.status]}</span></>;
}

export function ScienceReturn({ result, onInspect }: { result: MissionResult; onInspect?: (recordId: string) => void }) {
  const titleId = useId(), precisionId = useId();
  const summary = buildScienceReturn(result);
  const firstPair = summary.pairs[0]!;
  const [earlier, later] = firstPair.samples;
  const complete = summary.availableComparisons === summary.totalComparisons;
  return <section className="srn-return" aria-labelledby={titleId}>
    <div className="srn-heading"><div><p className="srn-eyebrow">O QUE OS DADOS ENTREGUES PERMITEM LER</p><h2 id={titleId}>Dois períodos. Três pontos.</h2></div><span className={`srn-status ${complete ? 'srn-status-complete' : ''}`}><Icon name={complete ? 'check' : 'memory'} size={15} /><span><strong>{summary.availableComparisons} de {summary.totalComparisons}</strong> comparações possíveis</span></span></div>
    <p className="srn-intro">NDVI é um índice de vegetação, sem unidade. A diferença só aparece quando as duas observações do ponto chegaram completas e válidas.</p>
    <p className="srn-scroll-hint">Role a tabela para comparar os dois períodos.</p>
    <div className="srn-table-wrap" role="region" aria-label="Comparação científica por ponto e período" tabIndex={0}><table className="srn-table" aria-describedby={precisionId}>
      <caption>Valores entregues por ponto e data da observação · Rota {result.config.processing === 'bands' ? 'BANDAS R/NIR' : 'ÍNDICE NDVI'}</caption>
      <thead><tr><th scope="col">Ponto</th><th scope="col"><span>1º período</span><time dateTime={earlier.observationDate}>{displayDate(earlier.observationDate)}</time></th><th scope="col"><span>2º período</span><time dateTime={later.observationDate}>{displayDate(later.observationDate)}</time></th><th scope="col">Variação<small>2º − 1º</small></th></tr></thead>
      <tbody>{summary.pairs.map(pair => <tr key={pair.point}>
        <th scope="row"><span className="srn-point">{pair.point}</span><span className="srn-coordinates" aria-label={`Localização solicitada: latitude ${coordinate(pair.latitude, true)}, longitude ${coordinate(pair.longitude, false)}`}><span>{coordinate(pair.latitude, true)}</span><span>{coordinate(pair.longitude, false)}</span></span></th>
        {pair.samples.map(sample => <td key={sample.recordId}><ReturnedValue sample={sample} />{onInspect ? <button className="text-button" type="button" onClick={() => onInspect(sample.recordId)} aria-label={`Seguir ${sample.recordId} na trilha e no 3D`}>Seguir registro ↗</button> : null}</td>)}
        <td>{pair.difference !== null ? <><span className={`srn-change ${pair.difference > 0 ? 'srn-increase' : pair.difference < 0 ? 'srn-decrease' : ''}`}>{DIFFERENCE.format(pair.difference)}</span><span className="srn-value-note">{pair.difference > 0 ? 'Aumento do índice' : pair.difference < 0 ? 'Redução do índice' : 'Sem diferença'}</span></> : <><span className="srn-empty" aria-hidden="true">—</span><span className="srn-value-note srn-not-ready">Aguarda par completo</span></>}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="srn-precision" id={precisionId}>NDVI da execução, exibido com quatro casas decimais. Variação = segundo valor − primeiro, sem porcentagem.</p>
    <div className="srn-reading-note"><Icon name="info" size={17} /><p>A variação observada não identifica causa nem representa todo o Cerrado. A, B e C são identificadores dos três pontos do arquivo.</p></div>
    <details className="srn-method"><summary>Como ler as datas e a precisão</summary><div><p>As observações de <strong>{displayDate(earlier.observationDate)}</strong> e <strong>{displayDate(later.observationDate)}</strong> pertencem aos compostos iniciados em {displayDate(earlier.compositeStart)} e {displayDate(later.compositeStart)}. Essas datas históricas são independentes dos 180 minutos simulados.</p><p>O cálculo a partir das bandas e o índice do produto podem diferir por quantização. A tabela preserva o NDVI retornado pela rota desta execução; nenhum valor de referência preenche uma entrega ausente. A diferença usa os valores anteriores ao arredondamento da exibição.</p><a href="https://modis-land.gsfc.nasa.gov/pdf/MOD13_User_Guide_V61.pdf" target="_blank" rel="noreferrer">Guia científico MOD13 V6.1 <span aria-hidden="true">↗</span><span className="sr-only"> (PDF, abre em nova aba)</span></a></div></details>
    <p className="srn-simulation"><strong>SIMULAÇÃO</strong> O CubeSat didático entrega arquivos históricos Terra/MODIS. Comparações disponíveis não substituem a meta: seis registros válidos e todos os limites da missão atendidos.</p>
  </section>;
}
