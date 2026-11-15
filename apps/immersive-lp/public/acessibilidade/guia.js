(() => {
  if (window === window.parent || window.origin !== 'null') return;

  const guide = {
    lab: 'No laboratório de missões, escolha Cerrado, Bennu ou Webb. Leia o objetivo, ajuste os componentes, execute a missão e compare o resultado com sua hipótese. Para registrar o progresso, use o formulário de participação no jogo.',
    dashboard: 'O observatório é acessível à equipe com uma chave de acesso. Escolha uma missão para ver os indicadores. A lista de tentativas mostra o resultado, a evidência e a primeira causa registrada.',
    public: 'Na Missão Ipê, você pode explorar o laboratório, a apresentação e a documentação. Para traduzir um trecho da página, selecione o texto e abra Libras novamente.',
  };
  const scriptUrl = 'https://vlibras.gov.br/app/vlibras-plugin.js';
  const status = document.querySelector('#ipe-libras-status');
  const text = document.querySelector('#ipe-libras-text');
  function onInit(event) {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'ipe-libras:init') return;
    window.removeEventListener('message', onInit);
    document.querySelector('#ipe-libras-official').hidden = true;
    const { scope, passage } = event.data;
    text.textContent = scope === 'public' && typeof passage === 'string' && passage.trim()
      ? passage.trim().slice(0, 1000)
      : guide[scope === 'lab' || scope === 'dashboard' ? scope : 'public'];
    text.parentElement.hidden = false;
    status.textContent = 'Carregando o VLibras…';
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.referrerPolicy = 'no-referrer';
    const unavailable = () => {
      clearTimeout(timeout);
      status.textContent = 'O VLibras está indisponível. Use o link Tradutor oficial no cabeçalho desta janela.';
    };
    const timeout = setTimeout(unavailable, 12000);
    script.addEventListener('error', unavailable, { once: true });
    script.addEventListener('load', () => {
      if (typeof window.VLibras?.Widget !== 'function') return unavailable();
      new window.VLibras.Widget({ rootPath: 'https://vlibras.gov.br/app', position: 'R' });
      clearTimeout(timeout);
      text.disabled = false;
      status.textContent = 'Abra o botão azul do VLibras. Quando o avatar estiver pronto, ative o trecho abaixo.';
    }, { once: true });
    document.head.append(script);
  }
  window.addEventListener('message', onInit);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !event.defaultPrevented) window.parent.postMessage({ type: 'ipe-libras:close' }, location.origin);
  });
})();
