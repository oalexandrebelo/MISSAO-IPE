import { CHAPTERS, FAQ, LEVELS, LINKS } from '@/lib/content';
import { Navigation, ChapterRail } from '@/components/Navigation';
import { MotionSystem, ExperienceControls } from '@/components/MotionSystem';
import { Planet } from '@/components/Planet';
import { Icon, BotanicalGlyph } from '@/components/Icon';
import { LabLoader } from '@/components/LabLoader';
import { Roadmap } from '@/components/Roadmap';
import { VideoExperience } from '@/components/VideoExperience';

export default function Home() {
  return <MotionSystem>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="header-sentinel" aria-hidden="true" />
    <Navigation /><ChapterRail />
    <main id="conteudo">
      <section className="hero" id="inicio" aria-labelledby="hero-title">
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
          <p className="hero-copy">Uma missão espacial. Uma pergunta sobre a Terra.<br className="desktop-only" /> E você no centro de cada decisão.</p>
          <div className="hero-actions"><a href={LINKS.game} className="button button-primary" data-magnetic>Iniciar minha missão <Icon name="arrow-up" /></a><VideoExperience /></div>
          <p className="hero-footnote"><i className="status-dot" /> BETA ABERTO <span>SEM CADASTRO · CURIOSIDADE BEM-VINDA</span></p>
        </div>
        <div className="hero-bottom container"><a className="scroll-invitation" href="#missao"><span className="scroll-line" />ROLE PARA EXPLORAR <Icon /></a><ExperienceControls /><span className="hero-image-credit">TERRA: NASA / BLUE MARBLE<br />{' '}COMPOSIÇÃO VISUAL ARTÍSTICA</span></div>
      </section>

      <div className="mission-facts container" aria-label="O projeto em números"><div><span>01</span><p>planeta que nos conecta</p></div><div><span>64</span><p>configurações para investigar</p></div><div><span>06</span><p>registros para fazer chegar</p></div><a href="#laboratorio">E se uma escolha<br />{' '}mudasse toda a missão?<Icon name="arrow-up" /></a></div>

      <section className="mission-section section-pad" id="missao" aria-labelledby="mission-title">
        <div className="container">
          <div className="section-kicker"><span className="eyebrow">01 / NOSSA RAZÃO DE EXPLORAR</span><span className="small-orbit" aria-hidden="true">✳</span><span className="eyebrow muted">CIÊNCIA QUE CHEGA</span></div>
          <h2 id="mission-title" className="mission-statement">Não basta chegar ao espaço. <br />{' '}É preciso fazer a ciência <br />{' '}<em>chegar à Terra.</em></h2>
          <div className="mission-intro" data-reveal><span className="eyebrow">O GRANDE DESAFIO<br />{' '}ESTÁ NO CAMINHO DE VOLTA.</span><p>No Projeto Ipê, você projeta um pequeno satélite para responder a uma grande pergunta: <strong>o que os dados revelam sobre a vegetação do Cerrado?</strong> Cada decisão disputa energia, memória e tempo. A descoberta só acontece quando a informação chega.</p></div>
          <div className="signal-diagram" aria-label="Fluxo da missão: observar, processar e entregar">
            <svg viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true"><path className="signal-path" d="M0 45H270Q300 45 315 25T360 25Q385 45 410 45H600Q640 45 650 65T705 65Q720 45 760 45H1000" stroke="currentColor" strokeWidth="1" fill="none" /></svg>
            {[
              ['01', 'Observar.', 'Uma pergunta com os pés no Cerrado.', 'Interprete registros históricos de vegetação. Descubra o que um dado pode — e o que não pode — dizer.'],
              ['02', 'Projetar.', 'Um sistema de escolhas conectadas.', 'Combine energia, processamento e comunicação. Mais capacidade também pode significar mais massa ou custo.'],
              ['03', 'Fazer chegar.', 'O resultado precisa voltar para casa.', 'Execute, investigue e redesenhe. Compare o que você imaginou com a ciência que realmente chegou.'],
            ].map(([number, title, subtitle, text]) => <article key={number} data-reveal><span className="signal-node">{number}</span><h3>{title}</h3><h4>{subtitle}</h4><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="laboratorio" className="lab-section section-pad" aria-labelledby="lab-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span className="accent-dash" />02 / VOCÊ NO CONTROLE</p><h2 id="lab-title">Pequenas escolhas.<br />{' '}<em>Grandes descobertas.</em></h2></div><p>O mesmo satélite. Uma janela menor para transmitir.<br />{' '}Experimente mudar o projeto e veja o que chega à Terra.</p></div>
        <LabLoader />
        <p className="lab-disclaimer">Este é um recorte interativo do beta. Componentes, créditos e duração são didáticos; os registros científicos são históricos. <a href={LINKS.research}>Explore a origem dos dados <Icon name="arrow-up" /></a></p>
      </div></section>

      <section id="jornada" className="journey-section section-pad" aria-labelledby="journey-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow">03 / UMA IDEIA QUE CRIA RAÍZES</p><h2 id="journey-title">Sua curiosidade<br />{' '}tem <em>quatro horizontes.</em></h2></div><p>Como um ipê, uma grande missão cresce por etapas.<br />{' '}Cada capítulo traz uma pergunta. E uma nova forma de pensar.</p></div>
        <div className="levels-grid">{LEVELS.map(level => <article className={`level-card ${level.live ? 'level-live' : ''}`} key={level.number} data-reveal>
          <div className="level-top"><span className="level-number">{level.number}</span><span className="level-state"><i />{level.status}</span></div>
          <BotanicalGlyph kind={level.icon} className="level-glyph" />
          <p className="eyebrow">{level.tag}</p><h3>{level.name}</h3><h4>{level.subtitle}</h4><p className="level-copy">{level.text}</p><p className="level-learning">{level.learning}</p>
          <details><summary>Sobre este capítulo <Icon name="plus" /></summary><p>{level.detail}</p></details>
          {level.live ? <a href={LINKS.game} className="level-link">Explorar no beta <Icon name="arrow-up" /></a> : <a href="#horizonte" className="level-link">Conhecer o plano <Icon /></a>}
        </article>)}</div>
        <p className="journey-note">Semente e Raízes apresentam os dois cenários existentes. A progressão entre capítulos e os níveis Copa e Horizonte são evoluções planejadas.</p>
      </div></section>

      <section className="earth-interlude" aria-labelledby="earth-title">
        <div className="starfield" aria-hidden="true" /><Planet className="horizon-planet" />
        <div className="container earth-interlude-content" data-reveal><p className="eyebrow">DISTÂNCIA MUDA A PERSPECTIVA.</p><h2 id="earth-title">Quando olhamos de longe,<br />{' '}entendemos o que está <em>perto.</em></h2><p>O Cerrado é nosso ponto de partida.<br />{' '}A vontade de entender o mundo é o que nos move.</p><a className="text-link" href={LINKS.research}>Conheça a ciência por trás do Ipê <Icon name="arrow-up" /></a></div>
      </section>

      <section id="horizonte" className="roadmap-section section-pad" aria-labelledby="roadmap-title"><div className="container">
        <div className="section-heading"><div><p className="eyebrow"><span className="accent-dash" />04 / O QUE VEM PELA FRENTE</p><h2 id="roadmap-title">Uma missão viva.<br />{' '}<em>Um horizonte aberto.</em></h2></div><p>Do primeiro protótipo às próximas descobertas.<br />{' '}Acompanhe o que já existe e o que queremos construir.</p></div>
        <Roadmap />
        <div className="research-link" data-reveal><div><span className="research-asterisk" aria-hidden="true">✳</span><div><h3>Curiosidade com fundamento.</h3><p>Fontes, decisões e limites à disposição de quem quer ir além.</p></div></div><a href={LINKS.research} className="button button-outline">Abrir biblioteca de pesquisa <Icon name="arrow-up" /></a></div>
      </div></section>

      <section className="faq-section section-pad" aria-labelledby="faq-title"><div className="container faq-layout"><div data-reveal><p className="eyebrow">ANTES DA PARTIDA</p><h2 id="faq-title">Boas missões<br />{' '}começam com<br />{' '}<em>boas perguntas.</em></h2></div><div className="faq-list">{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" /></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="final-cta" aria-labelledby="cta-title"><div className="container"><div><p className="eyebrow">O PRÓXIMO PASSO É SEU.</p><h2 id="cta-title">O universo faz perguntas.<br />{' '}<em>Vamos procurar respostas?</em></h2><a href={LINKS.game} className="button button-ink" data-magnetic>Minha missão começa agora <Icon name="arrow-up" /></a><span className="cta-small">Explore. Questione. Redesenhe.</span></div><div className="cta-orbit" aria-hidden="true"><BotanicalGlyph kind="seed" /><span>IPÊ</span></div></div></section>
    </main>
    <footer className="site-footer"><div className="container"><div className="footer-top"><a href="#inicio" className="footer-brand"><img src="/brand/projeto-ipe-symbol.svg" width="64" height="64" alt="Símbolo Projeto Ipê" /><div>PROJETO IPÊ<span>Da órbita, para a vida.</span></div></a><nav aria-label="Mais sobre o projeto"><a href={LINKS.github}>GitHub <Icon name="arrow-up" /></a><a href={LINKS.pitch}>Apresentação <Icon name="arrow-up" /></a><a href="/creditos/">Fontes e créditos <Icon name="arrow-up" /></a></nav><a href="#inicio" className="back-to-top" aria-label="Voltar ao início"><Icon name="arrow-up" /></a></div><div className="footer-bottom"><span>© 2026 PROJETO IPÊ · FEITO PARA EXPLORAR.</span><p>Experiência educativa independente. Referências à NASA não representam endosso institucional.</p><span>BRASIL <span className="footer-spark">✳</span> TERRA</span></div></div></footer>
    <noscript><div className="noscript-note">A leitura e os links continuam disponíveis. Para usar o laboratório, o filme e a timeline interativa, ative o JavaScript.</div></noscript>
  </MotionSystem>;
}
