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

export function MissionGlyph({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: string }) {
  return <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
    <circle cx="50" cy="50" r="45" strokeOpacity=".22" />
    {kind === 'earth' ? <><circle cx="50" cy="50" r="29" /><ellipse cx="50" cy="50" rx="13" ry="29" /><path d="M21 50h58M26 35h48M26 65h48M9 68 91 32" strokeDasharray="3 4" /></> :
      kind === 'asteroid' ? <><path d="m22 35 20-15 27 8 13 27-20 23-30-7-14-21Z" /><path d="m22 35 25 10 22-17M47 45l15 33M47 45 18 50M47 45l35 10" /><circle cx="62" cy="41" r="4" /><circle cx="34" cy="55" r="5" /></> :
      <><path d="m35 27 15-9 15 9v18l-15 9-15-9Zm-15 27 15-9 15 9v18l-15 9-15-9Zm30 0 15-9 15 9v18l-15 9-15-9Z" /><path d="m16 83 68-67M72 16h12v12" /></>}
  </svg>;
}
