import { DEFAULT_CONFIG } from '../core/catalog.ts';
import type { MissionConfig, ScenarioId } from '../core/contracts.ts';

export const CAMPAIGN_VERSION = 'ipe-campaign-v1' as const;
export const CAMPAIGN_SCHEMA_VERSION = 1 as const;
export const CAMPAIGN_STORAGE_KEY = 'mission-ipe:campaign:v1';
export type CampaignLevelId = 'first-signal' | 'memory-tradeoff' | 'narrow-window' | 'science-delivered';
export type CampaignChallenge = 'baseline' | 'compact-memory' | 'preserve-bands' | 'credit-margin';

export interface CampaignLevel {
  readonly id: CampaignLevelId;
  readonly number: 1 | 2 | 3 | 4;
  readonly title: string;
  readonly subtitle: string;
  readonly scenarioId: ScenarioId;
  readonly contactLabel: string;
  readonly supportLabel: string;
  readonly challenge: CampaignChallenge;
  readonly startingConfig: Readonly<MissionConfig>;
  readonly briefingBy: Readonly<{ name: string; role: string }>;
  readonly story: string;
  readonly assignment: string;
  readonly requirement: string;
  readonly learningGoal: string;
  readonly clues: readonly string[];
  readonly reflection: string;
  readonly successMessage: string;
}

function level(input: CampaignLevel): CampaignLevel {
  return Object.freeze({ ...input, startingConfig: Object.freeze({ ...input.startingConfig }), briefingBy: Object.freeze({ ...input.briefingBy }), clues: Object.freeze([...input.clues]) });
}

/** Four assignments on the same archived dataset and the two existing engine scenarios. */
export const CAMPAIGN_LEVELS: readonly CampaignLevel[] = Object.freeze([
  level({
    id: 'first-signal', number: 1, title: 'Primeiro sinal', subtitle: 'Conheça o caminho dos dados',
    scenarioId: 'long-contact', contactLabel: '2 contatos de 10 min', supportLabel: 'Com orientação', challenge: 'baseline',
    startingConfig: DEFAULT_CONFIG,
    briefingBy: { name: 'Lina Duarte', role: 'Coordenação da missão' },
    story: 'Uma equipe fictícia que estuda a vegetação do Cerrado precisa comparar dois períodos em três pontos. Seu primeiro trabalho é fazer os seis registros históricos chegarem completos ao solo.',
    assignment: 'Conheça o projeto inicial, faça uma previsão e execute. Depois acompanhe um registro desde o processamento até a recepção.',
    requirement: 'Receber 6 de 6 registros válidos e concluir a operação dentro de todos os limites.',
    learningGoal: 'Entender como processamento, memória, energia e contato participam da entrega.',
    clues: [
      'O projeto inicial já atende a esta missão. Use a primeira execução para entender por quê.',
      'Um registro só conta após chegar inteiro e passar pela verificação científica.',
      'Na sala de missão, relacione os eventos de processamento, contato e recepção.',
    ],
    reflection: 'Qual evento mostra que um registro chegou inteiro? Por que transmitir alguns bits ainda não basta?',
    successMessage: 'Os três pares de registros chegaram. A equipe pode comparar os dois períodos nos três pontos.',
  }),
  level({
    id: 'memory-tradeoff', number: 2, title: 'Memória em disputa', subtitle: 'Guarde o que precisa chegar',
    scenarioId: 'long-contact', contactLabel: '2 contatos de 10 min', supportLabel: 'Investigue e redesenhe', challenge: 'compact-memory',
    startingConfig: { ...DEFAULT_CONFIG, buffer: 'compact' },
    briefingBy: { name: 'Caio Mendes', role: 'Engenharia de dados' },
    story: 'O novo projeto precisa usar a memória de 512 Mbit. Todos os lotes ficam prontos antes do primeiro contato; o que não couber pode ser perdido antes de existir chance de transmissão.',
    assignment: 'Entregue os mesmos seis registros mantendo a memória compacta. Investigue o volume dos lotes e o efeito de processar o índice a bordo.',
    requirement: 'Concluir com 6 de 6 registros válidos usando a memória de 512 Mbit.',
    learningGoal: 'Relacionar representação dos dados, espaço em memória e potência de processamento.',
    clues: [
      'Compare o volume dos seis lotes com a capacidade de 512 Mbit na revisão prévia.',
      'Processar ÍNDICE NDVI reduz cada lote de 180 para 60 Mbit, mas exige mais potência instantânea.',
      'Se houver perda ou encerramento, procure a causa nos eventos antes de alterar o projeto.',
    ],
    reflection: 'Como você manteve a memória compacta? Que outra exigência surgiu ao reduzir o volume dos dados?',
    successMessage: 'Os seis registros chegaram usando 512 Mbit. A escolha de representação mudou a necessidade de armazenamento.',
  }),
  level({
    id: 'narrow-window', number: 3, title: 'Janela estreita', subtitle: 'Faça as bandas chegarem ao solo',
    scenarioId: 'short-contact', contactLabel: '2 contatos de 4 min', supportLabel: 'Aplique o que aprendeu', challenge: 'preserve-bands',
    startingConfig: DEFAULT_CONFIG,
    briefingBy: { name: 'Joana Costa', role: 'Operação de solo' },
    story: 'Agora a equipe pede as bandas vermelha e infravermelho próximo para calcular o NDVI no solo. O tempo de cada contato cai para quatro minutos.',
    assignment: 'Preserve o processamento BANDAS R/NIR e encontre um projeto que entregue tudo nas janelas curtas. Confira o efeito do rádio sobre potência, massa e créditos.',
    requirement: 'Concluir com 6 de 6 registros válidos em contatos curtos, mantendo BANDAS R/NIR.',
    learningGoal: 'Dimensionar comunicação e potência sem ultrapassar o envelope do projeto.',
    clues: [
      'O pedido de bandas faz parte deste desafio: trocar para ÍNDICE não atende ao briefing.',
      'Mais taxa de transmissão também muda a potência exigida pelo rádio.',
      'Ao reforçar um subsistema, confira se o conjunto continua dentro de 3,6 kg e 86 créditos.',
    ],
    reflection: 'Qual escolha aumentou a entrega durante o contato? O que você mudou para sustentar essa escolha?',
    successMessage: 'As bandas dos seis registros chegaram em contatos curtos. O cálculo de NDVI no solo ficou disponível para os três pares.',
  }),
  level({
    id: 'science-delivered', number: 4, title: 'Ciência que chega', subtitle: 'Defenda uma solução com folga',
    scenarioId: 'short-contact', contactLabel: '2 contatos de 4 min', supportLabel: 'Decisão autônoma', challenge: 'credit-margin',
    startingConfig: { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' },
    briefingBy: { name: 'Ravi Almeida', role: 'Revisão de projeto e ciência' },
    story: 'A entrega funciona no projeto inicial deste nível. Seu trabalho final é atender à mesma pergunta científica reservando pelo menos oito dos 86 créditos disponíveis.',
    assignment: 'Projete uma entrega completa em contatos curtos com até 78 créditos. Escolha a representação dos dados e use as evidências da execução para explicar os compromissos.',
    requirement: 'Concluir com 6 de 6 registros válidos em contatos curtos, gastando no máximo 78 créditos.',
    learningGoal: 'Integrar as escolhas, avaliar folgas e explicar o que os dados recebidos permitem concluir.',
    clues: [
      'O teto de 78 créditos é uma meta adicional deste nível; o limite do motor continua sendo 86.',
      'Use a revisão prévia, a matriz de requisitos e o retorno científico para defender seu projeto.',
    ],
    reflection: 'Que compromisso permitiu reservar oito créditos? O que a comparação de NDVI descreve e o que ela, sozinha, não explica?',
    successMessage: 'A equipe recebeu os três pares com pelo menos oito créditos disponíveis. Você completou os quatro desafios do mesmo caso científico.',
  }),
]);

export function getCampaignLevel(id: CampaignLevelId): CampaignLevel {
  const found = CAMPAIGN_LEVELS.find(item => item.id === id);
  if (!found) throw new RangeError(`Nível desconhecido: ${String(id)}.`);
  return found;
}

export function isCampaignLevelId(value: unknown): value is CampaignLevelId {
  return CAMPAIGN_LEVELS.some(item => item.id === value);
}

export function getNextCampaignLevel(id: CampaignLevelId): CampaignLevel | null {
  const current = getCampaignLevel(id);
  return CAMPAIGN_LEVELS[current.number] ?? null;
}
