(() => {
  const launcher = document.querySelector('a[data-ipe-libras]');
  if (!launcher) return;
  const scope = launcher.dataset.ipeLibras;
  const preference = 'ipe:libras:continuous';
  const privateElement = 'form, input, textarea, select, [contenteditable], [data-private], .vlibras-ignore, .ipe-libras-panel';
  const guides = {
    lab: 'Escolha uma missão científica. Leia a pergunta, configure os equipamentos e execute. Compare suas decisões com os registros recebidos. Nome, e-mail e respostas pessoais não são enviados ao tradutor.',
    dashboard: 'Painel da equipe. Entre com a chave de acesso, escolha uma missão e consulte os indicadores. Os dados individuais dos participantes não são enviados ao tradutor.',
    public: 'Missão Ipê. Navegue pelas páginas ou selecione um trecho público. O tradutor acompanha o conteúdo enquanto estiver ativado.',
  };
  let panel, frame, observer, timer, latestTarget, paused = false, ready = false, lastText = '', status, pause;
  const normalize = text => String(text || '').replace(/\s+/g, ' ').trim().slice(0, 900);
  const remember = value => { try { sessionStorage.setItem(preference, value); } catch { /* Private browsing still permits this page's session. */ } };
  function visible(element) {
    if (!element || element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
    const css = getComputedStyle(element);
    return css.display !== 'none' && css.visibility !== 'hidden' && css.opacity !== '0';
  }
  function safeText(element) {
    if (!element || element.closest(privateElement) || !visible(element)) return '';
    const copy = element.cloneNode(true);
    copy.querySelectorAll(privateElement + ', script, style, [hidden], [aria-hidden="true"]').forEach(node => node.remove());
    return normalize(copy.textContent);
  }
  function selectionText() {
    if (scope !== 'public') return '';
    const selection = window.getSelection();
    if (!selection?.rangeCount || selection.isCollapsed) return '';
    const range = selection.getRangeAt(0);
    for (const node of [range.startContainer, range.endContainer]) {
      const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      if (element?.closest(privateElement)) return '';
    }
    if (range.cloneContents().querySelector(privateElement)) return '';
    return normalize(selection.toString());
  }
  function contextText(target) {
    if (scope === 'dashboard') return guides.dashboard;
    if (scope === 'lab') {
      // This marker is authored by the game from catalog/stage text, never player input.
      const direct = target?.closest('[data-ipe-libras-context]');
      if (direct && visible(direct) && !direct.closest(privateElement)) return normalize(direct.getAttribute('data-ipe-libras-context'));
      const contexts = [...document.querySelectorAll('[data-ipe-libras-context]')].filter(element => {
        const rect = element.getBoundingClientRect();
        return visible(element) && !element.closest(privateElement) && rect.bottom >= 0 && rect.top < innerHeight;
      });
      const context = contexts.filter(element => !contexts.some(other => other !== element && element.contains(other))).sort((a, b) => Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top))[0];
      return normalize(context?.getAttribute('data-ipe-libras-context')) || guides.lab;
    }
    const selected = selectionText();
    if (selected) return selected;
    if (target && !target.closest(privateElement)) {
      const passage = target.closest('p, h1, h2, h3, a, button, summary, li');
      if (passage) return safeText(passage);
    }
    const headings = [...document.querySelectorAll('main h1, main h2, [role="main"] h1, [role="main"] h2')].filter(element => visible(element) && !element.closest(privateElement));
    headings.sort((a, b) => Math.abs(a.getBoundingClientRect().top - 100) - Math.abs(b.getBoundingClientRect().top - 100));
    const heading = headings[0];
    const section = heading?.closest('section, article') ?? heading?.parentElement;
    const paragraph = section && [...section.querySelectorAll('p')].find(element => safeText(element));
    return normalize([safeText(heading), safeText(paragraph)].filter(Boolean).join('. ')) || guides.public;
  }
  function send(type, extra = {}) { frame?.contentWindow?.postMessage({ type, ...extra }, '*'); }
  function update(target, repeat = false) {
    if (!panel || paused || !ready) return;
    latestTarget = target;
    if (repeat) { clearTimeout(timer); timer = undefined; }
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      if (!panel || paused || !ready) return;
      const passage = contextText(latestTarget);
      if (!passage || (!repeat && passage === lastText)) return;
      lastText = passage;
      send('ipe-libras:update', { passage, repeat });
    }, repeat ? 0 : 650);
  }
  function onInteraction(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(privateElement)) return;
    update(target);
  }
  const onNavigation = () => update();
  function onMessage(event) {
    if (!panel || event.origin !== 'null' || event.source !== frame?.contentWindow) return;
    if (event.data?.type === 'ipe-libras:ready') { ready = true; update(); }
    if (event.data?.type === 'ipe-libras:status' && typeof event.data.message === 'string') status.textContent = event.data.message.slice(0, 200);
    if (event.data?.type === 'ipe-libras:close') close();
  }
  function close() {
    clearTimeout(timer); timer = latestTarget = undefined; observer?.disconnect();
    document.removeEventListener('click', onInteraction);
    document.removeEventListener('focusin', onInteraction);
    document.removeEventListener('selectionchange', onNavigation);
    window.removeEventListener('hashchange', onNavigation);
    window.removeEventListener('popstate', onNavigation);
    window.removeEventListener('scroll', onNavigation);
    window.removeEventListener('message', onMessage);
    panel?.remove(); panel = frame = null; ready = false; lastText = '';
    document.body.classList.remove('ipe-libras-active');
    launcher.setAttribute('aria-expanded', 'false'); launcher.textContent = 'Libras';
    remember('off'); launcher.focus();
  }
  function open() {
    if (panel) return close();
    paused = false; ready = false; lastText = '';
    panel = document.createElement('aside'); panel.id = 'ipe-libras-panel'; panel.className = 'ipe-libras-panel vlibras-ignore';
    panel.setAttribute('aria-label', 'Tradução contínua em Libras');
    const header = document.createElement('div'); header.className = 'ipe-libras-panel-heading';
    const title = document.createElement('h2'); title.textContent = 'Libras acompanha você';
    const closeButton = document.createElement('button'); closeButton.type = 'button'; closeButton.textContent = 'Fechar'; closeButton.setAttribute('aria-label', 'Fechar Libras'); closeButton.onclick = close;
    header.append(title, closeButton);
    const controls = document.createElement('div'); controls.className = 'ipe-libras-controls';
    pause = document.createElement('button'); pause.type = 'button'; pause.textContent = 'Pausar tradução'; pause.setAttribute('aria-pressed', 'false');
    pause.onclick = () => { paused = !paused; pause.textContent = paused ? 'Continuar tradução' : 'Pausar tradução'; pause.setAttribute('aria-pressed', String(paused)); send('ipe-libras:pause', { paused }); if (!paused) update(); };
    const repeat = document.createElement('button'); repeat.type = 'button'; repeat.textContent = 'Repetir trecho'; repeat.onclick = () => { if (!paused) update(undefined, true); };
    controls.append(pause, repeat);
    status = document.createElement('p'); status.className = 'ipe-libras-panel-status'; status.setAttribute('role', 'status'); status.textContent = 'Carregando o tradutor. Você pode continuar navegando.';
    frame = document.createElement('iframe'); frame.title = 'Avatar VLibras e tradução da etapa atual'; frame.setAttribute('sandbox', 'allow-scripts'); frame.referrerPolicy = 'no-referrer'; frame.src = launcher.href;
    frame.addEventListener('load', () => { ready = false; send('ipe-libras:init', { scope, passage: contextText(), paused }); });
    const official = document.createElement('a'); official.className = 'ipe-libras-official-link'; official.href = 'https://www.vlibras.gov.br/app/'; official.target = '_blank'; official.rel = 'noopener noreferrer'; official.textContent = 'Abrir tradutor oficial';
    panel.append(header, controls, status, frame, official); document.body.append(panel);
    document.body.classList.add('ipe-libras-active'); launcher.setAttribute('aria-expanded', 'true'); launcher.textContent = 'Libras ativa'; remember('on');
    document.addEventListener('click', onInteraction); document.addEventListener('focusin', onInteraction); document.addEventListener('selectionchange', onNavigation);
    window.addEventListener('hashchange', onNavigation); window.addEventListener('popstate', onNavigation); window.addEventListener('scroll', onNavigation, { passive: true }); window.addEventListener('message', onMessage);
    observer = new MutationObserver(changes => {
      const relevant = changes.filter(change => !panel?.contains(change.target));
      if (!relevant.length) return;
      const contexts = relevant.filter(change => change.type === 'attributes' && change.attributeName === 'data-ipe-libras-context').map(change => change.target).filter(target => target instanceof Element && visible(target));
      const context = contexts.find(target => !contexts.some(other => other !== target && target.contains(other)));
      update(context);
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-hidden', 'data-ipe-libras-context'] });
  }
  launcher.removeAttribute('aria-haspopup'); launcher.setAttribute('aria-controls', 'ipe-libras-panel'); launcher.setAttribute('aria-expanded', 'false'); launcher.title = 'Ativar tradução em Libras durante a navegação';
  launcher.addEventListener('click', event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); open(); });
  try { if (sessionStorage.getItem(preference) === 'on') open(); } catch { /* Optional preference storage. */ }
})();
