(() => {
  const launcher = document.querySelector('a[data-ipe-libras]');
  if (!launcher || typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

  const scope = launcher.dataset.ipeLibras;
  const privateElement = 'form, input, textarea, select, [contenteditable], [data-private], .vlibras-ignore';
  function selectedText() {
    if (scope !== 'public') return '';
    const selection = window.getSelection();
    if (!selection?.rangeCount || selection.isCollapsed) return '';
    const range = selection.getRangeAt(0);
    for (const node of [range.startContainer, range.endContainer]) {
      const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
      if (element?.closest(privateElement)) return '';
    }
    if (range.cloneContents().querySelector(privateElement)) return '';
    return selection.toString().trim().slice(0, 1000);
  }

  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.title = scope === 'public' ? 'Selecione um trecho público para traduzir em Libras' : 'Abrir instruções públicas em Libras';
  let pointerSelection = '';
  launcher.addEventListener('pointerdown', () => { pointerSelection = selectedText(); });
  launcher.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const passage = (event.detail ? pointerSelection : '') || selectedText();
    pointerSelection = '';
    const dialog = document.createElement('dialog');
    dialog.className = 'ipe-libras-dialog';
    dialog.setAttribute('aria-labelledby', 'ipe-libras-title');
    const heading = document.createElement('div');
    heading.className = 'ipe-libras-dialog-heading';
    const title = document.createElement('h2');
    title.id = 'ipe-libras-title';
    title.textContent = 'Traduzir em Libras';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'ipe-libras-close';
    close.textContent = 'Fechar Libras';
    close.autofocus = true;
    close.addEventListener('click', () => dialog.close());
    const official = document.createElement('a');
    official.href = 'https://www.vlibras.gov.br/app/';
    official.target = '_blank';
    official.rel = 'noopener noreferrer';
    official.textContent = 'Tradutor oficial';
    heading.append(title, official, close);
    const frame = document.createElement('iframe');
    frame.title = 'VLibras e trecho para tradução';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.referrerPolicy = 'no-referrer';
    frame.src = launcher.href;
    frame.addEventListener('load', () => {
      frame.contentWindow?.postMessage({ type: 'ipe-libras:init', scope, passage }, '*');
    }, { once: true });
    const onMessage = event => {
      if (event.origin === 'null' && event.source === frame.contentWindow && event.data?.type === 'ipe-libras:close') dialog.close();
    };
    window.addEventListener('message', onMessage);
    dialog.addEventListener('close', () => {
      window.removeEventListener('message', onMessage);
      dialog.remove();
      launcher.focus();
    }, { once: true });
    dialog.append(heading, frame);
    document.body.append(dialog);
    dialog.showModal();
  });
})();
