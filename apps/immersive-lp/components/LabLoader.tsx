'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
const MiniLab = dynamic(() => import('./MiniLab'), { loading: () => <div className="lab-placeholder" role="status">Preparando o laboratório…</div>, ssr: false });
export function LabLoader() {
  const ref = useRef<HTMLDivElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setReady(true); observer.disconnect(); } }, { rootMargin: '400px' }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, []);
  return <div ref={ref} className="lab-loader">{ready ? <MiniLab /> : <div className="lab-placeholder"><p>Teste quanto da coleta do Cerrado chega à Terra com uma janela de comunicação mais curta.</p><button type="button" className="text-link" onClick={() => setReady(true)}>Iniciar o ensaio do Cerrado →</button><noscript>Ative o JavaScript para experimentar. Use Jogar agora para explorar as sete missões.</noscript></div>}</div>;
}
