export type MissionSegment = 'launch' | 'space' | 'ground' | 'user';
const segments: readonly { id: MissionSegment; label: string; description: string }[] = [
  { id: 'user', label: 'Usuários', description: 'A pergunta e a ciência recebida' },
  { id: 'launch', label: 'Lançamento', description: 'Acesso, massa e compatibilidade' },
  { id: 'space', label: 'Espacial', description: 'Instrumentos e recursos a bordo' },
  { id: 'ground', label: 'Terrestre', description: 'Comunicação e recepção' },
];
export function MissionSegments({ selected, onSelect }: { selected: MissionSegment; onSelect: (segment: MissionSegment) => void }) {
  return <div className="mission-segments" role="group" aria-label="Quatro segmentos da missão">{segments.map((segment, index) => <button type="button" key={segment.id} aria-pressed={selected === segment.id} onClick={() => onSelect(segment.id)}><small>0{index + 1}</small><strong>{segment.label}</strong><span>{segment.description}</span></button>)}</div>;
}
