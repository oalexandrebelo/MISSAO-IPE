'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

const MotionContext = createContext({ enabled: true, toggle: () => {} });
export function useMotionPreference() { return useContext(MotionContext); }

export function MotionSystem({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off';
    if (!enabled) return;
    let cancelled = false;
    let cleanup = () => {};
    void Promise.all([
      import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'),
      import('gsap/DrawSVGPlugin'), import('gsap/MotionPathPlugin'),
    ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, { MotionPathPlugin }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin);
      const disposers: (() => void)[] = [];
      const ctx = gsap.context(() => {
        // The document remains visible until enhancement is ready. No preloader or scroll hijack.
        const title = SplitText.create('.hero-title', { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 105, opacity: 0, duration: 1.15, stagger: .13, ease: 'power3.out' }) });
        disposers.push(() => title.revert());
        gsap.from('.hero-eyebrow, .hero-copy, .hero-actions', { y: 18, opacity: 0, duration: 1, stagger: .1, delay: .2 });
        gsap.from('.hero-planet', { scale: .88, opacity: .3, duration: 1.8, ease: 'power2.out' });
        gsap.to('.hero-orbit-scene', { yPercent: 13, rotation: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
          gsap.from(el, { y: 36, opacity: 0, duration: .95, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 93%', once: true } });
        });
        const statement = SplitText.create('.mission-statement', { type: 'words', aria: 'auto' });
        gsap.fromTo(statement.words, { opacity: .52 }, { opacity: 1, stagger: .12, ease: 'none', scrollTrigger: { trigger: '.mission-statement', start: 'top 80%', end: 'bottom 43%', scrub: .4 } });
        disposers.push(() => statement.revert());
        gsap.from('.signal-path', { drawSVG: '0%', duration: 2, ease: 'power1.inOut', scrollTrigger: { trigger: '.signal-diagram', start: 'top 82%', once: true } });
        const orbiter = gsap.to('.orbit-satellite', { motionPath: { path: '#hero-orbit-path', align: '#hero-orbit-path', alignOrigin: [.5, .5], autoRotate: true }, duration: 42, repeat: -1, ease: 'none' });
        let heroVisible = true;
        const updateOrbit = () => orbiter.paused(document.hidden || !heroVisible);
        ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: self => { heroVisible = self.isActive; updateOrbit(); } });
        document.addEventListener('visibilitychange', updateOrbit);
        disposers.push(() => document.removeEventListener('visibilitychange', updateOrbit));
        gsap.to('.progress-fill', { scaleX: 1, transformOrigin: 'left', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });

        const mm = gsap.matchMedia();
        mm.add('(min-width: 900px) and (pointer: fine)', () => {
          const hero = document.querySelector<HTMLElement>('.hero');
          if (!hero) return;
          const x = gsap.quickTo('.planet-parallax', 'x', { duration: 1.2, ease: 'power3.out' });
          const y = gsap.quickTo('.planet-parallax', 'y', { duration: 1.2, ease: 'power3.out' });
          const pointer = (event: PointerEvent) => { x((event.clientX / innerWidth - .5) * 24); y((event.clientY / innerHeight - .5) * 18); };
          const leave = () => { x(0); y(0); };
          hero.addEventListener('pointermove', pointer, { passive: true });
          hero.addEventListener('pointerleave', leave);
          const magnets: (() => void)[] = [];
          document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
            let rect: DOMRect;
            const mx = gsap.quickTo(el, 'x', { duration: .4, ease: 'power2.out' });
            const my = gsap.quickTo(el, 'y', { duration: .4, ease: 'power2.out' });
            const enter = () => { rect = el.getBoundingClientRect(); };
            const move = (e: PointerEvent) => { if (!rect) return; mx((e.clientX - rect.left - rect.width / 2) * .1); my((e.clientY - rect.top - rect.height / 2) * .16); };
            const reset = () => { mx(0); my(0); };
            el.addEventListener('pointerenter', enter); el.addEventListener('pointermove', move, { passive: true }); el.addEventListener('pointerleave', reset);
            magnets.push(() => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset); });
          });
          return () => { hero.removeEventListener('pointermove', pointer); hero.removeEventListener('pointerleave', leave); magnets.forEach(fn => fn()); };
        });
        disposers.push(() => mm.revert());
      });
      cleanup = () => { disposers.forEach(fn => fn()); ctx.revert(); };
      void document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    }).catch(() => { document.documentElement.dataset.motion = 'off'; });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);

  return <MotionContext.Provider value={{ enabled, toggle: () => setEnabled(value => !value) }}>{children}</MotionContext.Provider>;
}

export function ExperienceControls() {
  const { enabled, toggle } = useMotionPreference();
  const [sound, setSound] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audio = useRef<AudioContext | null>(null);
  useEffect(() => {
    const onHidden = () => { if (document.hidden && audio.current) { void audio.current.suspend(); setSound(false); } };
    document.addEventListener('visibilitychange', onHidden);
    return () => { document.removeEventListener('visibilitychange', onHidden); void audio.current?.close(); };
  }, []);
  async function toggleSound() {
    try {
      if (sound) { await audio.current?.suspend(); setSound(false); return; }
      if (!audio.current) {
        const context = new AudioContext(); audio.current = context;
        const master = context.createGain(); master.gain.value = .018; master.connect(context.destination);
        [55, 82.41, 110.2].forEach(frequency => { const tone = context.createOscillator(); tone.type = 'sine'; tone.frequency.value = frequency; tone.connect(master); tone.start(); });
      }
      await audio.current.resume(); setSound(true); setAudioError('');
    } catch { setAudioError('Áudio indisponível neste navegador.'); }
  }
  return <div className="experience-controls">
    <button type="button" onClick={() => void toggleSound()} aria-pressed={sound} aria-label={sound ? 'Silenciar som ambiente' : 'Ativar som ambiente'}><Icon name={sound ? 'sound' : 'mute'} /><span>{sound ? 'Silenciar' : 'Ativar som'}</span></button>
    <span className="control-divider" />
    <button type="button" onClick={toggle} aria-pressed={!enabled} aria-label={enabled ? 'Pausar animações' : 'Ativar animações'}><Icon name={enabled ? 'pause' : 'play'} /><span>{enabled ? 'Pausar' : 'Ativar'}</span></button>
    <span className="sr-only" role="status">{audioError}</span>
  </div>;
}
