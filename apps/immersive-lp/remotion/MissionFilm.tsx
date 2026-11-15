import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { getPointAtLength, getLength } from '@remotion/paths';
import { Satellite } from '../components/Planet';

const path = 'M150 740C500 100 1400 100 1750 740';
const length = getLength(path);
const scenes = [
  ['DA ÓRBITA, PARA A VIDA', 'O espaço é só o começo.', 'Terra, Bennu e Webb. Perguntas que conectam ciência e engenharia.'],
  ['01 / OBSERVAR', 'O que o Cerrado nos conta?', 'Registros históricos. Perguntas que importam.'],
  ['02 / PROJETAR', 'Cada escolha muda a missão.', 'Energia. Memória. Comunicação. Tudo está conectado.'],
  ['03 / FAZER CHEGAR', 'A ciência precisa voltar para casa.', 'Explore. Questione. Redesenhe.'],
];
export function MissionFilm() {
  const frame = useCurrentFrame(); const index = Math.min(3, Math.floor(frame / 180)); const local = frame % 180;
  const opacity = interpolate(local, [0, 18, 150, 179], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const progress = frame / 720; const point = getPointAtLength(path, progress * length) ?? { x: 150, y: 740 };
  return <AbsoluteFill style={{ background: '#080d10', color: '#f2f1e8', overflow: 'hidden', fontFamily: 'IpeFigtree, sans-serif' }}>
    <style>{`@font-face{font-family:IpeFigtree;src:url('${staticFile('fonts/figtree-latin.woff2')}')}@font-face{font-family:IpeGaramond;src:url('${staticFile('fonts/eb-garamond-latin.woff2')}')}`}</style>
    <Img src={staticFile('assets/earth.webp')} style={{ position: 'absolute', width: 1240, height: 1240, borderRadius: '50%', left: 840, top: 120 + progress * 70, transform: `rotate(${progress * 12}deg)`, opacity: .72 }} />
    <AbsoluteFill style={{ background: 'linear-gradient(90deg,#080d10 8%,rgba(8,13,16,.7) 47%,transparent 90%)' }} />
    <svg style={{ position: 'absolute', width: 1920, height: 1080 }} viewBox="0 0 1920 1080"><path d={path} fill="none" stroke="#cce899" strokeOpacity=".3" strokeDasharray="4 8" /><circle cx={point.x} cy={point.y} r="6" fill="#ddf9aa" /></svg>
    <Img src={staticFile('brand/missao-ipe-logo.svg')} style={{ position: 'absolute', width: 250, height: 117, objectFit: 'contain', top: 65, left: 100 }} />
    <div style={{ position: 'absolute', top: 330, left: 110, width: 1190, opacity, transform: `translateY(${interpolate(local, [0, 35], [25, 0], { extrapolateRight: 'clamp' })}px)` }}>
      <p style={{ fontSize: 20, letterSpacing: 6, color: '#ddf9aa', marginBottom: 35 }}>{scenes[index][0]}</p>
      <h1 style={{ fontFamily: 'IpeGaramond, Georgia, serif', fontWeight: 400, fontSize: 120, lineHeight: 1, maxWidth: 1150, margin: '0 0 40px' }}>{scenes[index][1]}</h1>
      <p style={{ fontSize: 30, maxWidth: 800, lineHeight: 1.6, color: '#bec8c4' }}>{scenes[index][2]}</p>
    </div>
    {index === 2 && <div style={{ position: 'absolute', width: 540, right: 70, top: 130, opacity }}><Satellite /></div>}
    <div style={{ position: 'absolute', left: 110, right: 110, bottom: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 16, letterSpacing: 3, color: '#a5b5ae' }}><span>MISSÃO IPÊ · CIÊNCIA QUE CHEGA</span><span>MANIFESTO VISUAL · MODELO DIDÁTICO</span></div>
    <div style={{ position: 'absolute', bottom: 0, height: 3, left: 0, background: '#d8f5a2', width: `${progress * 100}%` }} />
  </AbsoluteFill>;
}
