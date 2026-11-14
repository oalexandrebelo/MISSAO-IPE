import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { circularLeo, eclipseBattery, idealRadioLink, idealRocket, LAB_CONSTANTS, solarPower } from '../lab/physics.ts';
import { Icon } from './Icon.tsx';
import './engineering-lab.css';

const n = (value: number, digits = 1) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: digits, maximumFractionDigits: digits,
}).format(value);

const INITIAL = {
  altitude: 500, area: 0.25, efficiency: 30, angle: 20, au: 1, load: 12, reserve: 20,
  dryMass: 4, propellant: 1, isp: 220, transmitPower: 5, frequency: 2.2, distance: 800,
};

function Slider({ label, value, min, max, step, unit, digits = 0, help, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  digits?: number; help?: string; onChange: (value: number) => void;
}) {
  const id = useId();
  const valueText = `${n(value, digits)} ${unit}`;
  return <div className="elab-control">
    <div className="elab-control-label"><label htmlFor={id}>{label}</label><output htmlFor={id}>{valueText}</output></div>
    <input id={id} type="range" min={min} max={max} step={step} value={value}
      aria-valuetext={valueText} aria-describedby={help ? `${id}-help` : undefined}
      style={{ '--elab-fill': `${100 * (value - min) / (max - min)}%` } as CSSProperties}
      onChange={event => onChange(Number(event.currentTarget.value))} />
    <div className="elab-range-labels" aria-hidden="true"><span>{n(min, digits)} {unit}</span><span>{n(max, digits)} {unit}</span></div>
    {help && <p id={`${id}-help`} className="elab-control-help">{help}</p>}
  </div>;
}

function Metric({ label, value, unit, sub, accent = false }: {
  label: string; value: string; unit: string; sub?: string; accent?: boolean;
}) {
  return <div className={`elab-metric${accent ? ' elab-metric-accent' : ''}`}>
    <dt>{label}</dt><dd><strong>{value}</strong> <span>{unit}</span>{sub && <p>{sub}</p>}</dd>
  </div>;
}

function Source({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<span className="elab-source-arrow" aria-hidden="true">↗</span><span className="elab-sr-only"> (abre em nova aba)</span></a>;
}

function ModelDetails({ name, children }: { name: string; children: ReactNode }) {
  return <details className="elab-details"><summary>Fórmulas, hipóteses e fontes<span className="elab-sr-only"> — {name}</span><Icon name="chevron" size={16} /></summary><div className="elab-details-body">{children}</div></details>;
}

function OrbitDiagram({ altitude }: { altitude: number }) {
  const id = useId();
  const earthR = 80;
  const orbitR = earthR * (1 + altitude / LAB_CONSTANTS.earthMeanRadiusKm);
  const tangentX = Math.sqrt(orbitR ** 2 - earthR ** 2);
  const satelliteAngle = -2.25;
  const sx = 265 + orbitR * Math.cos(satelliteAngle);
  const sy = 135 + orbitR * Math.sin(satelliteAngle);
  return <svg className="elab-diagram" viewBox="0 0 520 270" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>Órbita circular e eclipse cilíndrico</title>
    <desc id={`${id}-desc`}>Vista no plano da órbita. A luz chega pela esquerda. A sombra à direita tem a largura do diâmetro terrestre. O raio orbital acompanha a altitude selecionada em proporção ao raio médio da Terra. O trecho tracejado da órbita está em eclipse.</desc>
    <defs><linearGradient id={`${id}-shadow`}><stop offset="0" stopColor="#293546" stopOpacity=".55" /><stop offset="1" stopColor="#293546" stopOpacity=".08" /></linearGradient></defs>
    <rect x="265" y="55" width="245" height="160" fill={`url(#${id}-shadow)`} />
    <path d="M265 55H510M265 215H510" stroke="#536172" strokeDasharray="4 5" />
    {[85, 135, 185].map(y => <g key={y} stroke="#d5f894" opacity=".65" fill="none"><path d={`M25 ${y}H151m-8-4 8 4-8 4`} /></g>)}
    <circle cx="265" cy="135" r={orbitR} fill="none" stroke="#d5f894" strokeWidth="2" />
    <path d={`M${265 + tangentX} 55 A${orbitR} ${orbitR} 0 0 1 ${265 + tangentX} 215`} stroke="#a3afbd" strokeWidth="3" strokeDasharray="5 5" fill="none" />
    <circle cx="265" cy="135" r={earthR} fill="#1b3440" stroke="#57747c" />
    <ellipse cx="265" cy="135" rx="35" ry="80" fill="none" stroke="#57747c" opacity=".45" />
    <ellipse cx="265" cy="135" rx="80" ry="28" fill="none" stroke="#57747c" opacity=".45" />
    <path d="M185 135H345M265 55V215" stroke="#57747c" opacity=".4" />
    <path d={`M265 135L${265 + tangentX} 55M265 135L${265 + tangentX} 215`} stroke="#a3afbd" strokeDasharray="3 4" opacity=".65" />
    <circle cx={sx} cy={sy} r="5" fill="#d5f894" stroke="#0a0e14" strokeWidth="2" />
    <circle cx="265" cy="135" r="3" fill="#eef2ed" />
    <text x="26" y="37" className="elab-svg-label">LUZ SOLAR</text>
    <text x="382" y="133" className="elab-svg-label">SOMBRA</text>
    <text x="382" y="151" className="elab-svg-small">β = 0°</text>
    <text x="263" y="249" textAnchor="middle" className="elab-svg-small">Terra e órbita em escala · {n(altitude, 0)} km</text>
  </svg>;
}

function SolarDiagram({ angle }: { angle: number }) {
  const id = useId();
  const radians = angle * Math.PI / 180;
  const c = Math.cos(radians), s = Math.sin(radians);
  const cx = 312, cy = 125, half = 78;
  const top = { x: cx + half * s, y: cy - half * c };
  const bottom = { x: cx - half * s, y: cy + half * c };
  const nx = cx - 105 * c, ny = cy - 105 * s;
  const ax = cx - 39 * c, ay = cy - 39 * s;
  return <svg className="elab-diagram elab-solar-diagram" viewBox="0 0 520 240" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>Projeção da área solar</title>
    <desc id={`${id}-desc`}>A linha verde representa o painel visto de lado. O ângulo entre sua normal e a direção do Sol é {n(angle, 0)} graus. A área projetada diminui com o cosseno desse ângulo.</desc>
    <path d={`M100 ${cy - half * c}V${cy + half * c}`} stroke="#e6b878" strokeWidth="5" opacity=".6" />
    {[-.8, -.4, 0, .4, .8].map(offset => {
      const y = cy + half * c * offset, endX = cx - half * s * offset;
      return <path key={offset} d={`M35 ${y}H${endX - 5}`} stroke="#a3afbd" opacity=".48" />;
    })}
    <path d={`M${top.x} ${top.y}L${bottom.x} ${bottom.y}`} stroke="#d5f894" strokeWidth="8" strokeLinecap="round" />
    <path d={`M${cx} ${cy}L${nx} ${ny}`} stroke="#d5f894" strokeDasharray="4 4" />
    {angle > 0 && <path d={`M${cx - 39} ${cy}A39 39 0 0 1 ${ax} ${ay}`} fill="none" stroke="#e6b878" strokeWidth="1.5" />}
    <circle cx={cx} cy={cy} r="3" fill="#eef2ed" />
    <text x="35" y="29" className="elab-svg-label">MESMA LUZ, OUTRA ORIENTAÇÃO</text>
    <text x="35" y="222" className="elab-svg-small">Projeção: A · cos θ</text>
    <text x="385" y="205" className="elab-svg-label">θ = {n(angle, 0)}°</text>
    <text x={Math.max(120, nx - 10)} y={Math.max(44, ny - 13)} textAnchor="end" className="elab-svg-small">normal</text>
  </svg>;
}

function RocketDiagram({ dryMass, propellant }: { dryMass: number; propellant: number }) {
  const id = useId();
  const fraction = propellant / (dryMass + propellant);
  const totalWidth = 432;
  const dryWidth = totalWidth * (1 - fraction);
  return <svg className="elab-diagram elab-compact-diagram" viewBox="0 0 520 160" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>Balanço de massa da queima ideal</title>
    <desc id={`${id}-desc`}>Massa inicial: {n(dryMass + propellant, 1)} quilogramas. A barra verde é a fração de propelente consumida. Ao final restam {n(dryMass, 1)} quilogramas de massa seca. As larguras das barras estão na mesma escala.</desc>
    <text x="44" y="23" className="elab-svg-label">ANTES DA QUEIMA</text>
    <text x="476" y="23" textAnchor="end" className="elab-svg-small">{n(dryMass + propellant, 1)} kg</text>
    <rect x="44" y="39" width={dryWidth} height="27" fill="#52677b" />
    <rect x={44 + dryWidth} y="39" width={totalWidth - dryWidth} height="27" fill="#d5f894" />
    <path d={`M${44 + dryWidth} 70V108`} stroke="#a3afbd" strokeDasharray="3 4" />
    <rect x="44" y="110" width={dryWidth} height="19" fill="#52677b" />
    <path d={`M${44 + dryWidth} 119H476`} stroke="#536172" strokeDasharray="4 5" />
    <text x="44" y="150" className="elab-svg-small">Final: massa seca</text>
    <text x="476" y="150" textAnchor="end" className="elab-svg-small">Propelente: {n(fraction * 100, 1)}%</text>
  </svg>;
}

function RadioDiagram({ frequency, distance }: { frequency: number; distance: number }) {
  const id = useId();
  return <svg className="elab-diagram elab-compact-diagram" viewBox="0 0 520 160" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
    <title id={`${id}-title`}>Enlace ideal de espaço livre</title>
    <desc id={`${id}-desc`}>Transmissor com ganho fixo de 3 dBi e receptor com ganho fixo de 20 dBi, separados por {n(distance, 0)} quilômetros. Frequência {n(frequency, 1)} gigahertz. Diagrama esquemático, sem escala de distância.</desc>
    <path d="M72 94V51m-16-10 16 16 16-16M448 94V51m-16-10 16 16 16-16" stroke="#d5f894" strokeWidth="2" fill="none" />
    <path d="M102 68H418m-8-5 8 5-8 5" stroke="#a3afbd" strokeDasharray="4 5" fill="none" />
    <path d="M126 45Q151 68 126 91M141 34Q180 68 141 102" stroke="#d5f894" fill="none" opacity=".38" />
    <text x="277" y="47" textAnchor="middle" className="elab-svg-label">{n(frequency, 1)} GHz</text>
    <text x="277" y="96" textAnchor="middle" className="elab-svg-small">{n(distance, 0)} km · linha de visada</text>
    <text x="72" y="120" textAnchor="middle" className="elab-svg-label">TX · 3 dBi</text>
    <text x="448" y="120" textAnchor="middle" className="elab-svg-label">RX · 20 dBi</text>
    <text x="260" y="150" textAnchor="middle" className="elab-svg-small">Esquema sem escala · ganhos fixos</text>
  </svg>;
}

export function EngineeringLab({ onBack }: { onBack: () => void }) {
  const [values, setValues] = useState(INITIAL);
  const set = (key: keyof typeof INITIAL) => (value: number) => setValues(current => ({ ...current, [key]: value }));
  const orbit = circularLeo(values.altitude);
  const solar = solarPower({ areaM2: values.area, efficiency: values.efficiency / 100, incidenceDeg: values.angle, distanceAu: values.au });
  const battery = eclipseBattery({ loadW: values.load, eclipseS: orbit.eclipseS, reserveFraction: values.reserve / 100 });
  const rocket = idealRocket({ dryMassKg: values.dryMass, propellantMassKg: values.propellant, specificImpulseS: values.isp });
  const radio = idealRadioLink({ transmitPowerW: values.transmitPower, frequencyGhz: values.frequency, distanceKm: values.distance });

  return <section className="engineering-lab" aria-labelledby="engineering-lab-title">
    <div className="elab-topbar"><button type="button" className="elab-back" onClick={onBack}><Icon name="back" size={18} /> Voltar ao observatório</button><span className="elab-live"><i aria-hidden="true" /> CÁLCULO INSTANTÂNEO</span></div>
    <header className="elab-hero"><div><p className="elab-eyebrow">MISSÃO IPÊ / LABORATÓRIO DE ENGENHARIA</p><h1 id="engineering-lab-title">Mude uma variável.<br /><span>Entenda a relação.</span></h1><p className="elab-lead">Quatro experimentos para enxergar o que move, alimenta e conecta um satélite. Arraste os controles e acompanhe a física.</p></div><div className="elab-hero-index" aria-hidden="true"><strong>04</strong><span>BANCADAS<br />DE EXPLORAÇÃO</span></div></header>
    <aside className="elab-separation"><Icon name="info" size={20} /><div><strong>Este laboratório é independente da campanha.</strong><p>Os controles exploram modelos ideais. Não alteram equipamentos, agendas, arquivos NDVI ou resultados das missões. Aqui, as hipóteses estão à vista.</p></div></aside>
    <nav className="elab-nav" aria-label="Bancadas do laboratório">
      <a href="#elab-orbit"><span>01</span> Órbita <Icon name="arrow" size={15} /></a>
      <a href="#elab-solar"><span>02</span> Energia <Icon name="arrow" size={15} /></a>
      <a href="#elab-rocket"><span>03</span> Propulsão <Icon name="arrow" size={15} /></a>
      <a href="#elab-radio"><span>04</span> Comunicação <Icon name="arrow" size={15} /></a>
    </nav>
    <div className="elab-grid">
      <article className="elab-card" id="elab-orbit" aria-labelledby="elab-orbit-title">
        <header className="elab-card-header"><span className="elab-module">01 / MOVIMENTO</span><Icon name="globe" size={22} /><h2 id="elab-orbit-title">A altitude muda o ritmo.</h2><p>Uma órbita mais alta exige menos velocidade orbital e leva mais tempo para completar uma volta.</p></header>
        <OrbitDiagram altitude={values.altitude} />
        <div className="elab-card-content"><Slider label="Altitude sobre o raio médio da Terra" value={values.altitude} min={200} max={2000} step={10} unit="km" onChange={set('altitude')} />
          <dl className="elab-metrics" aria-live="polite" aria-atomic="true">
            <Metric label="Período orbital" value={n(orbit.periodS / 60)} unit="min" accent />
            <Metric label="Velocidade" value={n(orbit.velocityKmS, 2)} unit="km/s" />
            <Metric label="Eclipse máximo" value={n(orbit.eclipseS / 60)} unit="min" sub={`${n(orbit.eclipseFraction * 100)}% da órbita`} />
          </dl>
          <div className="elab-orbit-time" aria-label={`${n(orbit.sunlightS / 60)} minutos de luz e ${n(orbit.eclipseS / 60)} minutos de eclipse`}><div className="elab-time-bar"><span style={{ width: `${100 * (1 - orbit.eclipseFraction)}%` }} /><span style={{ width: `${100 * orbit.eclipseFraction}%` }} /></div><div className="elab-bar-labels"><span><i /> Luz · {n(orbit.sunlightS / 60)} min</span><span><i /> Eclipse · {n(orbit.eclipseS / 60)} min</span></div></div>
          <p className="elab-note">Máximo para esta altitude: Sol no plano orbital (β = 0°). O eclipse real depende da orientação da órbita e da data.</p>
        </div>
        <ModelDetails name="Órbita circular"><p className="elab-formula">r = R⊕ + h<br />v = √(μ⊕ / r)<br />T = 2π · √(r³ / μ⊕)<br />tₑ = T · arcsen(R⊕ / r) / π</p><p>R⊕ = 6.371 km; μ⊕ = 398.600,435507 km³/s². Terra esférica, órbita circular de dois corpos, sem arrasto, achatamento ou perturbações. A sombra é cilíndrica, com raios solares paralelos; não há penumbra. O intervalo de 200–2.000 km é o domínio desta bancada.</p><div className="elab-sources"><Source href="https://ssd.jpl.nasa.gov/astro_par.html">JPL · parâmetros astrodinâmicos</Source><Source href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html">NASA · raio médio da Terra</Source><Source href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flight-to-orbit/">NASA Glenn · órbita circular</Source><Source href="https://ntrs.nasa.gov/api/citations/20230001953/downloads/ENAE%20691%20Spring23%20Thermal%20Cottingham.pdf">NASA NTRS · geometria de eclipse (PDF)</Source></div></ModelDetails>
      </article>

      <article className="elab-card" id="elab-solar" aria-labelledby="elab-solar-title">
        <header className="elab-card-header"><span className="elab-module">02 / ENERGIA</span><Icon name="sun" size={22} /><h2 id="elab-solar-title">Luz não é potência elétrica.</h2><p>A área recebe luz; as células convertem uma fração dela. À noite, a bateria precisa sustentar a carga.</p></header>
        <SolarDiagram angle={values.angle} />
        <div className="elab-card-content"><div className="elab-controls-grid">
          <Slider label="Área ativa do painel" value={values.area} min={0.05} max={2} step={0.05} digits={2} unit="m²" onChange={set('area')} />
          <Slider label="Eficiência das células" value={values.efficiency} min={10} max={40} step={1} unit="%" onChange={set('efficiency')} />
          <Slider label="Ângulo com a normal" value={values.angle} min={0} max={90} step={1} unit="°" onChange={set('angle')} />
          <Slider label="Distância ao Sol" value={values.au} min={0.5} max={5.2} step={0.1} digits={1} unit="AU" onChange={set('au')} />
        </div><dl className="elab-metrics elab-metrics-two" aria-live="polite" aria-atomic="true"><Metric label="Potência incidente" value={n(solar.incidentW)} unit="W" sub="Luz sobre a área projetada" /><Metric label="Potência elétrica" value={n(solar.electricW)} unit="W" sub="Eficiência aplicada uma vez" accent /></dl>
          <div className="elab-battery"><div className="elab-subheading"><Icon name="battery" size={18} /><h3>Atravessar o eclipse</h3><span>{n(orbit.eclipseS / 60)} min</span></div><p>Eclipse da bancada 01, carga constante e bateria cheia na entrada. η de descarga = 0,95.</p><div className="elab-controls-grid"><Slider label="Carga elétrica contínua" value={values.load} min={0} max={80} step={1} unit="W" onChange={set('load')} /><Slider label="Reserva ao final" value={values.reserve} min={0} max={50} step={1} unit="%" onChange={set('reserve')} /></div><dl className="elab-metrics elab-metrics-two" aria-live="polite" aria-atomic="true"><Metric label="Energia retirada" value={n(battery.withdrawnEnergyWh)} unit="Wh" sub={`${n(battery.busEnergyWh)} Wh chegam à carga`} /><Metric label="Capacidade mínima" value={n(battery.minimumCapacityWh)} unit="Wh" sub={`${n(battery.reserveEnergyWh)} Wh permanecem de reserva`} accent /></dl></div>
          <p className="elab-note">A distância em AU é um experimento solar separado: não desloca a órbita terrestre. Esta conta não verifica se o painel consegue recarregar a bateria a cada volta.</p>
        </div>
        <ModelDetails name="Energia solar e bateria"><p className="elab-formula">S(d) = 1.361 / d² [W/m²], d em AU<br />Pᵢ = S(d) · A · cos θ<br />Pₑ = Pᵢ · ηcélula<br />Eretirada = Pcarga · (tₑ / 3.600) / 0,95<br />Cmín = Eretirada / (1 − freserva) [Wh]</p><p>θ é medido entre a normal do painel e a direção do Sol: 0° recebe o máximo; 90° tem projeção nula. A irradiância de 1.361 W/m² é uma referência aproximada a 1 AU. Ignoramos temperatura, degradação, cabos, sombras parciais e limites de carga/descarga. A eficiência de descarga de 0,95 é um parâmetro didático e atua apenas na bateria. A reserva é fração da capacidade nominal, não um acréscimo percentual sobre o consumo.</p><div className="elab-sources"><Source href="https://www.nasa.gov/smallsat-institute/sst-soa/power-subsystems/">NASA · painéis e subsistemas de potência</Source><Source href="https://www.jpl.nasa.gov/edu/resources/lesson-plan/calculating-solar-power-in-space/">NASA/JPL · lei do inverso do quadrado</Source><Source href="https://earth.gsfc.nasa.gov/climate/projects/solar-irradiance/science">NASA Goddard · irradiância solar</Source></div></ModelDetails>
      </article>

      <article className="elab-card" id="elab-rocket" aria-labelledby="elab-rocket-title">
        <header className="elab-card-header"><span className="elab-module">03 / PROPULSÃO</span><Icon name="route" size={22} /><h2 id="elab-rocket-title">O custo de mudar a velocidade.</h2><p>Na equação de Tsiolkovsky, o Δv depende do impulso específico e da razão entre massa inicial e final.</p></header>
        <RocketDiagram dryMass={values.dryMass} propellant={values.propellant} />
        <div className="elab-card-content"><div className="elab-controls-grid"><Slider label="Massa seca" value={values.dryMass} min={1} max={20} step={0.5} digits={1} unit="kg" onChange={set('dryMass')} /><Slider label="Massa de propelente" value={values.propellant} min={0} max={10} step={0.1} digits={1} unit="kg" onChange={set('propellant')} /></div><Slider label="Impulso específico · Isp" value={values.isp} min={50} max={3000} step={10} unit="s" help="Isp mede desempenho por peso de propelente, não a duração da queima." onChange={set('isp')} />
          <dl className="elab-metrics" aria-live="polite" aria-atomic="true"><Metric label="Δv ideal" value={n(rocket.deltaVMs, 0)} unit="m/s" accent /><Metric label="Razão m₀ / mf" value={n(rocket.massRatio, 2)} unit="×" /><Metric label="Massa inicial" value={n(rocket.initialMassKg)} unit="kg" /></dl>
          <p className="elab-callout"><strong>Alto Isp não significa alto empuxo.</strong> O empuxo também depende da vazão de massa. Este Δv não calcula duração de queima, trajetória, janela de lançamento ou transferência orbital.</p>
        </div>
        <ModelDetails name="Propulsão ideal"><p className="elab-formula">m₀ = mseca + mpropelente; mf = mseca<br />Δv = Isp · g₀ · ln(m₀ / mf)<br />g₀ = 9,80665 m/s²<br />F = ṁ · Isp · g₀</p><p>Modelo de estágio único, com consumo de todo o propelente e velocidade efetiva de exaustão constante. A massa seca inclui estrutura, equipamentos e carga útil. Não há perdas gravitacionais, arrasto ou perdas de direção. O controle de Isp é didático: nenhum motor ou sistema de alimentação é dimensionado aqui.</p><div className="elab-sources"><Source href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/">NASA Glenn · equação ideal do foguete</Source><Source href="https://www.grc.nasa.gov/www/BGH/specimp.html">NASA Glenn · impulso específico e empuxo</Source></div></ModelDetails>
      </article>

      <article className="elab-card" id="elab-radio" aria-labelledby="elab-radio-title">
        <header className="elab-card-header"><span className="elab-module">04 / COMUNICAÇÃO</span><Icon name="signal" size={22} /><h2 id="elab-radio-title">O sinal se espalha no caminho.</h2><p>Com ganhos fixos, distância e frequência mudam a potência recebida. A distância também impõe um atraso mínimo.</p></header>
        <RadioDiagram frequency={values.frequency} distance={values.distance} />
        <div className="elab-card-content"><div className="elab-fixed-gains"><span>Ganho TX <strong>3 dBi</strong></span><span>Ganho RX <strong>20 dBi</strong></span><span>FIXOS</span></div><div className="elab-controls-grid"><Slider label="Potência transmitida" value={values.transmitPower} min={0.5} max={50} step={0.5} digits={1} unit="W" onChange={set('transmitPower')} /><Slider label="Frequência" value={values.frequency} min={0.3} max={12} step={0.1} digits={1} unit="GHz" onChange={set('frequency')} /></div><Slider label="Distância entre antenas" value={values.distance} min={200} max={40000} step={100} unit="km" help="Distância em linha de visada; não é a altitude orbital." onChange={set('distance')} />
          <dl className="elab-metrics" aria-live="polite" aria-atomic="true"><Metric label="Potência recebida" value={n(radio.receivedDbm)} unit="dBm" accent /><Metric label="Perda de espaço livre" value={n(radio.freeSpaceLossDb)} unit="dB" /><Metric label="Latência · só ida" value={n(radio.oneWayLatencyS * 1000, 2)} unit="ms" /></dl><p className="elab-radio-detail">Recepção: {radio.receivedW * 1e12 < 0.001 ? '< 0,001' : n(radio.receivedW * 1e12, 3)} pW · Ida e volta da luz: {n(radio.roundTripLatencyS * 1000, 2)} ms</p>
          <p className="elab-callout"><strong>Potência recebida não determina uma taxa de dados.</strong> Faltam ruído, largura de banda, modulação, codificação e o Eb/N₀ exigido. Aqui, não há previsão de bitrate ou de entrega de arquivos.</p>
        </div>
        <ModelDetails name="Enlace ideal de rádio"><p className="elab-formula">λ = c / f<br />Pr = Pt · Gt · Gr · (λ / 4πd)²<br />Lfs = 20 · log₁₀(4πd / λ) [dB]<br />Pr[dBm] = Pt[dBm] + 3 + 20 − Lfs<br />tida = d / c; c = 299.792.458 m/s</p><p>Na forma linear, G = 10^(GdBi/10); f usa Hz e d usa metros. Friis supõe campo distante, espaço livre, antenas alinhadas, polarizações compatíveis e linha de visada desobstruída. Não inclui atmosfera, chuva, apontamento, perdas de cabos ou ruído. Os ganhos de 3 e 20 dBi são parâmetros didáticos, não especificações de hardware. Eles permanecem fixos em dBi; variar frequência não representa manter o diâmetro físico de uma antena. A latência mostra somente propagação no vácuo.</p><div className="elab-sources"><Source href="https://descanso.jpl.nasa.gov/propagation/Ka_Band/JPL_D27879.pdf">JPL DESCANSO · Friis e espaço livre, §2.1.1 (PDF)</Source><Source href="https://ssd.jpl.nasa.gov/astro_par.html">JPL · velocidade da luz</Source></div></ModelDetails>
      </article>
    </div>
    <footer className="elab-footer"><p>Modelos ideais, hipóteses explícitas.<br /><span>Os valores mudam; as leis e as unidades precisam continuar coerentes.</span></p><button type="button" onClick={() => setValues({ ...INITIAL })}><Icon name="history" size={17} /> Restaurar valores iniciais</button></footer>
  </section>;
}
