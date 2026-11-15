import type { TracePoint } from '../core/contracts.ts';
import type { LearningExperiment, LearningTrial } from './mission-curriculum.ts';

/** Read the recorded step function. Never interpolate resources or reveal a later sample. */
export function learningStateAt(trial: LearningTrial, timeS: number) {
  for (let index = trial.result.trace.length - 1; index >= 0; index--) {
    const point = trial.result.trace[index]!;
    if (point.timeS <= timeS) return point;
  }
  return null;
}

export function learningDeliveryAt(trial: LearningTrial, timeS: number) {
  const received = trial.result.observations.filter(row => row.deliveredAtS !== null && row.deliveredAtS <= timeS);
  return { received: received.length, valid: received.filter(row => 'scienceValid' in row ? row.scienceValid : row.valid).length };
}

const METRICS = ['energyWh', 'queueBits', 'downlinkedBits', 'loadW', 'solarW', 'mode'] as const;
export type LearningMetric = typeof METRICS[number];
export function firstLearningDifference(experiment: LearningExperiment) {
  const [a, b] = experiment.trials;
  const times = [...new Set([...a.result.trace, ...b.result.trace].map(point => point.timeS))].sort((x,y) => x-y);
  for (const timeS of times) {
    const left = learningStateAt(a, timeS), right = learningStateAt(b, timeS);
    if (!left || !right) continue;
    const fields = METRICS.filter(key => typeof left[key] === 'number' && typeof right[key] === 'number'
      ? Math.abs(Number(left[key]) - Number(right[key])) > 1e-7 : left[key] !== right[key]);
    const deliveryA = learningDeliveryAt(a, timeS), deliveryB = learningDeliveryAt(b, timeS);
    if (fields.length || deliveryA.received !== deliveryB.received || deliveryA.valid !== deliveryB.valid) {
      const events = experiment.trials.map(trial => trial.result.events.filter(event => event.timeS === timeS));
      const side: 0 | 1 = events[0]!.some(event => event.severity === 'error') ? 0 : 1;
      return { timeS, fields, left, right, deliveryA, deliveryB, events, side };
    }
  }
  return null;
}

/** Staircase chart: resources are held at the last recorded sample, including after shutdown. */
export function learningStepPath(trace: readonly TracePoint[], metric: 'loadW' | 'queueBits', horizon: number, maximum: number) {
  if (!trace.length || horizon <= 0 || maximum <= 0) return '';
  const x = (timeS: number) => 40 + timeS / horizon * 600;
  const y = (value: number) => 150 - value / maximum * 120;
  return trace.map((point, index) => `${index ? 'H' : 'M'}${x(point.timeS).toFixed(2)}${index ? 'V' : ','}${y(point[metric]).toFixed(2)}`).join(' ') + ` H${x(horizon)}`;
}
