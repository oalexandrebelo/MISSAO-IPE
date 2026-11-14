import type { CSSProperties } from 'react';

export type IconName = 'arrow' | 'back' | 'globe' | 'satellite' | 'signal' | 'battery' | 'sun' | 'chip' | 'memory' | 'route' | 'check' | 'close' | 'play' | 'pause' | 'download' | 'upload' | 'book' | 'history' | 'spark' | 'info' | 'warning' | 'search' | 'save' | 'layers' | 'chevron';
const paths: Record<IconName, string> = {
  arrow: 'M4 12h15m-6-6 6 6-6 6', back: 'M20 12H5m6-6-6 6 6 6',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
  satellite: 'm9 7 8 8-4 4-8-8 4-4Zm-3 3L2 6l4-4 4 4m4 8 4 4 4-4-4-4M7 17l-3 3m14-15a6 6 0 0 1 1 6m-5-5a3 3 0 0 1 2 3',
  signal: 'M5 20v-4m5 4v-8m5 8V8m5 12V4', battery: 'M3 7h16v12H3V7Zm16 4h3v4h-3M7 10v6m4-6v6m4-6v6',
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
  chip: 'M6 6h12v12H6V6Zm3-4v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4M9 9h6v6H9V9Z',
  memory: 'M5 3h11l3 3v15H5V3Zm4 0v6h6V3M9 15h6m-6 3h6',
  route: 'M5 5a2 2 0 1 1 0 .1M19 19a2 2 0 1 1 0 .1M5 7v7a5 5 0 0 0 5 5h7M7 5h7a5 5 0 0 1 5 5v7',
  check: 'm5 12 4 4L19 6', close: 'm6 6 12 12M18 6 6 18', play: 'm8 4 12 8-12 8V4Z', pause: 'M8 5v14M16 5v14',
  download: 'M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4', upload: 'M12 16V4m-5 5 5-5 5 5M4 17v4h16v-4',
  book: 'M12 5C8 2 4 3 2 4v15c3-2 7-1 10 1 3-2 7-3 10-1V4c-2-1-6-2-10 1Zm0 0v15',
  history: 'M3 11a9 9 0 1 1 3 8M3 4v7h7m2-4v6l4 2', spark: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
  info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 11v6m0-10v1',
  warning: 'm12 3 10 18H2L12 3Zm0 6v5m0 3v1', search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6',
  save: 'M4 3h13l4 4v14H4V3Zm3 0v6h9V3M8 21v-7h9v7', layers: 'm12 3 10 6-10 6L2 9l10-6ZM2 13l10 6 10-6M2 17l10 6 10-6',
  chevron: 'm9 5 7 7-7 7',
};
export function Icon({ name, size = 20, className, style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}><path d={paths[name]} /></svg>;
}
