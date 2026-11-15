import type { Metadata, Viewport } from 'next';
import { editorial, sans } from '@/lib/fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projeto-ipe-lp.vercel.app';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MISSÃO IPÊ — Da órbita, para a vida.',
  description: 'O espaço é só o começo. Explore a MISSÃO IPÊ: uma experiência educativa de engenharia de missões espaciais. Projete, investigue e faça a ciência chegar à Terra.',
  applicationName: 'MISSÃO IPÊ',
  openGraph: { type: 'website', locale: 'pt_BR', title: 'MISSÃO IPÊ — Da órbita, para a vida.', description: 'Três casos baseados na ciência NASA: Terra/MODIS, Bennu/OSIRIS-REx e Webb/NIRSpec.', images: [{ url: '/assets/earth.webp', width: 1600, height: 1600, alt: 'MISSÃO IPÊ — Terra, composição Blue Marble / NASA' }] },
  twitter: { card: 'summary_large_image', title: 'MISSÃO IPÊ — Ciência que chega', images: ['/assets/earth.webp'] },
  icons: { icon: '/brand/missao-ipe-symbol.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#080d10', colorScheme: 'dark' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${editorial.variable} ${sans.variable}`}>
      <head><link rel="stylesheet" href="/acessibilidade/libras.css" /></head>
      <body>
        {children}
        <nav aria-label="Acessibilidade">
          <a className="ipe-libras-link vlibras-ignore" data-ipe-libras="public" href="/acessibilidade/guia.html" aria-haspopup="dialog" title="Selecione um trecho público para traduzir em Libras">Libras</a>
        </nav>
        <script src="/acessibilidade/libras.js" defer />
      </body>
    </html>
  );
}
