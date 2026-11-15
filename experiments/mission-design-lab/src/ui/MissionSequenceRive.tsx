import { useEffect, useRef, useState } from 'react';
import type { Rive, ViewModelInstanceNumber } from '@rive-app/canvas';
import './mission-sequence-rive.css';

const ARTBOARD = 'IpeMissionSequence';
const MACHINE = 'IpeMissionFlow';
const ASSET = `${import.meta.env?.BASE_URL ?? './'}rive/ipe-mission-sequence.riv`;
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';
// The runtime plays the free plan's opening to completion before resting.
const OPENING_SECONDS = 3.2;
const TRANSITION_SECONDS = 0.65;
const steps = ['Decisão', 'Lançamento', 'Coleta', 'Recepção'] as const;
const outcomes = ['Missão concluída', 'Missão incompleta', 'Lançamento bloqueado'] as const;

export type MissionSequenceStage = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Player = { rive: Rive; input: ViewModelInstanceNumber; remaining: number; sized: boolean; resetClock: boolean };

export function MissionSequenceRive({ stage }: { stage: MissionSequenceStage }) {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desiredStage = useRef(stage);
  const synchronize = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(MOTION_QUERY).matches);

  useEffect(() => {
    const motion = window.matchMedia?.(MOTION_QUERY);
    if (!motion) return;
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener?.('change', update);
    return () => motion.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const figure = figureRef.current;
    setReady(false);
    if (!canvas || !figure || reducedMotion) return;
    const abort = new AbortController();
    let rive: Rive | undefined;
    let player: Player | undefined;
    let requested = false;
    let visible = typeof IntersectionObserver !== 'function';

    const fail = () => {
      if (abort.signal.aborted) return;
      player = undefined;
      rive?.cleanup();
      rive = undefined;
      setReady(false);
    };

    const load = () => {
      requested = true;
      try { if (!canvas.getContext('2d')) return; }
      catch { return; }
      const file = fetch(ASSET, { signal: abort.signal }).then(response => {
        if (!response.ok) throw new Error(`Rive asset: ${response.status}`);
        return response.arrayBuffer();
      });
      void Promise.all([file, import('@rive-app/canvas'), import('@rive-app/canvas/rive.wasm?url'), import('@rive-app/canvas/rive_fallback.wasm?url')])
        .then(async ([buffer, runtime, wasm, fallback]) => {
          if (abort.signal.aborted) return;
          runtime.RuntimeLoader.setWasmUrl(wasm.default);
          runtime.RuntimeLoader.setWasmFallbackUrl(fallback.default);
          await runtime.RuntimeLoader.awaitInstance();
          if (abort.signal.aborted) return;
          rive = new runtime.Rive({
            buffer, canvas, artboard: ARTBOARD, stateMachine: MACHINE, autoBind: true,
            autoplay: false, enableRiveAssetCDN: false, shouldDisableRiveListeners: true, tabIndex: -1,
            onLoad: () => {
              if (abort.signal.aborted || !rive) return;
              const input = rive.viewModelInstance?.number('stage');
              if (!input || rive.activeArtboard !== ARTBOARD || !rive.stateMachineNames.includes(MACHINE)) { fail(); return; }
              player = { rive, input, remaining: OPENING_SECONDS, sized: false, resetClock: false };
              setReady(true);
            },
            onAdvance: ({ data }) => {
              if (!player?.rive.isPlaying || typeof data !== 'number' || !Number.isFinite(data) || data <= 0) return;
              player.remaining = Math.max(0, player.remaining - data);
              if (player.remaining === 0) player.rive.pause(MACHINE);
            },
            onLoadError: fail,
          });
        }).catch(fail);
    };

    const render = () => {
      if (!visible || document.hidden) {
        if (player?.rive.isPlaying) {
          player.rive.pause(MACHINE);
          player.rive.stopRendering();
          player.resetClock = true;
        }
        return;
      }
      if (!requested) load();
      if (!player) return;
      const { rive: animation, input } = player;
      if (!player.sized) {
        if (!canvas.getBoundingClientRect().width) return;
        animation.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio || 1, 1.5));
        player.sized = true;
        animation.drawFrame();
      }
      if (player.resetClock) {
        animation.drawFrame();
        player.resetClock = false;
      }
      if (input.value !== desiredStage.current) {
        input.value = desiredStage.current;
        player.remaining = Math.max(player.remaining, TRANSITION_SECONDS);
      }
      if (player.remaining > 0) {
        if (animation.isPlaying) animation.startRendering();
        else animation.play(MACHINE);
      }
    };

    synchronize.current = render;
    document.addEventListener('visibilitychange', render);
    const viewport = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      visible = entries.at(-1)?.isIntersecting ?? false;
      render();
    }) : null;
    viewport?.observe(figure);
    const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
      if (player) player.sized = false;
      render();
    }) : null;
    resize?.observe(figure);
    render();

    return () => {
      abort.abort();
      synchronize.current = null;
      viewport?.disconnect();
      resize?.disconnect();
      document.removeEventListener('visibilitychange', render);
      player = undefined;
      rive?.cleanup();
    };
  }, [reducedMotion]);

  useEffect(() => {
    desiredStage.current = stage;
    synchronize.current?.();
  }, [stage, ready]);

  const currentStep = stage < 4 ? stage : stage === 4 ? 3 : stage === 6 ? 0 : undefined;
  return <figure ref={figureRef} className="mission-sequence" data-mission-sequence={stage}>
    <canvas ref={canvasRef} hidden={!ready || reducedMotion} width={680} height={224} aria-hidden="true" tabIndex={-1}
      data-mission-rive={ready && !reducedMotion ? 'ready' : 'static'} />
    <ol className="mission-sequence-steps" aria-label="Etapas da simulação">
      {steps.map((step, index) => <li key={step} aria-current={index === currentStep ? 'step' : undefined}>{step}</li>)}
    </ol>
    {stage >= 4 ? <figcaption>{outcomes[stage - 4]}</figcaption> : null}
  </figure>;
}
