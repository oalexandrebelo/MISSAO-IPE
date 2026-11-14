'use client';
import { Player } from '@remotion/player';
import { MissionFilm } from '@/remotion/MissionFilm';
export default function MissionPlayer() {
  return <Player component={MissionFilm} durationInFrames={720} compositionWidth={1920} compositionHeight={1080} fps={30} style={{ width: '100%', aspectRatio: '16 / 9' }} controls autoPlay={false} loop={false} clickToPlay doubleClickToFullscreen spaceKeyToPlayOrPause acknowledgeRemotionLicense />;
}
