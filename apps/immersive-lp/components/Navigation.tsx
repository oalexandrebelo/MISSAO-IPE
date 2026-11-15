'use client';
import { useEffect, useRef, useState } from 'react';
import { CHAPTERS, LINKS } from '@/lib/content';
import { Icon } from './Icon';

export function Navigation({ page = 'home' }: { page?: 'home' | 'credits' | 'not-found' } = {}) {
  const isHome = page === 'home';
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuDestination = useRef<string | null>(null);
  const chapterHref = (id: string) => `${isHome ? '' : '/'}#${id}`;
  const creditsCurrent = page === 'credits' ? 'page' : undefined;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const sentinel = document.querySelector('.header-sentinel');
    if (!sentinel || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel); return () => observer.disconnect();
  }, []);
  function close() { menu.current?.close(); setOpen(false); }
  function restoreFocus() {
    setOpen(false);
    const destination = menuDestination.current;
    menuDestination.current = null;
    const target = destination ? document.getElementById(destination) : menuButton.current;
    target?.focus({ preventScroll: true });
  }
  return <>
    <header className={`site-header ipe-site-header ${isHome ? '' : 'site-header-subpage'} ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand ipe-brand" href={chapterHref('inicio')} aria-label="MISSÃO IPÊ — início" aria-current={isHome ? 'page' : undefined}><img src="/brand/missao-ipe-logo.svg" width="1064" height="499" alt="MISSÃO IPÊ" /></a>
      <nav className="desktop-nav ipe-site-nav" aria-label="Navegação principal">
        <a href={chapterHref('missao')}>A missão</a>
        <a href={chapterHref('jornada')}>Três casos NASA</a>
        <a href={chapterHref('segmentos')}>A missão completa</a>
        <a href="/creditos/" aria-current={creditsCurrent}>Créditos</a>
      </nav>
      <div className="header-actions"><a className="header-cta ipe-nav-cta" href={LINKS.game}>Jogar o beta <Icon name="arrow-up" /></a>
        <button ref={menuButton} className="menu-button" type="button" aria-label="Abrir menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { menu.current?.showModal(); setOpen(true); }}><Icon name="menu" /></button>
      </div>
      {isHome && <div className="reading-progress" aria-hidden="true"><div className="progress-fill" /></div>}
    </header>
    <dialog id="mobile-menu" className="mobile-menu" ref={menu} aria-labelledby="mobile-menu-title" onClose={restoreFocus} onClick={event => { if (event.target === menu.current) close(); }}>
      <div className="mobile-menu-inner"><div className="mobile-menu-top"><h2 id="mobile-menu-title">Navegação</h2><button type="button" className="icon-button" onClick={close} aria-label="Fechar menu"><Icon name="close" /></button></div>
        <nav aria-label="Navegação no celular">
          {CHAPTERS.map(chapter => <a href={chapterHref(chapter.id)} key={chapter.id} onClick={() => { if (isHome) menuDestination.current = chapter.id; close(); }}>{chapter.label}<Icon name="arrow-up" /></a>)}
          <a href={LINKS.pitch} onClick={close}>Apresentação<Icon name="arrow-up" /></a>
          <a href="/creditos/" aria-current={creditsCurrent} onClick={close}>Créditos<Icon name="arrow-up" /></a>
        </nav>
      </div>
    </dialog>
  </>;
}

export function ChapterRail() {
  const [active, setActive] = useState<string>('inicio');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const elements = CHAPTERS.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }); }, { rootMargin: '-20% 0px -55% 0px' });
    elements.forEach(el => observer.observe(el)); return () => observer.disconnect();
  }, []);
  return <nav className="chapter-rail" aria-label="Capítulos da experiência">{CHAPTERS.map(chapter => <a href={`#${chapter.id}`} key={chapter.id} aria-label={`${chapter.number} — ${chapter.label}`} aria-current={active === chapter.id ? 'location' : undefined}><span className="rail-dot" /><span className="rail-label">{chapter.label}</span></a>)}</nav>;
}
