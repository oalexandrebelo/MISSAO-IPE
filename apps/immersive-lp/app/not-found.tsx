import { LINKS } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { Navigation } from '@/components/Navigation';
import { NotFoundBackdrop } from '@/components/NotFoundBackdrop';
import styles from './not-found.module.css';

export default function NotFound() {
  return <div className={styles.page}>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Navigation outsideHome />
    <main id="conteudo" className={styles.main} tabIndex={-1}>
      <h1 className={styles.heading}>
        <span className={styles.code}>404</span>
        <span className={styles.title}>Página fora de órbita.</span>
      </h1>
      <p>Não encontramos esta página. Volte ao início para seguir explorando.</p>
      <a className={`button ${styles.returnLink}`} href="/">Voltar ao início <Icon /></a>
    </main>
    <footer className={styles.footer}>
      <nav aria-label="Destinos da MISSÃO IPÊ">
        <a href={LINKS.game}>Jogo <Icon name="arrow-up" /></a>
        <a href={LINKS.research}>Pesquisa <Icon name="arrow-up" /></a>
        <a href={LINKS.github}>GitHub <Icon name="arrow-up" /></a>
        <a href="/creditos/">Créditos <Icon name="arrow-up" /></a>
      </nav>
      <NotFoundBackdrop />
    </footer>
  </div>;
}
