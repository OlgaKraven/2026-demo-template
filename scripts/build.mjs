import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import '../src/core.js';
const root=path.resolve(import.meta.dirname,'..');
const files=['index.html','style.css','practice.css','core.js','content-tools.js','stack-tools.js','practice.js','app.js'];
const report=[];
for(const slug of ['web','is','programmer']){
 const course=JSON.parse(await fs.readFile(path.join(root,'content',slug+'.json'),'utf8'));
 ExamCore.validateCourse(course);
 const out=path.join(root,'dist',slug);await fs.mkdir(out,{recursive:true});
 await fs.cp(path.join(root,'practice-assets',slug),path.join(out,'practice'),{recursive:true});
 await fs.cp(path.join(root,'source-documents',slug),path.join(out,'sources'),{recursive:true});
 for(const name of files)await fs.copyFile(path.join(root,'src',name),path.join(out,name));
 await fs.writeFile(path.join(out,'course.js'),'/* One qualification only. Generated; edit content/'+slug+'.json. */\nglobalThis.COURSE = '+JSON.stringify(course,null,2)+';\n');
 const hash=createHash('sha256').update(JSON.stringify(course)).digest('hex');
 await fs.writeFile(path.join(out,'build-info.json'),JSON.stringify({schemaVersion:1,templateVersion:course.templateVersion,courseId:course.id,contentSHA256:hash,status:'working-template-with-demo-exercise',variants:30,completeExam:false},null,2)+'\n');
 report.push({site:slug,course:course.id,variants:course.variants.length,hash});
}
console.log(JSON.stringify({status:'built',sites:report},null,2));
