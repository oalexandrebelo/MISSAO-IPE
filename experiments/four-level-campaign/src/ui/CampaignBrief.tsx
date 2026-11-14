import type { CampaignLevel } from '../campaign/index.ts';
import { Icon } from './Icon.tsx';
import './campaign.css';

export interface CampaignBriefProps {
  level: CampaignLevel;
  onMap?: () => void;
  compact?: boolean;
}

export function CampaignBrief({ level, onMap, compact = false }: CampaignBriefProps) {
  return <section className={`campaign-brief${compact ? ' campaign-brief-compact' : ''}`} aria-labelledby="campaign-brief-title">
    <div className="campaign-brief-heading"><span className="campaign-level-marker">0{level.number}<small>/ 04</small></span><div><p className="eyebrow">NÍVEL {level.number} · {level.supportLabel}</p><h2 id="campaign-brief-title">{level.title}</h2></div>{onMap ? <button className="text-button" type="button" onClick={onMap}><Icon name="back" size={15} />Mapa da campanha</button> : null}</div>
    <div className="campaign-brief-body"><div><p className="campaign-brief-speaker"><strong>{level.briefingBy.name}</strong><span>{level.briefingBy.role} · equipe fictícia</span></p><p className="campaign-story">{level.story}</p><p className="campaign-assignment">{level.assignment}</p></div><div className="campaign-target"><span className="eyebrow">PARA CONCLUIR ESTE NÍVEL</span><strong>{level.requirement}</strong><span>{level.contactLabel} · 180 min simulados</span></div></div>
    <details className="campaign-guide" open={level.number === 1 && !compact}>
      <summary><Icon name="book" size={16} /><span>{level.number === 4 ? 'Critérios e perguntas para sua decisão' : 'Pistas para investigar'}</span></summary>
      <ul>{level.clues.map(clue => <li key={clue}>{clue}</li>)}</ul>
      <p><strong>O que observar:</strong> {level.learningGoal}</p>
    </details>
    <details className="campaign-record-explainer">
      <summary><Icon name="layers" size={16} /><span>O que são os seis registros?</span></summary>
      <div className="campaign-record-grid"><div><strong>3 pontos</strong><p>Três locais do pacote histórico próximos a Rio Verde, no Cerrado.</p></div><div><strong>2 períodos</strong><p>Uma amostra de cada período por ponto permite a comparação temporal.</p></div><div><strong>6 registros</strong><p>Cada registro é a amostra de um ponto em um período. Um par completo permite uma comparação.</p></div></div>
      <p>São arquivos históricos Terra/MODIS. O CubeSat fictício simula o processamento e a entrega desses arquivos. Os 180 minutos pertencem à operação simulada, não à aquisição dos dados.</p>
      <p>BANDAS R/NIR entrega a informação para calcular NDVI no solo; ÍNDICE NDVI calcula a bordo e reduz o lote. Um lote parcial não libera o valor científico ausente.</p>
    </details>
  </section>;
}
