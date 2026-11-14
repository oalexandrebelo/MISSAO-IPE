import { getNextCampaignLevel } from '../campaign/index.ts';
import type { CampaignAssessment, CampaignLevel, CampaignLevelId } from '../campaign/index.ts';
import { Icon } from './Icon.tsx';
import './campaign.css';

export interface CampaignDebriefProps {
  level: CampaignLevel;
  assessment: CampaignAssessment;
  completed: boolean;
  onNext: (id: CampaignLevelId) => void;
  onRetry: () => void;
  onMap: () => void;
}

export function CampaignDebrief({ level, assessment, completed, onNext, onRetry, onMap }: CampaignDebriefProps) {
  const nextLevel = getNextCampaignLevel(level.id);
  const canContinue = assessment.passed && completed;
  return <section className={`campaign-debrief${canContinue ? ' campaign-debrief-success' : ''}`} aria-labelledby="campaign-debrief-title">
    <div className="campaign-debrief-heading"><div><p className="eyebrow">NÍVEL {level.number} · {level.title}</p><h2 id="campaign-debrief-title">{canContinue ? nextLevel ? 'Nível concluído.' : 'Campanha concluída.' : assessment.title}</h2></div><span className="campaign-debrief-mark"><Icon name={canContinue ? 'check' : 'search'} size={27} /></span></div>
    <p className="campaign-debrief-lead">{assessment.explanation}</p>
    <ul className="campaign-requirements" aria-label="Verificação dos objetivos do nível">
      {assessment.requirements.map(requirement => <li key={requirement.id} className={requirement.passed ? 'is-met' : 'is-pending'}><Icon name={requirement.passed ? 'check' : 'info'} size={18} /><div><strong>{requirement.label}</strong><span>{requirement.observed}</span><small>Objetivo: {requirement.target}</small></div><span className="campaign-requirement-state">{requirement.passed ? 'Atendido' : 'Pendente'}</span></li>)}
    </ul>
    <div className="campaign-reflection-prompt"><Icon name="book" size={18} /><p><strong>Uma pergunta para seu caderno</strong>{level.reflection}<small>Sua explicação ajuda a refletir sobre o projeto. Ela não recebe nota automática e não bloqueia a progressão.</small></p></div>
    {completed && !assessment.passed ? <p className="campaign-prior-completion"><Icon name="check" size={15} />A conclusão anterior deste nível continua registrada.</p> : null}
    <div className="campaign-debrief-actions">
      {canContinue && nextLevel ? <button className="button button-primary" type="button" onClick={() => onNext(nextLevel.id)}>Próximo: {nextLevel.title}<Icon name="arrow" size={17} /></button> : canContinue ? <button className="button button-primary" type="button" onClick={onMap}>Rever a campanha<Icon name="route" size={17} /></button> : <button className="button button-primary" type="button" onClick={onRetry}>Revisar o projeto<Icon name="arrow" size={17} /></button>}
      {canContinue ? <button className="button button-secondary" type="button" onClick={onRetry}>Experimentar outro projeto</button> : null}
      <button className="text-button" type="button" onClick={onMap}>Pausar e voltar ao mapa</button>
    </div>
    <p className="campaign-pause-note">Você pode voltar ao mapa a qualquer momento. Novas tentativas não apagam níveis concluídos.</p>
  </section>;
}
