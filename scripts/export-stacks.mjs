import fs from 'node:fs/promises';import path from 'node:path';
import '../src/core.js';import '../src/stack-tools.js';
const root=path.resolve(import.meta.dirname,'..');
for(const slug of ['web','is','programmer']){
 const c=JSON.parse(await fs.readFile(path.join(root,'content',slug+'.json'),'utf8'));
 const dir=path.join(root,'files',slug,'stacks');await fs.mkdir(dir,{recursive:true});
 for(const [ui] of ExamStacks.options.ui)for(const [server] of ExamStacks.options.server)for(const [store] of ExamStacks.options.store){
  await fs.writeFile(path.join(dir,`${slug}_${ui}_${server}_${store}.zip`),ExamCore.zip(ExamStacks.files(c,{ui,server,store})));
 }
}
console.log('24 stack archives exported.');
