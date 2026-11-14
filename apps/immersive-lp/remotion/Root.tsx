import { Composition } from 'remotion';
import { MissionFilm } from './MissionFilm';
export function RemotionRoot() { return <Composition id="IpeMission" component={MissionFilm} width={1920} height={1080} fps={30} durationInFrames={720} />; }
