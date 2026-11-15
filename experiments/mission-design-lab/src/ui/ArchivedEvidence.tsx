import type { ExpeditionResult } from '../lab/scientific-expeditions.ts';
import { time } from './format.ts';
import './archived-evidence.css';

const measurement = (value: number, digits = 5) => value.toLocaleString('pt-BR', { maximumFractionDigits: digits });

/** Scientific values are immutable archive records; only delivery is simulated. */
export function ArchivedEvidence({ result, timeS, onInspect }: {
  result: ExpeditionResult; timeS: number; onInspect: (recordId: string) => void;
}) {
  const available = result.observations.filter(record => record.valid && record.deliveredAtS !== null && record.deliveredAtS <= timeS);
  const availableIds = new Set(available.map(record => record.id));
  const spectrum = result.expeditionId === 'telescope';
  const x = (wavelength: number) => 72 + (wavelength - 3.4) / 1.7 * 620;
  const y = (depth: number) => 238 - (depth - 2.06) / .22 * 190;

  return <section className="archive-evidence" aria-labelledby="archive-evidence-title">
    <div className="archive-heading"><div><p className="eyebrow">ARQUIVO CIENTÍFICO REAL · OPERAÇÃO DIDÁTICA</p><h3 id="archive-evidence-title">{spectrum ? 'O que a luz revela?' : 'Rochas que contam outra história.'}</h3></div><span className="archive-count">{available.length} / {result.requiredRecords} válidos disponíveis</span></div>
    <ol className="evidence-route" aria-label="Caminho da evidência"><li>Fonte publicada</li><li>{spectrum ? 'Espectrômetro' : 'Imagem de superfície'}</li><li>Memória a bordo</li><li>Contato com o solo</li><li>Interpretação</li></ol>
    <p>{spectrum ? 'O espectro de transmissão mede quanto da luz da estrela é bloqueado pelo planeta em cada comprimento de onda. Profundidade maior não significa mais luz: significa um trânsito mais profundo. As barras mostram a incerteza publicada de 1σ; não são variações causadas pelas suas escolhas.' : 'As dimensões publicadas descrevem seis rochas e clastos identificados nas imagens da OSIRIS-REx. O tamanho ajuda a comparar os alvos, mas não prova sua composição ou origem. Essa interpretação depende também das análises de cor e espectro do estudo.'}</p>
    {!spectrum ? <figure className="archive-context-image"><img src="./data/science/bennu-vesta-nasa-context.png" width="768" height="383" loading="lazy" alt="Duas vistas da superfície de Bennu com ampliações de rochas e clastos claros em meio a material mais escuro." /><figcaption>Imagem de contexto NASA/Goddard/University of Arizona. Os círculos da publicação não são uma correspondência com os seis registros deste exercício. <a href="https://www.nasa.gov/solar-system/nasas-osiris-rex-to-asteroid-bennu-youve-got-a-little-vesta-on-you/" target="_blank" rel="noreferrer">Ver publicação NASA ↗</a></figcaption></figure> : null}
    {spectrum ? <figure className="archive-spectrum"><svg viewBox="0 0 750 295" role="img" aria-label={`Espectro de WASP-39 b com ${available.length} de ${result.requiredRecords} medidas válidas disponíveis.`}>
      <rect x={x(4.1)} y="25" width={x(4.6) - x(4.1)} height="220" fill="currentColor" opacity=".055" />
      <text x={x(4.1) + 6} y="18">Faixa de CO₂ discutida no estudo</text>
      {[2.08, 2.12, 2.16, 2.2, 2.24, 2.28].map(tick => <g key={tick}><line x1="72" y1={y(tick)} x2="692" y2={y(tick)} className="archive-grid" /><text x="60" y={y(tick) + 4} textAnchor="end">{measurement(tick, 2)}%</text></g>)}
      {[3.5, 4, 4.5, 5].map(tick => <text key={tick} x={x(tick)} y="265" textAnchor="middle">{measurement(tick, 1)}</text>)}
      <text x="380" y="290" textAnchor="middle">Comprimento de onda (µm)</text>
      {available.map(record => { const wavelength = record.evidence.wavelengthMicrometers; const error = record.evidence.uncertainty; if (wavelength === undefined || typeof error !== 'number') return null; const px = x(wavelength); return <g key={record.id} className="archive-point"><title>{record.label}: {measurement(record.value)} ± {measurement(error)} %</title><line x1={px} x2={px} y1={y(record.value - error)} y2={y(record.value + error)} /><line x1={px - 5} x2={px + 5} y1={y(record.value - error)} y2={y(record.value - error)} /><line x1={px - 5} x2={px + 5} y1={y(record.value + error)} y2={y(record.value + error)} /><circle cx={px} cy={y(record.value)} r="5" /></g>; })}
      {!available.length ? <text x="380" y="137" textAnchor="middle">Sem registros válidos neste instante</text> : null}
    </svg><figcaption>Seis bins selecionados de uma única observação; sem interpolar lacunas ou ajustar um modelo atmosférico. A faixa destacada vem da interpretação publicada, não de uma detecção calculada pelo jogo.</figcaption></figure> : null}
    <div className="archive-records">{result.observations.map(record => {
      const received = availableIds.has(record.id);
      const produced = record.producedAtS !== null && record.producedAtS <= timeS;
      return <article key={record.id} className={received ? 'archive-record is-received' : 'archive-record'} data-record-id={record.id}>
        <p className="eyebrow">{record.id}</p><h4>{record.label}</h4>
        <p>{record.evidence.quantity}</p><p className="archive-value">{received ? measurement(record.value) : '—'} <span>{record.unit}</span></p>
        {received && typeof record.evidence.uncertainty === 'number' ? <p>± {measurement(record.evidence.uncertainty)} pontos percentuais (1σ)</p> : null}
        {received && typeof record.evidence.uncertainty === 'string' ? <p>{record.evidence.uncertainty}</p> : null}
        {received && record.dimensions ? <div className="archive-dimension"><div className="archive-scale" aria-hidden="true"><span style={{ width: `${record.value / 4 * 100}%` }} /></div><p>Escala comparativa do eixo maior: 0–4 m. Eixo menor: {measurement(record.dimensions.shortAxisM)} m · altura: {measurement(record.dimensions.heightM)} m. A barra não representa o formato medido da rocha.</p></div> : null}
        <p>{received ? `Recebido em T+${time(record.deliveredAtS!)}.` : produced ? 'Processado a bordo. Sem evidência válida completa no solo neste instante.' : 'Ainda não processado neste instante.'}</p>
        {received ? <><p><strong>Origem:</strong> Linha/identificador: {record.evidence.sourceRow}<br /><strong>Observação histórica:</strong> {record.evidence.observedAt}</p><p>{record.evidence.limitations}</p><a href={record.evidence.sourceUrl} target="_blank" rel="noreferrer">Ver estudo e procedência ↗</a><button type="button" className="text-button" onClick={() => onInspect(record.id)}>Rever esta entrega no 3D</button></> : null}
      </article>;
    })}</div>
    <p className="archive-boundary">O relógio T+ pertence ao exercício. Energia, tamanho dos pacotes e janelas são didáticos: não reproduzem a operação histórica da NASA. As escolhas alteram a entrega e a compatibilidade; nunca alteram a medida do arquivo.</p>
  </section>;
}
