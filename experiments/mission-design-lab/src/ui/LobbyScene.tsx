import { useEffect, useRef, useState } from 'react';
import type { MetricMission } from '../metrics/player-metrics.ts';
import type { LobbySceneController } from './LobbySceneRenderer.ts';

export type LobbyMissionId = MetricMission;
const BASE = import.meta.env?.BASE_URL ?? './';
export const LOBBY_TEXTURES = {
  iss: 'earth', cerrado: 'earth', moon: 'moon', mars: 'mars', europa: 'europa', bennu: null, telescope: null,
} as const;

function Fallback({ missionId }: { missionId: LobbyMissionId }) {
  const texture = LOBBY_TEXTURES[missionId];
  if (texture) return <div data-lobby-fallback="nasa-texture" style={{ position: 'absolute', left: '50%', top: '52%', width: 'max(115%, 78vh)', aspectRatio: '1', transform: 'translateX(-50%)', borderRadius: '50%', backgroundColor: '#14232c', backgroundImage: `radial-gradient(circle at 26% 13%, transparent 10%, #07101b66 43%, #050a12f5 75%), url("${BASE}textures/lobby/${texture}.webp")`, backgroundPosition: 'center', backgroundSize: 'cover', boxShadow: texture === 'earth' ? '0 -2px 16px #7aafc942' : 'none' }} />;
  return <svg data-lobby-fallback="illustration" viewBox="0 0 600 360" style={{ position: 'absolute', width: '100%', height: '52%', bottom: 0 }} aria-hidden="true">
    {missionId === 'bennu' ? <path d="M135 330 120 209 194 113 310 75 419 124 472 231 421 350Z" fill="#605b50" stroke="#a39b87" strokeWidth="1" /> : <g transform="translate(300 190)"><path d="M-200 37-24-50 172 26 85 123-93 111Z" fill="#6b7783" stroke="#a3aeba" /><g fill="#bba573" stroke="#625640" strokeWidth="2">{[-1, 0, 1].flatMap(row => [-1, 0, 1].map(col => <path key={`${row}-${col}`} transform={`translate(${col * 37 + (row % 2) * 18} ${row * 33 - 30})`} d="M-22 0-11-19 11-19 22 0 11 19-11 19Z" />))}</g></g>}
  </svg>;
}

/** Decorative context only. Selection, navigation and destination names remain in HTML. */
export function LobbyScene({ missionId, paused = false }: { missionId: LobbyMissionId; paused?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<LobbySceneController | null>(null);
  const latest = useRef({ missionId, paused });
  latest.current = { missionId, paused };
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false;
    void import('./LobbySceneRenderer.ts').then(({ createLobbyScene }) => {
      if (disposed || !host.current) return;
      try { controller.current = createLobbyScene(host.current, latest.current.missionId, latest.current.paused, value => { if (!disposed) setReady(value); }); }
      catch { setReady(false); }
    }).catch(() => { if (!disposed) setReady(false); });
    return () => { disposed = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => { controller.current?.setMission(missionId); }, [missionId]);
  useEffect(() => { controller.current?.setPaused(paused); }, [paused]);
  return <div className="lobby-scene" data-lobby-mission={missionId} data-lobby-renderer={ready ? 'webgl' : 'fallback'} aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {!ready ? <Fallback missionId={missionId} /> : null}
    <div ref={host} style={{ position: 'absolute', inset: 0, opacity: ready ? 1 : 0 }} />
  </div>;
}

export default LobbyScene;
