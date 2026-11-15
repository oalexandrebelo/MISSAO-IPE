import { BRUNO_CHOICES, validateBrunoConfig, simulateBrunoMission } from '../../experiments/mission-design-lab/src/lab/bruno-missions.ts';
import { CATALOG, assertMissionConfig } from '../../experiments/mission-design-lab/src/core/catalog.ts';
import { simulateMission } from '../../experiments/mission-design-lab/src/core/engine.ts';
import { getExpeditionChoices, simulateExpedition } from '../../experiments/mission-design-lab/src/lab/scientific-expeditions.ts';
import { runLearningExperiment, summarizeLearningTrial } from '../../experiments/mission-design-lab/src/lab/mission-curriculum.ts';
import { scoreMissionResult } from '../../experiments/mission-design-lab/src/metrics/mission-score.ts';

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const MISSIONS = ['cerrado', 'bennu', 'telescope', 'iss', 'moon', 'mars'];
const isBruno = mission => ['iss', 'moon', 'mars'].includes(mission);
export class InvalidInput extends Error {}
export function object(value, keys, required = keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !keys.includes(key)) || required.some(key => !Object.hasOwn(value, key))) throw new InvalidInput('Formato inválido.');
  return value;
}
export function configFor(mission, config) {
  if (mission === 'cerrado') {
    try { assertMissionConfig(config); } catch { throw new InvalidInput('Escolhas do Cerrado inválidas.'); }
  } else if (isBruno(mission)) {
    if (!validateBrunoConfig(config)) throw new InvalidInput('Escolhas da campanha inválidas.');
  } else {
    const choices = getExpeditionChoices(mission);
    object(config, Object.keys(choices));
    for (const key of Object.keys(choices)) if (!choices[key].some(choice => choice.id === config[key])) throw new InvalidInput('Escolhas da expedição inválidas.');
  }
  return { ...config };
}
export function summarizeResult(result, mission) {
  if (isBruno(mission)) {
    const diagnostics = result.diagnostics.map(d => ({ ...d, severity: 'error' }));
    return { outcome: result.outcome, validRecords: result.deliveredRecords, deliveredRecords: result.receivedRecords, requiredRecords: result.requiredRecords, massKg: result.massKg, credits: result.credits, minEnergyWh: result.minEnergyWh, initialEnergyWh: result.initialEnergyWh, finalEnergyWh: result.finalEnergyWh, generatedBits: String(result.generatedBits), downlinkedBits: String(result.downlinkedBits), lostBits: String(result.lostBits), queueBits: String(result.queueBits), completedAtS: result.simulatedSeconds, engineVersion: result.modelVersion, diagnostics, firstCause: diagnostics[0] ?? null, score: result.score };
  }
  const unique = new Map();
  for (const event of result.events) if (event.severity !== 'info' && event.code !== 'MISSION_END' && !unique.has(event.code)) unique.set(event.code, { code: event.code, severity: event.severity, message: event.message, timeS: event.timeS });
  const diagnostics = [...unique.values()];
  return {
    outcome: result.outcome, validRecords: result.deliveredRecords,
    deliveredRecords: result.observations.filter(record => record.deliveredAtS !== null).length,
    requiredRecords: result.requiredRecords,
    massKg: mission === 'cerrado' ? result.massKg : result.totals.massKg,
    credits: mission === 'cerrado' ? result.credits : result.totals.credits,
    minEnergyWh: result.minEnergyWh, initialEnergyWh: result.initialEnergyWh, finalEnergyWh: result.finalEnergyWh,
    generatedBits: String(result.generatedBits), downlinkedBits: String(result.downlinkedBits), lostBits: String(result.lostBits), queueBits: String(result.queueBits),
    completedAtS: result.completedAtS, engineVersion: mission === 'cerrado' ? result.engineVersion : result.modelVersion,
    diagnostics, firstCause: diagnostics.find(event => event.severity === 'error') ?? null,
    score: scoreMissionResult(result),
  };
}
export function normalizeEvent(input, sessionId, receivedAt) {
  object(input, ['id', 'kind', 'mission', 'at', 'payload']);
  if (!UUID.test(input.id) || !MISSIONS.includes(input.mission) || typeof input.at !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(input.at) || !Number.isFinite(Date.parse(input.at)) || input.at.length > 32) throw new InvalidInput('Identificador, missão ou data inválidos.');
  const { mission, kind } = input;
  let payload, result;
  if (kind === 'attempt') {
    const p = object(input.payload, ['attemptId', 'status', 'config', 'scenarioId'], ['attemptId', 'status', 'config']);
    if (!UUID.test(p.attemptId) || !['completed', 'cancelled', 'error'].includes(p.status)) throw new InvalidInput('Tentativa inválida.');
    const config = configFor(mission, p.config);
    if (mission === 'cerrado' ? !['long-contact', 'short-contact'].includes(p.scenarioId) : p.scenarioId !== undefined) throw new InvalidInput('Cenário inválido.');
    payload = { attemptId: p.attemptId, status: p.status, config, ...(mission === 'cerrado' ? { scenarioId: p.scenarioId } : {}) };
    if (p.status === 'completed') result = summarizeResult(mission === 'cerrado' ? simulateMission(config, p.scenarioId, { trace: false }) : isBruno(mission) ? simulateBrunoMission(mission, config) : simulateExpedition(mission, config), mission);
  } else if (kind === 'decision') {
    const p = object(input.payload, ['key', 'from', 'to']);
    const choices = mission === 'cerrado' ? CATALOG : isBruno(mission) ? BRUNO_CHOICES : getExpeditionChoices(mission);
    const options = typeof p.key === 'string' && Object.hasOwn(choices, p.key) ? choices[p.key] : null;
    if (!options || p.from === p.to || !options.some(choice => choice.id === p.from) || !options.some(choice => choice.id === p.to)) throw new InvalidInput('Mudança inválida.');
    payload = { key: p.key, from: p.from, to: p.to };
  } else if (kind === 'assessment') {
    if (isBruno(mission)) throw new InvalidInput('Avaliação ainda não disponível nesta campanha.');
    const p = object(input.payload, ['question', 'answer', 'questionVersion']);
    if (p.questionVersion !== 1 || !['prediction', 'interpretation'].includes(p.question) || !(p.question === 'prediction' ? ['more', 'same', 'less'] : ['evidence', 'overclaim', 'missing']).includes(p.answer)) throw new InvalidInput('Resposta inválida.');
    let expected = 'evidence';
    if (p.question === 'prediction') {
      const [a, b] = runLearningExperiment(mission).trials.map(summarizeLearningTrial);
      expected = b.valid > a.valid ? 'more' : b.valid < a.valid ? 'less' : 'same';
    }
    payload = { ...p }; result = { correct: p.answer === expected, expected };
  } else if (kind === 'inspection') {
    const p = object(input.payload, ['target', 'eventId'], ['target']);
    if (!['energy', 'communications', 'instrument', 'evidence', 'comparison'].includes(p.target) || (p.eventId !== undefined && (typeof p.eventId !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(p.eventId)))) throw new InvalidInput('Inspeção inválida.');
    payload = { ...p };
  } else if (kind === 'role_review') {
    const p = object(input.payload, ['roles', 'count']);
    if (!Array.isArray(p.roles) || p.roles.length > 4 || new Set(p.roles).size !== p.roles.length || p.roles.some(role => !['launch', 'space', 'ground', 'user'].includes(role)) || p.count !== p.roles.length) throw new InvalidInput('Papéis inválidos.');
    payload = { roles: [...p.roles].sort(), count: p.count };
  } else throw new InvalidInput('Tipo de evento inválido.');
  return { schemaVersion: 1, type: 'event', id: input.id, sessionId, kind, mission, at: input.at, receivedAt, payload, ...(result ? { result } : {}) };
}
