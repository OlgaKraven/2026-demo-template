import fs from 'node:fs/promises';import path from 'node:path';
import '../src/core.js';import '../src/content-tools.js';
const root=path.resolve(import.meta.dirname,'..');
for(const slug of ['web','is','programmer']){
 const c=JSON.parse(await fs.readFile(path.join(root,'content',slug+'.json'),'utf8')),y=c.years[0];
 const out=path.join(root,'files',slug);await fs.mkdir(out,{recursive:true});
 for(const sw of y.exercise.software){
  const f=ExamContent.solutionFiles(c,y,sw.id),dir=path.join(out,'V00',sw.id);await fs.mkdir(dir,{recursive:true});
  for(const [name,text] of Object.entries(f)){const p=path.join(dir,name);await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,text);}
  await fs.writeFile(path.join(out,slug+'_V00_'+sw.id+'_solution.zip'),ExamCore.zip(f));
 }
 for(const id of ['V01','V30']){
  const v=c.variants.find(v=>v.id===id);
  await fs.writeFile(path.join(out,slug+'_'+id+'_training.zip'),ExamCore.zip(ExamContent.trainingFiles(c,y,v)));
 }
}
console.log('Written V00 solutions and V01/V30 training ZIPs into files/. All 30 variants remain available in each site.');
