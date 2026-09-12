const fs=require('node:fs');
const p='src/app.js';let s=fs.readFileSync(p,'utf8');
s=s.replace("${pending||!year.exercise?'disabled':''}>Разбор", "${pending?'disabled':''}>Разбор");
s=s.replace('function article(){',`function article(){
 const task=year.practice?.tasks.find(t=>t.id===module.id);
 if(task&&(!year.exercise||module.id!==year.exercise.moduleId))return \`<article class="article"><span class="section-code">\${year.year} · РАЗБОР ЗАДАНИЯ</span><h2>\${E(task.title)}</h2><p>\${E(task.summary)}</p><div class="rule">Здесь разобраны требования и порядок работы. Готовое решение этого задания пока не добавлено.</div><h3>Как подойти к решению</h3><ol>\${task.hints.map(h=>'<li>'+E(h)+'</li>').join('')}</ol><h3>Что проверить в результате</h3><ul>\${task.checks.map(h=>'<li>'+E(h)+'</li>').join('')}</ul><details><summary>Полное условие задания</summary><p style="white-space:pre-line">\${E(task.text)}</p></details><p>\${sourceLink(year.source.url+'#page='+task.page,'Открыть задание в исходном документе')}</p><a class="btn primary" href="\${E(task.zip)}" download>Скачать исходные материалы</a>\${!year.exercise?'<div class="rule"><p>Готовый учебный пример V00 с кодом и пошаговым решением относится к редакции 2026.</p><button class="btn" id="learn-example-year">Открыть разбор примера · 2026</button></div>':\`<p><button class="btn" data-module="\${E(year.exercise.moduleId)}">Открыть пример с готовым решением</button></p>\`}</article>\`;
`);
s=s.replace('function bind(){',`function bind(){
 const exampleYear=document.getElementById('learn-example-year');if(exampleYear)exampleYear.onclick=()=>change(()=>{year=c.years.find(y=>y.exercise);module=year.modules.find(m=>m.id===year.exercise.moduleId);software=year.exercise.software[0].id;mode='learn';});
`);
s=s.replace("?'Есть учебный пример':'Паспорт модуля'", "?'Есть учебный пример':year.practice?.ready?'Разбор требований':'Паспорт модуля'");
fs.writeFileSync(p,s);
