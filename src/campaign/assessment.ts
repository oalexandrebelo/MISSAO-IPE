import { CATALOG_VERSION, ENGINE_VERSION } from '../core/contracts.ts';
import type { MissionResult } from '../core/contracts.ts';
import { getCampaignLevel } from './levels.ts';
import type { CampaignLevelId } from './levels.ts';

export interface CampaignRequirementAssessment {
  readonly id: 'scenario' | 'delivery' | 'operation' | 'challenge';
  readonly label: string;
  readonly passed: boolean;
  readonly observed: string;
  readonly target: string;
}

export interface CampaignAssessment {
  readonly levelId: CampaignLevelId;
  readonly passed: boolean;
  readonly engineSuccess: boolean;
  readonly deliveredRecords: number;
  readonly requirements: readonly CampaignRequirementAssessment[];
  readonly title: string;
  readonly explanation: string;
}

/** A read-only review. This function never awards progress or treats replay as a new attempt. */
export function assessCampaignResult(levelId: CampaignLevelId, result: MissionResult): CampaignAssessment {
  const level = getCampaignLevel(levelId);
  const validDelivery = result.deliveredRecords === 6 && result.requiredRecords === 6 && result.observations.length === 6
    && new Set(result.observations.map(item => item.id)).size === 6
    && result.observations.every(item => item.state === 'delivered' && item.scienceValid && item.ndvi !== null && Number.isFinite(item.ndvi));
  const engineSuccess = result.outcome === 'success' && result.violations.length === 0
    && result.engineVersion === ENGINE_VERSION && result.catalogVersion === CATALOG_VERSION;
  const requirements: CampaignRequirementAssessment[] = [
    { id: 'scenario', label: 'Condição de contato', passed: result.scenarioId === level.scenarioId,
      observed: result.scenarioId === 'long-contact' ? '2 contatos de 10 min' : '2 contatos de 4 min', target: level.contactLabel },
    { id: 'delivery', label: 'Entrega científica', passed: validDelivery,
      observed: `${result.deliveredRecords} de 6 registros válidos`, target: '6 de 6 recebidos por inteiro e válidos' },
    { id: 'operation', label: 'Resultado da operação', passed: engineSuccess,
      observed: result.outcome === 'success' ? 'Sucesso do motor' : result.outcome === 'invalid' ? 'Projeto inválido' : 'Meta da operação não atendida',
      target: 'Sucesso, respeitando todos os limites do motor' },
  ];
  if (level.challenge === 'compact-memory') requirements.push({ id: 'challenge', label: 'Memória do desafio', passed: result.config.buffer === 'compact', observed: result.config.buffer === 'compact' ? '512 Mbit' : '1.536 Mbit', target: 'Usar 512 Mbit' });
  if (level.challenge === 'preserve-bands') requirements.push({ id: 'challenge', label: 'Representação solicitada', passed: result.config.processing === 'bands', observed: result.config.processing === 'bands' ? 'BANDAS R/NIR' : 'ÍNDICE NDVI', target: 'Manter BANDAS R/NIR para cálculo no solo' });
  if (level.challenge === 'credit-margin') requirements.push({ id: 'challenge', label: 'Créditos do desafio', passed: Number.isFinite(result.credits) && result.credits <= 78, observed: `${result.credits} créditos utilizados`, target: 'Usar até 78 de 86 créditos' });
  const passed = requirements.every(item => item.passed);
  return {
    levelId, passed, engineSuccess, deliveredRecords: result.deliveredRecords, requirements,
    title: passed ? 'Objetivos do nível atendidos' : engineSuccess ? 'A operação funcionou. Falta atender ao desafio.' : 'Há evidências para o próximo projeto',
    explanation: passed ? level.successMessage : engineSuccess
      ? 'O motor registrou sucesso. Confira os critérios adicionais abaixo antes de concluir este nível.'
      : 'Use a fila, os eventos e os requisitos para decidir o que mudar. Você pode tentar de novo sem perder o progresso anterior.',
  };
}
