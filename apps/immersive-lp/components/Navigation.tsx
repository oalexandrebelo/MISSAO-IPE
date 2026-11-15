'use client';
import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, LINKS } from '@/lib/content';
import { Icon } from './Icon';

export function Navigation({ outsideHome = false }: { outsideHome?: boolean } = {}) {
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const chapterHref = (id: string) => `${outsideHome ? '/' : ''}#${id}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = document.querySelector('.header-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel); return () => observer.disconnect();
  }, []);
  function close() { menu.current?.close(); setOpen(false); }
  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href={chapterHref('inicio')} aria-label="MISSÃO IPÊ — início"><img src="/brand/missao-ipe-logo.svg" width="1064" height="499" alt="MISSÃO IPÊ" /></a>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <a href={chapterHref('missao')}>A missão</a><a href={chapterHref('jornada')}>Três casos NASA</a><a href={chapterHref('segmentos')}>A missão completa</a>
      </nav>
      <div className="header-actions"><a className="header-cta" href={LINKS.game}>Jogar o beta <Icon name="arrow-up" /></a>
        <button ref={menuButton} className="menu-button" type="button" aria-label="Abrir menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { menu.current?.showModal(); setOpen(true); }}><Icon name="menu" /></button>
      </div>
      {!outsideHome && <div className="reading-progress" aria-hidden="true"><div className="progress-fill" /></div>}
    </header>
    <dialog id="mobile-menu" className="mobile-menu" ref={menu} aria-label="Menu de navegação" onClose={() => { setOpen(false); menuButton.current?.focus(); }} onClick={event => { if (event.target === menu.current) close(); }}>
      <div className="mobile-menu-inner"><div className="mobile-menu-top"><span className="eyebrow">EXPLORE O IPÊ</span><button type="button" className="icon-button" onClick={close} aria-label="Fechar menu"><Icon name="close" /></button></div>
        <nav aria-label="Navegação no celular">{CHAPTERS.map(chapter => <a href={chapterHref(chapter.id)} key={chapter.id} onClick={close}><span>{chapter.number}</span>{chapter.label}<Icon name="arrow-up" /></a>)}</nav>
        <p>Da órbita, para a vida.</p>
      </div>
    </dialog>
  </>;
}

export function ChapterRail() {
  const [active, setActive] = useState<string>('inicio');
  useEffect(() => {
    const elements = CHAPTERS.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }); }, { rootMargin: '-20% 0px -55% 0px' });
    elements.forEach(el => observer.observe(el)); return () => observer.disconnect();
  }, []);
  return <nav className="chapter-rail" aria-label="Capítulos da experiência">{CHAPTERS.map(chapter => <a href={`#${chapter.id}`} key={chapter.id} aria-label={`${chapter.number} — ${chapter.label}`} aria-current={active === chapter.id ? 'location' : undefined}><span className="rail-dot" /><span className="rail-label">{chapter.label}</span></a>)}</nav>;
}
