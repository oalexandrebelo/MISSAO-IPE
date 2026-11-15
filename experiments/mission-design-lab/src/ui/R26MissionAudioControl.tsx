import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createR26MissionAudio } from './R26MissionAudio.ts';
import type { R26MissionCue } from './R26MissionAudio.ts';

type AudioStatus = 'off' | 'starting' | 'on' | 'unavailable';

export function useR26MissionAudio() {
  const controller = useRef<ReturnType<typeof createR26MissionAudio> | null>(null);
  const request = useRef(0);
  const [status, setStatus] = useState<AudioStatus>('off');
  useEffect(() => {
    const audio = createR26MissionAudio();
    controller.current = audio;
    return () => { request.current++; audio.dispose(); controller.current = null; };
  }, []);

  const play = useCallback((cue: R26MissionCue) => controller.current?.play(cue) ?? false, []);
  async function toggle() {
    const audio = controller.current;
    if (!audio) return;
    const pending = ++request.current;
    if (status === 'on' || status === 'starting') {
      audio.mute();
      setStatus('off');
      return;
    }
    setStatus('starting');
    const active = await audio.enable();
    if (pending !== request.current || controller.current !== audio) return;
    setStatus(active ? 'on' : 'unavailable');
    if (active) audio.play('choice');
  }

  return { status, play, toggle };
}

export function R26MissionAudioControl({ audio }: { audio: ReturnType<typeof useR26MissionAudio> }) {
  const description = useId();
  const enabled = audio.status === 'on' || audio.status === 'starting';
  return <div className="r26-mission-audio" data-audio-status={audio.status}>
    <button type="button" className="bruno-action bruno-secondary" aria-pressed={enabled}
      aria-describedby={description} onClick={() => { void audio.toggle(); }}>
      Sons da missão: {audio.status === 'starting' ? 'ativando' : audio.status === 'on' ? 'ligados' : 'desligados'}
    </button>
    <p id={description} role="status" style={{ fontSize: '.8125rem', maxWidth: '44ch', marginTop: '.35rem' }}>
      {audio.status === 'unavailable'
        ? 'O navegador não liberou o áudio. Você pode tentar novamente; os resultados continuam na tela.'
        : 'Confirmações curtas e opcionais. Todas as informações também aparecem na tela.'}
    </p>
  </div>;
}
