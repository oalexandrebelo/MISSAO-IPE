#!/usr/bin/env node
/** Source-only DOM/media state checks. No network, browser, build or global receipt. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';
const html=await fs.readFile(new URL('../web/planet-jumping.html', import.meta.url),'utf8');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function setup(mode='normal',reduced=false,noCanvas=false){
 const errors=[],draws=[],plays=[]; const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://example.test/planet-jumping.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){
  const timer=w.setTimeout.bind(w);w.setTimeout=(f,ms,...a)=>timer(f,Math.max(1,ms*.01),...a);
  Object.defineProperty(w.performance,'now',{value:()=>Date.now()*100});
  w.requestAnimationFrame=cb=>timer(()=>cb(w.performance.now()),4);w.cancelAnimationFrame=w.clearTimeout.bind(w);
  w.matchMedia=query=>Object.assign(new w.EventTarget(),{matches:query.includes('reduced')?reduced:!reduced,media:query});
  w.innerWidth=1440;w.innerHeight=900;w.devicePixelRatio=1;
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
  const ctx={setTransform(){},clearRect(){},fillRect(){},save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},createLinearGradient(){return{addColorStop(){}}},drawImage(media,...args){draws.push({id:media.id,args})}};
  w.HTMLCanvasElement.prototype.getContext=function(){return noCanvas?null:ctx};
  for(const [name,value] of Object.entries({readyState:mode==='unavailable'?0:4,duration:mode==='unavailable'?NaN:3,videoWidth:1920,videoHeight:1080}))Object.defineProperty(name.startsWith('video')?w.HTMLVideoElement.prototype:w.HTMLMediaElement.prototype,name,{get(){return value},configurable:true});
  Object.defineProperty(w.HTMLMediaElement.prototype,'ended',{get(){return false},configurable:true});
  Object.defineProperty(w.HTMLImageElement.prototype,'complete',{get(){return mode!=='unavailable'}});Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get(){return mode==='unavailable'?0:1920}});Object.defineProperty(w.HTMLImageElement.prototype,'naturalHeight',{get(){return 1080}});
  w.HTMLMediaElement.prototype.load=function(){};w.HTMLMediaElement.prototype.pause=function(){};
  w.HTMLMediaElement.prototype.play=function(){plays.push(this.id);if(mode==='rejected')return Promise.reject(new Error('denied'));if(!this.loop&&mode!=='never-ended'){timer(()=>{this.currentTime=3;this.dispatchEvent(new w.Event('ended'))},5)}return Promise.resolve()};
  w.Element.prototype.getBoundingClientRect=function(){if(this.id==='portal')return{x:560,y:200,left:560,top:200,right:880,bottom:550,width:320,height:350};if(this.classList.contains('portal-wrap'))return{left:560,top:170,right:880,bottom:550,width:320,height:380};if(this.classList.contains('planet-content'))return{left:58,top:640,right:1396,bottom:870,width:1338,height:230};if(this.classList.contains('header'))return{left:28,top:28,right:1412,bottom:70,width:1384,height:42};return{left:0,top:0,right:0,bottom:20,width:100,height:20}};
 }});
 return {dom,w:dom.window,d:dom.window.document,errors,draws,plays};
}
let checks=0;
function ok(name){checks++;console.log('PASS',name)}
{
 const s=setup();await wait(150);assert.equal(s.d.querySelector('.experience').dataset.planet,'mars');assert(s.d.body.classList.contains('intro-ready'));assert.equal(s.d.querySelectorAll('.fact').length,4);assert.equal(s.d.querySelectorAll('.planet-item').length,8);assert.equal(s.d.querySelector('.planet-item.active').textContent,'Mars');assert.equal(s.d.querySelector('.portal').getAttribute('aria-disabled'),'false');ok('Initial state, finite preloader and eight-planet sidebar');
 s.d.querySelector('#portal').click();s.d.querySelector('#portal').click();await wait(140);assert.equal(s.d.querySelector('.experience').dataset.planet,'earth');assert.equal(s.d.querySelector('#next-name').textContent,'Venus');assert.equal(s.d.querySelector('#next-number').textContent,'[02]');assert.equal(s.d.querySelector('#planet-title').textContent,'EARTH');assert(s.d.querySelector('#facts').textContent.includes('365.25'));ok('Mars to Earth commits once despite double click');
 s.d.querySelector('#portal').click();await wait(140);assert.equal(s.d.querySelector('.experience').dataset.planet,'venus');assert(s.d.querySelector('#portal').disabled);assert(!s.d.querySelector('#terminal-note').hidden);assert.equal(s.d.querySelector('#next-number').textContent,'[06]');assert.equal(s.d.querySelector('#portal-image').hidden,false);s.d.querySelector('#portal').click();await wait(25);assert.equal(s.d.querySelector('.experience').dataset.planet,'venus');ok('Earth to Venus, Mercury preview and terminal no-op');
 assert(s.draws.some(x=>x.id==='transition-video'));assert(s.draws.some(x=>x.id==='scene-canvas'));const images=s.draws.filter(x=>x.id==='portal-video');assert(images.length);assert(images.every(x=>JSON.stringify(x.args)===JSON.stringify(images[0].args)));ok('Canvas samples viewport cover, transition and frozen scene');
 s.d.querySelector('.menu').click();assert(s.d.querySelector('dialog').open);assert(s.d.querySelector('#information-body').textContent.includes('not a flight simulator'));s.d.querySelector('#close-information').click();assert(!s.d.querySelector('dialog').open);assert.deepEqual(s.errors,[]);ok('Menu works and no script exceptions');s.w.close();
}
for(const mode of ['unavailable','rejected','never-ended']){
 const s=setup(mode);await wait(230);assert(s.d.body.classList.contains('intro-ready'));assert(s.d.querySelector('.media-status').textContent.includes('unavailable'));s.d.querySelector('#portal').click();await wait(220);assert.equal(s.d.querySelector('.experience').dataset.planet,'earth');s.d.querySelector('#portal').click();await wait(220);assert.equal(s.d.querySelector('.experience').dataset.planet,'venus');assert.deepEqual(s.errors,[]);ok(`${mode}: introduction and both trips terminate with an honest message`);s.w.close();
}
{
 const s=setup('normal',true);await wait(80);assert(!s.plays.length);s.d.querySelector('#portal').click();await wait(80);assert.equal(s.d.querySelector('.experience').dataset.planet,'earth');s.d.querySelector('#portal').click();await wait(80);assert.equal(s.d.querySelector('.experience').dataset.planet,'venus');assert(!s.plays.length);assert.deepEqual(s.errors,[]);ok('Reduced motion preserves journey without playing videos');s.w.close();
}
{
 const s=setup('normal',false,true);await wait(140);s.d.querySelector('#portal').click();await wait(130);assert.equal(s.d.querySelector('.experience').dataset.planet,'earth');assert(!s.d.querySelector('#portal').classList.contains('has-media'));assert.deepEqual(s.errors,[]);ok('Canvas unavailable keeps text navigation usable');s.w.close();
}
console.log(`${checks} checks passed; simulated DOM/media only, no browser/GPU/network proof.`);
