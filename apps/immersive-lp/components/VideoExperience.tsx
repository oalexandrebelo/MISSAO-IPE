'use client';
import dynamic from 'next/dynamic';
import { Component, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
const MissionPlayer = dynamic(() => import('./MissionPlayer'), { ssr: false, loading: () => <p className="film-loading" role="status">Preparando a viagem…</p> });
class FilmBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="film-loading">O player não pôde abrir neste navegador. Feche o filme para continuar explorando a missão.</p> : this.props.children; }
}
export function VideoExperience() {
  const ref = useRef<HTMLDialogElement>(null); const trigger = useRef<HTMLButtonElement>(null); const [open, setOpen] = useState(false);
  function close() { ref.current?.close(); setOpen(false); }
  return <>
    <button ref={trigger} className="film-trigger" type="button" onClick={() => { setOpen(true); ref.current?.showModal(); }}><span className="play-circle"><Icon name="play" /></span><span>Veja a missão<small>UM MANIFESTO EM 24 SEGUNDOS</small></span></button>
    <dialog ref={ref} className="film-dialog" aria-labelledby="film-title" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === ref.current) close(); }}><div className="film-dialog-inner"><div className="film-bar"><h2 id="film-title">Da órbita, para a vida.</h2><button className="icon-button" onClick={close} aria-label="Fechar filme"><Icon name="close" /></button></div>{open && <FilmBoundary><MissionPlayer /></FilmBoundary>}<p className="film-caption">Manifesto visual da MISSÃO IPÊ. Nave conceitual e dados de missão didáticos. Sem áudio.</p></div></dialog>
  </>;
}
