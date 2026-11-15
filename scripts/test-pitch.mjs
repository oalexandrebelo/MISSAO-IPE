import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../presentation/pitch/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../presentation/pitch/pitch.js', import.meta.url), 'utf8');

function open(hash = '') {
  const dom = new JSDOM(html, { url: `https://pitch.invalid/presentation/pitch/index.html${hash}`, runScripts: 'outside-only' });
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {} });
  dom.window.scrollTo = () => {};
  dom.window.eval(runtime);
  return dom;
}

test('pitch has six timed scenes and resolves current and shared scene links', () => {
  const dom = open('#webb');
  try {
    const { window } = dom;
    const document = window.document;
    const scenes = [...document.querySelectorAll('.scene')];
    assert.deepEqual(scenes.map(scene => Number(scene.dataset.duration)), [20, 30, 40, 50, 25, 15]);
    assert.deepEqual(scenes.map(scene => scene.id), [...document.querySelectorAll('[data-note]')].map(note => note.dataset.note));
    assert.equal(document.querySelector('.scene:not([hidden])').id, 'solucao');
    window.location.hash = document.querySelector('.skip-link').hash;
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    assert.equal(document.querySelector('.scene:not([hidden])').id, 'solucao');
    assert.equal(document.querySelector('#scene-position').textContent, '3 / 6');
    window.location.hash = '#problema';
    window.dispatchEvent(new window.HashChangeEvent('hashchange'));
    assert.equal(document.querySelector('.scene:not([hidden])').id, 'problema');
  } finally { dom.window.close(); }
});

test('pitch A/B reverses delivery, schedule, cost and missing-record labels together', () => {
  const dom = open('#decisao');
  try {
    const document = dom.window.document;
    document.querySelector('[data-choice="b"]').click();
    assert.equal(document.querySelector('#trial-count').textContent, '6');
    assert.equal(document.querySelector('#trial-start').textContent, 'T+85 min');
    assert.equal(document.querySelector('#trial-window').textContent, '500 s');
    assert.equal(document.querySelector('#trial-cost').textContent, '12 créditos');
    assert.equal(document.querySelectorAll('.conditional-record strong:not([hidden])').length, 4);
    document.querySelector('[data-choice="a"]').click();
    assert.equal(document.querySelector('#trial-count').textContent, '2');
    assert.equal(document.querySelector('#trial-start').textContent, 'T+90 min');
    assert.equal(document.querySelector('#trial-window').textContent, '120 s');
    assert.equal(document.querySelector('#trial-cost').textContent, '6 créditos');
    assert.equal(document.querySelectorAll('.conditional-record strong:not([hidden])').length, 0);
    assert.equal(document.querySelectorAll('.conditional-record .not-received:not([hidden])').length, 4);
  } finally { dom.window.close(); }
});
