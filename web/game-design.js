(() => {
  'use strict';
  const segments = {
    science: { kicker: 'Segmento científico', title: 'A pergunta vem antes da peça.', purpose: 'Comparar a vegetação entre dois períodos em três pontos do Cerrado. Um dado só tem valor para a pergunta quando chega completo e válido.', current: 'Seis registros históricos Terra/MODIS e comparações de NDVI condicionadas ao recebimento dos pares completos.', next: 'Mostrar o pedido científico em um mapa contextual e ligar cada registro às etapas da operação. O mapa deve manter data, origem e limites visíveis.', caption: 'A pergunta científica define o que precisa ser observado, processado e recebido.' },
    launch: { kicker: 'Segmento de lançamento', title: 'Entrar no espaço tem condições.', purpose: 'Uma missão real precisa de um acesso compatível com sua massa, interfaces e destino. O Cerrado usa um envelope fixo; Bennu e telescópio permitem escolhas didáticas de lançador e perfil.', current: 'Envelope de massa e custo no Cerrado; escolha de lançador e perfil nas expedições. Nenhuma dessas opções calcula a trajetória de lançamento real.', next: 'Criar uma transição narrativa após a revisão do projeto. Só acrescentar escolha de lançador quando houver contrato, dados, orçamento de recursos e verificação próprios.', caption: 'O lançamento é uma condição da missão; uma animação não comprova trajetória ou capacidade real.' },
    space: { kicker: 'Segmento espacial', title: 'A nave precisa sustentar a operação.', purpose: 'Combinar energia, potência, processamento, memória e rádio dentro do envelope da missão. Um subsistema melhor isoladamente pode tornar o conjunto inviável.', current: 'Seis escolhas binárias, motor determinístico e cena 3D conceitual. A câmera e a animação não determinam os resultados da simulação.', next: 'Inspecionar peças no hangar e sincronizar estados visuais com eventos calculados. Destacar o recurso relacionado à evidência, com controles equivalentes fora do canvas.', caption: 'A nave combina recursos; o resultado vem do motor, não da velocidade da animação.' },
    ground: { kicker: 'Segmento de solo', title: 'Produzir não basta. É preciso receber.', purpose: 'Usar as oportunidades de contato e conferir a entrega. Memória a bordo, arquivos recebidos e comparações científicas disponíveis representam estados diferentes.', current: 'Dois cenários de contato, fila de dados e relatório da recepção. Os contatos são didáticos e não representam uma reserva real de antenas NASA.', next: 'Representar downlink, recebimento e validação numa cena de solo. Vincular cada arquivo ao estado real do motor e aos pares que já permitem interpretação.', caption: 'O solo fecha o ciclo: somente a recepção completa e válida permite comparar os registros.' }
  };
  function keyboard(buttons, select) {
    buttons.forEach((button, index) => button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault(); select(next); buttons[next].focus();
    }));
  }
  const segmentButtons = [...document.querySelectorAll('[data-segment]')];
  const panel = document.getElementById('segment-panel');
  function selectSegment(index) {
    const key = segmentButtons[index].dataset.segment, value = segments[key];
    segmentButtons.forEach((button, i) => { button.setAttribute('aria-selected', String(index === i)); button.tabIndex = index === i ? 0 : -1; });
    panel.setAttribute('aria-labelledby', 'segment-' + key);
    for (const field of ['kicker', 'title', 'purpose', 'current', 'next']) document.querySelector('[data-segment-' + field + ']').textContent = value[field];
    document.querySelector('[data-active-segment]').dataset.activeSegment = key;
    document.querySelector('[data-map-caption]').textContent = value.caption;
  }
  segmentButtons.forEach((button, index) => button.addEventListener('click', () => selectSegment(index)));
  document.querySelectorAll('[data-segment-node]').forEach(node => node.addEventListener('click', () => {
    const index = segmentButtons.findIndex(button => button.dataset.segment === node.dataset.segmentNode);
    if (index >= 0) { selectSegment(index); segmentButtons[index].focus(); }
  }));
  keyboard(segmentButtons, selectSegment);
  const comparisons = {
    memory: { aTitle: 'Os dados aguardam uma janela.', a: 'Há registros produzidos antes do contato. O espaço disponível para guardar é uma das condições que o projeto precisa atender.', bTitle: 'Mais espaço para guardar.', one: 'Reduzir o risco de saturação da fila.', two: 'Consumir mais massa e créditos.', limit: 'O tempo de contato e a taxa de transmissão.', question: 'Pergunta para a próxima execução: o gargalo era guardar os dados ou conseguir transmiti-los?' },
    radio: { aTitle: 'A janela de contato tem duração limitada.', a: 'Os registros precisam atravessar o enlace dentro das oportunidades previstas. A capacidade de transmissão deve ser compatível com o volume de dados e a operação.', bTitle: 'Um rádio com outra taxa de transmissão.', one: 'Enviar mais dados durante o mesmo tempo disponível.', two: 'Atender à potência exigida e aos demais custos do componente.', limit: 'A duração das janelas e os limites de energia, potência e orçamento.', question: 'Pergunta para a próxima execução: o conjunto sustenta o rádio escolhido durante os contatos?' },
    processing: { aTitle: 'Mais dados também precisam viajar.', a: 'O modo de processamento define o que será armazenado e transmitido. Volume, trabalho computacional e demanda elétrica precisam ser avaliados juntos.', bTitle: 'Transformar os dados antes do downlink.', one: 'Reduzir o volume que precisa ser guardado e transmitido.', two: 'Atender à potência exigida pelo processamento a bordo.', limit: 'A capacidade de fornecer potência e manter as demais restrições.', question: 'Pergunta para a próxima execução: a escolha resolve a comunicação sem criar um problema elétrico?' }
  };
  const comparisonButtons = [...document.querySelectorAll('[data-comparison]')];
  function selectComparison(index) {
    const value = comparisons[comparisonButtons[index].dataset.comparison];
    comparisonButtons.forEach((button, i) => { button.setAttribute('aria-pressed', String(index === i)); button.tabIndex = index === i ? 0 : -1; });
    for (const [selector, field] of [['a-title', 'aTitle'], ['a', 'a'], ['b-title', 'bTitle'], ['question', 'question']]) document.querySelector('[data-compare-' + selector + ']').textContent = value[field];
    document.querySelector('[data-impact-one]').textContent = value.one;
    document.querySelector('[data-impact-two]').textContent = value.two;
    document.querySelector('[data-impact-limit]').textContent = value.limit;
  }
  comparisonButtons.forEach((button, index) => button.addEventListener('click', () => selectComparison(index)));
  keyboard(comparisonButtons, selectComparison);
  selectSegment(0); selectComparison(0);
})();
