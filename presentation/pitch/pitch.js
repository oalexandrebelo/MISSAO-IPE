'use strict';

const stage = document.querySelector('#palco');
const scenes = Array.from(stage.querySelectorAll('.scene'));
const headings = scenes.map(scene => scene.querySelector('h1, h2'));
const notes = Array.from(document.querySelectorAll('[data-note]'));
const sceneLinks = Array.from(document.querySelectorAll('[data-scene-link]'));
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const scenePosition = document.querySelector('#scene-position');
const feedback = document.querySelector('#feedback');
const startPitch = document.querySelector('#start-pitch');
const motionToggle = document.querySelector('#motion-toggle');
const fullscreenToggle = document.querySelector('#fullscreen-toggle');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const clockLimit = 180_000;
const legacyHashes = new Map([['#cerrado', '#problema'], ['#bennu', '#solucao'], ['#webb', '#solucao']]);

let currentScene = 0;
let requestedScene = 0;
let transitionId = 0;
let reduceMotion = motionPreference.matches;
let hasStarted = false;
let remaining = clockLimit;
let deadline = null;
let timerInterval = null;

const timerToggle = document.querySelector('#timer-toggle');
const timerValue = document.querySelector('#timer-value');
const timerSymbol = document.querySelector('#timer-symbol');

function sceneFromHash() {
  const hash = legacyHashes.get(location.hash) ?? location.hash;
  return scenes.findIndex(scene => '#' + scene.id === hash);
}

function displayScene(index) {
  currentScene = index;
  scenes.forEach((scene, i) => { scene.hidden = i !== index; });
  notes.forEach(note => { note.hidden = note.dataset.note !== scenes[index].id; });
  sceneLinks.forEach(link => {
    if (link.hash === '#' + scenes[index].id) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  scenePosition.textContent = (index + 1) + ' / ' + scenes.length;
  previous.disabled = index === 0;
  next.disabled = index === scenes.length - 1;
}

/*
 * Timing adapted from Tejas Makwana's motionmaxxing runtime (Apache-2.0).
 * Source: 8c8ec0f2a6f6c9a0da15cd24f7b1298ab298368c, runtime/motion.js.
 * softLand and accelExit are evaluated independently at every keyframe.
 * This adaptation uses native Web Animations and fixed 30 fps spacing.
 */
const softLand = t => (1 - Math.exp(-3.41 * t)) / (1 - Math.exp(-3.41));
const accelExit = t => t ** 2.6;

function travel(node, from, to, frameCount, curve, delayFrames = 0) {
  if (reduceMotion || !node.animate) return null;
  const keyframes = Array.from({ length: frameCount + 1 }, (_, frame) => {
    const progress = curve(frame / frameCount);
    const [x, y, scale] = from.map((value, i) => value + (to[i] - value) * progress);
    return { transform: 'translate3d(' + x + 'px,' + y + 'px,0) scale(' + scale + ')' };
  });
  return node.animate(keyframes, {
    duration: frameCount * 1000 / 30,
    delay: delayFrames * 1000 / 30,
    fill: 'backwards',
    easing: 'linear',
  });
}

function cancelSceneAnimations() {
  stage.getAnimations?.({ subtree: true }).forEach(animation => animation.cancel());
}

async function navigate(index, { instant = false } = {}) {
  const target = Math.max(0, Math.min(scenes.length - 1, index));
  if (target === requestedScene && target === currentScene) return;
  requestedScene = target;
  const transition = ++transitionId;
  cancelSceneAnimations();
  const direction = Math.sign(target - currentScene);

  if (!instant && direction) {
    const departing = scenes[currentScene].querySelector('.world');
    const exit = travel(departing, [0, 0, 1], [-28 * direction, 0, 1.055], 8, accelExit);
    if (exit) await exit.finished.catch(() => {});
  }

  if (transition !== transitionId) return;
  displayScene(target);
  if (location.hash !== '#' + scenes[target].id) {
    history.replaceState(null, '', '#' + scenes[target].id);
  }
  window.scrollTo(0, 0);
  headings[target].focus({ preventScroll: true });
  if (!instant && direction) {
    const entered = scenes[target];
    travel(entered.querySelector('.world'), [37 * direction, 3, 1.075], [0, 0, 1], 15, softLand);
    travel(entered.querySelector('.reading, .opening-content, .closing-content'), [0, 15, 1], [0, 0, 1], 12, softLand);
  }
}

previous.addEventListener('click', () => navigate(requestedScene - 1));
next.addEventListener('click', () => navigate(requestedScene + 1));
window.addEventListener('hashchange', () => {
  const index = sceneFromHash();
  if (index >= 0) navigate(index, { instant: true });
});

function changeMotion(value) {
  reduceMotion = value;
  motionToggle.setAttribute('aria-pressed', String(value));
  if (value) cancelSceneAnimations();
}
changeMotion(reduceMotion);
motionToggle.addEventListener('click', () => changeMotion(!reduceMotion));
motionPreference.addEventListener('change', event => changeMotion(event.matches));

document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (document.querySelector('dialog[open]') || event.target.closest('input, select, textarea, [contenteditable]')) return;
  const keyTargets = {
    ArrowLeft: requestedScene - 1,
    ArrowRight: requestedScene + 1,
    Home: 0,
    End: scenes.length - 1,
  };
  if (!Object.hasOwn(keyTargets, event.key)) return;
  event.preventDefault();
  navigate(keyTargets[event.key]);
});

let pointerStart = null;
stage.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'touch' || !event.isPrimary || event.target.closest('button, a')) return;
  pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
stage.addEventListener('pointerup', event => {
  const start = pointerStart;
  pointerStart = null;
  if (!start || event.pointerId !== start.id) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  if (Math.abs(dx) >= 54 && Math.abs(dx) > 1.6 * Math.abs(dy)) {
    navigate(requestedScene - Math.sign(dx));
  }
});
stage.addEventListener('pointercancel', () => { pointerStart = null; });

document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    dialog.showModal();
    if (dialog.id === 'explorar') dialog.querySelector('[aria-current="step"]')?.focus();
  });
});

sceneLinks.forEach((link, index) => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#explorar').close();
    navigate(index, { instant: true });
  });
});

fullscreenToggle.hidden = !document.fullscreenEnabled;
fullscreenToggle.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch {
    feedback.textContent = 'Tela cheia indisponível neste navegador.';
  }
});
document.addEventListener('fullscreenchange', () => {
  const active = Boolean(document.fullscreenElement);
  fullscreenToggle.setAttribute('aria-pressed', String(active));
  fullscreenToggle.textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
});

function paintClock() {
  const seconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const secondsWithinMinute = seconds % 60;
  const running = deadline !== null;
  const displayTime = String(minutes).padStart(2, '0') + ':' + String(secondsWithinMinute).padStart(2, '0');
  const action = running ? 'Pausar relógio do pitch' : 'Iniciar relógio do pitch';
  timerValue.textContent = displayTime;
  timerValue.dateTime = 'PT' + seconds + 'S';
  timerToggle.setAttribute('aria-pressed', String(running));
  timerToggle.setAttribute('aria-label', displayTime + ' — ' + action);
  timerSymbol.textContent = running ? 'Ⅱ' : '▶';
}

function pauseClock() {
  if (deadline !== null) remaining = Math.max(0, deadline - performance.now());
  deadline = null;
  clearInterval(timerInterval);
  timerInterval = null;
  paintClock();
}

function startClock() {
  if (deadline !== null) return;
  if (remaining === 0) remaining = clockLimit;
  deadline = performance.now() + remaining;
  hasStarted = true;
  startPitch.textContent = 'Avançar para o problema →';
  timerInterval = setInterval(() => {
    remaining = Math.max(0, deadline - performance.now());
    if (remaining === 0) {
      pauseClock();
      feedback.textContent = 'Chegou ao fim o relógio de 3 minutos.';
    } else {
      paintClock();
    }
  }, 200);
  paintClock();
}

timerToggle.addEventListener('click', () => {
  if (deadline === null) startClock();
  else pauseClock();
});
startPitch.addEventListener('click', () => {
  if (hasStarted) navigate(1);
  else startClock();
});
document.querySelector('#timer-reset').addEventListener('click', () => {
  pauseClock();
  hasStarted = false;
  remaining = clockLimit;
  startPitch.textContent = 'Iniciar pitch de 3 min';
  paintClock();
  feedback.textContent = 'Relógio reiniciado em 3 minutos.';
});

const experiment = document.querySelector('#experimento');
const trialButtons = Array.from(experiment.querySelectorAll('[data-choice]'));
const trialCount = document.querySelector('#trial-count');
const trialStart = document.querySelector('#trial-start');
const trialWindow = document.querySelector('#trial-window');
const trialCost = document.querySelector('#trial-cost');
const trialCaptures = Array.from(experiment.querySelectorAll('[data-capture]'));
const conditionalRecords = Array.from(experiment.querySelectorAll('.conditional-record'));

trialButtons.forEach(button => {
  button.addEventListener('click', () => {
    const choice = button.dataset.choice;
    if (experiment.dataset.trial === choice) return;
    experiment.dataset.trial = choice;
    const extended = choice === 'b';
    trialButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    trialCount.textContent = extended ? '6' : '2';
    trialStart.textContent = extended ? 'T+85 min' : 'T+90 min';
    trialWindow.textContent = extended ? '500 s' : '120 s';
    trialCost.textContent = extended ? '12 créditos' : '6 créditos';
    trialCaptures.forEach(capture => { capture.hidden = capture.dataset.capture !== choice; });

    experiment.getAnimations?.({ subtree: true }).forEach(animation => animation.cancel());
    conditionalRecords.forEach((record, i) => {
      record.querySelector('strong').hidden = !extended;
      record.querySelector('.not-received').hidden = extended;
      if (extended) travel(record.querySelector('strong'), [0, 9, 1.05], [0, 0, 1], 12, softLand, i * 2);
    });
  });
});

const roleButtons = Array.from(document.querySelectorAll('[data-role]'));
const roleNotes = Array.from(document.querySelectorAll('.role-notes p'));
function chooseRole(button) {
  roleButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
  roleNotes.forEach(note => { note.hidden = note.id !== 'role-' + button.dataset.role; });
}
roleButtons.forEach(button => button.addEventListener('click', () => chooseRole(button)));
chooseRole(roleButtons[0]);

if (location.protocol === 'file:') {
  document.querySelectorAll('a[data-online]').forEach(link => { link.href = link.dataset.online; });
}
requestedScene = Math.max(0, sceneFromHash());
displayScene(requestedScene);
paintClock();
document.documentElement.classList.add('pitch-ready');
