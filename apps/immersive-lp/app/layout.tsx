import type { Metadata, Viewport } from 'next';
import { editorial, sans } from '@/lib/fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projeto-ipe-lp.vercel.app';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'PROJETO IPÊ — Da órbita, para a vida.',
  description: 'O espaço é só o começo. Explore o Projeto Ipê: uma experiência educativa de engenharia de missões espaciais. Projete, investigue e faça a ciência chegar à Terra.',
  applicationName: 'Projeto Ipê',
  openGraph: { type: 'website', locale: 'pt_BR', title: 'PROJETO IPÊ — Da órbita, para a vida.', description: 'Uma missão espacial. Uma pergunta sobre o Cerrado. E um universo de escolhas.', images: [{ url: '/assets/earth.webp', width: 1600, height: 1600, alt: 'Projeto Ipê — Terra, composição Blue Marble / NASA' }] },
  twitter: { card: 'summary_large_image', title: 'Projeto Ipê — Ciência que chega', images: ['/assets/earth.webp'] },
  icons: { icon: '/brand/projeto-ipe-symbol.svg' },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#080d10', colorScheme: 'dark' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${editorial.variable} ${sans.variable}`}><body>{children}</body></html>;
}
