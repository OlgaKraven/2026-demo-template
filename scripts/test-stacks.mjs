import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import '../src/stack-tools.js';
const root=path.resolve(import.meta.dirname,'..');
const c=JSON.parse(await fs.readFile(path.join(root,'content/is.json'),'utf8'));
const python=process.env.EXAM_PYTHON||'python';
const report=[];
for(const [ui] of ExamStacks.options.ui)for(const [server] of ExamStacks.options.server)for(const [store] of ExamStacks.options.store){
 const choice={ui,server,store},dir=path.join(root,'reports','stack-runs',`${ui}-${server}-${store}`);
 await fs.mkdir(dir,{recursive:true});
 const files=ExamStacks.files(c,choice);
 for(const [name,content] of Object.entries(files)){const target=path.join(dir,name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,name.startsWith('server.')?content.replaceAll('8080','18641'):content);}
 const child=spawn(server==='python'?python:process.execPath,[server==='python'?'server.py':'server.mjs'],{cwd:dir,windowsHide:true,stdio:['ignore','pipe','pipe']});
 let log='';child.stdout.on('data',d=>log+=d);child.stderr.on('data',d=>log+=d);
 try{
  await new Promise((resolve,reject)=>{const deadline=setTimeout(()=>reject(Error('startup timeout '+log)),5000);child.once('error',reject);child.once('exit',code=>{clearTimeout(deadline);reject(Error('early exit '+code+' '+log));});child.stdout.on('data',()=>{if(log.includes('http://')){clearTimeout(deadline);resolve();}});});
  const r=await fetch('http://127.0.0.1:18641/api/items');assert.equal(r.status,200);assert.deepEqual(await r.json(),c.example.items.map((name,i)=>({id:i+1,name})));
  for(const asset of ['/','/app.js','/style.css'])assert.equal((await fetch('http://127.0.0.1:18641'+asset)).status,200);
  assert.equal((await fetch('http://127.0.0.1:18641/data.json')).status,404);
  report.push({...choice,status:'passed',runtime:server==='node'?process.version:python});
 }finally{child.kill();await new Promise(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',resolve);});}
}
await fs.writeFile(path.join(root,'reports/stack-tests.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
