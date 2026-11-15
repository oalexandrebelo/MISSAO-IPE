import localFont from 'next/font/local';
export const editorial = localFont({ src: [ { path: '../public/fonts/eb-garamond-latin.woff2', weight: '400', style: 'normal' }, { path: '../public/fonts/eb-garamond-italic-latin.woff2', weight: '400', style: 'italic' } ], display: 'swap', variable: '--font-editorial' });
export const sans = localFont({ src: '../public/fonts/figtree-latin.woff2', weight: '400 600', display: 'swap', variable: '--font-sans' });
