'use client';
import { useMemo, useState } from 'react';
import { DEFAULT_CONFIG } from '@/lib/mission/core/catalog';
import { simulateMission } from '@/lib/mission/core/engine';
import type { ScenarioId } from '@/lib/mission/core/contracts';
import { LINKS } from '@/lib/content';
import { Icon } from './Icon';
import { Satellite } from './Planet';

export default function MiniLab() {
  const [scenario, setScenario] = useState<ScenarioId>('short-contact');
  const [redesign, setRedesign] = useState(false);
  const result = useMemo(() => simulateMission(redesign ? { ...DEFAULT_CONFIG, battery: 'large', processing: 'index' } : DEFAULT_CONFIG, scenario, { trace: false }), [scenario, redesign]);
  function download() {
    const blob = new Blob([JSON.stringify({ description: 'Demonstração educativa MISSÃO IPÊ. Não é uma especificação de voo.', ...result }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `ipe-${scenario}-${redesign ? 'redesenho' : 'base'}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className="lab-console" data-reveal>
    <div className="lab-console-top"><span><i className="status-dot" /> LABORATÓRIO DE MISSÃO</span><span>IPÊ–01 <span className="muted">/ CUBESAT</span></span></div>
    <div className="lab-body">
      <div className="lab-space">
        <div className="lab-grid" /><div className="lab-target" /><Satellite className="lab-satellite" />
        <span className="lab-label lab-label-a">OBSERVAR<br /><b>O CERRADO</b></span><span className="lab-label lab-label-b">ILUSTRAÇÃO<br /><b>CONCEITUAL</b></span>
        <div className="lab-coordinate">17,75° S <span>50,98° O</span></div>
      </div>
      <div className="lab-settings">
        <fieldset><legend><span>01</span> Sua janela de comunicação</legend><div className="segmented"><button aria-pressed={scenario === 'long-contact'} onClick={() => setScenario('long-contact')}>Contatos longos</button><button aria-pressed={scenario === 'short-contact'} onClick={() => setScenario('short-contact')}>Contatos curtos</button></div></fieldset>
        <fieldset><legend><span>02</span> Sua estratégia de projeto</legend><div className="segmented"><button aria-pressed={!redesign} onClick={() => setRedesign(false)}>Configuração base</button><button aria-pressed={redesign} onClick={() => setRedesign(true)}>Redesenhar</button></div><p className="config-description">{redesign ? 'Bateria de 24 Wh + processamento do índice a bordo.' : 'Bateria de 16 Wh + transmissão das bandas R/NIR.'}</p></fieldset>
        <div className="lab-result" role="status" aria-live="polite" aria-atomic="true">
          <div><span className="result-number">{result.deliveredRecords}<small>/6</small></span><span className="result-label">registros entregues</span></div>
          <div className="result-packets" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <span className={index < result.deliveredRecords ? 'packet delivered' : 'packet'} key={index}>{String(index + 1).padStart(2, '0')}</span>)}</div>
          <p>{result.outcome === 'success' ? 'A ciência chegou. O projeto atende aos limites deste cenário.' : 'Parte da ciência ficou pelo caminho. Mude uma escolha e observe o resultado.'}</p>
        </div>
        <div className="lab-metrics"><span><b>{result.massKg.toFixed(2).replace('.', ',')} kg</b>Massa</span><span><b>{result.credits} / 86</b>Créditos</span><span><b>{result.minEnergyWh.toFixed(1).replace('.', ',')} Wh</b>Energia mínima</span></div>
      </div>
    </div>
    <div className="lab-console-bottom"><span>Modelo didático · dados históricos · motor do beta</span><button type="button" onClick={download}>Baixar resultado <Icon name="arrow-up" /></button></div>
    <a className="lab-full-link" href={LINKS.game}>Explore as 64 configurações no jogo completo <Icon /></a>
  </div>;
}
