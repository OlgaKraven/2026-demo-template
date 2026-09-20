import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const source=fs.readFileSync('src/product-tour.js','utf8');
function surface(markup){
 const {window,document}=parseHTML('<html><body><div class="top-tools"></div><nav class="site-nav">Разделы</nav>'+markup+'<footer>Сохраняйте файлы</footer></body></html>');
 window.HTMLElement.prototype.getClientRects=function(){return this.hidden?[]:[{}];};
 window.HTMLElement.prototype.getBoundingClientRect=()=>({left:100,right:300,top:100,bottom:160});
 window.HTMLElement.prototype.scrollIntoView=()=>{};
 window.HTMLElement.prototype.focus=()=>{};
 const sandbox={document,window,innerHeight:900};vm.runInNewContext(source,sandbox);return {document,tour:sandbox.ExamProductTour};
}
test('global and context guides are restored once on each render',()=>{const {document,tour}=surface('<header class="route-heading"></header><div class="training-title"></div><div class="practice-heading"></div><div class="assignment-guide-heading"></div><div class="examples-heading"></div><div id="teacher-actions"></div>');tour.mount();tour.mount();assert.equal(document.querySelectorAll('#product-tour-launch').length,1);for(const name of ['lesson','practice','mock','assignment','downloads','teacher'])assert.equal(document.querySelectorAll('[data-guide="'+name+'"]').length,1);});
test('training guide navigates current controls and never starts a timer',()=>{const {document,tour}=surface('<div class="training-title"></div><div class="training-source"></div><select id="training-variant"></select><div class="assignment-heading"><button id="training-timer-toggle">Начать</button></div><div class="training-stage-list"></div><div class="training-condition"></div><section class="self-check"></section><div class="training-bottom"></div>');let starts=0;document.querySelector('#training-timer-toggle').onclick=()=>starts++;tour.mount();tour.start('practice');let count=0;while(tour.active()&&count++<20)document.querySelector('#tour-next').onclick();assert.ok(count>=6);assert.equal(tour.active(),false);assert.equal(starts,0);assert.equal(document.querySelectorAll('.tour-mark').length,0);});
test('default tour describes the whole site and closes on demand',()=>{const {document,tour}=surface('<div class="route-sidebar"></div>');tour.mount();tour.start();assert.match(document.querySelector('.tour-coach').textContent,/ТУР ПО САЙТУ/);assert.match(document.querySelector('#tour-title').textContent,/как работать/);tour.close();assert.equal(document.querySelector('.tour-coach'),null);});
