import { useEffect, useRef, useState } from 'react';
import type { Rive, ViewModelInstanceBoolean } from '@rive-app/canvas';
import type { SpacecraftPresentation } from '../lab/spacecraft-presentation.ts';
import './rive-subsystems.css';

const ARTBOARD = 'IpeSubsystems';
const STATE_MACHINE = 'IpeAssembly';
const INPUTS = ['payloadAlternate', 'powerExpanded', 'batteryExpanded', 'linkExpanded'] as const;
// Allow the free export's opening to complete before pausing the first render.
const OPENING_SECONDS = 3.2;
const TRANSITION_SECONDS = 0.6;
const ASSET = `${import.meta.env?.BASE_URL ?? './'}rive/ipe-subsystems.riv`;
type Input = typeof INPUTS[number];
type ArtworkState = Record<Input, boolean> & { active: boolean };
type Props = ArtworkState & { world: SpacecraftPresentation['world'] };
type Playback = {
  rive: Rive;
  inputs: Record<Input, ViewModelInstanceBoolean>;
  remainingSeconds: number;
  needsClockReset?: boolean;
};
type Artwork = Playback & { sized: boolean };

export function advanceArtwork(artwork: Playback, elapsedSeconds: unknown) {
  if (!artwork.rive.isPlaying || typeof elapsedSeconds !== 'number' || !Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) return;
  artwork.remainingSeconds = Math.max(0, artwork.remainingSeconds - elapsedSeconds);
  if (artwork.remainingSeconds === 0) artwork.rive.pause(STATE_MACHINE);
}

export function updateArtwork(artwork: Playback, props: ArtworkState) {
  if (!props.active) {
    if (artwork.rive.isPlaying) {
      artwork.rive.pause(STATE_MACHINE);
      artwork.rive.stopRendering();
      artwork.needsClockReset = true;
    }
    return;
  }
  if (artwork.needsClockReset) {
    // The paused frame resets the runtime clock before any new choice is applied.
    artwork.rive.drawFrame();
    artwork.needsClockReset = false;
  }
  for (const name of INPUTS) {
    const property = artwork.inputs[name];
    if (property.value !== props[name]) property.value = props[name];
  }
  artwork.remainingSeconds = Math.max(artwork.remainingSeconds, TRANSITION_SECONDS);
  if (artwork.rive.isPlaying) artwork.rive.startRendering();
  else artwork.rive.play(STATE_MACHINE);
}

/** A diagram of the configured parts. Recorded mission states stay in the scene. */
export function RiveSubsystems({ payloadAlternate, powerExpanded, batteryExpanded, linkExpanded, active, world }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artworkRef = useRef<Artwork | null>(null);
  const current = useRef<ArtworkState>({ payloadAlternate, powerExpanded, batteryExpanded, linkExpanded, active });
  const [mayLoad, setMayLoad] = useState(active);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    current.current = { payloadAlternate, powerExpanded, batteryExpanded, linkExpanded, active };
    if (active) setMayLoad(true);
    if (artworkRef.current?.sized) updateArtwork(artworkRef.current, current.current);
  }, [payloadAlternate, powerExpanded, batteryExpanded, linkExpanded, active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!mayLoad || !canvas) return;
    try { if (!canvas.getContext('2d')) return; }
    catch { return; }
    let removed = false;
    let rive: Rive | undefined;
    const abort = new AbortController();
    const release = () => {
      artworkRef.current = null;
      rive?.cleanup();
      rive = undefined;
    };
    const fail = () => {
      if (removed) return;
      release();
      setReady(false);
    };

    const file = fetch(ASSET, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error(`Rive asset: ${response.status}`);
      return response.arrayBuffer();
    });
    void Promise.all([
      file,
      import('@rive-app/canvas'),
      import('@rive-app/canvas/rive.wasm?url'),
      import('@rive-app/canvas/rive_fallback.wasm?url'),
    ]).then(async ([buffer, runtime, wasm, fallback]) => {
      if (removed) return;
      runtime.RuntimeLoader.setWasmUrl(wasm.default);
      runtime.RuntimeLoader.setWasmFallbackUrl(fallback.default);
      await runtime.RuntimeLoader.awaitInstance();
      if (removed) return;
      rive = new runtime.Rive({
        buffer, canvas, artboard: ARTBOARD, stateMachine: STATE_MACHINE, autoBind: true,
        autoplay: false, enableRiveAssetCDN: false, shouldDisableRiveListeners: true, tabIndex: -1,
        onAdvance: event => {
          const artwork = artworkRef.current;
          if (artwork?.sized && current.current.active) advanceArtwork(artwork, event.data);
        },
        onLoad: () => {
          if (removed || !rive) return;
          const view = rive.viewModelInstance;
          const payload = view?.boolean('payloadAlternate');
          const power = view?.boolean('powerExpanded');
          const battery = view?.boolean('batteryExpanded');
          const link = view?.boolean('linkExpanded');
          if (!payload || !power || !battery || !link || rive.activeArtboard !== ARTBOARD || !rive.stateMachineNames.includes(STATE_MACHINE)) { fail(); return; }
          artworkRef.current = {
            rive, sized: false, remainingSeconds: OPENING_SECONDS,
            inputs: { payloadAlternate: payload, powerExpanded: power, batteryExpanded: battery, linkExpanded: link },
          };
          setReady(true);
        },
        onLoadError: fail,
      });
    }).catch(fail);

    return () => {
      removed = true;
      abort.abort();
      release();
    };
  }, [mayLoad]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!ready || !active || !canvas) return;
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      // The Rive load event precedes playback setup, and the figure was hidden at load.
      frame = requestAnimationFrame(() => {
        const artwork = artworkRef.current;
        if (!artwork || !current.current.active) return;
        const { width, height } = canvas.getBoundingClientRect();
        if (width <= 0 || height <= 0) return;
        artwork.rive.resizeDrawingSurfaceToCanvas(Math.min(window.devicePixelRatio || 1, 1.5));
        frame = requestAnimationFrame(() => {
          if (artworkRef.current !== artwork || !current.current.active) return;
          artwork.sized = true;
          updateArtwork(artwork, current.current);
        });
      });
    };
    resize();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    observer?.observe(canvas);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [ready, active]);

  return <figure className="rive-subsystems" hidden={!ready} data-rive-active={active}>
    <figcaption>Diagrama das escolhas</figcaption>
    <canvas
      ref={canvasRef} width={640} height={180} aria-hidden="true" tabIndex={-1}
      data-ipe-rive={ready ? 'ready' : 'inactive'} data-payload-alternate={payloadAlternate}
      data-power-expanded={powerExpanded} data-battery-expanded={batteryExpanded} data-link-expanded={linkExpanded}
    />
    <div className="rive-subsystem-labels">
      <span>{world === 'earth' ? 'Módulo de processamento' : 'Instrumento'}</span>
      <span>Energia</span>
      <span>{world === 'earth' ? 'Capacidade do rádio' : 'Agenda dos contatos'}</span>
    </div>
  </figure>;
}
