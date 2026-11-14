(() => {
  'use strict';
  const NASA_MEDIA = __IPE_NASA_MEDIA__;
  const scriptUrl = document.currentScript?.src || new URL('mission-visuals.js', document.baseURI).href;
  const assetRoot = new URL('.', scriptUrl);
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let instance = 0;

  function keyboardChoices(buttons, select) {
    buttons.forEach((button, index) => button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      select(next);
      buttons[next].focus();
    }));
  }

  function orbit(root) {
    const views = [
      { id: 'earth', title: 'Terra: a pergunta começa no Cerrado.', text: 'Os arquivos históricos Terra/MODIS representam três pontos e dois períodos. O jogo investiga a entrega desses registros; a ilustração não mostra cobertura ou posição orbital calculadas.' },
      { id: 'satellite', title: 'CubeSat: cada escolha afeta o conjunto.', text: 'A nave Ipê é fictícia. Energia, processamento, memória e rádio precisam trabalhar juntos para cumprir o pedido científico. Mais capacidade em uma peça pode consumir massa, potência ou orçamento.' },
      { id: 'station', title: 'Solo: receber dados é parte da ciência.', text: 'O ponto de recepção é conceitual, sem representar uma estação real ou agenda DSN. Um registro só conta após chegar por inteiro e passar pela validação; a comparação exige o par de observações.' }
    ];
    const buttons = [...root.querySelectorAll('[data-orbit-choice]')];
    const title = root.querySelector('[data-orbit-title]');
    const description = root.querySelector('[data-orbit-description]');
    const motion = root.querySelector('[data-orbit-motion]');
    function select(index) {
      const view = views[index];
      root.dataset.orbitFocus = view.id;
      buttons.forEach((button, i) => {
        button.setAttribute('aria-pressed', String(i === index));
        button.tabIndex = i === index ? 0 : -1;
      });
      title.textContent = view.title;
      description.textContent = view.text;
    }
    function setPlaying(playing) {
      const enabled = playing && !reducedMotion?.matches;
      root.classList.toggle('is-playing', enabled);
      motion.setAttribute('aria-pressed', String(enabled));
      motion.textContent = reducedMotion?.matches ? 'Movimento reduzido ativo' : enabled ? 'Pausar percurso ilustrativo' : 'Animar percurso ilustrativo';
      motion.disabled = Boolean(reducedMotion?.matches);
    }
    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    keyboardChoices(buttons, select);
    motion.addEventListener('click', () => setPlaying(motion.getAttribute('aria-pressed') !== 'true'));
    reducedMotion?.addEventListener?.('change', () => setPlaying(false));
    document.addEventListener('visibilitychange', () => { if (document.hidden) setPlaying(false); });
    select(0);
    setPlaying(false);
  }

  function flow(root) {
    const uid = 'ipe-flow-' + (++instance);
    const stages = [
      { title: 'Processar', subtitle: 'Reduzir volume também tem um custo.', text: 'O modo de processamento altera o volume de dados e a potência exigida. O jogador precisa conferir se o conjunto consegue realizar esse trabalho sem ultrapassar seus limites.', question: 'Pergunta de projeto: o ganho na comunicação compensa a exigência de potência?' },
      { title: 'Armazenar', subtitle: 'Guardar até a próxima oportunidade.', text: 'Entre contatos, os registros aguardam na memória. Mais espaço pode evitar perda, mas não torna o rádio mais rápido nem cria uma nova janela de transmissão.', question: 'Pergunta de projeto: o que acontece se a produção de dados supera a capacidade de guardar?' },
      { title: 'Receber no solo', subtitle: 'A entrega precisa estar completa.', text: 'Dados produzidos, dados recebidos e ciência disponível são estados diferentes. A comparação entre os dois períodos só fica disponível quando os dois registros correspondentes chegaram completos e válidos.', question: 'Pergunta de projeto: quais comparações científicas os arquivos recebidos permitem fazer?' }
    ];
    root.innerHTML = `
      <div class="iv-heading"><p class="iv-kicker">Do arquivo à evidência</p><h3>Onde a ciência pode ficar pelo caminho?</h3><p>Selecione uma etapa e acompanhe a relação entre os recursos. Este esquema explica o modelo; não executa uma partida.</p></div>
      <div class="iv-flow-layout"><div class="iv-flow-diagram"><svg viewBox="0 0 720 270" role="img" aria-labelledby="${uid}-title ${uid}-desc"><title id="${uid}-title">Fluxo conceitual dos registros científicos</title><desc id="${uid}-desc">Arquivos passam pelo processamento, aguardam em memória e são transmitidos para validação no solo. Os controles abaixo destacam cada etapa.</desc><defs><marker id="${uid}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1L8 5L0 9" fill="none" stroke="#547488" stroke-width="1.4"/></marker></defs><path d="M195 118H290M430 118H525" stroke="#7793a1" stroke-width="1.5" fill="none" stroke-dasharray="5 6" marker-end="url(#${uid}-arrow)"/><g class="iv-flow-node" data-flow-node="0"><rect x="55" y="46" width="140" height="142" rx="8"/><path d="M97 87H153V143H97ZM111 72V87M125 72V87M139 72V87M111 143V158M125 143V158M139 143V158M82 101H97M82 115H97M82 129H97M153 101H168M153 115H168M153 129H168"/><path d="M114 104H137V127H114Z" class="iv-flow-fill"/><text x="125" y="215" text-anchor="middle">01 / PROCESSAR</text></g><g class="iv-flow-node" data-flow-node="1"><rect x="290" y="46" width="140" height="142" rx="8"/><path d="M325 81H395V101H325ZM325 108H395V128H325ZM325 135H395V155H325Z"/><path d="M335 91H364M335 118H364M335 145H364"/><circle cx="382" cy="91" r="3" class="iv-flow-fill"/><circle cx="382" cy="118" r="3" class="iv-flow-fill"/><circle cx="382" cy="145" r="3" class="iv-flow-fill"/><text x="360" y="215" text-anchor="middle">02 / ARMAZENAR</text></g><g class="iv-flow-node" data-flow-node="2"><rect x="525" y="46" width="140" height="142" rx="8"/><path d="M565 83Q567 132 616 133L565 83ZM590 118L605 91M601 90L608 94M592 131L592 155M572 157H613"/><path d="M616 80Q633 94 627 114M621 68Q646 88 640 117"/><text x="595" y="215" text-anchor="middle">03 / RECEBER</text></g><text x="360" y="254" text-anchor="middle" class="iv-flow-note">ESQUEMA DIDÁTICO · SEM ESCALA · SEM TELEMETRIA AO VIVO</text></svg></div><div class="iv-flow-tabs" role="tablist" aria-label="Etapas do fluxo científico">${stages.map((stage,index)=>`<button type="button" id="${uid}-tab-${index}" role="tab" aria-controls="${uid}-panel" aria-selected="${index===0}" tabindex="${index===0?0:-1}" data-flow-choice="${index}"><span>0${index+1}</span>${stage.title}</button>`).join('')}</div><div class="iv-flow-panel" id="${uid}-panel" role="tabpanel" aria-labelledby="${uid}-tab-0" tabindex="0"><h4></h4><p data-flow-text></p><p class="iv-question"></p></div></div>`;
    const buttons = [...root.querySelectorAll('[data-flow-choice]')];
    const panel = root.querySelector('[role="tabpanel"]');
    function select(index) {
      buttons.forEach((button, i) => { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
      root.querySelectorAll('[data-flow-node]').forEach((node, i) => node.classList.toggle('is-active', i === index));
      panel.setAttribute('aria-labelledby', uid + '-tab-' + index);
      panel.querySelector('h4').textContent = stages[index].subtitle;
      panel.querySelector('[data-flow-text]').textContent = stages[index].text;
      panel.querySelector('.iv-question').textContent = stages[index].question;
    }
    buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
    keyboardChoices(buttons, select);
    select(0);
  }

  function gallery(root) {
    const images = Array.isArray(NASA_MEDIA.images) ? NASA_MEDIA.images : [];
    if (!images.length) return;
    root.innerHTML = `<div class="iv-heading"><p class="iv-kicker">Caderno visual NASA</p><h3>Missões reais. Novas perguntas.</h3><p>Explore as imagens para relacionar a missão educativa com observação da Terra, comunicação e exploração. São referências de missões reais; nenhuma delas mostra o CubeSat fictício Ipê.</p></div><div class="iv-gallery-feature"><figure><div class="iv-image-stage"><img data-gallery-image loading="lazy" decoding="async"><p class="iv-image-error" hidden>Não foi possível carregar a imagem. A legenda e a fonte continuam disponíveis.</p></div><figcaption data-gallery-credit></figcaption></figure><div class="iv-gallery-reading" aria-live="polite" aria-atomic="true"><p class="iv-kicker" data-gallery-count></p><h4 data-gallery-title></h4><p data-gallery-caption></p><p class="iv-gallery-date" data-gallery-date></p><a data-gallery-source target="_blank" rel="noopener noreferrer">Abrir a fonte oficial ↗</a></div></div><div class="iv-gallery-choices" role="group" aria-label="Escolher imagem de referência"></div>`;
    const choices = root.querySelector('.iv-gallery-choices');
    const full = root.querySelector('[data-gallery-image]');
    const failure = root.querySelector('.iv-image-error');
    const buttons = images.map((image, index) => {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'iv-gallery-choice'; button.setAttribute('aria-pressed', String(index === 0));
      button.tabIndex = index === 0 ? 0 : -1;
      const thumbnail = document.createElement('img'); thumbnail.src = new URL('media/' + image.file, assetRoot).href;
      thumbnail.alt = ''; thumbnail.width = image.width; thumbnail.height = image.height; thumbnail.loading = 'lazy'; thumbnail.decoding = 'async';
      const label = document.createElement('span'); label.textContent = image.title;
      button.append(thumbnail, label); choices.append(button);
      button.addEventListener('click', () => select(index));
      return button;
    });
    function select(index) {
      const image = images[index];
      failure.hidden = true;
      full.alt = image.alt; full.width = image.width; full.height = image.height;
      full.src = new URL('media/' + image.file, assetRoot).href;
      root.querySelector('[data-gallery-title]').textContent = image.title;
      root.querySelector('[data-gallery-caption]').textContent = image.caption;
      root.querySelector('[data-gallery-credit]').textContent = image.credit;
      root.querySelector('[data-gallery-date]').textContent = image.sourceDate ? 'Data registrada na fonte: ' + image.sourceDate : '';
      root.querySelector('[data-gallery-count]').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
      const source = root.querySelector('[data-gallery-source]');
      source.href = image.sourceUrl; source.hidden = !/^https:\/\//.test(image.sourceUrl);
      buttons.forEach((button, i) => { button.setAttribute('aria-pressed', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
    }
    full.addEventListener('error', () => { failure.hidden = false; });
    full.addEventListener('load', () => { failure.hidden = true; });
    keyboardChoices(buttons, select);
    select(0);
  }

  const initializers = { orbit, flow, gallery };
  document.querySelectorAll('[data-ipe-visual]').forEach(root => {
    const initialize = () => {
      if (root.dataset.visualReady) return;
      const render = initializers[root.dataset.ipeVisual];
      if (!render) return;
      render(root); root.dataset.visualReady = 'true';
    };
    const details = root.closest('details[data-visual-notebook]');
    if (details && !details.open) {
      const onToggle = () => { if (details.open) { initialize(); details.removeEventListener('toggle', onToggle); } };
      details.addEventListener('toggle', onToggle);
    } else initialize();
  });
})();
