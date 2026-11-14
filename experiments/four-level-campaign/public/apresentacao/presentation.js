(() => {
  'use strict';
  const chapters = [...document.querySelectorAll('.chapter')];
  const chapterLinks = [...document.querySelectorAll('[data-chapter-link]')];
  const previous = document.querySelector('#chapter-prev');
  const next = document.querySelector('#chapter-next');
  const position = document.querySelector('#position-label');
  const notesToggle = document.querySelector('#notes-toggle');
  const stageToggle = document.querySelector('#stage-toggle');
  const status = document.querySelector('#status');
  const journey = document.querySelector('.journey');
  const keyboardHelp = document.querySelector('#keyboard-help');
  const mobile = window.matchMedia('(max-width: 900px)');
  let activeIndex = 0;
  let showNotes = false;
  let stageMode = false;

  function updateChapter(index, focusHeading = false) {
    activeIndex = Math.min(Math.max(index, 0), chapters.length - 1);
    const current = chapters[activeIndex];
    chapters.forEach((chapter, chapterIndex) => chapter.classList.toggle('is-active', chapterIndex === activeIndex));
    chapterLinks.forEach(link => {
      if (link.dataset.chapterLink === current.id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === chapters.length - 1;
    position.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(chapters.length).padStart(2, '0')}`;
    document.title = `${current.querySelector('h1, h2').textContent.replace(/\s+/g, ' ').trim()} · PROJETO-IPÊ`;
    if (mobile.matches) journey.open = false;
    if (focusHeading) {
      const heading = current.querySelector('h1, h2');
      heading.focus({ preventScroll: true });
      current.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  function navigate(index, focusHeading = true) {
    const target = chapters[Math.min(Math.max(index, 0), chapters.length - 1)];
    if (location.hash !== `#${target.id}`) history.pushState(null, '', `#${target.id}`);
    updateChapter(chapters.indexOf(target), focusHeading);
  }

  function fromHash() {
    const index = chapters.findIndex(chapter => `#${chapter.id}` === location.hash);
    updateChapter(index < 0 ? 0 : index);
  }

  document.body.classList.add('js');
  journey.open = !mobile.matches;
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const index = chapters.findIndex(chapter => `#${chapter.id}` === anchor.getAttribute('href'));
    if (index < 0) return;
    event.preventDefault();
    navigate(index);
  });
  previous.addEventListener('click', () => navigate(activeIndex - 1));
  next.addEventListener('click', () => navigate(activeIndex + 1));
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);

  notesToggle.addEventListener('click', () => {
    showNotes = !showNotes;
    notesToggle.setAttribute('aria-pressed', String(showNotes));
    document.querySelectorAll('.speaker-notes').forEach(notes => { notes.open = showNotes; });
    status.textContent = showNotes ? 'Notas de orador abertas em todos os capítulos.' : 'Notas de orador recolhidas.';
  });

  function setStageMode(enabled) {
    stageMode = enabled;
    document.body.classList.toggle('presenting', enabled);
    stageToggle.setAttribute('aria-pressed', String(enabled));
    stageToggle.textContent = enabled ? 'Sair do palco' : 'Modo palco';
    keyboardHelp.textContent = enabled ? '← → para capítulos. Esc para sair do palco.' : 'Explore o mapa no seu ritmo.';
    status.textContent = enabled ? 'Modo palco ativo. Use as setas esquerda e direita fora dos controles para navegar. Escape encerra o modo palco.' : 'Mapa de capítulos disponível.';
  }
  stageToggle.addEventListener('click', () => {
    setStageMode(!stageMode);
    if (stageMode) chapters[activeIndex].querySelector('h1, h2').focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (!stageMode || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape') { setStageMode(false); stageToggle.focus(); return; }
    if (event.target.closest('button, a, summary, input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  document.querySelector('#print-button').addEventListener('click', () => window.print());
  let detailsBeforePrint = [];
  window.addEventListener('beforeprint', () => {
    detailsBeforePrint = [...document.querySelectorAll('.speaker-notes')].map(details => [details, details.open]);
    detailsBeforePrint.forEach(([details]) => { details.open = true; });
  });
  window.addEventListener('afterprint', () => detailsBeforePrint.forEach(([details, wasOpen]) => { details.open = wasOpen; }));

  const levelSelector = document.querySelector('.level-select');
  const levelButtons = [...levelSelector.querySelectorAll('[data-level]')];
  const levelPanels = [...document.querySelectorAll('[data-level-panel]')];
  levelSelector.setAttribute('role', 'tablist');
  levelButtons.forEach(button => {
    button.id = `tab-level-${button.dataset.level}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `level-${button.dataset.level}`);
  });
  levelPanels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-level-${panel.dataset.levelPanel}`);
    panel.tabIndex = 0;
  });
  function selectLevel(index, moveFocus = false) {
    levelButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      levelPanels[buttonIndex].hidden = !selected;
    });
    if (moveFocus) levelButtons[index].focus();
  }
  levelButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectLevel(index));
    button.addEventListener('keydown', event => {
      let target = index;
      if (event.key === 'ArrowRight') target = (index + 1) % levelButtons.length;
      else if (event.key === 'ArrowLeft') target = (index + levelButtons.length - 1) % levelButtons.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = levelButtons.length - 1;
      else return;
      event.preventDefault();
      selectLevel(target, true);
    });
  });
  selectLevel(0);
  fromHash();
})();
