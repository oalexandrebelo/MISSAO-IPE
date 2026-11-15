(() => {
  if (window === window.parent || window.origin !== 'null') return;
  const status = document.querySelector('#ipe-libras-status');
  const text = document.querySelector('#ipe-libras-text');
  const retry = document.querySelector('#ipe-libras-retry');
  let initialized = false, paused = false, pending = '', current = '', busy = false, loaded = false, failed = false, startedAt = 0, holdUntil = 0, timer;
  const message = value => { status.textContent = value; window.parent.postMessage({ type: 'ipe-libras:status', message: value }, location.origin); };
  const unavailable = value => { failed = true; retry.hidden = false; message(value); };
  const normalize = value => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 900) : '';
  async function pump() {
    if (failed || document.hidden || paused || busy) return;
    const api = window.vlibras;
    if (!api?.isLoaded || typeof api.translate !== 'function' || typeof api.play !== 'function') {
      if (Date.now() - startedAt > 90000) unavailable('O avatar não ficou disponível. Tente novamente; a navegação continua funcionando.');
      return;
    }
    if (!loaded) { loaded = true; window.parent.postMessage({ type: 'ipe-libras:ready' }, location.origin); message('Tradução contínua ativada. Acompanhe o avatar enquanto navega.'); }
    if (api.isBroken) return unavailable('O avatar ficou indisponível. Tente carregar novamente.');
    if (!pending || api.status === 'playing' || api.status === 'paused' || Date.now() < holdUntil) return;
    const passage = pending; pending = ''; busy = true; current = passage; text.textContent = passage;
    message('Traduzindo a orientação atual…');
    try {
      const gloss = await api.translate(passage);
      if (paused) { if (!pending) pending = passage; return; }
      if (typeof gloss !== 'string' || !gloss.trim()) return unavailable('A tradução não respondeu. Tente novamente para este trecho.');
      window.vlibras.play(gloss); holdUntil = Date.now() + 1500;
      message('Avatar sinalizando. A próxima orientação será traduzida em seguida.');
    } catch { unavailable('Não foi possível traduzir este trecho. Tente novamente.'); }
    finally { busy = false; }
  }
  function receive(event) {
    if (event.origin !== location.origin || event.source !== window.parent) return;
    const data = event.data;
    if (data?.type === 'ipe-libras:init' && !initialized) {
      initialized = true; paused = data.paused === true; pending = normalize(data.passage); startedAt = Date.now();
      document.querySelector('#ipe-libras-passage').hidden = false;
      message('Carregando o avatar oficial do VLibras…');
      const script = document.createElement('script'); script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js'; script.referrerPolicy = 'no-referrer';
      script.addEventListener('error', () => unavailable('O VLibras está indisponível. Tente novamente ou use o tradutor oficial.'), { once: true });
      script.addEventListener('load', () => {
        if (typeof window.VLibras?.Widget !== 'function') return unavailable('O serviço não disponibilizou o avatar. Tente novamente.');
        new window.VLibras.Widget({ rootPath: 'https://vlibras.gov.br/app', position: 'R' });
        window.setTimeout(() => { window.VLibrasWidget?.open?.(); }, 100);
      }, { once: true });
      document.head.append(script); timer = window.setInterval(pump, 400);
    } else if (initialized && data?.type === 'ipe-libras:update') {
      const passage = normalize(data.passage);
      if (passage) pending = data.repeat || passage !== current ? passage : '';
    } else if (initialized && data?.type === 'ipe-libras:pause') {
      paused = data.paused === true;
      if (paused) { if (window.vlibras?.status === 'playing') window.vlibras.pause(); message('Tradução pausada. Você pode continuar navegando.'); }
      else { if (window.vlibras?.status === 'paused') window.vlibras.play(); message('Tradução retomada.'); void pump(); }
    }
  }
  retry.addEventListener('click', () => location.reload());
  window.addEventListener('message', receive);
  window.addEventListener('pagehide', () => { clearInterval(timer); window.vlibras?.stop?.(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !event.defaultPrevented) window.parent.postMessage({ type: 'ipe-libras:close' }, location.origin); });
})();
