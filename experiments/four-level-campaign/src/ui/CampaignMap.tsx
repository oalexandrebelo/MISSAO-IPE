import { CAMPAIGN_LEVELS, isCampaignLevelAvailable, isCampaignLevelComplete } from '../campaign/index.ts';
import type { CampaignLevelId, CampaignProgress } from '../campaign/index.ts';
import { Icon } from './Icon.tsx';
import type { IconName } from './Icon.tsx';
import './campaign.css';

export interface CampaignMapProps {
  progress: CampaignProgress;
  onChoose: (id: CampaignLevelId) => void;
}
const LEVEL_ICONS: readonly IconName[] = ['signal', 'memory', 'route', 'spark'];

export function CampaignMap({ progress, onChoose }: CampaignMapProps) {
  const count = progress.completions.length;
  return <section className="campaign-map" aria-labelledby="campaign-map-title">
    <div className="campaign-map-heading">
      <div><p className="eyebrow">SUA CAMPANHA</p><h2 id="campaign-map-title">Quatro desafios.<br /><em>Ciência que chega.</em></h2></div>
      <div className="campaign-progress"><strong>{count}<span> / 4 níveis concluídos</span></strong><progress max={4} value={count} aria-label={`${count} de 4 níveis concluídos`} /><p>Avance no seu ritmo. Os níveis concluídos ficam disponíveis para repetir.</p></div>
    </div>
    <p className="campaign-map-intro">A mesma pergunta científica, seis registros históricos e quatro decisões de engenharia. Cada nível acrescenta um objetivo verificável.</p>
    <ol className="campaign-levels">
      {CAMPAIGN_LEVELS.map((level, index) => {
        const complete = isCampaignLevelComplete(progress, level.id);
        const available = isCampaignLevelAvailable(progress, level.id);
        const current = progress.activeLevelId === level.id && available;
        return <li key={level.id} className={`campaign-card${complete ? ' is-complete' : ''}${!available ? ' is-locked' : ''}${current ? ' is-current' : ''}`} aria-current={current ? 'step' : undefined}>
          <div className="campaign-card-top"><span className="campaign-level-number">0{level.number}</span><span className="campaign-card-state">{complete ? <><Icon name="check" size={14} /> Concluído</> : available ? 'Disponível' : 'Próximo desafio'}</span></div>
          <span className="campaign-card-icon"><Icon name={LEVEL_ICONS[index]!} size={24} /></span>
          <p className="campaign-support">{level.supportLabel}</p><h3>{level.title}</h3><p className="campaign-card-subtitle">{level.subtitle}</p>
          <p className="campaign-card-requirement">{level.requirement}</p>
          <span className="campaign-contact"><Icon name="signal" size={13} />{level.contactLabel}</span>
          <button className={`button ${current ? 'button-primary' : 'button-secondary'} campaign-card-action`} type="button" disabled={!available} onClick={() => onChoose(level.id)} aria-label={available ? `${complete ? 'Repetir' : 'Abrir'} nível ${level.number}: ${level.title}` : `Nível ${level.number} bloqueado: conclua o nível ${level.number - 1}`}>
            {complete ? 'Repetir nível' : available ? 'Abrir nível' : `Conclua o nível ${level.number - 1}`}{available ? <Icon name="arrow" size={16} /> : null}
          </button>
        </li>;
      })}
    </ol>
    <div className="campaign-map-note"><Icon name="info" size={16} /><p>São quatro desafios do mesmo caso no Cerrado. Os cenários usam contatos longos ou curtos; a campanha não simula novas órbitas ou destinos.</p></div>
  </section>;
}
