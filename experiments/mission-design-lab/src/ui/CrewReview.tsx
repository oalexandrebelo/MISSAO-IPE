import { useEffect, useState } from 'react';

export const CREW_ROLES = [
  { id: 'science', label: 'Ciência e usuários', question: 'Os registros e o instrumento respondem à pergunta?' },
  { id: 'space', label: 'Nave e recursos', question: 'Energia, memória e carga útil funcionam juntas?' },
  { id: 'launch', label: 'Lançamento e trajetória', question: 'Massa, destino e orçamento são compatíveis?' },
  { id: 'ground', label: 'Solo e operações', question: 'Os dados cabem nas janelas e chegam dentro do prazo?' },
] as const;

export function useCrewReview(fingerprint: string) {
  const [size, setSize] = useState(1);
  const [review, setReview] = useState<{ fingerprint: string; roles: string[] }>({ fingerprint, roles: [] });
  useEffect(() => { setReview({ fingerprint, roles: [] }); }, [fingerprint]);
  const roles = review.fingerprint === fingerprint ? review.roles : [];
  return {
    size, roles, ready: size === 1 || CREW_ROLES.every(role => roles.includes(role.id)),
    setSize: (value: number) => { setSize(value); setReview({ fingerprint, roles: [] }); },
    toggle: (id: string) => setReview({ fingerprint, roles: roles.includes(id) ? roles.filter(role => role !== id) : [...roles, id] }),
  };
}
export type CrewReviewState = ReturnType<typeof useCrewReview>;
export function CrewReview({ crew }: { crew: CrewReviewState }) {
  return <section className="crew-review" aria-labelledby="crew-title"><div><p className="eyebrow">REVISÃO DA EQUIPE</p><h2 id="crew-title">Quatro responsabilidades. Uma missão.</h2><p>Jogue sozinho ou compartilhe este dispositivo com até quatro pessoas. Cada papel revisa uma parte do mesmo projeto.</p></div>
    <label htmlFor="crew-size">Participantes neste dispositivo<select id="crew-size" value={crew.size} onChange={event => crew.setSize(Number(event.target.value))}><option value={1}>Individual</option><option value={2}>2 pessoas</option><option value={3}>3 pessoas</option><option value={4}>4 pessoas</option></select></label>
    {crew.size > 1 ? <><div className="crew-roles">{CREW_ROLES.map((role, index) => <label key={role.id}><input type="checkbox" checked={crew.roles.includes(role.id)} onChange={() => crew.toggle(role.id)} /><span><small>PESSOA {index % crew.size + 1}</small><strong>{role.label}</strong><span>{role.question}</span></span></label>)}</div><p role="status">{crew.ready ? 'Os quatro papéis revisaram esta configuração. A equipe pode executar.' : 'Conversem sobre os compromissos e registrem as quatro revisões. Alterar o projeto exige nova revisão.'}</p></> : <p className="field-help">No modo individual, você reúne os quatro papéis. As perguntas continuam úteis antes de executar.</p>}
    <p className="field-help">Colaboração local, no mesmo dispositivo. Não há sala online ou sincronização entre computadores.</p>
  </section>;
}
