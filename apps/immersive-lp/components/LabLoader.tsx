'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
const MiniLab = dynamic(() => import('./MiniLab'), { loading: () => <div className="lab-placeholder" role="status">Preparando o laboratório…</div>, ssr: false });
export function LabLoader() {
  const ref = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '400px' }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, []);
  return <div ref={ref} className="lab-loader">{ready ? <MiniLab /> : <div className="lab-placeholder"><span className="eyebrow">UMA ESCOLHA MUDA A MISSÃO</span><p>Um experimento de engenharia, no seu navegador.</p><button type="button" className="text-link" onClick={() => setReady(true)}>Abrir laboratório →</button><noscript>Ative o JavaScript para experimentar. O jogo completo está disponível pelo link acima.</noscript></div>}</div>;
}
