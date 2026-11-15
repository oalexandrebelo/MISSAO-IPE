'use client';
import { useRef, useState } from 'react';
import { MILESTONES, LINKS } from '@/lib/content';
import { Icon } from './Icon';

export function Roadmap() {
  const [active, setActive] = useState(1); const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function move(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % MILESTONES.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + MILESTONES.length) % MILESTONES.length;
    else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = MILESTONES.length - 1; else return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }
  return <div className="roadmap" data-reveal>
    <div className="timeline-tabs" role="tablist" aria-label="Segmentos da missão MISSÃO IPÊ">{MILESTONES.map((item, index) => <button key={item.id} ref={el => { tabs.current[index] = el; }} id={`tab-${item.id}`} role="tab" aria-selected={active === index} aria-controls={`panel-${item.id}`} tabIndex={active === index ? 0 : -1} onKeyDown={event => move(event, index)} onClick={() => setActive(index)}><span className="timeline-number">{item.stage}</span><span className="timeline-dot" /><span>{item.label}</span><small>{item.state}</small></button>)}</div>
    {MILESTONES.map((item, index) => <div className="timeline-panel" key={item.id} id={`panel-${item.id}`} role="tabpanel" aria-labelledby={`tab-${item.id}`} tabIndex={0} hidden={active !== index}>
      <div className="timeline-panel-heading"><span className="eyebrow">{item.date}</span><h3>{item.title}</h3></div>
      <div><p>{item.text}</p><ul>{item.items.map(text => <li key={text}><Icon name="check" />{text}</li>)}</ul><a className="text-link" href={LINKS.roadmap}>Ler roteiro de demonstração <Icon name="arrow-up" /></a></div>
    </div>)}
  </div>;
}
