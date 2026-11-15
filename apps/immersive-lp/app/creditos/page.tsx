import type { Metadata } from 'next';
import { LEVELS, LINKS } from '@/lib/content';
import { Navigation } from '@/components/Navigation';
export const metadata: Metadata = { title: 'Fontes e créditos — MISSÃO IPÊ', alternates: { canonical: '/creditos' } };
export default function Credits() {
  return <>
    <a className="ipe-skip" href="#conteudo">Ir ao conteúdo</a>
    <Navigation page="credits" />
    <main id="conteudo" className="credits-page" tabIndex={-1}>
      <header className="credits-intro">
        <p className="eyebrow">Fontes e créditos</p>
        <h1>Uma missão com <em>origem e propósito.</em></h1>
        <p>A MISSÃO IPÊ é uma experiência educativa independente de engenharia de missões espaciais. Esta página registra as fontes dos materiais usados na landing page.</p>
      </header>
    <h2>Terra e ciência</h2><p>A imagem da Terra é a composição Blue Marble, hemisfério ocidental, da NASA / Goddard Space Flight Center. Créditos: Reto Stöckli e Robert Simmon; dados MODIS e equipes colaboradoras. A página combina a imagem com sombra, órbitas e identificação conceitual do Cerrado. Não é uma visualização de telemetria ao vivo.</p><ul><li><a href="https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/">Blue Marble — fonte original</a></li><li><a href="https://www.nasa.gov/nasa-brand-center/images-and-media/">NASA — diretrizes de uso de imagens</a></li><li><a href="https://nasa-missaoipe.alexandrebelo.com/context/research-library.html">Pesquisa e origem dos registros MOD13Q1.061 do jogo</a></li></ul><p>O laboratório usa uma cópia identificada do motor do beta IPÊ. Os dados científicos são históricos; satélite, componentes, duração e créditos são didáticos. Referências à NASA não significam endosso, certificação ou elegibilidade em evento.</p>
    <h2>Três histórias, fontes verificáveis</h2><p>Terra/MODIS, a investigação de rochas brilhantes em Bennu e o espectro de WASP-39 b observado pelo Webb são referências históricas reais. O laboratório identifica separadamente arquivos históricos, parâmetros didáticos e medições sintéticas.</p><ul>{LEVELS.map(level => <li key={level.number}><a href={level.source}>{level.sourceLabel}</a></li>)}</ul><p>O nome e a árvore IPÊ representam a equipe. Não substituem os fatos científicos nem definem etapas de uma missão NASA.</p>
    <h2>Direção visual</h2><p>A narrativa por capítulos, a escala planetária e o ritmo de exploração foram estudados a partir das referências indicadas para o projeto. A composição, o código, os esquemas dos casos científicos, as trajetórias e a ilustração do CubeSat desta LP foram feitos para a equipe IPÊ.</p><ul><li><a href="https://www.un.org/en/content/feature/theracetosavespace/">ONU — The Race to Save Space</a></li><li><a href="https://www.spaceforce.com/">U.S. Space Force — referência visual</a></li></ul><p>Não foram reutilizados código, marcas, áudio ou vídeos dessas duas referências. A marca MISSÃO IPÊ preserva o símbolo e a composição fornecidos pelo responsável pelo projeto.</p>
    <h2>Página 404</h2><p>A composição foi inspirada em <a href="https://motionsites.ai/?prompt=404-planet">404 Planet, da MotionSites</a>. No domínio oficial, a Terra usa a composição Blue Marble da NASA servida pelo próprio site. A versão em projeto-ipe-lp.vercel.app também oferece o vídeo de fundo externo indicado pelo responsável pelo projeto.</p>
    <h2>Tipografia e movimento</h2><p>As páginas usam Bricolage Grotesque para títulos e Plus Jakarta Sans para textos e controles. As famílias são servidas pelo próprio site sob SIL Open Font License. O filme foi renderizado com EB Garamond e Figtree. As animações usam GSAP e o filme usa Remotion. Os avisos e as licenças acompanham o código-fonte.</p><ul><li><a href="/fonts/BricolageGrotesque-OFL.txt">Bricolage Grotesque / OFL</a></li><li><a href="/fonts/PlusJakartaSans-OFL.txt">Plus Jakarta Sans / OFL</a></li><li><a href="/fonts/ebgaramond-OFL.txt">EB Garamond / OFL</a></li><li><a href="/fonts/figtree-OFL.txt">Figtree / OFL</a></li><li><a href="https://gsap.com/community/standard-license/">GSAP — licença</a></li><li><a href="https://www.remotion.dev/license">Remotion — licença</a></li></ul>
    <h2>Assets para novas missões</h2><p>O pacote de entrega inclui uma seleção GLTF do KayKit Space Base Bits de Kay Lousberg, sob CC0, com arquivos de licença e procedência. Esses modelos são recursos opcionais para a evolução do game; a LP não carrega um motor 3D.</p><p><a href="https://github.com/KayKit-Game-Assets/KayKit-Space-Base-Bits-1.0">Repositório oficial do KayKit Space Base Bits</a></p>
    <h2>Privacidade e autoria</h2><p>Esta LP não pede cadastro e não envia resultados do laboratório a um servidor. No domínio oficial, a Cloudflare mede visitas e desempenho da página; nome e e-mail são solicitados somente ao iniciar uma participação no jogo. As escolhas do experimento vivem na memória da página. O download do resultado é criado no navegador. O som ambiente é sintetizado localmente e começa apenas por escolha do visitante. A navegação ao beta, à pesquisa ou a outros sites deixa esta página.</p><p>Desenvolvimento, pesquisa e redação assistidos por IA. Código original da contribuição sob Apache-2.0, conforme a licença do projeto. Esta entrega não contém resultados de testes com público nem alegações de impacto educacional validado.</p>
    </main>
    <footer className="credits-footer container">
      <nav className="ipe-site-nav" aria-label="Mais sobre o projeto">
        <a href="/">Voltar ao início</a>
        <a href={LINKS.research}>Abrir a biblioteca de pesquisa</a>
        <a href={LINKS.pitch}>Assistir à apresentação</a>
      </nav>
    </footer>
  </>;
}
