import type { ReactNode } from 'react';
import './scientific-cockpit.css';

export const CERRADO_FLIGHT_PATH = [
  { id: 'briefing', label: 'Briefing' },
  { id: 'assembly', label: 'Montagem' },
  { id: 'verification', label: 'Checagem' },
  { id: 'operation', label: 'Operação' },
  { id: 'result', label: 'Resultado' },
] as const;

export type CerradoStage = typeof CERRADO_FLIGHT_PATH[number]['id'];

interface FlightPathProps<Stage extends string> {
  stages: readonly { id: Stage; label: string }[];
  current: Stage;
  onSelect: (stage: Stage) => void;
  unavailable?: (stage: Stage) => boolean;
  label?: string;
}

export function ScientificFlightPath<Stage extends string>({
  stages, current, onSelect, unavailable, label = 'Etapas da missão científica',
}: FlightPathProps<Stage>) {
  return <nav className="scientific-flight-path" aria-label={label}>
    {stages.map((stage, index) => <button
      key={stage.id} type="button"
      aria-current={stage.id === current ? 'step' : undefined}
      disabled={unavailable?.(stage.id)}
      onClick={() => onSelect(stage.id)}
    ><span>{String(index + 1).padStart(2, '0')} · </span>{stage.label}</button>)}
  </nav>;
}

export function ScientificCommand({ title, detail, children }: { title: string; detail?: string; children?: ReactNode }) {
  return <div className="scientific-command">
    <p role="status"><strong>{title}</strong>{detail ? <span>{detail}</span> : null}</p>
    {children ? <div className="scientific-command-actions">{children}</div> : null}
  </div>;
}

export function focusCockpitSection(target: HTMLElement | null) {
  target?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
  target?.focus({ preventScroll: true });
}
