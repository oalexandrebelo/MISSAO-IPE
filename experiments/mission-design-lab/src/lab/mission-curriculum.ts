import { DEFAULT_CONFIG } from '../core/catalog.ts';
import { simulateMission } from '../core/engine.ts';
import type { MissionResult } from '../core/contracts.ts';
import { simulateExpedition } from './scientific-expeditions.ts';
import type { ExpeditionConfig, ExpeditionResult } from './scientific-expeditions.ts';

export type LearningMission = 'cerrado' | 'bennu' | 'telescope';
export const MISSION_CURRICULUM = {
  cerrado: {
    name: 'Cerrado', destination: 'TERRA', discipline: '01 / ECOLOGIA', title: 'O que mudou aqui?',
    question: 'Como comparar a vegetação em três lugares, entre duas datas, sem confundir falta de dados com mudança?',
    beneficiary: 'O Terra/MODIS fornece dados para estudar a vegetação. Aqui, o recorte histórico reúne três pontos próximos a Rio Verde em dois períodos de 2024.',
    purpose: 'Aprender a transformar dados em uma comparação responsável sobre o nosso próprio planeta.',
    learn: ['Distinguir potência (W) de energia (Wh).', 'Negociar processamento, volume de dados e contato.', 'Reconhecer o que uma diferença de NDVI não explica.'],
    evidence: 'Três pares de observações históricas Terra/MODIS, com origem e qualidade identificadas.',
    boundary: 'Arquivos históricos reais; CubeSat e operação são didáticos. O índice não identifica sozinho a causa da mudança.',
    cta: 'Projetar missão do Cerrado', experiment: 'Menos dados. Mais exigência?',
    prediction: 'Mantendo a bateria pequena e os contatos curtos, trocar somente BANDAS por ÍNDICE aumenta a entrega válida?',
    changed: 'Somente o processamento muda. Bateria, painel, rádio, memória, política e cenário são iguais.',
    explanation: 'Calcular o índice reduz o volume por lote, mas exige mais potência durante o processamento. A bateria pode ter energia armazenada e ainda assim não sustentar o pico. Investigue o primeiro evento de falha antes de ampliar qualquer recurso.',
    conclusion: 'Comparar os índices recebidos, preservando as lacunas e sem atribuir uma causa apenas ao NDVI.',
    overclaim: 'Concluir que toda redução do índice prova desmatamento.',
    missing: 'Preencher uma observação ausente com zero para completar o mapa.',
    source: 'https://science.nasa.gov/earth/earth-observatory/measuring-vegetation-ndvi-evi/',
  },
  bennu: {
    name: 'Bennu', destination: 'BENNU', discipline: '02 / GEOLOGIA PLANETÁRIA', title: 'Antes de tocar, conhecer.',
    question: 'Que observações precisam chegar para comparar três setores da superfície antes de planejar uma investigação?',
    beneficiary: 'A OSIRIS-REx precisou mapear a superfície rochosa de Bennu antes de escolher Nightingale, em 2019. Imagens recebidas em solo sustentaram a seleção.',
    purpose: 'Descobrir por que o trabalho em solo faz parte da missão e por que observar não é o mesmo que entregar ciência.',
    learn: ['Escolher um instrumento a partir da pergunta.', 'Distinguir dados produzidos de dados recebidos.', 'Explicar o efeito da duração de um contato.'],
    evidence: 'Seis registros sintéticos de levantamento; o modelo geométrico de Bennu é uma referência NASA.',
    boundary: 'O episódio da OSIRIS-REx é real. Setores, medidas e recursos do exercício são sintéticos; o jogo não escolhe um local real de coleta nem calcula a viagem.',
    cta: 'Explorar missão Bennu', experiment: 'A nave já observou. E o solo?',
    prediction: 'Com câmera e energia ampliada, aumentar apenas os contatos de 120 para 500 segundos melhora a entrega válida?',
    changed: 'Somente o serviço de solo muda. A mesma antena continua transmitindo a 1,2 Mbit/s.',
    explanation: 'A fila de dados só esvazia quando há tempo de contato, energia e rádio em operação. Um contato maior oferece mais tempo, não uma taxa maior. Observe a fila e os registros recebidos no mesmo instante dos dois ensaios.',
    conclusion: 'Comparar somente os setores com registros válidos e indicar o que ainda precisa ser observado.',
    overclaim: 'Certificar que um setor é seguro para o pouso de uma sonda real.',
    missing: 'Tratar todos os dados produzidos a bordo como se já estivessem disponíveis em solo.',
    source: 'https://science.nasa.gov/mission/osiris-rex/',
  },
  telescope: {
    name: 'Telescópio', destination: 'LUZ', discipline: '03 / ASTRONOMIA', title: 'A luz guarda pistas.',
    question: 'Qual instrumento permite comparar a intensidade em três faixas infravermelhas, em dois momentos?',
    beneficiary: 'Em 2022, o NIRSpec do Webb forneceu o espectro usado para identificar CO₂ na atmosfera de WASP-39 b. O instrumento e o modo de observação fazem parte da evidência.',
    purpose: 'Entender como uma pergunta científica determina o instrumento e os limites de uma descoberta.',
    learn: ['Diferenciar imagem de espectro.', 'Verificar compatibilidade antes de otimizar recursos.', 'Separar dado recebido de evidência válida.'],
    evidence: 'Seis intensidades sintéticas em faixas infravermelhas; o Webb é uma referência visual e científica.',
    boundary: 'Os valores não detectam água ou vida. O caso histórico é real; as intensidades do exercício são sintéticas e não reproduzem WASP-39 b. A câmera genérica do jogo não representa o NIRCam, que também faz espectroscopia.',
    cta: 'Projetar telescópio científico', experiment: 'Receber tudo é suficiente?',
    prediction: 'Com a mesma plataforma, trocar somente a câmera pelo espectrômetro melhora a entrega cientificamente válida?',
    changed: 'Somente o instrumento muda. Lançador científico, perfil distante, energia, contatos e duração permanecem iguais.',
    explanation: 'Receber um pacote completo comprova transporte, não adequação científica. Neste catálogo didático, somente o espectrômetro atende ao requisito. Isso não descreve todos os instrumentos reais: o NIRCam do Webb também tem modos espectroscópicos. Compare registros recebidos e válidos e confira os efeitos em dados, potência e custo.',
    conclusion: 'Comparar o sinal sintético entre faixas, explicitando que isso não identifica moléculas ou vida.',
    overclaim: 'Anunciar uma bioassinatura a partir das intensidades sintéticas do exercício.',
    missing: 'Aceitar a câmera porque os seis pacotes chegaram completos.',
    source: 'https://science.nasa.gov/mission/webb/science-overview/science-explainers/webbs-scientific-instruments/',
  },
} as const;

export type LearningTrial = { kind: 'cerrado'; label: string; result: MissionResult } | { kind: 'expedition'; label: string; result: ExpeditionResult };
export interface LearningExperiment { id: LearningMission; trials: readonly [LearningTrial, LearningTrial]; }

/** Fixed controlled experiments call the same engines as play. No parallel physics or saved attempts. */
export function runLearningExperiment(id: LearningMission): LearningExperiment {
  if (id === 'cerrado') return { id, trials: [
    { kind: 'cerrado', label: 'A · BANDAS', result: simulateMission({ ...DEFAULT_CONFIG }, 'short-contact') },
    { kind: 'cerrado', label: 'B · ÍNDICE', result: simulateMission({ ...DEFAULT_CONFIG, processing: 'index' }, 'short-contact') },
  ] };
  const base: ExpeditionConfig = { launch: id === 'bennu' ? 'compact' : 'science', orbit: id === 'bennu' ? 'near' : 'far', duration: 'full', instrument: 'camera', power: 'extended', ground: id === 'bennu' ? 'short' : 'extended' };
  return { id, trials: [
    { kind: 'expedition', label: id === 'bennu' ? 'A · Contatos curtos' : 'A · Câmera', result: simulateExpedition(id, base) },
    { kind: 'expedition', label: id === 'bennu' ? 'B · Contatos ampliados' : 'B · Espectrômetro', result: simulateExpedition(id, { ...base, ...(id === 'bennu' ? { ground: 'extended' } : { instrument: 'spectrometer' }) }) },
  ] };
}

export function summarizeLearningTrial(trial: LearningTrial) {
  const r = trial.result;
  return { valid: r.deliveredRecords, received: r.observations.filter(o => o.deliveredAtS !== null).length, mbit: Number(r.downlinkedBits) / 1e6, massKg: trial.kind === 'cerrado' ? trial.result.massKg : trial.result.totals.massKg, credits: trial.kind === 'cerrado' ? trial.result.credits : trial.result.totals.credits, outcome: r.outcome };
}
