import { CHAPTERS, FAQ, LEVELS, LINKS } from '@/lib/content';
import { Navigation, ChapterRail } from '@/components/Navigation';
import { MotionSystem, ExperienceControls } from '@/components/MotionSystem';
import { Planet } from '@/components/Planet';
import { Icon, MissionGlyph } from '@/components/Icon';
import { LabLoader } from '@/components/LabLoader';
import { Roadmap } from '@/components/Roadmap';
import { VideoExperience } from '@/components/VideoExperience';

export default function Home() {
  return <MotionSystem>
    <a className="ipe-skip" href="#conteudo">Ir ao conteúdo</a>
    <div className="header-sentinel" aria-hidden="true" />
    <Navigation /><ChapterRail />
    <main id="conteudo" tabIndex={-1}>
      <section className="hero" id="inicio" aria-labelledby="hero-title" tabIndex={-1}>
        <div className="starfield" aria-hidden="true" />
        <div className="hero-orbit-scene" aria-hidden="true">
          <div className="planet-parallax"><Planet className="hero-planet" priority /></div>
          <svg className="hero-orbits" viewBox="0 0 1000 900" fill="none">
            <ellipse cx="560" cy="450" rx="470" ry="280" transform="rotate(-35 560 450)" stroke="#c5d8a9" strokeOpacity=".17" />
            <ellipse cx="560" cy="450" rx="450" ry="380" transform="rotate(25 560 450)" stroke="#c5d8a9" strokeOpacity=".1" strokeDasharray="2 9" />
            <path id="hero-orbit-path" d="M125 660C-40 430 600-35 900 210S790 940 450 855 210 795 125 660Z" stroke="#d4eaaa" strokeOpacity=".28" strokeWidth=".8" />
            <g className="orbit-satellite"><path d="M-17-5h10v10h-10Zm24 0h10v10H7Z" fill="#a9c3b3" /><path d="M-6-7H6V7H-6Z" fill="#e4e9bd" /><path d="M0-11v22M-20 0h40" stroke="#eef4ce" strokeWidth="1" /></g>
            <g stroke="#c6e79b" opacity=".6"><path d="M695 555h24m-12-12v24" /><circle cx="707" cy="555" r="22" strokeDasharray="1 5" /></g>
          </svg>
          <div className="earth-tag"><span className="tag-cross">+</span><div>CERRADO, BRASIL<small>17,75° S / 50,98° O</small></div><i /></div>
          <span className="orbital-caption">TERRA · NOSSO PONTO DE PARTIDA</span>
        </div>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-content container">
          <p className="hero-eyebrow eyebrow"><span className="accent-dash" /> DA ÓRBITA, PARA A VIDA</p>
          <h1 id="hero-title" className="hero-title">O espaço é só <br />{' '}o <em>começo.</em></h1>
          <p className="hero-copy">Monte sua nave, simule a operação e investigue quais dados chegam à Terra. Jogue sete missões, com três casos que usam registros históricos da NASA.</p>
          <div className="hero-actions">
            <a href={LINKS.game} className="button button-primary" data-magnetic>Jogar agora <Icon name="arrow-up" /></a>
            <a href={LINKS.documentation} className="button button-outline">Documentação <Icon name="arrow-up" /></a>
          </div>
          <div className="hero-support">
            <p className="hero-footnote"><i className="status-dot" aria-hidden="true" /> Beta aberto · entrada com nome e e-mail</p>
            <VideoExperience />
          </div>
        </div>
        <div className="hero-bottom container"><a className="scroll-invitation" href="#missao"><span className="scroll-line" />ROLE PARA EXPLORAR <Icon /></a><ExperienceControls /><span className="hero-image-credit">TERRA: NASA / BLUE MARBLE<br />{' '}COMPOSIÇÃO VISUAL ARTÍSTICA</span></div>
      </section>

      <noscript><div className="noscript-note">A leitura e os links continuam disponíveis. Para usar o laboratório, o filme e a timeline interativa, ative o JavaScript.</div></noscript>

      <div className="mission-facts container" aria-label="O projeto em números"><div><span>07</span><p>missões para projetar e jogar</p></div><div><span>04</span><p>segmentos que conectam a missão</p></div><div><span>06</span><p>registros para fazer chegar</p></div><a href="#laboratorio">Experimentar no laboratório <Icon name="arrow-up" /></a></div>

      <section className="mission-section section-pad" id="missao" aria-labelledby="mission-title" tabIndex={-1}>
        <div className="container">
          <div className="section-kicker"><span className="eyebrow">01 / NOSSA RAZÃO DE EXPLORAR</span><span className="small-orbit" aria-hidden="true">✳</span><span className="eyebrow muted">CIÊNCIA QUE CHEGA</span></div>
          <h2 id="mission-title" className="mission-statement">Não basta chegar ao espaço. <br />{' '}É preciso fazer a ciência <br />{' '}<em>chegar à Terra.</em></h2>
          <div className="mission-intro" data-reveal><span className="eyebrow">O GRANDE DESAFIO<br />{' '}ESTÁ NO CAMINHO DE VOLTA.</span><p>Na MISSÃO IPÊ, <strong>suas escolhas determinam quais dados chegam à Terra.</strong> A nave pode coletar todos os registros e perder a janela de comunicação. Projete a nave, simule a operação e use o relatório para decidir o que mudar.</p></div>
          <div className="signal-diagram" role="group" aria-label="Etapas para jogar">
            <svg viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true"><path className="signal-path" d="M0 45H270Q300 45 315 25T360 25Q385 45 410 45H600Q640 45 650 65T705 65Q720 45 760 45H1000" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
            {[
              ['01', 'Briefing.', 'Comece pela pergunta científica.', 'Escolha um destino e descubra o que você precisa medir e entregar.'],
              ['02', 'Hangar.', 'Monte a nave e confira a previsão.', 'Escolha instrumentos e recursos. Inspecione a nave em 3D e veja o que muda no projeto.'],
              ['03', 'Operação.', 'Acompanhe os eventos e leia o relatório.', 'Confira quantos registros chegaram válidos à Terra. Volte ao hangar para testar outra escolha.'],
            ].map(([number, title, subtitle, text]) => <article key={number} data-reveal><span className="signal-node">{number}</span><h3>{title}</h3><h4>{subtitle}</h4><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="laboratorio" className="lab-section section-pad" aria-labelledby="lab-title" tabIndex={-1}><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span className="accent-dash" />02 / VOCÊ NO CONTROLE</p><h2 id="lab-title">Pequenas escolhas.<br />{' '}<em>Grandes descobertas.</em></h2></div><p>O mesmo satélite. Uma janela menor para transmitir.<br />{' '}Experimente mudar o projeto e veja o que chega à Terra.</p></div>
        <LabLoader />
        <p className="lab-disclaimer">Neste ensaio do Cerrado, você testa um projeto com registros históricos. Componentes, créditos e duração fazem parte da simulação. <a href={LINKS.research}>Explore a origem dos dados <Icon name="arrow-up" /></a></p>
      </div></section>

      <section id="jornada" className="journey-section section-pad" aria-labelledby="journey-title" tabIndex={-1}><div className="container">
        <div className="section-heading"><div><p className="eyebrow">03 / CIÊNCIA REAL, ESCOLHAS PARA INVESTIGAR</p><h2 id="journey-title">Três perguntas.<br />{' '}<em>Um método científico.</em></h2></div><p>Cada caso começa em um fato da NASA.<br />{' '}O exercício mostra por que a engenharia muda a ciência que chega.</p></div>
        <div className="levels-grid">{LEVELS.map(level => <article className={`level-card ${level.live ? 'level-live' : ''}`} key={level.number} data-reveal>
          <div className="level-top"><span className="level-number">{level.number}</span><span className="level-state"><i />{level.status}</span></div>
          <MissionGlyph kind={level.icon} className="level-glyph" />
          <p className="eyebrow">{level.tag}</p><h3>{level.name}</h3><h4>{level.subtitle}</h4><p className="level-copy">{level.text}</p><p className="level-learning">{level.learning}</p>
          <details><summary>Fato real e exercício <Icon name="plus" /></summary><p>{level.detail}</p><a className="text-link" href={level.source}>{level.sourceLabel} <Icon name="arrow-up" /></a></details>
          <a href={LINKS.game} className="level-link">Escolher missão no jogo <Icon name="arrow-up" /></a>
        </article>)}</div>
        <div className="journey-demo"><p><strong>Apresente os três casos em seis minutos.</strong> O roteiro mostra como comparar duas escolhas, seguir um registro e concluir com os quatro papéis da missão.</p><a href={LINKS.roadmap} className="text-link">Abrir roteiro da demonstração <Icon name="arrow-up" /></a></div>
        <div className="journey-demo"><p><strong>ISS, Lua, Marte e Europa.</strong> Preserve a calibração do monitor na ISS, combine temperatura e indícios de hidrogênio na Lua, proteja a estação na chegada a Marte e planeje a carga de radar e espectrometria para Europa. Compre e equipe os instrumentos, compare montagens e confira no relatório quantas leituras simuladas chegaram válidas. Os quatro desafios adaptam a contribuição de Bruno A Carvalho.</p><a href={LINKS.game} className="text-link">Jogar os desafios de engenharia <Icon name="arrow-up" /></a></div><p className="journey-note">Prefere avançar por etapas no Cerrado? <a href={LINKS.campaign}>Jogue a campanha: Primeiro sinal → Memória em disputa → Janela estreita → Ciência que chega.</a></p>
      </div></section>

      <section className="earth-interlude" aria-labelledby="earth-title">
        <div className="starfield" aria-hidden="true" /><Planet className="horizon-planet" />
        <div className="container earth-interlude-content" data-reveal><p className="eyebrow">DISTÂNCIA MUDA A PERSPECTIVA.</p><h2 id="earth-title">Quando olhamos de longe,<br />{' '}entendemos o que está <em>perto.</em></h2><p>O Cerrado é nosso ponto de partida.<br />{' '}A vontade de entender o mundo é o que nos move.</p><a className="text-link" href={LINKS.research}>Conheça a ciência por trás do Ipê <Icon name="arrow-up" /></a></div>
      </section>

      <section id="segmentos" className="roadmap-section section-pad" aria-labelledby="roadmap-title" tabIndex={-1}><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span className="accent-dash" />04 / ENGENHARIA DE SISTEMAS</p><h2 id="roadmap-title">Quatro segmentos.<br />{' '}<em>Uma missão completa.</em></h2></div><p>Do lançamento à interpretação dos dados.<br />{' '}Entenda quem faz a ciência acontecer em cada etapa.</p></div>
        <Roadmap />
        <div className="research-link" data-reveal><div><span className="research-asterisk" aria-hidden="true">✳</span><div><h3>Curiosidade com fundamento.</h3><p>Fontes, decisões e limites à disposição de quem quer ir além.</p></div></div><a href={LINKS.research} className="button button-outline">Abrir biblioteca de pesquisa <Icon name="arrow-up" /></a></div>
      </div></section>

      <section className="faq-section section-pad" aria-labelledby="faq-title"><div className="container faq-layout"><div data-reveal><p className="eyebrow">ANTES DA PARTIDA</p><h2 id="faq-title">Boas missões<br />{' '}começam com<br />{' '}<em>boas perguntas.</em></h2></div><div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="final-cta" aria-labelledby="cta-title"><div className="container"><div><p className="eyebrow">O PRÓXIMO PASSO É SEU.</p><h2 id="cta-title">O universo faz perguntas.<br />{' '}<em>Vamos procurar respostas?</em></h2><a href={LINKS.game} className="button button-ink" data-magnetic>Jogar Missão Ipê <Icon name="arrow-up" /></a><span className="cta-small">Explore. Questione. Redesenhe.</span></div><div className="cta-orbit" aria-hidden="true"><img src="/brand/missao-ipe-symbol.svg" width="488" height="488" alt="" /></div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><a href="#inicio" className="footer-brand"><img src="/brand/missao-ipe-logo-stacked.svg" width="890" height="1110" alt="MISSÃO IPÊ" /><span>Da órbita, para a vida.</span></a><nav aria-label="Mais sobre o projeto"><a href={LINKS.documentation}>Documentação <Icon name="arrow-up" /></a><a href={LINKS.github}>GitHub <Icon name="arrow-up" /></a><a href={LINKS.pitch}>Pitch · Alexandre Belo <Icon name="arrow-up" /></a><a href="/creditos/">Fontes e créditos <Icon name="arrow-up" /></a></nav><a href="#inicio" className="back-to-top" aria-label="Voltar ao início"><Icon name="arrow-up" /></a></div><div className="footer-bottom"><span>© 2026 MISSÃO IPÊ · FEITO PARA EXPLORAR.</span><p>Experiência educativa independente. Referências à NASA não representam endosso institucional.</p><span>BRASIL <span className="footer-spark">✳</span> TERRA</span></div></div></footer>
  </MotionSystem>;
}
