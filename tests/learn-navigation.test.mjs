import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
for(const slug of ['is','web','programmer'])test(`${slug}: 2027 learn remains available and opens the labeled 2026 example`,()=>{
 const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{toggle(){}},innerHTML:''});return nodes.get(id);};
 const context=vm.createContext({COURSE:JSON.parse(fs.readFileSync(`content/${slug}.json`,'utf8')),TextEncoder,URL,URLSearchParams,Date,console,location:{search:'?mode=learn&year=2027',href:'http://localhost/?mode=learn&year=2027'},localStorage:{getItem(){return null},setItem(){}},history:{replaceState(){}},document:{body:node('body'),getElementById:node,querySelectorAll(){return []}},setInterval(){},addEventListener(){},confirm(){return true}});
 for(const file of ['core.js','content-tools.js','stack-tools.js','practice.js','app.js'])vm.runInContext(fs.readFileSync('src/'+file,'utf8'),context);
 assert.match(node('app').innerHTML,/data-mode="learn"[^>]*>Разбор/);
 assert.doesNotMatch(node('app').innerHTML,/data-mode="learn"[^>]*disabled/);
 assert.match(node('app').innerHTML,/Как подойти к решению/);
 node('learn-example-year').onclick();
 assert.match(node('app').innerHTML,/Разбор решения/);
 assert.match(node('app').innerHTML,/value="2026" selected/);
});
