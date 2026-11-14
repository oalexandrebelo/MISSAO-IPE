import type { SVGProps } from 'react';
type Props = SVGProps<SVGSVGElement> & { name?: 'arrow' | 'arrow-up' | 'play' | 'pause' | 'sound' | 'mute' | 'plus' | 'close' | 'menu' | 'sun' | 'signal' | 'check' };
export function Icon({ name = 'arrow', ...props }: Props) {
  const paths: Record<NonNullable<Props['name']>, React.ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    'arrow-up': <path d="M5 19 19 5M6 5h13v13" />,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: <path d="M8 5v14M16 5v14" />,
    sound: <><path d="m11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>,
    mute: <><path d="m11 4-6 5H2v6h3l6 5ZM16 9l5 6m0-6-5 6" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 8h16M4 16h16" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" /></>,
    signal: <><path d="M4 18h2m2-4h2m2-4h2m2-4h2" /><circle cx="20" cy="3" r="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export function BotanicalGlyph({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: string }) {
  return <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
    <circle cx="50" cy="50" r="45" strokeOpacity=".22" /><circle cx="50" cy="50" r="34" strokeOpacity=".1" />
    {kind === 'seed' ? <><path d="M50 77V42c-18 0-24-11-24-24 16 0 28 6 28 24M50 58c0-22 11-33 26-33 0 20-11 33-26 33" /><circle cx="50" cy="77" r="2" /></> :
      kind === 'roots' ? <><path d="M50 22v44m0-29L35 25m15 23 18-17M50 59 29 74m21-9 17 13m-30-9-11-3m35 7 12-5M50 65v18" /><circle cx="50" cy="22" r="3" /></> :
      kind === 'crown' ? <><path d="M50 84V45m0 10L30 42m20 18 21-17" /><path d="M50 16c-10 0-14 7-15 12-15-1-22 18-12 26 2 15 21 19 27 12 15 9 29-1 28-13 9-10 0-25-13-25-1-9-6-12-15-12Z" /></> :
      <><path d="M18 65h64M25 57a25 25 0 0 1 50 0M50 13v13M20 31l10 9m50-9-10 9M32 74h36" /><circle cx="50" cy="50" r="8" /></>}
  </svg>;
}
