import fs from 'node:fs/promises';
import path from 'node:path';
import '../src/core.js';
import '../src/content-tools.js';
const root=path.resolve(import.meta.dirname,'..'),exam=process.argv.includes('--exam-ready');
const report=[];let failed=false;
for(const slug of ['web','is','programmer']){
 try{
  const c=JSON.parse(await fs.readFile(path.join(root,'content',slug+'.json'),'utf8'));ExamCore.validateCourse(c,exam);
  const fingerprint=new Set();
  for(const v of c.variants){
   const d=ExamContent.dataFor(c,v);
   for(const t of d.tables)for(const r of t.rows)ExamCore.assert(r.length===t.columns.length,'Неравные столбцы');
   const f=JSON.stringify(d.tables);ExamCore.assert(!fingerprint.has(f),'Повтор данных');fingerprint.add(f);
   if(slug==='is'){
    ExamCore.assert(v.costs.length===3&&v.norms.length===4&&v.quantity.length===2,'Разный размер схемы');
    ExamCore.assert([...v.costs,...v.norms,...v.quantity].every(n=>Number.isFinite(n)&&n>0),'Неверные числа');
   }
   const student=ExamContent.trainingFiles(c,c.years[0],v);
   ExamCore.assert(!Object.keys(student).some(n=>/solution|expected|teacher|private/i.test(n)),'Ответы в учебном архиве');
  }
  report.push({site:slug,status:'passed',variants:fingerprint.size,examReady:false});
 }catch(e){failed=true;report.push({site:slug,status:'blocked',reason:e.message});}
}
console.log(JSON.stringify({profile:exam?'complete-exam-gate':'template',results:report},null,2));
if(failed)process.exitCode=1;
