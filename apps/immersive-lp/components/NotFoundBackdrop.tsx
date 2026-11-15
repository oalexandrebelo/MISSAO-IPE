'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { Planet } from './Planet';
import styles from '@/app/not-found.module.css';

const ORBIT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4';

function play(video: HTMLVideoElement) {
  if (!video.hasAttribute('src')) video.src = ORBIT_VIDEO;
  // Autoplay can be blocked even when muted. The still and the play button remain available.
  void video.play().catch(() => {});
}

export function NotFoundBackdrop() {
  const player = useRef<HTMLVideoElement>(null);
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setVideoAllowed(window.location.hostname === 'projeto-ipe-lp.vercel.app');
  }, []);

  useEffect(() => {
    const video = player.current;
    if (!videoAllowed || !video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!motion.matches) play(video);
    function reduceMotion(event: MediaQueryListEvent) {
      if (event.matches) video?.pause();
    }
    motion.addEventListener('change', reduceMotion);
    return () => motion.removeEventListener('change', reduceMotion);
  }, [videoAllowed]);

  function toggle() {
    const video = player.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    if (failed) {
      setFailed(false);
      video.load();
    }
    play(video);
  }

  const action = playing ? 'Pausar vídeo' : failed ? 'Tentar reproduzir vídeo' : 'Reproduzir vídeo';
  return <>
    <div className={styles.scene} aria-hidden="true">
      <div className="starfield" />
      <Planet className={styles.earth} priority />
      <div className={styles.orbit} />
      {videoAllowed ? <video
        id="fundo-orbital"
        ref={player}
        className={styles.video}
        data-visible={hasFrame}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => { setHasFrame(true); setPlaying(true); }}
        onPause={() => setPlaying(false)}
        onError={() => { setHasFrame(false); setPlaying(false); setFailed(true); }}
      /> : null}
      <div className={styles.vignette} />
    </div>
    {videoAllowed ? <button className={styles.motion} type="button" aria-controls="fundo-orbital" onClick={toggle}>
      <Icon name={playing ? 'pause' : 'play'} /> {action}
    </button> : null}
  </>;
}
